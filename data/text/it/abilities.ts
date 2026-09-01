export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: "Nessuna Abilità", // NEEDS QC
		shortDesc: "Non fa nulla.", // NEEDS QC
	},
	adaptability: {
		name: "Adattabilità",
		// Official flavor text: "Potenzia di molto le mosse dello stesso tipo del Pokémon."
		desc: "Il bonus di tipo (STAB) delle mosse di questo Pokémon è 2 invece di 1,5.", // NEEDS QC
		shortDesc: "Il bonus di tipo (STAB) di questo Pokémon è 2 invece di 1,5.", // NEEDS QC
	},
	aerilate: {
		name: "Pellecielo",
		// Official flavor text: "Le mosse di tipo Normale diventano di tipo Volante e la loro potenza aumenta un po’."
		desc: "Le mosse di tipo Normale di questo Pokémon diventano di tipo Volante e la loro potenza è moltiplicata per 1,2. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, ma prima degli effetti di Pioggiaplasma ed Elettrocontagio.", // NEEDS QC
		shortDesc: "Le sue mosse di tipo Normale diventano di tipo Volante con 1,2x più potenza.", // NEEDS QC
		gen6: {
			desc: "Le mosse di tipo Normale di questo Pokémon diventano di tipo Volante e la loro potenza è moltiplicata per 1,3. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, ma prima degli effetti di Pioggiaplasma ed Elettrocontagio.", // NEEDS QC
			shortDesc: "Le mosse Normale di questo Pokémon diventano di tipo Volante con 1,3x potenza.", // NEEDS QC
		},
	},
	aftermath: {
		name: "Scoppio",
		// Official flavor text: "Chi manda KO questo Pokémon con un attacco diretto subisce dei danni."
		desc: "Se questo Pokémon va KO per una mossa da contatto, chi l'ha usata perde 1/4 dei suoi PS max, arrotondato per difetto. Questo effetto è impedito se l'attaccante ha l'abilità Magicscudo o se un Pokémon in campo ha l'abilità Umidità.", // NEEDS QC
		shortDesc: "Se va KO per una mossa da contatto, l'attaccante perde 1/4 dei suoi PS max.", // NEEDS QC

		damage: "  {POKEMON} è ferito!",
	},
	airlock: {
		name: "Riparo",
		shortDesc: "Finché questo Pokémon è in campo, gli effetti del tempo atmosferico sono annullati.", // NEEDS QC

		start: "  Le condizioni atmosferiche non hanno alcun effetto!",
	},
	analytic: {
		name: "Ponderazione",
		// Official flavor text: "Se il Pokémon agisce per ultimo, la potenza della mossa aumenta."
		desc: "La potenza delle mosse di questo Pokémon è moltiplicata per 1,3 se agisce per ultimo nel turno. Non influisce su Obbliderio e Divinazione.", // NEEDS QC
		shortDesc: "Gli attacchi di questo Pokémon hanno 1,3x più potenza se agisce per ultimo.", // NEEDS QC
	},
	angerpoint: {
		name: "Grancollera",
		// Official flavor text: "Se il Pokémon subisce un brutto colpo, monta su tutte le furie e il suo Attacco aumenta al massimo."
		desc: "Se questo Pokémon, ma non il suo sostituto, subisce un brutto colpo, il suo Attacco aumenta di 12 livelli.", // NEEDS QC
		shortDesc: "Se questo Pokémon (non il sostituto) subisce un brutto colpo: Attacco +12 livelli.", // NEEDS QC
		gen4: {
			desc: "Se questo Pokémon o il suo sostituto subisce un brutto colpo, il suo Attacco aumenta di 12 livelli.", // NEEDS QC
			shortDesc: "Se questo Pokémon o il suo sostituto subisce un brutto colpo: +12 Attacco.", // NEEDS QC
		},

		boost: "  {POKEMON} aumenta al massimo il suo Attacco!",
	},
	angershell: {
		name: "Iraguscio",
		desc: "Quando questo Pokémon ha più di metà dei suoi PS max e un attacco lo porta a metà o meno, il suo Attacco, il suo Attacco Speciale e la sua Velocità aumentano di un livello, e la sua Difesa e la sua Difesa Speciale diminuiscono di un livello. Questo effetto si applica dopo tutti i colpi di una mossa multicolpo. Questo effetto è impedito se l'effetto secondario della mossa è stato rimosso dall'abilità Forzabruta.", // NEEDS QC
		shortDesc: "A metà dei PS o meno: +1 Att, Att. Sp. e Vel., -1 Dif e Dif. Sp.", // NEEDS QC
	},
	anticipation: {
		name: "Presagio",
		// Official flavor text: "Rivela se il nemico ha mosse pericolose."
		desc: "Quando entra in campo, questo Pokémon percepisce se un avversario conosce una mossa offensiva superefficace contro di lui o una mossa KO in un colpo. Questo effetto considera Introforza del suo tipo determinato e ogni altra mossa del suo tipo originale.", // NEEDS QC
		shortDesc: "All'entrata, trema se un avversario ha una mossa superefficace o da KO.", // NEEDS QC
		gen5: {
			desc: "Quando entra in campo, questo Pokémon viene avvertito se un avversario conosce una mossa d'attacco di un tipo superefficace contro di lui, o una mossa KO in un colpo. Questo effetto considera le mosse con il loro tipo originale.", // NEEDS QC
		},
		gen4: {
			desc: "Quando entra in campo, questo Pokémon viene avvertito se un avversario conosce una mossa d'attacco di un tipo superefficace contro di lui, o una mossa KO in un colpo se questo Pokémon non è immune al suo tipo e l'avversario non è di livello inferiore. Questo effetto considera le mosse con il loro tipo originale. Contrattacco, Ira di Drago, Metalscoppio, Specchiovelo, Ombra Notturna, Psiconda e Movimento Sismico non attivano questo effetto. Prima della verifica, questo effetto considera se questo Pokémon ha una Ferropalla, se è sotto gli effetti di Preveggenza (Segugio), Gravità, Radicamento, Miracolvista o Trespolo, e se gli avversari hanno le abilità Normalità o Nervisaldi.", // NEEDS QC
		},

		activate: "  {POKEMON} rabbrividisce!",
	},
	arenatrap: {
		name: "Trappoarena",
		// Official flavor text: "Impedisce la fuga al nemico."
		desc: "Impedisce agli avversari di scegliere di essere sostituiti, a meno che non siano sollevati da terra, abbiano una Disfoguscio o siano di tipo Spettro.", // NEEDS QC
		shortDesc: "Impedisce agli avversari di lasciare il campo, a meno che non siano sollevati.", // NEEDS QC
		gen6: {
			desc: "Impedisce agli avversari adiacenti di scegliere di essere sostituiti, a meno che non siano sollevati da terra, abbiano una Disfoguscio o siano di tipo Spettro.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce agli avversari adiacenti di scegliere di essere sostituiti, a meno che non siano sollevati da terra o abbiano una Disfoguscio.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce agli avversari di scegliere di essere sostituiti, a meno che non siano sollevati da terra o abbiano una Disfoguscio.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce agli avversari di scegliere di essere sostituiti, a meno che non siano sollevati da terra.", // NEEDS QC
		},
	},
	armortail: {
		name: "Codarmatura",
		desc: "Le mosse con priorità usate dagli avversari contro questo Pokémon o i suoi alleati falliscono.", // NEEDS QC
		shortDesc: "Questo Pokémon e i suoi alleati sono protetti dalle mosse avversarie con priorità.", // NEEDS QC

		block: "#damp",
	},
	aromaveil: {
		name: "Aromavelo",
		// Official flavor text: "Protegge tutta la squadra da effetti che ne limitano la libertà di scelta delle mosse."
		desc: "Questo Pokémon e i suoi alleati non possono essere colpiti da Attrazione, Inibitore, Ripeti, Anticura, Provocazione e Attaccalite.", // NEEDS QC
		shortDesc: "Protegge la squadra da Attrazione, Inibitore, Ripeti, Anticura ecc.", // NEEDS QC

		block: "  Aromavelo protegge {POKEMON}!",
	},
	asone: {
		name: "Sintonia Equina",
		shortDesc: "Vedi «Sintonia Equina (Glastrier)» e «Sintonia Equina (Spectrier)».", // NEEDS QC

		start: "  {POKEMON} ha due abilità!",
	},
	asoneglastrier: {
		name: "Sintonia Equina (Glastrier)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Combina le abilità Agitazione e Nitrito Bianco.", // NEEDS QC
	},
	asonespectrier: {
		name: "Sintonia Equina (Spectrier)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Combina le abilità Agitazione e Nitrito Nero.", // NEEDS QC
	},
	aurabreak: {
		name: "Frangiaura",
		// Official flavor text: "Inverte gli effetti di tutte le aure riducendone la potenza."
		desc: "Finché questo Pokémon è in campo, gli effetti delle abilità Auratetra e Aurafolletto sono invertiti: la potenza delle mosse di tipo Buio e Folletto è moltiplicata per 3/4 invece che per 1,33.", // NEEDS QC
		shortDesc: "Finché questo Pokémon è in campo, Auratetra e Aurafolletto passano a 0,75x.", // NEEDS QC

		start: "  {POKEMON} inverte gli effetti di tutte le aure!",
	},
	baddreams: {
		name: "Sogniamari",
		// Official flavor text: "Infligge danni ai nemici addormentati."
		desc: "Gli avversari addormentati perdono 1/8 dei loro PS max, arrotondato per difetto, alla fine di ogni turno.", // NEEDS QC
		shortDesc: "Gli avversari addormentati perdono 1/8 dei PS max alla fine di ogni turno.", // NEEDS QC
		gen6: {
			desc: "Gli avversari adiacenti addormentati perdono 1/8 dei loro PS max, arrotondato per difetto, alla fine di ogni turno.", // NEEDS QC
			shortDesc: "I nemici adiacenti addormentati perdono 1/8 dei PS max a fine turno.", // NEEDS QC
		},
		gen4: {
			desc: "Gli avversari addormentati perdono 1/8 dei loro PS max, arrotondato per difetto, alla fine di ogni turno.", // NEEDS QC
			shortDesc: "Gli avversari addormentati perdono 1/8 dei PS max alla fine di ogni turno.", // NEEDS QC
		},

		damage: "  {POKEMON} ha il sonno irrequieto!",
	},
	ballfetch: {
		name: "Raccattapalle",
		shortDesc: "Nessuna utilità in lotta.", // NEEDS QC
	},
	battery: {
		name: "Batteria",
		shortDesc: "Gli attacchi speciali degli alleati di questo Pokémon hanno 1,3x più potenza.", // NEEDS QC
	},
	battlearmor: {
		name: "Lottascudo",
		shortDesc: "Questo Pokémon non può subire brutti colpi.", // NEEDS QC
	},
	battlebond: {
		name: "Morfosintonia",
		// Official flavor text: "Se il Pokémon manda KO un nemico, il legame con l’Allenatore si rafforza, attivando la trasformazione in Greninja Forma Ash. Acqualame si potenzia."
		desc: "Se questo Pokémon è un Greninja, il suo Attacco, il suo Attacco Speciale e la sua Velocità aumentano di un livello quando manda KO un altro Pokémon con un attacco. Questo effetto può verificarsi solo una volta per lotta.", // NEEDS QC
		shortDesc: "Dopo un KO: +1 Attacco, Att. Sp. e Velocità. Una volta per lotta.", // NEEDS QC
		gen8: {
			desc: "Se questo Pokémon è un Greninja, si trasforma in Greninja Forma Ash se manda KO un altro Pokémon con un attacco. Se questo Pokémon è Greninja Forma Ash, il suo Acqualame ha 20 di potenza e colpisce sempre tre volte.", // NEEDS QC
			shortDesc: "Dopo un KO: diventa Greninja Forma Ash, Acqualame: 20 di potenza, 3 colpi.", // NEEDS QC
		},
		activate: "  {POKEMON} avverte la forza di un legame profondo!",
		transform: "{POKEMON} si trasforma in Greninja Forma Ash!",
	},
	beadsofruin: {
		name: "Monile Nefasto",
		shortDesc: "I Pokémon in campo senza questa abilità hanno la Dif. Sp. moltiplicata per 0,75.", // NEEDS QC

		start: "  La Difesa Speciale dei Pokémon intorno si indebolisce a causa dell’abilità Monile Nefasto di {POKEMON}!",
	},
	beastboost: {
		name: "Ultraboost",
		// Official flavor text: "Quando il Pokémon manda KO un altro Pokémon, aumenta la propria statistica di punta."
		desc: "La statistica più alta di questo Pokémon aumenta di un livello quando manda KO un altro Pokémon con un attacco. I livelli delle statistiche non vengono considerati. In caso di parità, l'ordine di priorità è: Attacco, Difesa, Attacco Speciale, Difesa Speciale, Velocità.", // NEEDS QC
		shortDesc: "La statistica più alta aumenta di 1 se manda KO un altro Pokémon.", // NEEDS QC
	},
	berserk: {
		name: "Furore",
		// Official flavor text: "Se i PS scendono a metà o meno a causa di un attacco, l’Attacco Speciale aumenta."
		desc: "Quando questo Pokémon ha più di metà dei suoi PS max e un attacco lo porta a metà o meno, il suo Attacco Speciale aumenta di un livello. Questo effetto si applica dopo tutti i colpi di una mossa multicolpo. Questo effetto è impedito se l'effetto secondario della mossa è stato rimosso dall'abilità Forzabruta.", // NEEDS QC
		shortDesc: "+1 Att. Sp. quando scende a metà dei suoi PS max o meno.", // NEEDS QC
	},
	bigpecks: {
		name: "Pettinfuori",
		shortDesc: "Impedisce agli altri Pokémon di ridurre la Difesa di questo Pokémon.", // NEEDS QC
	},
	blaze: {
		name: "Aiutofuoco",
		// Official flavor text: "Quando il Pokémon ha pochi PS, la potenza delle sue mosse di tipo Fuoco aumenta."
		desc: "Quando questo Pokémon ha 1/3 o meno dei suoi PS max, arrotondato per difetto, la sua statistica offensiva è moltiplicata per 1,5 quando usa un attacco di tipo Fuoco.", // NEEDS QC
		shortDesc: "A 1/3 dei PS max o meno, la statistica offensiva è x1,5 con gli attacchi Fuoco.", // NEEDS QC
		gen4: {
			desc: "Quando questo Pokémon ha 1/3 o meno dei suoi PS max, arrotondato per difetto, la potenza dei suoi attacchi di tipo Fuoco è moltiplicata per 1,5.", // NEEDS QC
			shortDesc: "A 1/3 o meno dei PS max, i suoi attacchi Fuoco hanno 1,5x potenza.", // NEEDS QC
		},
	},
	bulletproof: {
		name: "Antiproiettile",
		shortDesc: "Questo Pokémon è immune alle mosse a base di proiettili.", // NEEDS QC
	},
	cheekpouch: {
		name: "Guancegonfie",
		// Official flavor text: "Quando il Pokémon mangia una bacca, recupera anche dei PS."
		desc: "Se questo Pokémon mangia una bacca che tiene, recupera 1/3 dei suoi PS max, arrotondato per difetto, oltre all'effetto della bacca. Questo effetto può attivarsi anche dopo gli effetti di Coleomorso, Lancio, Spennata, Riempiguance e Ora del Tè, se la bacca mangiata ha avuto effetto su questo Pokémon.", // NEEDS QC
		shortDesc: "Se mangia una bacca, recupera 1/3 dei PS max oltre all'effetto della bacca.", // NEEDS QC
		gen7: {
			desc: "Se questo Pokémon mangia una bacca che ha con sé, recupera 1/3 dei suoi PS max, arrotondato per difetto, oltre all'effetto della bacca. Questo effetto può attivarsi anche dopo Coleomorso, Lancio e Spennata se la bacca mangiata ha effetto su questo Pokémon.", // NEEDS QC
		},
	},
	chillingneigh: {
		name: "Nitrito Bianco",
		// Official flavor text: "Quando manda KO il nemico, emette un nitrito agghiacciante, aumentando il proprio Attacco."
		desc: "L'Attacco di questo Pokémon aumenta di un livello quando manda KO un altro Pokémon con un attacco.", // NEEDS QC
		shortDesc: "L'Attacco aumenta di un livello se manda KO un altro Pokémon.", // NEEDS QC
	},
	chlorophyll: {
		name: "Clorofilla",
		// Official flavor text: "Se la luce del sole è intensa, la Velocità aumenta."
		desc: "Se Sole intenso è attivo, la Velocità di questo Pokémon raddoppia. Questo effetto è impedito se questo Pokémon ha un Superombrello.", // NEEDS QC
		shortDesc: "Se Sole intenso è attivo, la Velocità di questo Pokémon raddoppia.", // NEEDS QC
		gen7: {
			desc: "Se Sole intenso è attivo, la Velocità di questo Pokémon raddoppia.", // NEEDS QC
		},
	},
	clearbody: {
		name: "Corpochiaro",
		shortDesc: "Impedisce agli altri Pokémon di ridurre le statistiche di questo Pokémon.", // NEEDS QC
	},
	cloudnine: {
		name: "Antimeteo",
		shortDesc: "Finché questo Pokémon è in campo, gli effetti del tempo atmosferico sono annullati.", // NEEDS QC

		start: "#airlock",
	},
	colorchange: {
		name: "Cambiacolore",
		// Official flavor text: "Il Pokémon acquisisce il tipo della mossa subita."
		desc: "Il tipo di questo Pokémon diventa quello dell'ultima mossa che l'ha colpito, a meno che non sia già uno dei suoi tipi. Questo effetto si applica dopo tutti i colpi di una mossa multicolpo. Questo effetto è impedito se l'effetto secondario della mossa è stato rimosso dall'abilità Forzabruta.", // NEEDS QC
		shortDesc: "Il suo tipo diventa quello della mossa che lo colpisce, se non lo ha già.", // NEEDS QC
		gen4: {
			desc: "Il tipo di questo Pokémon diventa quello dell'ultima mossa che lo ha colpito, a meno che non abbia già quel tipo. Questo effetto si applica dopo ogni colpo di una mossa multicolpo. Non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
		},
	},
	comatose: {
		name: "Sonno Assoluto",
		// Official flavor text: "Il Pokémon si trova in un costante stato di dormiveglia che gli impedisce di svegliarsi. Può attaccare anche da addormentato."
		desc: "Questo Pokémon è considerato addormentato e non può essere colpito da problemi di stato né da Sbadiglio.", // NEEDS QC
		shortDesc: "Non può subire problemi di stato, ma è considerato addormentato.", // NEEDS QC

		start: "  {POKEMON} è in uno stato di dormiveglia!",
	},
	commander: {
		name: "Torre di Comando",
		desc: "Se questo Pokémon è un Tatsugiri e un Dondozo alleato è in campo, questo Pokémon entra nella bocca del Dondozo. L'Attacco, l'Attacco Speciale, la Velocità, la Difesa e la Difesa Speciale del Dondozo aumentano di 2 livelli. Durante l'effetto, il Dondozo non può essere sostituito, questo Pokémon non può scegliere azioni e gli attacchi che lo bersagliano falliscono, ma subisce comunque i danni indiretti. Se questo Pokémon va KO durante l'effetto, può entrare un sostituto, ma il Dondozo continua a non poter essere sostituito. Se il Dondozo va KO durante l'effetto, questo Pokémon può di nuovo scegliere azioni.", // NEEDS QC
		shortDesc: "Con un Dondozo alleato: non può agire né essere colpito, Dondozo +2 a tutto.", // NEEDS QC

		activate: "  {POKEMON} è stato inghiottito da {TARGET} con la funzione di Torre di Comando!",
	},
	competitive: {
		name: "Tenacia",
		// Official flavor text: "L’Attacco Speciale aumenta di molto quando le statistiche diminuiscono a causa di un nemico."
		desc: "L'Attacco Speciale di questo Pokémon aumenta di 2 livelli per ogni suo livello delle statistiche ridotto da un avversario.", // NEEDS QC
		shortDesc: "+2 Att. Sp. per ogni statistica ridotta da un avversario.", // NEEDS QC
	},
	compoundeyes: {
		name: "Insettocchi",
		shortDesc: "Le mosse di questo Pokémon hanno la precisione moltiplicata per 1,3.", // NEEDS QC
	},
	contrary: {
		name: "Inversione",
		shortDesc: "Gli aumenti di statistiche diventano riduzioni e viceversa.", // NEEDS QC
		gen7: {
			desc: "Le statistiche di questo Pokémon calano invece di aumentare e viceversa. Questa abilità non influenza gli aumenti dovuti agli effetti della Forza Z prima dell'uso di una mossa Z.", // NEEDS QC
		},
		gen6: {
			desc: "Le statistiche di questo Pokémon calano invece di aumentare e viceversa.", // NEEDS QC
		},
	},
	corrosion: {
		name: "Corrosione",
		shortDesc: "Può avvelenare o iperavvelenare qualsiasi Pokémon, indipendentemente dai tipi.", // NEEDS QC
	},
	costar: {
		name: "Coprotagonismo",
		shortDesc: "All'entrata, copia tutti i cambi di statistiche del suo alleato.", // NEEDS QC
	},
	cottondown: {
		name: "Lanugine",
		// Official flavor text: "Se il Pokémon subisce un attacco, sparge della lanugine che diminuisce la Velocità di tutti i Pokémon in campo tranne la sua."
		desc: "Quando questo Pokémon viene colpito da un attacco, la Velocità di tutti gli altri Pokémon in campo diminuisce di un livello.", // NEEDS QC
		shortDesc: "Se viene colpito, la Velocità di tutti gli altri Pokémon diminuisce di 1.", // NEEDS QC
	},
	cudchew: {
		name: "Ruminante",
		shortDesc: "Se mangia una bacca, la mangia di nuovo alla fine del turno successivo.", // NEEDS QC
	},
	curiousmedicine: {
		name: "Stranofarmaco",
		shortDesc: "All'entrata, le modifiche alle statistiche degli alleati vengono azzerate.", // NEEDS QC
	},
	cursedbody: {
		name: "Corpofunesto",
		// Official flavor text: "Può bloccare la mossa subita dal Pokémon."
		desc: "Se questo Pokémon viene colpito da un attacco, c'è il 30% di probabilità che quella mossa venga disabilitata, a meno che una delle mosse dell'attaccante non lo sia già.", // NEEDS QC
		shortDesc: "Se viene colpito da un attacco, 30% di probabilità di disabilitarlo.", // NEEDS QC
	},
	cutecharm: {
		name: "Incantevole",
		// Official flavor text: "Può causare infatuazione a chi manda a segno un attacco diretto."
		desc: "C'è il 30% di probabilità che un Pokémon di sesso opposto che colpisce questo Pokémon con una mossa da contatto se ne infatui.", // NEEDS QC
		shortDesc: "30% di probabilità di infatuare chi lo tocca, se di sesso opposto.", // NEEDS QC
		gen4: {
			desc: "C'è il 30% di probabilità che un Pokémon di sesso opposto che tocca questo Pokémon si infatui. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
		},
		gen3: {
			desc: "C'è 1/3 di probabilità che un Pokémon di sesso opposto che tocca questo Pokémon si infatui. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
			shortDesc: "1/3 di probabilità di infatuare i Pokémon di sesso opposto al contatto.", // NEEDS QC
		},
	},
	damp: {
		name: "Umidità",
		// Official flavor text: "Aumenta l’umidità circostante, impedendo l’uso di Autodistruzione e di altre mosse esplosive."
		desc: "Finché questo Pokémon è in campo, Esplosione, Sbalorditesta, Nebbioscoppio, Autodistruzione e l'abilità Scoppio non hanno effetto.", // NEEDS QC
		shortDesc: "Impedisce Esplosione, Sbalorditesta, Nebbioscoppio, Autodistruzione e Scoppio.", // NEEDS QC
		gen7: {
			desc: "Finché questo Pokémon è in campo, Esplosione, Sbalorditesta, Autodistruzione e l'abilità Scoppio non hanno effetto.", // NEEDS QC
			shortDesc: "Impedisce Esplosione/Sbalorditesta/Autodistruzione/Scoppio finché è in campo.", // NEEDS QC
		},
		gen6: {
			desc: "Finché questo Pokémon è in campo, Esplosione, Autodistruzione e l'abilità Scoppio non hanno effetto.", // NEEDS QC
			shortDesc: "Impedisce Esplosione/Autodistruzione/Scoppio finché è in campo.", // NEEDS QC
		},
		gen3: {
			desc: "Finché questo Pokémon è in campo, Esplosione e Autodistruzione non hanno effetto.", // NEEDS QC
			shortDesc: "Impedisce Esplosione e Autodistruzione finché è in campo.", // NEEDS QC
		},

		block: "  {SOURCE} non può usare {MOVE}!",
	},
	dancer: {
		name: "Sincrodanza",
		// Official flavor text: "Permette al Pokémon di copiare immediatamente qualsiasi mossa basata sulla danza usata da un altro Pokémon in campo."
		desc: "Quando un altro Pokémon usa una mossa di danza, questo Pokémon usa la stessa mossa. La mossa copiata è soggetta a tutti gli effetti che possono impedire l'esecuzione di una mossa. Una mossa usata tramite questa abilità non può essere copiata di nuovo da altri Pokémon con questa abilità.", // NEEDS QC
		shortDesc: "Quando un altro Pokémon usa una mossa di danza, la usa anche lui.", // NEEDS QC
	},
	darkaura: {
		name: "Auratetra",
		// Official flavor text: "Potenzia le mosse di tipo Buio di tutti i Pokémon."
		desc: "Finché questo Pokémon è in campo, la potenza delle mosse di tipo Buio usate dai Pokémon in campo è moltiplicata per 1,33.", // NEEDS QC
		shortDesc: "Finché è in campo, le mosse di tipo Buio hanno 1,33x più potenza.", // NEEDS QC

		start: "  L’abilità Auratetra di {POKEMON} è attiva.",
	},
	dauntlessshield: {
		name: "Scudo Saldo",
		shortDesc: "All'entrata, la Difesa aumenta di un livello. Una volta per lotta.", // NEEDS QC
		gen8: {
			shortDesc: "All'entrata, la Difesa di questo Pokémon aumenta di un livello.", // NEEDS QC
		},
	},
	dazzling: {
		name: "Corposgargiante",
		// Official flavor text: "Il Pokémon sbalordisce il nemico e non gli permette di attaccarlo con mosse che hanno priorità alta."
		desc: "Le mosse con priorità usate dagli avversari contro questo Pokémon o i suoi alleati falliscono.", // NEEDS QC
		shortDesc: "Questo Pokémon e i suoi alleati sono protetti dalle mosse avversarie con priorità.", // NEEDS QC

		block: "#damp",
	},
	defeatist: {
		name: "Sconforto",
		// Official flavor text: "Quando i PS scendono a metà o meno, il Pokémon si scoraggia e l’Attacco e l’Attacco Speciale vengono dimezzati."
		desc: "Finché questo Pokémon ha metà o meno dei suoi PS max, il suo Attacco e il suo Attacco Speciale sono dimezzati.", // NEEDS QC
		shortDesc: "A metà dei PS o meno, il suo Attacco e il suo Att. Sp. sono dimezzati.", // NEEDS QC
	},
	defiant: {
		name: "Agonismo",
		// Official flavor text: "L’Attacco aumenta di molto quando le statistiche diminuiscono a causa di un nemico."
		desc: "L'Attacco di questo Pokémon aumenta di 2 livelli per ogni suo livello delle statistiche ridotto da un avversario.", // NEEDS QC
		shortDesc: "+2 Attacco per ogni statistica ridotta da un avversario.", // NEEDS QC
	},
	deltastream: {
		name: "Flusso Delta",
		// Official flavor text: "Crea un clima che annulla i punti deboli del tipo Volante."
		desc: "Quando entra in campo, il tempo atmosferico diventa Vento misterioso, che elimina le debolezze del tipo Volante dei Pokémon di tipo Volante. Questo tempo dura finché questa abilità non è più attiva per nessun Pokémon, o finché il tempo non viene cambiato dalle abilità Terra Estrema o Mare Primordiale.", // NEEDS QC
		shortDesc: "All'entrata, forti venti soffiano finché questa abilità è attiva in campo.", // NEEDS QC
	},
	desolateland: {
		name: "Terra Estrema",
		// Official flavor text: "Crea un clima che rende inefficaci gli attacchi di tipo Acqua."
		desc: "Quando entra in campo, il tempo atmosferico diventa Sole accecante, che include tutti gli effetti di Sole intenso e impedisce l'esecuzione delle mosse offensive di tipo Acqua. Questo tempo dura finché questa abilità non è più attiva per nessun Pokémon, o finché il tempo non viene cambiato dalle abilità Flusso Delta o Mare Primordiale.", // NEEDS QC
		shortDesc: "All'entrata, una luce solare estrema arde finché questa abilità è attiva.", // NEEDS QC
	},
	disguise: {
		name: "Fantasmanto",
		// Official flavor text: "Il panno che ricopre il Pokémon lo protegge da un singolo attacco."
		desc: "Se questo Pokémon è un Mimikyu, il primo colpo che subisce in lotta infligge 0 danni (neutri). Il suo travestimento si rompe, passa alla Forma Smascherata e perde 1/8 dei suoi PS max. Anche i danni da confusione rompono il travestimento.", // NEEDS QC
		shortDesc: "(Mimikyu) Il primo colpo subito è bloccato: perde 1/8 dei PS al suo posto.", // NEEDS QC
		gen7: {
			desc: "Se questo Pokémon è un Mimikyu, il primo colpo che subisce in lotta infligge 0 danni (neutri). Il suo travestimento si rompe e passa alla Forma Smascherata. Anche i danni da confusione rompono il travestimento.", // NEEDS QC
			shortDesc: "(Solo Mimikyu) Il primo colpo subito infligge 0 danni, rompe il travestimento.", // NEEDS QC
		},

		block: "  Il costume ha assorbito l’attacco!",
		transform: "{POKEMON} è stato smascherato!",
	},
	download: {
		name: "Download",
		// Official flavor text: "Il Pokémon analizza Difesa e Difesa Speciale del nemico e, a seconda di qual è più bassa, aumenta il proprio Attacco o Attacco Speciale."
		desc: "Quando entra in campo, l'Attacco o l'Attacco Speciale di questo Pokémon aumenta di un livello in base alla statistica difensiva combinata più debole degli avversari: aumenta l'Attacco se la loro Difesa è più bassa, l'Attacco Speciale se la loro Difesa Speciale è uguale o più bassa.", // NEEDS QC
		shortDesc: "All'entrata, +1 Attacco o Att. Sp. in base alla difesa più debole dei nemici.", // NEEDS QC
	},
	dragonize: {
		name: "Pelledrago",
		desc: "Le mosse di tipo Normale di questo Pokémon diventano di tipo Drago e la loro potenza è moltiplicata per 1,2. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, ma prima degli effetti di Pioggiaplasma ed Elettrocontagio.", // NEEDS QC
		shortDesc: "Le sue mosse di tipo Normale diventano di tipo Drago con 1,2x più potenza.", // NEEDS QC
	},
	dragonsmaw: {
		name: "Dragomascelle",
		shortDesc: "La statistica offensiva è moltiplicata per 1,5 con gli attacchi di tipo Drago.", // NEEDS QC
	},
	drizzle: {
		name: "Piovischio",
		shortDesc: "All'entrata, questo Pokémon evoca Pioggia.", // NEEDS QC
	},
	drought: {
		name: "Siccità",
		shortDesc: "All'entrata, questo Pokémon evoca Sole intenso.", // NEEDS QC
	},
	dryskin: {
		name: "Pellearsa",
		// Official flavor text: "Il Pokémon recupera PS se piove o se subisce mosse di tipo Acqua, ma perde PS con la luce solare intensa. Subisce più danni da mosse di tipo Fuoco."
		desc: "Questo Pokémon è immune alle mosse di tipo Acqua e recupera 1/4 dei suoi PS max, arrotondato per difetto, quando viene colpito da una mossa di tipo Acqua. La potenza delle mosse di tipo Fuoco usate contro di lui è moltiplicata per 1,25. Alla fine di ogni turno, questo Pokémon recupera 1/8 dei suoi PS max, arrotondato per difetto, se Pioggia è attiva, e perde 1/8 dei suoi PS max, arrotondato per difetto, se Sole intenso è attivo. Gli effetti del tempo atmosferico sono impediti se questo Pokémon ha un Superombrello.", // NEEDS QC
		shortDesc: "Curato 1/4 dall'Acqua, 1/8 dalla pioggia; subisce 1,25x dal Fuoco, -1/8 col sole.", // NEEDS QC
		gen7: {
			desc: "Questo Pokémon è immune alle mosse di tipo Acqua e recupera 1/4 dei suoi PS max, arrotondato per difetto, quando viene colpito da una di esse. La potenza delle mosse di tipo Fuoco contro di lui è moltiplicata per 1,25. Alla fine di ogni turno, questo Pokémon recupera 1/8 dei suoi PS max, arrotondato per difetto, se il tempo è Pioggia, e perde 1/8 dei suoi PS max, arrotondato per difetto, se il tempo è Sole intenso.", // NEEDS QC
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "Sveglialampo",
		shortDesc: "Il contatore del sonno di questo Pokémon scende di 2 invece di 1.", // NEEDS QC
	},
	eartheater: {
		name: "Mangiaterra",
		desc: "Questo Pokémon è immune alle mosse di tipo Terra e recupera 1/4 dei suoi PS max, arrotondato per difetto, quando viene colpito da una mossa di tipo Terra.", // NEEDS QC
		shortDesc: "Recupera 1/4 dei PS max se colpito da mosse Terra; immune al tipo Terra.", // NEEDS QC
	},
	eelevate: {
		name: "Rapidascesa",
		desc: "Questo Pokémon è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte, Rete Vischiosa e dell'abilità Trappoarena. Gli effetti di Gravità, Radicamento, Abbattimento, Mille Frecce e della Ferropalla annullano l'immunità. Mille Frecce può colpirlo come se non avesse questa abilità. La statistica più alta di questo Pokémon aumenta di un livello quando manda KO un altro Pokémon con un attacco. I livelli delle statistiche non vengono considerati. In caso di parità, l'ordine di priorità è: Attacco, Difesa, Attacco Speciale, Difesa Speciale, Velocità.", // NEEDS QC
		shortDesc: "Immune al tipo Terra; +1 alla statistica più alta dopo un KO.", // NEEDS QC
	},
	effectspore: {
		name: "Spargispora",
		// Official flavor text: "Può causare avvelenamento, paralisi o sonno a chi manda a segno un attacco diretto."
		desc: "C'è il 30% di probabilità che un Pokémon che colpisce questo Pokémon con una mossa da contatto venga avvelenato, paralizzato o addormentato.", // NEEDS QC
		shortDesc: "30% di probabilità di veleno, paralisi o sonno per chi lo tocca.", // NEEDS QC
		gen4: {
			desc: "30% di probabilità che un Pokémon che tocca questo Pokémon venga avvelenato, paralizzato o addormentato. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
		},
		gen3: {
			desc: "10% di probabilità che un Pokémon che tocca questo Pokémon venga avvelenato, paralizzato o addormentato. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
			shortDesc: "10% di probabilità di veleno/paralisi/sonno al contatto con questo Pokémon.", // NEEDS QC
		},
	},
	electricsurge: {
		name: "Elettrogenesi",
		shortDesc: "All'entrata, questo Pokémon evoca un Campo Elettrico.", // NEEDS QC
	},
	electromorphosis: {
		name: "Convertivolt",
		shortDesc: "Ottiene l'effetto di Sottocarica quando viene colpito da un attacco.", // NEEDS QC

		start: "  {POKEMON} si carica di elettricità grazie alla mossa {MOVE}!",
	},
	embodyaspectcornerstone: {
		name: "Albergamemorie (Fondamenta)", // PS-style disambiguator (not part of the official name)
		shortDesc: "All'entrata, la Difesa di questo Pokémon aumenta di un livello.", // NEEDS QC

		boost: "  {POKEMON} fa brillare la Maschera Fondamenta, e la sua Difesa aumenta!",
	},
	embodyaspecthearthflame: {
		name: "Albergamemorie (Focolare)", // PS-style disambiguator (not part of the official name)
		shortDesc: "All'entrata, l'Attacco di questo Pokémon aumenta di un livello.", // NEEDS QC

		boost: "  {POKEMON} fa brillare la Maschera Focolare, e il suo Attacco aumenta!",
	},
	embodyaspectteal: {
		name: "Albergamemorie (Turchese)", // PS-style disambiguator (not part of the official name)
		shortDesc: "All'entrata, la Velocità di questo Pokémon aumenta di un livello.", // NEEDS QC

		boost: "  {POKEMON} fa brillare la Maschera Turchese, e la sua Velocità aumenta!",
	},
	embodyaspectwellspring: {
		name: "Albergamemorie (Pozzo)", // PS-style disambiguator (not part of the official name)
		shortDesc: "All'entrata, la Dif. Sp. di questo Pokémon aumenta di un livello.", // NEEDS QC

		boost: "  {POKEMON} fa brillare la Maschera Pozzo, e la sua Difesa Speciale aumenta!",
	},
	emergencyexit: {
		name: "Passoindietro",
		// Official flavor text: "Se i PS scendono a metà o meno, il Pokémon abbandona la lotta per sfuggire al pericolo."
		desc: "Quando questo Pokémon ha più di metà dei suoi PS max e dei danni lo portano a metà o meno, viene sostituito immediatamente da un alleato scelto. Questo effetto si applica dopo tutti i colpi di una mossa multicolpo. Questo effetto è impedito se l'effetto secondario della mossa è stato rimosso dall'abilità Forzabruta. Questo effetto si applica ai danni diretti e indiretti, tranne quelli di Maledizione e Sostituto usate da lui, di Panciamburo, di Malcomune e della confusione.", // NEEDS QC
		shortDesc: "Questo Pokémon lascia il campo quando scende a metà dei PS max o meno.", // NEEDS QC
	},
	fairyaura: {
		name: "Aurafolletto",
		// Official flavor text: "Potenzia le mosse di tipo Folletto di tutti i Pokémon."
		desc: "Finché questo Pokémon è in campo, la potenza delle mosse di tipo Folletto usate dai Pokémon in campo è moltiplicata per 1,33.", // NEEDS QC
		shortDesc: "Finché è in campo, le mosse di tipo Folletto hanno 1,33x più potenza.", // NEEDS QC

		start: "  L’abilità Aurafolletto di {POKEMON} è attiva.",
	},
	filter: {
		name: "Filtro",
		shortDesc: "Questo Pokémon subisce 3/4 dei danni dagli attacchi superefficaci.", // NEEDS QC
	},
	firemane: {
		name: "Pirocriniera",
		shortDesc: "La statistica offensiva è moltiplicata per 1,5 con gli attacchi di tipo Fuoco.", // NEEDS QC
	},
	flamebody: {
		name: "Corpodifuoco",
		shortDesc: "30% di probabilità di scottare chi tocca questo Pokémon.", // NEEDS QC
		gen4: {
			desc: "30% di probabilità che un Pokémon che tocca questo Pokémon venga scottato. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
		},
		gen3: {
			desc: "1/3 di probabilità che un Pokémon che tocca questo Pokémon venga scottato. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
			shortDesc: "1/3 di probabilità di scottare i Pokémon che lo toccano.", // NEEDS QC
		},
	},
	flareboost: {
		name: "Bruciaimpeto",
		// Official flavor text: "Se il Pokémon è scottato, la potenza delle sue mosse speciali aumenta."
		desc: "Quando questo Pokémon è scottato, la potenza dei suoi attacchi speciali è moltiplicata per 1,5.", // NEEDS QC
		shortDesc: "Quando è scottato, i suoi attacchi speciali hanno 1,5x più potenza.", // NEEDS QC
	},
	flashfire: {
		name: "Fuocardore",
		// Official flavor text: "Se il Pokémon subisce una mossa di tipo Fuoco, ne sfrutta il calore per potenziare le proprie mosse dello stesso tipo."
		desc: "Questo Pokémon è immune alle mosse di tipo Fuoco. La prima volta che viene colpito da una mossa di tipo Fuoco, la sua statistica offensiva è moltiplicata per 1,5 quando usa un attacco di tipo Fuoco, finché resta in campo con questa abilità. Se questo Pokémon è congelato, non può essere scongelato dagli attacchi di tipo Fuoco.", // NEEDS QC
		shortDesc: "Attacchi Fuoco x1,5 se colpito da una mossa Fuoco; immune al Fuoco.", // NEEDS QC
		gen4: {
			desc: "Questo Pokémon è immune alle mosse di tipo Fuoco, finché non è congelato. La prima volta che viene colpito da una di esse, i danni dei suoi attacchi di tipo Fuoco sono moltiplicati per 1,5 finché resta in campo con questa abilità.", // NEEDS QC
		},
		gen3: {
			desc: "Questo Pokémon è immune alle mosse di tipo Fuoco, finché non è congelato. La prima volta che viene colpito da una di esse, i danni dei suoi attacchi di tipo Fuoco sono moltiplicati per 1,5 finché resta in campo con questa abilità. Se questo Pokémon ha un problema di stato, è di tipo Fuoco o ha un sostituto, Fuocofatuo non attiva questa abilità.", // NEEDS QC
		},

		start: "  La potenza delle mosse di tipo Fuoco di {POKEMON} aumenta!",
	},
	flowergift: {
		name: "Regalfiore",
		// Official flavor text: "Se la luce del sole è intensa, aumenta l’Attacco e la Difesa Speciale del Pokémon e dei suoi alleati."
		desc: "Se questo Pokémon è un Cherrim e Sole intenso è attivo, passa alla Forma Splendore, e l'Attacco e la Difesa Speciale suoi e dei suoi alleati sono moltiplicati per 1,5. Questi effetti sono impediti se il Pokémon ha un Superombrello.", // NEEDS QC
		shortDesc: "Se Cherrim e Sole intenso attivo: Attacco e Dif. Sp. x1,5 per lui e gli alleati.", // NEEDS QC
		gen7: {
			desc: "Se questo Pokémon è un Cherrim e Sole intenso è attivo, passa alla Forma Splendore, e l'Attacco e la Difesa Speciale suoi e dei suoi alleati sono moltiplicati per 1,5.", // NEEDS QC
		},
		gen4: {
			desc: "Se Sole intenso è attivo, l'Attacco e la Difesa Speciale di questo Pokémon e dei suoi alleati sono moltiplicati per 1,5.", // NEEDS QC
			shortDesc: "Con Sole intenso: Attacco e Dif. Sp. suoi e degli alleati x1,5.", // NEEDS QC
		},
	},
	flowerveil: {
		name: "Fiorvelo",
		// Official flavor text: "Rende gli alleati di tipo Erba immuni alla diminuzione delle statistiche e ai problemi di stato."
		desc: "I Pokémon di tipo Erba nella squadra di questo Pokémon non possono subire riduzioni dei livelli delle statistiche né problemi di stato inflitti da altri Pokémon.", // NEEDS QC
		shortDesc: "I tipi Erba della squadra non subiscono riduzioni di statistiche né stati.", // NEEDS QC

		block: "  L’abilità Fiorvelo protegge {POKEMON}!",
	},
	fluffy: {
		name: "Morbidone",
		// Official flavor text: "Dimezza il danno causato dagli attacchi diretti di un nemico, ma raddoppia quello subito dalle mosse di tipo Fuoco."
		desc: "Questo Pokémon subisce metà dei danni dalle mosse da contatto, ma il doppio dei danni dalle mosse di tipo Fuoco.", // NEEDS QC
		shortDesc: "Subisce 1/2 danni dalle mosse da contatto, ma 2x dalle mosse di tipo Fuoco.", // NEEDS QC
	},
	forecast: {
		name: "Previsioni",
		// Official flavor text: "Cambia il tipo del Pokémon in Acqua, Fuoco o Ghiaccio in base alle condizioni atmosferiche."
		desc: "Se questo Pokémon è un Castform, il suo tipo cambia in base al tempo atmosferico attuale, tranne che con la tempesta di sabbia. Questo effetto è impedito se questo Pokémon ha un Superombrello e Pioggia o Sole intenso è attivo.", // NEEDS QC
		shortDesc: "Il tipo di Castform cambia col tempo, tranne che con la tempesta di sabbia.", // NEEDS QC
		gen7: {
			desc: "Se questo Pokémon è un Castform, il suo tipo cambia in base al tempo atmosferico, tranne che con la tempesta di sabbia.", // NEEDS QC
		},
	},
	forewarn: {
		name: "Premonizione",
		// Official flavor text: "Quando il Pokémon entra in campo, rivela una delle mosse del nemico."
		desc: "Quando entra in campo, questo Pokémon rileva la mossa più potente, scelta a caso in caso di parità, conosciuta da un avversario. Questo effetto considera le mosse KO in un colpo come di potenza 150; Contrattacco, Specchiovelo e Metalscoppio come di potenza 120; ogni altra mossa offensiva a potenza variabile come di potenza 80; e le mosse senza danni come di potenza 1.", // NEEDS QC
		shortDesc: "All'entrata, questo Pokémon rileva la mossa avversaria più potente.", // NEEDS QC
		gen4: {
			desc: "Quando entra in campo, questo Pokémon scopre a caso la mossa più potente conosciuta da un avversario. Questo effetto considera le mosse KO in un colpo con 150 di potenza, Contrattacco, Specchiovelo e Metalscoppio con 120 di potenza, e ogni altra mossa d'attacco senza potenza fissa con 80 di potenza.", // NEEDS QC
		},

		activate: "  La mossa {MOVE} di {TARGET} è stata scoperta!",
		activateNoTarget: "  Premonizione di {POKEMON} lo mette in guardia da {MOVE}!",
	},
	friendguard: {
		name: "Amicoscudo",
		shortDesc: "Gli alleati di questo Pokémon subiscono 3/4 dei danni dagli attacchi altrui.", // NEEDS QC
	},
	frisk: {
		name: "Indagine",
		shortDesc: "All'entrata, questo Pokémon identifica gli strumenti di tutti gli avversari.", // NEEDS QC
		gen5: {
			shortDesc: "Quando entra in campo, identifica lo strumento di un avversario a caso.", // NEEDS QC
		},

		activate: "  {POKEMON} perquisisce {TARGET} e trova {ITEM:indefinite:classified}!",
		activateNoTarget: "  {POKEMON} perquisisce l'avversario e trova {ITEM}!",
	},
	fullmetalbody: {
		name: "Metalprotezione",
		shortDesc: "Impedisce agli altri Pokémon di ridurre le statistiche di questo Pokémon.", // NEEDS QC
	},
	furcoat: {
		name: "Foltopelo",
		shortDesc: "La Difesa di questo Pokémon raddoppia.", // NEEDS QC
	},
	galewings: {
		name: "Aliraffica",
		shortDesc: "Se ha tutti i PS, le sue mosse di tipo Volante hanno priorità +1.", // NEEDS QC
		gen6: {
			shortDesc: "Le mosse Volante di questo Pokémon hanno priorità +1.", // NEEDS QC
		},
	},
	galvanize: {
		name: "Pellelettro",
		// Official flavor text: "Le mosse di tipo Normale diventano di tipo Elettro e la loro potenza aumenta un po’."
		desc: "Le mosse di tipo Normale di questo Pokémon diventano di tipo Elettro e la loro potenza è moltiplicata per 1,2. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, ma prima degli effetti di Pioggiaplasma ed Elettrocontagio.", // NEEDS QC
		shortDesc: "Le sue mosse di tipo Normale diventano di tipo Elettro con 1,2x più potenza.", // NEEDS QC
	},
	gluttony: {
		name: "Voracità",
		// Official flavor text: "Il Pokémon non attende di aver perso molti PS per mangiare certe bacche, ma lo fa non appena i suoi PS scendono a metà o meno."
		desc: "Quando questo Pokémon ha una bacca che normalmente si attiva a 1/4 o meno dei suoi PS max, la mangia già a metà o meno dei suoi PS max.", // NEEDS QC
		shortDesc: "Mangia le bacche a metà dei PS max invece che a 1/4.", // NEEDS QC
	},
	goodasgold: {
		name: "Corpo Aureo",
		shortDesc: "Questo Pokémon è immune alle mosse di stato.", // NEEDS QC
	},
	gooey: {
		name: "Viscosità",
		shortDesc: "Chi tocca questo Pokémon vede la propria Velocità ridursi di un livello.", // NEEDS QC
	},
	gorillatactics: {
		name: "Vigorilla",
		// Official flavor text: "Aumenta l’Attacco ma costringe il Pokémon a usare solo la prima mossa selezionata."
		desc: "L'Attacco di questo Pokémon è moltiplicato per 1,5, ma può selezionare solo la prima mossa che esegue. Questi effetti sono impediti finché questo Pokémon è dynamaxizzato.", // NEEDS QC
		shortDesc: "Attacco x1,5, ma può scegliere solo la sua prima mossa.", // NEEDS QC
	},
	grasspelt: {
		name: "Peloderba",
		shortDesc: "Se un Campo Erboso è attivo, la sua Difesa è moltiplicata per 1,5.", // NEEDS QC
	},
	grassysurge: {
		name: "Erbogenesi",
		shortDesc: "All'entrata, questo Pokémon evoca un Campo Erboso.", // NEEDS QC
	},
	grimneigh: {
		name: "Nitrito Nero",
		// Official flavor text: "Quando manda KO il nemico, emette un nitrito terrificante, aumentando il proprio Attacco Speciale."
		desc: "L'Attacco Speciale di questo Pokémon aumenta di un livello quando manda KO un altro Pokémon con un attacco.", // NEEDS QC
		shortDesc: "L'Att. Sp. aumenta di un livello se manda KO un altro Pokémon.", // NEEDS QC
	},
	guarddog: {
		name: "Cane da Guardia",
		desc: "Questo Pokémon è immune all'effetto dell'abilità Prepotenza: il suo Attacco aumenta invece di un livello. Questo Pokémon non può essere costretto a lasciare il campo da attacchi o strumenti di altri Pokémon.", // NEEDS QC
		shortDesc: "Immune a Prepotenza: +1 Attacco al suo posto. Non può essere costretto a uscire.", // NEEDS QC
	},
	gulpmissile: {
		name: "Inghiottimissile",
		// Official flavor text: "Quando usa Surf o Sub, il Pokémon cattura una preda. Se subisce dei danni, la sputa fuori per attaccare."
		desc: "Se questo Pokémon è un Cramorant, cambia forma quando colpisce un bersaglio con Surf o completa il primo turno di Sub. Assume la Forma Inghiottitutto con un Arrokuda in bocca se ha più di metà dei suoi PS max, o la Forma Inghiottintero con un Pikachu in bocca se ha metà o meno dei suoi PS max. Se Cramorant viene colpito in una di queste forme, sputa l'Arrokuda o il Pikachu contro l'attaccante, anche se non ha più PS. Il proiettile infligge danni pari a 1/4 dei PS max del bersaglio, arrotondato per difetto; questi danni sono bloccati dall'abilità Magicscudo, ma non da un sostituto. Un Arrokuda riduce anche la Difesa del bersaglio di un livello, e un Pikachu lo paralizza. Cramorant torna normale se sputa un proiettile, viene sostituito o si dynamaxizza.", // NEEDS QC
		shortDesc: "Colpito dopo Surf/Sub: l'attaccante perde 1/4 dei PS e -1 Dif o paralisi.", // NEEDS QC
	},
	guts: {
		name: "Dentistretti",
		// Official flavor text: "Se il Pokémon è affetto da un problema di stato, tira fuori la grinta e aumenta il proprio Attacco."
		desc: "Se questo Pokémon ha un problema di stato, il suo Attacco è moltiplicato per 1,5. Gli attacchi fisici di questo Pokémon ignorano il dimezzamento dei danni dovuto alla scottatura.", // NEEDS QC
		shortDesc: "Con un problema di stato, Attacco x1,5; ignora la riduzione da scottatura.", // NEEDS QC
	},
	hadronengine: {
		name: "Motore Adronico",
		shortDesc: "All'entrata evoca un Campo Elettrico; Att. Sp. x1,3333 su quel campo.", // NEEDS QC

		start: "  {POKEMON} genera un Campo Elettrico e dà impulso al motore del futuro!",
		activate: "  {POKEMON} dà impulso al motore del futuro grazie al Campo Elettrico!",
	},
	harvest: {
		name: "Coglibacche",
		// Official flavor text: "Può ricreare una bacca utilizzata."
		desc: "Se l'ultimo strumento usato da questo Pokémon è una bacca, c'è il 50% di probabilità che venga ripristinata alla fine di ogni turno. Se Sole intenso è attivo, la probabilità è del 100%.", // NEEDS QC
		shortDesc: "Ultimo strumento una bacca: 50% di recuperarla a ogni turno, 100% col sole.", // NEEDS QC

		addItem: "  {POKEMON} raccoglie {ITEM:indefinite}!",
	},
	healer: {
		name: "Curacuore",
		// Official flavor text: "A volte cura i problemi di stato degli alleati."
		desc: "C'è il 30% di probabilità che il problema di stato dell'alleato di questo Pokémon venga curato alla fine di ogni turno.", // NEEDS QC
		shortDesc: "30% di probabilità di curare lo stato dell'alleato a fine turno.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "30% di probabilità, per ogni alleato adiacente, che il suo problema di stato venga curato alla fine di ogni turno.", // NEEDS QC
			shortDesc: "30% di probabilità per ogni alleato adiacente di curarne lo stato a fine turno.", // NEEDS QC
		},
	},
	heatproof: {
		name: "Antifuoco",
		// Official flavor text: "Il corpo termoresistente del Pokémon dimezza i danni che subisce dalle mosse di tipo Fuoco."
		desc: "Se un Pokémon usa un attacco di tipo Fuoco contro questo Pokémon, la sua statistica offensiva è dimezzata nel calcolo dei danni inflitti a questo Pokémon. Questo Pokémon subisce metà dei danni abituali della scottatura, arrotondato per difetto.", // NEEDS QC
		shortDesc: "Attacchi Fuoco subiti: offensiva avversaria dimezzata. Danni da scottatura: metà.", // NEEDS QC
		gen8: {
			desc: "La potenza degli attacchi di tipo Fuoco contro questo Pokémon è dimezzata. Questo Pokémon subisce metà dei normali danni da scottatura, arrotondato per difetto.", // NEEDS QC
			shortDesc: "Gli attacchi Fuoco contro questo Pokémon hanno potenza dimezzata; scottatura ridotta.", // NEEDS QC
		},
	},
	heavymetal: {
		name: "Metalpesante",
		// Official flavor text: "Raddoppia il peso del Pokémon."
		desc: "Il peso di questo Pokémon raddoppia. Questo effetto è calcolato dopo l'effetto di Sganciapesi e prima di quello della Pietralieve.", // NEEDS QC
		shortDesc: "Il peso di questo Pokémon raddoppia.", // NEEDS QC
	},
	honeygather: {
		name: "Mielincetta",
		shortDesc: "Nessuna utilità in lotta.", // NEEDS QC
	},
	hospitality: {
		name: "Ospitalità",
		shortDesc: "All'entrata, questo Pokémon rende 1/4 dei PS max al suo alleato.", // NEEDS QC

		heal: "  {POKEMON} beve il tè che {SOURCE} gli ha preparato!",
	},
	hugepower: {
		name: "Macroforza",
		shortDesc: "L'Attacco di questo Pokémon raddoppia.", // NEEDS QC
	},
	hungerswitch: {
		name: "Pancialterna",
		// Official flavor text: "Alla fine di ogni turno cambia forma, alternando tra Motivo Panciapiena e Motivo Panciavuota."
		desc: "Se questo Pokémon è un Morpeko, alterna tra Motivo Panciapiena e Motivo Panciavuota alla fine di ogni turno.", // NEEDS QC; form names Motivo Panciapiena/Panciavuota via Pokémon Central Wiki
		shortDesc: "Morpeko alterna tra Motivo Panciapiena e Panciavuota a ogni fine turno.", // NEEDS QC; form names via Pokémon Central Wiki
	},
	hustle: {
		name: "Tuttafretta",
		// Official flavor text: "L’Attacco aumenta, ma la precisione diminuisce."
		desc: "L'Attacco di questo Pokémon è moltiplicato per 1,5 e la precisione dei suoi attacchi fisici per 0,8.", // NEEDS QC
		shortDesc: "Il suo Attacco è x1,5, ma la precisione degli attacchi fisici è x0,8.", // NEEDS QC
	},
	hydration: {
		name: "Idratazione",
		// Official flavor text: "Se piove, il Pokémon guarisce dai problemi di stato."
		desc: "Il problema di stato di questo Pokémon viene curato alla fine di ogni turno se Pioggia è attiva. Questo effetto è impedito se questo Pokémon ha un Superombrello.", // NEEDS QC
		shortDesc: "Il suo stato viene curato a fine turno se Pioggia è attiva.", // NEEDS QC
		gen7: {
			desc: "Se Pioggia è attiva, il problema di stato di questo Pokémon viene curato alla fine di ogni turno.", // NEEDS QC
		},
	},
	hypercutter: {
		name: "Ipertaglio",
		shortDesc: "Impedisce agli altri Pokémon di ridurre l'Attacco di questo Pokémon.", // NEEDS QC
	},
	icebody: {
		name: "Corpogelo",
		// Official flavor text: "Se grandina, il Pokémon recupera PS."
		desc: "Se nevica, questo Pokémon recupera 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno.", // NEEDS QC
		shortDesc: "Se nevica, questo Pokémon recupera 1/16 dei PS max ogni turno.", // NEEDS QC
		gen8: {
			desc: "Se Grandine è attiva, questo Pokémon recupera 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno. Questo Pokémon non subisce danni da Grandine.", // NEEDS QC
			shortDesc: "Con la grandine: recupera 1/16 dei PS max a turno; immune alla grandine.", // NEEDS QC
		},
	},
	iceface: {
		name: "Gelofaccia",
		// Official flavor text: "Grazie al ghiaccio sulla testa, il Pokémon può incassare i danni causati da mosse fisiche, ma cambia forma. Torna al suo stato originale quando grandina."
		desc: "Se questo Pokémon è un Eiscue, il primo colpo fisico che subisce in lotta infligge 0 danni (neutri). La sua faccia di ghiaccio si rompe e passa alla Forma Liquefaccia. Eiscue riassume la Forma Gelofaccia quando inizia a nevicare o quando entra in campo mentre nevica. Anche i danni da confusione rompono la faccia di ghiaccio.", // NEEDS QC; form names Gelofaccia/Liquefaccia via Pokémon Central Wiki
		shortDesc: "(Eiscue) Il primo colpo fisico subito fa 0 danni. Torna con la neve.", // NEEDS QC
		gen8: {
			desc: "Se questo Pokémon è un Eiscue, il primo colpo fisico che subisce in lotta infligge 0 danni (neutri). La sua faccia di ghiaccio si rompe e passa alla Forma Liquefaccia. Riprende la Forma Gelofaccia quando inizia Grandine o se entra in campo mentre Grandine è attiva. Anche i danni da confusione rompono la faccia di ghiaccio.", // NEEDS QC; form name Liquefaccia via Pokémon Central Wiki
			shortDesc: "Se Eiscue: il primo colpo fisico infligge 0 danni. Si ripristina con la grandine.", // NEEDS QC
		},
	},
	icescales: {
		name: "Geloscaglie",
		shortDesc: "Questo Pokémon subisce metà dei danni dagli attacchi speciali.", // NEEDS QC
	},
	illuminate: {
		name: "Risplendi",
		// Official flavor text: "Illumina tutto intorno, rendendo più probabile incontrare Pokémon selvatici."
		desc: "Impedisce agli altri Pokémon di ridurre la precisione di questo Pokémon. Questo Pokémon ignora il livello di elusione del bersaglio.", // NEEDS QC
		shortDesc: "La sua precisione non può essere ridotta; ignora l'elusione altrui.", // NEEDS QC
		gen8: {
			desc: "Nessuna utilità in lotta.", // NEEDS QC
			shortDesc: "Nessuna utilità in lotta.", // NEEDS QC
		},
	},
	illusion: {
		name: "Illusione",
		// Official flavor text: "Il Pokémon inganna il nemico entrando in campo con le sembianze dell’ultimo Pokémon della propria squadra."
		desc: "Quando questo Pokémon entra in campo, assume l'aspetto dell'ultimo Pokémon non KO della sua squadra finché non subisce danni diretti da un attacco di un altro Pokémon. Il livello e i PS mostrati sono quelli di questo Pokémon, non quelli del Pokémon imitato.", // NEEDS QC
		shortDesc: "Assume l'aspetto dell'ultimo Pokémon della squadra finché non subisce danni.", // NEEDS QC

		end: "  L’illusione di {POKEMON} si dissolve!",
	},
	immunity: {
		name: "Immunità",
		shortDesc: "Non può essere avvelenato. Ottenerla da avvelenato lo cura.", // NEEDS QC
	},
	imposter: {
		name: "Sosia",
		// Official flavor text: "Il Pokémon si trasforma nel nemico che ha davanti."
		desc: "Quando entra in campo, questo Pokémon si trasforma nell'avversario che ha di fronte. Se non c'è nessun Pokémon in quella posizione, questo Pokémon non si trasforma.", // NEEDS QC
		shortDesc: "All'entrata, si trasforma nell'avversario che ha di fronte.", // NEEDS QC
	},
	infiltrator: {
		name: "Intrapasso",
		// Official flavor text: "Il Pokémon attacca evitando le barriere e il sostituto del nemico."
		desc: "Le mosse di questo Pokémon ignorano i sostituti e Riflesso, Schermoluce, Salvaguardia, Nebbia e Velaurora della parte avversaria.", // NEEDS QC
		shortDesc: "Le sue mosse ignorano i sostituti, gli schermi, Salvaguardia e Nebbia.", // NEEDS QC
		gen6: {
			desc: "Le mosse di questo Pokémon ignorano i sostituti e Riflesso, Schermoluce, Salvaguardia e Nebbia della parte avversaria.", // NEEDS QC
			shortDesc: "Le mosse ignorano i sostituti e Riflesso, Schermoluce, Salvaguardia, Nebbia.", // NEEDS QC
		},
		gen5: {
			desc: "Le mosse di questo Pokémon ignorano Riflesso, Schermoluce, Salvaguardia e Nebbia della parte avversaria.", // NEEDS QC
			shortDesc: "Le mosse ignorano Riflesso, Schermoluce, Salvaguardia e Nebbia avversari.", // NEEDS QC
		},
	},
	innardsout: {
		name: "Espellinterno",
		// Official flavor text: "Se il Pokémon viene mandato KO da un attacco, infligge a chi lo ha sferrato tanti danni quanti erano i suoi PS prima di ricevere il colpo."
		desc: "Se questo Pokémon va KO per una mossa, chi l'ha usata perde tanti PS quanti sono i danni inflitti a questo Pokémon.", // NEEDS QC
		shortDesc: "Se va KO, l'attaccante perde tanti PS quanti i danni inflitti.", // NEEDS QC

		damage: "#aftermath",
	},
	innerfocus: {
		name: "Forza Interiore",
		// Official flavor text: "La capacità di concentrazione del Pokémon evita che tentenni per gli attacchi del nemico."
		desc: "Questo Pokémon non può tentennare. È immune all'effetto dell'abilità Prepotenza.", // NEEDS QC
		shortDesc: "Non può tentennare. Immune a Prepotenza.", // NEEDS QC
		gen7: {
			desc: "Questo Pokémon non può tentennare.", // NEEDS QC
			shortDesc: "Questo Pokémon non può tentennare.", // NEEDS QC
		},
	},
	insomnia: {
		name: "Insonnia",
		shortDesc: "Non può addormentarsi. Ottenerla mentre dorme lo sveglia.", // NEEDS QC
	},
	intimidate: {
		name: "Prepotenza",
		// Official flavor text: "Quando il Pokémon entra in campo, la sua prepotenza intimidisce i nemici, riducendone l’Attacco."
		desc: "Quando entra in campo, questo Pokémon riduce l'Attacco degli avversari di un livello. I Pokémon con le abilità Forza Interiore, Indifferenza, Mente Locale o Nervisaldi e quelli dietro un sostituto sono immuni.", // NEEDS QC
		shortDesc: "All'entrata, riduce l'Attacco degli avversari di un livello.", // NEEDS QC
		gen7: {
			desc: "Quando entra in campo, questo Pokémon riduce l'Attacco degli avversari di un livello. I Pokémon dietro un sostituto sono immuni.", // NEEDS QC
		},
		gen6: {
			desc: "Quando entra in campo, questo Pokémon riduce l'Attacco degli avversari adiacenti di un livello. I Pokémon dietro un sostituto sono immuni.", // NEEDS QC
			shortDesc: "Quando entra in campo, riduce di 1 l'Attacco degli avversari adiacenti.", // NEEDS QC
		},
		gen4: {
			desc: "Quando entra in campo, questo Pokémon riduce l'Attacco degli avversari di un livello. I Pokémon dietro un sostituto sono immuni. Se Retromarcia rompe un sostituto avversario e questo Pokémon entra come sostituto, il Pokémon che aveva il sostituto resta immune a questa abilità.", // NEEDS QC
			shortDesc: "All'entrata, riduce l'Attacco degli avversari di un livello.", // NEEDS QC
		},
		gen3: {
			desc: "Quando entra in campo, questo Pokémon riduce l'Attacco degli avversari di un livello. I Pokémon dietro un sostituto sono immuni.", // NEEDS QC
		},
	},
	intrepidsword: {
		name: "Spada Indomita",
		shortDesc: "All'entrata, l'Attacco aumenta di un livello. Una volta per lotta.", // NEEDS QC
		gen8: {
			shortDesc: "All'entrata, l'Attacco di questo Pokémon aumenta di un livello.", // NEEDS QC
		},
	},
	ironbarbs: {
		name: "Spineferrate",
		// Official flavor text: "Se il Pokémon viene colpito da un attacco diretto, infligge danni a sua volta con le sue spine di ferro."
		desc: "I Pokémon che colpiscono questo Pokémon con una mossa da contatto perdono 1/8 dei loro PS max, arrotondato per difetto.", // NEEDS QC
		shortDesc: "Chi tocca questo Pokémon perde 1/8 dei suoi PS max.", // NEEDS QC

		damage: "#roughskin",
	},
	ironfist: {
		name: "Ferropugno",
		// Official flavor text: "Potenzia le mosse che utilizzano pugni."
		desc: "Gli attacchi di pugno di questo Pokémon hanno la potenza moltiplicata per 1,2.", // NEEDS QC
		shortDesc: "Gli attacchi di pugno hanno 1,2x più potenza. Sbigoattacco escluso.", // NEEDS QC
	},
	justified: {
		name: "Giustizia",
		shortDesc: "+1 Attacco quando subisce danni da una mossa di tipo Buio.", // NEEDS QC
	},
	keeneye: {
		name: "Sguardofermo",
		// Official flavor text: "La vista acuta del Pokémon impedisce che la sua precisione diminuisca."
		desc: "Impedisce agli altri Pokémon di ridurre la precisione di questo Pokémon. Questo Pokémon ignora il livello di elusione del bersaglio.", // NEEDS QC
		shortDesc: "La sua precisione non può essere ridotta; ignora l'elusione altrui.", // NEEDS QC
		gen5: {
			desc: "Impedisce agli altri Pokémon di ridurre la precisione di questo Pokémon.", // NEEDS QC
			shortDesc: "Gli altri Pokémon non possono ridurre la sua precisione.", // NEEDS QC
		},
	},
	klutz: {
		name: "Impaccio",
		// Official flavor text: "Il Pokémon non può usare lo strumento che ha con sé."
		desc: "Lo strumento di questo Pokémon non ha effetto. Questo Pokémon non può usare Lancio con successo. Crescicappa, Vigorgliera, Vigorbanda, Vigorfascia, Vigorcerchio, Vigorlente e Vigorpeso mantengono i loro effetti.", // NEEDS QC
		shortDesc: "Il suo strumento non ha effetto (tranne Crescicappa). Lancio inutilizzabile.", // NEEDS QC
	},
	leafguard: {
		name: "Fogliamanto",
		// Official flavor text: "Se la luce del sole è intensa, evita i problemi di stato."
		desc: "Se Sole intenso è attivo, questo Pokémon non può essere colpito da problemi di stato né da Sbadiglio, e Riposo fallisce se la usa. Questo effetto è impedito se questo Pokémon ha un Superombrello.", // NEEDS QC
		shortDesc: "Se Sole intenso è attivo, non può subire stati e Riposo fallisce.", // NEEDS QC
		gen7: {
			desc: "Se Sole intenso è attivo, questo Pokémon non può subire problemi di stato né l'effetto di Sbadiglio, e Riposo fallisce per lui.", // NEEDS QC
		},
		gen4: {
			desc: "Se Sole intenso è attivo, questo Pokémon non può subire problemi di stato né l'effetto di Sbadiglio, ma può usare Riposo normalmente.", // NEEDS QC
			shortDesc: "Con Sole intenso: nessun problema di stato, ma Riposo funziona normalmente.", // NEEDS QC
		},
	},
	levitate: {
		name: "Levitazione",
		// Official flavor text: "La capacità di levitare conferisce al Pokémon immunità agli attacchi di tipo Terra."
		desc: "Questo Pokémon è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte, Rete Vischiosa e dell'abilità Trappoarena. Gli effetti di Gravità, Radicamento, Abbattimento, Mille Frecce e della Ferropalla annullano l'immunità. Mille Frecce può colpirlo come se non avesse questa abilità.", // NEEDS QC
		shortDesc: "Immune al tipo Terra; annullata da Gravità, Radicamento, Abbattimento, Ferropalla.", // NEEDS QC
		gen5: {
			desc: "Questo Pokémon è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte e dell'abilità Trappoarena. Gli effetti di Gravità, Radicamento, Abbattimento e della Ferropalla annullano l'immunità.", // NEEDS QC
		},
		gen4: {
			desc: "Questo Pokémon è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte e dell'abilità Trappoarena. Gli effetti di Gravità, Radicamento e della Ferropalla annullano l'immunità.", // NEEDS QC
			shortDesc: "Immune al tipo Terra; Gravità/Radicamento/Ferropalla lo annullano.", // NEEDS QC
		},
		gen3: {
			desc: "Questo Pokémon è immune agli attacchi di tipo Terra e agli effetti di Punte e dell'abilità Trappoarena.", // NEEDS QC
			shortDesc: "Questo Pokémon è immune al tipo Terra.", // NEEDS QC
		},
	},
	libero: {
		name: "Libero",
		// Official flavor text: "Cambia il tipo del Pokémon in quello della mossa che usa."
		desc: "Il tipo di questo Pokémon diventa quello della mossa che sta per usare. Questo effetto si applica dopo tutti gli effetti che cambiano il tipo di una mossa. Può verificarsi solo una volta per ogni entrata in campo, e solo se questo Pokémon non è teracristallizzato.", // NEEDS QC
		shortDesc: "Il suo tipo diventa quello della mossa che usa. Una volta per entrata.", // NEEDS QC
		gen8: {
			desc: "Il tipo di questo Pokémon diventa quello della mossa che sta per usare. Questo effetto si applica dopo tutti gli effetti che cambiano il tipo di una mossa.", // NEEDS QC
			shortDesc: "Il tipo di questo Pokémon diventa quello della mossa che sta per usare.", // NEEDS QC
		},
	},
	lightmetal: {
		name: "Metalleggero",
		// Official flavor text: "Dimezza il peso del Pokémon."
		desc: "Il peso di questo Pokémon è dimezzato, arrotondato per difetto al decimo di chilogrammo. Questo effetto è calcolato dopo l'effetto di Sganciapesi e prima di quello della Pietralieve. Il peso di un Pokémon non può scendere sotto 0,1 kg.", // NEEDS QC
		shortDesc: "Il peso di questo Pokémon è dimezzato.", // NEEDS QC
	},
	lightningrod: {
		name: "Parafulmine",
		// Official flavor text: "Il Pokémon attira e neutralizza le mosse di tipo Elettro e fa aumentare il suo Attacco Speciale."
		desc: "Questo Pokémon è immune alle mosse di tipo Elettro e il suo Attacco Speciale aumenta di un livello quando viene colpito da una mossa di tipo Elettro. Se questo Pokémon non è il bersaglio di una mossa di tipo Elettro a bersaglio singolo usata da un altro Pokémon, la reindirizza su di sé se è nel suo raggio. Se più Pokémon possono reindirizzarla con questa abilità, lo fa quello con la Velocità più alta o, in caso di parità, quello con l'abilità attiva da più tempo.", // NEEDS QC
		shortDesc: "Attira le mosse Elettro e ottiene +1 Att. Sp.; immunità Elettro.", // NEEDS QC
		gen4: {
			desc: "Se questo Pokémon non è il bersaglio di una mossa di tipo Elettro a bersaglio singolo usata da un altro Pokémon, la reindirizza su di sé.", // NEEDS QC
			shortDesc: "Attira su di sé le mosse Elettro a bersaglio singolo.", // NEEDS QC
		},
		gen3: {
			desc: "Se questo Pokémon non è il bersaglio di una mossa di tipo Elettro a bersaglio singolo usata da un avversario, la reindirizza su di sé. Questo effetto considera Introforza di tipo Normale.", // NEEDS QC
			shortDesc: "Attira su di sé le mosse Elettro avversarie a bersaglio singolo.", // NEEDS QC
		},

		activate: "  {POKEMON} attira l’attacco su di sé!",
	},
	limber: {
		name: "Scioltezza",
		shortDesc: "Non può essere paralizzato. Ottenerla da paralizzato lo cura.", // NEEDS QC
	},
	lingeringaroma: {
		name: "Odore Tenace",
		desc: "I Pokémon che colpiscono questo Pokémon con una mossa da contatto vedono la propria abilità diventare Odore Tenace. Non ha effetto sui Pokémon con le abilità Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Odore Tenace, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teramorfosi, Stato Zen e Supercambio.", // NEEDS QC
		shortDesc: "L'abilità di chi lo tocca diventa Odore Tenace.", // NEEDS QC
		gen8: {
			desc: "I Pokémon che toccano questo Pokémon vedono la propria abilità diventare Odore Tenace. Non influenza i Pokémon con le abilità Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Odore Tenace, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen.", // NEEDS QC
		},

		changeAbility: "  {TARGET} ha addosso un odore che non riesce a far andar via!",
	},
	liquidooze: {
		name: "Melma",
		shortDesc: "Chi gli prosciuga PS subisce tanti danni quanti ne avrebbe curati.", // NEEDS QC
		gen4: {
			desc: "Questo Pokémon infligge ai Pokémon che gli prosciugano PS tanti danni quanti ne curerebbero. Questo effetto non considera Mangiasogni.", // NEEDS QC
		},

		damage: "  {POKEMON} ha assorbito la melma!",
	},
	liquidvoice: {
		name: "Idrovoce",
		// Official flavor text: "Le mosse del Pokémon basate sul suono diventano di tipo Acqua."
		desc: "Le mosse basate sul suono di questo Pokémon diventano di tipo Acqua. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, ma prima degli effetti di Pioggiaplasma ed Elettrocontagio.", // NEEDS QC
		shortDesc: "Le mosse basate sul suono di questo Pokémon diventano di tipo Acqua.", // NEEDS QC
	},
	longreach: {
		name: "Distacco",
		shortDesc: "Gli attacchi di questo Pokémon non entrano in contatto con il bersaglio.", // NEEDS QC
	},
	magicbounce: {
		name: "Magispecchio",
		// Official flavor text: "Il Pokémon respinge al mittente le mosse di stato senza subirne gli effetti."
		desc: "Questo Pokémon non è influenzato da certe mosse senza danni che lo bersagliano: le rimbalza contro chi le ha usate. Le mosse rimbalzate così non possono essere rimbalzate di nuovo da questa abilità o dall'effetto di Magivelo. Punte, Levitoroccia, Rete Vischiosa e Fielepunte possono essere rimbalzate solo una volta per parte, dal Pokémon più a sinistra con questa abilità o sotto l'effetto di Magivelo. Le abilità Parafulmine e Acquascolo reindirizzano le rispettive mosse prima che questa abilità agisca.", // NEEDS QC
		shortDesc: "Rimbalza certe mosse di stato contro chi le ha usate.", // NEEDS QC
		gen5: {
			desc: "Questo Pokémon non è influenzato da certe mosse di stato dirette contro di lui e le usa invece contro chi le ha usate. Le mosse così respinte non possono essere respinte di nuovo da questa abilità o da Magivelo. Punte, Levitoroccia e Fielepunte possono essere respinte solo una volta per parte, dal Pokémon più a sinistra sotto questa abilità o l'effetto di Magivelo. Le abilità Parafulmine e Acquascolo reindirizzano le rispettive mosse prima che questa abilità agisca.", // NEEDS QC
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "Magicscudo",
		// Official flavor text: "Il Pokémon subisce danni solo dagli attacchi."
		desc: "Questo Pokémon può subire danni solo da attacchi diretti. I danni di Maledizione e Sostituto usate da lui, di Panciamburo, di Malcomune, del contraccolpo di Scontro e della confusione sono considerati diretti.", // NEEDS QC
		shortDesc: "Questo Pokémon può subire danni solo da attacchi diretti.", // NEEDS QC
		gen4: {
			desc: "Questo Pokémon può subire danni solo da attacchi diretti. Maledizione e Sostituto all'uso, Panciamburo, Malcomune, il contraccolpo di Scontro e i danni da confusione sono considerati danni diretti. Questo Pokémon non può essere bloccato dalla paralisi e non è influenzato da Fielepunte quando entra in campo.", // NEEDS QC
			shortDesc: "Solo gli attacchi diretti lo danneggiano; mai bloccato dalla paralisi.", // NEEDS QC
		},
	},
	magician: {
		name: "Prestigiatore",
		// Official flavor text: "Quando chi la usa colpisce un Pokémon con una mossa, gli ruba lo strumento."
		desc: "Se questo Pokémon non ha strumenti, ruba quello del Pokémon che colpisce con un attacco. Non influisce su Obbliderio e Divinazione. Se un attacco colpisce più bersagli, lo strumento viene rubato al Pokémon più veloce, considerando l'effetto di Distortozona e dando priorità agli avversari rispetto agli alleati.", // NEEDS QC
		shortDesc: "Se non ha strumenti, ruba quello del Pokémon che colpisce.", // NEEDS QC
	},
	magmaarmor: {
		name: "Magmascudo",
		shortDesc: "Non può essere congelato. Ottenerla da congelato lo scongela.", // NEEDS QC
	},
	magnetpull: {
		name: "Magnetismo",
		// Official flavor text: "La carica magnetica attrae i Pokémon di tipo Acciaio impedendogli la fuga o la sostituzione."
		desc: "Impedisce agli avversari di tipo Acciaio di scegliere di essere sostituiti, a meno che non abbiano una Disfoguscio o siano di tipo Spettro.", // NEEDS QC
		shortDesc: "Impedisce agli avversari di tipo Acciaio di lasciare il campo.", // NEEDS QC
		gen6: {
			desc: "Impedisce agli avversari adiacenti di tipo Acciaio di scegliere di essere sostituiti, a meno che non abbiano una Disfoguscio o siano di tipo Spettro.", // NEEDS QC
			shortDesc: "Gli avversari Acciaio adiacenti non possono scegliere di uscire.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce agli avversari adiacenti di tipo Acciaio di scegliere di essere sostituiti, a meno che non abbiano una Disfoguscio.", // NEEDS QC
			shortDesc: "Gli avversari Acciaio adiacenti non possono scegliere di uscire.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce agli avversari di tipo Acciaio di scegliere di essere sostituiti, a meno che non abbiano una Disfoguscio.", // NEEDS QC
			shortDesc: "Impedisce agli avversari di tipo Acciaio di lasciare il campo.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce ai Pokémon di tipo Acciaio di scegliere di essere sostituiti, tranne questo Pokémon.", // NEEDS QC
			shortDesc: "I Pokémon Acciaio non possono uscire, tranne questo Pokémon.", // NEEDS QC
		},
	},
	marvelscale: {
		name: "Pelledura",
		shortDesc: "Con un problema di stato, la sua Difesa è moltiplicata per 1,5.", // NEEDS QC
	},
	megalauncher: {
		name: "Megalancio",
		// Official flavor text: "Potenzia le mosse “pulsar”, Forzasfera e Ondasana."
		desc: "Le mosse pulsar di questo Pokémon hanno la potenza moltiplicata per 1,5. Ondasana fa recuperare 3/4 dei PS max del bersaglio, con 0,5 arrotondato per difetto.", // NEEDS QC
		shortDesc: "Le sue mosse pulsar hanno 1,5x più potenza. Ondasana cura 3/4 dei PS.", // NEEDS QC
	},
	megasol: {
		name: "Megasolar",
		shortDesc: "Le mosse di questo Pokémon agiscono come se Sole intenso fosse attiva.", // NEEDS QC
	},
	merciless: {
		name: "Spietatezza",
		shortDesc: "I suoi attacchi sono brutti colpi contro i bersagli avvelenati.", // NEEDS QC
	},
	mimicry: {
		name: "Mimetismo",
		// Official flavor text: "Il tipo del Pokémon cambia a seconda dello stato del campo."
		desc: "I tipi di questo Pokémon cambiano in base al campo attivo quando ottiene questa abilità o quando un campo inizia: tipo Elettro su un Campo Elettrico, tipo Erba su un Campo Erboso, tipo Folletto su un Campo Nebbioso e tipo Psico su un Campo Psichico. Se questa abilità viene ottenuta senza un campo attivo, o quando un campo finisce, questo Pokémon torna ai tipi originali della sua specie.", // NEEDS QC
		shortDesc: "I suoi tipi cambiano col campo attivo e tornano normali quando finisce.", // NEEDS QC

		activate: "  {POKEMON} riacquisisce il suo tipo originario!",
	},
	mindseye: {
		name: "Occhio Interiore",
		desc: "Questo Pokémon può colpire i Pokémon di tipo Spettro con mosse di tipo Normale e Lotta. Impedisce agli altri Pokémon di ridurre la sua precisione. Questo Pokémon ignora il livello di elusione del bersaglio.", // NEEDS QC
		shortDesc: "Normale e Lotta colpiscono Spettro. Precisione non riducibile, ignora elusione.", // NEEDS QC
	},
	minus: {
		name: "Meno",
		// Official flavor text: "L’Attacco Speciale aumenta se ci sono alleati con l’abilità Meno o Più."
		desc: "Se un alleato in campo ha questa abilità o l'abilità Più, l'Attacco Speciale di questo Pokémon è moltiplicato per 1,5.", // NEEDS QC
		shortDesc: "Se un alleato in campo ha questa abilità o Più, Att. Sp. x1,5.", // NEEDS QC
		gen4: {
			desc: "Se un alleato in campo ha l'abilità Più, l'Attacco Speciale di questo Pokémon è moltiplicato per 1,5.", // NEEDS QC
			shortDesc: "Se un alleato attivo ha Più, il suo Att. Sp. è x1,5.", // NEEDS QC
		},
		gen3: {
			desc: "Se un Pokémon in campo ha l'abilità Più, l'Attacco Speciale di questo Pokémon è moltiplicato per 1,5.", // NEEDS QC
			shortDesc: "Se un Pokémon attivo ha Più, il suo Att. Sp. è x1,5.", // NEEDS QC
		},
	},
	mirrorarmor: {
		name: "Blindospecchio",
		// Official flavor text: "Rimanda al mittente le diminuzioni alle statistiche subite."
		desc: "Quando un livello delle statistiche di questo Pokémon sta per essere ridotto da un altro Pokémon, viene invece ridotto quello di quest'ultimo. Questo effetto non si verifica se il livello di questo Pokémon era già a -6. Se l'altro Pokémon ha un sostituto, nessuno dei due subisce riduzioni.", // NEEDS QC
		shortDesc: "Se le sue statistiche stanno per calare, calano invece quelle dell'attaccante.", // NEEDS QC
	},
	mistysurge: {
		name: "Nebbiogenesi",
		shortDesc: "All'entrata, questo Pokémon evoca un Campo Nebbioso.", // NEEDS QC
	},
	moldbreaker: {
		name: "Rompiforma",
		// Official flavor text: "Quando il Pokémon attacca, ignora l’abilità del bersaglio se questa ha effetto sulle mosse."
		desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Codarmatura, Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Corposgargiante, Fantasmanto, Pellearsa, Mangiaterra, Filtro, Fuocardore, Regalfiore, Fiorvelo, Morbidone, Amicoscudo, Foltopelo, Corpo Aureo, Peloderba, Cane da Guardia, Antifuoco, Metalpesante, Ipertaglio, Gelofaccia, Geloscaglie, Risplendi, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Occhio Interiore, Blindospecchio, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Pastelvelo, Punk Rock, Sale Purificante, Regalità, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Teraguscio, Termoscambio, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Bolladacqua, Idrovelo, Bentostato, Fumochiaro, Vento Propizio, Magidifesa e Splendicute. Questo effetto riguarda tutti gli altri Pokémon in campo, che siano o meno bersagli della mossa di questo Pokémon e che la loro abilità gli sia vantaggiosa o meno.", // NEEDS QC
		shortDesc: "Le sue mosse e i loro effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		gen8: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Corposgargiante, Fantasmanto, Pellearsa, Filtro, Fuocardore, Regalfiore, Fiorvelo, Morbidone, Amicoscudo, Foltopelo, Peloderba, Antifuoco, Metalpesante, Ipertaglio, Gelofaccia, Geloscaglie, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Blindospecchio, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Pastelvelo, Punk Rock, Regalità, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Bolladacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen7: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Auratetra, Corposgargiante, Fantasmanto, Pellearsa, Aurafolletto, Filtro, Fuocardore, Regalfiore, Fiorvelo, Morbidone, Amicoscudo, Foltopelo, Peloderba, Antifuoco, Metalpesante, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Regalità, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Bolladacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen6: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Auratetra, Pellearsa, Aurafolletto, Filtro, Fuocardore, Regalfiore, Fiorvelo, Amicoscudo, Foltopelo, Peloderba, Antifuoco, Metalpesante, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen5: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Lottascudo, Pettinfuori, Corpochiaro, Inversione, Umidità, Pellearsa, Filtro, Fuocardore, Regalfiore, Amicoscudo, Antifuoco, Metalpesante, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Elettrorapid, Multisquame, Indifferenza, Mente Locale, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen4: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Lottascudo, Corpochiaro, Umidità, Pellearsa, Filtro, Fuocardore, Regalfiore, Antifuoco, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Parafulmine, Scioltezza, Magmascudo, Pelledura, Elettrorapid, Indifferenza, Mente Locale, Sabbiavelo, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Intricopiedi, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Idrovelo, Fumochiaro e Magidifesa. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon. Il bonus all'Attacco dell'abilità Regalfiore di un alleato non viene ignorato.", // NEEDS QC
		},

		start: "  {POKEMON} ha l’abilità Rompiforma!",
	},
	moody: {
		name: "Altalena",
		// Official flavor text: "A ogni turno, aumenta di molto una statistica e ne riduce un’altra."
		desc: "Alla fine di ogni turno, una statistica a caso di questo Pokémon, diversa da precisione ed elusione, aumenta di 2 livelli e un'altra diminuisce di un livello.", // NEEDS QC
		shortDesc: "Ogni turno: +2 a una statistica a caso e -1 a un'altra (non prec./elusione).", // NEEDS QC
		gen7: {
			desc: "Alla fine di ogni turno, una statistica a caso di questo Pokémon aumenta di 2 livelli e un'altra diminuisce di un livello.", // NEEDS QC
			shortDesc: "A fine turno: una statistica a caso +2, un'altra -1.", // NEEDS QC
		},
	},
	motordrive: {
		name: "Elettrorapid",
		// Official flavor text: "Se il Pokémon viene colpito da una mossa di tipo Elettro, la neutralizza e sfrutta la carica elettrica per aumentare la propria Velocità."
		desc: "Questo Pokémon è immune alle mosse di tipo Elettro e la sua Velocità aumenta di un livello quando viene colpito da una mossa di tipo Elettro.", // NEEDS QC
		shortDesc: "+1 Velocità se colpito da una mossa Elettro; immunità Elettro.", // NEEDS QC
	},
	moxie: {
		name: "Arroganza",
		// Official flavor text: "Quando manda un nemico KO, il Pokémon si fa sicuro di sé e aumenta il proprio Attacco."
		desc: "L'Attacco di questo Pokémon aumenta di un livello quando manda KO un altro Pokémon con un attacco.", // NEEDS QC
		shortDesc: "L'Attacco aumenta di un livello se manda KO un altro Pokémon.", // NEEDS QC
	},
	multiscale: {
		name: "Multisquame",
		shortDesc: "Se ha tutti i PS, i danni degli attacchi subiti sono dimezzati.", // NEEDS QC
	},
	multitype: {
		name: "Multitipo",
		shortDesc: "Se questo Pokémon è Arceus, il suo tipo diventa quello della lastra.", // NEEDS QC
		gen7: {
			shortDesc: "Se Arceus: il tipo dipende dalla lastra o dal Cristallo Z che ha.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Se questo Pokémon è Arceus, il suo tipo diventa quello della lastra.", // NEEDS QC
		},
		gen4: {
			desc: "Se questo Pokémon è un Arceus, il suo tipo diventa quello della lastra che ha con sé. Questo Pokémon non può perdere il suo strumento a causa dell'attacco di un altro Pokémon.", // NEEDS QC
		},
	},
	mummy: {
		name: "Mummia",
		// Official flavor text: "Al contatto con il Pokémon, l’abilità del nemico diventa Mummia."
		desc: "I Pokémon che colpiscono questo Pokémon con una mossa da contatto vedono la propria abilità diventare Mummia. Non ha effetto sui Pokémon con le abilità Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Mummia, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teramorfosi, Stato Zen e Supercambio.", // NEEDS QC
		shortDesc: "L'abilità di chi lo tocca diventa Mummia.", // NEEDS QC
		gen8: {
			desc: "I Pokémon che toccano questo Pokémon vedono la propria abilità diventare Mummia. Non influenza i Pokémon con le abilità Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Mummia, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen.", // NEEDS QC
		},
		gen7: {
			desc: "I Pokémon che toccano questo Pokémon vedono la propria abilità diventare Mummia. Non influenza i Pokémon con le abilità Morfosintonia, Sonno Assoluto, Fantasmanto, Multitipo, Mummia, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen.", // NEEDS QC
		},
		gen6: {
			desc: "I Pokémon che toccano questo Pokémon vedono la propria abilità diventare Mummia. Non influenza i Pokémon con le abilità Multitipo, Mummia o Accendilotta.", // NEEDS QC
		},
		gen5: {
			desc: "I Pokémon che toccano questo Pokémon vedono la propria abilità diventare Mummia. Non influenza i Pokémon con le abilità Multitipo o Mummia.", // NEEDS QC
		},

		changeAbility: "  L’abilità di {TARGET} è diventata Mummia!",
	},
	myceliummight: {
		name: "Micoforza",
		desc: "Le mosse di stato di questo Pokémon ignorano certe abilità degli altri Pokémon e vengono eseguite per ultime tra i Pokémon che usano mosse di priorità uguale o superiore.", // NEEDS QC
		shortDesc: "Le sue mosse di stato vanno per ultime nella loro priorità e ignorano le abilità.", // NEEDS QC
	},
	naturalcure: {
		name: "Alternacura",
		shortDesc: "Il suo problema di stato viene curato quando lascia il campo.", // NEEDS QC

		activate: "  ({POKEMON} è guarito grazie ad Alternacura!)", // NEEDS QC
	},
	neuroforce: {
		name: "Cerebroforza",
		// Official flavor text: "Potenzia le mosse superefficaci."
		desc: "Gli attacchi di questo Pokémon superefficaci contro il bersaglio hanno i danni moltiplicati per 1,25.", // NEEDS QC
		shortDesc: "I suoi attacchi superefficaci infliggono 1,25x più danni.", // NEEDS QC
	},
	neutralizinggas: {
		name: "Gas Reagente",
		// Official flavor text: "Se in campo c’è un Pokémon con Gas Reagente, gli effetti delle abilità di tutti gli altri Pokémon vengono annullati o non si attivano."
		desc: "Finché questo Pokémon è in campo, le abilità non hanno effetto. Questa abilità si attiva prima delle trappole e delle altre abilità. Non ha effetto sulle abilità Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Gas Reagente, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teramorfosi, Stato Zen e Supercambio.", // NEEDS QC
		shortDesc: "Finché questo Pokémon è in campo, le abilità non hanno effetto.", // NEEDS QC
		gen8: {
			desc: "Finché questo Pokémon è in campo, le abilità non hanno effetto. Questa abilità si attiva prima delle trappole e delle altre abilità. Non influenza le abilità Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Gas Reagente, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen.", // NEEDS QC
		},

		start: "  Il Gas Reagente si diffonde tutt’intorno!",
		end: "  L’effetto del Gas Reagente svanisce!",
	},
	noguard: {
		name: "Nullodifesa",
		shortDesc: "Le mosse usate da o contro questo Pokémon vanno sempre a segno.", // NEEDS QC
	},
	normalize: {
		name: "Normalità",
		// Official flavor text: "Tutte le mosse del Pokémon diventano di tipo Normale e la loro potenza aumenta un po’."
		desc: "Le mosse di questo Pokémon diventano di tipo Normale e la loro potenza è moltiplicata per 1,2. Questo effetto si applica prima degli altri effetti che cambiano il tipo di una mossa.", // NEEDS QC
		shortDesc: "Le sue mosse diventano di tipo Normale con 1,2x più potenza.", // NEEDS QC
		gen6: {
			desc: "Le mosse di questo Pokémon diventano di tipo Normale. Questo effetto si applica prima degli altri effetti che cambiano il tipo di una mossa.", // NEEDS QC
			shortDesc: "Le mosse di questo Pokémon diventano di tipo Normale.", // NEEDS QC
		},
		gen4: {
			desc: "Le mosse di questo Pokémon diventano di tipo Normale. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, tranne Scontro.", // NEEDS QC
		},
	},
	oblivious: {
		name: "Indifferenza",
		// Official flavor text: "L’imperturbabilità del Pokémon lo protegge da infatuazioni e provocazioni."
		desc: "Questo Pokémon non può infatuarsi né essere provocato. Ottenere questa abilità mentre è infatuato o provocato lo cura. È immune all'effetto dell'abilità Prepotenza.", // NEEDS QC
		shortDesc: "Non può infatuarsi né essere provocato. Immune a Prepotenza.", // NEEDS QC
		gen7: {
			desc: "Questo Pokémon non può infatuarsi né essere provocato. Ottenere questa abilità mentre è infatuato o provocato lo cura.", // NEEDS QC
			shortDesc: "Non può infatuarsi né essere provocato.", // NEEDS QC
		},
		gen5: {
			desc: "Questo Pokémon non può infatuarsi. Ottenere questa abilità mentre è infatuato lo cura.", // NEEDS QC
			shortDesc: "Non può infatuarsi. Ottenerla mentre è infatuato lo cura.", // NEEDS QC
		},
	},
	opportunist: {
		name: "Scrocco",
		shortDesc: "Quando un avversario aumenta una statistica, copia l'aumento.", // NEEDS QC
	},
	orichalcumpulse: {
		name: "Ritmo d’Oricalco",
		shortDesc: "All'entrata evoca Sole intenso; Attacco x1,3333 col sole.", // NEEDS QC

		start: "  {POKEMON} intensifica i raggi solari facendo scatenare il ritmo dell’antichità!",
		activate: "  {POKEMON} si gode i raggi solari facendo scatenare il ritmo dell’antichità!",
	},
	overcoat: {
		name: "Copricapo",
		// Official flavor text: "Rende immuni ai danni da grandine e tempesta di sabbia, alle mosse Spora, Cottonspora, Sonnifero, Paralizzante e alle mosse “polvere”."
		desc: "Questo Pokémon è immune alle mosse a base di polvere, ai danni della tempesta di sabbia e agli effetti di Polverabbia e dell'abilità Spargispora.", // NEEDS QC
		shortDesc: "Immune alle polveri, alla tempesta di sabbia e a Spargispora.", // NEEDS QC
		gen8: {
			desc: "Questo Pokémon è immune alle mosse a base di polvere, ai danni della tempesta di sabbia e della grandine e agli effetti di Polverabbia e dell'abilità Spargispora.", // NEEDS QC
			shortDesc: "Immune a mosse di polvere, danni di sabbia/grandine e Spargispora.", // NEEDS QC
		},
		gen5: {
			desc: "Questo Pokémon è immune ai danni della tempesta di sabbia e della grandine.", // NEEDS QC
			shortDesc: "Immune ai danni di tempesta di sabbia e grandine.", // NEEDS QC
		},
	},
	overgrow: {
		name: "Erbaiuto",
		// Official flavor text: "Quando il Pokémon ha pochi PS, la potenza delle sue mosse di tipo Erba aumenta."
		desc: "Quando questo Pokémon ha 1/3 o meno dei suoi PS max, arrotondato per difetto, la sua statistica offensiva è moltiplicata per 1,5 quando usa un attacco di tipo Erba.", // NEEDS QC
		shortDesc: "A 1/3 dei PS o meno, la statistica offensiva è x1,5 con gli attacchi Erba.", // NEEDS QC
		gen4: {
			desc: "Quando questo Pokémon ha 1/3 o meno dei suoi PS max, arrotondato per difetto, la potenza dei suoi attacchi di tipo Erba è moltiplicata per 1,5.", // NEEDS QC
			shortDesc: "A 1/3 o meno dei PS max, i suoi attacchi Erba hanno 1,5x potenza.", // NEEDS QC
		},
	},
	owntempo: {
		name: "Mente Locale",
		// Official flavor text: "Il Pokémon affronta la vita al proprio ritmo e per questo non può essere confuso."
		desc: "Questo Pokémon non può essere confuso. Ottenere questa abilità mentre è confuso lo cura. È immune all'effetto dell'abilità Prepotenza.", // NEEDS QC
		shortDesc: "Non può essere confuso. Immune a Prepotenza.", // NEEDS QC
		gen7: {
			desc: "Questo Pokémon non può essere confuso. Ottenere questa abilità mentre è confuso lo cura.", // NEEDS QC
			shortDesc: "Questo Pokémon non può essere confuso.", // NEEDS QC
		},
	},
	parentalbond: {
		name: "Amorefiliale",
		// Official flavor text: "Il Pokémon e il suo piccolo attaccano insieme."
		desc: "Le mosse offensive di questo Pokémon colpiscono due volte. Il secondo colpo ha i danni ridotti a 1/4. Non influisce su Obbliderio, Dragofrecce, Cannone Dynamax, Rimonta, Esplosione, Azzardo, Lancio, Divinazione, Palla Gelo, Rotolamento e Autodistruzione, sulle mosse multicolpo, su quelle con più bersagli e su quelle eseguite in due turni.", // NEEDS QC
		shortDesc: "Le sue mosse offensive colpiscono due volte; il secondo colpo fa 1/4 dei danni.", // NEEDS QC
		gen8: {
			desc: "Le mosse offensive di questo Pokémon colpiscono due volte. I danni del secondo colpo sono ridotti a 1/4. Non influenza Obbliderio, Dragofrecce, Cannone Dynamax, Rimonta, Esplosione, Azzardo, Lancio, Divinazione, Palla Gelo, Rotolamento o Autodistruzione, le mosse multicolpo, le mosse con più bersagli, le mosse in due turni o le mosse Dynamax.", // NEEDS QC
		},
		gen7: {
			desc: "Le mosse offensive di questo Pokémon colpiscono due volte. I danni del secondo colpo sono ridotti a 1/4. Non influenza Obbliderio, Rimonta, Esplosione, Azzardo, Lancio, Divinazione, Palla Gelo, Rotolamento o Autodistruzione, le mosse multicolpo, le mosse con più bersagli, le mosse in due turni o le mosse Z.", // NEEDS QC
		},
		gen6: {
			desc: "Le mosse offensive di questo Pokémon colpiscono due volte. I danni del secondo colpo sono dimezzati. Non influenza Obbliderio, Rimonta, Esplosione, Azzardo, Lancio, Divinazione, Palla Gelo, Rotolamento o Autodistruzione, le mosse multicolpo, le mosse con più bersagli, le mosse in due turni.", // NEEDS QC
			shortDesc: "Le sue mosse offensive colpiscono due volte. Secondo colpo: danni dimezzati.", // NEEDS QC
		},
	},
	pastelveil: {
		name: "Pastelvelo",
		// Official flavor text: "Protegge il Pokémon e gli alleati dai problemi di stato causati dal veleno."
		desc: "Questo Pokémon e i suoi alleati non possono essere avvelenati. Ottenere questa abilità quando questo Pokémon o il suo alleato è avvelenato li cura. Se questa abilità viene ignorata durante un effetto che avvelena, questo Pokémon viene curato immediatamente, ma il suo alleato no.", // NEEDS QC
		shortDesc: "Questo Pokémon e i suoi alleati non possono essere avvelenati. Li cura all'entrata.", // NEEDS QC
	},
	perishbody: {
		name: "Ultimotocco",
		// Official flavor text: "Se il Pokémon viene colpito da un attacco diretto, dopo tre turni va KO assieme a chi lo ha attaccato. Se uno dei due viene sostituito, non va KO."
		desc: "Colpire questo Pokémon con una mossa da contatto avvia l'effetto di Ultimocanto per lui e per l'attaccante. Questo effetto non si verifica per questo Pokémon se l'attaccante ha già un conto alla rovescia.", // NEEDS QC
		shortDesc: "Un contatto con questo Pokémon avvia Ultimocanto per lui e l'attaccante.", // NEEDS QC

		start: "  Entrambi i Pokémon andranno KO dopo 3 turni!",
	},
	pickpocket: {
		name: "Arraffalesto",
		// Official flavor text: "Se il Pokémon viene colpito da un attacco diretto, ruba lo strumento di chi lo ha attaccato."
		desc: "Se questo Pokémon non ha strumenti e viene colpito da una mossa da contatto, ruba lo strumento dell'attaccante. Questo effetto si applica dopo tutti i colpi di una mossa multicolpo. È impedito se l'effetto secondario della mossa è stato rimosso dall'abilità Forzabruta.", // NEEDS QC
		shortDesc: "Se non ha strumenti e subisce una mossa da contatto, ruba quello dell'attaccante.", // NEEDS QC
	},
	pickup: {
		name: "Raccolta",
		// Official flavor text: "Il Pokémon può raccogliere lo strumento usato da un nemico durante la lotta. A volte potrebbe raccogliere strumenti anche fuori dalla lotta."
		desc: "Alla fine di ogni turno, se questo Pokémon non ha strumenti e almeno un Pokémon adiacente ha usato uno strumento in quel turno, uno di quei Pokémon viene scelto a caso e questo Pokémon ottiene l'ultimo strumento che ha usato. Uno strumento non è considerato l'ultimo usato se è un Palloncino scoppiato, se è stato raccolto da un altro Pokémon con questa abilità o se è stato perso a causa di Coleomorso, Gas Corrosivo, Supplica, Bruciatutto, Privazione, Spennata o Furto. Gli strumenti lanciati con Lancio possono essere raccolti.", // NEEDS QC
		shortDesc: "Se non ha strumenti, recupera quello usato da un Pokémon adiacente nel turno.", // NEEDS QC
		gen7: {
			desc: "Alla fine di ogni turno, se questo Pokémon non ha uno strumento e almeno un Pokémon adiacente ha usato uno strumento in questo turno, uno di essi viene scelto a caso e questo Pokémon ottiene il suo ultimo strumento usato. Uno strumento non è considerato l'ultimo usato se era un Palloncino scoppiato, se è stato raccolto da un altro Pokémon con questa abilità o se è stato perso a causa di Coleomorso, Supplica, Bruciatutto, Privazione, Spennata o Furto. Gli strumenti lanciati con Lancio possono essere raccolti.", // NEEDS QC
		},
		gen4: {
			desc: "Nessuna utilità in lotta.", // NEEDS QC
			shortDesc: "Nessuna utilità in lotta.", // NEEDS QC
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "Punta Perforante",
		shortDesc: "Le sue mosse da contatto ignorano le protezioni, ma infliggono 1/4 dei danni.", // NEEDS QC
	},
	pixilate: {
		name: "Pellefolletto",
		// Official flavor text: "Le mosse di tipo Normale diventano di tipo Folletto e la loro potenza aumenta un po’."
		desc: "Le mosse di tipo Normale di questo Pokémon diventano di tipo Folletto e la loro potenza è moltiplicata per 1,2. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, ma prima degli effetti di Pioggiaplasma ed Elettrocontagio.", // NEEDS QC
		shortDesc: "Le sue mosse di tipo Normale diventano di tipo Folletto con 1,2x più potenza.", // NEEDS QC
		gen6: {
			desc: "Le mosse di tipo Normale di questo Pokémon diventano di tipo Folletto e la loro potenza è moltiplicata per 1,3. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, ma prima degli effetti di Pioggiaplasma ed Elettrocontagio.", // NEEDS QC
			shortDesc: "Le mosse Normale di questo Pokémon diventano di tipo Folletto con 1,3x potenza.", // NEEDS QC
		},
	},
	plus: {
		name: "Più",
		// Official flavor text: "L’Attacco Speciale aumenta se ci sono alleati con l’abilità Meno o Più."
		desc: "Se un alleato in campo ha questa abilità o l'abilità Meno, l'Attacco Speciale di questo Pokémon è moltiplicato per 1,5.", // NEEDS QC
		shortDesc: "Se un alleato in campo ha questa abilità o Meno, Att. Sp. x1,5.", // NEEDS QC
		gen4: {
			desc: "Se un alleato in campo ha l'abilità Meno, l'Attacco Speciale di questo Pokémon è moltiplicato per 1,5.", // NEEDS QC
			shortDesc: "Se un alleato attivo ha Meno, il suo Att. Sp. è x1,5.", // NEEDS QC
		},
		gen3: {
			desc: "Se un Pokémon in campo ha l'abilità Meno, l'Attacco Speciale di questo Pokémon è moltiplicato per 1,5.", // NEEDS QC
			shortDesc: "Se un Pokémon attivo ha Meno, il suo Att. Sp. è x1,5.", // NEEDS QC
		},
	},
	poisonheal: {
		name: "Velencura",
		// Official flavor text: "Se il Pokémon è avvelenato, recupera PS anziché perderli."
		desc: "Se questo Pokémon è avvelenato, recupera 1/8 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno invece di perdere PS.", // NEEDS QC
		shortDesc: "Quando è avvelenato, recupera 1/8 dei PS max a ogni turno.", // NEEDS QC
	},
	poisonpoint: {
		name: "Velenopunto",
		shortDesc: "30% di probabilità di avvelenare chi tocca questo Pokémon.", // NEEDS QC
		gen4: {
			desc: "30% di probabilità che un Pokémon che tocca questo Pokémon venga avvelenato. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
		},
		gen3: {
			desc: "1/3 di probabilità che un Pokémon che tocca questo Pokémon venga avvelenato. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
			shortDesc: "1/3 di probabilità di avvelenare i Pokémon che lo toccano.", // NEEDS QC
		},
	},
	poisonpuppeteer: {
		name: "Malia Tossica",
		desc: "Se questo Pokémon è un Pecharunt e avvelena o iperavvelena un bersaglio, questo viene anche confuso.", // NEEDS QC
		shortDesc: "Pecharunt: se questo Pokémon avvelena un bersaglio, lo confonde anche.", // NEEDS QC
	},
	poisontouch: {
		name: "Velentocco",
		// Official flavor text: "Il Pokémon può avvelenare il nemico al solo contatto."
		desc: "Le mosse da contatto di questo Pokémon hanno il 30% di probabilità di avvelenare. Questo effetto si applica dopo la probabilità di effetto secondario propria della mossa.", // NEEDS QC
		shortDesc: "Le sue mosse da contatto hanno il 30% di probabilità di avvelenare.", // NEEDS QC
	},
	powerconstruct: {
		name: "Sciamefusione",
		// Official flavor text: "Se i PS del Pokémon scendono a metà o meno, le cellule si raggruppano e gli permettono di assumere la Forma Perfetta."
		desc: "Se questo Pokémon è uno Zygarde in Forma 10% o 50%, passa alla Forma Perfetta quando ha metà o meno dei suoi PS max alla fine del turno.", // NEEDS QC
		shortDesc: "Zygarde 10%/50% assume la Forma Perfetta a metà dei PS o meno.", // NEEDS QC

		activate: "  Avverti la presenza di una moltitudine di esseri!",
		transform: "{POKEMON} assume la Forma Perfetta!",
	},
	powerofalchemy: {
		name: "Forza Chimica",
		// Official flavor text: "Il Pokémon trasforma la propria abilità in quella di un alleato andato KO."
		desc: "Questo Pokémon copia l'abilità di un alleato che va KO. Le abilità che non possono essere copiate sono Sintonia Equina, Morfosintonia, Sonno Assoluto, Torre di Comando, Fantasmanto, Albergamemorie, Regalfiore, Previsioni, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Malia Tossica, Sciamefusione, Forza Chimica, Paleoattivazione, Carica Quark, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teraguscio, Teramorfosi, Zeroformazione, Traccia, Magidifesa, Stato Zen e Supercambio.", // NEEDS QC
		shortDesc: "Questo Pokémon copia l'abilità di un alleato che va KO.", // NEEDS QC
		gen8: {
			desc: "Questo Pokémon copia l'abilità di un alleato che va KO. Le abilità che non possono essere copiate sono Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Inghiottimissile, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia, Magidifesa e Stato Zen.", // NEEDS QC
		},
		gen7: {
			desc: "Questo Pokémon copia l'abilità di un alleato che va KO. Le abilità che non possono essere copiate sono Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia, Magidifesa e Stato Zen.", // NEEDS QC
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "Fonte Energetica",
		// Official flavor text: "Potenzia le mosse di chi si trova nelle immediate vicinanze."
		desc: "Gli alleati di questo Pokémon hanno la potenza delle mosse moltiplicata per 1,3. Influisce su Obbliderio e Divinazione, anche se chi le ha usate non è più in campo.", // NEEDS QC
		shortDesc: "Le mosse degli alleati di questo Pokémon hanno 1,3x più potenza.", // NEEDS QC
	},
	prankster: {
		name: "Burla",
		// Official flavor text: "Le mosse di stato del Pokémon acquistano priorità alta."
		desc: "Le mosse senza danni di questo Pokémon hanno la priorità aumentata di 1. Gli avversari di tipo Buio sono immuni a queste mosse e a ogni mossa da esse richiamata, se chi la usa ha questa abilità.", // NEEDS QC
		shortDesc: "Le sue mosse di stato hanno priorità +1; i tipi Buio sono immuni.", // NEEDS QC
		gen6: {
			desc: "Le mosse senza danni di questo Pokémon hanno la priorità aumentata di 1.", // NEEDS QC
			shortDesc: "Le mosse senza danni di questo Pokémon hanno priorità +1.", // NEEDS QC
		},
	},
	pressure: {
		name: "Pressione",
		// Official flavor text: "Il Pokémon mette pressione al nemico, facendogli consumare più PP."
		desc: "Se questo Pokémon è il bersaglio di una mossa avversaria, quella mossa perde un PP in più. Esclusiva, Scippo e Terascoppio perdono anch'esse un PP in più quando un avversario le usa, ma Rete Vischiosa no.", // NEEDS QC
		shortDesc: "Le mosse avversarie che lo bersagliano perdono un PP in più.", // NEEDS QC
		gen8: {
			desc: "Se questo Pokémon è il bersaglio di una mossa avversaria, quella mossa perde un PP aggiuntivo. Anche Esclusiva e Scippo perdono un PP aggiuntivo se usate da un avversario, ma Rete Vischiosa no.", // NEEDS QC
		},
		gen5: {
			desc: "Se questo Pokémon è il bersaglio di una mossa avversaria, quella mossa perde un PP aggiuntivo. Anche Esclusiva e Scippo perdono un PP aggiuntivo se usate da un avversario.", // NEEDS QC
		},
		gen4: {
			desc: "Se questo Pokémon è il bersaglio della mossa di un altro Pokémon, quella mossa perde un PP aggiuntivo.", // NEEDS QC
			shortDesc: "Le mosse che bersagliano questo Pokémon perdono un PP aggiuntivo.", // NEEDS QC
		},

		start: "  {POKEMON} fa pressione!",
	},
	primordialsea: {
		name: "Mare Primordiale",
		// Official flavor text: "Crea un clima che rende inefficaci gli attacchi di tipo Fuoco."
		desc: "Quando entra in campo, il tempo atmosferico diventa Acquazzone, che include tutti gli effetti di Pioggia e impedisce l'esecuzione delle mosse offensive di tipo Fuoco. Questo tempo dura finché questa abilità non è più attiva per nessun Pokémon, o finché il tempo non viene cambiato dalle abilità Flusso Delta o Terra Estrema.", // NEEDS QC
		shortDesc: "All'entrata, una pioggia intensa cade finché questa abilità è attiva.", // NEEDS QC
	},
	prismarmor: {
		name: "Scudoprisma",
		shortDesc: "Questo Pokémon subisce 3/4 dei danni dagli attacchi superefficaci.", // NEEDS QC
	},
	propellertail: {
		name: "Elicopinna",
		shortDesc: "Le mosse di questo Pokémon non possono essere reindirizzate.", // NEEDS QC
	},
	protean: {
		name: "Mutatipo",
		// Official flavor text: "Cambia il tipo del Pokémon in quello della mossa che usa."
		desc: "Il tipo di questo Pokémon diventa quello della mossa che sta per usare. Questo effetto si applica dopo tutti gli effetti che cambiano il tipo di una mossa. Può verificarsi solo una volta per ogni entrata in campo, e solo se questo Pokémon non è teracristallizzato.", // NEEDS QC
		shortDesc: "Il suo tipo diventa quello della mossa che usa. Una volta per entrata.", // NEEDS QC
		gen8: {
			desc: "Il tipo di questo Pokémon diventa quello della mossa che sta per usare. Questo effetto si applica dopo tutti gli effetti che cambiano il tipo di una mossa.", // NEEDS QC
			shortDesc: "Il tipo di questo Pokémon diventa quello della mossa che sta per usare.", // NEEDS QC
		},
	},
	protosynthesis: {
		name: "Paleoattivazione",
		desc: "Se Sole intenso è attivo o questo Pokémon usa una Capsula energetica che tiene, la sua statistica più alta è moltiplicata per 1,3, o per 1,5 se è la Velocità. I livelli delle statistiche vengono considerati al momento dell'attivazione. In caso di parità, l'ordine di priorità è: Attacco, Difesa, Attacco Speciale, Difesa Speciale, Velocità. Se l'effetto è stato attivato dalla luce solare, una Capsula energetica tenuta non si attiva e l'effetto finisce quando la luce solare non è più attiva. Se l'effetto è stato attivato da una Capsula energetica tenuta, finisce quando questo Pokémon lascia il campo.", // NEEDS QC
		shortDesc: "Col sole o con Capsula energetica: statistica più alta x1,3 (x1,5 se Velocità).", // NEEDS QC

		activate: "  {POKEMON} ha messo in moto la Paleoattivazione grazie al sole intenso!",
		activateFromItem: "  {POKEMON} ha messo in moto la Paleoattivazione grazie alla Capsula energetica!",
		start: "  {STAT:definite:capitalize} di {POKEMON} cresce!",
		end: "  L’effetto della Paleoattivazione di {POKEMON} è finito!",
	},
	psychicsurge: {
		name: "Psicogenesi",
		shortDesc: "All'entrata, questo Pokémon evoca un Campo Psichico.", // NEEDS QC
	},
	punkrock: {
		name: "Punk Rock",
		// Official flavor text: "Aumenta la potenza delle mosse basate sul suono. Inoltre, dimezza i danni subiti dal Pokémon se viene colpito da tali mosse."
		desc: "Le mosse basate sul suono di questo Pokémon hanno la potenza moltiplicata per 1,3. Questo Pokémon subisce metà dei danni dalle mosse basate sul suono.", // NEEDS QC
		shortDesc: "Subisce metà dei danni dalle mosse sonore; le sue fanno x1,3.", // NEEDS QC
	},
	purepower: {
		name: "Forzapura",
		shortDesc: "L'Attacco di questo Pokémon raddoppia.", // NEEDS QC
	},
	purifyingsalt: {
		name: "Sale Purificante",
		desc: "Questo Pokémon non può essere colpito da problemi di stato né da Sbadiglio. Se un Pokémon usa un attacco di tipo Spettro contro questo Pokémon, la sua statistica offensiva è dimezzata nel calcolo dei danni inflitti a questo Pokémon.", // NEEDS QC
		shortDesc: "Gli attacchi Spettro lo colpiscono con offensiva dimezzata; nessuno stato.", // NEEDS QC
	},
	quarkdrive: {
		name: "Carica Quark",
		desc: "Se Campo Elettrico è attivo o questo Pokémon usa una Capsula energetica che tiene, la sua statistica più alta è moltiplicata per 1,3, o per 1,5 se è la Velocità. I livelli delle statistiche vengono considerati al momento dell'attivazione. In caso di parità, l'ordine di priorità è: Attacco, Difesa, Attacco Speciale, Difesa Speciale, Velocità. Se l'effetto è stato attivato dal Campo Elettrico, una Capsula energetica tenuta non si attiva e l'effetto finisce quando il Campo Elettrico non è più attivo. Se l'effetto è stato attivato da una Capsula energetica tenuta, finisce quando questo Pokémon lascia il campo.", // NEEDS QC
		shortDesc: "Campo Elettrico o Capsula energetica: statistica più alta x1,3 (x1,5 se Velocità).", // NEEDS QC

		activate: "  {POKEMON} ha attivato la Carica Quark grazie al Campo Elettrico!",
		activateFromItem: "  {POKEMON} ha attivato la Carica Quark grazie alla Capsula energetica!",
		start: "  {STAT:definite:capitalize} di {POKEMON} cresce!",
		end: "  L’effetto della Carica Quark di {POKEMON} è finito!",
	},
	queenlymajesty: {
		name: "Regalità",
		// Official flavor text: "L’aura di regalità del Pokémon impedisce al nemico di attaccarlo con mosse che hanno priorità alta."
		desc: "Le mosse con priorità usate dagli avversari contro questo Pokémon o i suoi alleati falliscono.", // NEEDS QC
		shortDesc: "Questo Pokémon e i suoi alleati sono protetti dalle mosse avversarie con priorità.", // NEEDS QC

		block: "#damp",
	},
	quickdraw: {
		name: "Colpolesto",
		shortDesc: "30% di probabilità di agire per primo nella sua priorità con mosse offensive.", // NEEDS QC

		activate: "  L’abilità Colpolesto rende più veloce {POKEMON}!",
	},
	quickfeet: {
		name: "Piedisvelti",
		// Official flavor text: "Se il Pokémon è affetto da un problema di stato, la Velocità aumenta."
		desc: "Se questo Pokémon ha un problema di stato, la sua Velocità è moltiplicata per 1,5. Questo Pokémon ignora il dimezzamento della Velocità dovuto alla paralisi.", // NEEDS QC
		shortDesc: "Con un problema di stato, Velocità x1,5; ignora la riduzione da paralisi.", // NEEDS QC
		gen6: {
			desc: "Se questo Pokémon ha un problema di stato, la sua Velocità è moltiplicata per 1,5. Questo Pokémon ignora la riduzione della Velocità a 1/4 dovuta alla paralisi.", // NEEDS QC
		},
	},
	raindish: {
		name: "Copripioggia",
		// Official flavor text: "Il Pokémon recupera PS quando piove."
		desc: "Se Pioggia è attiva, questo Pokémon recupera 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno. Questo effetto è impedito se questo Pokémon ha un Superombrello.", // NEEDS QC
		shortDesc: "Se Pioggia è attiva, recupera 1/16 dei PS max ogni turno.", // NEEDS QC
		gen7: {
			desc: "Se Pioggia è attiva, questo Pokémon recupera 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno.", // NEEDS QC
		},
	},
	rattled: {
		name: "Paura",
		// Official flavor text: "Le mosse di tipo Buio, Spettro e Coleottero spaventano il Pokémon aumentandone la Velocità."
		desc: "La Velocità di questo Pokémon aumenta di un livello se viene colpito da un attacco di tipo Coleottero, Buio o Spettro, o se un avversario lo colpisce con l'abilità Prepotenza.", // NEEDS QC
		shortDesc: "+1 Velocità se subisce un attacco Coleottero, Buio o Spettro, o Prepotenza.", // NEEDS QC
		gen7: {
			desc: "La Velocità di questo Pokémon aumenta di un livello se viene colpito da un attacco di tipo Coleottero, Buio o Spettro.", // NEEDS QC
			shortDesc: "Velocità +1 se colpito da attacchi Coleottero, Buio o Spettro.", // NEEDS QC
		},
	},
	receiver: {
		name: "Ricezione",
		// Official flavor text: "Il Pokémon acquisisce l’abilità di un alleato andato KO."
		desc: "Questo Pokémon copia l'abilità di un alleato che va KO. Le abilità che non possono essere copiate sono Sintonia Equina, Morfosintonia, Sonno Assoluto, Torre di Comando, Fantasmanto, Albergamemorie, Regalfiore, Previsioni, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Malia Tossica, Sciamefusione, Forza Chimica, Paleoattivazione, Carica Quark, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teraguscio, Teramorfosi, Zeroformazione, Traccia, Magidifesa, Stato Zen e Supercambio.", // NEEDS QC
		shortDesc: "Questo Pokémon copia l'abilità di un alleato che va KO.", // NEEDS QC
		gen8: {
			desc: "Questo Pokémon copia l'abilità di un alleato che va KO. Le abilità che non possono essere copiate sono Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Inghiottimissile, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia, Magidifesa e Stato Zen.", // NEEDS QC
		},
		gen7: {
			desc: "Questo Pokémon copia l'abilità di un alleato che va KO. Le abilità che non possono essere copiate sono Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia, Magidifesa e Stato Zen.", // NEEDS QC
		},

		changeAbility: "  L’abilità {ABILITY} di {SOURCE} è passata all’alleato!",
	},
	reckless: {
		name: "Temerarietà",
		// Official flavor text: "Potenzia le mosse che causano contraccolpo."
		desc: "Gli attacchi di questo Pokémon con contraccolpo o danni da fallimento hanno la potenza moltiplicata per 1,2. Non influisce su Scontro.", // NEEDS QC
		shortDesc: "Gli attacchi con contraccolpo o danni da fallimento fanno x1,2; non Scontro.", // NEEDS QC
	},
	refrigerate: {
		name: "Pellegelo",
		// Official flavor text: "Le mosse di tipo Normale diventano di tipo Ghiaccio e la loro potenza aumenta un po’."
		desc: "Le mosse di tipo Normale di questo Pokémon diventano di tipo Ghiaccio e la loro potenza è moltiplicata per 1,2. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, ma prima degli effetti di Pioggiaplasma ed Elettrocontagio.", // NEEDS QC
		shortDesc: "Le sue mosse di tipo Normale diventano di tipo Ghiaccio con 1,2x più potenza.", // NEEDS QC
		gen6: {
			desc: "Le mosse di tipo Normale di questo Pokémon diventano di tipo Ghiaccio e la loro potenza è moltiplicata per 1,3. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa, ma prima degli effetti di Pioggiaplasma ed Elettrocontagio.", // NEEDS QC
			shortDesc: "Le mosse Normale di questo Pokémon diventano di tipo Ghiaccio con 1,3x potenza.", // NEEDS QC
		},
	},
	regenerator: {
		name: "Rigenergia",
		shortDesc: "Questo Pokémon recupera 1/3 dei PS max quando lascia il campo.", // NEEDS QC
	},
	ripen: {
		name: "Maturazione",
		// Official flavor text: "Fa maturare le bacche raddoppiandone gli effetti."
		desc: "Quando questo Pokémon mangia certe bacche, i loro effetti raddoppiano. Le bacche che ripristinano PS o PP ne ripristinano il doppio, quelle che aumentano i livelli delle statistiche li aumentano del doppio, quelle che dimezzano i danni subiti li riducono a 1/4, e una Baccajaba o una Baccaroam fa perdere all'attaccante 1/4 dei suoi PS max, arrotondato per difetto.", // NEEDS QC
		shortDesc: "Quando mangia certe bacche, i loro effetti raddoppiano.", // NEEDS QC
	},
	rivalry: {
		name: "Antagonismo",
		// Official flavor text: "Rende più forti contro nemici dello stesso sesso, ma più deboli contro nemici di sesso opposto."
		desc: "Gli attacchi di questo Pokémon hanno la potenza moltiplicata per 1,25 contro bersagli dello stesso sesso, o per 0,75 contro bersagli di sesso opposto. Non c'è modificatore se questo Pokémon o il bersaglio non ha sesso.", // NEEDS QC
		shortDesc: "I suoi attacchi fanno 1,25x contro lo stesso sesso, 0,75x contro l'opposto.", // NEEDS QC
	},
	rkssystem: {
		name: "Sistema Primevo",
		shortDesc: "Se questo Pokémon è Silvally, il suo tipo diventa quello della ROM.", // NEEDS QC
	},
	rockhead: {
		name: "Testadura",
		// Official flavor text: "Protegge il Pokémon dai contraccolpi."
		desc: "Questo Pokémon non subisce danni da contraccolpo, tranne quelli di Scontro. Non influisce sui danni dell'Assorbisfera né su quelli da fallimento.", // NEEDS QC
		shortDesc: "Non subisce contraccolpi, tranne Scontro, Assorbisfera e fallimenti.", // NEEDS QC
		gen3: {
			desc: "Questo Pokémon non subisce contraccolpi, tranne quello di Scontro. Non influenza i danni da mancato bersaglio.", // NEEDS QC
			shortDesc: "Nessun contraccolpo, tranne Scontro e i danni da mancato bersaglio.", // NEEDS QC
		},
	},
	rockypayload: {
		name: "Portamassi",
		shortDesc: "La statistica offensiva è moltiplicata per 1,5 con gli attacchi di tipo Roccia.", // NEEDS QC
	},
	roughskin: {
		name: "Cartavetro",
		// Official flavor text: "Se il Pokémon è colpito da un attacco diretto, grazie alla sua pelle ruvida infligge danni a sua volta."
		desc: "I Pokémon che colpiscono questo Pokémon con una mossa da contatto perdono 1/8 dei loro PS max, arrotondato per difetto.", // NEEDS QC
		shortDesc: "Chi tocca questo Pokémon perde 1/8 dei suoi PS max.", // NEEDS QC
		gen4: {
			desc: "I Pokémon che toccano questo Pokémon perdono 1/8 dei loro PS max, arrotondato per difetto. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
		},
		gen3: {
			desc: "I Pokémon che toccano questo Pokémon perdono 1/16 dei loro PS max, arrotondato per difetto. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
			shortDesc: "I Pokémon che lo toccano perdono 1/16 dei loro PS max.", // NEEDS QC
		},

		damage: "  {POKEMON} è ferito!",
	},
	runaway: {
		name: "Fugafacile",
		shortDesc: "Nessuna utilità in lotta.", // NEEDS QC
	},
	sandforce: {
		name: "Silicoforza",
		// Official flavor text: "Potenzia le mosse di tipo Roccia, Terra e Acciaio durante le tempeste di sabbia."
		desc: "Se una tempesta di sabbia è attiva, gli attacchi di tipo Terra, Roccia e Acciaio di questo Pokémon hanno la potenza moltiplicata per 1,3. Questo Pokémon non subisce i danni della tempesta di sabbia.", // NEEDS QC
		shortDesc: "Attacchi Terra/Roccia/Acciaio x1,3 nella tempesta di sabbia; immune a essa.", // NEEDS QC
	},
	sandrush: {
		name: "Remasabbia",
		// Official flavor text: "Se c’è una tempeste di sabbia, la Velocità aumenta."
		desc: "Se una tempesta di sabbia è attiva, la Velocità di questo Pokémon raddoppia. Questo Pokémon non subisce i danni della tempesta di sabbia.", // NEEDS QC
		shortDesc: "Nella tempesta di sabbia, la sua Velocità raddoppia; immune a essa.", // NEEDS QC
	},
	sandspit: {
		name: "Sputasabbia",
		shortDesc: "Quando viene colpito da un attacco, si scatena una tempesta di sabbia.", // NEEDS QC
		gen8: {
			desc: "Quando questo Pokémon viene colpito da un attacco, inizia una tempesta di sabbia. Questo effetto viene dopo quelli delle mosse Dynamax e Gigamax.", // NEEDS QC
		},
	},
	sandstream: {
		name: "Sabbiafiume",
		shortDesc: "All'entrata, questo Pokémon evoca una tempesta di sabbia.", // NEEDS QC
	},
	sandveil: {
		name: "Sabbiavelo",
		// Official flavor text: "L’elusione aumenta durante le tempeste di sabbia."
		desc: "Se una tempesta di sabbia è attiva, la precisione delle mosse usate contro questo Pokémon è moltiplicata per 0,8. Questo Pokémon non subisce i danni della tempesta di sabbia.", // NEEDS QC
		shortDesc: "Nella tempesta di sabbia, la sua elusione è x1,25; immune a essa.", // NEEDS QC
	},
	sapsipper: {
		name: "Mangiaerba",
		// Official flavor text: "Se il Pokémon viene colpito da una mossa di tipo Erba, la neutralizza e aumenta il proprio Attacco."
		desc: "Questo Pokémon è immune alle mosse di tipo Erba e il suo Attacco aumenta di un livello quando viene colpito da una mossa di tipo Erba.", // NEEDS QC
		shortDesc: "+1 Attacco se colpito da una mossa Erba; immunità Erba.", // NEEDS QC
	},
	schooling: {
		name: "Banco",
		// Official flavor text: "Quando ha molti PS, il Pokémon forma un banco con i propri simili e si rafforza. Quando ne ha pochi, il banco si disperde."
		desc: "Quando entra in campo, se questo Pokémon è un Wishiwashi di livello 20 o superiore con più di 1/4 dei suoi PS max, assume la Forma Banco. Se è in Forma Banco e i suoi PS scendono a 1/4 dei PS max o meno, torna alla Forma Individuale alla fine del turno. Se è in Forma Individuale e ha più di 1/4 dei suoi PS max alla fine del turno, assume la Forma Banco.", // NEEDS QC
		shortDesc: "Wishiwashi assume la Forma Banco sopra 1/4 dei PS, altrimenti la Individuale.", // NEEDS QC

		transform: "{POKEMON} ha richiamato un banco!",
		transformEnd: "Il banco di {POKEMON} si è disperso!",
	},
	scrappy: {
		name: "Nervisaldi",
		// Official flavor text: "Permette di colpire Pokémon di tipo Spettro con mosse di tipo Normale e Lotta."
		desc: "Questo Pokémon può colpire i Pokémon di tipo Spettro con mosse di tipo Normale e Lotta. È immune all'effetto dell'abilità Prepotenza.", // NEEDS QC
		shortDesc: "Normale e Lotta colpiscono Spettro. Immune a Prepotenza.", // NEEDS QC
		gen7: {
			desc: "Questo Pokémon può colpire i tipi Spettro con mosse di tipo Normale e Lotta.", // NEEDS QC
			shortDesc: "Può colpire gli Spettro con mosse Normale e Lotta.", // NEEDS QC
		},
	},
	screencleaner: {
		name: "Annullabarriere",
		shortDesc: "All'entrata, pone fine a Velaurora, Schermoluce e Riflesso per entrambi.", // NEEDS QC
	},
	seedsower: {
		name: "Spargisemi",
		shortDesc: "Quando viene colpito da un attacco, appare un Campo Erboso.", // NEEDS QC
	},
	serenegrace: {
		name: "Leggiadro",
		// Official flavor text: "Rende più probabili gli effetti aggiuntivi delle mosse."
		desc: "Le mosse di questo Pokémon hanno la probabilità di effetto secondario raddoppiata. Questo effetto si somma all'effetto Arcobaleno, tranne che per gli effetti secondari che fanno tentennare.", // NEEDS QC
		shortDesc: "Le sue mosse hanno la probabilità di effetto secondario raddoppiata.", // NEEDS QC
		gen4: {
			desc: "Le mosse di questo Pokémon hanno la probabilità di effetti secondari raddoppiata.", // NEEDS QC
		},
	},
	shadowshield: {
		name: "Spettroguardia",
		shortDesc: "Se ha tutti i PS, i danni degli attacchi subiti sono dimezzati.", // NEEDS QC
	},
	shadowtag: {
		name: "Pedinombra",
		// Official flavor text: "Il Pokémon calpesta l’ombra del nemico impedendogli la fuga o la sostituzione."
		desc: "Impedisce agli avversari di scegliere di essere sostituiti, a meno che non abbiano una Disfoguscio, siano di tipo Spettro o abbiano anche loro questa abilità.", // NEEDS QC
		shortDesc: "Impedisce agli avversari di lasciare il campo, a meno che non l'abbiano anche loro.", // NEEDS QC
		gen6: {
			desc: "Impedisce agli avversari adiacenti di scegliere di essere sostituiti, a meno che non abbiano una Disfoguscio, siano di tipo Spettro o abbiano anch'essi questa abilità.", // NEEDS QC
			shortDesc: "I nemici adiacenti possono uscire solo se hanno anch'essi questa abilità.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce agli avversari adiacenti di scegliere di essere sostituiti, a meno che non abbiano una Disfoguscio o abbiano anch'essi questa abilità.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce agli avversari di scegliere di essere sostituiti, a meno che non abbiano una Disfoguscio o abbiano anch'essi questa abilità.", // NEEDS QC
			shortDesc: "Impedisce agli avversari di lasciare il campo, a meno che non l'abbiano anche loro.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce agli avversari di scegliere di essere sostituiti.", // NEEDS QC
			shortDesc: "Gli avversari non possono scegliere di essere sostituiti.", // NEEDS QC
		},
	},
	sharpness: {
		name: "Affilama",
		shortDesc: "Le mosse taglienti di questo Pokémon hanno la potenza moltiplicata per 1,5.", // NEEDS QC
	},
	shedskin: {
		name: "Muta",
		// Official flavor text: "Il Pokémon può guarire dai problemi di stato facendo la muta completa della pelle."
		desc: "Questo Pokémon ha il 33% di probabilità che il suo problema di stato venga curato alla fine di ogni turno.", // NEEDS QC
		shortDesc: "33% di probabilità di curare il suo problema di stato a ogni fine turno.", // NEEDS QC
	},
	sheerforce: {
		name: "Forzabruta",
		// Official flavor text: "Aumenta la potenza delle mosse, ma ne annulla gli effetti aggiuntivi."
		desc: "Gli attacchi di questo Pokémon con effetti secondari hanno la potenza moltiplicata per 1,3, ma gli effetti secondari vengono rimossi. Se un effetto secondario è stato rimosso, vengono rimossi anche il contraccolpo dell'Assorbisfera e il recupero della Conchinella di chi attacca, e non si attivano le abilità Iraguscio, Furore, Cambiacolore, Passoindietro, Arraffalesto e Fuggifuggi del bersaglio, né il suo Cartelrosso, il suo Pulsantefuga, la sua Baccalighia o la sua Baccapane.", // NEEDS QC
		shortDesc: "Gli attacchi con effetti secondari fanno x1,3, ma gli effetti vengono rimossi.", // NEEDS QC
		gen8: {
			desc: "Gli attacchi di questo Pokémon con effetti secondari hanno la potenza moltiplicata per 1,3, ma perdono gli effetti secondari. Se un effetto secondario è stato rimosso, vengono rimossi anche il contraccolpo dell'Assorbisfera e la cura della Conchinella di chi la usa, e Furore, Cambiacolore, Passoindietro, Arraffalesto, Fuggifuggi, Cartelrosso, Pulsantefuga, Baccalighia e Baccapane del bersaglio non si attivano.", // NEEDS QC
		},
		gen6: {
			desc: "Gli attacchi di questo Pokémon con effetti secondari hanno la potenza moltiplicata per 1,3, ma perdono gli effetti secondari. Se un effetto secondario è stato rimosso, vengono rimossi anche il contraccolpo dell'Assorbisfera e la cura della Conchinella di chi la usa, e Cambiacolore, Arraffalesto, Cartelrosso, Pulsantefuga, Baccalighia e Baccapane del bersaglio non si attivano.", // NEEDS QC
		},
		gen5: {
			desc: "Gli attacchi di questo Pokémon con effetti secondari hanno la potenza moltiplicata per 1,3, ma perdono gli effetti secondari. Se un effetto secondario è stato rimosso, vengono rimossi anche il contraccolpo dell'Assorbisfera e la cura della Conchinella di chi la usa, e Cambiacolore, Arraffalesto, Cartelrosso e Pulsantefuga del bersaglio non si attivano.", // NEEDS QC
		},
	},
	shellarmor: {
		name: "Guscioscudo",
		shortDesc: "Questo Pokémon non può subire brutti colpi.", // NEEDS QC
	},
	shielddust: {
		name: "Polvoscudo",
		// Official flavor text: "Il Pokémon è protetto da uno strato di scaglie che annulla gli effetti aggiuntivi delle mosse subite."
		desc: "Questo Pokémon non subisce gli effetti secondari delle mosse degli altri Pokémon. Sono impediti gli effetti con una probabilità (anche del 100%) di paralizzare, addormentare, congelare, scottare, avvelenare, confondere, far tentennare questo Pokémon o abbassare i suoi livelli delle statistiche, oltre a Colpo d’Ancora, Inquietantesimo, Lancio, Psicorumore, Sotto Sale, Cucitura d’Ombra, Bomba Sciroppata e Colpo Infernale. L'effetto di Canto Effimero è impedito se questo Pokémon è l'unico bersaglio. Anche gli effetti secondari aggiunti da Roccia di Re, Affilodente e dalle abilità Velentocco, Tanfo e Catena Tossica sono impediti contro questo Pokémon.", // NEEDS QC
		shortDesc: "Ignora gli effetti secondari delle mosse degli altri Pokémon.", // NEEDS QC
		gen8: {
			desc: "Questo Pokémon non è influenzato dagli effetti secondari degli attacchi degli altri Pokémon. Vengono impediti gli attacchi con una probabilità (anche del 100%) di paralizzare, addormentare, congelare, scottare, avvelenare, confondere, far tentennare questo Pokémon o ridurne le statistiche, oltre a Colpo d’Ancora, Inquietantesimo, Lancio, Cucitura d’Ombra e Colpo Infernale. L'effetto di Canto Effimero viene impedito se questo Pokémon è l'unico bersaglio. Anche gli effetti secondari aggiunti da Roccia di Re, Affilodente e le abilità Velentocco e Tanfo vengono impediti contro questo Pokémon.", // NEEDS QC
		},
		gen7: {
			desc: "Questo Pokémon non è influenzato dagli effetti secondari degli attacchi degli altri Pokémon. Vengono impediti gli attacchi con una probabilità (anche del 100%) di paralizzare, addormentare, congelare, scottare, avvelenare, confondere, far tentennare questo Pokémon o ridurne le statistiche, oltre a Colpo d’Ancora, Lancio, Cucitura d’Ombra e Colpo Infernale. L'effetto di Canto Effimero viene impedito se questo Pokémon è l'unico bersaglio. Anche gli effetti secondari aggiunti da Roccia di Re, Affilodente e le abilità Velentocco e Tanfo vengono impediti contro questo Pokémon.", // NEEDS QC
		},
		gen6: {
			desc: "Questo Pokémon non è influenzato dagli effetti secondari degli attacchi degli altri Pokémon. Vengono impediti gli attacchi con una probabilità (anche del 100%) di paralizzare, addormentare, congelare, scottare, avvelenare, confondere, far tentennare questo Pokémon o ridurne le statistiche, oltre a Lancio. Anche gli effetti secondari aggiunti da Roccia di Re, Affilodente e le abilità Velentocco e Tanfo vengono impediti contro questo Pokémon.", // NEEDS QC
		},
		gen4: {
			desc: "Questo Pokémon non è influenzato dagli effetti secondari degli attacchi degli altri Pokémon. Vengono impediti gli attacchi con una probabilità (anche del 100%) di paralizzare, addormentare, congelare, scottare, avvelenare, confondere, far tentennare questo Pokémon o ridurne le statistiche, oltre a Lancio. Anche gli effetti secondari aggiunti da Roccia di Re e Affilodente vengono impediti contro questo Pokémon.", // NEEDS QC
		},
		gen3: {
			desc: "Questo Pokémon non è influenzato dagli effetti secondari degli attacchi degli altri Pokémon. Vengono impediti gli attacchi con una probabilità (anche del 100%) di paralizzare, addormentare, congelare, scottare, avvelenare, confondere, far tentennare questo Pokémon o ridurne le statistiche. Anche l'effetto secondario aggiunto da Roccia di Re viene impedito contro questo Pokémon.", // NEEDS QC
		},
	},
	shieldsdown: {
		name: "Scudosoglia",
		// Official flavor text: "Se i PS scendono a metà o meno, il guscio si rompe e il Pokémon si prepara all’offensiva."
		desc: "Se questo Pokémon è un Minior, assume la Forma Nucleo quando ha metà o meno dei suoi PS max, e la Forma Meteora quando ne ha più di metà. Questo controllo avviene all'entrata in campo e alla fine di ogni turno. In Forma Meteora non può essere colpito da problemi di stato né da Sbadiglio.", // NEEDS QC
		shortDesc: "Minior assume la Forma Nucleo a metà dei PS o meno, altrimenti la Meteora.", // NEEDS QC

		transform: "Scudosoglia attivato!",
		transformEnd: "Scudosoglia disattivato!",
	},
	simple: {
		name: "Disinvoltura",
		shortDesc: "Gli aumenti e le riduzioni delle sue statistiche sono raddoppiati.", // NEEDS QC
		gen7: {
			desc: "Quando una statistica di questo Pokémon aumenta o diminuisce, la variazione è raddoppiata. Questa abilità non influenza gli aumenti dovuti agli effetti della Forza Z prima dell'uso di una mossa Z di stato.", // NEEDS QC
		},
		gen6: {
			desc: "Quando una statistica di questo Pokémon aumenta o diminuisce, la variazione è raddoppiata.", // NEEDS QC
		},
		gen4: {
			desc: "I livelli delle statistiche di questo Pokémon sono considerati raddoppiati nei calcoli. Un livello non può essere considerato superiore a 6 né inferiore a -6.", // NEEDS QC
			shortDesc: "I suoi livelli di statistiche sono considerati raddoppiati nei calcoli.", // NEEDS QC
		},
	},
	skilllink: {
		name: "Abillegame",
		// Official flavor text: "Le mosse multicolpo mandano a segno sempre il massimo dei colpi possibili."
		desc: "Gli attacchi multicolpo di questo Pokémon colpiscono sempre il numero massimo di volte. Triplocalcio e Triplo Axel non verificano la precisione del secondo e del terzo colpo.", // NEEDS QC
		shortDesc: "I suoi attacchi multicolpo colpiscono sempre il numero massimo di volte.", // NEEDS QC
		gen7: {
			desc: "Le mosse multicolpo di questo Pokémon colpiscono sempre il numero massimo di volte. Triplocalcio non verifica la precisione al secondo e al terzo colpo.", // NEEDS QC
		},
		gen4: {
			desc: "Le mosse multicolpo di questo Pokémon colpiscono sempre il numero massimo di volte. Non influenza Triplocalcio.", // NEEDS QC
		},
	},
	slowstart: {
		name: "Lentoinizio",
		shortDesc: "All'entrata, Attacco e Velocità sono dimezzati per 5 turni.", // NEEDS QC
		gen7: {
			desc: "Quando entra in campo, l'Attacco e la Velocità di questo Pokémon sono dimezzati per 5 turni. Durante l'effetto, se usa una mossa Z generica basata su una mossa speciale, il suo Attacco Speciale è dimezzato nel calcolo dei danni.", // NEEDS QC
		},
		gen6: {
			desc: "Quando entra in campo, l'Attacco e la Velocità di questo Pokémon sono dimezzati per 5 turni.", // NEEDS QC
		},

		start: "  {POKEMON} non ingrana!",
		end: "  {POKEMON} ritrova lo slancio!",
	},
	slushrush: {
		name: "Spalaneve",
		shortDesc: "Se nevica, la Velocità di questo Pokémon raddoppia.", // NEEDS QC
		gen8: {
			shortDesc: "Con la grandine, la Velocità di questo Pokémon raddoppia.", // NEEDS QC
		},
	},
	sniper: {
		name: "Cecchino",
		shortDesc: "Se mette a segno un brutto colpo, i danni sono moltiplicati per 1,5.", // NEEDS QC
	},
	snowcloak: {
		name: "Mantelneve",
		// Official flavor text: "Se grandina, l’elusione aumenta."
		desc: "Se nevica, la precisione delle mosse usate contro questo Pokémon è moltiplicata per 0,8.", // NEEDS QC
		shortDesc: "Se nevica, l'elusione di questo Pokémon è moltiplicata per 1,25.", // NEEDS QC
		gen8: {
			desc: "Se Grandine è attiva, la precisione delle mosse usate contro questo Pokémon è moltiplicata per 0,8. Questo Pokémon non subisce danni da Grandine.", // NEEDS QC
			shortDesc: "Con la grandine: elusione x1,25; immune alla grandine.", // NEEDS QC
		},
	},
	snowwarning: {
		name: "Scendineve",
		shortDesc: "All'entrata, questo Pokémon evoca la neve.", // NEEDS QC
		gen8: {
			shortDesc: "Quando entra in campo, questo Pokémon evoca Grandine.", // NEEDS QC
		},
	},
	solarpower: {
		name: "Solarpotere",
		// Official flavor text: "Se la luce del sole è intensa, l’Attacco Speciale aumenta, ma il Pokémon perde PS a ogni turno."
		desc: "Se Sole intenso è attivo, l'Attacco Speciale di questo Pokémon è moltiplicato per 1,5 e perde 1/8 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno. Questi effetti sono impediti se il Pokémon ha un Superombrello.", // NEEDS QC
		shortDesc: "Se Sole intenso è attivo: Att. Sp. x1,5, ma perde 1/8 dei PS max ogni turno.", // NEEDS QC
		gen7: {
			desc: "Se Sole intenso è attivo, l'Attacco Speciale di questo Pokémon è moltiplicato per 1,5 e perde 1/8 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno.", // NEEDS QC
		},
	},
	solidrock: {
		name: "Solidroccia",
		shortDesc: "Questo Pokémon subisce 3/4 dei danni dagli attacchi superefficaci.", // NEEDS QC
	},
	soulheart: {
		name: "Cuoreanima",
		shortDesc: "L'Att. Sp. aumenta di un livello quando un altro Pokémon va KO.", // NEEDS QC
	},
	soundproof: {
		name: "Antisuono",
		shortDesc: "Immune alle mosse basate sul suono, tranne quelle che usa lui stesso.", // NEEDS QC
		gen7: {
			shortDesc: "Immune alle mosse sonore, inclusa Rintoccasana.", // NEEDS QC
		},
		gen5: {
			shortDesc: "Immune alle mosse sonore, tranne Rintoccasana.", // NEEDS QC
		},
		gen4: {
			shortDesc: "Immune alle mosse sonore, inclusa Rintoccasana.", // NEEDS QC
		},
	},
	speedboost: {
		name: "Acceleratore",
		// Official flavor text: "La Velocità aumenta a ogni turno."
		desc: "La Velocità di questo Pokémon aumenta di un livello alla fine di ogni turno completo passato in campo.", // NEEDS QC
		shortDesc: "La Velocità aumenta di un livello a ogni fine turno completo in campo.", // NEEDS QC
	},
	spicyspray: {
		name: "Spargipiccante",
		shortDesc: "Se questo Pokémon viene colpito da un attacco, l'attaccante viene scottato.", // NEEDS QC
	},
	stakeout: {
		name: "Sorveglianza",
		shortDesc: "Statistica offensiva raddoppiata contro un bersaglio appena entrato.", // NEEDS QC
	},
	stall: {
		name: "Rallentatore",
		shortDesc: "Agisce per ultimo tra le mosse di priorità uguale o superiore.", // NEEDS QC
	},
	stalwart: {
		name: "Volontà di Ferro",
		shortDesc: "Le mosse di questo Pokémon non possono essere reindirizzate.", // NEEDS QC
	},
	stamina: {
		name: "Sopportazione",
		shortDesc: "La Difesa aumenta di un livello quando una mossa lo danneggia.", // NEEDS QC
	},
	stancechange: {
		name: "Accendilotta",
		// Official flavor text: "Assume la Forma Spada se usa una mossa d’attacco e la Forma Scudo se usa Scudo Reale."
		desc: "Se questo Pokémon è un Aegislash, assume la Forma Spada prima di usare una mossa offensiva e la Forma Scudo prima di usare Scudo Reale.", // NEEDS QC
		shortDesc: "Aegislash passa alla Forma Spada prima di attaccare, alla Scudo prima di Scudo Reale.", // NEEDS QC
		gen6: {
			desc: "Se questo Pokémon è un Aegislash, passa alla Forma Spada prima di usare una mossa d'attacco e alla Forma Scudo prima di usare Scudo Reale.", // NEEDS QC
		},

		transform: "Trasformazione in Forma Spada!",
		transformEnd: "Trasformazione in Forma Scudo!",
	},
	static: {
		name: "Statico",
		shortDesc: "30% di probabilità di paralizzare chi tocca questo Pokémon.", // NEEDS QC
		gen4: {
			desc: "30% di probabilità che un Pokémon che tocca questo Pokémon venga paralizzato. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
		},
		gen3: {
			desc: "1/3 di probabilità che un Pokémon che tocca questo Pokémon venga paralizzato. Questo effetto non si verifica se questo Pokémon non ha perso PS nell'attacco.", // NEEDS QC
			shortDesc: "1/3 di probabilità di paralizzare i Pokémon che lo toccano.", // NEEDS QC
		},
	},
	steadfast: {
		name: "Cuordeciso",
		shortDesc: "Se questo Pokémon tentenna, la sua Velocità aumenta di un livello.", // NEEDS QC
	},
	steamengine: {
		name: "Vapormacchina",
		// Official flavor text: "Se il Pokémon viene colpito da una mossa di tipo Acqua o Fuoco, la sua Velocità aumenta moltissimo."
		desc: "La Velocità di questo Pokémon aumenta di 6 livelli quando subisce danni da una mossa di tipo Fuoco o Acqua.", // NEEDS QC
		shortDesc: "La Velocità aumenta di 6 livelli se subisce danni di tipo Fuoco o Acqua.", // NEEDS QC
	},
	steelworker: {
		name: "Tempracciaio",
		shortDesc: "La statistica offensiva è moltiplicata per 1,5 con gli attacchi di tipo Acciaio.", // NEEDS QC
	},
	steelyspirit: {
		name: "Spiritoferreo",
		// Official flavor text: "Potenzia gli attacchi di tipo Acciaio degli alleati."
		desc: "Le mosse di tipo Acciaio di questo Pokémon e dei suoi alleati hanno la potenza moltiplicata per 1,5. Influisce su Obbliderio anche se chi l'ha usata non è più in campo.", // NEEDS QC
		shortDesc: "Le mosse Acciaio sue e degli alleati fanno 1,5x più danni.", // NEEDS QC
	},
	stench: {
		name: "Tanfo",
		// Official flavor text: "A volte il cattivo odore emesso dal Pokémon fa tentennare i nemici quando attacca."
		desc: "Le mosse di questo Pokémon che normalmente non possono far tentennare il bersaglio ottengono il 10% di probabilità di farlo tentennare.", // NEEDS QC
		shortDesc: "Le mosse senza probabilità di far tentennare ottengono il 10% di farlo.", // NEEDS QC
		gen4: {
			desc: "Nessuna utilità in lotta.", // NEEDS QC
			shortDesc: "Nessuna utilità in lotta.", // NEEDS QC
		},
	},
	stickyhold: {
		name: "Antifurto",
		// Official flavor text: "Gli strumenti restano appiccicati al corpo adesivo del Pokémon e non possono essere rubati."
		desc: "Questo Pokémon non può perdere il suo strumento a causa dell'abilità o di un attacco di un altro Pokémon, a meno che l'attacco non lo mandi KO. Una Vischiopunta viene trasferita agli altri Pokémon nonostante questa abilità.", // NEEDS QC
		shortDesc: "Non può perdere il suo strumento a causa di un altro Pokémon.", // NEEDS QC
		gen4: {
			desc: "Questo Pokémon non può perdere lo strumento a causa dell'attacco di un altro Pokémon, anche se l'attacco lo manda KO. Una Vischiopunta viene trasferita agli altri Pokémon nonostante questa abilità.", // NEEDS QC
		},

		block: "  Lo strumento di {POKEMON} non può essere rubato!",
	},
	stormdrain: {
		name: "Acquascolo",
		// Official flavor text: "Il Pokémon attira e neutralizza le mosse di tipo Acqua e fa aumentare il proprio Attacco Speciale."
		desc: "Questo Pokémon è immune alle mosse di tipo Acqua e il suo Attacco Speciale aumenta di un livello quando viene colpito da una mossa di tipo Acqua. Se questo Pokémon non è il bersaglio di una mossa di tipo Acqua a bersaglio singolo usata da un altro Pokémon, la reindirizza su di sé se è nel suo raggio. Se più Pokémon possono reindirizzarla con questa abilità, lo fa quello con la Velocità più alta o, in caso di parità, quello con l'abilità attiva da più tempo.", // NEEDS QC
		shortDesc: "Attira le mosse Acqua e ottiene +1 Att. Sp.; immunità Acqua.", // NEEDS QC
		gen4: {
			desc: "Se questo Pokémon non è il bersaglio di una mossa di tipo Acqua a bersaglio singolo usata da un altro Pokémon, la reindirizza su di sé.", // NEEDS QC
			shortDesc: "Attira su di sé le mosse Acqua a bersaglio singolo.", // NEEDS QC
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "Ferromascella",
		// Official flavor text: "La robusta mascella del Pokémon permette morsi molto potenti."
		desc: "Gli attacchi di morso di questo Pokémon hanno la potenza moltiplicata per 1,5.", // NEEDS QC
		shortDesc: "Gli attacchi di morso hanno 1,5x più potenza. Coleomorso escluso.", // NEEDS QC
	},
	sturdy: {
		name: "Vigore",
		// Official flavor text: "Evita che il Pokémon vada KO in un sol colpo se ha tutti i PS, e lo rende immune alle mosse che causano KO immediato."
		desc: "Se questo Pokémon ha tutti i suoi PS, resiste a un colpo con almeno 1 PS. Le mosse KO in un colpo falliscono contro questo Pokémon.", // NEEDS QC
		shortDesc: "A PS pieni, resiste a un colpo con almeno 1 PS. Immune ai KO in un colpo.", // NEEDS QC
		gen4: {
			desc: "Le mosse KO in un colpo falliscono contro questo Pokémon.", // NEEDS QC
			shortDesc: "Le mosse KO in un colpo falliscono contro di lui.", // NEEDS QC
		},

		activate: "  {POKEMON} sopporta il colpo!",
	},
	suctioncups: {
		name: "Ventose",
		shortDesc: "Non può essere costretto a lasciare il campo da attacchi o strumenti.", // NEEDS QC

		block: "  {POKEMON} è ancorato al suolo grazie alle ventose!",
	},
	superluck: {
		name: "Supersorte",
		shortDesc: "Il tasso di brutto colpo di questo Pokémon aumenta di un livello.", // NEEDS QC
	},
	supersweetsyrup: {
		name: "Sciroppo Sublime",
		shortDesc: "All'entrata, riduce l'elusione degli avversari di 1. Una volta per lotta.", // NEEDS QC

		start: "  Dallo sciroppo di {POKEMON} si leva un dolce profumino!",
	},
	supremeoverlord: {
		name: "Generale Supremo",
		desc: "Le mosse di questo Pokémon hanno la potenza moltiplicata per 1 + (X × 0,1), dove X è il numero totale di volte in cui i Pokémon della sua squadra sono andati KO al momento dell'attivazione di questa abilità. X non può superare 5.", // NEEDS QC
		shortDesc: "Le sue mosse guadagnano il 10% di potenza per alleato KO, fino a 5.", // NEEDS QC

		activate: "  {POKEMON} ha ricevuto vigore dai suoi compagni sconfitti!",
	},
	surgesurfer: {
		name: "Codasurf",
		shortDesc: "Se un Campo Elettrico è attivo, la sua Velocità raddoppia.", // NEEDS QC
	},
	swarm: {
		name: "Aiutinsetto",
		// Official flavor text: "Quando il Pokémon ha pochi PS, la potenza delle sue mosse di tipo Coleottero aumenta."
		desc: "Quando questo Pokémon ha 1/3 o meno dei suoi PS max, arrotondato per difetto, la sua statistica offensiva è moltiplicata per 1,5 quando usa un attacco di tipo Coleottero.", // NEEDS QC
		shortDesc: "A 1/3 dei PS o meno, la statistica offensiva è x1,5 con gli attacchi Coleottero.", // NEEDS QC
		gen4: {
			desc: "Quando questo Pokémon ha 1/3 o meno dei suoi PS max, arrotondato per difetto, la potenza dei suoi attacchi di tipo Coleottero è moltiplicata per 1,5.", // NEEDS QC
			shortDesc: "A 1/3 o meno dei PS max, i suoi attacchi Coleottero hanno 1,5x potenza.", // NEEDS QC
		},
	},
	sweetveil: {
		name: "Dolcevelo",
		// Official flavor text: "Rende il Pokémon e i suoi alleati immuni al sonno."
		desc: "Questo Pokémon e i suoi alleati non possono addormentarsi, ma quelli già addormentati non si svegliano subito. Questo Pokémon e i suoi alleati non possono usare Riposo con successo né essere colpiti da Sbadiglio, e quelli già colpiti non si addormenteranno.", // NEEDS QC
		shortDesc: "Questo Pokémon e i suoi alleati non possono addormentarsi; chi dorme non si sveglia.", // NEEDS QC

		block: "  {POKEMON} resta vigile a causa dell’abilità Dolcevelo!",
	},
	swiftswim: {
		name: "Nuotovelox",
		// Official flavor text: "Se piove, la Velocità aumenta."
		desc: "Se Pioggia è attiva, la Velocità di questo Pokémon raddoppia. Questo effetto è impedito se questo Pokémon ha un Superombrello.", // NEEDS QC
		shortDesc: "Se Pioggia è attiva, la Velocità di questo Pokémon raddoppia.", // NEEDS QC
		gen7: {
			desc: "Se Pioggia è attiva, la Velocità di questo Pokémon raddoppia.", // NEEDS QC
		},
	},
	swordofruin: {
		name: "Spada Nefasta",
		shortDesc: "I Pokémon in campo senza questa abilità hanno la Difesa moltiplicata per 0,75.", // NEEDS QC

		start: "  La Difesa dei Pokémon intorno si indebolisce a causa dell’abilità Spada Nefasta di {POKEMON}!",
	},
	symbiosis: {
		name: "Simbiosi",
		// Official flavor text: "Se un alleato usa uno strumento, il Pokémon gli passa il proprio."
		desc: "Se un alleato usa il suo strumento, questo Pokémon gli dà immediatamente il proprio. Non si attiva se lo strumento dell'alleato è stato rubato o rimosso, o se l'alleato ha usato un Pulsantefuga o uno Zainofuga.", // NEEDS QC
		shortDesc: "Se un alleato usa il suo strumento, questo Pokémon gli dà subito il proprio.", // NEEDS QC
		gen7: {
			desc: "Se un alleato usa il suo strumento, questo Pokémon gli dà immediatamente il proprio. Non si attiva se lo strumento dell'alleato è stato rubato o fatto cadere, o se l'alleato ha usato un Pulsantefuga.", // NEEDS QC
		},
		gen6: {
			desc: "Se un alleato usa il suo strumento, questo Pokémon gli dà immediatamente il proprio. Non si attiva se lo strumento dell'alleato è stato rubato o fatto cadere.", // NEEDS QC
		},

		activate: "  {POKEMON} dà {ITEM:definite} {TARGET:a}!",
	},
	synchronize: {
		name: "Sincronismo",
		// Official flavor text: "Se un nemico avvelena, paralizza o scotta un Pokémon con questa abilità, viene colpito dallo stesso problema di stato."
		desc: "Se un altro Pokémon scotta, paralizza, avvelena o iperavvelena questo Pokémon, subisce lo stesso problema di stato.", // NEEDS QC
		shortDesc: "Se un altro Pokémon lo scotta, avvelena o paralizza, subisce lo stesso stato.", // NEEDS QC
		gen4: {
			desc: "Se un altro Pokémon scotta, paralizza o avvelena questo Pokémon, riceve lo stesso problema di stato. Se un altro Pokémon iperavvelena questo Pokémon, viene avvelenato normalmente.", // NEEDS QC
		},
	},
	tabletsofruin: {
		name: "Amuleto Nefasto",
		shortDesc: "I Pokémon in campo senza questa abilità hanno l'Attacco moltiplicato per 0,75.", // NEEDS QC

		start: "  L’Attacco dei Pokémon intorno si indebolisce a causa dell’abilità Amuleto Nefasto di {POKEMON}!",
	},
	tangledfeet: {
		name: "Intricopiedi",
		shortDesc: "L'elusione di questo Pokémon raddoppia finché è confuso.", // NEEDS QC
	},
	tanglinghair: {
		name: "Boccolidoro",
		shortDesc: "Chi tocca questo Pokémon vede la propria Velocità ridursi di un livello.", // NEEDS QC
	},
	technician: {
		name: "Tecnico",
		// Official flavor text: "Potenzia le mosse più deboli del Pokémon."
		desc: "Le mosse di questo Pokémon con potenza 60 o inferiore hanno la potenza moltiplicata per 1,5, compresa Scontro. Questo effetto si applica dopo che un effetto della mossa ne ha modificato la potenza.", // NEEDS QC
		shortDesc: "Le sue mosse con potenza 60 o meno fanno x1,5, Scontro compresa.", // NEEDS QC
		gen4: {
			desc: "Le mosse di questo Pokémon con 60 o meno di potenza hanno la potenza moltiplicata per 1,5, tranne Scontro. Questo effetto si applica dopo che l'effetto di una mossa ne cambia la potenza, e dopo gli effetti di Sottocarica e Altruismo.", // NEEDS QC
			shortDesc: "Le sue mosse con 60 o meno di potenza hanno 1,5x potenza, tranne Scontro.", // NEEDS QC
		},
	},
	telepathy: {
		name: "Telepatia",
		shortDesc: "Questo Pokémon non subisce danni dagli attacchi dei suoi alleati.", // NEEDS QC

		block: "  {POKEMON} non può essere attaccato da un alleato!",
	},
	teraformzero: {
		name: "Zeroformazione",
		shortDesc: "Terapagos: la teracristallizzazione annulla tempo e campi. Una volta per lotta.", // NEEDS QC
	},
	terashell: {
		name: "Teraguscio",
		desc: "Se questo Pokémon è un Terapagos con tutti i suoi PS, l'efficacia degli attacchi contro di lui diventa 0,5, a meno che non sia immune alla mossa. Le mosse multicolpo mantengono la stessa efficacia per tutto l'attacco.", // NEEDS QC
		shortDesc: "Terapagos: a PS pieni, gli attacchi subiti hanno efficacia 0,5, salvo immunità.", // NEEDS QC

		activate: "  {POKEMON} fa risplendere la sua corazza e altera i rapporti tra i tipi!",
	},
	terashift: {
		name: "Teramorfosi",
		shortDesc: "Se questo Pokémon è Terapagos, assume la Forma Teracristal all'entrata.", // NEEDS QC

		transform: "{POKEMON} si è trasformato!",
	},
	teravolt: {
		name: "Teravolt",
		// Official flavor text: "Quando il Pokémon attacca, ignora l’abilità del bersaglio se questa ha effetto sulle mosse."
		desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Codarmatura, Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Corposgargiante, Fantasmanto, Pellearsa, Mangiaterra, Filtro, Fuocardore, Regalfiore, Fiorvelo, Morbidone, Amicoscudo, Foltopelo, Corpo Aureo, Peloderba, Cane da Guardia, Antifuoco, Metalpesante, Ipertaglio, Gelofaccia, Geloscaglie, Risplendi, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Occhio Interiore, Blindospecchio, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Pastelvelo, Punk Rock, Sale Purificante, Regalità, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Teraguscio, Termoscambio, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Bolladacqua, Idrovelo, Bentostato, Fumochiaro, Vento Propizio, Magidifesa e Splendicute. Questo effetto riguarda tutti gli altri Pokémon in campo, che siano o meno bersagli della mossa di questo Pokémon e che la loro abilità gli sia vantaggiosa o meno.", // NEEDS QC
		shortDesc: "Le sue mosse e i loro effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		gen8: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Corposgargiante, Fantasmanto, Pellearsa, Filtro, Fuocardore, Regalfiore, Fiorvelo, Morbidone, Amicoscudo, Foltopelo, Peloderba, Antifuoco, Metalpesante, Ipertaglio, Gelofaccia, Geloscaglie, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Blindospecchio, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Pastelvelo, Punk Rock, Regalità, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Bolladacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen7: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Auratetra, Corposgargiante, Fantasmanto, Pellearsa, Aurafolletto, Filtro, Fuocardore, Regalfiore, Fiorvelo, Morbidone, Amicoscudo, Foltopelo, Peloderba, Antifuoco, Metalpesante, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Regalità, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Bolladacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen6: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Auratetra, Pellearsa, Aurafolletto, Filtro, Fuocardore, Regalfiore, Fiorvelo, Amicoscudo, Foltopelo, Peloderba, Antifuoco, Metalpesante, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen5: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Lottascudo, Pettinfuori, Corpochiaro, Inversione, Umidità, Pellearsa, Filtro, Fuocardore, Regalfiore, Amicoscudo, Antifuoco, Metalpesante, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Elettrorapid, Multisquame, Indifferenza, Mente Locale, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen4: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Lottascudo, Corpochiaro, Umidità, Pellearsa, Filtro, Fuocardore, Regalfiore, Antifuoco, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Parafulmine, Scioltezza, Magmascudo, Pelledura, Elettrorapid, Indifferenza, Mente Locale, Sabbiavelo, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Intricopiedi, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Idrovelo, Fumochiaro e Magidifesa. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon. Il bonus all'Attacco dell'abilità Regalfiore di un alleato non viene ignorato.", // NEEDS QC
		},

		start: "  {POKEMON} emana un’aura repulsiva!",
	},
	thermalexchange: {
		name: "Termoscambio",
		desc: "L'Attacco di questo Pokémon aumenta di un livello quando subisce danni da una mossa di tipo Fuoco. Questo Pokémon non può essere scottato. Ottenere questa abilità mentre è scottato lo cura.", // NEEDS QC
		shortDesc: "+1 Attacco se subisce danni di tipo Fuoco; non può essere scottato.", // NEEDS QC
	},
	thickfat: {
		name: "Grassospesso",
		// Official flavor text: "Il Pokémon è protetto da uno spesso strato di grasso che dimezza il danno causato da mosse di tipo Fuoco e Ghiaccio."
		desc: "Se un Pokémon usa un attacco di tipo Fuoco o Ghiaccio contro questo Pokémon, la sua statistica offensiva è dimezzata nel calcolo dei danni inflitti a questo Pokémon.", // NEEDS QC
		shortDesc: "Le mosse Fuoco e Ghiaccio lo colpiscono con l'offensiva dimezzata.", // NEEDS QC
		gen4: {
			desc: "La potenza degli attacchi di tipo Fuoco e Ghiaccio contro questo Pokémon è dimezzata.", // NEEDS QC
			shortDesc: "Gli attacchi Fuoco e Ghiaccio contro questo Pokémon hanno potenza dimezzata.", // NEEDS QC
		},
		gen3: {
			desc: "Se un Pokémon usa un attacco di tipo Fuoco o Ghiaccio contro questo Pokémon, il suo Attacco Speciale è dimezzato nel calcolo dei danni inflitti a questo Pokémon.", // NEEDS QC
			shortDesc: "Le mosse Fuoco/Ghiaccio contro di lui calcolano con Att. Sp. dimezzato.", // NEEDS QC
		},
	},
	tintedlens: {
		name: "Lentifumé",
		shortDesc: "I suoi attacchi non molto efficaci infliggono danni doppi.", // NEEDS QC
	},
	torrent: {
		name: "Acquaiuto",
		// Official flavor text: "Quando il Pokémon ha pochi PS, la potenza delle sue mosse di tipo Acqua aumenta."
		desc: "Quando questo Pokémon ha 1/3 o meno dei suoi PS max, arrotondato per difetto, la sua statistica offensiva è moltiplicata per 1,5 quando usa un attacco di tipo Acqua.", // NEEDS QC
		shortDesc: "A 1/3 dei PS o meno, la statistica offensiva è x1,5 con gli attacchi Acqua.", // NEEDS QC
		gen4: {
			desc: "Quando questo Pokémon ha 1/3 o meno dei suoi PS max, arrotondato per difetto, la potenza dei suoi attacchi di tipo Acqua è moltiplicata per 1,5.", // NEEDS QC
			shortDesc: "A 1/3 o meno dei PS max, i suoi attacchi Acqua hanno 1,5x potenza.", // NEEDS QC
		},
	},
	toughclaws: {
		name: "Unghiedure",
		shortDesc: "Le sue mosse da contatto hanno la potenza moltiplicata per 1,3.", // NEEDS QC
	},
	toxicboost: {
		name: "Velenimpeto",
		// Official flavor text: "Se il Pokémon è avvelenato, la potenza delle sue mosse fisiche aumenta."
		desc: "Quando questo Pokémon è avvelenato, la potenza dei suoi attacchi fisici è moltiplicata per 1,5.", // NEEDS QC
		shortDesc: "Quando è avvelenato, i suoi attacchi fisici hanno 1,5x più potenza.", // NEEDS QC
	},
	toxicchain: {
		name: "Catena Tossica",
		desc: "Gli attacchi di questo Pokémon hanno il 30% di probabilità di iperavvelenare. Questo effetto si applica prima della probabilità di effetto secondario propria della mossa.", // NEEDS QC
		shortDesc: "I suoi attacchi hanno il 30% di probabilità di iperavvelenare.", // NEEDS QC
	},
	toxicdebris: {
		name: "Mantossina",
		shortDesc: "Se subisce un attacco fisico, piazza Fielepunte nella parte avversaria.", // NEEDS QC
	},
	trace: {
		name: "Traccia",
		// Official flavor text: "Quando il Pokémon entra in campo, copia l’abilità di un nemico."
		desc: "Quando entra in campo, questo Pokémon copia l'abilità di un avversario scelto a caso. Le abilità che non possono essere copiate sono Sintonia Equina, Morfosintonia, Sonno Assoluto, Torre di Comando, Fantasmanto, Albergamemorie, Regalfiore, Previsioni, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Malia Tossica, Sciamefusione, Forza Chimica, Paleoattivazione, Carica Quark, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Zeroformazione, Teraguscio, Teramorfosi, Traccia, Stato Zen e Supercambio. Se nessun avversario ha un'abilità copiabile, questa abilità si attiverà non appena possibile.", // NEEDS QC
		shortDesc: "All'entrata, o appena possibile, copia l'abilità di un avversario a caso.", // NEEDS QC
		gen8: {
			desc: "Quando entra in campo, questo Pokémon copia l'abilità di un avversario a caso. Le abilità che non possono essere copiate sono Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Inghiottimissile, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia e Stato Zen. Se nessun avversario ha un'abilità copiabile, questa abilità si attiva non appena ce n'è una.", // NEEDS QC
		},
		gen7: {
			desc: "Quando entra in campo, questo Pokémon copia l'abilità di un avversario a caso. Le abilità che non possono essere copiate sono Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia e Stato Zen. Se nessun avversario ha un'abilità copiabile, questa abilità si attiva non appena ce n'è una.", // NEEDS QC
		},
		gen6: {
			desc: "Quando entra in campo, questo Pokémon copia l'abilità di un avversario adiacente a caso. Le abilità che non possono essere copiate sono Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Accendilotta, Traccia e Stato Zen. Se nessun avversario ha un'abilità copiabile, questa abilità si attiva non appena ce n'è una.", // NEEDS QC
		},
		gen5: {
			desc: "Quando entra in campo, questo Pokémon copia l'abilità di un avversario adiacente a caso. Le abilità che non possono essere copiate sono Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Traccia e Stato Zen. Se nessun avversario ha un'abilità copiabile, questa abilità si attiva non appena ce n'è una.", // NEEDS QC
		},
		gen4: {
			desc: "Quando entra in campo, questo Pokémon copia l'abilità di un avversario a caso. Le abilità che non possono essere copiate sono Previsioni, Multitipo e Traccia. Se nessun avversario ha un'abilità copiabile, questa abilità si attiva non appena ce n'è una.", // NEEDS QC
		},
		gen3: {
			desc: "Quando entra in campo, questo Pokémon copia l'abilità di un avversario a caso.", // NEEDS QC
		},

		changeAbility: "  {POKEMON} traccia {ABILITY} di {SOURCE}!",
	},
	transistor: {
		name: "Transistor",
		shortDesc: "La statistica offensiva è moltiplicata per 1,3 con gli attacchi Elettro.", // NEEDS QC
		gen8: {
			shortDesc: "La sua statistica offensiva è x1,5 quando usa un attacco Elettro.", // NEEDS QC
		},
	},
	triage: {
		name: "Primacura",
		shortDesc: "Le sue mosse curative hanno la priorità aumentata di 3.", // NEEDS QC
	},
	truant: {
		name: "Pigrone",
		shortDesc: "Questo Pokémon agisce solo un turno sì e uno no.", // NEEDS QC
		gen3: {
			desc: "Questo Pokémon poltrisce un turno sì e uno no invece di usare una mossa. Se sostituisce un Pokémon andato KO per effetti di fine turno, poltrisce nel suo primo turno.", // NEEDS QC
		},

		cant: "{POKEMON} sta ciondolando!",
	},
	turboblaze: {
		name: "Piroturbina",
		// Official flavor text: "Quando il Pokémon attacca, ignora l’abilità del bersaglio se questa ha effetto sulle mosse."
		desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Codarmatura, Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Corposgargiante, Fantasmanto, Pellearsa, Mangiaterra, Filtro, Fuocardore, Regalfiore, Fiorvelo, Morbidone, Amicoscudo, Foltopelo, Corpo Aureo, Peloderba, Cane da Guardia, Antifuoco, Metalpesante, Ipertaglio, Gelofaccia, Geloscaglie, Risplendi, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Occhio Interiore, Blindospecchio, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Pastelvelo, Punk Rock, Sale Purificante, Regalità, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Teraguscio, Termoscambio, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Bolladacqua, Idrovelo, Bentostato, Fumochiaro, Vento Propizio, Magidifesa e Splendicute. Questo effetto riguarda tutti gli altri Pokémon in campo, che siano o meno bersagli della mossa di questo Pokémon e che la loro abilità gli sia vantaggiosa o meno.", // NEEDS QC
		shortDesc: "Le sue mosse e i loro effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		gen8: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Corposgargiante, Fantasmanto, Pellearsa, Filtro, Fuocardore, Regalfiore, Fiorvelo, Morbidone, Amicoscudo, Foltopelo, Peloderba, Antifuoco, Metalpesante, Ipertaglio, Gelofaccia, Geloscaglie, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Blindospecchio, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Pastelvelo, Punk Rock, Regalità, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Bolladacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen7: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Auratetra, Corposgargiante, Fantasmanto, Pellearsa, Aurafolletto, Filtro, Fuocardore, Regalfiore, Fiorvelo, Morbidone, Amicoscudo, Foltopelo, Peloderba, Antifuoco, Metalpesante, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Regalità, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Bolladacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen6: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Aromavelo, Frangiaura, Lottascudo, Pettinfuori, Antiproiettile, Corpochiaro, Inversione, Umidità, Auratetra, Pellearsa, Aurafolletto, Filtro, Fuocardore, Regalfiore, Fiorvelo, Amicoscudo, Foltopelo, Peloderba, Antifuoco, Metalpesante, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Elettrorapid, Multisquame, Indifferenza, Copricapo, Mente Locale, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Dolcevelo, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen5: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Lottascudo, Pettinfuori, Corpochiaro, Inversione, Umidità, Pellearsa, Filtro, Fuocardore, Regalfiore, Amicoscudo, Antifuoco, Metalpesante, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Metalleggero, Parafulmine, Scioltezza, Magispecchio, Magmascudo, Pelledura, Elettrorapid, Multisquame, Indifferenza, Mente Locale, Sabbiavelo, Mangiaerba, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Intricopiedi, Telepatia, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Idrovelo, Fumochiaro, Magidifesa e Splendicute. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon, e che la sua abilità gli sia utile o meno.", // NEEDS QC
		},
		gen4: {
			desc: "Le mosse di questo Pokémon e i loro effetti ignorano certe abilità degli altri Pokémon. Le abilità che possono essere ignorate sono Lottascudo, Corpochiaro, Umidità, Pellearsa, Filtro, Fuocardore, Regalfiore, Antifuoco, Ipertaglio, Immunità, Forza Interiore, Insonnia, Sguardofermo, Fogliamanto, Levitazione, Parafulmine, Scioltezza, Magmascudo, Pelledura, Elettrorapid, Indifferenza, Mente Locale, Sabbiavelo, Guscioscudo, Polvoscudo, Disinvoltura, Mantelneve, Solidroccia, Antisuono, Antifurto, Acquascolo, Vigore, Ventose, Intricopiedi, Grassospesso, Imprudenza, Spiritovivo, Assorbivolt, Assorbacqua, Idrovelo, Fumochiaro e Magidifesa. Questo riguarda ogni altro Pokémon in campo, che sia o meno bersaglio della mossa di questo Pokémon. Il bonus all'Attacco dell'abilità Regalfiore di un alleato non viene ignorato.", // NEEDS QC
		},

		start: "  {POKEMON} emana un’aura infuocata!",
	},
	unaware: {
		name: "Imprudenza",
		// Official flavor text: "Quando il Pokémon attacca, ignora le modifiche alle statistiche del nemico."
		desc: "Questo Pokémon ignora i livelli di Attacco, Attacco Speciale e precisione degli altri Pokémon quando subisce danni, e ignora i livelli di Difesa, Difesa Speciale ed elusione degli altri Pokémon quando infligge danni.", // NEEDS QC
		shortDesc: "Ignora i cambi di statistiche degli altri Pokémon nei calcoli dei danni.", // NEEDS QC
	},
	unburden: {
		name: "Agiltecnica",
		// Official flavor text: "Se il Pokémon usa o perde uno strumento, la sua Velocità aumenta."
		desc: "Se questo Pokémon perde il suo strumento per qualsiasi motivo, la sua Velocità raddoppia finché resta in campo, mantiene questa abilità e non ha strumenti.", // NEEDS QC
		shortDesc: "Velocità x2 se perde lo strumento; persa se esce o riceve strumento/abilità.", // NEEDS QC
	},
	unnerve: {
		name: "Agitazione",
		// Official flavor text: "Il nemico viene intimidito e non può mangiare bacche."
		desc: "Finché questo Pokémon è in campo, gli avversari non possono mangiare le loro bacche. Questa abilità si attiva prima delle trappole e delle altre abilità.", // NEEDS QC
		shortDesc: "Finché è in campo, gli avversari non possono mangiare le loro bacche.", // NEEDS QC

		start: "  {TEAM:capitalize} non riesce a mangiare le bacche per l’agitazione!",
	},
	unseenfist: {
		name: "Pugni Invisibili",
		shortDesc: "Le sue mosse da contatto ignorano le protezioni, tranne Dynabarriera.", // NEEDS QC
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "Vaso Nefasto",
		shortDesc: "I Pokémon in campo senza questa abilità hanno l'Att. Sp. moltiplicato per 0,75.", // NEEDS QC

		start: "  L’Attacco Speciale dei Pokémon intorno si indebolisce a causa dell’abilità Vaso Nefasto di {POKEMON}!",
	},
	victorystar: {
		name: "Vittorstella",
		shortDesc: "Le mosse sue e degli alleati hanno la precisione moltiplicata per 1,1.", // NEEDS QC
	},
	vitalspirit: {
		name: "Spiritovivo",
		shortDesc: "Non può addormentarsi. Ottenerla mentre dorme lo sveglia.", // NEEDS QC
	},
	voltabsorb: {
		name: "Assorbivolt",
		// Official flavor text: "Se il Pokémon viene colpito da una mossa di tipo Elettro, recupera PS anziché subire danni."
		desc: "Questo Pokémon è immune alle mosse di tipo Elettro e recupera 1/4 dei suoi PS max, arrotondato per difetto, quando viene colpito da una mossa di tipo Elettro.", // NEEDS QC
		shortDesc: "Recupera 1/4 dei PS max se colpito da mosse Elettro; immunità Elettro.", // NEEDS QC
		gen3: {
			desc: "Questo Pokémon è immune alle mosse offensive di tipo Elettro e recupera 1/4 dei suoi PS max, arrotondato per difetto, quando viene colpito da una di esse.", // NEEDS QC
			shortDesc: "Cura 1/4 dei PS max contro le mosse Elettro offensive; immune.", // NEEDS QC
		},
	},
	wanderingspirit: {
		name: "Anima Errante",
		// Official flavor text: "Se il Pokémon subisce un attacco diretto, scambia la sua abilità con quella di chi lo ha colpito."
		desc: "I Pokémon che colpiscono questo Pokémon con una mossa da contatto scambiano la propria abilità con la sua. Non ha effetto sui Pokémon con le abilità Sintonia Equina, Morfosintonia, Sonno Assoluto, Torre di Comando, Fantasmanto, Albergamemorie, Pancialterna, Gelofaccia, Illusione, Multitipo, Gas Reagente, Malia Tossica, Sciamefusione, Paleoattivazione, Carica Quark, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teraguscio, Teramorfosi, Zeroformazione, Magidifesa, Stato Zen e Supercambio.", // NEEDS QC
		shortDesc: "Chi tocca questo Pokémon scambia la propria abilità con la sua.", // NEEDS QC
		gen8: {
			desc: "I Pokémon che toccano questo Pokémon scambiano la propria abilità con questa. Non influenza i Pokémon con le abilità Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Pancialterna, Gelofaccia, Illusione, Multitipo, Gas Reagente, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Magidifesa o Stato Zen.", // NEEDS QC
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "Assorbacqua",
		// Official flavor text: "Se il Pokémon viene colpito da una mossa di tipo Acqua, recupera PS anziché subire danni."
		desc: "Questo Pokémon è immune alle mosse di tipo Acqua e recupera 1/4 dei suoi PS max, arrotondato per difetto, quando viene colpito da una mossa di tipo Acqua.", // NEEDS QC
		shortDesc: "Recupera 1/4 dei PS max se colpito da mosse Acqua; immunità Acqua.", // NEEDS QC
	},
	waterbubble: {
		name: "Bolladacqua",
		// Official flavor text: "Riduce i danni subiti dalle mosse di tipo Fuoco e rende immuni alle scottature."
		desc: "La statistica offensiva di questo Pokémon raddoppia quando usa un attacco di tipo Acqua. Se un Pokémon usa un attacco di tipo Fuoco contro questo Pokémon, la sua statistica offensiva è dimezzata nel calcolo dei danni inflitti a questo Pokémon. Questo Pokémon non può essere scottato. Ottenere questa abilità mentre è scottato lo cura.", // NEEDS QC
		shortDesc: "Potenza Acqua raddoppiata; mai scottato; il Fuoco contro di lui è dimezzato.", // NEEDS QC
	},
	watercompaction: {
		name: "Idrorinforzo",
		shortDesc: "La Difesa aumenta di 2 livelli quando una mossa Acqua lo danneggia.", // NEEDS QC
	},
	waterveil: {
		name: "Idrovelo",
		shortDesc: "Non può essere scottato. Ottenerla da scottato lo cura.", // NEEDS QC
	},
	weakarmor: {
		name: "Sottilguscio",
		// Official flavor text: "Se il Pokémon subisce danni da mosse fisiche, la Difesa diminuisce e la Velocità aumenta di molto."
		desc: "Se un attacco fisico colpisce questo Pokémon, la sua Difesa diminuisce di un livello e la sua Velocità aumenta di 2 livelli.", // NEEDS QC
		shortDesc: "Se subisce un attacco fisico: -1 Difesa e +2 Velocità.", // NEEDS QC
		gen6: {
			desc: "Se un attacco fisico colpisce questo Pokémon, la sua Difesa diminuisce di un livello e la sua Velocità aumenta di un livello.", // NEEDS QC
			shortDesc: "Colpito da un attacco fisico: Difesa -1, Velocità +1.", // NEEDS QC
		},
	},
	wellbakedbody: {
		name: "Bentostato",
		desc: "Questo Pokémon è immune alle mosse di tipo Fuoco e la sua Difesa aumenta di 2 livelli quando viene colpito da una mossa di tipo Fuoco.", // NEEDS QC
		shortDesc: "+2 Difesa se colpito da una mossa Fuoco; immunità Fuoco.", // NEEDS QC
	},
	whitesmoke: {
		name: "Fumochiaro",
		shortDesc: "Impedisce agli altri Pokémon di ridurre le statistiche di questo Pokémon.", // NEEDS QC
	},
	wimpout: {
		name: "Fuggifuggi",
		// Official flavor text: "Se i PS scendono a metà o meno, il Pokémon si fa prendere dalla paura e abbandona la lotta in tutta fretta."
		desc: "Quando questo Pokémon ha più di metà dei suoi PS max e dei danni lo portano a metà o meno, viene sostituito immediatamente da un alleato scelto. Questo effetto si applica dopo tutti i colpi di una mossa multicolpo. È impedito se l'effetto secondario della mossa è stato rimosso dall'abilità Forzabruta. Si applica ai danni diretti e indiretti, tranne quelli di Maledizione e Sostituto usate da lui, di Panciamburo, di Malcomune e della confusione.", // NEEDS QC
		shortDesc: "Questo Pokémon lascia il campo quando scende a metà dei PS max o meno.", // NEEDS QC
	},
	windpower: {
		name: "Energia Eolica",
		desc: "Questo Pokémon ottiene l'effetto di Sottocarica quando viene colpito da una mossa di vento o quando Ventoincoda inizia nella sua squadra.", // NEEDS QC
		shortDesc: "Ottiene l'effetto di Sottocarica se subisce una mossa di vento o con Ventoincoda.", // NEEDS QC

		start: "#electromorphosis",
	},
	windrider: {
		name: "Vento Propizio",
		desc: "Questo Pokémon è immune alle mosse di vento e il suo Attacco aumenta di un livello quando viene colpito da una mossa di vento o quando Ventoincoda inizia nella sua squadra.", // NEEDS QC
		shortDesc: "+1 Attacco se subisce una mossa di vento o con Ventoincoda; immune al vento.", // NEEDS QC
	},
	wonderguard: {
		name: "Magidifesa",
		shortDesc: "Può essere danneggiato solo da mosse superefficaci e danni indiretti.", // NEEDS QC
		gen4: {
			shortDesc: "Solo Rogodenti, le mosse superefficaci e i danni indiretti lo danneggiano.", // NEEDS QC
		},
		gen3: {
			shortDesc: "Solo le mosse superefficaci e i danni indiretti lo danneggiano.", // NEEDS QC
		},
	},
	wonderskin: {
		name: "Splendicute",
		// Official flavor text: "Il Pokémon resiste più facilmente alle mosse di stato."
		desc: "Le mosse senza danni che verificano la precisione hanno la precisione ridotta al 50% quando vengono usate contro questo Pokémon. Questo effetto si applica prima degli altri effetti che modificano la precisione.", // NEEDS QC
		shortDesc: "Le mosse di stato con precisione hanno solo il 50% di colpirlo.", // NEEDS QC
	},
	zenmode: {
		name: "Stato Zen",
		// Official flavor text: "Cambia la forma del Pokémon se i PS scendono a metà o meno."
		desc: "Se questo Pokémon è un Darmanitan o un Darmanitan-Galar, passa allo Stato Zen se ha metà o meno dei suoi PS max alla fine di un turno. Se i suoi PS superano la metà dei PS max alla fine di un turno, torna allo Stato Normale.", // NEEDS QC
		shortDesc: "Darmanitan passa allo Stato Zen a metà dei PS o meno, altrimenti al Normale.", // NEEDS QC
		gen7: {
			desc: "Se questo Pokémon è un Darmanitan, passa allo Stato Zen se ha 1/2 o meno dei suoi PS max alla fine di un turno. Se i suoi PS superano 1/2 dei PS max alla fine di un turno, torna allo Stato Normale.", // NEEDS QC
		},
		gen6: {
			desc: "Se questo Pokémon è un Darmanitan, passa allo Stato Zen se ha 1/2 o meno dei suoi PS max alla fine di un turno. Se i suoi PS superano 1/2 dei PS max alla fine di un turno, torna allo Stato Normale. Se perde questa abilità nello Stato Zen, torna immediatamente allo Stato Normale.", // NEEDS QC
		},

		transform: "Stato Zen attivato!",
		transformEnd: "Stato Zen disattivato!",
	},
	zerotohero: {
		name: "Supercambio",
		shortDesc: "Palafin in Forma Ingenua passa alla Forma Possente quando lascia il campo.", // NEEDS QC

		activate: "  {POKEMON} torna dopo essersi trasformato!",
	},

	// CAP
	mountaineer: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "All'entrata, evita tutti gli attacchi di tipo Roccia e Levitoroccia.", // NEEDS QC
	},
	rebound: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Quando entra in campo, questo Pokémon blocca certe mosse di stato e le rimbalza contro chi le ha usate.", // NEEDS QC
		shortDesc: "All'entrata, blocca certe mosse di stato e le rimbalza contro chi le usa.", // NEEDS QC

		move: "#magiccoat",
	},
	persistent: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "La durata di Gravità, Anticura, Magicozona, Salvaguardia, Ventoincoda, Distortozona e Mirabilzona aumenta di 2 turni quando l'effetto è avviato da questo Pokémon.", // NEEDS QC
		shortDesc: "I suoi Gravità, Anticura, Salvaguardia, Ventoincoda e Zone durano 2 turni in più.", // NEEDS QC

		activate: "  {POKEMON} prolunga {MOVE} di 2 turni!", // NEEDS QC
	},
};
