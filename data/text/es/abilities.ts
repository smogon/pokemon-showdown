// Mechanics desc style (es): official game terminology. el usuario (user), el objetivo
//   (target), efecto secundario, hacer retroceder (flinch), golpe crítico, niveles (stages),
//   problema de estado (status), movimiento multigolpe, prioridad, sustituto, redondeado
//   hacia abajo/arriba. Decimal comma (1,5). Boilerplate shared verbatim — QC one, fix all.
// Cross-references generated from name fields / pokedex-names.ts. CAP entities keep name
//   null (English fallback); descs are translated with English names inline.

export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: "Sin Habilidad", // NEEDS QC
		shortDesc: "No hace nada.", // NEEDS QC
	},
	adaptability: {
		name: "Adaptable",
		// Official flavor text: "Potencia aún más los movimientos cuyo tipo coincida con el suyo."
		desc: "La bonificación por tipo (STAB) de este Pokémon es 2 en lugar de 1,5.", // NEEDS QC
		shortDesc: "Su bonificación por tipo (STAB) es 2 en lugar de 1,5.", // NEEDS QC
	},
	aerilate: {
		name: "Piel Celeste",
		// Official flavor text: "Convierte los movimientos de tipo Normal en tipo Volador y aumenta ligeramente su potencia."
		desc: "Los movimientos de tipo Normal de este Pokémon se convierten en tipo Volador y su potencia se multiplica por 1,2. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, pero antes de los efectos de Cortina Plasma y Electrificación.", // NEEDS QC
		shortDesc: "Sus movimientos de tipo Normal son de tipo Volador y tienen 1,2x de potencia.", // NEEDS QC
		gen6: {
			desc: "Los movimientos de tipo Normal de este Pokémon se convierten en tipo Volador y su potencia se multiplica por 1,3. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, pero antes de los efectos de Cortina Plasma y Electrificación.", // NEEDS QC
			shortDesc: "Los movimientos Normal de este Pokémon pasan a tipo Volador con 1,3x potencia.", // NEEDS QC
		},
	},
	aftermath: {
		name: "Detonación",
		// Official flavor text: "Daña al agresor que le ha dado el golpe de gracia con un movimiento de contacto."
		desc: "Si este Pokémon es debilitado por un movimiento de contacto, el atacante pierde 1/4 de sus PS máximos (redondeado hacia abajo). No se activa si el atacante tiene la habilidad Muro Mágico o si algún Pokémon en combate tiene la habilidad Humedad.", // NEEDS QC
		shortDesc: "Si lo debilita un movimiento de contacto, el atacante pierde 1/4 de sus PS.", // NEEDS QC

		damage: "  ¡{POKEMON} ha resultado herido!",
	},
	airlock: {
		name: "Bucle Aire",
		shortDesc: "Mientras está en combate, se anulan los efectos del clima.", // NEEDS QC

		start: "  Los efectos del tiempo atmosférico se han neutralizado.",
	},
	analytic: {
		name: "Cálculo Final",
		// Official flavor text: "Aumenta la potencia de su movimiento si es el último en atacar."
		desc: "La potencia de los movimientos de este Pokémon se multiplica por 1,3 si es el último en actuar en el turno. No afecta a Deseo Oculto ni a Premonición.", // NEEDS QC
		shortDesc: "Sus ataques tienen 1,3x de potencia si actúa el último del turno.", // NEEDS QC
	},
	angerpoint: {
		name: "Irascible",
		// Official flavor text: "Si recibe un golpe crítico, monta en cólera y sube su Ataque hasta el máximo."
		desc: "Si este Pokémon (no su sustituto) recibe un golpe crítico, su Ataque sube 12 niveles.", // NEEDS QC
		shortDesc: "Si recibe un golpe crítico (no su sustituto), su Ataque sube 12 niveles.", // NEEDS QC
		gen4: {
			desc: "Si este Pokémon o su sustituto recibe un golpe crítico, su Ataque sube 12 niveles.", // NEEDS QC
			shortDesc: "Si este Pokémon o su sustituto recibe un crítico, su Ataque sube 12 niveles.", // NEEDS QC
		},

		boost: "  ¡El Ataque de {POKEMON} ha aumentado al máximo!",
	},
	angershell: {
		name: "Coraza Ira",
		desc: "Cuando este Pokémon tiene más de la mitad de sus PS máximos y un ataque lo deja con la mitad o menos, su Ataque, Ataque Especial y Velocidad suben 1 nivel y su Defensa y Defensa Especial bajan 1 nivel. Este efecto se aplica tras todos los golpes de un movimiento multigolpe. No se activa si la habilidad Potencia Bruta eliminó el efecto secundario del movimiento.", // NEEDS QC
		shortDesc: "Con la mitad o menos de sus PS: +1 Ataque, At. Esp. y Vel., y -1 Def. y Def. Esp.", // NEEDS QC
	},
	anticipation: {
		name: "Anticipación",
		// Official flavor text: "Prevé los movimientos peligrosos del rival."
		desc: "Al entrar en combate, este Pokémon se estremece si algún rival tiene un ataque supereficaz contra él o un movimiento fulminante. Poder Oculto se evalúa con su tipo real; los demás movimientos, con su tipo original.", // NEEDS QC
		shortDesc: "Al entrar, se estremece si un rival tiene un movimiento supereficaz o fulminante.", // NEEDS QC
		gen5: {
			desc: "Al entrar en combate, este Pokémon se alerta si un rival conoce un movimiento de ataque de un tipo supereficaz contra él, o un movimiento fulminante. Este efecto considera los movimientos con su tipo original.", // NEEDS QC
		},
		gen4: {
			desc: "Al entrar en combate, este Pokémon se alerta si un rival conoce un movimiento de ataque de un tipo supereficaz contra él, o un movimiento fulminante si este Pokémon no es inmune a su tipo y el rival no es de menor nivel. Este efecto considera los movimientos con su tipo original. Contraataque, Furia Dragón, Represión Metal, Manto Espejo, Tinieblas, Psicoonda y Movimiento Sísmico no activan este efecto. Antes de la comprobación, considera si este Pokémon lleva Bola Férrea, si está bajo los efectos de Profecía (Rastreo), Gravedad, Arraigo, Gran Ojo o Respiro, y si los rivales tienen las habilidades Normalidad o Intrépido.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} se ha estremecido!",
	},
	arenatrap: {
		name: "Trampa Arena",
		// Official flavor text: "Evita que el rival huya."
		desc: "Impide que los rivales elijan cambiarse, salvo que estén en el aire, lleven Muda Concha o sean de tipo Fantasma.", // NEEDS QC
		shortDesc: "Impide a los rivales cambiarse, salvo que estén en el aire.", // NEEDS QC
		gen6: {
			desc: "Impide que los rivales adyacentes elijan cambiarse, salvo que estén en el aire, lleven Muda Concha o sean de tipo Fantasma.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que los rivales adyacentes elijan cambiarse, salvo que estén en el aire o lleven Muda Concha.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que los rivales elijan cambiarse, salvo que estén en el aire o lleven Muda Concha.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que los rivales elijan cambiarse, salvo que estén en el aire.", // NEEDS QC
		},
	},
	armortail: {
		name: "Cola Armadura",
		desc: "Los movimientos con prioridad de los rivales dirigidos a este Pokémon o a sus aliados no tienen efecto.", // NEEDS QC
		shortDesc: "Protege a este Pokémon y sus aliados de los movimientos con prioridad rivales.", // NEEDS QC

		block: "#damp",
	},
	aromaveil: {
		name: "Velo Aroma",
		// Official flavor text: "Se protege a sí mismo y a sus aliados de ataques que impiden elegir movimientos."
		desc: "Este Pokémon y sus aliados no pueden verse afectados por Atracción, Anulación, Otra Vez, Anticura, Mofa, Tormento.", // NEEDS QC
		shortDesc: "Protege a este Pokémon y sus aliados del enamoramiento, Mofa y más.", // NEEDS QC

		block: "  ¡Velo Aroma ha protegido a {POKEMON}!",
	},
	asone: {
		name: "Unidad Ecuestre",
		shortDesc: "Véase Unidad Ecuestre (Glastrier y Spectrier).", // NEEDS QC

		start: "  ¡{POKEMON} tiene dos habilidades!",
	},
	asoneglastrier: {
		name: "Unidad Ecuestre (Glastrier)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Combinación de las habilidades Nerviosismo y Relincho Blanco.", // NEEDS QC
	},
	asonespectrier: {
		name: "Unidad Ecuestre (Spectrier)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Combinación de las habilidades Nerviosismo y Relincho Negro.", // NEEDS QC
	},
	aurabreak: {
		name: "Rompeaura",
		// Official flavor text: "Invierte los efectos de las auras, por lo que baja la potencia de ciertos movimientos en vez de subirla."
		desc: "Mientras este Pokémon está en combate, los efectos de Aura Oscura y Aura Feérica se invierten y multiplican la potencia por 0,75 en lugar de 1,33.", // NEEDS QC
		shortDesc: "Invierte Aura Oscura y Aura Feérica: el modificador pasa a ser 0,75x.", // NEEDS QC

		start: "  ¡{POKEMON} ha invertido todas las auras!",
	},
	auraguard: {
		name: null, // NEEDS TRANSLATION
		shortDesc: null, // NEEDS TRANSLATION
	},
	baddreams: {
		name: "Mal Sueño",
		// Official flavor text: "Inflige daño a cualquier rival que esté dormido."
		desc: "Al final de cada turno, los rivales dormidos pierden 1/8 de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		shortDesc: "Los rivales dormidos pierden 1/8 de sus PS máximos al final de cada turno.", // NEEDS QC
		gen6: {
			desc: "Los rivales adyacentes dormidos pierden 1/8 de sus PS máximos (redondeado hacia abajo) al final de cada turno.", // NEEDS QC
			shortDesc: "Los rivales adyacentes dormidos pierden 1/8 de sus PS máx. al final del turno.", // NEEDS QC
		},
		gen4: {
			desc: "Al final de cada turno, los rivales dormidos pierden 1/8 de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
			shortDesc: "Los rivales dormidos pierden 1/8 de sus PS máximos al final de cada turno.", // NEEDS QC
		},

		damage: "  ¡{POKEMON} está inmerso en un sueño agitado!",
	},
	ballfetch: {
		name: "Recogebolas",
		shortDesc: "Sin uso competitivo.", // NEEDS QC
	},
	battery: {
		name: "Batería",
		shortDesc: "Los ataques especiales de sus aliados tienen 1,3x de potencia.", // NEEDS QC
	},
	battlearmor: {
		name: "Armadura Batalla",
		shortDesc: "No puede recibir golpes críticos.", // NEEDS QC
	},
	battlebond: {
		name: "Fuerte Afecto",
		// Official flavor text: "Al derrotar a un rival, los vínculos con su Entrenador se refuerzan y se convierte en Greninja Ash. Su Shuriken de Agua también se ve potenciado."
		desc: "Si este Pokémon es un Greninja, su Ataque, Ataque Especial y Velocidad suben 1 nivel si debilita a otro Pokémon con un ataque. Solo puede activarse una vez por combate.", // NEEDS QC
		shortDesc: "Tras debilitar a un Pokémon: +1 Ataque, At. Esp. y Velocidad. Una vez por combate.", // NEEDS QC
		gen8: {
			desc: "Si este Pokémon es un Greninja, se transforma en Greninja Ash si debilita a otro Pokémon con un ataque. Si este Pokémon es Greninja Ash, su Shuriken de Agua tiene 20 de potencia y siempre golpea 3 veces.", // NEEDS QC
			shortDesc: "Tras un KO: se vuelve Greninja Ash. Shuriken de Agua: 20, golpea 3 veces.", // NEEDS QC
		},
		activate: "  ¡{POKEMON} siente la fuerza de vuestro afecto mutuo!",
		transform: "¡{POKEMON} se ha convertido en Greninja Ash!",
	},
	beadsofruin: {
		name: "Abalorio Debacle",
		shortDesc: "La Defensa Esp. de los demás Pokémon en combate se multiplica por 0,75.", // NEEDS QC

		start: "  ¡{POKEMON} ha mermado la Defensa Especial de los demás Pokémon con Abalorio Debacle!",
	},
	beastboost: {
		name: "Ultraimpulso",
		// Official flavor text: "Si derrota a un rival en ese turno, aumenta su característica más fuerte."
		desc: "La característica más alta de este Pokémon sube 1 nivel si debilita a otro Pokémon con un ataque. No se tienen en cuenta los cambios de nivel. En caso de empate, se prioriza Ataque, Defensa, Ataque Especial, Defensa Especial y Velocidad, en ese orden.", // NEEDS QC
		shortDesc: "Su característica más alta sube 1 nivel si debilita a otro Pokémon.", // NEEDS QC
	},
	berserk: {
		name: "Cólera",
		// Official flavor text: "Aumenta su Ataque Especial si sus PS se ven reducidos a la mitad debido a algún ataque."
		desc: "Cuando este Pokémon tiene más de la mitad de sus PS máximos y un ataque lo deja con la mitad o menos, su Ataque Especial sube 1 nivel. Este efecto se aplica tras todos los golpes de un movimiento multigolpe. No se activa si la habilidad Potencia Bruta eliminó el efecto secundario del movimiento.", // NEEDS QC
		shortDesc: "Su Ataque Esp. sube 1 nivel al quedar con la mitad o menos de sus PS.", // NEEDS QC
	},
	bigpecks: {
		name: "Sacapecho",
		shortDesc: "Otros Pokémon no pueden bajarle la Defensa.", // NEEDS QC
	},
	blaze: {
		name: "Mar Llamas",
		// Official flavor text: "Potencia sus movimientos de tipo Fuego cuando le quedan pocos PS."
		desc: "Cuando este Pokémon tiene 1/3 o menos de sus PS máximos (redondeado hacia abajo), su característica ofensiva se multiplica por 1,5 al usar un ataque de tipo Fuego.", // NEEDS QC
		shortDesc: "Con 1/3 o menos de sus PS, sus ataques de Fuego usan 1,5x su característica ofensiva.", // NEEDS QC
		gen4: {
			desc: "Cuando este Pokémon tiene 1/3 o menos de sus PS máximos (redondeado hacia abajo), la potencia de sus ataques de tipo Fuego se multiplica por 1,5.", // NEEDS QC
			shortDesc: "Con 1/3 o menos de sus PS máx., sus ataques de Fuego tienen 1,5x potencia.", // NEEDS QC
		},
	},
	bulletproof: {
		name: "Antibalas",
		shortDesc: "Es inmune a los movimientos de balas y bombas.", // NEEDS QC
	},
	cheekpouch: {
		name: "Carrillo",
		// Official flavor text: "Recupera PS al comer cualquier baya."
		desc: "Si este Pokémon come una baya que lleva, recupera 1/3 de sus PS máximos (redondeado hacia abajo) además del efecto de la baya. También puede activarse tras los efectos de Picadura, Lanzamiento, Picoteo, Atiborramiento, Hora del Té si la baya comida le hizo efecto.", // NEEDS QC
		shortDesc: "Al comer una baya, además recupera 1/3 de sus PS máximos.", // NEEDS QC
		gen7: {
			desc: "Si este Pokémon come una baya que lleva, recupera 1/3 de sus PS máximos (redondeado hacia abajo) además del efecto de la baya. Este efecto también puede activarse tras Picadura, Lanzamiento y Picoteo si la baya comida tiene efecto sobre este Pokémon.", // NEEDS QC
		},
	},
	chillingneigh: {
		name: "Relincho Blanco",
		// Official flavor text: "Al derrotar a un objetivo, emite un relincho gélido y aumenta su Ataque."
		desc: "El Ataque de este Pokémon sube 1 nivel si debilita a otro Pokémon con un ataque.", // NEEDS QC
		shortDesc: "Su Ataque sube 1 nivel si debilita a otro Pokémon.", // NEEDS QC
	},
	chlorophyll: {
		name: "Clorofila",
		// Official flavor text: "Sube su Velocidad cuando hace sol."
		desc: "Si hace sol, la Velocidad de este Pokémon se duplica. No se activa si lleva Parasol Multiuso.", // NEEDS QC
		shortDesc: "Si hace sol, su Velocidad se duplica.", // NEEDS QC
		gen7: {
			desc: "Con sol, la Velocidad de este Pokémon se duplica.", // NEEDS QC
		},
	},
	clearbody: {
		name: "Cuerpo Puro",
		shortDesc: "Otros Pokémon no pueden bajarle las características.", // NEEDS QC
	},
	cloudnine: {
		name: "Aclimatación",
		shortDesc: "Mientras está en combate, se anulan los efectos del clima.", // NEEDS QC

		start: "#airlock",
	},
	colorchange: {
		name: "Cambio Color",
		// Official flavor text: "Adopta el tipo del último movimiento del que es blanco."
		desc: "El tipo de este Pokémon cambia al tipo del último movimiento que lo golpeó, salvo que ya tenga ese tipo. Este efecto se aplica tras todos los golpes de un movimiento multigolpe. No se activa si la habilidad Potencia Bruta eliminó el efecto secundario del movimiento.", // NEEDS QC
		shortDesc: "Su tipo cambia al del movimiento que lo golpea, salvo que ya lo tenga.", // NEEDS QC
		gen4: {
			desc: "El tipo de este Pokémon pasa a ser el del último movimiento que lo golpeó, salvo que ya sea de ese tipo. Este efecto se aplica tras cada golpe de un multigolpe. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
		},
	},
	comatose: {
		name: "Letargo Perenne",
		// Official flavor text: "No despierta jamás de su profundo letargo e incluso ataca dormido."
		desc: "Este Pokémon se considera dormido y no puede sufrir problemas de estado ni verse afectado por Bostezo.", // NEEDS QC
		shortDesc: "No puede sufrir problemas de estado y se considera dormido.", // NEEDS QC

		start: "  ¡{POKEMON} está sumido en un profundo letargo!",
	},
	commander: {
		name: "Comandar",
		desc: "Si este Pokémon es un Tatsugiri y hay un Dondozo aliado en combate, se mete en su boca. Todas las características del Dondozo suben 2 niveles. Durante el efecto, el Dondozo no puede cambiarse, este Pokémon no puede actuar y los ataques dirigidos a él fallan, aunque sigue recibiendo daño indirecto. Si este Pokémon se debilita, puede entrar un sustituto, pero el Dondozo sigue sin poder cambiarse. Si el Dondozo se debilita, este Pokémon recupera la capacidad de actuar.", // NEEDS QC
		shortDesc: "Con un Dondozo aliado: entra en su boca y este gana +2 en todo.", // NEEDS QC

		activate: "  ¡{POKEMON} ha sido engullido por {TARGET} y se ha convertido en su comandante!",
	},
	competitive: {
		name: "Tenacidad",
		// Official flavor text: "Aumenta mucho su Ataque Especial cuando el rival le baja cualquiera de sus características."
		desc: "El Ataque Especial de este Pokémon sube 2 niveles por cada característica que le baje un rival.", // NEEDS QC
		shortDesc: "Su Ataque Esp. sube 2 niveles por cada característica que le baje un rival.", // NEEDS QC
	},
	compoundeyes: {
		name: "Ojo Compuesto",
		shortDesc: "La precisión de sus movimientos se multiplica por 1,3.", // NEEDS QC
	},
	contrary: {
		name: "Respondón",
		shortDesc: "Las subidas de características se invierten en bajadas, y viceversa.", // NEEDS QC
		gen7: {
			desc: "Las características de este Pokémon bajan en lugar de subir, y viceversa. Esta habilidad no afecta a las subidas por efectos del Poder Z antes de usar un movimiento Z.", // NEEDS QC
		},
		gen6: {
			desc: "Las características de este Pokémon bajan en lugar de subir, y viceversa.", // NEEDS QC
		},
	},
	corrosion: {
		name: "Corrosión",
		shortDesc: "Puede envenenar a cualquier Pokémon sin importar sus tipos.", // NEEDS QC
	},
	costar: {
		name: "Unísono",
		shortDesc: "Al entrar, copia los cambios de características de su aliado.", // NEEDS QC
	},
	cottondown: {
		name: "Pelusa",
		// Official flavor text: "Al ser alcanzado por un ataque, suelta una pelusa de algodón que reduce la Velocidad de todos los demás Pokémon."
		desc: "Cuando este Pokémon recibe un ataque, la Velocidad de todos los demás Pokémon del campo baja 1 nivel.", // NEEDS QC
		shortDesc: "Si lo golpean, baja 1 nivel la Velocidad de todos los demás Pokémon.", // NEEDS QC
	},
	cudchew: {
		name: "Rumia",
		shortDesc: "Si come una baya, vuelve a comerla al final del turno siguiente.", // NEEDS QC
	},
	curiousmedicine: {
		name: "Medicina Extraña",
		shortDesc: "Al entrar, elimina los cambios de características de sus aliados.", // NEEDS QC
	},
	cursedbody: {
		name: "Cuerpo Maldito",
		// Official flavor text: "Puede anular el movimiento usado en su contra."
		desc: "Si este Pokémon recibe un ataque, hay un 30% de probabilidad de que ese movimiento quede anulado (Anulación), salvo que el atacante ya tenga un movimiento anulado.", // NEEDS QC
		shortDesc: "Si lo golpea un ataque, 30% de probabilidad de anular ese movimiento.", // NEEDS QC
	},
	cutecharm: {
		name: "Gran Encanto",
		// Official flavor text: "Puede causar enamoramiento al rival que lo toque."
		desc: "Los Pokémon del sexo opuesto que hagan contacto con este Pokémon tienen un 30% de probabilidad de quedar enamorados.", // NEEDS QC
		shortDesc: "30% de enamorar a los Pokémon del sexo opuesto que hagan contacto.", // NEEDS QC
		gen4: {
			desc: "Hay un 30% de probabilidad de que un Pokémon del sexo opuesto que haga contacto con este Pokémon quede enamorado. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
		},
		gen3: {
			desc: "Hay 1/3 de probabilidad de que un Pokémon del sexo opuesto que haga contacto con este Pokémon quede enamorado. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
			shortDesc: "1/3 de probabilidad de enamorar al sexo opuesto al hacer contacto.", // NEEDS QC
		},
	},
	damp: {
		name: "Humedad",
		// Official flavor text: "Aumenta la humedad del entorno y evita que se puedan utilizar movimientos explosivos, tales como Autodestrucción."
		desc: "Mientras este Pokémon está en combate, Explosión, Cabeza Sorpresa, Bruma Explosiva, Autodestrucción y la habilidad Detonación no tienen efecto.", // NEEDS QC
		shortDesc: "Impide Explosión, Autodestrucción y Detonación mientras está en combate.", // NEEDS QC
		gen7: {
			desc: "Mientras este Pokémon está en combate, Explosión, Cabeza Sorpresa, Autodestrucción y la habilidad Detonación no tienen efecto.", // NEEDS QC
			shortDesc: "Impide Explosión/Cabeza Sorpresa/Autodestrucción/Detonación mientras está activo.", // NEEDS QC
		},
		gen6: {
			desc: "Mientras este Pokémon está en combate, Explosión, Autodestrucción y la habilidad Detonación no tienen efecto.", // NEEDS QC
			shortDesc: "Impide Explosión/Autodestrucción/Detonación mientras está activo.", // NEEDS QC
		},
		gen3: {
			desc: "Mientras este Pokémon está en combate, Explosión y Autodestrucción no tienen efecto.", // NEEDS QC
			shortDesc: "Impide Explosión y Autodestrucción mientras está activo.", // NEEDS QC
		},

		block: "  ¡{SOURCE} no puede usar {MOVE}!",
	},
	dancer: {
		name: "Pareja de Baile",
		// Official flavor text: "Puede copiar inmediatamente cualquier movimiento de baile que haya usado otro Pokémon presente en el combate."
		desc: "Cuando otro Pokémon usa un movimiento de baile, este Pokémon usa el mismo movimiento. El movimiento copiado está sujeto a todos los efectos que pueden impedir un movimiento. Un movimiento usado mediante esta habilidad no puede ser copiado de nuevo por otros Pokémon con esta habilidad.", // NEEDS QC
		shortDesc: "Cuando otro Pokémon usa un movimiento de baile, este lo usa también.", // NEEDS QC
	},
	darkaura: {
		name: "Aura Oscura",
		// Official flavor text: "Aumenta la potencia de todos los movimientos de tipo Siniestro."
		desc: "Mientras este Pokémon está en combate, la potencia de los movimientos de tipo Siniestro usados por cualquier Pokémon se multiplica por 1,33.", // NEEDS QC
		shortDesc: "Los movimientos de tipo Siniestro de todos tienen 1,33x de potencia.", // NEEDS QC

		start: "  ¡{POKEMON} irradia un aura oscura!",
	},
	dauntlessshield: {
		name: "Escudo Recio",
		shortDesc: "Al entrar, su Defensa sube 1 nivel. Una vez por combate.", // NEEDS QC
		gen8: {
			shortDesc: "Al entrar, su Defensa sube 1 nivel.", // NEEDS QC
		},
	},
	dazzling: {
		name: "Cuerpo Vívido",
		// Official flavor text: "Desconcierta al rival y le impide utilizar movimientos con prioridad en su contra."
		desc: "Los movimientos con prioridad de los rivales dirigidos a este Pokémon o a sus aliados no tienen efecto.", // NEEDS QC
		shortDesc: "Protege a este Pokémon y sus aliados de los movimientos con prioridad rivales.", // NEEDS QC

		block: "#damp",
	},
	defeatist: {
		name: "Flaqueza",
		// Official flavor text: "Se debilita tanto cuando sus PS se ven reducidos a la mitad que su Ataque y su Ataque Especial bajan."
		desc: "Mientras este Pokémon tiene la mitad o menos de sus PS máximos, su Ataque y su Ataque Especial se reducen a la mitad.", // NEEDS QC
		shortDesc: "Con la mitad o menos de sus PS, su Ataque y Ataque Esp. se reducen a la mitad.", // NEEDS QC
	},
	defiant: {
		name: "Competitivo",
		// Official flavor text: "Sube mucho su Ataque cuando el rival le baja las características."
		desc: "El Ataque de este Pokémon sube 2 niveles por cada característica que le baje un rival.", // NEEDS QC
		shortDesc: "Su Ataque sube 2 niveles por cada característica que le baje un rival.", // NEEDS QC
	},
	deltastream: {
		name: "Ráfaga Delta",
		// Official flavor text: "Altera el clima para anular las vulnerabilidades del tipo Volador."
		desc: "Al entrar en combate, comienzan las turbulencias misteriosas, que eliminan las debilidades del tipo Volador. Este clima dura hasta que esta habilidad deje de estar activa en combate o el clima cambie por las habilidades Tierra del Ocaso o Mar del Albor.", // NEEDS QC
		shortDesc: "Al entrar, empiezan turbulencias que duran mientras la habilidad esté activa.", // NEEDS QC
	},
	desolateland: {
		name: "Tierra del Ocaso",
		// Official flavor text: "Altera el clima para anular los ataques de tipo Agua."
		desc: "Al entrar en combate, la luz solar se vuelve extremadamente intensa: incluye todos los efectos del sol e impide ejecutar ataques de tipo Agua. Este clima dura hasta que esta habilidad deje de estar activa en combate o el clima cambie por las habilidades Ráfaga Delta o Mar del Albor.", // NEEDS QC
		shortDesc: "Al entrar, empieza una luz solar extrema que dura mientras la habilidad esté activa.", // NEEDS QC
	},
	disguise: {
		name: "Disfraz",
		// Official flavor text: "Puede eludir un ataque valiéndose de la tela que le cubre el cuerpo una vez por combate."
		desc: "Si este Pokémon es un Mimikyu, el primer golpe que recibe en combate hace 0 de daño. Después, su disfraz se rompe, cambia a la Forma Descubierta y pierde 1/8 de sus PS máximos. El daño por confusión también rompe el disfraz.", // NEEDS QC
		shortDesc: "(Solo Mimikyu) Bloquea el primer golpe y pierde 1/8 de sus PS en su lugar.", // NEEDS QC
		gen7: {
			desc: "Si este Pokémon es un Mimikyu, el primer golpe que recibe en combate hace 0 de daño. Después, su disfraz se rompe y cambia a la Forma Descubierta. El daño por confusión también rompe el disfraz.", // NEEDS QC
			shortDesc: "(Solo Mimikyu) El primer golpe recibido hace 0 de daño y rompe el disfraz.", // NEEDS QC
		},

		block: "  ¡El disfraz ha actuado como señuelo!",
		transform: "¡El disfraz de {POKEMON} se ha roto!",
	},
	download: {
		name: "Descarga",
		// Official flavor text: "Compara la Defensa y la Defensa Especial del rival para ver cuál es inferior y aumenta su propio Ataque o Ataque Especial según sea lo más eficaz."
		desc: "Al entrar en combate, el Ataque o el Ataque Especial de este Pokémon sube 1 nivel según la defensa combinada más débil de los rivales: sube el Ataque si su Defensa es menor y el Ataque Especial si su Defensa Especial es igual o menor.", // NEEDS QC
		shortDesc: "Al entrar, +1 Ataque o Ataque Esp. según la defensa más débil de los rivales.", // NEEDS QC
	},
	dragonize: {
		name: "Piel Dragontina",
		desc: "Los movimientos de tipo Normal de este Pokémon se convierten en tipo Dragón y su potencia se multiplica por 1,2. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, pero antes de los efectos de Cortina Plasma y Electrificación.", // NEEDS QC
		shortDesc: "Sus movimientos de tipo Normal son de tipo Dragón y tienen 1,2x de potencia.", // NEEDS QC
	},
	dragonsmaw: {
		name: "Mandíbula Dragón",
		shortDesc: "Sus ataques de tipo Dragón usan 1,5x su característica ofensiva.", // NEEDS QC
	},
	drizzle: {
		name: "Llovizna",
		shortDesc: "Al entrar en combate, invoca la lluvia.", // NEEDS QC
	},
	drought: {
		name: "Sequía",
		shortDesc: "Al entrar en combate, invoca el sol.", // NEEDS QC
	},
	dryskin: {
		name: "Piel Seca",
		// Official flavor text: "Pierde PS si hace sol y los recupera si llueve o recibe un movimiento de tipo Agua. Los movimientos de tipo Fuego, por su parte, le hacen más daño de lo normal."
		desc: "Este Pokémon es inmune a los movimientos de tipo Agua y recupera 1/4 de sus PS máximos (redondeado hacia abajo) al ser golpeado por uno. La potencia de los movimientos de tipo Fuego contra él se multiplica por 1,25. Al final de cada turno, recupera 1/8 de sus PS máximos si llueve y pierde 1/8 si hace sol. Los efectos del clima no se activan si lleva Parasol Multiuso.", // NEEDS QC
		shortDesc: "El Agua lo cura 1/4 y la lluvia 1/8; el Fuego le hace 1,25x y el sol le quita 1/8.", // NEEDS QC
		gen7: {
			desc: "Este Pokémon es inmune a los movimientos de tipo Agua y recupera 1/4 de sus PS máximos (redondeado hacia abajo) al recibir uno. La potencia de los movimientos de tipo Fuego contra él se multiplica por 1,25. Al final de cada turno, recupera 1/8 de sus PS máximos (redondeado hacia abajo) con lluvia y pierde 1/8 (redondeado hacia abajo) con sol.", // NEEDS QC
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "Madrugar",
		shortDesc: "Su contador de sueño baja de 2 en 2 en lugar de 1 en 1.", // NEEDS QC
	},
	eartheater: {
		name: "Geofagia",
		desc: "Este Pokémon es inmune a los movimientos de tipo Tierra y recupera 1/4 de sus PS máximos (redondeado hacia abajo) al ser golpeado por uno.", // NEEDS QC
		shortDesc: "Inmune al tipo Tierra: recupera 1/4 de sus PS si lo golpea uno.", // NEEDS QC
	},
	eelevate: {
		name: "Impulso Anguila",
		desc: "Este Pokémon es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas, Red Viscosa y la habilidad Trampa Arena. Los efectos de Gravedad, Arraigo, Antiaéreo, Mil Flechas y Bola Férrea anulan la inmunidad. Mil Flechas puede golpearlo como si no tuviera esta habilidad. La característica más alta de este Pokémon sube 1 nivel si debilita a otro Pokémon con un ataque. No se tienen en cuenta los cambios de nivel. En caso de empate, se prioriza Ataque, Defensa, Ataque Especial, Defensa Especial y Velocidad, en ese orden.", // NEEDS QC
		shortDesc: "Inmune al tipo Tierra; +1 a su mejor característica si debilita a otro Pokémon.", // NEEDS QC
	},
	effectspore: {
		name: "Efecto Espora",
		// Official flavor text: "Puede dormir, envenenar o paralizar al Pokémon con el que entre en contacto al recibir un ataque."
		desc: "Los Pokémon que hagan contacto con este Pokémon tienen un 30% de probabilidad de quedar envenenados, paralizados o dormidos.", // NEEDS QC
		shortDesc: "30% de envenenar, paralizar o dormir a quien haga contacto.", // NEEDS QC
		gen4: {
			desc: "30% de probabilidad de que un Pokémon que haga contacto con este Pokémon quede envenenado, paralizado o dormido. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
		},
		gen3: {
			desc: "10% de probabilidad de que un Pokémon que haga contacto con este Pokémon quede envenenado, paralizado o dormido. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
			shortDesc: "10% de probabilidad de veneno/parálisis/sueño al contacto.", // NEEDS QC
		},
	},
	electricsurge: {
		name: "Electrogénesis",
		shortDesc: "Al entrar en combate, crea un campo eléctrico.", // NEEDS QC
	},
	electromorphosis: {
		name: "Dinamo",
		shortDesc: "Obtiene el efecto de Carga al recibir un golpe.", // NEEDS QC

		start: "  ¡{POKEMON} se ha cargado de electricidad gracias a {MOVE}!",
	},
	embodyaspectcornerstone: {
		name: "Evocarrecuerdos (Cimiento)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Al entrar, su Defensa sube 1 nivel.", // NEEDS QC

		boost: "  ¡{POKEMON} ha hecho brillar la Máscara Cimiento y ha aumentado su Defensa!",
	},
	embodyaspecthearthflame: {
		name: "Evocarrecuerdos (Horno)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Al entrar, su Ataque sube 1 nivel.", // NEEDS QC

		boost: "  ¡{POKEMON} ha hecho brillar la Máscara Horno y ha aumentado su Ataque!",
	},
	embodyaspectteal: {
		name: "Evocarrecuerdos (Turquesa)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Al entrar, su Velocidad sube 1 nivel.", // NEEDS QC

		boost: "  ¡{POKEMON} ha hecho brillar la Máscara Turquesa y ha aumentado su Velocidad!",
	},
	embodyaspectwellspring: {
		name: "Evocarrecuerdos (Fuente)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Al entrar, su Defensa Esp. sube 1 nivel.", // NEEDS QC

		boost: "  ¡{POKEMON} ha hecho brillar la Máscara Fuente y ha aumentado su Defensa Especial!",
	},
	emergencyexit: {
		name: "Retirada",
		// Official flavor text: "Abandona el terreno de combate cuando sus PS se ven reducidos a la mitad para evitar males mayores."
		desc: "Cuando este Pokémon tiene más de la mitad de sus PS máximos y el daño lo deja con la mitad o menos, se cambia inmediatamente por un aliado elegido. Este efecto se aplica tras todos los golpes de un movimiento multigolpe. No se activa si la habilidad Potencia Bruta eliminó el efecto secundario del movimiento. Se activa con daño directo e indirecto, salvo el coste de Maldición y Sustituto, Tambor, Divide Dolor y el daño por confusión.", // NEEDS QC
		shortDesc: "Se cambia al quedar con la mitad o menos de sus PS máximos.", // NEEDS QC
	},
	fairyaura: {
		name: "Aura Feérica",
		// Official flavor text: "Aumenta la potencia de todos los movimientos de tipo Hada."
		desc: "Mientras este Pokémon está en combate, la potencia de los movimientos de tipo Hada usados por cualquier Pokémon se multiplica por 1,33.", // NEEDS QC
		shortDesc: "Los movimientos de tipo Hada de todos tienen 1,33x de potencia.", // NEEDS QC

		start: "  ¡{POKEMON} irradia un aura feérica!",
	},
	filter: {
		name: "Filtro",
		shortDesc: "Recibe 3/4 del daño de los ataques supereficaces.", // NEEDS QC
	},
	firemane: {
		name: "Crin de Fuego",
		shortDesc: "Sus ataques de tipo Fuego usan 1,5x su característica ofensiva.", // NEEDS QC
	},
	flamebody: {
		name: "Cuerpo Llama",
		shortDesc: "30% de quemar a quien haga contacto.", // NEEDS QC
		gen4: {
			desc: "30% de probabilidad de que un Pokémon que haga contacto con este Pokémon quede quemado. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
		},
		gen3: {
			desc: "1/3 de probabilidad de que un Pokémon que haga contacto con este Pokémon quede quemado. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
			shortDesc: "1/3 de probabilidad de quemar a quien haga contacto.", // NEEDS QC
		},
	},
	flareboost: {
		name: "Ímpetu Ardiente",
		// Official flavor text: "Aumenta la potencia de sus ataques especiales cuando sufre quemaduras."
		desc: "Mientras este Pokémon está quemado, la potencia de sus ataques especiales se multiplica por 1,5.", // NEEDS QC
		shortDesc: "Si está quemado, sus ataques especiales tienen 1,5x de potencia.", // NEEDS QC
	},
	flashfire: {
		name: "Absorbe Fuego",
		// Official flavor text: "Si le alcanza algún movimiento de tipo Fuego, potencia sus propios movimientos de dicho tipo."
		desc: "Este Pokémon es inmune a los movimientos de tipo Fuego. La primera vez que uno lo golpea, su característica ofensiva se multiplica por 1,5 al usar ataques de tipo Fuego mientras siga en combate con esta habilidad. Si está congelado, los ataques de tipo Fuego no pueden descongelarlo.", // NEEDS QC
		shortDesc: "Inmune al Fuego: sus ataques de Fuego mejoran 1,5x si lo golpea uno.", // NEEDS QC
		gen4: {
			desc: "Este Pokémon es inmune a los movimientos de tipo Fuego mientras no esté congelado. La primera vez que uno lo golpea, el daño de sus ataques de tipo Fuego se multiplica por 1,5 mientras siga en combate con esta habilidad.", // NEEDS QC
		},
		gen3: {
			desc: "Este Pokémon es inmune a los movimientos de tipo Fuego mientras no esté congelado. La primera vez que uno lo golpea, el daño de sus ataques de tipo Fuego se multiplica por 1,5 mientras siga en combate con esta habilidad. Si este Pokémon tiene un problema de estado, es de tipo Fuego o tiene un sustituto, Fuego Fatuo no activa esta habilidad.", // NEEDS QC
		},

		start: "  ¡La potencia de los movimientos de tipo Fuego de {POKEMON} ha aumentado!",
	},
	flowergift: {
		name: "Don Floral",
		// Official flavor text: "Si hace sol, aumenta su Ataque y su Defensa Especial, así como los de sus aliados."
		desc: "Si este Pokémon es un Cherrim y hace sol, cambia a la Forma Soleada y el Ataque y la Defensa Especial de él y de sus aliados se multiplican por 1,5. Estos efectos no se activan si lleva Parasol Multiuso.", // NEEDS QC
		shortDesc: "(Cherrim) Con sol: su Ataque y Def. Esp. y los de sus aliados son 1,5x.", // NEEDS QC
		gen7: {
			desc: "Si este Pokémon es un Cherrim y hay sol, cambia a la Forma Soleada, y el Ataque y la Defensa Especial de él y sus aliados se multiplican por 1,5.", // NEEDS QC
		},
		gen4: {
			desc: "Con sol, el Ataque y la Defensa Especial de este Pokémon y sus aliados se multiplican por 1,5.", // NEEDS QC
			shortDesc: "Con sol: Ataque y Def. Esp. de este Pokémon y sus aliados x1,5.", // NEEDS QC
		},
	},
	flowerveil: {
		name: "Velo Flor",
		// Official flavor text: "Evita que los Pokémon de tipo Planta aliados sufran problemas de estado o que les bajen sus características."
		desc: "Los Pokémon de tipo Planta del equipo de este Pokémon no pueden ver reducidas sus características ni sufrir problemas de estado por causa de otros Pokémon.", // NEEDS QC
		shortDesc: "Sus aliados de tipo Planta no sufren bajadas de características ni estados.", // NEEDS QC

		block: "  ¡Velo Flor ha protegido a {POKEMON}!",
	},
	fluffy: {
		name: "Peluche",
		// Official flavor text: "Reduce a la mitad el daño provocado por los movimientos de contacto, pero duplica el infligido por los de tipo Fuego."
		desc: "Este Pokémon recibe la mitad de daño de los movimientos de contacto, pero el doble de daño de los movimientos de tipo Fuego.", // NEEDS QC
		shortDesc: "Recibe la mitad de daño por contacto, pero el doble del tipo Fuego.", // NEEDS QC
	},
	forecast: {
		name: "Predicción",
		// Official flavor text: "Cambia a tipo Agua, Fuego o Hielo en función del tiempo atmosférico."
		desc: "Si este Pokémon es un Castform, su tipo cambia según el clima actual, salvo con tormenta de arena. No se activa si lleva Parasol Multiuso y llueve o hace sol.", // NEEDS QC
		shortDesc: "El tipo de Castform cambia con el clima (salvo tormenta de arena).", // NEEDS QC
		gen7: {
			desc: "Si este Pokémon es un Castform, su tipo cambia según el clima, salvo tormenta de arena.", // NEEDS QC
		},
	},
	forewarn: {
		name: "Alerta",
		// Official flavor text: "Indica el movimiento más potente del rival al entrar en combate."
		desc: "Al entrar en combate, este Pokémon conoce al azar el movimiento de mayor potencia de un rival. Para ello, los movimientos fulminantes cuentan como potencia 150; Contraataque, Manto Espejo, Represión Metal como 120; los demás ataques de potencia variable como 80; y los movimientos de estado como 1.", // NEEDS QC
		shortDesc: "Al entrar, conoce el movimiento de mayor potencia de los rivales.", // NEEDS QC
		gen4: {
			desc: "Al entrar en combate, este Pokémon descubre al azar el movimiento de mayor potencia que conoce un rival. Este efecto considera los movimientos fulminantes con 150 de potencia, Contraataque, Manto Espejo y Represión Metal con 120, y cualquier otro movimiento de ataque sin potencia fija con 80.", // NEEDS QC
		},

		activate: "  ¡Se ha detectado el movimiento {MOVE} de {TARGET}!",
		activateNoTarget: "  ¡Alerta de {POKEMON} detectó {MOVE}!",
	},
	friendguard: {
		name: "Compiescolta",
		shortDesc: "Sus aliados reciben 3/4 del daño de los ataques de otros Pokémon.", // NEEDS QC
	},
	frisk: {
		name: "Cacheo",
		shortDesc: "Al entrar, identifica los objetos de todos los rivales.", // NEEDS QC
		gen5: {
			shortDesc: "Al entrar, identifica el objeto de un rival al azar.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} ha cacheado a {TARGET} y ha hallado {ITEM:indefinite:classified}!",
		activateNoTarget: "  ¡{POKEMON} ha cacheado a su rival y ha encontrado {ITEM}!",
	},
	fullmetalbody: {
		name: "Guardia Metálica",
		shortDesc: "Otros Pokémon no pueden bajarle las características.", // NEEDS QC
	},
	furcoat: {
		name: "Pelaje Recio",
		shortDesc: "Su Defensa se duplica.", // NEEDS QC
	},
	galewings: {
		name: "Alas Vendaval",
		shortDesc: "Con todos sus PS, sus movimientos de tipo Volador tienen prioridad +1.", // NEEDS QC
		gen6: {
			shortDesc: "Los movimientos de tipo Volador de este Pokémon tienen +1 prioridad.", // NEEDS QC
		},
	},
	galvanize: {
		name: "Piel Eléctrica",
		// Official flavor text: "Convierte los movimientos de tipo Normal en tipo Eléctrico y aumenta ligeramente su potencia."
		desc: "Los movimientos de tipo Normal de este Pokémon se convierten en tipo Eléctrico y su potencia se multiplica por 1,2. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, pero antes de los efectos de Cortina Plasma y Electrificación.", // NEEDS QC
		shortDesc: "Sus movimientos de tipo Normal son de tipo Eléctrico y tienen 1,2x de potencia.", // NEEDS QC
	},
	gluttony: {
		name: "Gula",
		// Official flavor text: "Cuando sus PS se ven reducidos a la mitad, engulle la baya que normalmente solo se comería cuando le quedasen pocos PS."
		desc: "Este Pokémon come las bayas que normalmente se activan con 1/4 o menos de sus PS máximos cuando tiene la mitad o menos.", // NEEDS QC
		shortDesc: "Come las bayas de 1/4 de PS cuando tiene la mitad o menos.", // NEEDS QC
	},
	goodasgold: {
		name: "Cuerpo Áureo",
		shortDesc: "Es inmune a los movimientos de estado.", // NEEDS QC
	},
	gooey: {
		name: "Baba",
		shortDesc: "Baja 1 nivel la Velocidad de quien haga contacto.", // NEEDS QC
	},
	gorillatactics: {
		name: "Monotema",
		// Official flavor text: "Potencia su Ataque, pero solo puede usar el primer movimiento escogido."
		desc: "El Ataque de este Pokémon se multiplica por 1,5, pero solo puede usar el primer movimiento que ejecute. Estos efectos no se aplican mientras está dinamaxeado.", // NEEDS QC
		shortDesc: "Su Ataque es 1,5x, pero solo puede usar su primer movimiento.", // NEEDS QC
	},
	grasspelt: {
		name: "Manto Frondoso",
		shortDesc: "En campo de hierba, su Defensa se multiplica por 1,5.", // NEEDS QC
	},
	grassysurge: {
		name: "Herbogénesis",
		shortDesc: "Al entrar en combate, crea un campo de hierba.", // NEEDS QC
	},
	grimneigh: {
		name: "Relincho Negro",
		// Official flavor text: "Al derrotar a un objetivo, emite un relincho aterrador y aumenta su Ataque Especial."
		desc: "El Ataque Especial de este Pokémon sube 1 nivel si debilita a otro Pokémon con un ataque.", // NEEDS QC
		shortDesc: "Su Ataque Esp. sube 1 nivel si debilita a otro Pokémon.", // NEEDS QC
	},
	guarddog: {
		name: "Perro Guardián",
		desc: "Este Pokémon es inmune al efecto de la habilidad Intimidación y, en su lugar, su Ataque sube 1 nivel. No puede ser obligado a cambiarse por ataques u objetos de otros Pokémon.", // NEEDS QC
		shortDesc: "Inmune a Intimidación (+1 Ataque en su lugar). No puede ser expulsado.", // NEEDS QC
	},
	gulpmissile: {
		name: "Tragamisil",
		// Official flavor text: "Tras usar Surf o Buceo, emerge con una presa en la boca. Al recibir daño, ataca escupiéndola al rival."
		desc: "Si este Pokémon es un Cramorant, cambia de forma al golpear con Surf o al usar con éxito el primer turno de Buceo: obtiene la Forma Tragatodo con un Arrokuda en la boca si tiene más de la mitad de sus PS, o la Forma Engulletodo con un Pikachu si tiene la mitad o menos. Si recibe un golpe en esas formas, escupe el Arrokuda o el Pikachu contra el atacante, incluso sin PS restantes. El proyectil inflige 1/4 de los PS máximos del atacante (redondeado hacia abajo); la habilidad Muro Mágico lo evita, pero un sustituto no. El Arrokuda además baja 1 nivel la Defensa y el Pikachu paraliza. Cramorant vuelve a la normalidad al escupir, cambiarse o dinamaxearse.", // NEEDS QC
		shortDesc: "Tras Surf/Buceo, si lo golpean: atacante pierde 1/4 de PS y -1 Defensa o parálisis.", // NEEDS QC
	},
	guts: {
		name: "Agallas",
		// Official flavor text: "Si sufre un problema de estado, se viene arriba y aumenta su Ataque."
		desc: "Si este Pokémon tiene un problema de estado, su Ataque se multiplica por 1,5. Sus ataques físicos ignoran la reducción de daño de la quemadura.", // NEEDS QC
		shortDesc: "Con un problema de estado, su Ataque es 1,5x e ignora la quemadura.", // NEEDS QC
	},
	hadronengine: {
		name: "Motor Hadrónico",
		shortDesc: "Al entrar crea campo eléctrico; en él, su Ataque Esp. es 1,3333x.", // NEEDS QC

		start: "  ¡{POKEMON} crea un campo eléctrico que impulsa su motor futurista!",
		activate: "  ¡El campo eléctrico impulsa el motor futurista de {POKEMON}!",
	},
	harvest: {
		name: "Cosecha",
		// Official flavor text: "Puede reutilizar varias veces una misma baya."
		desc: "Si el último objeto que usó este Pokémon es una baya, hay un 50% de probabilidad de recuperarla al final de cada turno. Con sol, la probabilidad es del 100%.", // NEEDS QC
		shortDesc: "50% de recuperar la baya usada cada turno (100% con sol).", // NEEDS QC

		addItem: "  ¡{POKEMON} ha recogido {ITEM:indefinite}!",
	},
	healer: {
		name: "Alma Cura",
		// Official flavor text: "A veces cura los problemas de estado de un aliado."
		desc: "Al final de cada turno, hay un 30% de probabilidad de curar el problema de estado de un aliado.", // NEEDS QC
		shortDesc: "30% de curar el estado de un aliado al final de cada turno.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "30% de probabilidad, por cada aliado adyacente, de curar su problema de estado al final de cada turno.", // NEEDS QC
			shortDesc: "30% de probabilidad por aliado adyacente de curar su estado al final del turno.", // NEEDS QC
		},
	},
	heatproof: {
		name: "Ignífugo",
		// Official flavor text: "Su cuerpo, resistente al calor, reduce a la mitad el daño recibido por movimientos de tipo Fuego."
		desc: "Los ataques de tipo Fuego contra este Pokémon se calculan con la característica ofensiva del atacante reducida a la mitad. Además, recibe la mitad del daño de quemadura (redondeado hacia abajo).", // NEEDS QC
		shortDesc: "El Fuego lo daña con la ofensiva del atacante a la mitad; quemadura a la mitad.", // NEEDS QC
		gen8: {
			desc: "La potencia de los ataques de tipo Fuego contra este Pokémon se reduce a la mitad. Este Pokémon recibe la mitad del daño de quemadura habitual (redondeado hacia abajo).", // NEEDS QC
			shortDesc: "Los ataques de Fuego contra él tienen mitad de potencia; quemadura reducida.", // NEEDS QC
		},
	},
	heavymetal: {
		name: "Metal Pesado",
		// Official flavor text: "Duplica su peso."
		desc: "El peso de este Pokémon se duplica. Se calcula después del efecto de Aligerar y antes del de Piedra Pómez.", // NEEDS QC
		shortDesc: "Su peso se duplica.", // NEEDS QC
	},
	honeygather: {
		name: "Recogemiel",
		shortDesc: "Sin uso competitivo.", // NEEDS QC
	},
	hospitality: {
		name: "Hospitalidad",
		shortDesc: "Al entrar, su aliado recupera 1/4 de sus PS máximos.", // NEEDS QC

		heal: "  ¡{POKEMON} se ha bebido el té que ha preparado {SOURCE}!",
	},
	hugepower: {
		name: "Potencia",
		shortDesc: "Su Ataque se duplica.", // NEEDS QC
	},
	hungerswitch: {
		name: "Mutapetito",
		// Official flavor text: "Alterna entre su Forma Saciada y Forma Voraz al final de cada turno."
		desc: "Si este Pokémon es un Morpeko, alterna entre su Forma Saciada y su Forma Voraz al final de cada turno.", // NEEDS QC
		shortDesc: "Morpeko alterna entre sus formas al final de cada turno.", // NEEDS QC
	},
	hustle: {
		name: "Entusiasmo",
		// Official flavor text: "Aumenta su Ataque, pero reduce su Precisión."
		desc: "El Ataque de este Pokémon se multiplica por 1,5 y la precisión de sus ataques físicos por 0,8.", // NEEDS QC
		shortDesc: "Su Ataque es 1,5x, pero sus ataques físicos tienen 0,8x de precisión.", // NEEDS QC
	},
	hydration: {
		name: "Hidratación",
		// Official flavor text: "Cura los problemas de estado si está lloviendo."
		desc: "Si llueve, el problema de estado de este Pokémon se cura al final de cada turno. No se activa si lleva Parasol Multiuso.", // NEEDS QC
		shortDesc: "Si llueve, cura su problema de estado al final de cada turno.", // NEEDS QC
		gen7: {
			desc: "Con lluvia, el problema de estado de este Pokémon se cura al final de cada turno.", // NEEDS QC
		},
	},
	hypercutter: {
		name: "Corte Fuerte",
		shortDesc: "Otros Pokémon no pueden bajarle el Ataque.", // NEEDS QC
	},
	icebody: {
		name: "Gélido",
		// Official flavor text: "Recupera PS de forma gradual cuando hay tormentas de granizo."
		desc: "Si nieva, este Pokémon recupera 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno.", // NEEDS QC
		shortDesc: "Si nieva, recupera 1/16 de sus PS máximos cada turno.", // NEEDS QC
		gen8: {
			desc: "Con granizo, este Pokémon recupera 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Este Pokémon no recibe daño del granizo.", // NEEDS QC
			shortDesc: "Con granizo: recupera 1/16 de sus PS máx. por turno; inmune al granizo.", // NEEDS QC
		},
	},
	iceface: {
		name: "Cara de Hielo",
		// Official flavor text: "Absorbe el daño de un ataque físico con el hielo de la cabeza, tras lo cual cambia de forma. El hielo se regenerará la próxima vez que granice."
		desc: "Si este Pokémon es un Eiscue, el primer golpe físico que recibe en combate hace 0 de daño. Después, su cabeza de hielo se rompe y cambia a la Forma Cara Deshielo. Recupera la Forma Cara de Hielo cuando empieza a nevar o al entrar en combate mientras nieva. El daño por confusión también rompe el hielo.", // NEEDS QC
		shortDesc: "(Eiscue) El primer golpe físico hace 0 de daño. Se restaura al nevar.", // NEEDS QC
		gen8: {
			desc: "Si este Pokémon es un Eiscue, el primer golpe físico que recibe en combate hace 0 de daño. Después, su cara de hielo se rompe y cambia a la Forma Cara Deshielo. Recupera la Forma Cara de Hielo cuando empieza Granizo o si entra en combate durante Granizo. El daño por confusión también rompe la cara de hielo.", // NEEDS QC
			shortDesc: "Si es Eiscue: el primer golpe físico hace 0 de daño. Se restaura con granizo.", // NEEDS QC
		},
	},
	icescales: {
		name: "Escama de Hielo",
		shortDesc: "Recibe la mitad de daño de los ataques especiales.", // NEEDS QC
	},
	illuminate: {
		name: "Iluminación",
		// Official flavor text: "Aumenta la probabilidad de encontrar Pokémon al iluminar el entorno."
		desc: "Otros Pokémon no pueden bajar la precisión de este Pokémon. Este Pokémon ignora los cambios de evasión del objetivo.", // NEEDS QC
		shortDesc: "No puede perder precisión; ignora la evasión del objetivo.", // NEEDS QC
		gen8: {
			desc: "Sin uso competitivo.", // NEEDS QC
			shortDesc: "Sin uso competitivo.", // NEEDS QC
		},
	},
	illusion: {
		name: "Ilusión",
		// Official flavor text: "Adopta el aspecto del último Pokémon del equipo al entrar en combate para desconcertar al rival."
		desc: "Al entrar en combate, este Pokémon aparenta ser el último Pokémon no debilitado del equipo hasta que recibe daño directo de un ataque. Se muestran su nivel y PS reales.", // NEEDS QC
		shortDesc: "Aparenta ser el último Pokémon del equipo hasta recibir daño directo.", // NEEDS QC

		end: "  ¡La ilusión de {POKEMON} se ha desvanecido!",
	},
	immunity: {
		name: "Inmunidad",
		shortDesc: "No puede ser envenenado. Obtenerla estando envenenado lo cura.", // NEEDS QC
	},
	imposter: {
		name: "Impostor",
		// Official flavor text: "Se transforma en el Pokémon que tiene enfrente."
		desc: "Al entrar en combate, este Pokémon se transforma en el rival que tiene enfrente. Si no hay ningún Pokémon en esa posición, no se transforma.", // NEEDS QC
		shortDesc: "Al entrar, se transforma en el rival que tiene enfrente.", // NEEDS QC
	},
	infiltrator: {
		name: "Allanamiento",
		// Official flavor text: "Ataca sorteando la barrera o el sustituto del rival."
		desc: "Los movimientos de este Pokémon ignoran los sustitutos y Reflejo, Pantalla de Luz, Velo Sagrado, Neblina, Velo Aurora del bando rival.", // NEEDS QC
		shortDesc: "Sus movimientos ignoran sustitutos, Reflejo, Pantalla de Luz y más.", // NEEDS QC
		gen6: {
			desc: "Los movimientos de este Pokémon ignoran los sustitutos y Reflejo, Pantalla de Luz, Velo Sagrado y Neblina del bando rival.", // NEEDS QC
			shortDesc: "Sus movimientos ignoran sustitutos y Reflejo, Pantalla de Luz, Velo Sagrado, Neblina.", // NEEDS QC
		},
		gen5: {
			desc: "Los movimientos de este Pokémon ignoran Reflejo, Pantalla de Luz, Velo Sagrado y Neblina del bando rival.", // NEEDS QC
			shortDesc: "Sus movimientos ignoran Reflejo, Pantalla de Luz, Velo Sagrado y Neblina rivales.", // NEEDS QC
		},
	},
	innardsout: {
		name: "Revés",
		// Official flavor text: "Al caer debilitado, inflige al rival un daño equivalente a los PS que le quedaran."
		desc: "Si este Pokémon es debilitado por un movimiento, el atacante pierde tantos PS como el daño infligido.", // NEEDS QC
		shortDesc: "Si lo debilita un movimiento, el atacante pierde los mismos PS.", // NEEDS QC

		damage: "#aftermath",
	},
	innerfocus: {
		name: "Fuerza Mental",
		// Official flavor text: "Gracias a su profunda concentración, no se amedrenta ante los ataques del rival."
		desc: "Este Pokémon no puede retroceder. Es inmune al efecto de la habilidad Intimidación.", // NEEDS QC
		shortDesc: "No puede retroceder. Inmune a Intimidación.", // NEEDS QC
		gen7: {
			desc: "Este Pokémon no puede retroceder.", // NEEDS QC
			shortDesc: "Este Pokémon no puede retroceder.", // NEEDS QC
		},
	},
	insomnia: {
		name: "Insomnio",
		shortDesc: "No puede quedarse dormido. Obtenerla estando dormido lo cura.", // NEEDS QC
	},
	intimidate: {
		name: "Intimidación",
		// Official flavor text: "Al entrar en combate amilana al rival de tal manera que su Ataque disminuye."
		desc: "Al entrar en combate, baja 1 nivel el Ataque de los rivales. Los Pokémon con las habilidades Fuerza Mental, Despiste, Ritmo Propio, Intrépido y los que están tras un sustituto son inmunes.", // NEEDS QC
		shortDesc: "Al entrar, baja 1 nivel el Ataque de los rivales.", // NEEDS QC
		gen7: {
			desc: "Al entrar en combate, este Pokémon baja 1 nivel el Ataque de los rivales. Los Pokémon tras un sustituto son inmunes.", // NEEDS QC
		},
		gen6: {
			desc: "Al entrar en combate, este Pokémon baja 1 nivel el Ataque de los rivales adyacentes. Los Pokémon tras un sustituto son inmunes.", // NEEDS QC
			shortDesc: "Al entrar en combate, baja 1 nivel el Ataque de los rivales adyacentes.", // NEEDS QC
		},
		gen4: {
			desc: "Al entrar en combate, este Pokémon baja 1 nivel el Ataque de los rivales. Los Pokémon tras un sustituto son inmunes. Si Ida y Vuelta rompe un sustituto rival y este Pokémon entra como relevo, el Pokémon que tenía el sustituto sigue siendo inmune a esta habilidad.", // NEEDS QC
			shortDesc: "Al entrar, baja 1 nivel el Ataque de los rivales.", // NEEDS QC
		},
		gen3: {
			desc: "Al entrar en combate, este Pokémon baja 1 nivel el Ataque de los rivales. Los Pokémon tras un sustituto son inmunes.", // NEEDS QC
		},
	},
	intrepidsword: {
		name: "Espada Indómita",
		shortDesc: "Al entrar, su Ataque sube 1 nivel. Una vez por combate.", // NEEDS QC
		gen8: {
			shortDesc: "Al entrar, su Ataque sube 1 nivel.", // NEEDS QC
		},
	},
	ironbarbs: {
		name: "Punta Acero",
		// Official flavor text: "Inflige daño al rival si este le golpea con un movimiento de contacto."
		desc: "Los Pokémon que hacen contacto con este Pokémon pierden 1/8 de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		shortDesc: "Quien haga contacto con él pierde 1/8 de sus PS máximos.", // NEEDS QC

		damage: "#roughskin",
	},
	ironfist: {
		name: "Puño Férreo",
		// Official flavor text: "Aumenta la potencia de los puñetazos."
		desc: "La potencia de los movimientos de puño de este Pokémon se multiplica por 1,2.", // NEEDS QC
		shortDesc: "Sus movimientos de puño tienen 1,2x de potencia (no Golpe Bajo).", // NEEDS QC
	},
	justified: {
		name: "Justiciero",
		shortDesc: "Su Ataque sube 1 nivel al recibir un movimiento de tipo Siniestro.", // NEEDS QC
	},
	keeneye: {
		name: "Vista Lince",
		// Official flavor text: "Su aguda vista evita que le disminuya la Precisión."
		desc: "Otros Pokémon no pueden bajar la precisión de este Pokémon. Este Pokémon ignora los cambios de evasión del objetivo.", // NEEDS QC
		shortDesc: "No puede perder precisión; ignora la evasión del objetivo.", // NEEDS QC
		gen5: {
			desc: "Impide que otros Pokémon bajen la precisión de este Pokémon.", // NEEDS QC
			shortDesc: "Otros Pokémon no pueden bajar su precisión.", // NEEDS QC
		},
	},
	klutz: {
		name: "Zoquete",
		// Official flavor text: "No puede usar objetos equipados."
		desc: "El objeto que lleva este Pokémon no tiene efecto. No puede usar Lanzamiento. Brazal Firme, Franja Recia, Banda Recia, Cinto Recio, Brazal Recio, Lente Recia, Pesa Recia conservan su efecto.", // NEEDS QC
		shortDesc: "Su objeto no tiene efecto (salvo los de entrenamiento).", // NEEDS QC
	},
	leafguard: {
		name: "Defensa Hoja",
		// Official flavor text: "Evita los problemas de estado si hace sol."
		desc: "Si hace sol, este Pokémon no puede sufrir problemas de estado ni verse afectado por Bostezo, y Descanso le falla. No se activa si lleva Parasol Multiuso.", // NEEDS QC
		shortDesc: "Con sol, no sufre problemas de estado y Descanso le falla.", // NEEDS QC
		gen7: {
			desc: "Con sol, este Pokémon no puede sufrir problemas de estado ni el efecto de Bostezo, y Descanso le falla.", // NEEDS QC
		},
		gen4: {
			desc: "Con sol, este Pokémon no puede sufrir problemas de estado ni el efecto de Bostezo, pero puede usar Descanso con normalidad.", // NEEDS QC
			shortDesc: "Con sol: sin problemas de estado, pero Descanso funciona con normalidad.", // NEEDS QC
		},
	},
	levitate: {
		name: "Levitación",
		// Official flavor text: "Su capacidad de flotar sobre el suelo le proporciona inmunidad frente a los movimientos de tipo Tierra."
		desc: "Este Pokémon es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas, Red Viscosa y la habilidad Trampa Arena. Los efectos de Gravedad, Arraigo, Antiaéreo, Mil Flechas y Bola Férrea anulan la inmunidad. Mil Flechas puede golpearlo como si no tuviera esta habilidad.", // NEEDS QC
		shortDesc: "Inmune al tipo Tierra; lo anulan Gravedad, Antiaéreo y más.", // NEEDS QC
		gen5: {
			desc: "Este Pokémon es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas y la habilidad Trampa Arena. Los efectos de Gravedad, Arraigo, Antiaéreo y Bola Férrea anulan la inmunidad.", // NEEDS QC
		},
		gen4: {
			desc: "Este Pokémon es inmune a los ataques de tipo Tierra y a los efectos de Púas, Púas Tóxicas y la habilidad Trampa Arena. Los efectos de Gravedad, Arraigo y Bola Férrea anulan la inmunidad.", // NEEDS QC
			shortDesc: "Inmune al tipo Tierra; Gravedad/Arraigo/Bola Férrea lo anulan.", // NEEDS QC
		},
		gen3: {
			desc: "Este Pokémon es inmune a los ataques de tipo Tierra y a los efectos de Púas y la habilidad Trampa Arena.", // NEEDS QC
			shortDesc: "Este Pokémon es inmune al tipo Tierra.", // NEEDS QC
		},
	},
	libero: {
		name: "Líbero",
		// Official flavor text: "Cambia su tipo al del movimiento que va a usar."
		desc: "El tipo de este Pokémon cambia al tipo del movimiento que va a usar. Este efecto se aplica después de todos los efectos que cambian el tipo de un movimiento. Solo se activa una vez por entrada en combate y no si está teracristalizado.", // NEEDS QC
		shortDesc: "Su tipo cambia al del movimiento que usa. Una vez por entrada.", // NEEDS QC
		gen8: {
			desc: "El tipo de este Pokémon pasa a ser el del movimiento que va a usar. Este efecto se aplica después de todos los efectos que cambian el tipo de un movimiento.", // NEEDS QC
			shortDesc: "Su tipo pasa a ser el del movimiento que va a usar.", // NEEDS QC
		},
	},
	lightmetal: {
		name: "Metal Liviano",
		// Official flavor text: "Reduce a la mitad su peso."
		desc: "El peso de este Pokémon se reduce a la mitad (redondeado hacia abajo a la décima de kg). Se calcula después del efecto de Aligerar y antes del de Piedra Pómez. El peso no baja de 0,1 kg.", // NEEDS QC
		shortDesc: "Su peso se reduce a la mitad.", // NEEDS QC
	},
	lightningrod: {
		name: "Pararrayos",
		// Official flavor text: "Atrae y neutraliza los movimientos de tipo Eléctrico, que además le suben el Ataque Especial."
		desc: "Este Pokémon es inmune a los movimientos de tipo Eléctrico y su Ataque Especial sube 1 nivel al ser golpeado por uno. Si un movimiento Eléctrico de un solo objetivo de otro Pokémon no lo tiene como objetivo y está a su alcance, lo atrae hacia sí. Si varios Pokémon pueden atraerlo, lo hace el más rápido; en caso de empate, aquel cuya habilidad lleve más tiempo activa.", // NEEDS QC
		shortDesc: "Atrae los movimientos Eléctricos: los anula y gana +1 Ataque Esp.", // NEEDS QC
		gen4: {
			desc: "Si este Pokémon no es el objetivo de un movimiento de tipo Eléctrico de objetivo único usado por otro Pokémon, lo redirige hacia sí mismo.", // NEEDS QC
			shortDesc: "Atrae hacia sí los movimientos Eléctricos de objetivo único.", // NEEDS QC
		},
		gen3: {
			desc: "Si este Pokémon no es el objetivo de un movimiento de tipo Eléctrico de objetivo único usado por un rival, lo redirige hacia sí mismo. Este efecto considera Poder Oculto de tipo Normal.", // NEEDS QC
			shortDesc: "Atrae hacia sí los movimientos Eléctricos rivales de objetivo único.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} ha atraído el ataque!",
	},
	limber: {
		name: "Flexibilidad",
		shortDesc: "No puede ser paralizado. Obtenerla estando paralizado lo cura.", // NEEDS QC
	},
	lingeringaroma: {
		name: "Olor Persistente",
		desc: "Los Pokémon que hacen contacto con este Pokémon pasan a tener la habilidad Olor Persistente. No afecta a los Pokémon con las habilidades Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Olor Persistente, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracambio, Modo Daruma y Cambio Heroico.", // NEEDS QC
		shortDesc: "Quien haga contacto con él pasa a tener esta habilidad.", // NEEDS QC
		gen8: {
			desc: "Los Pokémon que hagan contacto con este Pokémon pasan a tener la habilidad Olor Persistente. No afecta a los Pokémon con las habilidades Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Olor Persistente, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico y Modo Daruma.", // NEEDS QC
		},

		changeAbility: "  ¡Un olor persistente impregna a {TARGET}!",
	},
	liquidooze: {
		name: "Lodo Líquido",
		shortDesc: "Quien le drene PS recibe tanto daño como iba a curarse.", // NEEDS QC
		gen4: {
			desc: "Este Pokémon daña a quienes le drenan PS tanto como habrían curado. Este efecto no considera Comesueños.", // NEEDS QC
		},

		damage: "  ¡{POKEMON} ha absorbido la secreción viscosa tóxica!",
	},
	liquidvoice: {
		name: "Voz Fluida",
		// Official flavor text: "Hace que todos sus movimientos que usan sonido pasen a ser de tipo Agua."
		desc: "Los movimientos de sonido de este Pokémon se convierten en tipo Agua. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, pero antes de los efectos de Cortina Plasma y Electrificación.", // NEEDS QC
		shortDesc: "Sus movimientos de sonido son de tipo Agua.", // NEEDS QC
	},
	longreach: {
		name: "Remoto",
		shortDesc: "Sus ataques no hacen contacto con el objetivo.", // NEEDS QC
	},
	magicbounce: {
		name: "Espejo Mágico",
		// Official flavor text: "Puede devolver los movimientos de estado lanzados por el rival, sin verse afectado por ellos."
		desc: "Este Pokémon no se ve afectado por ciertos movimientos de estado dirigidos a él y los devuelve contra su usuario original. Los movimientos devueltos no pueden volver a devolverse con esta habilidad ni con Capa Mágica. Púas, Trampa Rocas, Red Viscosa y Púas Tóxicas solo pueden devolverse una vez por bando, por el Pokémon situado más a la izquierda con este efecto o el de Capa Mágica. Las habilidades Pararrayos y Colector atraen sus movimientos antes de que actúe esta habilidad.", // NEEDS QC
		shortDesc: "Devuelve ciertos movimientos de estado contra su usuario.", // NEEDS QC
		gen5: {
			desc: "Este Pokémon no se ve afectado por ciertos movimientos de estado dirigidos contra él y los usa en su lugar contra quien los usó. Los movimientos devueltos así no pueden devolverse de nuevo con esta habilidad ni con Capa Mágica. Púas, Trampa Rocas y Púas Tóxicas solo pueden devolverse una vez por bando, por el Pokémon situado más a la izquierda bajo esta habilidad o el efecto de Capa Mágica. Las habilidades Pararrayos y Colector redirigen sus respectivos movimientos antes de que actúe esta habilidad.", // NEEDS QC
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "Muro Mágico",
		// Official flavor text: "Solo recibe daño de ataques."
		desc: "Este Pokémon solo puede recibir daño de ataques directos. El coste de Maldición y Sustituto, Tambor, Divide Dolor, el retroceso de Forcejeo y el daño por confusión cuentan como daño directo.", // NEEDS QC
		shortDesc: "Solo recibe daño de ataques directos.", // NEEDS QC
		gen4: {
			desc: "Este Pokémon solo puede ser dañado por ataques directos. Maldición y Sustituto al usarse, Tambor, Divide Dolor, el retroceso de Forcejeo y el daño por confusión se consideran daño directo. Este Pokémon no puede quedar paralizado sin poder actuar y no le afecta Púas Tóxicas al entrar en combate.", // NEEDS QC
			shortDesc: "Solo lo dañan los ataques directos; nunca queda paralizado sin actuar.", // NEEDS QC
		},
	},
	magician: {
		name: "Prestidigitador",
		// Official flavor text: "Roba el objeto del Pokémon al que alcance con un movimiento."
		desc: "Si este Pokémon no lleva objeto, roba el del Pokémon al que golpee con un ataque. No afecta a Deseo Oculto ni a Premonición. Si golpea a varios objetivos, roba al más rápido (teniendo en cuenta Espacio Raro y priorizando rivales sobre aliados).", // NEEDS QC
		shortDesc: "Si no lleva objeto, roba el del Pokémon al que golpee.", // NEEDS QC
	},
	magmaarmor: {
		name: "Escudo Magma",
		shortDesc: "No puede ser congelado. Obtenerla estando congelado lo cura.", // NEEDS QC
	},
	magnetpull: {
		name: "Imán",
		// Official flavor text: "Su magnetismo atrae a los Pokémon de tipo Acero y les impide huir."
		desc: "Impide que los rivales de tipo Acero elijan cambiarse, salvo que lleven Muda Concha o sean de tipo Fantasma.", // NEEDS QC
		shortDesc: "Impide a los rivales de tipo Acero cambiarse.", // NEEDS QC
		gen6: {
			desc: "Impide que los rivales adyacentes de tipo Acero elijan cambiarse, salvo que lleven Muda Concha o sean de tipo Fantasma.", // NEEDS QC
			shortDesc: "Los rivales adyacentes de tipo Acero no pueden elegir cambiarse.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que los rivales adyacentes de tipo Acero elijan cambiarse, salvo que lleven Muda Concha.", // NEEDS QC
			shortDesc: "Los rivales adyacentes de tipo Acero no pueden elegir cambiarse.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que los rivales de tipo Acero elijan cambiarse, salvo que lleven Muda Concha.", // NEEDS QC
			shortDesc: "Impide a los rivales de tipo Acero cambiarse.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que los Pokémon de tipo Acero elijan cambiarse, salvo este Pokémon.", // NEEDS QC
			shortDesc: "Los Pokémon de tipo Acero no pueden cambiarse, salvo este Pokémon.", // NEEDS QC
		},
	},
	marvelscale: {
		name: "Escama Especial",
		shortDesc: "Con un problema de estado, su Defensa se multiplica por 1,5.", // NEEDS QC
	},
	megalauncher: {
		name: "Megadisparador",
		// Official flavor text: "Aumenta la potencia de algunos movimientos de pulsos y auras."
		desc: "La potencia de los movimientos de pulso de este Pokémon se multiplica por 1,5. Pulso Cura restaura 3/4 de los PS máximos del objetivo.", // NEEDS QC
		shortDesc: "Sus movimientos de pulso tienen 1,5x de potencia; mejora Pulso Cura.", // NEEDS QC
	},
	megasol: {
		name: "Megasolar",
		shortDesc: "Sus movimientos actúan como si hiciera sol.", // NEEDS QC
	},
	merciless: {
		name: "Ensañamiento",
		shortDesc: "Sus ataques son golpes críticos contra objetivos envenenados.", // NEEDS QC
	},
	mimicry: {
		name: "Mimetismo",
		// Official flavor text: "Cambia su tipo según el campo que haya en el terreno de combate."
		desc: "El tipo de este Pokémon cambia según el terreno de campo activo cuando obtiene esta habilidad o cuando empieza un terreno: Eléctrico, Planta, Hada o Psíquico según corresponda. Sin terreno activo o cuando este termina, recupera los tipos originales de su especie.", // NEEDS QC
		shortDesc: "Su tipo cambia según el campo activo; vuelve al original al terminar.", // NEEDS QC

		activate: "  ¡{POKEMON} ha recobrado su tipo original!",
	},
	mindseye: {
		name: "Ojo Mental",
		desc: "Los movimientos de tipo Normal y Lucha de este Pokémon pueden golpear a los de tipo Fantasma. Otros Pokémon no pueden bajar la precisión de este Pokémon. Este Pokémon ignora los cambios de evasión del objetivo.", // NEEDS QC
		shortDesc: "Normal y Lucha golpean a Fantasma. Precisión fija, ignora evasión.", // NEEDS QC
	},
	minus: {
		name: "Menos",
		// Official flavor text: "Potencia su Ataque Especial si un Pokémon aliado tiene la habilidad Más o Menos."
		desc: "Si un aliado en combate tiene esta habilidad o Más, el Ataque Especial de este Pokémon se multiplica por 1,5.", // NEEDS QC
		shortDesc: "Con un aliado con Más o esta habilidad, su Ataque Esp. es 1,5x.", // NEEDS QC
		gen4: {
			desc: "Si un aliado activo tiene la habilidad Más, el Ataque Especial de este Pokémon se multiplica por 1,5.", // NEEDS QC
			shortDesc: "Si un aliado activo tiene Más, su At. Esp. es x1,5.", // NEEDS QC
		},
		gen3: {
			desc: "Si un Pokémon activo tiene la habilidad Más, el Ataque Especial de este Pokémon se multiplica por 1,5.", // NEEDS QC
			shortDesc: "Si un Pokémon activo tiene Más, su At. Esp. es x1,5.", // NEEDS QC
		},
	},
	mirrorarmor: {
		name: "Coraza Reflejo",
		// Official flavor text: "Refleja los efectos que reducen las características."
		desc: "Cuando otro Pokémon fuera a bajar las características de este Pokémon, se las baja a sí mismo en su lugar. No se activa si la característica ya está en -6. Si el otro Pokémon tiene un sustituto, ninguno de los dos sufre la bajada.", // NEEDS QC
		shortDesc: "Devuelve las bajadas de características al atacante.", // NEEDS QC
	},
	mistysurge: {
		name: "Nebulogénesis",
		shortDesc: "Al entrar en combate, crea un campo de niebla.", // NEEDS QC
	},
	moldbreaker: {
		name: "Rompemoldes",
		// Official flavor text: "Las habilidades del objetivo no afectan a los movimientos que emplea."
		desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que puede ignorar son: Cola Armadura, Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Cuerpo Vívido, Disfraz, Piel Seca, Geofagia, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Peluche, Compiescolta, Pelaje Recio, Cuerpo Áureo, Manto Frondoso, Perro Guardián, Ignífugo, Metal Pesado, Corte Fuerte, Cara de Hielo, Escama de Hielo, Iluminación, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Ojo Mental, Coraza Reflejo, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Velo Pastel, Punk Rock, Sal Purificadora, Regia Presencia, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Teracaparazón, Termoconversión, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Pompa, Velo Agua, Cuerpo Horneado, Humo Blanco, Surcavientos, Superguarda, Piel Milagro. Afecta a todos los demás Pokémon del campo, sean o no objetivo del movimiento y sea o no beneficiosa para este Pokémon su habilidad.", // NEEDS QC
		shortDesc: "Sus movimientos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		gen8: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Cuerpo Vívido, Disfraz, Piel Seca, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Peluche, Compiescolta, Pelaje Recio, Manto Frondoso, Ignífugo, Metal Pesado, Corte Fuerte, Cara de Hielo, Escama de Hielo, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Coraza Reflejo, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Velo Pastel, Punk Rock, Regia Presencia, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Pompa, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen7: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Aura Oscura, Cuerpo Vívido, Disfraz, Piel Seca, Aura Feérica, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Peluche, Compiescolta, Pelaje Recio, Manto Frondoso, Ignífugo, Metal Pesado, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Regia Presencia, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Pompa, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen6: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Aura Oscura, Piel Seca, Aura Feérica, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Compiescolta, Pelaje Recio, Manto Frondoso, Ignífugo, Metal Pesado, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen5: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Armadura Batalla, Sacapecho, Cuerpo Puro, Respondón, Humedad, Piel Seca, Filtro, Absorbe Fuego, Don Floral, Compiescolta, Ignífugo, Metal Pesado, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Electromotor, Multiescamas, Despiste, Ritmo Propio, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen4: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Armadura Batalla, Cuerpo Puro, Humedad, Piel Seca, Filtro, Absorbe Fuego, Don Floral, Ignífugo, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Pararrayos, Flexibilidad, Escudo Magma, Escama Especial, Electromotor, Despiste, Ritmo Propio, Velo Arena, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Tumbos, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Velo Agua, Humo Blanco, Superguarda. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon. El modificador de Ataque de la habilidad Don Floral de un aliado no se anula.", // NEEDS QC
		},

		start: "  ¡{POKEMON} rompe el molde!",
	},
	moody: {
		name: "Veleta",
		// Official flavor text: "Una característica le sube mucho en cada turno, pero le baja otra."
		desc: "Al final de cada turno, una característica al azar de este Pokémon (salvo precisión y evasión) sube 2 niveles y otra baja 1 nivel.", // NEEDS QC
		shortDesc: "Cada turno, +2 a una característica al azar y -1 a otra.", // NEEDS QC
		gen7: {
			desc: "Al final de cada turno, una característica al azar de este Pokémon sube 2 niveles y otra baja 1 nivel.", // NEEDS QC
			shortDesc: "Al final del turno: una característica al azar +2 y otra -1.", // NEEDS QC
		},
	},
	motordrive: {
		name: "Electromotor",
		// Official flavor text: "Si le alcanza un movimiento de tipo Eléctrico, le sube la Velocidad en vez de sufrir daño."
		desc: "Este Pokémon es inmune a los movimientos de tipo Eléctrico y su Velocidad sube 1 nivel al ser golpeado por uno.", // NEEDS QC
		shortDesc: "Inmune al tipo Eléctrico: +1 Velocidad si lo golpea uno.", // NEEDS QC
	},
	moxie: {
		name: "Autoestima",
		// Official flavor text: "Al debilitar a un objetivo, su confianza se refuerza de tal manera que aumenta su Ataque."
		desc: "El Ataque de este Pokémon sube 1 nivel si debilita a otro Pokémon con un ataque.", // NEEDS QC
		shortDesc: "Su Ataque sube 1 nivel si debilita a otro Pokémon.", // NEEDS QC
	},
	multiscale: {
		name: "Multiescamas",
		shortDesc: "Con todos sus PS, recibe la mitad de daño de los ataques.", // NEEDS QC
	},
	multitype: {
		name: "Multitipo",
		shortDesc: "El tipo de Arceus cambia según la tabla que lleve.", // NEEDS QC
		gen7: {
			shortDesc: "Si es Arceus: su tipo depende de la tabla o el Cristal Z que lleve.", // NEEDS QC
		},
		gen6: {
			shortDesc: "El tipo de Arceus cambia según la tabla que lleve.", // NEEDS QC
		},
		gen4: {
			desc: "Si este Pokémon es un Arceus, su tipo cambia según la tabla que lleve. Este Pokémon no puede perder su objeto por el ataque de otro Pokémon.", // NEEDS QC
		},
	},
	mummy: {
		name: "Momia",
		// Official flavor text: "Contagia la habilidad Momia al rival que entre en contacto con él."
		desc: "Los Pokémon que hacen contacto con este Pokémon pasan a tener la habilidad Momia. No afecta a los Pokémon con las habilidades Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Momia, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracambio, Modo Daruma y Cambio Heroico.", // NEEDS QC
		shortDesc: "Quien haga contacto con él pasa a tener esta habilidad.", // NEEDS QC
		gen8: {
			desc: "Los Pokémon que hagan contacto con este Pokémon pasan a tener la habilidad Momia. No afecta a los Pokémon con las habilidades Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Momia, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico y Modo Daruma.", // NEEDS QC
		},
		gen7: {
			desc: "Los Pokémon que hagan contacto con este Pokémon pasan a tener la habilidad Momia. No afecta a los Pokémon con las habilidades Fuerte Afecto, Letargo Perenne, Disfraz, Multitipo, Momia, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico y Modo Daruma.", // NEEDS QC
		},
		gen6: {
			desc: "Los Pokémon que hagan contacto con este Pokémon pasan a tener la habilidad Momia. No afecta a los Pokémon con las habilidades Multitipo, Momia y Cambio Táctico.", // NEEDS QC
		},
		gen5: {
			desc: "Los Pokémon que hagan contacto con este Pokémon pasan a tener la habilidad Momia. No afecta a los Pokémon con las habilidades Multitipo o Momia.", // NEEDS QC
		},

		changeAbility: "  ¡La habilidad de {TARGET} es ahora Momia!",
	},
	myceliummight: {
		name: "Poder Fúngico",
		desc: "Los movimientos de estado de este Pokémon ignoran ciertas habilidades de otros Pokémon y actúan los últimos entre los Pokémon que usan movimientos de la misma prioridad o superior.", // NEEDS QC
		shortDesc: "Sus movimientos de estado van al final, pero ignoran habilidades.", // NEEDS QC
	},
	naturalcure: {
		name: "Cura Natural",
		shortDesc: "Su problema de estado se cura al cambiarse.", // NEEDS QC

		activate: "  (¡{POKEMON} se ha curado gracias a Cura Natural!)", // NEEDS QC
	},
	neuroforce: {
		name: "Fuerza Cerebral",
		// Official flavor text: "Potencia los ataques supereficaces."
		desc: "Los ataques supereficaces de este Pokémon infligen 1,25 veces el daño normal.", // NEEDS QC
		shortDesc: "Sus ataques supereficaces infligen 1,25x de daño.", // NEEDS QC
	},
	neutralizinggas: {
		name: "Gas Reactivo",
		// Official flavor text: "Anula los efectos de las habilidades de los demás Pokémon presentes mientras esté en el terreno de combate."
		desc: "Mientras este Pokémon está en combate, las habilidades no tienen efecto. Se activa antes que las trampas y otras habilidades. No afecta a Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracambio, Modo Daruma, Cambio Heroico ni a Gas Reactivo.", // NEEDS QC
		shortDesc: "Mientras está en combate, las habilidades no tienen efecto.", // NEEDS QC
		gen8: {
			desc: "Mientras este Pokémon está en combate, las habilidades no tienen efecto. Esta habilidad se activa antes de que actúen las trampas y otras habilidades. No afecta a las habilidades Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Cara de Hielo, Multitipo, Gas Reactivo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico y Modo Daruma.", // NEEDS QC
		},

		start: "  ¡Un gas reactivo se propaga por toda la zona!",
		end: "  El gas reactivo se ha disipado.",
	},
	noguard: {
		name: "Indefenso",
		shortDesc: "Todos los movimientos usados por o contra él aciertan siempre.", // NEEDS QC
	},
	normalize: {
		name: "Normalidad",
		// Official flavor text: "Hace que todos sus movimientos se vuelvan de tipo Normal y aumenten ligeramente su potencia."
		desc: "Todos los movimientos de este Pokémon se convierten en tipo Normal y su potencia se multiplica por 1,2. Este efecto se aplica antes que otros efectos que cambian el tipo de un movimiento.", // NEEDS QC
		shortDesc: "Todos sus movimientos son de tipo Normal y tienen 1,2x de potencia.", // NEEDS QC
		gen6: {
			desc: "Los movimientos de este Pokémon pasan a ser de tipo Normal. Este efecto se aplica antes que otros efectos que cambian el tipo de un movimiento.", // NEEDS QC
			shortDesc: "Los movimientos de este Pokémon pasan a ser de tipo Normal.", // NEEDS QC
		},
		gen4: {
			desc: "Los movimientos de este Pokémon pasan a ser de tipo Normal. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, salvo Forcejeo.", // NEEDS QC
		},
	},
	oblivious: {
		name: "Despiste",
		// Official flavor text: "Su indiferencia evita que sea provocado o caiga presa del enamoramiento."
		desc: "Este Pokémon no puede quedar enamorado ni ser provocado. Obtener esta habilidad estando enamorado o provocado lo cura. Es inmune al efecto de la habilidad Intimidación.", // NEEDS QC
		shortDesc: "No puede enamorarse ni ser provocado. Inmune a Intimidación.", // NEEDS QC
		gen7: {
			desc: "Este Pokémon no puede enamorarse ni ser afectado por Mofa. Obtener esta habilidad estando enamorado o bajo Mofa lo cura.", // NEEDS QC
			shortDesc: "No puede enamorarse ni ser afectado por Mofa.", // NEEDS QC
		},
		gen5: {
			desc: "Este Pokémon no puede enamorarse. Obtener esta habilidad estando enamorado lo cura.", // NEEDS QC
			shortDesc: "No puede enamorarse. Obtenerla estando enamorado lo cura.", // NEEDS QC
		},
	},
	opportunist: {
		name: "Oportunista",
		shortDesc: "Copia las subidas de características de los rivales.", // NEEDS QC
	},
	orichalcumpulse: {
		name: "Latido Oricalco",
		shortDesc: "Al entrar invoca el sol; con sol, su Ataque es 1,3333x.", // NEEDS QC

		start: "  ¡{POKEMON} intensifica el brillo del sol y desata su pulso primigenio!",
		activate: "  ¡{POKEMON} recibe los rayos del sol y desata su pulso primigenio!",
	},
	overcoat: {
		name: "Funda",
		// Official flavor text: "No le afectan las tormentas de arena, el granizo y los movimientos con polvos."
		desc: "Este Pokémon es inmune a los movimientos de polvo, al daño de la tormenta de arena y a los efectos de Polvo Ira y la habilidad Efecto Espora.", // NEEDS QC
		shortDesc: "Inmune a polvos, a la tormenta de arena y a Efecto Espora.", // NEEDS QC
		gen8: {
			desc: "Este Pokémon es inmune a los movimientos de polvo, al daño de la tormenta de arena o el granizo, y a los efectos de Polvo Ira y la habilidad Efecto Espora.", // NEEDS QC
			shortDesc: "Inmune a movimientos de polvo, daño de arena/granizo y Efecto Espora.", // NEEDS QC
		},
		gen5: {
			desc: "Este Pokémon es inmune al daño de la tormenta de arena o el granizo.", // NEEDS QC
			shortDesc: "Inmune al daño de la tormenta de arena y el granizo.", // NEEDS QC
		},
	},
	overgrow: {
		name: "Espesura",
		// Official flavor text: "Potencia sus movimientos de tipo Planta cuando le quedan pocos PS."
		desc: "Cuando este Pokémon tiene 1/3 o menos de sus PS máximos (redondeado hacia abajo), su característica ofensiva se multiplica por 1,5 al usar un ataque de tipo Planta.", // NEEDS QC
		shortDesc: "Con 1/3 o menos de sus PS, sus ataques de Planta usan 1,5x su ofensiva.", // NEEDS QC
		gen4: {
			desc: "Cuando este Pokémon tiene 1/3 o menos de sus PS máximos (redondeado hacia abajo), la potencia de sus ataques de tipo Planta se multiplica por 1,5.", // NEEDS QC
			shortDesc: "Con 1/3 o menos de sus PS máx., sus ataques de Planta tienen 1,5x potencia.", // NEEDS QC
		},
	},
	owntempo: {
		name: "Ritmo Propio",
		// Official flavor text: "Como le gusta hacer las cosas a su manera, los rivales no logran confundirlo."
		desc: "Este Pokémon no puede quedar confuso. Obtener esta habilidad estando confuso lo cura. Es inmune al efecto de la habilidad Intimidación.", // NEEDS QC
		shortDesc: "No puede quedar confuso. Inmune a Intimidación.", // NEEDS QC
		gen7: {
			desc: "Este Pokémon no puede quedar confuso. Obtener esta habilidad estando confuso lo cura.", // NEEDS QC
			shortDesc: "Este Pokémon no puede quedar confuso.", // NEEDS QC
		},
	},
	parentalbond: {
		name: "Amor Filial",
		// Official flavor text: "Une fuerzas con su cría y ataca dos veces."
		desc: "Los movimientos de daño de este Pokémon golpean dos veces; el segundo golpe inflige 1/4 del daño. No afecta a Deseo Oculto, Dracoflechas, Cañón Dinamax, Esfuerzo, Explosión, Sacrificio, Lanzamiento, Premonición, Bola Hielo, Rodar, Autodestrucción, a los movimientos multigolpe, a los de varios objetivos ni a los de dos turnos.", // NEEDS QC
		shortDesc: "Sus ataques golpean 2 veces; el segundo golpe hace 1/4 del daño.", // NEEDS QC
		gen8: {
			desc: "Los movimientos de daño de este Pokémon golpean dos veces. El daño del segundo golpe se reduce a 1/4. No afecta a Deseo Oculto, Dracoflechas, Cañón Dinamax, Esfuerzo, Explosión, Sacrificio, Lanzamiento, Premonición, Bola Hielo, Rodar, Autodestrucción, movimientos multigolpe, movimientos con varios objetivos, movimientos de dos turnos ni movimientos Dinamax.", // NEEDS QC
		},
		gen7: {
			desc: "Los movimientos de daño de este Pokémon golpean dos veces. El daño del segundo golpe se reduce a 1/4. No afecta a Deseo Oculto, Esfuerzo, Explosión, Sacrificio, Lanzamiento, Premonición, Bola Hielo, Rodar, Autodestrucción, movimientos multigolpe, movimientos con varios objetivos, movimientos de dos turnos ni movimientos Z.", // NEEDS QC
		},
		gen6: {
			desc: "Los movimientos de daño de este Pokémon golpean dos veces. El daño del segundo golpe se reduce a la mitad. No afecta a Deseo Oculto, Esfuerzo, Explosión, Sacrificio, Lanzamiento, Premonición, Bola Hielo, Rodar, Autodestrucción, movimientos multigolpe, movimientos con varios objetivos, movimientos de dos turnos.", // NEEDS QC
			shortDesc: "Sus movimientos de daño golpean dos veces. Segundo golpe: mitad de daño.", // NEEDS QC
		},
	},
	pastelveil: {
		name: "Velo Pastel",
		// Official flavor text: "Se protege a sí mismo y a sus aliados del envenenamiento."
		desc: "Este Pokémon y sus aliados no pueden ser envenenados. Obtener esta habilidad estando él o un aliado envenenado los cura. Si esta habilidad se ignora durante un efecto que envenena, este Pokémon se cura de inmediato, pero su aliado no.", // NEEDS QC
		shortDesc: "Ni él ni sus aliados pueden ser envenenados. Al entrar, los cura.", // NEEDS QC
	},
	perishbody: {
		name: "Cuerpo Mortal",
		// Official flavor text: "Si le alcanza un movimiento de contacto, se debilitará al cabo de 3 turnos, así como su agresor, a menos que abandonen el terreno de combate."
		desc: "Hacer contacto con este Pokémon inicia el efecto de Canto Mortal para él y para el atacante. No se activa para este Pokémon si el atacante ya tiene cuenta atrás.", // NEEDS QC
		shortDesc: "El contacto inicia Canto Mortal para él y el atacante.", // NEEDS QC

		start: "  ¡Ambos Pokémon se debilitarán dentro de tres turnos!",
	},
	pickpocket: {
		name: "Hurto",
		// Official flavor text: "Si el rival usa un movimiento de contacto al atacar, le roba el objeto."
		desc: "Si este Pokémon no lleva objeto y recibe un movimiento de contacto, roba el objeto del atacante. Este efecto se aplica tras todos los golpes de un movimiento multigolpe. No se activa si la habilidad Potencia Bruta eliminó el efecto secundario del movimiento.", // NEEDS QC
		shortDesc: "Sin objeto y golpeado por contacto: roba el objeto del atacante.", // NEEDS QC
	},
	pickup: {
		name: "Recogida",
		// Official flavor text: "Puede recoger objetos que el rival haya usado, o bien otros que encuentre en plena aventura."
		desc: "Al final de cada turno, si este Pokémon no lleva objeto y al menos un Pokémon adyacente usó uno este turno, obtiene al azar el último objeto usado por uno de ellos. No cuentan como último objeto usado un Globo Helio explotado, un objeto recogido por otro Pokémon con esta habilidad ni los perdidos por Picadura, Gas Corrosivo, Antojo, Calcinación, Desarme, Picoteo, Ladrón. Los objetos lanzados con Lanzamiento sí pueden recogerse.", // NEEDS QC
		shortDesc: "Sin objeto, recoge el usado por un Pokémon adyacente ese turno.", // NEEDS QC
		gen7: {
			desc: "Al final de cada turno, si este Pokémon no lleva objeto y al menos un Pokémon adyacente usó un objeto este turno, se elige uno de ellos al azar y este Pokémon obtiene su último objeto usado. Un objeto no cuenta como el último usado si fue un Globo Helio explotado, si lo recogió otro Pokémon con esta habilidad o si se perdió por Picadura, Antojo, Calcinación, Desarme, Picoteo, Ladrón. Los objetos lanzados con Lanzamiento sí pueden recogerse.", // NEEDS QC
		},
		gen4: {
			desc: "Sin uso competitivo.", // NEEDS QC
			shortDesc: "Sin uso competitivo.", // NEEDS QC
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "Turbotaladro",
		shortDesc: "Sus movimientos de contacto atraviesan protecciones con 1/4 del daño.", // NEEDS QC
	},
	pixilate: {
		name: "Piel Feérica",
		// Official flavor text: "Convierte los movimientos de tipo Normal en tipo Hada y aumenta ligeramente su potencia."
		desc: "Los movimientos de tipo Normal de este Pokémon se convierten en tipo Hada y su potencia se multiplica por 1,2. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, pero antes de los efectos de Cortina Plasma y Electrificación.", // NEEDS QC
		shortDesc: "Sus movimientos de tipo Normal son de tipo Hada y tienen 1,2x de potencia.", // NEEDS QC
		gen6: {
			desc: "Los movimientos de tipo Normal de este Pokémon se convierten en tipo Hada y su potencia se multiplica por 1,3. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, pero antes de los efectos de Cortina Plasma y Electrificación.", // NEEDS QC
			shortDesc: "Los movimientos Normal de este Pokémon pasan a tipo Hada con 1,3x potencia.", // NEEDS QC
		},
	},
	plus: {
		name: "Más",
		// Official flavor text: "Potencia su Ataque Especial si un Pokémon aliado tiene la habilidad Más o Menos."
		desc: "Si un aliado en combate tiene esta habilidad o Menos, el Ataque Especial de este Pokémon se multiplica por 1,5.", // NEEDS QC
		shortDesc: "Con un aliado con Menos o esta habilidad, su Ataque Esp. es 1,5x.", // NEEDS QC
		gen4: {
			desc: "Si un aliado activo tiene la habilidad Menos, el Ataque Especial de este Pokémon se multiplica por 1,5.", // NEEDS QC
			shortDesc: "Si un aliado activo tiene Menos, su At. Esp. es x1,5.", // NEEDS QC
		},
		gen3: {
			desc: "Si un Pokémon activo tiene la habilidad Menos, el Ataque Especial de este Pokémon se multiplica por 1,5.", // NEEDS QC
			shortDesc: "Si un Pokémon activo tiene Menos, su At. Esp. es x1,5.", // NEEDS QC
		},
	},
	poisonheal: {
		name: "Antídoto",
		// Official flavor text: "Si resulta envenenado, recupera PS en vez de perderlos."
		desc: "Si este Pokémon está envenenado, en lugar de perder PS recupera 1/8 de sus PS máximos (redondeado hacia abajo) al final de cada turno.", // NEEDS QC
		shortDesc: "Envenenado, recupera 1/8 de sus PS por turno en vez de perderlos.", // NEEDS QC
	},
	poisonpoint: {
		name: "Punto Tóxico",
		shortDesc: "30% de envenenar a quien haga contacto.", // NEEDS QC
		gen4: {
			desc: "30% de probabilidad de que un Pokémon que haga contacto con este Pokémon quede envenenado. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
		},
		gen3: {
			desc: "1/3 de probabilidad de que un Pokémon que haga contacto con este Pokémon quede envenenado. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
			shortDesc: "1/3 de probabilidad de envenenar a quien haga contacto.", // NEEDS QC
		},
	},
	poisonpuppeteer: {
		name: "Títere Tóxico",
		desc: "Si este Pokémon es un Pecharunt y envenena o envenena gravemente a un objetivo, este también queda confuso.", // NEEDS QC
		shortDesc: "(Pecharunt) Sus envenenamientos también confunden al objetivo.", // NEEDS QC
	},
	poisontouch: {
		name: "Toque Tóxico",
		// Official flavor text: "Puede envenenar al objetivo con solo tocarlo."
		desc: "Los movimientos de contacto de este Pokémon tienen un 30% de probabilidad de envenenar. Este efecto se aplica después de la probabilidad de efecto secundario propia del movimiento.", // NEEDS QC
		shortDesc: "Sus movimientos de contacto tienen 30% de envenenar.", // NEEDS QC
	},
	powerconstruct: {
		name: "Agrupamiento",
		// Official flavor text: "Cuando sus PS se ven reducidos a la mitad, las células se reagrupan y adopta su Forma Completa."
		desc: "Si este Pokémon es un Zygarde en su Forma al 10% o al 50%, cambia a la Forma Completa cuando tiene la mitad o menos de sus PS máximos al final del turno.", // NEEDS QC
		shortDesc: "Zygarde 10%/50% pasa a Forma Completa con la mitad o menos de sus PS.", // NEEDS QC

		activate: "  Sientes múltiples presencias...",
		transform: "¡{POKEMON} ha adoptado la Forma Completa!",
	},
	powerofalchemy: {
		name: "Reacción Química",
		// Official flavor text: "Reacciona copiando la habilidad de un aliado debilitado."
		desc: "Este Pokémon copia la habilidad de un aliado que se debilita. Las habilidades que no puede copiar son: Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Comandar, Disfraz, Evocarrecuerdos, Don Floral, Predicción, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Títere Tóxico, Agrupamiento, Reacción Química, Paleosíntesis, Carga Cuark, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracaparazón, Teracambio, Teraformación 0, Calco, Superguarda, Modo Daruma y Cambio Heroico.", // NEEDS QC
		shortDesc: "Copia la habilidad de un aliado que se debilita.", // NEEDS QC
		gen8: {
			desc: "Este Pokémon copia la habilidad de un aliado que se debilita. No pueden copiarse Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Tragamisil, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco, Superguarda y Modo Daruma.", // NEEDS QC
		},
		gen7: {
			desc: "Este Pokémon copia la habilidad de un aliado que se debilita. No pueden copiarse Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Ilusión, Impostor, Multitipo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco, Superguarda y Modo Daruma.", // NEEDS QC
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "Fuente Energía",
		// Official flavor text: "Potencia los movimientos de los Pokémon adyacentes."
		desc: "La potencia de los movimientos de los aliados de este Pokémon se multiplica por 1,3. Afecta a Deseo Oculto y Premonición aunque el usuario no esté en el campo.", // NEEDS QC
		shortDesc: "Los movimientos de sus aliados tienen 1,3x de potencia.", // NEEDS QC
	},
	prankster: {
		name: "Bromista",
		// Official flavor text: "Sus movimientos de estado tienen prioridad alta."
		desc: "Los movimientos de estado de este Pokémon tienen su prioridad aumentada en 1. Los rivales de tipo Siniestro son inmunes a estos movimientos, y a los movimientos que estos llamen, si el usuario final tiene esta habilidad.", // NEEDS QC
		shortDesc: "Sus movimientos de estado tienen prioridad +1; Siniestro es inmune.", // NEEDS QC
		gen6: {
			desc: "Los movimientos que no causan daño de este Pokémon tienen su prioridad aumentada en 1.", // NEEDS QC
			shortDesc: "Sus movimientos que no causan daño tienen +1 prioridad.", // NEEDS QC
		},
	},
	pressure: {
		name: "Presión",
		// Official flavor text: "Presiona al rival para que sus PP se acaben antes."
		desc: "Si este Pokémon es objetivo de un movimiento rival, ese movimiento pierde 1 PP adicional. Sellar, Robo, Teraexplosión también pierden 1 PP adicional al ser usados por un rival, pero Red Viscosa no.", // NEEDS QC
		shortDesc: "Los movimientos rivales dirigidos a él pierden 1 PP adicional.", // NEEDS QC
		gen8: {
			desc: "Si este Pokémon es el objetivo de un movimiento rival, este pierde 1 PP adicional. Sellar y Robo también pierden 1 PP adicional al usarlos un rival, pero Red Viscosa no.", // NEEDS QC
		},
		gen5: {
			desc: "Si este Pokémon es el objetivo de un movimiento rival, este pierde 1 PP adicional. Sellar y Robo también pierden 1 PP adicional al usarlos un rival.", // NEEDS QC
		},
		gen4: {
			desc: "Si este Pokémon es el objetivo del movimiento de otro Pokémon, este pierde 1 PP adicional.", // NEEDS QC
			shortDesc: "Los movimientos dirigidos a este Pokémon pierden 1 PP adicional.", // NEEDS QC
		},

		start: "  ¡{POKEMON} ejerce presión!",
	},
	primordialsea: {
		name: "Mar del Albor",
		// Official flavor text: "Altera el clima para anular los ataques de tipo Fuego."
		desc: "Al entrar en combate, comienza un diluvio: incluye todos los efectos de la lluvia e impide ejecutar ataques de tipo Fuego. Este clima dura hasta que esta habilidad deje de estar activa en combate o el clima cambie por las habilidades Ráfaga Delta o Tierra del Ocaso.", // NEEDS QC
		shortDesc: "Al entrar, empieza un diluvio que dura mientras la habilidad esté activa.", // NEEDS QC
	},
	prismarmor: {
		name: "Armadura Prisma",
		shortDesc: "Recibe 3/4 del daño de los ataques supereficaces.", // NEEDS QC
	},
	propellertail: {
		name: "Hélice Caudal",
		shortDesc: "Sus movimientos no pueden ser redirigidos a otro objetivo.", // NEEDS QC
	},
	protean: {
		name: "Mutatipo",
		// Official flavor text: "Cambia su tipo al del movimiento que va a usar."
		desc: "El tipo de este Pokémon cambia al tipo del movimiento que va a usar. Este efecto se aplica después de todos los efectos que cambian el tipo de un movimiento. Solo se activa una vez por entrada en combate y no si está teracristalizado.", // NEEDS QC
		shortDesc: "Su tipo cambia al del movimiento que usa. Una vez por entrada.", // NEEDS QC
		gen8: {
			desc: "El tipo de este Pokémon pasa a ser el del movimiento que va a usar. Este efecto se aplica después de todos los efectos que cambian el tipo de un movimiento.", // NEEDS QC
			shortDesc: "Su tipo pasa a ser el del movimiento que va a usar.", // NEEDS QC
		},
	},
	protosynthesis: {
		name: "Paleosíntesis",
		desc: "Si hace sol o este Pokémon usa una Energía Potenciadora que lleve, su característica más alta se multiplica por 1,3 (o por 1,5 si es la Velocidad). Los cambios de nivel se consideran al activarse. En caso de empate, se prioriza Ataque, Defensa, Ataque Especial, Defensa Especial y Velocidad, en ese orden. Si el efecto empezó por el sol, la Energía Potenciadora no se activa y el efecto termina cuando el sol deja de estar activo. Si empezó por la Energía Potenciadora, termina cuando este Pokémon deja el combate.", // NEEDS QC
		shortDesc: "Con sol o Energía Potenciadora: mejor característica 1,3x (Vel.: 1,5x).", // NEEDS QC

		activate: "  ¡La habilidad Paleosíntesis de {POKEMON} se ha activado gracial al sol!",
		activateFromItem: "  ¡{POKEMON} ha usado la Energía Potenciadora para activar Paleosíntesis!",
		start: "  ¡{STAT:definite:capitalize} de {POKEMON} se ha reforzado!",
		end: "  ¡El efecto de Paleosíntesis de {POKEMON} ha desaparecido!",
	},
	psychicsurge: {
		name: "Psicogénesis",
		shortDesc: "Al entrar en combate, crea un campo psíquico.", // NEEDS QC
	},
	punkrock: {
		name: "Punk Rock",
		// Official flavor text: "Potencia los movimientos que usan sonido y reduce a la mitad el daño que le infligen dichos movimientos."
		desc: "La potencia de los movimientos de sonido de este Pokémon se multiplica por 1,3. Recibe la mitad de daño de los movimientos de sonido.", // NEEDS QC
		shortDesc: "Sus movimientos de sonido: 1,3x de potencia. Recibe la mitad de los ajenos.", // NEEDS QC
	},
	purepower: {
		name: "Energía Pura",
		shortDesc: "Su Ataque se duplica.", // NEEDS QC
	},
	purifyingsalt: {
		name: "Sal Purificadora",
		desc: "Este Pokémon no puede sufrir problemas de estado ni verse afectado por Bostezo. Los ataques de tipo Fantasma contra él se calculan con la característica ofensiva del atacante reducida a la mitad.", // NEEDS QC
		shortDesc: "Sin problemas de estado; el tipo Fantasma le hace la mitad de daño.", // NEEDS QC
	},
	quarkdrive: {
		name: "Carga Cuark",
		desc: "Si hay Campo Eléctrico o este Pokémon usa una Energía Potenciadora que lleve, su característica más alta se multiplica por 1,3 (o por 1,5 si es la Velocidad). Los cambios de nivel se consideran al activarse. En caso de empate, se prioriza Ataque, Defensa, Ataque Especial, Defensa Especial y Velocidad, en ese orden. Si el efecto empezó por el Campo Eléctrico, la Energía Potenciadora no se activa y el efecto termina cuando el Campo Eléctrico deja de estar activo. Si empezó por la Energía Potenciadora, termina cuando este Pokémon deja el combate.", // NEEDS QC
		shortDesc: "Con campo eléctrico o Energía Potenciadora: mejor característica 1,3x (Vel.: 1,5x).", // NEEDS QC

		activate: "  ¡La habilidad Carga Cuark de {POKEMON} se ha activado gracias al campo eléctrico!",
		activateFromItem: "  ¡{POKEMON} ha usado la Energía Potenciadora para activar Carga Cuark!",
		start: "  ¡{STAT:definite:capitalize} de {POKEMON} se ha reforzado!",
		end: "  ¡El efecto de Carga Cuark de {POKEMON} ha desaparecido!",
	},
	queenlymajesty: {
		name: "Regia Presencia",
		// Official flavor text: "Intimida al objetivo y le impide usar movimientos con prioridad."
		desc: "Los movimientos con prioridad de los rivales dirigidos a este Pokémon o a sus aliados no tienen efecto.", // NEEDS QC
		shortDesc: "Protege a este Pokémon y sus aliados de los movimientos con prioridad rivales.", // NEEDS QC

		block: "#damp",
	},
	quickdraw: {
		name: "Mano Rápida",
		shortDesc: "30% de actuar primero dentro de su prioridad con movimientos de ataque.", // NEEDS QC

		activate: "  ¡{POKEMON} ataca primero gracias a la habilidad Mano Rápida!",
	},
	quickfeet: {
		name: "Pies Rápidos",
		// Official flavor text: "Aumenta la Velocidad si sufre problemas de estado."
		desc: "Si este Pokémon tiene un problema de estado, su Velocidad se multiplica por 1,5 e ignora la reducción de la Velocidad a la mitad por la parálisis.", // NEEDS QC
		shortDesc: "Con un problema de estado, su Velocidad es 1,5x e ignora la parálisis.", // NEEDS QC
		gen6: {
			desc: "Si este Pokémon tiene un problema de estado, su Velocidad se multiplica por 1,5. Este Pokémon ignora la reducción de la Velocidad a 1/4 por la parálisis.", // NEEDS QC
		},
	},
	raindish: {
		name: "Cura Lluvia",
		// Official flavor text: "Recupera PS de forma gradual cuando llueve."
		desc: "Si llueve, este Pokémon recupera 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno. No se activa si lleva Parasol Multiuso.", // NEEDS QC
		shortDesc: "Si llueve, recupera 1/16 de sus PS máximos cada turno.", // NEEDS QC
		gen7: {
			desc: "Con lluvia, este Pokémon recupera 1/16 de sus PS máximos (redondeado hacia abajo) al final de cada turno.", // NEEDS QC
		},
	},
	rattled: {
		name: "Cobardía",
		// Official flavor text: "Si le alcanza un movimiento de tipo Siniestro, Bicho o Fantasma, el miedo hace que le suba la Velocidad."
		desc: "La Velocidad de este Pokémon sube 1 nivel si lo golpea un ataque de tipo Bicho, Siniestro o Fantasma, o si un rival lo afecta con la habilidad Intimidación.", // NEEDS QC
		shortDesc: "+1 Velocidad si lo golpea Bicho, Siniestro o Fantasma, o lo afecta Intimidación.", // NEEDS QC
		gen7: {
			desc: "La Velocidad de este Pokémon sube 1 nivel si lo golpea un ataque de tipo Bicho, Siniestro o Fantasma.", // NEEDS QC
			shortDesc: "Velocidad +1 si lo golpea un ataque de Bicho, Siniestro o Fantasma.", // NEEDS QC
		},
	},
	receiver: {
		name: "Receptor",
		// Official flavor text: "Adquiere la habilidad de un aliado debilitado."
		desc: "Este Pokémon copia la habilidad de un aliado que se debilita. Las habilidades que no puede copiar son: Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Comandar, Disfraz, Evocarrecuerdos, Don Floral, Predicción, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Títere Tóxico, Agrupamiento, Reacción Química, Paleosíntesis, Carga Cuark, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracaparazón, Teracambio, Teraformación 0, Calco, Superguarda, Modo Daruma y Cambio Heroico.", // NEEDS QC
		shortDesc: "Copia la habilidad de un aliado que se debilita.", // NEEDS QC
		gen8: {
			desc: "Este Pokémon copia la habilidad de un aliado que se debilita. No pueden copiarse Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Tragamisil, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco, Superguarda y Modo Daruma.", // NEEDS QC
		},
		gen7: {
			desc: "Este Pokémon copia la habilidad de un aliado que se debilita. No pueden copiarse Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Ilusión, Impostor, Multitipo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco, Superguarda y Modo Daruma.", // NEEDS QC
		},

		changeAbility: "  ¡El Pokémon ha recibido la habilidad {ABILITY} de {SOURCE}!",
	},
	reckless: {
		name: "Audaz",
		// Official flavor text: "Potencia los movimientos que también dañan al usuario."
		desc: "La potencia de los ataques con retroceso o daño por fallo de este Pokémon se multiplica por 1,2. No afecta a Forcejeo.", // NEEDS QC
		shortDesc: "Sus ataques con retroceso tienen 1,2x de potencia (no Forcejeo).", // NEEDS QC
	},
	refrigerate: {
		name: "Piel Helada",
		// Official flavor text: "Convierte los movimientos de tipo Normal en tipo Hielo y aumenta ligeramente su potencia."
		desc: "Los movimientos de tipo Normal de este Pokémon se convierten en tipo Hielo y su potencia se multiplica por 1,2. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, pero antes de los efectos de Cortina Plasma y Electrificación.", // NEEDS QC
		shortDesc: "Sus movimientos de tipo Normal son de tipo Hielo y tienen 1,2x de potencia.", // NEEDS QC
		gen6: {
			desc: "Los movimientos de tipo Normal de este Pokémon se convierten en tipo Hielo y su potencia se multiplica por 1,3. Este efecto se aplica después de otros efectos que cambian el tipo de un movimiento, pero antes de los efectos de Cortina Plasma y Electrificación.", // NEEDS QC
			shortDesc: "Los movimientos Normal de este Pokémon pasan a tipo Hielo con 1,3x potencia.", // NEEDS QC
		},
	},
	regenerator: {
		name: "Regeneración",
		shortDesc: "Recupera 1/3 de sus PS máximos al cambiarse.", // NEEDS QC
	},
	ripen: {
		name: "Maduración",
		// Official flavor text: "Hace madurar las bayas, por lo que duplica sus efectos."
		desc: "Cuando este Pokémon come ciertas bayas, sus efectos se duplican: las que restauran PS o PP restauran el doble, las que suben características suben el doble, las que reducen el daño a la mitad lo reducen a 1/4, y con Baya Jaboca o Baya Magua el atacante pierde 1/4 de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		shortDesc: "Duplica los efectos de las bayas que come.", // NEEDS QC
	},
	rivalry: {
		name: "Rivalidad",
		// Official flavor text: "Si el objetivo es del mismo sexo, su competitividad le lleva a infligir más daño. Si es del sexo contrario, en cambio, el daño será menor."
		desc: "Los ataques de este Pokémon tienen su potencia multiplicada por 1,25 contra objetivos del mismo sexo y por 0,75 contra los del sexo opuesto. Sin modificador si alguno no tiene sexo.", // NEEDS QC
		shortDesc: "Hace 1,25x de daño al mismo sexo y 0,75x al sexo opuesto.", // NEEDS QC
	},
	rkssystem: {
		name: "Sistema Alfa",
		shortDesc: "El tipo de Silvally cambia según el disco que lleve.", // NEEDS QC
	},
	rockhead: {
		name: "Cabeza Roca",
		// Official flavor text: "No puede dañarse con sus propios movimientos."
		desc: "Este Pokémon no recibe daño de retroceso, salvo el de Forcejeo. No afecta al daño de Vidasfera ni al daño por fallo.", // NEEDS QC
		shortDesc: "Sin daño de retroceso, salvo Forcejeo; no evita Vidasfera ni el daño por fallo.", // NEEDS QC
		gen3: {
			desc: "Este Pokémon no recibe daño de retroceso, salvo el de Forcejeo. No afecta al daño por fallar.", // NEEDS QC
			shortDesc: "Sin retroceso, salvo el de Forcejeo y el daño por fallar.", // NEEDS QC
		},
	},
	rockypayload: {
		name: "Transportarrocas",
		shortDesc: "Sus ataques de tipo Roca usan 1,5x su característica ofensiva.", // NEEDS QC
	},
	roughskin: {
		name: "Piel Tosca",
		// Official flavor text: "Hiere con su piel áspera al rival que lo ataque con un movimiento de contacto."
		desc: "Los Pokémon que hacen contacto con este Pokémon pierden 1/8 de sus PS máximos (redondeado hacia abajo).", // NEEDS QC
		shortDesc: "Quien haga contacto con él pierde 1/8 de sus PS máximos.", // NEEDS QC
		gen4: {
			desc: "Los Pokémon que hagan contacto con este Pokémon pierden 1/8 de sus PS máximos (redondeado hacia abajo). No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
		},
		gen3: {
			desc: "Los Pokémon que hagan contacto con este Pokémon pierden 1/16 de sus PS máximos (redondeado hacia abajo). No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
			shortDesc: "Quien haga contacto con él pierde 1/16 de sus PS máximos.", // NEEDS QC
		},

		damage: "  ¡{POKEMON} ha resultado herido!",
	},
	runaway: {
		name: "Fuga",
		shortDesc: "Sin uso competitivo.", // NEEDS QC
	},
	sandforce: {
		name: "Poder Arena",
		// Official flavor text: "Potencia los movimientos de tipo Tierra, Acero y Roca durante las tormentas de arena."
		desc: "Con tormenta de arena, la potencia de los ataques de tipo Tierra, Roca y Acero de este Pokémon se multiplica por 1,3. No recibe daño de la tormenta de arena.", // NEEDS QC
		shortDesc: "En tormenta de arena: Tierra/Roca/Acero 1,3x; inmune a la arena.", // NEEDS QC
	},
	sandrush: {
		name: "Ímpetu Arena",
		// Official flavor text: "Aumenta su Velocidad durante las tormentas de arena."
		desc: "Con tormenta de arena, la Velocidad de este Pokémon se duplica. No recibe daño de la tormenta de arena.", // NEEDS QC
		shortDesc: "En tormenta de arena, su Velocidad se duplica; inmune a la arena.", // NEEDS QC
	},
	sandspit: {
		name: "Expulsarena",
		shortDesc: "Al recibir un golpe, invoca una tormenta de arena.", // NEEDS QC
		gen8: {
			desc: "Cuando este Pokémon recibe un ataque, empieza el efecto de la tormenta de arena. Este efecto viene después de los efectos de los movimientos Dinamax.", // NEEDS QC
		},
	},
	sandstream: {
		name: "Chorro Arena",
		shortDesc: "Al entrar en combate, invoca una tormenta de arena.", // NEEDS QC
	},
	sandveil: {
		name: "Velo Arena",
		// Official flavor text: "Aumenta su Evasión durante las tormentas de arena."
		desc: "Con tormenta de arena, la precisión de los movimientos usados contra este Pokémon se multiplica por 0,8. No recibe daño de la tormenta de arena.", // NEEDS QC
		shortDesc: "En tormenta de arena, su evasión es 1,25x; inmune a la arena.", // NEEDS QC
	},
	sapsipper: {
		name: "Herbívoro",
		// Official flavor text: "Neutraliza los movimientos de tipo Planta y sube su Ataque."
		desc: "Este Pokémon es inmune a los movimientos de tipo Planta y su Ataque sube 1 nivel al ser golpeado por uno.", // NEEDS QC
		shortDesc: "Inmune al tipo Planta: +1 Ataque si lo golpea uno.", // NEEDS QC
	},
	schooling: {
		name: "Banco",
		// Official flavor text: "Forma bancos con sus congéneres cuando tiene muchos PS, lo cual le otorga más fuerza. Cuando le quedan pocos PS, el banco se dispersa."
		desc: "Al entrar en combate, si este Pokémon es un Wishiwashi de nivel 20 o más con más de 1/4 de sus PS máximos, cambia a la Forma Banco. Si está en Forma Banco y sus PS caen a 1/4 o menos, vuelve a la Forma Individual al final del turno. Si está en Forma Individual y tiene más de 1/4 al final del turno, cambia a la Forma Banco.", // NEEDS QC
		shortDesc: "Wishiwashi adopta la Forma Banco con más de 1/4 de sus PS.", // NEEDS QC

		transform: "¡{POKEMON} ha formado un banco!",
		transformEnd: "¡El banco de {POKEMON} se ha dispersado!",
	},
	scrappy: {
		name: "Intrépido",
		// Official flavor text: "Puede alcanzar a Pokémon de tipo Fantasma con movimientos de tipo Normal o Lucha."
		desc: "Los movimientos de tipo Normal y Lucha de este Pokémon pueden golpear a los de tipo Fantasma. Es inmune al efecto de la habilidad Intimidación.", // NEEDS QC
		shortDesc: "Normal y Lucha golpean a Fantasma. Inmune a Intimidación.", // NEEDS QC
		gen7: {
			desc: "Este Pokémon puede golpear a los tipos Fantasma con movimientos de tipo Normal y Lucha.", // NEEDS QC
			shortDesc: "Puede golpear a los Fantasma con movimientos Normal y Lucha.", // NEEDS QC
		},
	},
	screencleaner: {
		name: "Antibarrera",
		shortDesc: "Al entrar, terminan Velo Aurora, Pantalla de Luz y Reflejo de ambos bandos.", // NEEDS QC
	},
	seedsower: {
		name: "Disemillar",
		shortDesc: "Al recibir un golpe, crea un campo de hierba.", // NEEDS QC
	},
	serenegrace: {
		name: "Dicha",
		// Official flavor text: "Aumenta la probabilidad de que los movimientos causen efectos secundarios."
		desc: "La probabilidad de los efectos secundarios de los movimientos de este Pokémon se duplica. Se acumula con el efecto del arcoíris, salvo para los efectos que hacen retroceder.", // NEEDS QC
		shortDesc: "Duplica la probabilidad de los efectos secundarios de sus movimientos.", // NEEDS QC
		gen4: {
			desc: "Los movimientos de este Pokémon tienen su probabilidad de efecto secundario duplicada.", // NEEDS QC
		},
	},
	shadowshield: {
		name: "Guardia Espectro",
		shortDesc: "Con todos sus PS, recibe la mitad de daño de los ataques.", // NEEDS QC
	},
	shadowtag: {
		name: "Sombra Trampa",
		// Official flavor text: "Impide que el enemigo huya o sea cambiado por otro."
		desc: "Impide que los rivales elijan cambiarse, salvo que lleven Muda Concha, sean de tipo Fantasma o también tengan esta habilidad.", // NEEDS QC
		shortDesc: "Impide a los rivales cambiarse, salvo que también la tengan.", // NEEDS QC
		gen6: {
			desc: "Impide que los rivales adyacentes elijan cambiarse, salvo que lleven Muda Concha, sean de tipo Fantasma o también tengan esta habilidad.", // NEEDS QC
			shortDesc: "Los rivales adyacentes solo pueden cambiarse si también tienen esta habilidad.", // NEEDS QC
		},
		gen5: {
			desc: "Impide que los rivales adyacentes elijan cambiarse, salvo que lleven Muda Concha o también tengan esta habilidad.", // NEEDS QC
		},
		gen4: {
			desc: "Impide que los rivales elijan cambiarse, salvo que lleven Muda Concha o también tengan esta habilidad.", // NEEDS QC
			shortDesc: "Impide a los rivales cambiarse, salvo que también la tengan.", // NEEDS QC
		},
		gen3: {
			desc: "Impide que los rivales elijan cambiarse.", // NEEDS QC
			shortDesc: "Los rivales no pueden elegir cambiarse.", // NEEDS QC
		},
	},
	sharpness: {
		name: "Cortante",
		shortDesc: "Sus movimientos cortantes tienen 1,5x de potencia.", // NEEDS QC
	},
	shedskin: {
		name: "Mudar",
		// Official flavor text: "Puede curar sus problemas de estado al mudar la piel."
		desc: "Al final de cada turno, este Pokémon tiene un 33% de probabilidad de curar su problema de estado.", // NEEDS QC
		shortDesc: "33% de curar su problema de estado al final de cada turno.", // NEEDS QC
	},
	sheerforce: {
		name: "Potencia Bruta",
		// Official flavor text: "Sube la potencia de sus movimientos en detrimento de los efectos secundarios, que se ven anulados."
		desc: "La potencia de los ataques con efecto secundario de este Pokémon se multiplica por 1,3, pero pierden dichos efectos. Si se eliminó un efecto secundario, también se anulan el retroceso de Vidasfera y la recuperación de Cascabel Concha del usuario, y no se activan Coraza Ira, Cólera, Cambio Color, Retirada, Hurto, Huida ni Tarjeta Roja, Botón Escape, Baya Biglia o Baya Maranga del objetivo.", // NEEDS QC
		shortDesc: "Sus ataques con efecto secundario: 1,3x de potencia, sin el efecto.", // NEEDS QC
		gen8: {
			desc: "Los ataques de este Pokémon con efectos secundarios tienen su potencia multiplicada por 1,3, pero pierden sus efectos secundarios. Si se eliminó un efecto secundario, también se eliminan el retroceso de Vidasfera y la curación de Cascabel Concha del usuario, y se impide que se activen Cólera, Cambio Color, Retirada, Hurto, Huida, Tarjeta Roja, Botón Escape, Baya Biglia y Baya Maranga del objetivo.", // NEEDS QC
		},
		gen6: {
			desc: "Los ataques de este Pokémon con efectos secundarios tienen su potencia multiplicada por 1,3, pero pierden sus efectos secundarios. Si se eliminó un efecto secundario, también se eliminan el retroceso de Vidasfera y la curación de Cascabel Concha del usuario, y se impide que se activen Cambio Color, Hurto, Tarjeta Roja, Botón Escape, Baya Biglia y Baya Maranga del objetivo.", // NEEDS QC
		},
		gen5: {
			desc: "Los ataques de este Pokémon con efectos secundarios tienen su potencia multiplicada por 1,3, pero pierden sus efectos secundarios. Si se eliminó un efecto secundario, también se eliminan el retroceso de Vidasfera y la curación de Cascabel Concha del usuario, y se impide que se activen Cambio Color, Hurto, Tarjeta Roja y Botón Escape del objetivo.", // NEEDS QC
		},
	},
	shellarmor: {
		name: "Caparazón",
		shortDesc: "No puede recibir golpes críticos.", // NEEDS QC
	},
	shielddust: {
		name: "Polvo Escudo",
		// Official flavor text: "El polvo de escamas que lo envuelve lo protege de los efectos secundarios de los ataques recibidos."
		desc: "Este Pokémon no se ve afectado por los efectos secundarios de los ataques de otros Pokémon. Entre los efectos evitados se incluyen los que tienen una probabilidad (incluso del 100%) de causar parálisis, sueño, congelación, quemadura, envenenamiento o confusión, de hacerlo retroceder o de bajar sus características, así como los efectos de Anclaje, Conjuro Funesto, Lanzamiento, Psicorruido, Salazón, Puntada Sombría, Bomba Caramelo, Golpe Mordaza. El efecto de Aria Burbuja se evita solo si este Pokémon es el único objetivo. También se evitan los efectos añadidos por Roca del Rey, Colmillo Agudo y las habilidades Toque Tóxico, Hedor y Cadena Tóxica.", // NEEDS QC
		shortDesc: "No sufre los efectos secundarios de los ataques ajenos.", // NEEDS QC
		gen8: {
			desc: "Este Pokémon no se ve afectado por los efectos secundarios de los ataques de otros Pokémon. Se impiden los ataques con probabilidad (incluso del 100%) de paralizar, dormir, congelar, quemar, envenenar, confundir, hacer retroceder a este Pokémon o bajar sus características, así como Anclaje, Conjuro Funesto, Lanzamiento, Puntada Sombría, Golpe Mordaza. El efecto de Aria Burbuja se impide si este Pokémon es el único objetivo. Los efectos secundarios añadidos por Roca del Rey, Colmillo Agudo y las habilidades Toque Tóxico y Hedor también se impiden contra este Pokémon.", // NEEDS QC
		},
		gen7: {
			desc: "Este Pokémon no se ve afectado por los efectos secundarios de los ataques de otros Pokémon. Se impiden los ataques con probabilidad (incluso del 100%) de paralizar, dormir, congelar, quemar, envenenar, confundir, hacer retroceder a este Pokémon o bajar sus características, así como Anclaje, Lanzamiento, Puntada Sombría, Golpe Mordaza. El efecto de Aria Burbuja se impide si este Pokémon es el único objetivo. Los efectos secundarios añadidos por Roca del Rey, Colmillo Agudo y las habilidades Toque Tóxico y Hedor también se impiden contra este Pokémon.", // NEEDS QC
		},
		gen6: {
			desc: "Este Pokémon no se ve afectado por los efectos secundarios de los ataques de otros Pokémon. Se impiden los ataques con probabilidad (incluso del 100%) de paralizar, dormir, congelar, quemar, envenenar, confundir, hacer retroceder a este Pokémon o bajar sus características, así como Lanzamiento. Los efectos secundarios añadidos por Roca del Rey, Colmillo Agudo y las habilidades Toque Tóxico y Hedor también se impiden contra este Pokémon.", // NEEDS QC
		},
		gen4: {
			desc: "Este Pokémon no se ve afectado por los efectos secundarios de los ataques de otros Pokémon. Se impiden los ataques con probabilidad (incluso del 100%) de paralizar, dormir, congelar, quemar, envenenar, confundir, hacer retroceder a este Pokémon o bajar sus características, así como Lanzamiento. Los efectos secundarios añadidos por Roca del Rey y Colmillo Agudo también se impiden contra este Pokémon.", // NEEDS QC
		},
		gen3: {
			desc: "Este Pokémon no se ve afectado por los efectos secundarios de los ataques de otros Pokémon. Se impiden los ataques con probabilidad (incluso del 100%) de paralizar, dormir, congelar, quemar, envenenar, confundir, hacer retroceder a este Pokémon o bajar sus características. El efecto secundario añadido por Roca del Rey también se impide contra este Pokémon.", // NEEDS QC
		},
	},
	shieldsdown: {
		name: "Escudo Limitado",
		// Official flavor text: "Rompe su coraza cuando sus PS se ven reducidos a la mitad y adopta una forma ofensiva."
		desc: "Si este Pokémon es un Minior, cambia a su Forma Núcleo cuando tiene la mitad o menos de sus PS máximos y a su Forma Meteorito cuando tiene más de la mitad. Se comprueba al entrar en combate y al final de cada turno. En su Forma Meteorito no puede sufrir problemas de estado ni verse afectado por Bostezo.", // NEEDS QC
		shortDesc: "Minior alterna entre Forma Meteorito y Núcleo según sus PS.", // NEEDS QC

		transform: "¡Escudo Limitado activado!",
		transformEnd: "Escudo Limitado desactivado.",
	},
	simple: {
		name: "Simple",
		shortDesc: "Los cambios de características que recibe se duplican.", // NEEDS QC
		gen7: {
			desc: "Cuando una característica de este Pokémon sube o baja, el cambio se duplica. Esta habilidad no afecta a las subidas por efectos del Poder Z antes de usar un movimiento Z de estado.", // NEEDS QC
		},
		gen6: {
			desc: "Cuando una característica de este Pokémon sube o baja, el cambio se duplica.", // NEEDS QC
		},
		gen4: {
			desc: "Los niveles de características de este Pokémon se consideran duplicados en los cálculos. Un nivel no puede considerarse mayor que 6 ni menor que -6.", // NEEDS QC
			shortDesc: "Sus niveles de características se consideran duplicados en los cálculos.", // NEEDS QC
		},
	},
	skilllink: {
		name: "Encadenado",
		// Official flavor text: "Ejecuta siempre los movimientos múltiples con el número máximo de golpes."
		desc: "Los ataques multigolpe de este Pokémon siempre golpean el número máximo de veces. Triple Patada y Triple Axel no comprueban la precisión en el segundo y tercer golpe.", // NEEDS QC
		shortDesc: "Sus ataques multigolpe siempre golpean el número máximo de veces.", // NEEDS QC
		gen7: {
			desc: "Los movimientos multigolpe de este Pokémon siempre golpean el número máximo de veces. Triple Patada no comprueba la precisión en el segundo y tercer golpe.", // NEEDS QC
		},
		gen4: {
			desc: "Los movimientos multigolpe de este Pokémon siempre golpean el número máximo de veces. No afecta a Triple Patada.", // NEEDS QC
		},
	},
	slowstart: {
		name: "Inicio Lento",
		shortDesc: "Al entrar, su Ataque y Velocidad se reducen a la mitad durante 5 turnos.", // NEEDS QC
		gen7: {
			desc: "Al entrar en combate, el Ataque y la Velocidad de este Pokémon se reducen a la mitad durante 5 turnos. Durante el efecto, si usa un movimiento Z genérico basado en un movimiento especial, su Ataque Especial se reduce a la mitad en el cálculo de daño.", // NEEDS QC
		},
		gen6: {
			desc: "Al entrar en combate, el Ataque y la Velocidad de este Pokémon se reducen a la mitad durante 5 turnos.", // NEEDS QC
		},

		start: "  ¡{POKEMON} no rinde todo lo que podría!",
		end: "  ¡{POKEMON} ahora va a a por todas!",
	},
	slushrush: {
		name: "Quitanieves",
		shortDesc: "Si nieva, su Velocidad se duplica.", // NEEDS QC
		gen8: {
			shortDesc: "Con granizo, la Velocidad de este Pokémon se duplica.", // NEEDS QC
		},
	},
	sniper: {
		name: "Francotirador",
		shortDesc: "El daño de sus golpes críticos se multiplica por 1,5.", // NEEDS QC
	},
	snowcloak: {
		name: "Manto Níveo",
		// Official flavor text: "Sube la Evasión cuando graniza."
		desc: "Si nieva, la precisión de los movimientos usados contra este Pokémon se multiplica por 0,8.", // NEEDS QC
		shortDesc: "Si nieva, su evasión se multiplica por 1,25.", // NEEDS QC
		gen8: {
			desc: "Con granizo, la precisión de los movimientos usados contra este Pokémon se multiplica por 0,8. Este Pokémon no recibe daño del granizo.", // NEEDS QC
			shortDesc: "Con granizo: evasión x1,25; inmune al granizo.", // NEEDS QC
		},
	},
	snowwarning: {
		name: "Nevada",
		shortDesc: "Al entrar en combate, invoca la nieve.", // NEEDS QC
		gen8: {
			shortDesc: "Al entrar en combate, este Pokémon invoca el granizo.", // NEEDS QC
		},
	},
	solarpower: {
		name: "Poder Solar",
		// Official flavor text: "Si hace sol, aumenta su Ataque Especial, pero pierde PS en cada turno."
		desc: "Si hace sol, el Ataque Especial de este Pokémon se multiplica por 1,5 y pierde 1/8 de sus PS máximos (redondeado hacia abajo) al final de cada turno. Estos efectos no se activan si lleva Parasol Multiuso.", // NEEDS QC
		shortDesc: "Con sol: su Ataque Esp. es 1,5x, pero pierde 1/8 de sus PS por turno.", // NEEDS QC
		gen7: {
			desc: "Con sol, el Ataque Especial de este Pokémon se multiplica por 1,5 y pierde 1/8 de sus PS máximos (redondeado hacia abajo) al final de cada turno.", // NEEDS QC
		},
	},
	solidrock: {
		name: "Roca Sólida",
		shortDesc: "Recibe 3/4 del daño de los ataques supereficaces.", // NEEDS QC
	},
	soulheart: {
		name: "Coránima",
		shortDesc: "Su Ataque Esp. sube 1 nivel cada vez que un Pokémon se debilita.", // NEEDS QC
	},
	soundproof: {
		name: "Insonorizar",
		shortDesc: "Inmune a los movimientos de sonido (salvo los propios).", // NEEDS QC
		gen7: {
			shortDesc: "Inmune a los movimientos de sonido, incluido Cascabel Cura.", // NEEDS QC
		},
		gen5: {
			shortDesc: "Inmune a los movimientos de sonido, salvo Cascabel Cura.", // NEEDS QC
		},
		gen4: {
			shortDesc: "Inmune a los movimientos de sonido, incluido Cascabel Cura.", // NEEDS QC
		},
	},
	speedboost: {
		name: "Impulso",
		// Official flavor text: "Aumenta su Velocidad en cada turno."
		desc: "La Velocidad de este Pokémon sube 1 nivel al final de cada turno completo que pase en combate.", // NEEDS QC
		shortDesc: "Su Velocidad sube 1 nivel al final de cada turno completo en combate.", // NEEDS QC
	},
	spicyspray: {
		name: "Salpicante",
		shortDesc: "Quema a quien lo golpee con un ataque.", // NEEDS QC
	},
	stakeout: {
		name: "Vigilante",
		shortDesc: "Su ofensiva se duplica contra objetivos que entren ese turno.", // NEEDS QC
	},
	stall: {
		name: "Rezagado",
		shortDesc: "Actúa el último dentro de su prioridad.", // NEEDS QC
	},
	stalwart: {
		name: "Acérrimo",
		shortDesc: "Sus movimientos no pueden ser redirigidos a otro objetivo.", // NEEDS QC
	},
	stamina: {
		name: "Firmeza",
		shortDesc: "Su Defensa sube 1 nivel al recibir daño de un movimiento.", // NEEDS QC
	},
	stancechange: {
		name: "Cambio Táctico",
		// Official flavor text: "Adopta la Forma Filo al lanzar un ataque, o bien la Forma Escudo si usa el movimiento Escudo Real."
		desc: "Si este Pokémon es un Aegislash, cambia a la Forma Filo antes de usar un ataque y a la Forma Escudo antes de usar Escudo Real.", // NEEDS QC
		shortDesc: "Aegislash cambia a Forma Filo al atacar y a Escudo con Escudo Real.", // NEEDS QC
		gen6: {
			desc: "Si este Pokémon es un Aegislash, cambia a la Forma Filo antes de intentar usar un movimiento de ataque y a la Forma Escudo antes de intentar usar Escudo Real.", // NEEDS QC
		},

		transform: "¡Cambio a Forma Filo!",
		transformEnd: "¡Cambio a Forma Escudo!",
	},
	static: {
		name: "Electricidad Estática",
		shortDesc: "30% de paralizar a quien haga contacto.", // NEEDS QC
		gen4: {
			desc: "30% de probabilidad de que un Pokémon que haga contacto con este Pokémon quede paralizado. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
		},
		gen3: {
			desc: "1/3 de probabilidad de que un Pokémon que haga contacto con este Pokémon quede paralizado. No ocurre si este Pokémon no perdió PS con el ataque.", // NEEDS QC
			shortDesc: "1/3 de probabilidad de paralizar a quien haga contacto.", // NEEDS QC
		},
	},
	steadfast: {
		name: "Impasible",
		shortDesc: "Su Velocidad sube 1 nivel cada vez que retrocede.", // NEEDS QC
	},
	steamengine: {
		name: "Combustible",
		// Official flavor text: "Si le alcanza un movimiento de tipo Fuego o Agua, le sube muchísimo la Velocidad."
		desc: "La Velocidad de este Pokémon sube 6 niveles tras recibir daño de un movimiento de tipo Fuego o Agua.", // NEEDS QC
		shortDesc: "Su Velocidad sube 6 niveles si lo daña Fuego o Agua.", // NEEDS QC
	},
	steelworker: {
		name: "Acero Templado",
		shortDesc: "Sus ataques de tipo Acero usan 1,5x su característica ofensiva.", // NEEDS QC
	},
	steelyspirit: {
		name: "Alma Acerada",
		// Official flavor text: "Potencia los movimientos de tipo Acero de los aliados."
		desc: "La potencia de los movimientos de tipo Acero de este Pokémon y sus aliados se multiplica por 1,5. Afecta a Deseo Oculto aunque el usuario no esté en el campo.", // NEEDS QC
		shortDesc: "Los movimientos de tipo Acero suyos y de sus aliados: 1,5x de potencia.", // NEEDS QC
	},
	stench: {
		name: "Hedor",
		// Official flavor text: "Puede amedrentar al rival al atacarlo debido al mal olor que emana."
		desc: "Los ataques de este Pokémon que no tengan probabilidad de hacer retroceder al objetivo obtienen un 10% de probabilidad de hacerlo retroceder.", // NEEDS QC
		shortDesc: "Sus ataques sin probabilidad de hacer retroceder ganan un 10% de causarlo.", // NEEDS QC
		gen4: {
			desc: "Sin uso competitivo.", // NEEDS QC
			shortDesc: "Sin uso competitivo.", // NEEDS QC
		},
	},
	stickyhold: {
		name: "Viscosidad",
		// Official flavor text: "Los objetos se quedan pegados a su cuerpo, por lo que no pueden robárselos."
		desc: "Este Pokémon no puede perder su objeto por habilidades o ataques de otros Pokémon, salvo que el ataque lo debilite. Toxiestrella sí puede transferirse a otros Pokémon.", // NEEDS QC
		shortDesc: "No puede perder su objeto por habilidades o ataques ajenos.", // NEEDS QC
		gen4: {
			desc: "Este Pokémon no puede perder su objeto por el ataque de otro Pokémon, aunque el ataque lo debilite. Toxiestrella se transfiere a otros Pokémon a pesar de esta habilidad.", // NEEDS QC
		},

		block: "  ¡Es imposible robarle objetos a {POKEMON}!",
	},
	stormdrain: {
		name: "Colector",
		// Official flavor text: "Atrae y neutraliza los movimientos de tipo Agua, que además le suben el Ataque Especial."
		desc: "Este Pokémon es inmune a los movimientos de tipo Agua y su Ataque Especial sube 1 nivel al ser golpeado por uno. Si un movimiento de tipo Agua de un solo objetivo de otro Pokémon no lo tiene como objetivo y está a su alcance, lo atrae hacia sí. Si varios Pokémon pueden atraerlo, lo hace el más rápido; en caso de empate, aquel cuya habilidad lleve más tiempo activa.", // NEEDS QC
		shortDesc: "Atrae los movimientos de Agua: los anula y gana +1 Ataque Esp.", // NEEDS QC
		gen4: {
			desc: "Si este Pokémon no es el objetivo de un movimiento de tipo Agua de objetivo único usado por otro Pokémon, lo redirige hacia sí mismo.", // NEEDS QC
			shortDesc: "Atrae hacia sí los movimientos de Agua de objetivo único.", // NEEDS QC
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "Mandíbula Fuerte",
		// Official flavor text: "Su robusta mandíbula le confiere una mordedura potente."
		desc: "La potencia de los ataques de mordisco de este Pokémon se multiplica por 1,5.", // NEEDS QC
		shortDesc: "Sus ataques de mordisco tienen 1,5x de potencia (no Picadura).", // NEEDS QC
	},
	sturdy: {
		name: "Robustez",
		// Official flavor text: "Evita que el rival pueda debilitarlo de un solo golpe cuando tiene los PS al máximo. También evita los movimientos fulminantes."
		desc: "Si este Pokémon tiene todos sus PS, sobrevive a un golpe con al menos 1 PS. Los movimientos fulminantes no le afectan.", // NEEDS QC
		shortDesc: "Con todos sus PS, sobrevive a un golpe con 1 PS. Inmune a fulminantes.", // NEEDS QC
		gen4: {
			desc: "Los movimientos fulminantes fallan contra este Pokémon.", // NEEDS QC
			shortDesc: "Los movimientos fulminantes fallan contra él.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} ha aguantado el golpe!",
	},
	suctioncups: {
		name: "Ventosas",
		shortDesc: "No puede ser obligado a cambiarse por ataques u objetos ajenos.", // NEEDS QC

		block: "  ¡{POKEMON} se aferra al suelo gracias a la habilidad Ventosas!",
	},
	superluck: {
		name: "Afortunado",
		shortDesc: "Su índice de golpe crítico sube 1 nivel.", // NEEDS QC
	},
	supersweetsyrup: {
		name: "Néctar Dulce",
		shortDesc: "Al entrar, baja 1 nivel la evasión de los rivales. Una vez por combate.", // NEEDS QC

		start: "  ¡El néctar de {POKEMON} desprende un aroma dulzón!",
	},
	supremeoverlord: {
		name: "General Supremo",
		desc: "La potencia de los movimientos de este Pokémon se multiplica por 1+(X×0,1), donde X es el número de veces que un Pokémon de su equipo se ha debilitado cuando se activó esta habilidad (máximo 5).", // NEEDS QC
		shortDesc: "Sus movimientos ganan 10% de potencia por cada aliado debilitado (máx. 5).", // NEEDS QC

		activate: "  ¡{POKEMON} recibe fuerzas de los aliados caídos!",
	},
	surgesurfer: {
		name: "Cola Surf",
		shortDesc: "En campo eléctrico, su Velocidad se duplica.", // NEEDS QC
	},
	swarm: {
		name: "Enjambre",
		// Official flavor text: "Potencia sus movimientos de tipo Bicho cuando le quedan pocos PS."
		desc: "Cuando este Pokémon tiene 1/3 o menos de sus PS máximos (redondeado hacia abajo), su característica ofensiva se multiplica por 1,5 al usar un ataque de tipo Bicho.", // NEEDS QC
		shortDesc: "Con 1/3 o menos de sus PS, sus ataques de Bicho usan 1,5x su ofensiva.", // NEEDS QC
		gen4: {
			desc: "Cuando este Pokémon tiene 1/3 o menos de sus PS máximos (redondeado hacia abajo), la potencia de sus ataques de tipo Bicho se multiplica por 1,5.", // NEEDS QC
			shortDesc: "Con 1/3 o menos de sus PS máx., sus ataques de Bicho tienen 1,5x potencia.", // NEEDS QC
		},
	},
	sweetveil: {
		name: "Velo Dulce",
		// Official flavor text: "No cae dormido y evita también que sus aliados se duerman."
		desc: "Este Pokémon y sus aliados no pueden quedarse dormidos, pero los ya dormidos no se despiertan. No pueden usar Descanso con éxito ni verse afectados por Bostezo, y los ya afectados no se dormirán.", // NEEDS QC
		shortDesc: "Ni él ni sus aliados pueden quedarse dormidos.", // NEEDS QC

		block: "  ¡{POKEMON} no se ha dormido debido al efecto de Velo Dulce!",
	},
	swiftswim: {
		name: "Nado Rápido",
		// Official flavor text: "Sube su Velocidad cuando llueve."
		desc: "Si llueve, la Velocidad de este Pokémon se duplica. No se activa si lleva Parasol Multiuso.", // NEEDS QC
		shortDesc: "Si llueve, su Velocidad se duplica.", // NEEDS QC
		gen7: {
			desc: "Con lluvia, la Velocidad de este Pokémon se duplica.", // NEEDS QC
		},
	},
	swordofruin: {
		name: "Espada Debacle",
		shortDesc: "La Defensa de los demás Pokémon en combate se multiplica por 0,75.", // NEEDS QC

		start: "  ¡{POKEMON} ha mermado la Defensa de los demás Pokémon con Espada Debacle!",
	},
	symbiosis: {
		name: "Simbiosis",
		// Official flavor text: "Pasa su objeto a un aliado que ya haya utilizado el suyo."
		desc: "Cuando un aliado usa su objeto, este Pokémon le da el suyo de inmediato. No se activa si el objeto del aliado fue robado o derribado, ni si usó Botón Escape o Mochila Escape.", // NEEDS QC
		shortDesc: "Cuando un aliado usa su objeto, le da el suyo de inmediato.", // NEEDS QC
		gen7: {
			desc: "Si un aliado usa su objeto, este Pokémon le da el suyo de inmediato. No se activa si el objeto del aliado fue robado o eliminado, o si el aliado usó un Botón Escape.", // NEEDS QC
		},
		gen6: {
			desc: "Si un aliado usa su objeto, este Pokémon le da el suyo de inmediato. No se activa si el objeto del aliado fue robado o eliminado.", // NEEDS QC
		},

		activate: "  ¡{POKEMON} le ha dado {ITEM:definite:classified} a {TARGET}!",
	},
	synchronize: {
		name: "Sincronía",
		// Official flavor text: "Contagia el envenenamiento, las quemaduras o la parálisis al Pokémon que le cause ese estado."
		desc: "Si otro Pokémon quema, paraliza, envenena o envenena gravemente a este Pokémon, ese Pokémon sufre el mismo problema de estado.", // NEEDS QC
		shortDesc: "Contagia la quemadura, el envenenamiento o la parálisis a quien se los cause.", // NEEDS QC
		gen4: {
			desc: "Si otro Pokémon quema, paraliza o envenena a este Pokémon, ese Pokémon recibe el mismo problema de estado. Si otro Pokémon envenena gravemente a este Pokémon, queda envenenado (no gravemente).", // NEEDS QC
		},
	},
	tabletsofruin: {
		name: "Tablilla Debacle",
		shortDesc: "El Ataque de los demás Pokémon en combate se multiplica por 0,75.", // NEEDS QC

		start: "  ¡{POKEMON} ha mermado el Ataque de los demás Pokémon con Tablilla Debacle!",
	},
	tangledfeet: {
		name: "Tumbos",
		shortDesc: "Su evasión se duplica mientras está confuso.", // NEEDS QC
	},
	tanglinghair: {
		name: "Rizos Rebeldes",
		shortDesc: "Baja 1 nivel la Velocidad de quien haga contacto.", // NEEDS QC
	},
	technician: {
		name: "Experto",
		// Official flavor text: "Potencia sus movimientos más débiles."
		desc: "La potencia de los movimientos de este Pokémon de potencia 60 o menos se multiplica por 1,5, incluido Forcejeo. Este efecto se aplica después de que el propio movimiento modifique su potencia.", // NEEDS QC
		shortDesc: "Sus movimientos de potencia 60 o menos: 1,5x de potencia (incluye Forcejeo).", // NEEDS QC
		gen4: {
			desc: "Los movimientos de este Pokémon de potencia 60 o menos tienen su potencia multiplicada por 1,5, salvo Forcejeo. Este efecto se aplica después de que un movimiento cambie su propia potencia y de los efectos de Carga y Refuerzo.", // NEEDS QC
			shortDesc: "Sus movimientos de potencia 60 o menos tienen 1,5x potencia, salvo Forcejeo.", // NEEDS QC
		},
	},
	telepathy: {
		name: "Telepatía",
		shortDesc: "No recibe daño de los ataques de sus aliados.", // NEEDS QC

		block: "  ¡{POKEMON} no ha sufrido el ataque de su aliado!",
	},
	teraformzero: {
		name: "Teraformación 0",
		shortDesc: "(Terapagos) Al teracristalizar, elimina clima y campo. Una vez por combate.", // NEEDS QC
	},
	terashell: {
		name: "Teracaparazón",
		desc: "Si este Pokémon es un Terapagos con todos sus PS, la eficacia de los ataques contra él pasa a ser 0,5, salvo que sea inmune. Los movimientos multigolpe mantienen la misma eficacia durante todo el ataque.", // NEEDS QC
		shortDesc: "(Terapagos) Con todos sus PS, los ataques tienen eficacia 0,5, salvo inmunidad.", // NEEDS QC

		activate: "  ¡{POKEMON} ha hecho brillar su caparazón y ha alterado su compatibilidad entre tipos!",
	},
	terashift: {
		name: "Teracambio",
		shortDesc: "Terapagos pasa a su Forma Teracristal al entrar en combate.", // NEEDS QC

		transform: "¡{POKEMON} se ha transformado!",
	},
	teravolt: {
		name: "Terravoltaje",
		// Official flavor text: "Las habilidades del objetivo no afectan a los movimientos que emplea."
		desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que puede ignorar son: Cola Armadura, Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Cuerpo Vívido, Disfraz, Piel Seca, Geofagia, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Peluche, Compiescolta, Pelaje Recio, Cuerpo Áureo, Manto Frondoso, Perro Guardián, Ignífugo, Metal Pesado, Corte Fuerte, Cara de Hielo, Escama de Hielo, Iluminación, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Ojo Mental, Coraza Reflejo, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Velo Pastel, Punk Rock, Sal Purificadora, Regia Presencia, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Teracaparazón, Termoconversión, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Pompa, Velo Agua, Cuerpo Horneado, Humo Blanco, Surcavientos, Superguarda, Piel Milagro. Afecta a todos los demás Pokémon del campo, sean o no objetivo del movimiento y sea o no beneficiosa para este Pokémon su habilidad.", // NEEDS QC
		shortDesc: "Sus movimientos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		gen8: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Cuerpo Vívido, Disfraz, Piel Seca, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Peluche, Compiescolta, Pelaje Recio, Manto Frondoso, Ignífugo, Metal Pesado, Corte Fuerte, Cara de Hielo, Escama de Hielo, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Coraza Reflejo, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Velo Pastel, Punk Rock, Regia Presencia, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Pompa, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen7: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Aura Oscura, Cuerpo Vívido, Disfraz, Piel Seca, Aura Feérica, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Peluche, Compiescolta, Pelaje Recio, Manto Frondoso, Ignífugo, Metal Pesado, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Regia Presencia, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Pompa, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen6: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Aura Oscura, Piel Seca, Aura Feérica, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Compiescolta, Pelaje Recio, Manto Frondoso, Ignífugo, Metal Pesado, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen5: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Armadura Batalla, Sacapecho, Cuerpo Puro, Respondón, Humedad, Piel Seca, Filtro, Absorbe Fuego, Don Floral, Compiescolta, Ignífugo, Metal Pesado, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Electromotor, Multiescamas, Despiste, Ritmo Propio, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen4: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Armadura Batalla, Cuerpo Puro, Humedad, Piel Seca, Filtro, Absorbe Fuego, Don Floral, Ignífugo, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Pararrayos, Flexibilidad, Escudo Magma, Escama Especial, Electromotor, Despiste, Ritmo Propio, Velo Arena, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Tumbos, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Velo Agua, Humo Blanco, Superguarda. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon. El modificador de Ataque de la habilidad Don Floral de un aliado no se anula.", // NEEDS QC
		},

		start: "  ¡{POKEMON} desprende un aura chisporroteante!",
	},
	thermalexchange: {
		name: "Termoconversión",
		desc: "El Ataque de este Pokémon sube 1 nivel tras recibir daño de un movimiento de tipo Fuego. No puede ser quemado. Obtener esta habilidad estando quemado lo cura.", // NEEDS QC
		shortDesc: "+1 Ataque si lo daña el tipo Fuego; no puede ser quemado.", // NEEDS QC
	},
	thickfat: {
		name: "Sebo",
		// Official flavor text: "Gracias a la gruesa capa de grasa que lo protege, reduce a la mitad el daño que recibe de ataques de tipo Fuego o Hielo."
		desc: "Los ataques de tipo Fuego y Hielo contra este Pokémon se calculan con la característica ofensiva del atacante reducida a la mitad.", // NEEDS QC
		shortDesc: "El Fuego y el Hielo le hacen daño con la ofensiva del atacante a la mitad.", // NEEDS QC
		gen4: {
			desc: "La potencia de los ataques de tipo Fuego y Hielo contra este Pokémon se reduce a la mitad.", // NEEDS QC
			shortDesc: "Los ataques de Fuego y Hielo contra él tienen mitad de potencia.", // NEEDS QC
		},
		gen3: {
			desc: "Si un Pokémon usa un ataque de tipo Fuego o Hielo contra este Pokémon, su Ataque Especial se reduce a la mitad al calcular el daño a este Pokémon.", // NEEDS QC
			shortDesc: "Los movimientos de Fuego/Hielo contra él se calculan con el At. Esp. a la mitad.", // NEEDS QC
		},
	},
	tintedlens: {
		name: "Cromolente",
		shortDesc: "Sus ataques poco eficaces infligen el doble de daño.", // NEEDS QC
	},
	torrent: {
		name: "Torrente",
		// Official flavor text: "Potencia sus movimientos de tipo Agua cuando le quedan pocos PS."
		desc: "Cuando este Pokémon tiene 1/3 o menos de sus PS máximos (redondeado hacia abajo), su característica ofensiva se multiplica por 1,5 al usar un ataque de tipo Agua.", // NEEDS QC
		shortDesc: "Con 1/3 o menos de sus PS, sus ataques de Agua usan 1,5x su ofensiva.", // NEEDS QC
		gen4: {
			desc: "Cuando este Pokémon tiene 1/3 o menos de sus PS máximos (redondeado hacia abajo), la potencia de sus ataques de tipo Agua se multiplica por 1,5.", // NEEDS QC
			shortDesc: "Con 1/3 o menos de sus PS máx., sus ataques de Agua tienen 1,5x potencia.", // NEEDS QC
		},
	},
	toughclaws: {
		name: "Garra Dura",
		shortDesc: "Sus movimientos de contacto tienen 1,3x de potencia.", // NEEDS QC
	},
	toxicboost: {
		name: "Ímpetu Tóxico",
		// Official flavor text: "Aumenta la potencia de sus ataques físicos cuando está envenenado."
		desc: "Mientras este Pokémon está envenenado, la potencia de sus ataques físicos se multiplica por 1,5.", // NEEDS QC
		shortDesc: "Envenenado, sus ataques físicos tienen 1,5x de potencia.", // NEEDS QC
	},
	toxicchain: {
		name: "Cadena Tóxica",
		desc: "Los ataques de este Pokémon tienen un 30% de probabilidad de envenenar gravemente. Este efecto se aplica antes de la probabilidad de efecto secundario propia del movimiento.", // NEEDS QC
		shortDesc: "Sus ataques tienen 30% de envenenar gravemente.", // NEEDS QC
	},
	toxicdebris: {
		name: "Capa Tóxica",
		shortDesc: "Si lo golpea un ataque físico, coloca Púas Tóxicas en el bando rival.", // NEEDS QC
	},
	trace: {
		name: "Calco",
		// Official flavor text: "Al entrar en combate copia la habilidad del rival."
		desc: "Al entrar en combate, este Pokémon copia la habilidad de un rival al azar. Las habilidades que no puede copiar son: Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Comandar, Disfraz, Evocarrecuerdos, Don Floral, Predicción, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Títere Tóxico, Agrupamiento, Reacción Química, Paleosíntesis, Carga Cuark, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracaparazón, Teracambio, Teraformación 0, Calco, Superguarda, Modo Daruma y Cambio Heroico. Si ningún rival tiene una habilidad copiable, se activará en cuanto alguno la tenga.", // NEEDS QC
		shortDesc: "Al entrar, copia la habilidad de un rival al azar.", // NEEDS QC
		gen8: {
			desc: "Al entrar en combate, este Pokémon copia la habilidad de un rival al azar. No pueden copiarse Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Tragamisil, Mutapetito, Cara de Hielo, Ilusión, Impostor, Multitipo, Gas Reactivo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco y Modo Daruma. Si ningún rival tiene una habilidad copiable, esta habilidad se activa en cuanto uno la tenga.", // NEEDS QC
		},
		gen7: {
			desc: "Al entrar en combate, este Pokémon copia la habilidad de un rival al azar. No pueden copiarse Fuerte Afecto, Letargo Perenne, Disfraz, Don Floral, Predicción, Ilusión, Impostor, Multitipo, Agrupamiento, Reacción Química, Receptor, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Calco y Modo Daruma. Si ningún rival tiene una habilidad copiable, esta habilidad se activa en cuanto uno la tenga.", // NEEDS QC
		},
		gen6: {
			desc: "Al entrar en combate, este Pokémon copia la habilidad de un rival adyacente al azar. No pueden copiarse Don Floral, Predicción, Ilusión, Impostor, Multitipo, Cambio Táctico, Calco y Modo Daruma. Si ningún rival tiene una habilidad copiable, esta habilidad se activa en cuanto uno la tenga.", // NEEDS QC
		},
		gen5: {
			desc: "Al entrar en combate, este Pokémon copia la habilidad de un rival adyacente al azar. No pueden copiarse Don Floral, Predicción, Ilusión, Impostor, Multitipo, Calco y Modo Daruma. Si ningún rival tiene una habilidad copiable, esta habilidad se activa en cuanto uno la tenga.", // NEEDS QC
		},
		gen4: {
			desc: "Al entrar en combate, este Pokémon copia la habilidad de un rival al azar. No pueden copiarse Predicción, Multitipo y Calco. Si ningún rival tiene una habilidad copiable, esta habilidad se activa en cuanto uno la tenga.", // NEEDS QC
		},
		gen3: {
			desc: "Al entrar en combate, este Pokémon copia la habilidad de un rival al azar.", // NEEDS QC
		},

		changeAbility: "  ¡{POKEMON} rastreó {ABILITY} de {SOURCE}!",
	},
	transistor: {
		name: "Transistor",
		shortDesc: "Sus ataques de tipo Eléctrico usan 1,3x su característica ofensiva.", // NEEDS QC
		gen8: {
			shortDesc: "Su característica ofensiva es x1,5 al usar un ataque Eléctrico.", // NEEDS QC
		},
	},
	triage: {
		name: "Primer Auxilio",
		shortDesc: "Sus movimientos curativos tienen prioridad +3.", // NEEDS QC
	},
	truant: {
		name: "Ausente",
		shortDesc: "Solo puede actuar un turno de cada dos.", // NEEDS QC
		gen3: {
			desc: "Este Pokémon holgazanea un turno sí y otro no en lugar de usar un movimiento. Si reemplaza a un Pokémon debilitado por efectos de fin de turno, holgazanea en su primer turno.", // NEEDS QC
		},

		cant: "¡{POKEMON} está holgazaneando!",
	},
	turboblaze: {
		name: "Turbollama",
		// Official flavor text: "Las habilidades del objetivo no afectan a los movimientos que emplea."
		desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que puede ignorar son: Cola Armadura, Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Cuerpo Vívido, Disfraz, Piel Seca, Geofagia, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Peluche, Compiescolta, Pelaje Recio, Cuerpo Áureo, Manto Frondoso, Perro Guardián, Ignífugo, Metal Pesado, Corte Fuerte, Cara de Hielo, Escama de Hielo, Iluminación, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Ojo Mental, Coraza Reflejo, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Velo Pastel, Punk Rock, Sal Purificadora, Regia Presencia, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Teracaparazón, Termoconversión, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Pompa, Velo Agua, Cuerpo Horneado, Humo Blanco, Surcavientos, Superguarda, Piel Milagro. Afecta a todos los demás Pokémon del campo, sean o no objetivo del movimiento y sea o no beneficiosa para este Pokémon su habilidad.", // NEEDS QC
		shortDesc: "Sus movimientos ignoran las habilidades de otros Pokémon.", // NEEDS QC
		gen8: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Cuerpo Vívido, Disfraz, Piel Seca, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Peluche, Compiescolta, Pelaje Recio, Manto Frondoso, Ignífugo, Metal Pesado, Corte Fuerte, Cara de Hielo, Escama de Hielo, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Coraza Reflejo, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Velo Pastel, Punk Rock, Regia Presencia, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Pompa, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen7: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Aura Oscura, Cuerpo Vívido, Disfraz, Piel Seca, Aura Feérica, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Peluche, Compiescolta, Pelaje Recio, Manto Frondoso, Ignífugo, Metal Pesado, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Regia Presencia, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Pompa, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen6: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Velo Aroma, Rompeaura, Armadura Batalla, Sacapecho, Antibalas, Cuerpo Puro, Respondón, Humedad, Aura Oscura, Piel Seca, Aura Feérica, Filtro, Absorbe Fuego, Don Floral, Velo Flor, Compiescolta, Pelaje Recio, Manto Frondoso, Ignífugo, Metal Pesado, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Electromotor, Multiescamas, Despiste, Funda, Ritmo Propio, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Velo Dulce, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen5: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Armadura Batalla, Sacapecho, Cuerpo Puro, Respondón, Humedad, Piel Seca, Filtro, Absorbe Fuego, Don Floral, Compiescolta, Ignífugo, Metal Pesado, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Metal Liviano, Pararrayos, Flexibilidad, Espejo Mágico, Escudo Magma, Escama Especial, Electromotor, Multiescamas, Despiste, Ritmo Propio, Velo Arena, Herbívoro, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Tumbos, Telepatía, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Velo Agua, Humo Blanco, Superguarda, Piel Milagro. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon, y sea o no su habilidad beneficiosa para este Pokémon.", // NEEDS QC
		},
		gen4: {
			desc: "Los movimientos de este Pokémon y sus efectos ignoran ciertas habilidades de otros Pokémon. Las habilidades que pueden anularse son Armadura Batalla, Cuerpo Puro, Humedad, Piel Seca, Filtro, Absorbe Fuego, Don Floral, Ignífugo, Corte Fuerte, Inmunidad, Fuerza Mental, Insomnio, Vista Lince, Defensa Hoja, Levitación, Pararrayos, Flexibilidad, Escudo Magma, Escama Especial, Electromotor, Despiste, Ritmo Propio, Velo Arena, Caparazón, Polvo Escudo, Simple, Manto Níveo, Roca Sólida, Insonorizar, Viscosidad, Colector, Robustez, Ventosas, Tumbos, Sebo, Ignorante, Espíritu Vital, Absorbe Electricidad, Absorbe Agua, Velo Agua, Humo Blanco, Superguarda. Esto afecta a todos los demás Pokémon en el campo, sean o no objetivo del movimiento de este Pokémon. El modificador de Ataque de la habilidad Don Floral de un aliado no se anula.", // NEEDS QC
		},

		start: "  ¡{POKEMON} desprende un aura llameante!",
	},
	unaware: {
		name: "Ignorante",
		// Official flavor text: "Pasa por alto las mejoras en las características del rival al atacar."
		desc: "Al recibir daño, este Pokémon ignora los cambios de Ataque, Ataque Especial y precisión de otros Pokémon; al infligirlo, ignora los de Defensa, Defensa Especial y evasión.", // NEEDS QC
		shortDesc: "Ignora los cambios de características ajenos al recibir o infligir daño.", // NEEDS QC
	},
	unburden: {
		name: "Liviano",
		// Official flavor text: "Sube su Velocidad si usa o pierde el objeto que lleva."
		desc: "Si este Pokémon pierde su objeto por cualquier motivo, su Velocidad se duplica mientras siga en combate, conserve esta habilidad y no lleve objeto.", // NEEDS QC
		shortDesc: "Su Velocidad se duplica al perder su objeto.", // NEEDS QC
	},
	unnerve: {
		name: "Nerviosismo",
		// Official flavor text: "Pone nervioso al rival y le impide usar bayas."
		desc: "Mientras este Pokémon está en combate, los rivales no pueden comer bayas. Se activa antes que las trampas y otras habilidades.", // NEEDS QC
		shortDesc: "Mientras está en combate, los rivales no pueden comer bayas.", // NEEDS QC

		start: "  ¡{TEAM:capitalize} está muy nervioso y no puede comer bayas!",
	},
	unseenfist: {
		name: "Puño Invisible",
		shortDesc: "Sus movimientos de contacto ignoran protecciones (salvo Maxibarrera).", // NEEDS QC
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "Caldero Debacle",
		shortDesc: "El Ataque Esp. de los demás Pokémon en combate se multiplica por 0,75.", // NEEDS QC

		start: "  ¡{POKEMON} ha mermado el Ataque Especial de los demás Pokémon con Caldero Debacle!",
	},
	victorystar: {
		name: "Tinovictoria",
		shortDesc: "La precisión suya y de sus aliados se multiplica por 1,1.", // NEEDS QC
	},
	vitalspirit: {
		name: "Espíritu Vital",
		shortDesc: "No puede quedarse dormido. Obtenerla estando dormido lo cura.", // NEEDS QC
	},
	voltabsorb: {
		name: "Absorbe Electricidad",
		// Official flavor text: "Si le alcanza un movimiento de tipo Eléctrico, recupera PS en vez de sufrir daño."
		desc: "Este Pokémon es inmune a los movimientos de tipo Eléctrico y recupera 1/4 de sus PS máximos (redondeado hacia abajo) al ser golpeado por uno.", // NEEDS QC
		shortDesc: "Inmune al tipo Eléctrico: recupera 1/4 de sus PS si lo golpea uno.", // NEEDS QC
		gen3: {
			desc: "Este Pokémon es inmune a los movimientos de daño de tipo Eléctrico y recupera 1/4 de sus PS máximos (redondeado hacia abajo) al recibir uno.", // NEEDS QC
			shortDesc: "Cura 1/4 de sus PS máx. contra movimientos Eléctricos de daño; inmune.", // NEEDS QC
		},
	},
	wanderingspirit: {
		name: "Alma Errante",
		// Official flavor text: "Si le alcanza un movimiento de contacto, intercambia su habilidad con la del agresor."
		desc: "Los Pokémon que hacen contacto con este Pokémon intercambian su habilidad con esta. No afecta a los Pokémon con las habilidades Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Comandar, Disfraz, Evocarrecuerdos, Mutapetito, Cara de Hielo, Ilusión, Multitipo, Gas Reactivo, Títere Tóxico, Agrupamiento, Paleosíntesis, Carga Cuark, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Teracaparazón, Teracambio, Teraformación 0, Superguarda, Modo Daruma y Cambio Heroico.", // NEEDS QC
		shortDesc: "Intercambia su habilidad con quien haga contacto.", // NEEDS QC
		gen8: {
			desc: "Los Pokémon que hagan contacto con este Pokémon intercambian su habilidad con esta. No afecta a los Pokémon con las habilidades Unidad Ecuestre, Fuerte Afecto, Letargo Perenne, Disfraz, Tragamisil, Mutapetito, Cara de Hielo, Ilusión, Multitipo, Gas Reactivo, Agrupamiento, Sistema Alfa, Banco, Escudo Limitado, Cambio Táctico, Superguarda y Modo Daruma.", // NEEDS QC
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "Absorbe Agua",
		// Official flavor text: "Si le alcanza un movimiento de tipo Agua, recupera PS en vez de sufrir daño."
		desc: "Este Pokémon es inmune a los movimientos de tipo Agua y recupera 1/4 de sus PS máximos (redondeado hacia abajo) al ser golpeado por uno.", // NEEDS QC
		shortDesc: "Inmune al tipo Agua: recupera 1/4 de sus PS si lo golpea uno.", // NEEDS QC
	},
	waterbubble: {
		name: "Pompa",
		// Official flavor text: "Reduce el daño que le provocan los movimientos de tipo Fuego y es inmune a las quemaduras."
		desc: "La característica ofensiva de este Pokémon se duplica al usar un ataque de tipo Agua. Los ataques de tipo Fuego contra él se calculan con la característica ofensiva del atacante reducida a la mitad. No puede ser quemado. Obtener esta habilidad estando quemado lo cura.", // NEEDS QC
		shortDesc: "Su Agua hace el doble; el Fuego le hace la mitad; no puede ser quemado.", // NEEDS QC
	},
	watercompaction: {
		name: "Hidrorrefuerzo",
		shortDesc: "Su Defensa sube 2 niveles si lo daña un movimiento de tipo Agua.", // NEEDS QC
	},
	waterveil: {
		name: "Velo Agua",
		shortDesc: "No puede ser quemado. Obtenerla estando quemado lo cura.", // NEEDS QC
	},
	weakarmor: {
		name: "Armadura Frágil",
		// Official flavor text: "Al recibir daño de un ataque físico, le baja la Defensa, pero le sube mucho la Velocidad."
		desc: "Si un ataque físico golpea a este Pokémon, su Defensa baja 1 nivel y su Velocidad sube 2 niveles.", // NEEDS QC
		shortDesc: "Si lo golpea un ataque físico: -1 Defensa y +2 Velocidad.", // NEEDS QC
		gen6: {
			desc: "Si un ataque físico golpea a este Pokémon, su Defensa baja 1 nivel y su Velocidad sube 1 nivel.", // NEEDS QC
			shortDesc: "Al recibir un ataque físico: Defensa -1, Velocidad +1.", // NEEDS QC
		},
	},
	wellbakedbody: {
		name: "Cuerpo Horneado",
		desc: "Este Pokémon es inmune a los movimientos de tipo Fuego y su Defensa sube 2 niveles al ser golpeado por uno.", // NEEDS QC
		shortDesc: "Inmune al tipo Fuego: +2 Defensa si lo golpea uno.", // NEEDS QC
	},
	whitesmoke: {
		name: "Humo Blanco",
		shortDesc: "Otros Pokémon no pueden bajarle las características.", // NEEDS QC
	},
	wimpout: {
		name: "Huida",
		// Official flavor text: "Se asusta y abandona el terreno de combate cuando sus PS se ven reducidos a la mitad."
		desc: "Cuando este Pokémon tiene más de la mitad de sus PS máximos y el daño lo deja con la mitad o menos, se cambia inmediatamente por un aliado elegido. Este efecto se aplica tras todos los golpes de un movimiento multigolpe. No se activa si la habilidad Potencia Bruta eliminó el efecto secundario del movimiento. Se activa con daño directo e indirecto, salvo el coste de Maldición y Sustituto, Tambor, Divide Dolor y el daño por confusión.", // NEEDS QC
		shortDesc: "Se cambia al quedar con la mitad o menos de sus PS máximos.", // NEEDS QC
	},
	windpower: {
		name: "Energía Eólica",
		desc: "Este Pokémon obtiene el efecto de Carga cuando lo golpea un movimiento de viento o cuando empieza Viento Afín en su bando.", // NEEDS QC
		shortDesc: "Obtiene el efecto de Carga con movimientos de viento o Viento Afín.", // NEEDS QC

		start: "#electromorphosis",
	},
	windrider: {
		name: "Surcavientos",
		desc: "Este Pokémon es inmune a los movimientos de viento y su Ataque sube 1 nivel cuando lo golpea uno o cuando empieza Viento Afín en su bando.", // NEEDS QC
		shortDesc: "Inmune a los movimientos de viento: +1 Ataque con ellos o Viento Afín.", // NEEDS QC
	},
	wonderguard: {
		name: "Superguarda",
		shortDesc: "Solo lo dañan los movimientos supereficaces y el daño indirecto.", // NEEDS QC
		gen4: {
			shortDesc: "Solo lo dañan Colmillo Ígneo, los movimientos supereficaces y el daño indirecto.", // NEEDS QC
		},
		gen3: {
			shortDesc: "Solo lo dañan los movimientos supereficaces y el daño indirecto.", // NEEDS QC
		},
	},
	wonderskin: {
		name: "Piel Milagro",
		// Official flavor text: "Presenta una mayor resistencia ante los movimientos de estado."
		desc: "Los movimientos de estado que comprueban la precisión tienen un 50% de precisión al usarse contra este Pokémon. Este efecto se aplica antes que otros modificadores de precisión.", // NEEDS QC
		shortDesc: "Los movimientos de estado con precisión tienen 50% contra él.", // NEEDS QC
	},
	zenmode: {
		name: "Modo Daruma",
		// Official flavor text: "Cambia de forma si sus PS se ven reducidos a la mitad."
		desc: "Si este Pokémon es un Darmanitan (incluida la Forma de Galar), cambia al Modo Daruma cuando tiene la mitad o menos de sus PS máximos al final de un turno, y vuelve al Modo Normal cuando tiene más de la mitad.", // NEEDS QC
		shortDesc: "Darmanitan pasa al Modo Daruma con la mitad o menos de sus PS.", // NEEDS QC
		gen7: {
			desc: "Si este Pokémon es un Darmanitan, cambia al Modo Daruma si tiene 1/2 o menos de sus PS máximos al final de un turno. Si sus PS superan la mitad al final de un turno, vuelve al Modo Normal.", // NEEDS QC
		},
		gen6: {
			desc: "Si este Pokémon es un Darmanitan, cambia al Modo Daruma si tiene 1/2 o menos de sus PS máximos al final de un turno. Si sus PS superan la mitad al final de un turno, vuelve al Modo Normal. Si pierde esta habilidad en Modo Daruma, vuelve de inmediato al Modo Normal.", // NEEDS QC
		},

		transform: "¡Modo Daruma activado!",
		transformEnd: "Modo Daruma desactivado.",
	},
	zerotohero: {
		name: "Cambio Heroico",
		shortDesc: "Palafin pasa a su Forma Heroica al cambiarse.", // NEEDS QC

		activate: "  ¡{POKEMON} ha vuelto con una transformación heroica!",
	},

	// CAP
	mountaineer: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "Al entrar, evita los ataques de tipo Roca y Trampa Rocas.", // NEEDS QC
	},
	rebound: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Al entrar en combate, este Pokémon puede devolver ciertos movimientos de estado contra su usuario original.", // NEEDS QC
		shortDesc: "Al entrar, devuelve ciertos movimientos de estado a su usuario.", // NEEDS QC

		move: "#magiccoat",
	},
	persistent: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "La duración de Gravedad, Anticura, Zona Mágica, Velo Sagrado, Viento Afín, Espacio Raro, Zona Extraña aumenta en 2 turnos si el efecto lo inicia este Pokémon.", // NEEDS QC
		shortDesc: "Sus Gravedad, Espacio Raro y efectos similares duran 2 turnos más.", // NEEDS QC

		activate: "  ¡{POKEMON} prolonga {MOVE} durante 2 turnos más!", // NEEDS QC
	},
};
