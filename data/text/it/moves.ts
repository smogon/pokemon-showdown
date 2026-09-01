export const MovesText: { [id: IDEntry]: MoveText } = {
	"10000000voltthunderbolt": {
		name: "Iperfulmine",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha una probabilità molto alta di brutto colpo.", // NEEDS QC
		shortDesc: "Probabilità molto alta di brutto colpo.", // NEEDS QC
	},
	absorb: {
		name: "Assorbimento",
		// Official flavor text: "Mossa che assorbe PS. Chi la usa recupera una quantità di PS pari alla metà del danno inferto."
		desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei danni inflitti.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto. Se il bersaglio ha un sostituto, questa mossa lo manca.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto. Se questa mossa rompe il sostituto del bersaglio, chi la usa non recupera PS.", // NEEDS QC
		},
	},
	accelerock: {
		name: "Rocciarapida",
		// Official flavor text: "Chi la usa attacca il bersaglio colpendolo a tutta velocità. Questa mossa ha priorità alta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
	},
	acid: {
		name: "Acido",
		// Official flavor text: "Colpisce i nemici intorno spruzzando un acido corrosivo. Può anche ridurne la Difesa Speciale."
		desc: "Ha il 10% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Dif. Sp. dei nemici di 1.", // NEEDS QC
		gen3: {
			desc: "Ha il 10% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
			shortDesc: "10% di ridurre la Dif. dei nemici di 1.", // NEEDS QC
		},
		gen1: {
			desc: "Ha il 33% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
			shortDesc: "33% di ridurre la Dif. del bersaglio di 1.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10% di ridurre la Dif. del bersaglio di 1.", // NEEDS QC
		},
	},
	acidarmor: {
		name: "Scudo Acido",
		// Official flavor text: "Chi la usa altera la sua struttura cellulare passando allo stato liquido. La Difesa sale di molto."
		desc: "Aumenta la Difesa di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta la Difesa di chi la usa di 2.", // NEEDS QC
	},
	aciddownpour: {
		name: "Acidiluvio Corrosivo",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	acidspray: {
		name: "Acidobomba",
		// Official flavor text: "Chi la usa attacca il bersaglio con un acido altamente corrosivo. Il fluido riduce di molto la Difesa Speciale del bersaglio."
		desc: "Ha il 100% di probabilità di ridurre la Difesa Speciale del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "100% di ridurre la Dif. Sp. del bersaglio di 2.", // NEEDS QC
	},
	acrobatics: {
		name: "Acrobazia",
		shortDesc: "Potenza doppia se chi la usa non ha strumenti.", // NEEDS QC
	},
	acupressure: {
		name: "Acupressione",
		// Official flavor text: "Chi la usa esercita pressione su alcuni punti nevralgici e aumenta di molto una statistica a caso."
		desc: "Aumenta una statistica a caso di 2 livelli, purché non sia già al livello 6. Chi la usa può scegliere sé stesso o un alleato adiacente. Fallisce se nessun livello può aumentare o se usata su un alleato dietro un sostituto.", // NEEDS QC
		shortDesc: "+2 a una statistica a caso propria o di un alleato.", // NEEDS QC
		gen4: {
			desc: "Aumenta una statistica a caso di 2 livelli, purché non sia già al livello 6. Chi la usa può scegliere sé stesso o un alleato. Fallisce se nessun livello può aumentare o se chi la usa o l'alleato ha un sostituto.", // NEEDS QC
		},
	},
	aerialace: {
		name: "Aeroassalto",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	aeroblast: {
		name: "Aerocolpo",
		// Official flavor text: "Colpisce il bersaglio con un vortice d’aria per danneggiarlo. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	afteryou: {
		name: "Cortesia",
		// Official flavor text: "Chi la usa aiuta un bersaglio più lento permettendogli di agire subito dopo."
		desc: "Il bersaglio agisce subito dopo chi la usa in questo turno, indipendentemente dalla priorità della mossa scelta. Fallisce se il bersaglio avrebbe comunque agito subito dopo o se ha già agito in questo turno.", // NEEDS QC
		shortDesc: "Il bersaglio agisce subito dopo chi la usa.", // NEEDS QC

		activate: "  {TARGET} approfitta della cortesia!",
	},
	agility: {
		name: "Agilità",
		// Official flavor text: "Chi la usa rilassa e alleggerisce il proprio corpo per far salire di molto la Velocità."
		desc: "Aumenta la Velocità di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta la Velocità di chi la usa di 2.", // NEEDS QC
	},
	aircutter: {
		name: "Aerasoio",
		// Official flavor text: "Chi la usa provoca un vento tagliente che sferza i nemici intorno. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta prob. di brutto colpo. Colpisce i nemici vicini.", // NEEDS QC
	},
	airslash: {
		name: "Eterelama",
		// Official flavor text: "Chi la usa attacca con un vento tagliente che squarcia il cielo. Può anche far tentennare il Pokémon colpito."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
	},
	alloutpummeling: {
		name: "Iperscarica Furiosa",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	alluringvoice: {
		name: "Ammaliavoce",
		desc: "Ha il 100% di probabilità di confondere il bersaglio se i suoi livelli delle statistiche sono aumentati in questo turno.", // NEEDS QC
		shortDesc: "100% di confondere se il bersaglio ha alzato le stat.", // NEEDS QC
	},
	allyswitch: {
		name: "Cambiaposto",
		// Official flavor text: "Chi la usa cambia di posto con un alleato in campo grazie a un misterioso potere."
		desc: "Chi la usa scambia la propria posizione con quella dell'alleato. Fallisce se chi la usa è l'unico Pokémon della sua squadra in campo. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce o se l'ultima mossa usata non è Cambiaposto.", // NEEDS QC
		shortDesc: "Scambia posizione con l'alleato; ripetuta può fallire.", // NEEDS QC
		gen8: {
			desc: "Chi la usa scambia la propria posizione con quella dell'alleato. Fallisce se chi la usa è l'unico Pokémon della sua squadra in campo.", // NEEDS QC
			shortDesc: "Chi la usa scambia posizione con l'alleato.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa scambia la propria posizione con quella dell'alleato all'estremità opposta del campo. Fallisce se in quella posizione non c'è alcun Pokémon, se chi la usa è l'unico Pokémon della sua squadra in campo o se si trova al centro.", // NEEDS QC
			shortDesc: "Scambia posizione con l'alleato più lontano.", // NEEDS QC
		},
	},
	amnesia: {
		name: "Amnesia",
		// Official flavor text: "Chi la usa svuota per un po’ la mente per dimenticare i problemi. La Difesa Speciale aumenta di molto."
		desc: "Aumenta la Difesa Speciale di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta la Dif. Sp. di chi la usa di 2.", // NEEDS QC
		gen1: {
			desc: "Aumenta lo Speciale di chi la usa di 2 livelli.", // NEEDS QC
			shortDesc: "Aumenta lo Speciale di chi la usa di 2.", // NEEDS QC
		},
	},
	anchorshot: {
		name: "Colpo d’Ancora",
		// Official flavor text: "Chi la usa attacca il nemico con un’ancora e lo intrappola nella catena impedendogli di fuggire."
		desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Impedisce al bersaglio di lasciare il campo.", // NEEDS QC
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo.", // NEEDS QC
		},
	},
	ancientpower: {
		name: "Forzantica",
		// Official flavor text: "Colpisce il bersaglio con una forza primordiale. Può aumentare tutte le statistiche."
		desc: "Ha il 10% di probabilità di aumentare l'Attacco, la Difesa, l'Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "10% di aumentare tutte le sue statistiche di 1.", // NEEDS QC
	},
	appleacid: {
		name: "Acido Malico",
		// Official flavor text: "Chi la usa attacca il bersaglio con un liquido acido ricavato da mele aspre riducendone la Difesa Speciale."
		desc: "Ha il 100% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
	},
	aquacutter: {
		name: "Idrotaglio",
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	aquajet: {
		name: "Acquagetto",
		// Official flavor text: "Chi la usa colpisce a una tale velocità da rendersi quasi invisibile. Questa mossa ha priorità alta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
	},
	aquaring: {
		name: "Acquanello",
		// Official flavor text: "Chi la usa si avvolge in un velo d’acqua. Recupera alcuni PS a ogni turno."
		desc: "Chi la usa recupera 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno finché resta in campo. Se ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5. Se chi la usa usa Staffetta, il sostituto eredita l'effetto curativo.", // NEEDS QC
		shortDesc: "Chi la usa recupera 1/16 dei PS max a ogni turno.", // NEEDS QC

		start: "  Un velo d’acqua avvolge {POKEMON}!",
		heal: "  Un velo d’acqua fa recuperare PS {POKEMON:a}!",
	},
	aquastep: {
		name: "Idroballetto",
		desc: "Ha il 100% di probabilità di aumentare la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "100% di aumentare la Velocità di chi la usa di 1.", // NEEDS QC
	},
	aquatail: {
		name: "Idrondata",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	armorcannon: {
		name: "Corazza Cannone",
		desc: "Riduce la Difesa e la Difesa Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Riduce la Difesa e la Dif. Sp. di chi la usa di 1.", // NEEDS QC
	},
	armthrust: {
		name: "Sberletese",
		// Official flavor text: "Raffica di ceffoni che colpisce da due a cinque volte di fila."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
	},
	aromatherapy: {
		name: "Aromaterapia",
		// Official flavor text: "Chi la usa rilascia un dolce profumo che cura tutti i problemi di stato propri e degli alleati."
		desc: "Tutti i Pokémon della squadra di chi la usa vengono curati dai problemi di stato. I Pokémon in campo con l'abilità Mangiaerba non vengono curati, a meno che non siano chi la usa.", // NEEDS QC
		shortDesc: "Cura lo stato di tutta la squadra di chi la usa.", // NEEDS QC
		gen5: {
			desc: "Tutti i Pokémon della squadra di chi la usa vengono curati dai problemi di stato.", // NEEDS QC
		},

		activate: "  Un gradevole profumo si diffonde nell’aria!",
	},
	aromaticmist: {
		name: "Nebularoma",
		// Official flavor text: "Aumenta la Difesa Speciale di un alleato tramite un misterioso aroma."
		desc: "Aumenta la Difesa Speciale del bersaglio di un livello. Fallisce se nessun alleato è adiacente a chi la usa.", // NEEDS QC
		shortDesc: "Aumenta la Dif. Sp. di un alleato di 1.", // NEEDS QC
	},
	assist: {
		name: "Assistente",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Usa una mossa scelta a caso tra quelle conosciute dai membri della squadra. Non può selezionare Assistente, Fortino, Cannonbecco, Rutto, Cediregalo, Turboustione, Rimbalzo, Auguri, Schiamazzo, Ribaltiro, Turborissa, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Fossa, Sub, Codadrago, Resistenza, Fintoattacco, Volo, Centripugno, Sonoqui, Altruismo, Mano nella Mano, Scudo Reale, Turboincanto, Ribaltappeto, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Turbotossina, Spettrotuffo, Protezione, Polverabbia, Boato, Oscurotuffo, Gusciotrappola, Schizzo, Cadutalibera, Sonnolalia, Scippo, Agodifesa, Riflettore, Scontro, Rapidscambio, Teracluster, Furto, Trasformazione, Raggiro, Turbine o Turbotenebra.", // NEEDS QC
		shortDesc: "Usa una mossa a caso di un compagno di squadra.", // NEEDS QC
		gen8: {
			desc: "Usa una mossa scelta a caso tra quelle conosciute dai membri della squadra. Non può selezionare Assistente, Fortino, Cannonbecco, Rutto, Cediregalo, Rimbalzo, Auguri, Schiamazzo, Ribaltiro, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Fossa, Sub, Codadrago, Resistenza, Fintoattacco, Volo, Centripugno, Sonoqui, Altruismo, Mano nella Mano, Scudo Reale, Ribaltappeto, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Spettrotuffo, Protezione, Polverabbia, Boato, Oscurotuffo, Gusciotrappola, Schizzo, Cadutalibera, Sonnolalia, Scippo, Agodifesa, Riflettore, Scontro, Rapidscambio, Furto, Trasformazione, Raggiro o Turbine.", // NEEDS QC
		},
		gen7: {
			desc: "Usa una mossa scelta a caso tra quelle conosciute dai membri della squadra. Non può selezionare Assistente, Fortino, Cannonbecco, Rutto, Cediregalo, Rimbalzo, Auguri, Schiamazzo, Ribaltiro, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Fossa, Sub, Codadrago, Resistenza, Fintoattacco, Volo, Centripugno, Sonoqui, Altruismo, Mano nella Mano, Scudo Reale, Ribaltappeto, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Spettrotuffo, Protezione, Polverabbia, Boato, Oscurotuffo, Gusciotrappola, Schizzo, Cadutalibera, Sonnolalia, Scippo, Agodifesa, Riflettore, Scontro, Rapidscambio, Furto, Trasformazione, Raggiro o Turbine, né una mossa Z.", // NEEDS QC
		},
		gen6: {
			desc: "Usa una mossa scelta a caso tra quelle conosciute dai membri della squadra. Non può selezionare Assistente, Rutto, Cediregalo, Rimbalzo, Auguri, Schiamazzo, Ribaltiro, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Fossa, Sub, Codadrago, Resistenza, Fintoattacco, Volo, Centripugno, Sonoqui, Altruismo, Mano nella Mano, Scudo Reale, Ribaltappeto, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Spettrotuffo, Protezione, Polverabbia, Boato, Oscurotuffo, Schizzo, Cadutalibera, Sonnolalia, Scippo, Agodifesa, Scontro, Rapidscambio, Furto, Trasformazione, Raggiro o Turbine.", // NEEDS QC
		},
		gen5: {
			desc: "Usa una mossa scelta a caso tra quelle conosciute dai membri della squadra. Non può selezionare Assistente, Cediregalo, Schiamazzo, Ribaltiro, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Codadrago, Resistenza, Fintoattacco, Centripugno, Sonoqui, Altruismo, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Protezione, Polverabbia, Schizzo, Sonnolalia, Scippo, Scontro, Rapidscambio, Furto, Trasformazione o Raggiro.", // NEEDS QC
		},
		gen4: {
			desc: "Usa una mossa scelta a caso tra quelle conosciute dai membri della squadra. Non può selezionare Assistente, Schiamazzo, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Resistenza, Fintoattacco, Centripugno, Sonoqui, Altruismo, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Protezione, Schizzo, Sonnolalia, Scippo, Scontro, Rapidscambio, Furto o Raggiro.", // NEEDS QC
		},
		gen3: {
			desc: "Usa una mossa scelta a caso tra quelle conosciute dai membri della squadra. Non può selezionare Assistente, Contrattacco, Supplica, Destinobbligato, Individua, Resistenza, Centripugno, Sonoqui, Altruismo, Metronomo, Mimica, Specchiovelo, Speculmossa, Protezione, Schizzo, Sonnolalia, Scippo, Scontro, Furto o Raggiro.", // NEEDS QC
		},
	},
	assurance: {
		name: "Garanzia",
		// Official flavor text: "Se il bersaglio ha già subito dei danni nello stesso turno, la potenza di questa mossa raddoppia."
		desc: "La potenza raddoppia se il bersaglio ha già subito danni in questo turno, diversi dai danni diretti di Panciamburo, della confusione, di Maledizione o di Malcomune.", // NEEDS QC
		shortDesc: "Potenza doppia se il bersaglio è già stato colpito.", // NEEDS QC
		gen4: {
			desc: "La potenza raddoppia se il bersaglio ha già subito danni in questo turno.", // NEEDS QC
		},
	},
	astonish: {
		name: "Sgomento",
		// Official flavor text: "Chi la usa attacca il bersaglio emettendo un verso terrificante. Può anche farlo tentennare."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
		gen3: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio. I danni raddoppiano se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		},
	},
	astralbarrage: {
		name: "Schegge Astrali",
		// Official flavor text: "Il Pokémon attacca i nemici scatenandogli contro una miriade di piccoli spettri."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i nemici adiacenti.", // NEEDS QC
	},
	attackorder: {
		name: "Comandourto",
		// Official flavor text: "Chi la usa raduna i suoi sgherri per colpire il bersaglio. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	attract: {
		name: "Attrazione",
		// Official flavor text: "Se il bersaglio è del sesso opposto, s’infatua e diventa riluttante ad attaccare."
		desc: "Fa infatuare il bersaglio: non riesce ad attaccare il 50% delle volte. Fallisce se chi la usa e il bersaglio sono dello stesso sesso, se uno dei due non ha sesso o se il bersaglio è già infatuato. L'effetto finisce quando chi la usa o il bersaglio lascia il campo. I Pokémon con l'abilità Indifferenza o protetti dall'abilità Aromavelo sono immuni.", // NEEDS QC
		shortDesc: "Fa infatuare un bersaglio di sesso opposto.", // NEEDS QC
		gen5: {
			desc: "Fa infatuare il bersaglio: non riesce ad attaccare il 50% delle volte. Fallisce se chi la usa e il bersaglio sono dello stesso sesso, se uno dei due non ha sesso o se il bersaglio è già infatuato. L'effetto finisce quando chi la usa o il bersaglio lascia il campo. I Pokémon con l'abilità Indifferenza sono immuni.", // NEEDS QC
		},
		gen2: {
			desc: "Fa infatuare il bersaglio: non riesce ad attaccare il 50% delle volte. Fallisce se chi la usa e il bersaglio sono dello stesso sesso, se uno dei due non ha sesso o se il bersaglio è già infatuato. L'effetto finisce quando chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		},

		start: "  {POKEMON} si innamora!",
		startFromItem: "  {ITEM:definite:capitalize} fa{INFLECT:ITEM:s=:p=nno} innamorare {POKEMON}!",
		end: "  {POKEMON} non è più innamorato!",
		endFromItem: "  {POKEMON} guarisce dall’innamoramento grazie {ITEM:a:definite:classified}!",
		activate: "  {POKEMON} è innamorato di {TARGET}!",
		cant: "L’innamoramento impedisce {POKEMON:a} di agire!",
	},
	aurasphere: {
		name: "Forzasfera",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	aurawheel: {
		name: "Ruota d’Aura",
		// Official flavor text: "Chi la usa emette l’energia accumulata nelle guance per attaccare e aumentare la propria Velocità. Il tipo della mossa cambia in base alla forma assunta da Morpeko."
		desc: "Ha il 100% di probabilità di aumentare la Velocità di chi la usa di un livello. Se chi la usa è un Morpeko in Motivo Sazietà, questa mossa è di tipo Elettro. Se è in Motivo Languorino, è di tipo Buio. Questa mossa può essere usata con successo solo se la forma attuale di chi la usa, considerando Trasformazione, è un Morpeko in Motivo Sazietà o Languorino.", // NEEDS QC
		shortDesc: "Sazietà: Elettro; Languorino: Buio. 100% +1 Vel.", // NEEDS QC
	},
	aurorabeam: {
		name: "Raggiaurora",
		// Official flavor text: "Colpisce il bersaglio con un raggio dai colori dell’iride. Può anche ridurne l’Attacco."
		desc: "Ha il 10% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre l'Attacco del bersaglio di 1.", // NEEDS QC
		gen1: {
			desc: "Ha il 33% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
			shortDesc: "33% di ridurre l'Attacco del bersaglio di 1.", // NEEDS QC
		},
	},
	auroraveil: {
		name: "Velaurora",
		// Official flavor text: "Riduce i danni subiti dalle mosse fisiche e dalle mosse speciali per cinque turni. Si può usare solo quando grandina."
		desc: "Per 5 turni, chi la usa e la sua squadra subiscono 0,5 volte i danni degli attacchi fisici e speciali, o 0,66 volte in Lotta in Doppio; non riduce ulteriormente i danni con Riflesso o Schermoluce. I brutti colpi ignorano questa protezione. Viene rimossa dalla parte di chi la usa se lui o un alleato viene colpito da Breccia, Psicozanna o Scacciabruma. Dura 8 turni se chi la usa ha una Creta Luce. Fallisce se non nevica.", // NEEDS QC
		shortDesc: "5 turni: danni alla squadra dimezzati. Solo con neve.", // NEEDS QC
		gen8: {
			desc: "Per 5 turni, chi la usa e la sua squadra subiscono 0,5 volte i danni degli attacchi fisici e speciali, o 0,66 volte in Lotta in Doppio; non riduce ulteriormente i danni con Riflesso o Schermoluce. I brutti colpi ignorano questa protezione. Viene rimossa dalla parte di chi la usa se lui o un alleato viene colpito da Breccia, Psicozanna o Scacciabruma. Breccia e Psicozanna rimuovono l'effetto prima del calcolo dei danni. Dura 8 turni se chi la usa ha una Creta Luce. Fallisce se non grandina.", // NEEDS QC
			shortDesc: "5 turni: danni alla squadra dimezzati. Solo grandine.", // NEEDS QC
		},

		start: "  La resistenza di {TEAM} agli attacchi fisici e speciali aumenta grazie a Velaurora!",
		end: "  L’effetto di Velaurora su {TEAM} è finito!",
	},
	autotomize: {
		name: "Sganciapesi",
		// Official flavor text: "Chi la usa si libera di tutti i pesi in eccesso, alleggerendosi e aumentando di molto la propria Velocità."
		desc: "Aumenta la Velocità di chi la usa di 2 livelli. Se la Velocità è cambiata, il suo peso si riduce di 100 kg finché resta in campo. Questo effetto è cumulabile, ma non può ridurre il peso sotto 0,1 kg.", // NEEDS QC
		shortDesc: "+2 Velocità; chi la usa perde 100 kg.", // NEEDS QC

		start: "  {POKEMON} diventa velocissimo!",
	},
	avalanche: {
		name: "Slavina",
		// Official flavor text: "Mossa d’attacco che infligge doppi danni se chi la usa è stato ferito dal Pokémon bersaglio nello stesso turno."
		desc: "La potenza raddoppia se chi la usa è stato colpito dal bersaglio in questo turno.", // NEEDS QC
		shortDesc: "Potenza doppia se il bersaglio lo ha danneggiato.", // NEEDS QC
		gen4: {
			desc: "La potenza raddoppia se chi la usa è stato colpito da un Pokémon nella posizione del bersaglio in questo turno.", // NEEDS QC
		},
	},
	axekick: {
		name: "Calcio ad Ascia",
		desc: "Ha il 30% di probabilità di confondere il bersaglio. Se questo attacco fallisce, chi la usa perde metà dei suoi PS max, arrotondato per difetto, come danni da fallimento. I Pokémon con l'abilità Magicscudo non subiscono i danni da fallimento.", // NEEDS QC
		shortDesc: "30% di confusione. Se fallisce, perde metà dei PS.", // NEEDS QC

		damage: "#crash",
	},
	babydolleyes: {
		name: "Occhioni Teneri",
		// Official flavor text: "Chi la usa rivolge i propri occhioni languidi al bersaglio, riducendone l’Attacco. Questa mossa ha priorità alta."
		desc: "Riduce l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce l'Attacco del bersaglio di 1.", // NEEDS QC
	},
	baddybad: {
		name: "Zona Buiabuia",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Questa mossa evoca Riflesso per 5 turni.", // NEEDS QC
		shortDesc: "Evoca Riflesso per 5 turni.", // NEEDS QC
	},
	banefulbunker: {
		name: "Fortino",
		// Official flavor text: "Protegge dagli attacchi e avvelena i Pokémon che lanciano un attacco diretto su chi la usa."
		desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che lo colpiscono con mosse da contatto vengono avvelenati. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Protegge dalle mosse. Contatto: avvelena.", // NEEDS QC
		gen8: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che lo colpiscono con mosse da contatto vengono avvelenati. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che lo colpiscono con mosse da contatto vengono avvelenati. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
	},
	barbbarrage: {
		name: "Mille Fielespine",
		desc: "Ha il 50% di probabilità di avvelenare il bersaglio. La potenza raddoppia se il bersaglio è già avvelenato.", // NEEDS QC
		shortDesc: "50% di avvelenare. Potenza x2 su bersagli avvelenati.", // NEEDS QC
	},
	barrage: {
		name: "Attacco Pioggia",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. I danni sono calcolati una sola volta per il primo colpo e ripetuti per ogni colpo. Se uno dei colpi rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	barrier: {
		name: "Barriera",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Aumenta la Difesa di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta la Difesa di chi la usa di 2.", // NEEDS QC
	},
	batonpass: {
		name: "Staffetta",
		// Official flavor text: "Chi la usa è sostituito da un Pokémon della squadra, che eredita anche ogni modifica alle statistiche."
		desc: "Chi la usa viene sostituito da un altro Pokémon della squadra. Il Pokémon scelto eredita i livelli delle statistiche, oltre agli effetti della confusione, di Acquanello, Maledizione, Grido del Drago, Divieto, Focalenergia, Gastroacido, Anticura, Radicamento, Parassiseme, Localizza, Magnetascesa, Ultimocanto, Ingannoforza e Telecinesi (e Leggimente), e di un sostituto con i suoi PS restanti. L'effetto di Gastroacido non viene trasmesso se il sostituto ha un'abilità che non può essere influenzata.", // NEEDS QC
		shortDesc: "Chi la usa esce passando i cambi di statistiche.", // NEEDS QC
		gen8: {
			desc: "Chi la usa viene sostituito da un altro Pokémon della squadra. Il Pokémon scelto eredita i livelli delle statistiche, oltre agli effetti della confusione, di Acquanello, Maledizione, Divieto, Focalenergia, Gastroacido, Anticura, Radicamento, Parassiseme, Localizza (e Leggimente), Magnetascesa, Ultimocanto, Ingannoforza e Telecinesi, e di un sostituto con i suoi PS restanti. L'effetto di Gastroacido non viene trasmesso se il sostituto ha un'abilità che non può essere influenzata.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa viene sostituito da un altro Pokémon della squadra. Il Pokémon scelto eredita i livelli delle statistiche, oltre agli effetti della confusione, di Acquanello, Maledizione, Divieto, Focalenergia, Gastroacido, Anticura, Radicamento, Parassiseme, Localizza (e Leggimente), Magnetascesa, Ultimocanto, Ingannoforza e Telecinesi, nonché dell'essere intrappolato da Malosguardo (Blocco, Ragnatela), e di un sostituto con i suoi PS restanti. L'effetto di Gastroacido non viene trasmesso se il sostituto ha un'abilità che non può essere influenzata. L'effetto di Telecinesi non viene trasmesso se il sostituto è MegaGengar.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa viene sostituito da un altro Pokémon della squadra. Il Pokémon scelto eredita i livelli delle statistiche, oltre agli effetti della confusione, di Acquanello, Maledizione, Divieto, Focalenergia, Gastroacido, Anticura, Radicamento, Parassiseme, Localizza (e Leggimente), Magnetascesa, Ultimocanto, Ingannoforza e Telecinesi, nonché dell'essere intrappolato da Malosguardo (Blocco, Ragnatela), e di un sostituto con i suoi PS restanti.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa viene sostituito da un altro Pokémon della squadra. Il Pokémon scelto eredita i livelli delle statistiche, oltre agli effetti della confusione, di Acquanello, Maledizione, Divieto, Focalenergia, Gastroacido, Anticura, Radicamento, Parassiseme, Localizza (e Leggimente), Magnetascesa, Fangata, Ultimocanto, Ingannoforza e Docciascudo, nonché dell'intrappolare o essere intrappolato da Malosguardo (Blocco, Ragnatela), e di un sostituto con i suoi PS restanti.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa viene sostituito da un altro Pokémon della squadra. Il Pokémon scelto eredita i livelli delle statistiche, oltre agli effetti della confusione, di Maledizione, Focalenergia, Radicamento, Parassiseme, Localizza (e Leggimente), Fangata, Ultimocanto e Docciascudo, nonché dell'intrappolare o essere intrappolato da Malosguardo (Blocco, Ragnatela), e di un sostituto con i suoi PS restanti.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa viene sostituito da un altro Pokémon della squadra. Il Pokémon scelto eredita i livelli delle statistiche, oltre agli effetti della confusione, di Maledizione, Ricciolscudo, Focalenergia, Preveggenza, Parassiseme, Localizza (e Leggimente), Minimizzato, Nebbia e Ultimocanto, nonché dell'intrappolare o essere intrappolato da Malosguardo (Ragnatela), e di un sostituto con i suoi PS restanti.", // NEEDS QC
		},
	},
	beakblast: {
		name: "Cannonbecco",
		// Official flavor text: "Chi la usa arroventa il proprio becco e poi attacca. Se un Pokémon lo colpisce con un attacco diretto mentre sta accumulando calore, resta scottato."
		desc: "Se chi la usa viene colpito da una mossa da contatto in questo turno prima di poterla eseguire, l'attaccante viene scottato.", // NEEDS QC
		shortDesc: "Scotta chi lo tocca prima che agisca.", // NEEDS QC

		start: "  {POKEMON} inizia a scaldare il becco!",
	},
	beatup: {
		name: "Picchiaduro",
		// Official flavor text: "Chi la usa chiama in aiuto i Pokémon della squadra: più ce ne sono, maggiore è il numero di attacchi."
		desc: "Colpisce una volta per chi la usa e una per ogni Pokémon della squadra non KO e senza problemi di stato. La potenza di ogni colpo è pari a 5 + (X/10), dove X è l'Attacco di base del Pokémon partecipante; ogni colpo è considerato provenire da chi la usa.", // NEEDS QC
		shortDesc: "Tutti gli alleati sani aiutano a colpire il bersaglio.", // NEEDS QC
		gen4: {
			desc: "Infligge danni senza tipo. Colpisce una volta per chi la usa e una per ogni Pokémon della squadra non KO e senza problemi di stato. Per ogni colpo, la formula dei danni usa l'Attacco di base del Pokémon partecipante come Attacco e la Difesa di base del bersaglio come Difesa, ignorando i livelli delle statistiche e gli altri effetti che modificano Attacco o Difesa; ogni colpo è considerato provenire da chi la usa.", // NEEDS QC
		},
		gen3: {
			desc: "Infligge danni senza tipo. Colpisce una volta per ogni Pokémon della squadra non KO e senza problemi di stato, o fallisce se nessun Pokémon soddisfa i requisiti. Per ogni colpo, la formula dei danni usa l'Attacco di base del Pokémon partecipante come Attacco e la Difesa di base del bersaglio come Difesa, ignorando i livelli delle statistiche e gli altri effetti che modificano Attacco o Difesa; ogni colpo è considerato provenire da chi la usa.", // NEEDS QC
		},
		gen2: {
			desc: "Infligge danni senza tipo. Colpisce una volta per ogni Pokémon della squadra non KO e senza problemi di stato. Per ogni colpo, la formula dei danni usa il livello del Pokémon partecipante, il suo Attacco di base come Attacco e la Difesa di base del bersaglio come Difesa, ignorando i livelli delle statistiche e gli altri effetti che modificano Attacco o Difesa. Fallisce se nessun membro della squadra può partecipare.", // NEEDS QC
		},

		activate: "  Attacco di {NAME}!",
	},
	behemothbash: {
		name: "Colpo Maestoso",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		gen8: {
			shortDesc: "Danni doppi contro i bersagli dynamaxizzati.", // NEEDS QC
		},
	},
	behemothblade: {
		name: "Taglio Maestoso",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		gen8: {
			shortDesc: "Danni doppi contro i bersagli dynamaxizzati.", // NEEDS QC
		},
	},
	belch: {
		name: "Rutto",
		// Official flavor text: "Chi la usa attacca il bersaglio con un rutto potente. Per utilizzare questa mossa, il Pokémon deve mangiare la bacca che possiede."
		desc: "Questa mossa non può essere selezionata finché chi la usa non ha mangiato una bacca, mangiando quella che teneva, rubandone e mangiandone una con Coleomorso o Spennata, o mangiandone una lanciatagli con Lancio. Una volta soddisfatta la condizione, questa mossa può essere selezionata e usata per il resto della lotta, anche se chi la usa ottiene o usa un altro strumento o viene sostituito. Consumare una bacca con Dononaturale non conta.", // NEEDS QC
		shortDesc: "Utilizzabile solo se chi la usa ha mangiato una bacca.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	bellydrum: {
		name: "Panciamburo",
		// Official flavor text: "Chi la usa massimizza l’Attacco in cambio di metà dei PS massimi."
		desc: "Aumenta l'Attacco di chi la usa di 12 livelli in cambio di metà dei suoi PS max, arrotondato per difetto. Fallisce se chi la usa andrebbe KO o se il suo livello di Attacco è già a 6.", // NEEDS QC
		shortDesc: "Perde metà dei PS max. Attacco al massimo.", // NEEDS QC
		gen2: {
			desc: "Chi la usa perde metà dei suoi PS max, arrotondato per difetto, a meno che non andrebbe KO o il suo Attacco sia già al livello 6. Se chi la usa non aveva abbastanza PS, il suo Attacco aumenta di 2 livelli. Altrimenti, finché il livello del suo Attacco è inferiore a 6 aumenta di 2, e se la statistica di Attacco prima di questo passaggio era 999, il livello si riduce di 1 e il ciclo finisce.", // NEEDS QC
		},

		boost: "  {POKEMON} riduce i suoi PS e aumenta al massimo il suo Attacco!",
	},
	bestow: {
		name: "Cediregalo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Il bersaglio riceve lo strumento di chi la usa. Fallisce se chi la usa non ha strumenti o ha un Cristallo Z, se il bersaglio ha già uno strumento, se lo strumento è una megapietra e chi la usa o il bersaglio è la specie che può megaevolversi con essa, o se lo strumento è Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo o una ROM e chi la usa o il bersaglio è rispettivamente Kyogre, Groudon, Giratina, Arceus, Genesect o Silvally.", // NEEDS QC
		shortDesc: "Dà il proprio strumento al bersaglio.", // NEEDS QC
		gen6: {
			desc: "Il bersaglio riceve lo strumento di chi la usa. Fallisce se chi la usa non ha strumenti, se il bersaglio ha già uno strumento, se lo strumento è una megapietra e chi la usa o il bersaglio è la specie che può megaevolversi con essa, o se lo strumento è Gemma blu, Gemma rossa, Grigiosfera, una lastra o un modulo e chi la usa o il bersaglio è rispettivamente Kyogre, Groudon, Giratina, Arceus o Genesect.", // NEEDS QC
		},
		gen5: {
			desc: "Il bersaglio riceve lo strumento di chi la usa. Fallisce se chi la usa non ha strumenti o ha un Messaggio, se il bersaglio ha già uno strumento, o se lo strumento è Grigiosfera, una lastra o un modulo e chi la usa o il bersaglio è rispettivamente Giratina, Arceus o Genesect.", // NEEDS QC
		},

		takeItem: "  {POKEMON} ottiene {ITEM:definite} di {SOURCE}!",
	},
	bide: {
		name: "Pazienza",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Chi la usa resta bloccato su questa mossa per due turni, poi, al secondo turno, attacca l'ultimo Pokémon che l'ha colpito, infliggendo il doppio dei PS persi per gli attacchi subiti nei due turni. Se l'ultimo Pokémon che l'ha colpito non è più in campo, attacca un avversario a caso. Se chi la usa non può agire durante l'uso, l'effetto finisce. Questa mossa non verifica la precisione e ignora l'immunità di tipo.", // NEEDS QC
		shortDesc: "Attende 2 turni; restituisce il doppio dei danni.", // NEEDS QC
		gen4: {
			desc: "Chi la usa resta bloccato su questa mossa per due turni, poi, al secondo turno, attacca l'ultimo Pokémon che l'ha colpito, infliggendo il doppio dei PS persi per gli attacchi subiti nei due turni. Se l'ultimo Pokémon che l'ha colpito non è più in campo, attacca un avversario a caso. Se chi la usa non può agire durante l'uso, l'effetto finisce. Questa mossa non verifica la precisione e ignora l'immunità di tipo.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa resta bloccato su questa mossa per due turni, poi, al secondo turno, attacca l'ultimo Pokémon che l'ha colpito, infliggendo il doppio dei PS persi nei due turni. Se l'ultimo Pokémon che l'ha colpito non è più in campo, attacca un avversario a caso. Se chi la usa non può agire durante l'uso, l'effetto finisce. Questa mossa non ignora l'immunità di tipo.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni, poi, al secondo o terzo turno, attacca l'avversario, infliggendo il doppio dei PS persi in quei turni. Se chi la usa non può agire durante l'uso, l'effetto finisce. Questa mossa non ignora l'immunità di tipo.", // NEEDS QC
			shortDesc: "Attende 2-3 turni e rende il doppio dei danni subiti.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni, poi, al secondo o terzo turno, attacca l'avversario, infliggendo il doppio dei PS persi in quei turni. Questa mossa ignora l'immunità di tipo e non può essere evitata nemmeno se il bersaglio sta usando Fossa o Volo. Chi la usa può scegliere di essere sostituito durante l'effetto. Se viene sostituito o non può agire, l'effetto finisce. Durante l'effetto, se il Pokémon avversario viene sostituito o usa Stordiraggio, Conversione, Focalenergia, Sguardo Feroce, Nube, Parassiseme, Schermoluce, Mimica, Nebbia, Velenogas, Velenpolvere, Ripresa, Riflesso, Riposo, Covauova, Splash, Paralizzante, Sostituto, Supersuono, Teletrasporto, Tuononda, Tossina o Trasformazione, i danni subiti in precedenza vengono aggiunti al totale.", // NEEDS QC
		},

		start: "  {POKEMON} accumula energia!",
		end: "  {POKEMON} libera energia!",
		activate: "  {POKEMON} accumula energia!",
	},
	bind: {
		name: "Legatutto",
		// Official flavor text: "Il lungo corpo o i tentacoli di chi la usa legano e stritolano il bersaglio per quattro o cinque turni."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max (1/8 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni (sempre cinque se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
			shortDesc: "Intrappola e ferisce il bersaglio per 2-5 turni.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni. Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se usa Staffetta. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa usa questa mossa per due-cinque turni. Ha 3/8 di probabilità di durare due o tre turni e 1/8 di durare quattro o cinque turni. I danni calcolati al primo turno vengono ripetuti per ogni altro turno. Chi la usa non può scegliere mosse e il bersaglio non può eseguire mosse durante l'effetto, ma entrambi possono essere sostituiti. Se chi la usa viene sostituito, il bersaglio resta incapace di agire in quel turno. Se il bersaglio viene sostituito, chi la usa usa di nuovo questa mossa automaticamente, e se in quel momento aveva 0 PP, diventano 63. Se chi la usa o il bersaglio viene sostituito, o chi la usa non può agire, l'effetto finisce. Questa mossa può impedire al bersaglio di agire anche se ha un'immunità di tipo, ma in tal caso non infligge danni.", // NEEDS QC
			shortDesc: "Il bersaglio non può agire per 2-5 turni.", // NEEDS QC
		},

		start: "  {SOURCE} stritola {POKEMON} con Legatutto!",
		move: "#wrap",
	},
	bite: {
		name: "Morso",
		// Official flavor text: "Il bersaglio viene morso da denti affilatissimi che possono farlo tentennare."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
		gen1: {
			desc: "Ha il 10% di probabilità di far tentennare il bersaglio.", // NEEDS QC
			shortDesc: "10% di far tentennare il bersaglio.", // NEEDS QC
		},
	},
	bitterblade: {
		name: "Lama del Rimorso",
		desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei danni inflitti.", // NEEDS QC
	},
	bittermalice: {
		name: "Livore",
		desc: "Ha il 100% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Attacco del bersaglio di 1.", // NEEDS QC
	},
	blackholeeclipse: {
		name: "Buco Nero del Non Ritorno",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	blastburn: {
		name: "Incendio",
		// Official flavor text: "Potente esplosione che danneggia il bersaglio, ma fa saltare il turno successivo a chi la provoca."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
	},
	blazekick: {
		name: "Calciardente",
		// Official flavor text: "Chi la usa tira un calcio. Probabile brutto colpo. Può anche scottare il bersaglio."
		desc: "Ha il 10% di probabilità di scottare il bersaglio e una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta prob. di brutto colpo. 10% di scottare.", // NEEDS QC
	},
	blazingtorque: {
		name: "Turboustione",
		desc: "Ha il 30% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "30% di scottare il bersaglio.", // NEEDS QC
	},
	bleakwindstorm: {
		name: "Tempesta Boreale",
		desc: "Ha il 30% di probabilità di ridurre la Velocità del bersaglio di un livello. Se il tempo è Acquazzone o Pioggia, questa mossa non verifica la precisione. Se usata contro un Pokémon con un Superombrello, la precisione resta all'80%.", // NEEDS QC
		shortDesc: "30% di -1 Vel. ai nemici. Non fallisce con la pioggia.", // NEEDS QC
	},
	blizzard: {
		name: "Bora",
		// Official flavor text: "Colpisce i nemici intorno con una tremenda tempesta di ghiaccio che può anche congelarli."
		desc: "Ha il 10% di probabilità di congelare il bersaglio. Se nevica, questa mossa non verifica la precisione.", // NEEDS QC
		shortDesc: "10% di congelare i nemici. Non fallisce se nevica.", // NEEDS QC
		gen8: {
			desc: "Ha il 10% di probabilità di congelare il bersaglio. Se grandina, questa mossa non verifica la precisione.", // NEEDS QC
			shortDesc: "10% di congelare i nemici. Non fallisce con grandine.", // NEEDS QC
		},
		gen3: {
			desc: "Ha il 10% di probabilità di congelare il bersaglio.", // NEEDS QC
			shortDesc: "10% di probabilità di congelare i nemici.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10% di congelare il bersaglio.", // NEEDS QC
		},
	},
	block: {
		name: "Blocco",
		// Official flavor text: "Chi la usa sbarra la strada al bersaglio impedendone la fuga o la sostituzione."
		desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Impedisce al bersaglio di lasciare il campo.", // NEEDS QC
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo, a meno che non usi Staffetta: in tal caso il bersaglio resta intrappolato.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se usa Staffetta. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo, a meno che non usi Staffetta: in tal caso il bersaglio resta intrappolato.", // NEEDS QC
		},
	},
	bloodmoon: {
		name: "Luna Rossa",
		shortDesc: "Non può essere scelta due turni di fila.", // NEEDS QC
	},
	bloomdoom: {
		name: "Floriscoppio Sfolgorante",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	blueflare: {
		name: "Fuocoblu",
		// Official flavor text: "Chi la usa attacca il bersaglio avvolgendolo con magnifiche e intense fiamme blu che possono anche scottarlo."
		desc: "Ha il 20% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "20% di scottare il bersaglio.", // NEEDS QC
	},
	bodypress: {
		name: "Schiacciacorpo",
		// Official flavor text: "Chi la usa schiaccia il bersaglio con il suo corpo. Più la sua Difesa è alta, maggiori sono i danni inflitti."
		desc: "I danni sono calcolati usando la Difesa di chi la usa al posto del suo Attacco, compresi i livelli delle statistiche. Gli altri effetti che modificano l'Attacco si applicano normalmente.", // NEEDS QC
		shortDesc: "Attacca con la sua Difesa invece dell'Attacco.", // NEEDS QC
	},
	bodyslam: {
		name: "Corposcontro",
		// Official flavor text: "Chi la usa carica il bersaglio con tutto il corpo. Può causarne anche la paralisi."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		shortDesc: "30% di paralizzare il bersaglio.", // NEEDS QC
		gen5: {
			desc: "Ha il 30% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		},
	},
	boltbeak: {
		name: "Beccoshock",
		// Official flavor text: "Chi la usa attacca il bersaglio con il becco appuntito carico d’elettricità. Se attacca per primo, la potenza della mossa raddoppia."
		desc: "La potenza raddoppia se chi la usa agisce prima del bersaglio.", // NEEDS QC
		shortDesc: "Potenza doppia se agisce prima del bersaglio.", // NEEDS QC
	},
	boltstrike: {
		name: "Lucesiluro",
		// Official flavor text: "Colpisce il bersaglio con una possente carica elettrica e può anche paralizzarlo."
		desc: "Ha il 20% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "20% di paralizzare il bersaglio.", // NEEDS QC
	},
	boneclub: {
		name: "Ossoclava",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 10% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "10% di far tentennare il bersaglio.", // NEEDS QC
	},
	bonemerang: {
		name: "Ossomerang",
		// Official flavor text: "Chi la usa lancia l’osso che ha con sé. L’osso colpisce due volte e ritorna come un vero e proprio boomerang."
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		shortDesc: "Colpisce 2 volte in un turno.", // NEEDS QC
		gen4: {
			desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	bonerush: {
		name: "Ossoraffica",
		// Official flavor text: "Chi la usa colpisce il bersaglio con un osso da due a cinque volte di fila."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
	},
	boomburst: {
		name: "Ondaboato",
		// Official flavor text: "Colpisce i Pokémon che ha intorno con la forza di un boato distruttivo."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i Pokémon adiacenti.", // NEEDS QC
	},
	bounce: {
		name: "Rimbalzo",
		// Official flavor text: "Chi la usa balza in alto e ricade sul bersaglio dopo un turno. Può anche paralizzarlo."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Raffica, Tifone, Stramontante, Abbattimento, Mille Frecce, Tuono e Tornado, e Raffica e Tornado hanno la potenza raddoppiata contro di lui. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Balza, colpisce al turno 2. 30% di paralisi.", // NEEDS QC
		gen5: {
			desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Raffica, Tifone, Stramontante, Abbattimento, Tuono e Tornado, e Raffica e Tornado hanno la potenza raddoppiata contro di lui. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		},
		gen4: {
			desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Raffica, Stramontante, Tuono e Tornado, e Raffica e Tornado hanno la potenza raddoppiata contro di lui. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		},
		gen3: {
			desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Raffica, Stramontante, Tuono e Tornado, e Raffica e Tornado hanno la potenza raddoppiata contro di lui.", // NEEDS QC
		},

		prepare: "{POKEMON} spicca un gran balzo!",
	},
	bouncybubble: {
		name: "Bollaslurp",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei danni inflitti.", // NEEDS QC
	},
	branchpoke: {
		name: "Ramostoccata",
		// Official flavor text: "Chi la usa attacca il bersaglio con un ramo incredibilmente appuntito."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	bravebird: {
		name: "Baldeali",
		// Official flavor text: "Chi la usa ripiega le ali e carica da bassa quota. Tuttavia, subisce considerevoli danni."
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari al 33% dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo del 33% dei danni.", // NEEDS QC
		gen4: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/3 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
			shortDesc: "Ha 1/3 di contraccolpo.", // NEEDS QC
		},
	},
	breakingswipe: {
		name: "Vastoimpatto",
		// Official flavor text: "Chi la usa attacca i nemici intorno con la sua robusta coda riducendone l’Attacco."
		desc: "Ha il 100% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Attacco dei nemici di 1.", // NEEDS QC
	},
	breakneckblitz: {
		name: "Carica Travolgente",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	brickbreak: {
		name: "Breccia",
		// Official flavor text: "Colpisce il bersaglio con una mano e rompe barriere come Riflesso e Schermoluce."
		desc: "Se questo attacco non fallisce, gli effetti di Riflesso, Schermoluce e Velaurora finiscono per la parte del bersaglio prima del calcolo dei danni.", // NEEDS QC
		shortDesc: "Distrugge gli schermi, salvo bersaglio immune.", // NEEDS QC
		gen6: {
			desc: "Se questo attacco non fallisce, gli effetti di Riflesso e Schermoluce finiscono per la parte del bersaglio prima del calcolo dei danni.", // NEEDS QC
		},
		gen4: {
			desc: "Se questo attacco non fallisce, e che il bersaglio sia immune o meno, gli effetti di Riflesso e Schermoluce finiscono per la parte del bersaglio prima del calcolo dei danni.", // NEEDS QC
			shortDesc: "Distrugge gli schermi anche se il bersaglio è immune.", // NEEDS QC
		},
		gen3: {
			desc: "Se questo attacco non fallisce, e che il bersaglio sia immune o meno, gli effetti di Riflesso e Schermoluce finiscono per la parte avversaria prima del calcolo dei danni.", // NEEDS QC
		},

		activate: "  {POKEMON} infrange le protezioni di {TEAM}!", // NEEDS QC
	},
	brine: {
		name: "Acquadisale",
		// Official flavor text: "Se i PS del bersaglio sono scesi a metà o meno, questa mossa colpirà con il doppio della potenza."
		desc: "La potenza raddoppia se il bersaglio ha metà o meno dei suoi PS max.", // NEEDS QC
		shortDesc: "Potenza doppia se il bersaglio è a metà PS o meno.", // NEEDS QC
	},
	brutalswing: {
		name: "Vorticolpo",
		// Official flavor text: "Chi la usa infligge danni intorno a sé facendo ruotare una parte del suo corpo."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i Pokémon adiacenti.", // NEEDS QC
	},
	bubble: {
		name: "Bolla",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 10% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Velocità dei nemici di 1.", // NEEDS QC
		gen1: {
			desc: "Ha il 33% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
			shortDesc: "33% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
		},
	},
	bubblebeam: {
		name: "Bollaraggio",
		// Official flavor text: "Colpisce il bersaglio con una forte scarica di bolle. Può anche ridurne la Velocità."
		desc: "Ha il 10% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
		gen1: {
			desc: "Ha il 33% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
			shortDesc: "33% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
		},
	},
	bugbite: {
		name: "Coleomorso",
		// Official flavor text: "Chi la usa morde il bersaglio. Inoltre, se questi ha una bacca, gliela ruba e ne sfrutta gli effetti."
		desc: "Se questa mossa va a segno e chi la usa non è KO, ruba la bacca del bersaglio e la mangia subito, ottenendone gli effetti anche se il proprio strumento è ignorato. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		shortDesc: "Ruba e mangia la bacca del bersaglio.", // NEEDS QC
		gen4: {
			desc: "Chi la usa ruba la bacca del bersaglio e la mangia subito, ottenendone gli effetti a meno che il proprio strumento non sia ignorato. Gli strumenti persi con questa mossa possono essere recuperati con Riciclo.", // NEEDS QC
		},

		removeItem: "  {SOURCE} ruba e mangia {ITEM:definite:classified} del bersaglio!",
	},
	bugbuzz: {
		name: "Ronzio",
		// Official flavor text: "Chi la usa crea un’onda sonora che infligge danni. Può anche ridurre la Difesa Speciale del bersaglio."
		desc: "Ha il 10% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
	},
	bulkup: {
		name: "Granfisico",
		// Official flavor text: "Chi la usa tende i muscoli per gonfiare il corpo, aumentando Difesa e Attacco."
		desc: "Aumenta l'Attacco e la Difesa di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta l'Attacco e la Difesa di chi la usa di 1.", // NEEDS QC
	},
	bulldoze: {
		name: "Battiterra",
		// Official flavor text: "Chi la usa calpesta il terreno e scatena un terremoto che danneggia i Pokémon nei paraggi, riducendone la Velocità."
		desc: "Ha il 100% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di -1 Velocità ai Pokémon adiacenti.", // NEEDS QC
	},
	bulletpunch: {
		name: "Pugnoscarica",
		// Official flavor text: "Chi la usa attacca con una scarica di pugni veloci come proiettili. Questa mossa ha priorità alta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
	},
	bulletseed: {
		name: "Semitraglia",
		// Official flavor text: "Chi la usa spara da due a cinque raffiche di semi contro il bersaglio in successione."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
	},
	burningbulwark: {
		name: "Egida Ignea",
		desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che provano a colpirlo con mosse da contatto vengono scottati. Le mosse senza danni superano questa protezione. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Protegge dagli attacchi. Contatto: scotta.", // NEEDS QC
	},
	burningjealousy: {
		name: "Fiamminvidia",
		// Official flavor text: "Chi la usa attacca con la forza dell’invidia, causando una scottatura a tutti i Pokémon le cui statistiche sono aumentate durante quel turno."
		desc: "Ha il 100% di probabilità di scottare il bersaglio se i suoi livelli delle statistiche sono aumentati in questo turno.", // NEEDS QC
		shortDesc: "100% di scottare se il bersaglio ha alzato le stat.", // NEEDS QC
	},
	burnup: {
		name: "Ultima Fiamma",
		// Official flavor text: "Chi la usa attacca sfruttando tutta la sua potenza incendiaria per infliggere gravi danni al bersaglio, ma come conseguenza perde il tipo Fuoco."
		desc: "Fallisce se chi la usa non è di tipo Fuoco. Se questa mossa va a segno e chi la usa non è teracristallizzato, perde il tipo Fuoco finché resta in campo.", // NEEDS QC
		shortDesc: "Chi la usa perde il tipo Fuoco; deve essere Fuoco.", // NEEDS QC
		gen8: {
			desc: "Fallisce se chi la usa non è di tipo Fuoco. Se questa mossa va a segno, chi la usa perde il tipo Fuoco finché resta in campo.", // NEEDS QC
		},

		typeChange: "  Le fiamme di {POKEMON} si sono spente!",
	},
	buzzybuzz: {
		name: "Elettrozap",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 100% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "100% di paralizzare il bersaglio.", // NEEDS QC
	},
	calmmind: {
		name: "Calmamente",
		// Official flavor text: "Chi la usa placa il proprio spirito meditando per aumentare l’Attacco Speciale e la Difesa Speciale."
		desc: "Aumenta l'Attacco Speciale e la Difesa Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta l'Att. Sp. e la Dif. Sp. di chi la usa di 1.", // NEEDS QC
	},
	camouflage: {
		name: "Camuffamento",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Il tipo di chi la usa cambia in base al terreno di lotta: tipo Normale sul terreno standard, tipo Elettro su un Campo Elettrico, tipo Folletto su un Campo Nebbioso, tipo Erba su un Campo Erboso e tipo Psico su un Campo Psichico. Fallisce se il tipo di chi la usa non può cambiare o se è già puramente di quel tipo.", // NEEDS QC
		shortDesc: "Tipo in base al terreno (Normale per impostazione).", // NEEDS QC
		gen6: {
			desc: "Il tipo di chi la usa cambia in base al terreno di lotta: tipo Normale sul terreno standard, tipo Elettro su un Campo Elettrico, tipo Folletto su un Campo Nebbioso e tipo Erba su un Campo Erboso. Fallisce se il tipo di chi la usa non può cambiare o se è già puramente di quel tipo.", // NEEDS QC
		},
		gen5: {
			desc: "Il tipo di chi la usa cambia in base al terreno di lotta: tipo Terra sul terreno standard. Fallisce se il tipo di chi la usa non può cambiare o se è già puramente di quel tipo.", // NEEDS QC
			shortDesc: "Cambia tipo in base al terreno. (Terra)", // NEEDS QC
		},
		gen4: {
			desc: "Il tipo di chi la usa cambia in base al terreno di lotta: tipo Normale sul terreno standard. Fallisce se chi la usa ha l'abilità Multitipo o se quel tipo è già uno dei suoi tipi attuali.", // NEEDS QC
			shortDesc: "Cambia tipo in base al terreno. (Normale)", // NEEDS QC
		},
		gen3: {
			desc: "Il tipo di chi la usa cambia in base al terreno di lotta: tipo Normale sul terreno standard. Fallisce se quel tipo è già uno dei tipi attuali di chi la usa.", // NEEDS QC
		},
	},
	captivate: {
		name: "Incanto",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Riduce l'Attacco Speciale del bersaglio di 2 livelli. Il bersaglio non è influenzato se è dello stesso sesso di chi la usa o se uno dei due non ha sesso. I Pokémon con l'abilità Indifferenza sono immuni.", // NEEDS QC
		shortDesc: "-2 Att. Sp. ai nemici di sesso opposto.", // NEEDS QC
	},
	catastropika: {
		name: "Super Pikaboom",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	ceaselessedge: {
		name: "Lama Milleflutti",
		desc: "Se questa mossa va a segno, piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Si possono piazzare al massimo tre strati: gli avversari perdono 1/8 dei loro PS max con uno strato, 1/6 con due strati e 1/4 con tre strati, arrotondato per difetto. Può essere rimossa dalla parte avversaria se un Pokémon usa Pulizie, o se un avversario usa Glitturbine, Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		shortDesc: "Piazza uno strato di Punte tra i nemici.", // NEEDS QC
	},
	celebrate: {
		name: "Auguri",
		shortDesc: "Nessuna utilità in lotta.", // NEEDS QC

		activate: "  Auguri, {TRAINER}!",
	},
	charge: {
		name: "Sottocarica",
		// Official flavor text: "Potenzia la mossa di tipo Elettro usata subito dopo. Aumenta anche la Difesa Speciale di chi la usa."
		desc: "Aumenta la Difesa Speciale di chi la usa di un livello. Il suo prossimo attacco di tipo Elettro avrà la potenza raddoppiata; l'effetto finisce quando chi la usa lascia il campo o dopo che ha provato a usare una mossa di tipo Elettro diversa da Sottocarica, anche senza successo.", // NEEDS QC
		shortDesc: "+1 Dif. Sp.; la prossima mossa Elettro fa x2.", // NEEDS QC
		gen8: {
			desc: "Aumenta la Difesa Speciale di chi la usa di un livello. Se chi la usa usa un attacco di tipo Elettro nel turno successivo, la sua potenza sarà raddoppiata.", // NEEDS QC
			shortDesc: "+1 Dif. Sp. Prossima mossa Elettro a potenza doppia.", // NEEDS QC
		},
		gen3: {
			desc: "Se chi la usa usa un attacco di tipo Elettro nel turno successivo, la sua potenza sarà raddoppiata.", // NEEDS QC
			shortDesc: "La prossima mossa Elettro ha potenza doppia.", // NEEDS QC
		},

		start: "  {POKEMON} si carica di elettricità!",
	},
	chargebeam: {
		name: "Raggioscossa",
		// Official flavor text: "Chi la usa lancia un fascio di elettricità molto intensa. Può anche aumentare il suo Attacco Speciale."
		desc: "Ha il 70% di probabilità di aumentare l'Attacco Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "70% di aumentare l'Att. Sp. di chi la usa di 1.", // NEEDS QC
	},
	charm: {
		name: "Fascino",
		// Official flavor text: "Ammalia il bersaglio con lo sguardo per renderlo meno cauto. Ne riduce molto l’Attacco."
		desc: "Riduce l'Attacco del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce l'Attacco del bersaglio di 2.", // NEEDS QC
	},
	chatter: {
		name: "Schiamazzo",
		// Official flavor text: "Chi la usa attacca creando un’onda sonora di parole a vanvera e confonde il bersaglio."
		desc: "Ha il 100% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "100% di confondere il bersaglio.", // NEEDS QC
		gen5: {
			desc: "Ha X% di probabilità di confondere il bersaglio, dove X è 0 a meno che chi la usa non sia un Chatot non trasformato. Se chi la usa è un Chatot, X è 0 o 10 a seconda del volume del verso registrato: 0 per un volume basso o nessuna registrazione, 10 per un volume da medio ad alto.", // NEEDS QC
			shortDesc: "Per Chatot: 10% di confondere.", // NEEDS QC
		},
		gen4: {
			desc: "Ha X% di probabilità di confondere il bersaglio, dove X è 0 a meno che chi la usa non sia un Chatot non trasformato. Se chi la usa è un Chatot, X è 1, 11 o 31 a seconda del volume del verso registrato: 1 senza registrazione o a volume basso, 11 a volume medio e 31 a volume alto.", // NEEDS QC
			shortDesc: "Per Chatot: 31% di confondere.", // NEEDS QC
		},
	},
	chillingwater: {
		name: "Doccia Fredda",
		desc: "Ha il 100% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Attacco del bersaglio di 1.", // NEEDS QC
	},
	chillyreception: {
		name: "Freddura",
		desc: "Per 5 turni, nevica. Chi la usa viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se non ci sono altri membri della squadra non KO.", // NEEDS QC
		shortDesc: "Evoca la neve e chi la usa lascia il campo.", // NEEDS QC

		prepare: "  {POKEMON} sta per fare una battuta!",
	},
	chipaway: {
		name: "Insidia",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ignora i livelli delle statistiche del bersaglio, elusione compresa.", // NEEDS QC
		shortDesc: "Ignora i cambi di statistiche del bersaglio.", // NEEDS QC
	},
	chloroblast: {
		name: "Clorofillaser",
		desc: "Se questa mossa va a segno, chi la usa perde metà dei suoi PS max, arrotondato per eccesso, a meno che non abbia l'abilità Magicscudo o Testadura.", // NEEDS QC
		shortDesc: "Chi la usa perde metà dei suoi PS max.", // NEEDS QC
	},
	circlethrow: {
		name: "Ribaltiro",
		// Official flavor text: "Il bersaglio è scaraventato via ed è costretto a lasciare il posto a un altro. Mette fine alle lotte contro singoli Pokémon selvatici."
		desc: "Se né chi la usa né il bersaglio sono KO, il bersaglio è costretto a lasciare il campo e viene sostituito da un alleato non KO scelto a caso. Questo effetto fallisce se il bersaglio è sotto l'effetto di Radicamento, ha l'abilità Ventose o se questa mossa ha colpito un sostituto.", // NEEDS QC
		shortDesc: "Il bersaglio viene sostituito da un alleato a caso.", // NEEDS QC
	},
	clamp: {
		name: "Tenaglia",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max (1/8 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni (sempre cinque se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
			shortDesc: "Intrappola e ferisce il bersaglio per 2-5 turni.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni. Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se usa Staffetta. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa usa questa mossa per due-cinque turni. Ha 3/8 di probabilità di durare due o tre turni e 1/8 di durare quattro o cinque turni. I danni calcolati al primo turno vengono ripetuti per ogni altro turno. Chi la usa non può scegliere mosse e il bersaglio non può eseguire mosse durante l'effetto, ma entrambi possono essere sostituiti. Se chi la usa viene sostituito, il bersaglio resta incapace di agire in quel turno. Se il bersaglio viene sostituito, chi la usa usa di nuovo questa mossa automaticamente, e se in quel momento aveva 0 PP, diventano 63. Se chi la usa o il bersaglio viene sostituito, o chi la usa non può agire, l'effetto finisce. Questa mossa può impedire al bersaglio di agire anche se ha un'immunità di tipo, ma in tal caso non infligge danni.", // NEEDS QC
			shortDesc: "Il bersaglio non può agire per 2-5 turni.", // NEEDS QC
		},

		start: "  {SOURCE} stritola {POKEMON} con Tenaglia!",
		move: "#wrap",
	},
	clangingscales: {
		name: "Clamorsquame",
		// Official flavor text: "Chi la usa attacca il bersaglio con un suono fortissimo che genera sfregando le scaglie del corpo. Dopo aver attaccato, la sua Difesa diminuisce."
		desc: "Riduce la Difesa di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Riduce la Difesa di chi la usa di 1.", // NEEDS QC
	},
	clangoroussoul: {
		name: "Dracofonia",
		// Official flavor text: "Chi la usa sacrifica un po’ dei suoi PS per aumentare tutte le sue statistiche."
		desc: "Aumenta l'Attacco, la Difesa, l'Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa di un livello in cambio del 33% dei suoi PS max, arrotondato per difetto. Fallisce se chi la usa andrebbe KO o se nessuno di questi livelli cambierebbe.", // NEEDS QC
		shortDesc: "Perde 1/3 dei PS max. +1 a tutte le statistiche.", // NEEDS QC
	},
	clangoroussoulblaze: {
		name: "Dracofonia Divampante",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Aumenta l'Attacco, la Difesa, l'Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "+1 Att, Dif, Att. Sp., Dif. Sp. e Vel. di chi la usa.", // NEEDS QC
	},
	clearsmog: {
		name: "Pulifumo",
		shortDesc: "Azzera tutti i cambi di statistiche del bersaglio.", // NEEDS QC
	},
	closecombat: {
		name: "Zuffa",
		// Official flavor text: "Chi la usa attacca abbassando la guardia. La propria Difesa e la Difesa Speciale si riducono."
		desc: "Riduce la Difesa e la Difesa Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Riduce la Difesa e la Dif. Sp. di chi la usa di 1.", // NEEDS QC
	},
	coaching: {
		name: "Coaching",
		// Official flavor text: "Chi la usa aumenta l’Attacco e la Difesa di tutti gli alleati dando loro indicazioni precise."
		desc: "Aumenta l'Attacco e la Difesa del bersaglio di un livello. Fallisce se nessun alleato è adiacente a chi la usa.", // NEEDS QC
		shortDesc: "+1 Attacco e Difesa di un alleato.", // NEEDS QC
	},
	coil: {
		name: "Arrotola",
		// Official flavor text: "Chi la usa si concentra aumentando Attacco, Difesa e precisione."
		desc: "Aumenta l'Attacco, la Difesa e la precisione di chi la usa di un livello.", // NEEDS QC
		shortDesc: "+1 Attacco, Difesa e precisione di chi la usa.", // NEEDS QC
	},
	collisioncourse: {
		name: "Turboschianto",
		desc: "I danni sono moltiplicati per 1,3333 se questa mossa è superefficace contro il bersaglio.", // NEEDS QC
		shortDesc: "Danni x1,3333 se superefficace.", // NEEDS QC
	},
	combattorque: {
		name: "Turborissa",
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "30% di paralizzare il bersaglio.", // NEEDS QC
	},
	cometpunch: {
		name: "Cometapugno",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. I danni sono calcolati una sola volta per il primo colpo e ripetuti per ogni colpo. Se uno dei colpi rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	comeuppance: {
		name: "Ritorsione",
		desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco fisico o speciale in questo turno danni pari a 1,5 volte i PS persi in quell'attacco, arrotondato per difetto. Se chi la usa non ha perso PS in quell'attacco, questa mossa infligge 1 PS di danni. Se la posizione di quell'avversario non è più occupata e un altro avversario è in campo, i danni vengono inflitti a lui. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco fisico o speciale avversario in questo turno.", // NEEDS QC
		shortDesc: "Se viene colpito, restituisce 1,5x i danni.", // NEEDS QC
	},
	confide: {
		name: "Confidenza",
		// Official flavor text: "Chi la usa svela dei segreti al bersaglio, distraendolo e riducendone l’Attacco Speciale."
		desc: "Riduce l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce l'Att. Sp. del bersaglio di 1.", // NEEDS QC
	},
	confuseray: {
		name: "Stordiraggio",
		// Official flavor text: "Colpisce il bersaglio con un raggio funesto che lo confonde."
		desc: "Confonde il bersaglio.", // NEEDS QC
		shortDesc: "Confonde il bersaglio.", // NEEDS QC
	},
	confusion: {
		name: "Confusione",
		// Official flavor text: "Colpisce il bersaglio con una leggera forza telecinetica e può anche confonderlo."
		desc: "Ha il 10% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "10% di confondere il bersaglio.", // NEEDS QC
	},
	constrict: {
		name: "Limitazione",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 10% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
		gen1: {
			desc: "Ha il 33% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
			shortDesc: "33% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
		},
	},
	continentalcrush: {
		name: "Gigamacigno Polverizzante",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	conversion: {
		name: "Conversione",
		// Official flavor text: "Il tipo di chi la usa muta in quello della prima mossa nella lista delle sue mosse."
		desc: "Il tipo di chi la usa diventa il tipo originale della mossa nel suo primo slot. Fallisce se chi la usa non può cambiare tipo o se quel tipo è già uno dei suoi tipi attuali.", // NEEDS QC
		shortDesc: "Assume il tipo della sua prima mossa.", // NEEDS QC
		gen5: {
			desc: "Il tipo di chi la usa diventa a caso il tipo originale di una delle sue mosse diverse da questa, ma non uno dei suoi tipi attuali. Fallisce se chi la usa non può cambiare tipo o se questa mossa potrebbe scegliere solo uno dei suoi tipi attuali.", // NEEDS QC
			shortDesc: "Assume il tipo di una delle sue mosse.", // NEEDS QC
		},
		gen4: {
			desc: "Il tipo di chi la usa diventa a caso il tipo originale di una delle sue mosse diverse da questa e da Maledizione, ma non uno dei suoi tipi attuali. Fallisce se chi la usa non può cambiare tipo o se questa mossa potrebbe scegliere solo uno dei suoi tipi attuali.", // NEEDS QC
		},
		gen3: {
			desc: "Il tipo di chi la usa diventa a caso il tipo originale di una delle sue mosse diverse da Maledizione, ma non uno dei suoi tipi attuali. Fallisce se chi la usa non può cambiare tipo o se questa mossa potrebbe scegliere solo uno dei suoi tipi attuali.", // NEEDS QC
		},
		gen1: {
			desc: "I tipi di chi la usa diventano i tipi attuali del bersaglio.", // NEEDS QC
			shortDesc: "Copia i tipi del bersaglio.", // NEEDS QC
		},

		typeChange: "  Passa al tipo di {SOURCE}",
	},
	conversion2: {
		name: "Conversione2",
		// Official flavor text: "Chi la usa cambia tipo per rendersi resistente al tipo dell’ultima mossa usata dal bersaglio."
		desc: "Il tipo di chi la usa diventa un tipo che resiste o è immune al tipo dell'ultima mossa usata dal bersaglio, ma non uno dei suoi tipi attuali. Viene usato il tipo determinato della mossa, non quello originale. Fallisce se il bersaglio non ha ancora agito, se chi la usa non può cambiare tipo o se questa mossa potrebbe scegliere solo uno dei suoi tipi attuali.", // NEEDS QC
		shortDesc: "Assume un tipo che resiste all'ultima mossa subita.", // NEEDS QC
		gen4: {
			desc: "Il tipo di chi la usa diventa un tipo che resiste o è immune al tipo dell'ultima mossa usata contro di lui, se ha avuto successo, ma non uno dei suoi tipi attuali. Viene usato il tipo determinato della mossa, non quello originale. Fallisce se l'ultima mossa usata contro chi la usa non ha avuto successo, se chi la usa ha l'abilità Multitipo o se questa mossa potrebbe scegliere solo uno dei suoi tipi attuali.", // NEEDS QC
			shortDesc: "Assume un tipo che resiste all'ultima mossa subita.", // NEEDS QC
		},
		gen3: {
			desc: "Il tipo di chi la usa diventa un tipo che resiste o è immune al tipo dell'ultima mossa usata contro di lui, se ha avuto successo, ma non uno dei suoi tipi attuali. Viene usato il tipo determinato della mossa, non quello originale, ma Scontro è considerata di tipo Normale. Fallisce se l'ultima mossa usata contro chi la usa non ha avuto successo o se questa mossa potrebbe scegliere solo uno dei suoi tipi attuali.", // NEEDS QC
		},
		gen2: {
			desc: "Il tipo di chi la usa diventa un tipo che resiste o è immune al tipo dell'ultima mossa usata dal Pokémon avversario, anche se è uno dei suoi tipi attuali. Viene usato il tipo originale della mossa, non quello determinato. Fallisce se il Pokémon avversario non ha usato mosse.", // NEEDS QC
			shortDesc: "Assume un tipo che resiste all'ultima mossa nemica.", // NEEDS QC
		},
	},
	copycat: {
		name: "Copione",
		// Official flavor text: "Chi la usa mima l’ultima mossa eseguita. Fallisce se non è stata ancora usata alcuna mossa."
		desc: "Chi la usa esegue l'ultima mossa usata da qualsiasi Pokémon, incluso sé stesso. Fallisce se nessuna mossa è stata usata o se l'ultima era Assistente, Fortino, Cannonbecco, Colpo Maestoso, Taglio Maestoso, Rutto, Cediregalo, Turboustione, Auguri, Schiamazzo, Ribaltiro, Turborissa, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Codadrago, Cannone Dynamax, Resistenza, Fintoattacco, Centripugno, Sonoqui, Altruismo, Mano nella Mano, Scudo Reale, Turboincanto, Ribaltappeto, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Turbotossina, Protezione, Polverabbia, Boato, Gusciotrappola, Schizzo, Sonnolalia, Scippo, Agodifesa, Riflettore, Scontro, Rapidscambio, Teracluster, Furto, Trasformazione, Raggiro, Turbine o Turbotenebra.", // NEEDS QC
		shortDesc: "Usa l'ultima mossa usata nella lotta.", // NEEDS QC
		gen8: {
			desc: "Chi la usa esegue l'ultima mossa usata da qualsiasi Pokémon, incluso sé stesso. Per le mosse Dynamax e Gigamax si considera la mossa di base. Fallisce se nessuna mossa è stata usata o se l'ultima era Assistente, Fortino, Cannonbecco, Colpo Maestoso, Taglio Maestoso, Rutto, Cediregalo, Auguri, Schiamazzo, Ribaltiro, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Codadrago, Cannone Dynamax, Resistenza, Fintoattacco, Centripugno, Sonoqui, Altruismo, Mano nella Mano, Scudo Reale, Ribaltappeto, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Protezione, Polverabbia, Boato, Gusciotrappola, Schizzo, Sonnolalia, Scippo, Agodifesa, Riflettore, Scontro, Rapidscambio, Furto, Trasformazione, Raggiro o Turbine.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa esegue l'ultima mossa usata da qualsiasi Pokémon, incluso sé stesso. Fallisce se nessuna mossa è stata usata o se l'ultima era Assistente, Fortino, Cannonbecco, Rutto, Cediregalo, Auguri, Schiamazzo, Ribaltiro, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Codadrago, Resistenza, Fintoattacco, Centripugno, Sonoqui, Altruismo, Mano nella Mano, Scudo Reale, Ribaltappeto, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Protezione, Polverabbia, Boato, Gusciotrappola, Schizzo, Sonnolalia, Scippo, Agodifesa, Riflettore, Scontro, Rapidscambio, Furto, Trasformazione, Raggiro o Turbine, o una mossa Z.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa esegue l'ultima mossa usata da qualsiasi Pokémon, incluso sé stesso. Fallisce se nessuna mossa è stata usata o se l'ultima era Assistente, Rutto, Cediregalo, Auguri, Schiamazzo, Ribaltiro, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Codadrago, Resistenza, Fintoattacco, Centripugno, Sonoqui, Altruismo, Mano nella Mano, Scudo Reale, Ribaltappeto, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Protezione, Polverabbia, Boato, Schizzo, Sonnolalia, Scippo, Agodifesa, Scontro, Rapidscambio, Furto, Trasformazione, Raggiro o Turbine.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa esegue l'ultima mossa usata da qualsiasi Pokémon, incluso sé stesso. Fallisce se nessuna mossa è stata usata o se l'ultima era Assistente, Cediregalo, Schiamazzo, Ribaltiro, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Codadrago, Resistenza, Fintoattacco, Centripugno, Sonoqui, Altruismo, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Protezione, Polverabbia, Schizzo, Sonnolalia, Scippo, Scontro, Rapidscambio, Furto, Trasformazione o Raggiro.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa esegue l'ultima mossa usata da qualsiasi Pokémon, incluso sé stesso. Fallisce se nessuna mossa è stata usata o se l'ultima era Assistente, Schiamazzo, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Resistenza, Fintoattacco, Centripugno, Sonoqui, Altruismo, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Protezione, Schizzo, Sonnolalia, Scippo, Scontro, Rapidscambio, Furto o Raggiro.", // NEEDS QC
		},
	},
	coreenforcer: {
		name: "Nucleocastigo",
		// Official flavor text: "Il bersaglio subisce dei danni e, se ha già agito nel turno, perde la sua abilità."
		desc: "Se chi la usa agisce dopo il bersaglio, l'abilità di quest'ultimo viene resa inefficace finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta sotto questo effetto. Se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teramorfosi, Stato Zen o Supercambio, questo effetto non si verifica, e riceverlo tramite Staffetta lo fa finire immediatamente.", // NEEDS QC
		shortDesc: "Annulla l'abilità dei nemici che hanno già agito.", // NEEDS QC
		gen8: {
			desc: "Se chi la usa agisce dopo il bersaglio, l'abilità di quest'ultimo viene resa inefficace finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta sotto questo effetto. Se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen, questo effetto non si verifica, e riceverlo tramite Staffetta lo fa finire immediatamente.", // NEEDS QC
		},
		gen7: {
			desc: "Se chi la usa agisce dopo il bersaglio, l'abilità di quest'ultimo viene resa inefficace finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta sotto questo effetto. Se l'abilità del bersaglio è Morfosintonia, Sonno Assoluto, Fantasmanto, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen, questo effetto non si verifica, e riceverlo tramite Staffetta lo fa finire immediatamente.", // NEEDS QC
		},
	},
	corkscrewcrash: {
		name: "Spirale Perforante",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	corrosivegas: {
		name: "Gas Corrosivo",
		// Official flavor text: "Chi la usa avvolge tutti i Pokémon che ha intorno in un gas altamente acido, dissolvendo i loro strumenti."
		desc: "Il bersaglio perde il suo strumento. Questa mossa non può far perdere lo strumento ai Pokémon con l'abilità Antifurto, né far perdere a Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradosso o Ogerpon rispettivamente Gemma blu, Gemma rossa, Adamasferoide, Splendisferoide, Grigiosferoide, una lastra, un modulo, una ROM, Spada rovinata, Scudo rovinato, una Capsula energetica o una maschera. In questo caso, i Pokémon Paradosso includono tutte le specie con le abilità Paleoattivazione e Carica Quark, tranne Vampeaguzze, Furiatonante, Massoferreo e Capoferreo. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		shortDesc: "Distrugge gli strumenti dei Pokémon adiacenti.", // NEEDS QC
		gen8: {
			desc: "Il bersaglio perde il suo strumento. Questa mossa non può far perdere lo strumento ai Pokémon con l'abilità Antifurto, né far perdere a Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta rispettivamente Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo, una ROM, Spada rovinata o Scudo rovinato. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},

		fail: "#healblock",
		removeItem: "  {SOURCE} scioglie {ITEM:definite} di {POKEMON}!",
	},
	cosmicpower: {
		name: "Cosmoforza",
		// Official flavor text: "Chi la usa assorbe una forza mistica dallo spazio che aumenta la Difesa e la Difesa Speciale."
		desc: "Aumenta la Difesa e la Difesa Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta la Difesa e la Dif. Sp. di chi la usa di 1.", // NEEDS QC
	},
	cottonguard: {
		name: "Cotonscudo",
		// Official flavor text: "Chi la usa avvolge il proprio corpo con del cotone molto morbido, proteggendosi e aumentando moltissimo la propria Difesa."
		desc: "Aumenta la Difesa di chi la usa di 3 livelli.", // NEEDS QC
		shortDesc: "Aumenta la Difesa di chi la usa di 3.", // NEEDS QC
	},
	cottonspore: {
		name: "Cottonspora",
		// Official flavor text: "Rilascia spore simili al cotone che si attaccano ai nemici nei paraggi e ne riducono di molto la Velocità."
		desc: "Riduce la Velocità del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce la Velocità del bersaglio di 2.", // NEEDS QC
	},
	counter: {
		name: "Contrattacco",
		// Official flavor text: "Mossa che contrasta ogni attacco fisico, arrecando il doppio del danno ricevuto."
		desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco fisico in questo turno danni pari al doppio dei PS persi in quell'attacco. Se chi la usa non ha perso PS, questa mossa infligge 1 PS di danni. Se la posizione di quell'avversario non è più occupata e un altro avversario è in campo, i danni vengono inflitti a lui. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco fisico avversario in questo turno.", // NEEDS QC
		shortDesc: "Restituisce il doppio dei danni di un attacco fisico.", // NEEDS QC
		gen6: {
			desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco fisico in questo turno danni pari al doppio dei PS persi in quell'attacco. Se chi la usa non ha perso PS, questa mossa infligge danni con una potenza di 1. Se la posizione di quell'avversario non è più occupata, i danni vengono inflitti a un avversario a caso a portata. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco fisico avversario in questo turno.", // NEEDS QC
		},
		gen4: {
			desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco fisico in questo turno danni pari al doppio dei PS persi in quell'attacco. Se la posizione di quell'avversario non è più occupata e un altro avversario è in campo, i danni vengono inflitti a lui. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco fisico avversario in questo turno o se non ha perso PS in quell'attacco.", // NEEDS QC
		},
		gen3: {
			desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco fisico in questo turno danni pari al doppio dei PS persi in quell'attacco. Se la posizione di quell'avversario non è più occupata e un altro avversario è in campo, i danni vengono inflitti a lui. Introforza è considerata di tipo Normale, e solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco fisico avversario in questo turno o se non ha perso PS in quell'attacco.", // NEEDS QC
		},
		gen2: {
			desc: "Infligge al Pokémon avversario danni pari al doppio dei PS persi da chi la usa per un attacco fisico in questo turno. Introforza è considerata di tipo Normale, e solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa agisce per primo, se non è stato colpito da un attacco fisico in questo turno o se non ha perso PS in quell'attacco. Se il Pokémon avversario ha usato Abisso o Perforcorno mancando il bersaglio, questa mossa infligge 65535 danni.", // NEEDS QC
		},
		gen1: {
			desc: "Infligge al Pokémon avversario danni pari al doppio dei danni inflitti dall'ultima mossa usata nella lotta. Questa mossa ignora l'immunità di tipo. Fallisce se chi la usa agisce per primo, o se l'ultima mossa della parte avversaria era Contrattacco, aveva potenza 0, o non era di tipo Normale o Lotta. Fallisce se l'ultima mossa usata da una delle due parti ha inflitto 0 danni e non era Stordiraggio, Conversione, Focalenergia, Sguardo Feroce, Nube, Parassiseme, Schermoluce, Mimica, Nebbia, Velenogas, Velenpolvere, Ripresa, Riflesso, Riposo, Covauova, Splash, Paralizzante, Sostituto, Supersuono, Teletrasporto, Tuononda, Tossina o Trasformazione.", // NEEDS QC
			shortDesc: "Rende 2x i danni di mosse Normale/Lotta.", // NEEDS QC
		},
	},
	courtchange: {
		name: "Cambiocampo",
		// Official flavor text: "Una forza misteriosa inverte gli effetti attivi sul campo alleato e sul campo avversario."
		desc: "Scambia gli effetti di Nebbia, Schermoluce, Riflesso, Punte, Salvaguardia, Ventoincoda, Fielepunte, Levitoroccia, Acquapatto, Fiammapatto, Erbapatto, Rete Vischiosa, Velaurora, Gigaferroaculei, Gigacannonata, Gigasferzata e Gigavampa tra la parte di chi la usa e quella avversaria.", // NEEDS QC
		shortDesc: "Scambia gli effetti di campo delle due parti.", // NEEDS QC

		activate: "  {POKEMON} ha invertito gli effetti attivi nelle due metà del campo!",
	},
	covet: {
		name: "Supplica",
		// Official flavor text: "Chi la usa attacca il bersaglio sorridendo e gli ruba lo strumento."
		desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è Gemma blu, Gemma rossa, Adamasferoide, Splendisferoide, Grigiosferoide, una lastra, un modulo, una ROM, Spada rovinata, Scudo rovinato, una Capsula energetica o una maschera tenuto rispettivamente da Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradosso o Ogerpon, o se chi la usa è una di quelle specie e il bersaglio ha lo strumento corrispondente. In questo caso, i Pokémon Paradosso includono tutte le specie con le abilità Paleoattivazione e Carica Quark, tranne Vampeaguzze, Furiatonante, Massoferreo e Capoferreo. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		shortDesc: "Senza strumenti, ruba quello del bersaglio.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo, una ROM, Spada rovinata o Scudo rovinato avuti rispettivamente da Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen7: {
			desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è un Cristallo Z, una megapietra avuta dalla specie che può megaevolversi con essa, o Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo o una ROM avuti rispettivamente da Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen6: {
			desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è una megapietra avuta dalla specie che può megaevolversi con essa, o Gemma blu, Gemma rossa, Grigiosfera, una lastra o un modulo avuti rispettivamente da Kyogre, Groudon, Giratina, Arceus, Genesect, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen5: {
			desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è un Messaggio, o Grigiosfera, una lastra o un modulo avuti rispettivamente da Giratina, Arceus o Genesect, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen4: {
			desc: "Se questo attacco va a segno e chi la usa non ha strumenti, ruba lo strumento del bersaglio. Lo strumento non viene rubato se è un Messaggio o una Grigiosfera, o se il bersaglio ha l'abilità Multitipo o Antifurto. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo.", // NEEDS QC
		},
		gen3: {
			desc: "Se questo attacco va a segno e chi la usa non ha strumenti, ruba lo strumento del bersaglio. Lo strumento non viene rubato se è un Messaggio o una Baccaenigma, o se il bersaglio ha l'abilità Antifurto. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo.", // NEEDS QC
		},
	},
	crabhammer: {
		name: "Martellata",
		// Official flavor text: "Danneggia il bersaglio servendosi di una grande tenaglia. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	craftyshield: {
		name: "Truccodifesa",
		// Official flavor text: "Grazie a un misterioso potere, protegge chi la usa e gli alleati dalle mosse di stato. È tuttavia inefficace contro mosse che infliggono danni."
		desc: "Chi la usa e la sua squadra sono protetti dalle mosse senza danni degli altri Pokémon, alleati compresi, in questo turno. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "Protegge la squadra dalle mosse di stato nel turno.", // NEEDS QC

		start: "  {TEAM} è protetto da Truccodifesa!",
		block: "  {POKEMON} è protetto da Truccodifesa!",
	},
	crosschop: {
		name: "Incrocolpo",
		// Official flavor text: "Investe il bersaglio con un colpo sferrato con entrambe le braccia incrociate. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	crosspoison: {
		name: "Velenocroce",
		// Official flavor text: "Attacco con zanne avvelenate che può anche avvelenare il Pokémon colpito. Probabile brutto colpo."
		desc: "Ha il 10% di probabilità di avvelenare il bersaglio e una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta prob. di brutto colpo. 10% di avvelenare.", // NEEDS QC
	},
	crunch: {
		name: "Sgranocchio",
		// Official flavor text: "Il bersaglio viene morso con denti affilati. Può anche ridurne la Difesa."
		desc: "Ha il 20% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "20% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
		gen3: {
			desc: "Ha il 20% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
			shortDesc: "20% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
		},
	},
	crushclaw: {
		name: "Tritartigli",
		// Official flavor text: "Colpisce il bersaglio con artigli robusti e affilati che possono ridurne la Difesa."
		desc: "Ha il 50% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "50% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
	},
	crushgrip: {
		name: "Sbriciolmano",
		// Official flavor text: "Colpisce il bersaglio con grande forza. Più PS ha il Pokémon colpito, maggiore è la potenza della mossa."
		desc: "La potenza è pari a 120 × (PS attuali del bersaglio / PS max del bersaglio), arrotondato per difetto da 0,5, ma non meno di 1.", // NEEDS QC
		shortDesc: "Più potente se il bersaglio ha molti PS.", // NEEDS QC
		gen4: {
			desc: "La potenza è pari a 120 × (PS attuali del bersaglio ÷ PS max del bersaglio) + 1, arrotondato per difetto.", // NEEDS QC
		},
	},
	curse: {
		name: "Maledizione",
		// Official flavor text: "Una mossa che agisce in modo diverso se chi la usa è di tipo Spettro."
		desc: "Se chi la usa non è di tipo Spettro, la sua Velocità diminuisce di un livello e il suo Attacco e la sua Difesa aumentano di un livello. Se è di tipo Spettro, perde metà dei suoi PS max, arrotondato per difetto, anche se questo lo manda KO, e il bersaglio perde 1/4 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta colpito. Fallisce se non c'è un bersaglio o se è già colpito.", // NEEDS QC
		shortDesc: "Spettro: maledice; altrimenti -1 Vel., +1 Att e Dif.", // NEEDS QC
		gen4: {
			desc: "Se chi la usa non è di tipo Spettro, riduce la sua Velocità di un livello e aumenta il suo Attacco e la sua Difesa di un livello. Se è di tipo Spettro, perde metà dei suoi PS max, arrotondato per difetto e anche se ciò lo manda KO; in cambio, il bersaglio perde 1/4 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta colpito. Fallisce se non c'è bersaglio, o se il bersaglio è già colpito o ha un sostituto.", // NEEDS QC
		},
		gen2: {
			desc: "Se chi la usa non è di tipo Spettro, riduce la sua Velocità di un livello e aumenta il suo Attacco e la sua Difesa di un livello, a meno che Attacco e Difesa non siano entrambi già al livello 6. Se è di tipo Spettro, perde metà dei suoi PS max, arrotondato per difetto e anche se ciò lo manda KO; in cambio, il bersaglio perde 1/4 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta colpito. Fallisce se il bersaglio è già colpito o ha un sostituto.", // NEEDS QC
		},

		start: "  {SOURCE} riduce i suoi PS per lanciare una maledizione su {POKEMON}!",
		damage: "  {POKEMON} è colpito dalla maledizione!",
	},
	cut: {
		name: "Taglio",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	darkestlariat: {
		name: "Braccioteso",
		// Official flavor text: "Chi la usa attacca il bersaglio mulinando gli arti. Il danno inflitto ignora le modifiche alle statistiche del bersaglio."
		desc: "Ignora i livelli delle statistiche del bersaglio, elusione compresa.", // NEEDS QC
		shortDesc: "Ignora i cambi di statistiche del bersaglio.", // NEEDS QC
	},
	darkpulse: {
		name: "Neropulsar",
		// Official flavor text: "Chi la usa emana un’aura impregnata di oscuri pensieri. Può anche far tentennare il Pokémon colpito."
		desc: "Ha il 20% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "20% di far tentennare il bersaglio.", // NEEDS QC
	},
	darkvoid: {
		name: "Vuototetro",
		// Official flavor text: "Trascina i nemici intorno in un mondo di totale oscurità e li fa addormentare."
		desc: "Addormenta il bersaglio. Questa mossa può essere usata con successo solo se la forma attuale di chi la usa, considerando Trasformazione, è Darkrai.", // NEEDS QC
		shortDesc: "Darkrai: addormenta i nemici.", // NEEDS QC
		gen6: {
			desc: "Fa addormentare il bersaglio.", // NEEDS QC
			shortDesc: "Addormenta i nemici.", // NEEDS QC
		},

		fail: "Ma non ne è capace!",
		failWrongForme: "Ma nella forma attuale non ci riesce!",
	},
	dazzlinggleam: {
		name: "Magibrillio",
		// Official flavor text: "Chi la usa emette una luce potentissima che infligge danni ai nemici intorno."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i nemici adiacenti.", // NEEDS QC
	},
	decorate: {
		name: "Decorazione",
		// Official flavor text: "Chi la usa agghinda il bersaglio con delle decorazioni aumentandone di molto l’Attacco e l’Attacco Speciale."
		desc: "Aumenta l'Attacco e l'Attacco Speciale del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta l'Attacco e l'Att. Sp. del bersaglio di 2.", // NEEDS QC
	},
	defendorder: {
		name: "Comandoscudo",
		// Official flavor text: "Chi la usa raduna i suoi sgherri per creare uno scudo, aumentando Difesa e Difesa Speciale."
		desc: "Aumenta la Difesa e la Difesa Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta la Difesa e la Dif. Sp. di chi la usa di 1.", // NEEDS QC
	},
	defensecurl: {
		name: "Ricciolscudo",
		// Official flavor text: "Chi la usa si raggomitola per nascondere i punti deboli e aumentare la propria Difesa."
		desc: "Aumenta la Difesa di chi la usa di un livello. Finché resta in campo, la potenza delle sue Palla Gelo e Rotolamento raddoppia (questo effetto non è cumulabile).", // NEEDS QC
		shortDesc: "Aumenta la Difesa di chi la usa di 1.", // NEEDS QC
		gen2: {
			desc: "Aumenta la Difesa di chi la usa di un livello. Finché chi la usa resta in campo, la potenza del suo Rotolamento è raddoppiata (effetto non cumulabile). Questo effetto può essere trasmesso con Staffetta.", // NEEDS QC
		},
		gen1: {
			desc: "Aumenta la Difesa di chi la usa di un livello.", // NEEDS QC
		},
	},
	defog: {
		name: "Scacciabruma",
		// Official flavor text: "Chi la usa spazza via barriere come Riflesso e Schermoluce con un forte vento e riduce la capacità d’elusione del bersaglio."
		desc: "Riduce l'elusione del bersaglio di un livello. Se questa mossa va a segno, che l'elusione sia stata influenzata o meno, gli effetti di Riflesso, Schermoluce, Velaurora, Salvaguardia, Nebbia, Punte, Fielepunte, Levitoroccia e Rete Vischiosa finiscono per la parte del bersaglio, e gli effetti di Punte, Fielepunte, Levitoroccia e Rete Vischiosa finiscono per la parte di chi la usa. Ignora il sostituto del bersaglio, che però blocca comunque la riduzione dell'elusione. Se un campo è attivo e questa mossa va a segno, il campo viene rimosso.", // NEEDS QC
		shortDesc: "-1 elusione; rimuove trappole e campi di entrambi.", // NEEDS QC
		gen7: {
			desc: "Riduce l'elusione del bersaglio di un livello. Se questa mossa va a segno, e che l'elusione del bersaglio sia stata influenzata o meno, gli effetti di Riflesso, Schermoluce, Velaurora, Salvaguardia, Nebbia, Punte, Fielepunte, Levitoroccia e Rete Vischiosa finiscono per la parte del bersaglio, e gli effetti di Punte, Fielepunte, Levitoroccia e Rete Vischiosa finiscono per la parte di chi la usa. Ignora il sostituto del bersaglio, ma un sostituto blocca comunque la riduzione dell'elusione.", // NEEDS QC
			shortDesc: "-1 elusione; rimuove le trappole da entrambi i lati.", // NEEDS QC
		},
		gen6: {
			desc: "Riduce l'elusione del bersaglio di un livello. Se questa mossa va a segno, e che l'elusione del bersaglio sia stata influenzata o meno, gli effetti di Riflesso, Schermoluce, Salvaguardia, Nebbia, Punte, Fielepunte, Levitoroccia e Rete Vischiosa finiscono per la parte del bersaglio, e gli effetti di Punte, Fielepunte, Levitoroccia e Rete Vischiosa finiscono per la parte di chi la usa. Ignora il sostituto del bersaglio, ma un sostituto blocca comunque la riduzione dell'elusione.", // NEEDS QC
		},
		gen5: {
			desc: "Riduce l'elusione del bersaglio di un livello. Se questa mossa va a segno, e che l'elusione del bersaglio sia stata influenzata o meno, gli effetti di Riflesso, Schermoluce, Salvaguardia, Nebbia, Punte, Fielepunte e Levitoroccia finiscono per la parte del bersaglio. Ignora il sostituto del bersaglio, ma un sostituto blocca comunque la riduzione dell'elusione.", // NEEDS QC
			shortDesc: "-1 elusione; rimuove trappole e schermi avversari.", // NEEDS QC
		},
	},
	destinybond: {
		name: "Destinobbligato",
		// Official flavor text: "Se chi la usa va KO a causa di un attacco, chi ha sferrato il colpo da KO fa la stessa fine. Se usata in successione fallisce."
		desc: "Fino alla prossima azione di chi la usa, se un attacco avversario lo manda KO, anche quell'avversario va KO, a meno che l'attacco non sia Obbliderio o Divinazione. Fallisce se chi la usa l'ha già usata con successo nell'azione precedente, senza contare le mosse usate tramite l'abilità Sincrodanza.", // NEEDS QC
		shortDesc: "Se un nemico lo manda KO, va KO anche lui.", // NEEDS QC
		gen6: {
			desc: "Fino al prossimo turno di chi la usa, se l'attacco di un avversario lo manda KO, anche quell'avversario va KO, a meno che l'attacco non fosse Obbliderio o Divinazione.", // NEEDS QC
		},
		gen2: {
			desc: "Fino al prossimo turno di chi la usa, se l'attacco di un avversario lo manda KO, anche quell'avversario va KO.", // NEEDS QC
		},

		start: "  {POKEMON} tenta di far subire a chi lo manda KO la sua stessa sorte!",
		activate: "{POKEMON} trascina con sé il Pokémon che lo ha attaccato!",
	},
	detect: {
		name: "Individua",
		// Official flavor text: "Permette di eludere tutti gli attacchi. Se usata in successione può fallire."
		desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Protegge chi la usa dalle mosse in questo turno.", // NEEDS QC
		gen8: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e raddoppia a ogni uso riuscito. X torna a 1 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza, Protezione, Anticipo o Bodyguard. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e raddoppia a ogni uso riuscito, fino a un massimo di 8. X torna a 1 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza o Protezione. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha X probabilità su 65536 di riuscire, dove X parte da 65535 e si dimezza, arrotondato per difetto, a ogni uso riuscito. Dopo il quarto successo di fila, X scende a 118 e assume poi valori apparentemente casuali tra 0 e 65535. X torna a 65535 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza o Protezione. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa è protetto dagli attacchi dell'avversario in questo turno. Questa mossa ha X probabilità su 255 di riuscire, dove X parte da 255 e si dimezza, arrotondato per difetto, a ogni uso riuscito. X torna a 255 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza o Protezione. Fallisce se chi la usa ha un sostituto o agisce per ultimo in questo turno.", // NEEDS QC
		},
	},
	devastatingdrake: {
		name: "Dragoschianto Finale",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	diamondstorm: {
		name: "Diamantempesta",
		// Official flavor text: "Colpisce i nemici che ha intorno con una tempesta di diamanti. Può anche aumentare di molto la Difesa di chi la usa."
		desc: "Ha il 50% di probabilità di aumentare la Difesa di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "50% di aumentare la Difesa di chi la usa di 2.", // NEEDS QC
		gen6: {
			desc: "Ha il 50% di probabilità di aumentare la Difesa di chi la usa di un livello per ogni colpo.", // NEEDS QC
			shortDesc: "50% di aumentare la Dif. di 1 a ogni colpo.", // NEEDS QC
		},
	},
	dig: {
		name: "Fossa",
		// Official flavor text: "Chi la usa scava al primo turno e attacca al successivo."
		desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Terremoto e Magnitudo, dai quali subisce il doppio dei danni, e non è influenzato dal tempo atmosferico. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Scava al turno 1, colpisce al turno 2.", // NEEDS QC
		gen4: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Terremoto e Magnitudo, che hanno la potenza raddoppiata contro di lui, e non è influenzato dal tempo atmosferico. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		},
		gen3: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Terremoto e Magnitudo, che hanno la potenza raddoppiata contro di lui, e non è influenzato dal tempo atmosferico.", // NEEDS QC
		},
		gen2: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Terremoto, Abisso e Magnitudo, non è influenzato dal tempo atmosferico, e Terremoto e Magnitudo hanno la potenza raddoppiata contro di lui.", // NEEDS QC
		},
		gen1: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Pazienza, Comete e Trasformazione. Se chi la usa è completamente paralizzato nel secondo turno, continua a evitare gli attacchi finché non viene sostituito o esegue con successo il secondo turno di questa mossa o di Volo.", // NEEDS QC
		},

		prepare: "{POKEMON} si nasconde sottoterra!",
	},
	direclaw: {
		name: "Artigli Fatali",
		desc: "Ha il 50% di probabilità di addormentare, avvelenare o paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "50% di sonno, veleno o paralisi.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	disable: {
		name: "Inibitore",
		// Official flavor text: "Per quattro turni impedisce al bersaglio di riutilizzare l’ultima mossa usata."
		desc: "Per 4 turni, l'ultima mossa usata dal bersaglio viene disabilitata. Fallisce se una mossa del bersaglio è già disabilitata, se il bersaglio non ha ancora agito, se non conosce più quella mossa o se era una mossa Dynamax o Gigamax.", // NEEDS QC
		shortDesc: "Disabilita per 4 turni l'ultima mossa del bersaglio.", // NEEDS QC
		gen7: {
			desc: "Per 4 turni, l'ultima mossa usata dal bersaglio viene bloccata. Fallisce se una mossa del bersaglio è già bloccata, se il bersaglio non ha ancora agito, se non conosce più la mossa, o se la mossa era una mossa Z. Le mosse potenziate dalla Forza Z possono comunque essere scelte ed eseguite durante l'effetto.", // NEEDS QC
		},
		gen6: {
			desc: "Per 4 turni, l'ultima mossa usata dal bersaglio viene bloccata. Fallisce se una mossa del bersaglio è già bloccata, se il bersaglio non ha ancora agito, o se non conosce più la mossa.", // NEEDS QC
		},
		gen4: {
			desc: "Per 4-7 turni, l'ultima mossa usata dal bersaglio viene bloccata. Fallisce se una mossa del bersaglio è già bloccata, se il bersaglio non ha ancora agito, se non conosce più la mossa, o se la mossa ha 0 PP.", // NEEDS QC
			shortDesc: "Blocca l'ultima mossa del bersaglio per 4-7 turni.", // NEEDS QC
		},
		gen3: {
			desc: "Per 2-5 turni, l'ultima mossa usata dal bersaglio viene bloccata. Fallisce se una mossa del bersaglio è già bloccata, se il bersaglio non ha ancora agito, se non conosce più la mossa, o se la mossa ha 0 PP.", // NEEDS QC
			shortDesc: "Blocca l'ultima mossa del bersaglio per 2-5 turni.", // NEEDS QC
		},
		gen2: {
			desc: "Per 1-7 turni, l'ultima mossa usata dal bersaglio viene bloccata. Fallisce se una mossa del bersaglio è già bloccata, se il bersaglio non ha ancora agito, se non conosce più la mossa, o se la mossa ha 0 PP.", // NEEDS QC
			shortDesc: "Blocca l'ultima mossa del bersaglio per 1-7 turni.", // NEEDS QC
		},
		gen1: {
			desc: "Per 0-7 turni, una delle mosse del bersaglio con almeno 1 PP viene bloccata, a caso. Fallisce se una mossa del bersaglio è già bloccata, o se nessuna delle sue mosse ha PP rimanenti. Se un Pokémon usa Nube, l'effetto finisce. Che questa mossa riesca o meno, conta come un colpo ai fini di Ira dell'avversario.", // NEEDS QC
			shortDesc: "Blocca una mossa del bersaglio per 0-7 turni.", // NEEDS QC
		},

		start: "  La mossa {MOVE} di {POKEMON} è stata bloccata!",
		end: "  La mossa di {POKEMON} non è più bloccata!",
		cant: "La mossa {MOVE} di {POKEMON} è bloccata!",
	},
	disarmingvoice: {
		name: "Incantavoce",
		// Official flavor text: "Chi la usa infligge un danno spirituale ai nemici nei paraggi con una voce suadente. L’attacco andrà immancabilmente a segno."
		desc: "Questa mossa non verifica la precisione.", // NEEDS QC
		shortDesc: "Non verifica la precisione. Colpisce i nemici.", // NEEDS QC
	},
	discharge: {
		name: "Scarica",
		// Official flavor text: "Chi la usa colpisce i Pokémon che ha intorno con un bagliore elettrico. Può anche paralizzarli."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "30% di paralizzare i Pokémon adiacenti.", // NEEDS QC
	},
	dive: {
		name: "Sub",
		// Official flavor text: "Chi la usa si tuffa in acqua per emergere e attaccare al turno successivo."
		desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Surf e Mulinello, dai quali subisce il doppio dei danni, e non è influenzato dal tempo atmosferico. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Si immerge al turno 1, colpisce al turno 2.", // NEEDS QC
		gen4: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Surf e Mulinello, che hanno la potenza raddoppiata contro di lui, e non è influenzato dal tempo atmosferico. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		},
		gen3: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Surf e Mulinello, che hanno la potenza raddoppiata contro di lui, e non è influenzato dal tempo atmosferico.", // NEEDS QC
		},

		prepare: "{POKEMON} sparisce sott’acqua!",
	},
	dizzypunch: {
		name: "Stordipugno",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 20% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "20% di confondere il bersaglio.", // NEEDS QC
		gen1: {
			desc: "Nessun effetto aggiuntivo.", // NEEDS QC
			shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		},
	},
	doodle: {
		name: "Ricalco",
		desc: "L'abilità di chi la usa e quella del suo alleato diventano quella del bersaglio. Non cambia l'abilità di chi la usa o dell'alleato se è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teramorfosi, Stato Zen o Supercambio, o se è già uguale a quella del bersaglio. Fallisce se le abilità di chi la usa e dell'alleato sono già uguali a quella del bersaglio, o se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Torre di Comando, Fantasmanto, Albergamemorie, Regalfiore, Previsioni, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Malia Tossica, Sciamefusione, Forza Chimica, Paleoattivazione, Carica Quark, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teraguscio, Teramorfosi, Zeroformazione, Traccia, Magidifesa, Stato Zen o Supercambio.", // NEEDS QC
		shortDesc: "Chi la usa e l'alleato copiano l'abilità del bersaglio.", // NEEDS QC
	},
	doomdesire: {
		name: "Obbliderio",
		// Official flavor text: "Intenso fascio di luce che colpisce il bersaglio dopo due turni dall’uso della mossa."
		desc: "Infligge danni due turni dopo l'uso. Alla fine di quel turno, i danni vengono calcolati in quel momento e inflitti al Pokémon nella posizione che il bersaglio aveva quando la mossa è stata usata. Se chi la usa non è più in campo, i danni vengono calcolati in base al suo Attacco Speciale naturale, ai suoi tipi e al suo livello, senza bonus da strumento o abilità. Fallisce se questa mossa o Divinazione è già in effetto per la posizione del bersaglio.", // NEEDS QC
		shortDesc: "Colpisce due turni dopo l'uso.", // NEEDS QC
		gen4: {
			desc: "Infligge due turni dopo l'uso danni senza tipo che non possono essere un brutto colpo. I danni vengono calcolati contro il bersaglio al momento dell'uso e inflitti alla fine dell'ultimo turno al Pokémon nella posizione originale del bersaglio. Fallisce se questa mossa o Divinazione è già in corso per la posizione del bersaglio.", // NEEDS QC
		},

		start: "  {POKEMON} ipoteca il futuro con Desiderio Fatale!",
		activate: "  {TARGET} subisce Desiderio Fatale!",
	},
	doubleedge: {
		name: "Sdoppiatore",
		// Official flavor text: "Carica spietata e pericolosa che danneggia molto anche chi la usa."
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari al 33% dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo del 33% dei danni.", // NEEDS QC
		gen4: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/3 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
			shortDesc: "Ha 1/3 di contraccolpo.", // NEEDS QC
		},
		gen2: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS. Se questa mossa colpisce un sostituto, i danni da contraccolpo sono sempre 1 PS.", // NEEDS QC
			shortDesc: "Contraccolpo di 1/4 dei danni.", // NEEDS QC
		},
		gen1: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS. Se questa mossa rompe il sostituto del bersaglio, chi la usa non subisce contraccolpo.", // NEEDS QC
		},
	},
	doublehit: {
		name: "Doppiosmash",
		// Official flavor text: "Chi la usa colpisce il bersaglio due volte di fila con la coda, una liana o simili."
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		shortDesc: "Colpisce 2 volte in un turno.", // NEEDS QC
		gen4: {
			desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
	},
	doubleironbash: {
		name: "Pugni Corazzati",
		// Official flavor text: "Chi la usa attacca il bersaglio due volte ruotando su se stesso e colpendolo con le braccia. Può anche farlo tentennare."
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo. Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "Colpisce 2 volte. 30% di far tentennare.", // NEEDS QC
	},
	doublekick: {
		name: "Doppiocalcio",
		// Official flavor text: "Colpisce il bersaglio due volte con una raffica di calci inferti con entrambi i piedi."
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		shortDesc: "Colpisce 2 volte in un turno.", // NEEDS QC
		gen4: {
			desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce due volte. I danni sono calcolati una sola volta per il primo colpo e ripetuti per entrambi. Se il primo colpo rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	doubleshock: {
		name: "Doppiolampo",
		desc: "Fallisce se chi la usa non è di tipo Elettro. Se questa mossa va a segno e chi la usa non è teracristallizzato, perde il tipo Elettro finché resta in campo.", // NEEDS QC
		shortDesc: "Chi la usa perde il tipo Elettro; deve essere Elettro.", // NEEDS QC

		typeChange: "  {POKEMON} ha usato tutta la sua elettricità!",
	},
	doubleslap: {
		name: "Doppiasberla",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. I danni sono calcolati una sola volta per il primo colpo e ripetuti per ogni colpo. Se uno dei colpi rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	doubleteam: {
		name: "Doppioteam",
		// Official flavor text: "Chi la usa si muove in fretta e crea copie illusorie di se stesso che aumentano la capacità di elusione."
		desc: "Aumenta l'elusione di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta l'elusione di chi la usa di 1.", // NEEDS QC
	},
	dracometeor: {
		name: "Dragobolide",
		// Official flavor text: "Attacca con meteore che cadono dal cielo. Il contraccolpo fa calare di molto l’Attacco Speciale di chi la usa."
		desc: "Riduce l'Attacco Speciale di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce l'Att. Sp. di chi la usa di 2.", // NEEDS QC
	},
	dragonascent: {
		name: "Ascesa del Drago",
		// Official flavor text: "Permette di proiettarsi in aria e fiondarsi sul bersaglio attaccando ad altissima velocità. Riduce la Difesa e la Difesa Speciale di chi la usa."
		desc: "Riduce la Difesa e la Difesa Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Riduce la Difesa e la Dif. Sp. di chi la usa di 1.", // NEEDS QC

		megaNoItem: "  L’accorata preghiera di {TRAINER} giunge {POKEMON:a}!",
	},
	dragonbreath: {
		name: "Dragospiro",
		// Official flavor text: "Investe il bersaglio con una raffica potentissima che arreca danni. Può anche paralizzarlo."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "30% di paralizzare il bersaglio.", // NEEDS QC
	},
	dragoncheer: {
		name: "Grido del Drago",
		desc: "Aumenta il tasso di brutto colpo del bersaglio di un livello, o di 2 se il bersaglio è di tipo Drago. Fallisce se nessun alleato è adiacente a chi la usa o se il bersaglio ha già questo effetto o quello di Focalenergia. Staffetta può trasferire questo effetto a un alleato.", // NEEDS QC
		shortDesc: "Alleato: brutto colpo +1, o +2 se è di tipo Drago.", // NEEDS QC

		start: "#focusenergy",
	},
	dragonclaw: {
		name: "Dragartigli",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	dragondance: {
		name: "Dragodanza",
		// Official flavor text: "Danza mistica e vigorosa che aumenta l’Attacco e la Velocità di chi la usa."
		desc: "Aumenta l'Attacco e la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta l'Attacco e la Velocità di chi la usa di 1.", // NEEDS QC
	},
	dragondarts: {
		name: "Dragofrecce",
		// Official flavor text: "Chi la usa attacca due volte sparando Dreepy. Quando sono presenti due bersagli, vengono colpiti entrambi una sola volta."
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo. Nelle Lotte in Doppio, questa mossa prova a colpire una volta il bersaglio e una volta il suo alleato. Se uno dei due non può essere colpito per immunità, protezione, seminvulnerabilità, abilità o precisione, prova a colpire l'altro due volte. Se questa mossa viene reindirizzata, colpisce quel bersaglio due volte.", // NEEDS QC
		shortDesc: "Colpisce 2 volte. In doppio: una volta per nemico.", // NEEDS QC
	},
	dragonenergy: {
		name: "Dragoenergia",
		// Official flavor text: "Il Pokémon attacca i nemici convertendo la propria forza vitale in energia. La potenza della mossa cala man mano che i PS diminuiscono."
		desc: "La potenza è pari a (PS attuali di chi la usa × 150 / PS max di chi la usa), arrotondato per difetto, ma non meno di 1.", // NEEDS QC
		shortDesc: "Meno PS = meno potente. Colpisce i nemici.", // NEEDS QC
	},
	dragonhammer: {
		name: "Marteldrago",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	dragonpulse: {
		name: "Dragopulsar",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	dragonrage: {
		name: "Ira di Drago",
		shortDesc: "Infligge 40 PS di danni al bersaglio.", // NEEDS QC
	},
	dragonrush: {
		name: "Dragofuria",
		// Official flavor text: "Chi la usa attacca con fare minaccioso e in questo modo può anche far tentennare il bersaglio."
		desc: "Ha il 20% di probabilità di far tentennare il bersaglio. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		shortDesc: "20% di far tentennare il bersaglio.", // NEEDS QC
		gen5: {
			desc: "Ha il 20% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		},
	},
	dragontail: {
		name: "Codadrago",
		// Official flavor text: "Chi la usa fa volar via il bersaglio in modo che venga sostituito. Se il bersaglio è un singolo Pokémon selvatico, la lotta finisce."
		desc: "Se né chi la usa né il bersaglio sono KO, il bersaglio è costretto a lasciare il campo e viene sostituito da un alleato non KO scelto a caso. Questo effetto fallisce se il bersaglio ha usato Radicamento, ha l'abilità Ventose o se questa mossa ha colpito un sostituto.", // NEEDS QC
		shortDesc: "Il bersaglio viene sostituito da un alleato a caso.", // NEEDS QC
	},
	drainingkiss: {
		name: "Assorbibacio",
		// Official flavor text: "Chi la usa assorbe energia dal bersaglio con un bacio, recuperando così PS in quantità pari a più della metà del danno inferto."
		desc: "Chi la usa recupera 3/4 dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera 3/4 dei danni inflitti.", // NEEDS QC
	},
	drainpunch: {
		name: "Assorbipugno",
		// Official flavor text: "Pugno che assorbe energia. Fa recuperare una quantità di PS pari alla metà del danno inferto."
		desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei danni inflitti.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto.", // NEEDS QC
		},
	},
	dreameater: {
		name: "Mangiasogni",
		// Official flavor text: "Attacco che funziona solo su un bersaglio che dorme. Chi lo usa riceve metà dei PS persi dal Pokémon colpito."
		desc: "Il bersaglio non è influenzato da questa mossa se non dorme. Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Recupera metà dei danni. Solo bersagli addormentati.", // NEEDS QC
		gen4: {
			desc: "Ha effetto solo se il bersaglio dorme e non ha un sostituto. Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto.", // NEEDS QC
		},
		gen3: {
			desc: "Ha effetto solo se il bersaglio dorme e non ha un sostituto. Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		},
		gen1: {
			desc: "Ha effetto solo se il bersaglio dorme. Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS. Se questa mossa rompe il sostituto del bersaglio, chi la usa non recupera PS.", // NEEDS QC
		},
	},
	drillpeck: {
		name: "Perforbecco",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	drillrun: {
		name: "Giravvita",
		// Official flavor text: "Chi la usa si scaglia sul bersaglio ruotando su se stesso come un trapano perforante. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	drumbeating: {
		name: "Tamburattacco",
		// Official flavor text: "Chi la usa percuote il proprio tamburo per controllarne le radici e attaccare il bersaglio, riducendone la Velocità."
		desc: "Ha il 100% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
	},
	dualchop: {
		name: "Doppiocolpo",
		// Official flavor text: "Chi la usa attacca due volte il bersaglio con dei colpi estremamente forti."
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		shortDesc: "Colpisce 2 volte in un turno.", // NEEDS QC
	},
	dualwingbeat: {
		name: "Doppia Ala",
		// Official flavor text: "Chi la usa colpisce il bersaglio due volte di fila urtandolo con le ali."
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		shortDesc: "Colpisce 2 volte in un turno.", // NEEDS QC
	},
	dynamaxcannon: {
		name: "Cannone Dynamax",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		gen8: {
			shortDesc: "Danni doppi contro i bersagli dynamaxizzati.", // NEEDS QC
		},
	},
	dynamicpunch: {
		name: "Dinamipugno",
		// Official flavor text: "Colpisce il bersaglio con un pugno davvero forte. Se va a segno, lo confonde."
		desc: "Ha il 100% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "100% di confondere il bersaglio.", // NEEDS QC
	},
	earthpower: {
		name: "Geoforza",
		// Official flavor text: "Dal terreno sotto il bersaglio si sprigiona una forza devastante. Può anche ridurne la Difesa Speciale."
		desc: "Ha il 10% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
	},
	earthquake: {
		name: "Terremoto",
		// Official flavor text: "Chi la usa provoca un potente sisma che colpisce i Pokémon che ha intorno."
		desc: "I danni raddoppiano se il bersaglio sta usando Fossa.", // NEEDS QC
		shortDesc: "Colpisce gli adiacenti. Danni x2 su Fossa.", // NEEDS QC
		gen4: {
			desc: "La potenza raddoppia se il bersaglio sta usando Fossa.", // NEEDS QC
			shortDesc: "Colpisce i Pokémon adiacenti. 2x contro Fossa.", // NEEDS QC
		},
		gen1: {
			desc: "Nessun effetto aggiuntivo.", // NEEDS QC
			shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Potenza doppia contro Fossa.", // NEEDS QC
		},
	},
	echoedvoice: {
		name: "Echeggiavoce",
		// Official flavor text: "Attacca il bersaglio con la propria voce echeggiante. Se usata a ripetizione da uno o più Pokémon il danno aumenta."
		desc: "Per ogni turno consecutivo in cui questa mossa viene usata da almeno un Pokémon, la sua potenza è moltiplicata per il numero di turni trascorsi, fino a un massimo di 5.", // NEEDS QC
		shortDesc: "Più potente se usata in turni consecutivi.", // NEEDS QC
	},
	eerieimpulse: {
		name: "Elettromistero",
		// Official flavor text: "Il corpo di chi la usa emette onde anomale che investono il bersaglio, riducendone di molto l’Attacco Speciale."
		desc: "Riduce l'Attacco Speciale del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce l'Att. Sp. del bersaglio di 2.", // NEEDS QC
	},
	eeriespell: {
		name: "Inquietantesimo",
		// Official flavor text: "Il Pokémon attacca con i suoi potenti poteri psichici. Sottrae tre PP all’ultima mossa usata dal nemico."
		desc: "Se questa mossa va a segno e chi la usa non è KO, il bersaglio perde 3 PP dalla sua ultima mossa usata.", // NEEDS QC
		shortDesc: "Toglie 3 PP all'ultima mossa del bersaglio.", // NEEDS QC

		activate: "#spite",
	},
	eggbomb: {
		name: "Uovobomba",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	electricterrain: {
		name: "Campo Elettrico",
		// Official flavor text: "Per cinque turni il terreno entra nello stato di Campo Elettrico: i Pokémon a terra non si addormentano e la potenza delle mosse di tipo Elettro aumenta."
		desc: "Per 5 turni, il terreno diventa un Campo Elettrico. Durante l'effetto, la potenza degli attacchi di tipo Elettro dei Pokémon a terra è moltiplicata per 1,3 e i Pokémon a terra non possono addormentarsi; quelli già addormentati non si svegliano. I Pokémon a terra non possono essere colpiti da Sbadiglio né addormentarsi per il suo effetto. Camuffamento trasforma chi la usa in tipo Elettro, Naturforza diventa Fulmine e Forzasegreta ha il 30% di probabilità di paralizzare. Fallisce se il terreno attuale è già un Campo Elettrico.", // NEEDS QC
		shortDesc: "5 turni: Elettro potenziato, niente sonno a terra.", // NEEDS QC
		gen7: {
			desc: "Per 5 turni, è attivo un Campo Elettrico. Durante l'effetto, la potenza degli attacchi di tipo Elettro dei Pokémon a terra è moltiplicata per 1,5, e i Pokémon a terra non possono addormentarsi; quelli già addormentati non si svegliano. I Pokémon a terra non possono essere colpiti da Sbadiglio né addormentarsi per il suo effetto. Camuffamento trasforma chi la usa in tipo Elettro, Naturforza diventa Fulmine, e Forzasegreta ha il 30% di probabilità di paralizzare. Fallisce se un Campo Elettrico è già attivo.", // NEEDS QC
		},
	},
	electrify: {
		name: "Elettrocontagio",
		// Official flavor text: "Se si contagia il bersaglio prima che usi la sua mossa, per quel turno questa sarà di tipo Elettro."
		desc: "La mossa del bersaglio diventa di tipo Elettro in questo turno. Tra gli effetti che possono cambiare il tipo di una mossa, questo si applica per ultimo. Fallisce se il bersaglio ha già agito in questo turno.", // NEEDS QC
		shortDesc: "La mossa del bersaglio diventa Elettro nel turno.", // NEEDS QC

		start: "  La prossima mossa di {POKEMON} diventa di tipo Elettro a causa di Elettrocontagio!",
	},
	electroball: {
		name: "Energisfera",
		// Official flavor text: "Chi la usa attacca con una sfera d’energia elettrica. Più è rapido rispetto al bersaglio, più danni arreca."
		desc: "La potenza dipende da (Velocità attuale di chi la usa / Velocità attuale del bersaglio), arrotondato per difetto. La potenza è 150 se il risultato è 4 o più, 120 se è 3, 80 se è 2, 60 se è 1, 40 se è meno di 1. Se la Velocità attuale del bersaglio è 0, la potenza è 40.", // NEEDS QC
		shortDesc: "Più potente se più veloce del bersaglio.", // NEEDS QC
		gen5: {
			desc: "La potenza dipende da (Velocità attuale di chi la usa ÷ Velocità attuale del bersaglio), arrotondato per difetto. È pari a 150 se il risultato è 4 o più, 120 se 3, 80 se 2, 60 se 1, 40 se meno di 1. Se la Velocità attuale del bersaglio è 0, viene trattata come 1.", // NEEDS QC
		},
	},
	electrodrift: {
		name: "Fulmiscatto",
		desc: "I danni sono moltiplicati per 1,3333 se questa mossa è superefficace contro il bersaglio.", // NEEDS QC
		shortDesc: "Danni x1,3333 se superefficace.", // NEEDS QC
	},
	electroshot: {
		name: "Elettroraggio",
		desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Aumenta l'Attacco Speciale di chi la usa di un livello nel primo turno. Se chi la usa ha una Vigorerba o il tempo è Acquazzone o Pioggia, la mossa si completa in un turno. Se chi la usa ha un Superombrello e il tempo è Acquazzone o Pioggia, la mossa richiede comunque un turno di carica.", // NEEDS QC
		shortDesc: "+1 Att. Sp., colpisce al turno 2. Subito con pioggia.", // NEEDS QC

		prepare: "{POKEMON} assorbe elettricità!",
	},
	electroweb: {
		name: "Elettrotela",
		// Official flavor text: "Chi la usa attacca i nemici intorno a sé catturandoli con una ragnatela elettrica e riducendone la Velocità."
		desc: "Ha il 100% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Velocità dei nemici di 1.", // NEEDS QC
	},
	embargo: {
		name: "Divieto",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Per 5 turni, lo strumento del bersaglio non ha effetto. I cambi di forma causati da uno strumento non sono influenzati, ma tutti gli altri effetti di tali strumenti vengono annullati. Durante l'effetto, il bersaglio non può usare Lancio né Dononaturale. Gli strumenti lanciati contro di lui con Lancio si attivano comunque. Se il bersaglio usa Staffetta, il sostituto resta incapace di usare strumenti.", // NEEDS QC
		shortDesc: "5 turni: lo strumento del bersaglio non ha effetto.", // NEEDS QC

		start: "  {POKEMON} non può usare strumenti!",
		end: "  {POKEMON} può di nuovo usare strumenti!",
	},
	ember: {
		name: "Braciere",
		// Official flavor text: "Il bersaglio viene colpito da fiammelle che possono anche scottarlo."
		desc: "Ha il 10% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "10% di scottare il bersaglio.", // NEEDS QC
	},
	encore: {
		name: "Ripeti",
		// Official flavor text: "Chi la usa obbliga il bersaglio a ripetere per tre turni l’ultima mossa eseguita."
		desc: "Per i suoi prossimi 3 turni, il bersaglio è costretto a ripetere la sua ultima mossa usata. Se quella mossa esaurisce i PP, l'effetto finisce. Fallisce se il bersaglio è già sotto questo effetto, se non ha ancora agito, se la mossa ha 0 PP o se è Assistente, Turboustione, Turborissa, Copione, Cannone Dynamax, Ripeti, Turboincanto, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Turbotossina, Schizzo, Sonnolalia, Scontro, Trasformazione o Turbotenebra.", // NEEDS QC
		shortDesc: "Il bersaglio ripete l'ultima mossa per 3 turni.", // NEEDS QC
		gen8: {
			desc: "Per i suoi prossimi 3 turni, il bersaglio è costretto a ripetere l'ultima mossa usata. Se la mossa finisce i PP, l'effetto termina. Fallisce se il bersaglio è già sotto questo effetto, se non ha ancora agito, se la mossa ha 0 PP, se il bersaglio è dynamaxizzato, o se la mossa è Assistente, Copione, Cannone Dynamax, Ripeti, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Schizzo, Sonnolalia, Scontro o Trasformazione.", // NEEDS QC
		},
		gen7: {
			desc: "Per i suoi prossimi 3 turni, il bersaglio è costretto a ripetere l'ultima mossa usata. Se la mossa finisce i PP, l'effetto termina. Fallisce se il bersaglio è già sotto questo effetto, se non ha ancora agito, se la mossa ha 0 PP, o se la mossa è Assistente, Copione, Ripeti, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Schizzo, Sonnolalia, Scontro o Trasformazione o una mossa Z. Le mosse potenziate dalla Forza Z possono comunque essere scelte ed eseguite durante l'effetto.", // NEEDS QC
		},
		gen6: {
			desc: "Per 3 turni, il bersaglio è costretto a ripetere l'ultima mossa usata. Se la mossa finisce i PP, l'effetto termina. Fallisce se il bersaglio è già sotto questo effetto, se non ha ancora agito, se la mossa ha 0 PP, o se la mossa è Ripeti, Mimica, Speculmossa, Schizzo, Scontro o Trasformazione.", // NEEDS QC
		},
		gen4: {
			desc: "Per 4-8 turni, il bersaglio è costretto a ripetere l'ultima mossa usata. Se la mossa finisce i PP, l'effetto termina. Fallisce se il bersaglio è già sotto questo effetto, se non ha ancora agito, se la mossa ha 0 PP, o se la mossa è Ripeti, Mimica, Speculmossa, Schizzo, Scontro o Trasformazione.", // NEEDS QC
			shortDesc: "Il bersaglio ripete l'ultima mossa per 4-8 turni.", // NEEDS QC
		},
		gen3: {
			desc: "Per 3-6 turni, il bersaglio è costretto a ripetere l'ultima mossa usata. Se la mossa finisce i PP, l'effetto termina. Fallisce se il bersaglio è già sotto questo effetto, se non ha ancora agito, se la mossa ha 0 PP, o se la mossa è Ripeti, Mimica, Speculmossa, Schizzo, Scontro o Trasformazione.", // NEEDS QC
			shortDesc: "Il bersaglio ripete l'ultima mossa per 3-6 turni.", // NEEDS QC
		},
		gen2: {
			desc: "Per 3-6 turni, il bersaglio è costretto a ripetere l'ultima mossa usata. Se la mossa finisce i PP, l'effetto termina. Fallisce se il bersaglio è già sotto questo effetto, se non ha ancora agito, se la mossa ha 0 PP, o se la mossa è Ripeti, Metronomo, Mimica, Speculmossa, Schizzo, Sonnolalia, Scontro o Trasformazione.", // NEEDS QC
		},

		start: "  {POKEMON} è colpito da Ripeti!",
		end: "  L’effetto di Ripeti su {POKEMON} è terminato!",
	},
	endeavor: {
		name: "Rimonta",
		// Official flavor text: "Attacco che riduce i PS del bersaglio a una quantità pari ai PS di chi lo usa."
		desc: "Infligge al bersaglio danni pari a (PS attuali del bersaglio - PS attuali di chi la usa). Il bersaglio non è influenzato se i suoi PS attuali sono uguali o inferiori a quelli di chi la usa.", // NEEDS QC
		shortDesc: "Riduce i PS del bersaglio a quelli di chi la usa.", // NEEDS QC
	},
	endure: {
		name: "Resistenza",
		// Official flavor text: "Chi la usa resta con un PS anche se subisce un colpo da KO in quel turno. Usata in successione può fallire."
		desc: "Chi la usa resiste agli attacchi degli altri Pokémon in questo turno con almeno 1 PS. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Resiste agli attacchi del turno con almeno 1 PS.", // NEEDS QC
		gen8: {
			desc: "Chi la usa sopravvive agli attacchi degli altri Pokémon in questo turno con almeno 1 PS. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa sopravvive agli attacchi degli altri Pokémon in questo turno con almeno 1 PS. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa sopravvive agli attacchi degli altri Pokémon in questo turno con almeno 1 PS. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa sopravvive agli attacchi degli altri Pokémon in questo turno con almeno 1 PS. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e raddoppia a ogni uso riuscito. X torna a 1 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza, Protezione, Anticipo o Bodyguard. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa sopravvive agli attacchi degli altri Pokémon in questo turno con almeno 1 PS. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e raddoppia a ogni uso riuscito, fino a un massimo di 8. X torna a 1 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza o Protezione. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa sopravvive agli attacchi degli altri Pokémon in questo turno con almeno 1 PS. Questa mossa ha X probabilità su 65536 di riuscire, dove X parte da 65535 e si dimezza, arrotondato per difetto, a ogni uso riuscito. Dopo il quarto successo di fila, X scende a 118 e assume poi valori apparentemente casuali tra 0 e 65535. X torna a 65535 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza o Protezione. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa sopravvive agli attacchi dell'avversario in questo turno con almeno 1 PS. Questa mossa ha X probabilità su 255 di riuscire, dove X parte da 255 e si dimezza, arrotondato per difetto, a ogni uso riuscito. X torna a 255 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza o Protezione. Fallisce se chi la usa ha un sostituto o agisce per ultimo in questo turno.", // NEEDS QC
		},

		start: "  {POKEMON} si prepara a ricevere il colpo!",
		activate: "  {POKEMON} sopporta il colpo!",
	},
	energyball: {
		name: "Energipalla",
		// Official flavor text: "Chi la usa attinge energia dalla natura e la scaglia contro il bersaglio. Può anche ridurne la Difesa Speciale."
		desc: "Ha il 10% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
	},
	entrainment: {
		name: "Saltamicizia",
		// Official flavor text: "Chi la usa saltella con un buffo ritmo, inducendo il bersaglio a imitarlo e rendendo la sua abilità identica alla propria."
		desc: "L'abilità del bersaglio diventa la stessa di chi la usa. Fallisce se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teramorfosi, Pigrone, Stato Zen o Supercambio o la stessa di chi la usa, o se l'abilità di chi la usa è Sintonia Equina, Morfosintonia, Sonno Assoluto, Torre di Comando, Fantasmanto, Albergamemorie, Regalfiore, Previsioni, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Malia Tossica, Sciamefusione, Forza Chimica, Paleoattivazione, Carica Quark, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teraguscio, Teramorfosi, Zeroformazione, Traccia, Magidifesa, Stato Zen o Supercambio.", // NEEDS QC
		shortDesc: "L'abilità del bersaglio diventa quella di chi la usa.", // NEEDS QC
		gen8: {
			desc: "L'abilità del bersaglio diventa la stessa di chi la usa. Fallisce se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Pigrone o Stato Zen o la stessa di chi la usa, o se l'abilità di chi la usa è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Inghiottimissile, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia o Stato Zen.", // NEEDS QC
		},
		gen7: {
			desc: "L'abilità del bersaglio diventa la stessa di chi la usa. Fallisce se l'abilità del bersaglio è Morfosintonia, Sonno Assoluto, Fantasmanto, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Pigrone o Stato Zen o la stessa di chi la usa, o se l'abilità di chi la usa è Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia o Stato Zen.", // NEEDS QC
		},
		gen6: {
			desc: "L'abilità del bersaglio diventa la stessa di chi la usa. Fallisce se l'abilità del bersaglio è Multitipo, Accendilotta o Pigrone o la stessa di chi la usa, o se l'abilità di chi la usa è Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Accendilotta, Traccia o Stato Zen.", // NEEDS QC
		},
		gen5: {
			desc: "L'abilità del bersaglio diventa la stessa di chi la usa. Fallisce se l'abilità del bersaglio è Multitipo o Pigrone o la stessa di chi la usa, o se l'abilità di chi la usa è Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Traccia o Stato Zen.", // NEEDS QC
		},
	},
	eruption: {
		name: "Eruzione",
		// Official flavor text: "Attacco impetuoso ed esplosivo la cui potenza è proporzionale ai PS di chi lo usa."
		desc: "La potenza è pari a (PS attuali di chi la usa × 150 / PS max di chi la usa), arrotondato per difetto, ma non meno di 1.", // NEEDS QC
		shortDesc: "Meno PS = meno potente. Colpisce i nemici.", // NEEDS QC
	},
	esperwing: {
		name: "Ali d’Aura",
		desc: "Ha il 100% di probabilità di aumentare la Velocità di chi la usa di un livello e una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "100% di +1 Velocità. Alta prob. di brutto colpo.", // NEEDS QC
	},
	eternabeam: {
		name: "Raggio Infinito",
		// Official flavor text: "È l’attacco più potente di Eternatus quando assume la sua forma originale. Nel turno successivo non può agire."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
	},
	expandingforce: {
		name: "Vastenergia",
		// Official flavor text: "Chi la usa attacca il bersaglio con energia psichica. Se utilizzata quando è attivo un Campo Psichico, la mossa aumenta di potenza e danneggia tutti i nemici."
		desc: "Se il terreno attuale è un Campo Psichico e chi la usa è a terra, questa mossa colpisce tutti gli avversari e la sua potenza è moltiplicata per 1,5.", // NEEDS QC
		shortDesc: "Su Campo Psichico: x1,5 e colpisce i nemici.", // NEEDS QC
	},
	explosion: {
		name: "Esplosione",
		// Official flavor text: "Chi la usa esplode per infliggere danni agli altri Pokémon attorno, ma va KO."
		desc: "Chi la usa va KO dopo averla usata, anche se fallisce per mancanza di bersagli. Questa mossa non può essere eseguita se un Pokémon in campo ha l'abilità Umidità.", // NEEDS QC
		shortDesc: "Colpisce gli adiacenti. Chi la usa va KO.", // NEEDS QC
		gen4: {
			desc: "Chi la usa va KO dopo aver usato questa mossa, a meno che non abbia bersagli. La Difesa del bersaglio è dimezzata durante il calcolo dei danni. Questa mossa non viene eseguita se un Pokémon con l'abilità Umidità è in campo.", // NEEDS QC
			shortDesc: "Dif. nemica dimezzata nel calcolo. Chi la usa va KO.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa va KO dopo aver usato questa mossa. La Difesa del bersaglio è dimezzata durante il calcolo dei danni. Questa mossa non viene eseguita se un Pokémon con l'abilità Umidità è in campo.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa va KO dopo aver usato questa mossa. La Difesa del bersaglio è dimezzata durante il calcolo dei danni.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa va KO dopo aver usato questa mossa, a meno che non abbia rotto il sostituto del bersaglio. La Difesa del bersaglio è dimezzata durante il calcolo dei danni.", // NEEDS QC
		},
	},
	extrasensory: {
		name: "Extrasenso",
		// Official flavor text: "Chi la usa attacca con una misteriosa forza invisibile. Può far tentennare il bersaglio."
		desc: "Ha il 10% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "10% di far tentennare il bersaglio.", // NEEDS QC
		gen3: {
			desc: "Ha il 10% di probabilità di far tentennare il bersaglio. I danni raddoppiano se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		},
	},
	extremeevoboost: {
		name: "Potenziamento Eevolutivo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Aumenta l'Attacco, la Difesa, l'Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "+2 Att, Dif, Att. Sp., Dif. Sp. e Vel. di chi la usa.", // NEEDS QC
	},
	extremespeed: {
		name: "Extrarapido",
		// Official flavor text: "Chi la usa carica il bersaglio a una velocità impressionante. Questa mossa ha priorità alta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Agisce quasi sempre per primo (priorità +2).", // NEEDS QC
		gen4: {
			shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
		},
	},
	facade: {
		name: "Facciata",
		// Official flavor text: "Mossa d’attacco che raddoppia la potenza se chi la usa è scottato, avvelenato o paralizzato."
		desc: "La potenza raddoppia se chi la usa è scottato, paralizzato o avvelenato. Il dimezzamento dei danni fisici dovuto alla scottatura viene ignorato.", // NEEDS QC
		shortDesc: "Potenza x2 se scottato, paralizzato o avvelenato.", // NEEDS QC
		gen5: {
			desc: "La potenza raddoppia se chi la usa è scottato, paralizzato o avvelenato.", // NEEDS QC
		},
	},
	fairylock: {
		name: "Blocco Fatato",
		// Official flavor text: "Impone un blocco al terreno di lotta che nel turno successivo impedisce a tutti i Pokémon di fuggire."
		desc: "Nessun Pokémon in campo può essere sostituito nel turno successivo. Un Pokémon può comunque lasciare il campo se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. Fallisce se l'effetto è già attivo.", // NEEDS QC
		shortDesc: "Nessuno può essere sostituito nel turno successivo.", // NEEDS QC
		gen7: {
			desc: "Impedisce a tutti i Pokémon attivi di essere sostituiti nel turno successivo. Un Pokémon può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. Fallisce se l'effetto è già attivo.", // NEEDS QC
		},

		activate: "  Nel prossimo turno sarà impossibile scappare!",
	},
	fairywind: {
		name: "Vento di Fata",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	fakeout: {
		name: "Bruciapelo",
		// Official flavor text: "Mossa ad alta priorità che fa tentennare il bersaglio. Funziona solo appena scesi in campo."
		desc: "Ha il 100% di probabilità di far tentennare il bersaglio. Fallisce se non è il primo turno di chi la usa in campo.", // NEEDS QC
		shortDesc: "Agisce per primo. 100% di tentennamento. Primo turno.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	faketears: {
		name: "Falselacrime",
		// Official flavor text: "Chi la usa inscena un pianto teatrale per commuovere il bersaglio. Ne riduce di molto la Difesa Speciale."
		desc: "Riduce la Difesa Speciale del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce la Dif. Sp. del bersaglio di 2.", // NEEDS QC
	},
	falsesurrender: {
		name: "Supplicolpo",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	falseswipe: {
		name: "Falsofinale",
		// Official flavor text: "Chi la usa trattiene il colpo per impedire al bersaglio di andare KO, lasciandolo con almeno un PS."
		desc: "Lascia il bersaglio con almeno 1 PS.", // NEEDS QC
		shortDesc: "Lascia sempre almeno 1 PS al bersaglio.", // NEEDS QC
	},
	featherdance: {
		name: "Danzadipiume",
		// Official flavor text: "Chi la usa circonda il bersaglio con un turbinio di piume riducendo di molto il suo Attacco."
		desc: "Riduce l'Attacco del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce l'Attacco del bersaglio di 2.", // NEEDS QC
	},
	feint: {
		name: "Fintoattacco",
		// Official flavor text: "Colpisce anche un bersaglio che ha usato mosse come Protezione e Individua, annullandone gli effetti."
		desc: "Se questa mossa va a segno, rompe gli effetti di Fortino, Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno.", // NEEDS QC
		shortDesc: "Annulla Individua, Protezione e le Guardie.", // NEEDS QC
		gen6: {
			desc: "Se questa mossa va a segno, rompe Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno.", // NEEDS QC
		},
		gen5: {
			desc: "Se questa mossa va a segno, rompe Individua o Protezione del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se il bersaglio è un avversario e la sua parte è protetta da Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno.", // NEEDS QC
		},
		gen4: {
			desc: "Fallisce se il bersaglio non sta usando Individua o Protezione. Se questa mossa va a segno, rompe quella protezione per questo turno, permettendo agli altri Pokémon di attaccare il bersaglio normalmente.", // NEEDS QC
			shortDesc: "Rompe la protezione, altrimenti fallisce.", // NEEDS QC
		},

		activate: "  Fintoattacco inganna {TARGET}!",
	},
	feintattack: {
		name: "Finta",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	fellstinger: {
		name: "Pungiglione",
		// Official flavor text: "L’Attacco di chi la usa aumenta moltissimo se grazie alla mossa il bersaglio va KO."
		desc: "Aumenta l'Attacco di chi la usa di 3 livelli se questa mossa manda KO il bersaglio.", // NEEDS QC
		shortDesc: "+3 Attacco se questa mossa manda KO il bersaglio.", // NEEDS QC
		gen6: {
			desc: "Aumenta l'Attacco di chi la usa di 2 livelli se questa mossa manda KO il bersaglio.", // NEEDS QC
			shortDesc: "+2 Attacco se questa mossa manda KO il bersaglio.", // NEEDS QC
		},
	},
	ficklebeam: {
		name: "Irregolaser",
		shortDesc: "30% di probabilità di potenza doppia.", // NEEDS QC

		activate: "  {POKEMON} fa sul serio!",
	},
	fierydance: {
		name: "Voldifuoco",
		// Official flavor text: "Chi la usa viene avvolto da fiamme che scaglia contro il bersaglio, sbattendo le ali. Può anche aumentare l’Attacco Speciale."
		desc: "Ha il 50% di probabilità di aumentare l'Attacco Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "50% di aumentare l'Att. Sp. di chi la usa di 1.", // NEEDS QC
	},
	fierywrath: {
		name: "Furia Ardente",
		// Official flavor text: "Il Pokémon attacca trasformando la sua rabbia in un’aura simile a fiamme. Può anche far tentennare i nemici."
		desc: "Ha il 20% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "20% di far tentennare il bersaglio.", // NEEDS QC
	},
	filletaway: {
		name: "Alleggerimento",
		desc: "Aumenta l'Attacco, l'Attacco Speciale e la Velocità di chi la usa di 2 livelli in cambio di metà dei suoi PS max, arrotondato per difetto. Fallisce se chi la usa andrebbe KO o se quei livelli non cambierebbero.", // NEEDS QC
		shortDesc: "+2 Att, Att. Sp. e Vel. al costo di metà dei PS.", // NEEDS QC
	},
	finalgambit: {
		name: "Azzardo",
		// Official flavor text: "Chi la usa attacca con tutta la potenza di cui dispone e va KO, ma infligge al bersaglio un danno pari ai PS che ha perso."
		desc: "Infligge al bersaglio danni pari ai PS attuali di chi la usa. Se questa mossa va a segno, chi la usa va KO.", // NEEDS QC
		shortDesc: "Infligge i suoi PS attuali come danni e va KO.", // NEEDS QC
	},
	fireblast: {
		name: "Fuocobomba",
		// Official flavor text: "Investe il bersaglio con un’intensa fiammata che fa terra bruciata. Può anche scottarlo."
		desc: "Ha il 10% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "10% di scottare il bersaglio.", // NEEDS QC
		gen1: {
			desc: "Ha il 30% di probabilità di scottare il bersaglio.", // NEEDS QC
			shortDesc: "30% di scottare il bersaglio.", // NEEDS QC
		},
	},
	firefang: {
		name: "Rogodenti",
		// Official flavor text: "Chi la usa morde con denti infuocati. Può anche scottare o far tentennare il bersaglio."
		desc: "Ha il 10% di probabilità di scottare il bersaglio e il 10% di farlo tentennare.", // NEEDS QC
		shortDesc: "10% di scottare. 10% di far tentennare.", // NEEDS QC
		gen4: {
			desc: "Ha il 10% di probabilità di scottare il bersaglio e il 10% di farlo tentennare. Questa mossa può colpire i Pokémon con l'abilità Magidifesa indipendentemente dal loro tipo.", // NEEDS QC
		},
	},
	firelash: {
		name: "Frusta di Fuoco",
		// Official flavor text: "Colpisce il bersaglio con una frusta infuocata e ne riduce la Difesa."
		desc: "Ha il 100% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
	},
	firepledge: {
		name: "Fiammapatto",
		// Official flavor text: "Attacca il bersaglio con una colonna di fuoco. Se usata con Erbapatto, gli effetti aumentano e il campo diventa un mare di fuoco."
		desc: "Se un alleato di chi la usa ha scelto di usare Erbapatto o Acquapatto in questo turno e non ha ancora agito, agisce subito dopo chi la usa e la mossa di chi la usa non fa nulla. Combinata con Erbapatto, l'alleato usa Fiammapatto con 150 di potenza e un mare di fuoco appare nella parte del bersaglio per 4 turni, infliggendo ai Pokémon non di tipo Fuoco danni pari a 1/8 dei loro PS max, arrotondato per difetto, alla fine di ogni turno dell'effetto, ultimo compreso. Combinata con Acquapatto, l'alleato usa Acquapatto con 150 di potenza e un arcobaleno appare nella parte di chi la usa per 4 turni, raddoppiando le probabilità di effetto secondario, cumulandosi con l'abilità Leggiadro, tranne che per gli effetti che fanno tentennare, la cui probabilità può raddoppiare solo una volta. Usata come mossa combinata, ottiene lo STAB indipendentemente dal tipo di chi la usa. Questa mossa non consuma la Bijoufuoco.", // NEEDS QC
		shortDesc: "Da combinare con gli altri Auspici per più effetti.", // NEEDS QC

		activate: "#waterpledge",
		start: "  {TEAM:capitalize} è circondata dalle fiamme!",
		end: "  {TEAM:capitalize} non è più circondata dalle fiamme!",
		damage: "  {POKEMON} è ferito da un mare di fiamme!",
	},
	firepunch: {
		name: "Fuocopugno",
		// Official flavor text: "Colpisce il bersaglio con un pugno ardente che può scottarlo."
		desc: "Ha il 10% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "10% di scottare il bersaglio.", // NEEDS QC
	},
	firespin: {
		name: "Turbofuoco",
		// Official flavor text: "Intrappola il bersaglio in un turbine di fuoco che dura per quattro o cinque turni."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max (1/8 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni (sempre cinque se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
			shortDesc: "Intrappola e ferisce il bersaglio per 2-5 turni.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni. Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se usa Staffetta. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa usa questa mossa per due-cinque turni. Ha 3/8 di probabilità di durare due o tre turni e 1/8 di durare quattro o cinque turni. I danni calcolati al primo turno vengono ripetuti per ogni altro turno. Chi la usa non può scegliere mosse e il bersaglio non può eseguire mosse durante l'effetto, ma entrambi possono essere sostituiti. Se chi la usa viene sostituito, il bersaglio resta incapace di agire in quel turno. Se il bersaglio viene sostituito, chi la usa usa di nuovo questa mossa automaticamente, e se in quel momento aveva 0 PP, diventano 63. Se chi la usa o il bersaglio viene sostituito, o chi la usa non può agire, l'effetto finisce. Questa mossa può impedire al bersaglio di agire anche se ha un'immunità di tipo, ma in tal caso non infligge danni.", // NEEDS QC
			shortDesc: "Il bersaglio non può agire per 2-5 turni.", // NEEDS QC
		},

		start: "  {POKEMON} è intrappolato in un turbine di fuoco!",
		move: "#wrap",
	},
	firstimpression: {
		name: "Schermaglia",
		// Official flavor text: "È una mossa molto potente, ma funziona solo appena scesi in campo."
		desc: "Fallisce se non è il primo turno di chi la usa in campo.", // NEEDS QC
		shortDesc: "Agisce quasi sempre per primo. Solo al primo turno.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	fishiousrend: {
		name: "Branchiomorso",
		// Official flavor text: "Chi la usa morde il bersaglio con le dure branchie. Se attacca per primo, la potenza della mossa raddoppia."
		desc: "La potenza raddoppia se chi la usa agisce prima del bersaglio.", // NEEDS QC
		shortDesc: "Potenza doppia se agisce prima del bersaglio.", // NEEDS QC
	},
	fissure: {
		name: "Abisso",
		// Official flavor text: "Chi la usa crea una spaccatura nel terreno e cerca di gettarvici dentro il bersaglio. Se va a segno, il Pokémon colpito va KO."
		desc: "Infligge al bersaglio danni pari ai suoi PS max. Ignora i modificatori di precisione ed elusione. La precisione di questo attacco è pari a (livello di chi la usa - livello del bersaglio + 30)%, e fallisce se il bersaglio è di livello superiore. I Pokémon con l'abilità Vigore sono immuni.", // NEEDS QC
		shortDesc: "KO in un colpo. Fallisce se il livello è inferiore.", // NEEDS QC
		gen2: {
			desc: "Infligge 65535 danni al bersaglio. La precisione di questa mossa su 256 è pari al minore tra (2 × (livello di chi la usa − livello del bersaglio) + 76) e 255, prima di applicare i modificatori di precisione ed elusione. Fallisce se il bersaglio è di livello superiore. Può colpire un bersaglio che sta usando Fossa.", // NEEDS QC
		},
		gen1: {
			desc: "Infligge 65535 danni al bersaglio. Fallisce se la Velocità del bersaglio è superiore a quella di chi la usa.", // NEEDS QC
			shortDesc: "65535 danni. Fallisce se il bersaglio è più veloce.", // NEEDS QC
		},
	},
	flail: {
		name: "Flagello",
		// Official flavor text: "Chi la usa si dimena per attaccare. È più efficace se i suoi PS sono bassi."
		desc: "La potenza è 20 se X è tra 33 e 48, 40 se X è tra 17 e 32, 80 se X è tra 10 e 16, 100 se X è tra 5 e 9, 150 se X è tra 2 e 4, e 200 se X è 0 o 1, dove X è pari a (PS attuali di chi la usa × 48 / PS max di chi la usa), arrotondato per difetto.", // NEEDS QC
		shortDesc: "Più potente se chi la usa ha pochi PS.", // NEEDS QC
		gen4: {
			desc: "La potenza è 20 se X va da 43 a 48, 40 da 22 a 42, 80 da 13 a 21, 100 da 6 a 12, 150 da 2 a 5 e 200 se X è 0 o 1, dove X è pari a (PS attuali di chi la usa × 64 ÷ PS max di chi la usa), arrotondato per difetto.", // NEEDS QC
		},
		gen3: {
			desc: "La potenza è 20 se X è tra 33 e 48, 40 se X è tra 17 e 32, 80 se X è tra 10 e 16, 100 se X è tra 5 e 9, 150 se X è tra 2 e 4, e 200 se X è 0 o 1, dove X è pari a (PS attuali di chi la usa × 48 / PS max di chi la usa), arrotondato per difetto.", // NEEDS QC
		},
		gen2: {
			desc: "La potenza è 20 se X va da 33 a 48, 40 da 17 a 32, 80 da 10 a 16, 100 da 5 a 9, 150 da 2 a 4 e 200 se X è 0 o 1, dove X è pari a (PS attuali di chi la usa × 48 ÷ PS max di chi la usa), arrotondato per difetto. Questa mossa non ha varianza di danni e non può essere un brutto colpo.", // NEEDS QC
		},
	},
	flameburst: {
		name: "Pirolancio",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Se questa mossa va a segno, l'alleato del bersaglio perde 1/16 dei suoi PS max, arrotondato per difetto, a meno che non abbia l'abilità Magicscudo.", // NEEDS QC
		shortDesc: "Danneggia anche i Pokémon accanto al bersaglio.", // NEEDS QC
		gen6: {
			desc: "Se questa mossa va a segno, ogni alleato adiacente al bersaglio perde 1/16 dei suoi PS max, arrotondato per difetto, a meno che non abbia l'abilità Magicscudo.", // NEEDS QC
		},

		damage: "  Le fiamme raggiungono anche {POKEMON}!",
	},
	flamecharge: {
		name: "Nitrocarica",
		// Official flavor text: "Chi la usa si copre di fuoco e attacca il bersaglio. Concentrandosi aumenta, inoltre, la propria Velocità."
		desc: "Ha il 100% di probabilità di aumentare la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "100% di aumentare la Velocità di chi la usa di 1.", // NEEDS QC
	},
	flamethrower: {
		name: "Lanciafiamme",
		// Official flavor text: "Il bersaglio viene colpito da intense fiammate che possono anche scottarlo."
		desc: "Ha il 10% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "10% di scottare il bersaglio.", // NEEDS QC
	},
	flamewheel: {
		name: "Ruotafuoco",
		// Official flavor text: "Chi la usa si copre di fuoco e carica il bersaglio. Può anche scottarlo."
		desc: "Ha il 10% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "10% di scottare. Scongela chi la usa.", // NEEDS QC
	},
	flareblitz: {
		name: "Fuococarica",
		// Official flavor text: "Chi la usa si ricopre di fuoco e carica il bersaglio, ma subisce il contraccolpo. Può anche scottare il Pokémon colpito."
		desc: "Ha il 10% di probabilità di scottare il bersaglio. Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari al 33% dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo 33%. 10% di scottare. Scongela chi la usa.", // NEEDS QC
		gen4: {
			desc: "Ha il 10% di probabilità di scottare il bersaglio. Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/3 dei PS persi, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
			shortDesc: "1/3 contraccolpo. 10% di scottare. Scongela.", // NEEDS QC
		},
	},
	flash: {
		name: "Flash",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Riduce la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce la precisione del bersaglio di 1.", // NEEDS QC
	},
	flashcannon: {
		name: "Cannonflash",
		// Official flavor text: "Chi la usa attacca raccogliendo e rilasciando energia luminosa. Può ridurre la Difesa Speciale del bersaglio."
		desc: "Ha il 10% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
	},
	flatter: {
		name: "Adulazione",
		// Official flavor text: "Adula il bersaglio e lo confonde, ma ne aumenta l’Attacco Speciale."
		desc: "Aumenta l'Attacco Speciale del bersaglio di un livello e lo confonde.", // NEEDS QC
		shortDesc: "+1 Att. Sp. del bersaglio e lo confonde.", // NEEDS QC
	},
	fleurcannon: {
		name: "Cannonfiore",
		// Official flavor text: "Colpisce il bersaglio con un potente raggio, ma riduce di molto l’Attacco Speciale di chi la usa."
		desc: "Riduce l'Attacco Speciale di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce l'Att. Sp. di chi la usa di 2.", // NEEDS QC
	},
	fling: {
		name: "Lancio",
		// Official flavor text: "Chi la usa lancia il suo strumento addosso al bersaglio. La forza e l’effetto dipendono dallo strumento."
		desc: "La potenza dipende dallo strumento di chi la usa. Lo strumento viene perso e si attiva sul bersaglio se applicabile. Se non c'è un bersaglio o questo la evita proteggendosi, lo strumento viene comunque perso. Chi la usa può recuperare uno strumento lanciato con Riciclo o l'abilità Coglibacche. Fallisce se chi la usa non ha strumenti, se lo strumento non può essere lanciato, se è sotto l'effetto di Divieto o Magicozona, o se ha l'abilità Impaccio.", // NEEDS QC
		shortDesc: "Lancia il suo strumento sul bersaglio. Potenza varia.", // NEEDS QC
		gen4: {
			desc: "La potenza di questa mossa dipende dallo strumento di chi la usa. Lo strumento viene perso e si attiva sul bersaglio se applicabile. Se il bersaglio evita questa mossa proteggendosi, lo strumento viene comunque perso. Uno strumento lanciato può essere recuperato con Riciclo. Fallisce se chi la usa non ha strumenti, se lo strumento non può essere lanciato, o se chi la usa è sotto l'effetto di Divieto.", // NEEDS QC
		},

		removeItem: "  {POKEMON} lancia {ITEM:definite:classified}!",
	},
	flipturn: {
		name: "Virata",
		// Official flavor text: "Chi usa questa mossa fa marcia indietro per farsi sostituire dopo aver sferrato l’attacco."
		desc: "Se questa mossa va a segno e chi la usa non è KO, viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se non ci sono altri membri non KO, o se il bersaglio è stato sostituito con un Pulsantefuga o tramite le abilità Passoindietro o Fuggifuggi.", // NEEDS QC
		shortDesc: "Chi la usa esce dopo aver danneggiato il bersaglio.", // NEEDS QC

		switchOut: "#uturn",
	},
	floatyfall: {
		name: "Piombaflap",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
	},
	floralhealing: {
		name: "Cura Floreale",
		// Official flavor text: "Fa recuperare metà dei PS massimi al bersaglio. È più efficace quando il terreno di lotta è nello stato di Campo Erboso."
		desc: "Il bersaglio recupera metà dei suoi PS max, arrotondato per eccesso da 0,5. Se il terreno è un Campo Erboso, recupera invece 2/3 dei suoi PS max, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Il bersaglio recupera metà dei suoi PS max.", // NEEDS QC
	},
	flowershield: {
		name: "Fiordifesa",
		// Official flavor text: "Grazie a un misterioso potere, aumenta la Difesa di tutti i Pokémon di tipo Erba presenti in campo."
		desc: "Aumenta la Difesa di tutti i Pokémon di tipo Erba in campo di un livello. Fallisce se non ci sono Pokémon di tipo Erba in campo.", // NEEDS QC
		shortDesc: "+1 Difesa a tutti i tipi Erba in campo.", // NEEDS QC
	},
	flowertrick: {
		name: "Prestigiafiore",
		desc: "Questa mossa è sempre un brutto colpo, a meno che il bersaglio non sia sotto l'effetto di Fortuncanto o abbia l'abilità Lottascudo o Guscioscudo. Questa mossa non verifica la precisione.", // NEEDS QC
		shortDesc: "Sempre un brutto colpo e non verifica la precisione.", // NEEDS QC
	},
	fly: {
		name: "Volo",
		// Official flavor text: "Chi la usa si alza in volo per attaccare al turno seguente."
		desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Raffica, Tifone, Stramontante, Abbattimento, Mille Frecce, Tuono e Tornado, e Raffica e Tornado hanno la potenza raddoppiata contro di lui. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Si alza in volo al turno 1, colpisce al turno 2.", // NEEDS QC
		gen5: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Raffica, Tifone, Stramontante, Abbattimento, Tuono e Tornado, e Raffica e Tornado hanno la potenza raddoppiata contro di lui. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		},
		gen4: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Raffica, Stramontante, Tuono e Tornado, e Raffica e Tornado hanno la potenza raddoppiata contro di lui. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		},
		gen3: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Raffica, Stramontante, Tuono e Tornado, e Raffica e Tornado hanno la potenza raddoppiata contro di lui.", // NEEDS QC
		},
		gen2: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Raffica, Tuono, Tornado e Turbine, e Raffica e Tornado hanno la potenza raddoppiata contro di lui.", // NEEDS QC
		},
		gen1: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi tranne Pazienza, Comete e Trasformazione. Se chi la usa è completamente paralizzato nel secondo turno, continua a evitare gli attacchi finché non viene sostituito o esegue con successo il secondo turno di questa mossa o di Fossa.", // NEEDS QC
		},

		prepare: "{POKEMON} vola in alto!",
	},
	flyingpress: {
		name: "Schiacciatuffo",
		// Official flavor text: "Chi la usa si tuffa sul bersaglio dall’alto. È una mossa di tipo Lotta e Volante allo stesso tempo."
		desc: "Questa mossa combina il tipo Volante nella sua efficacia contro il bersaglio. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		shortDesc: "Combina il tipo Volante nella sua efficacia.", // NEEDS QC
	},
	focusblast: {
		name: "Focalcolpo",
		// Official flavor text: "Chi la usa si concentra e rilascia la sua forza. Può ridurre la Difesa Speciale del Pokémon colpito."
		desc: "Ha il 10% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
	},
	focusenergy: {
		name: "Focalenergia",
		// Official flavor text: "Chi la usa fa un profondo respiro e si concentra per rendere più probabili i brutti colpi."
		desc: "Aumenta il tasso di brutto colpo di chi la usa di 2 livelli. Fallisce se chi la usa ha già questo effetto. Staffetta può trasferire questo effetto a un alleato.", // NEEDS QC
		shortDesc: "Aumenta il tasso di brutto colpo di 2 livelli.", // NEEDS QC
		gen2: {
			desc: "Aumenta la probabilità di brutti colpi di chi la usa di un livello. Fallisce se chi la usa ha già l'effetto. Questo effetto può essere trasmesso con Staffetta.", // NEEDS QC
			shortDesc: "Aumenta il tasso di brutti colpi di 1.", // NEEDS QC
		},
		gen1: {
			desc: "Finché chi la usa resta in campo, la sua probabilità di brutti colpi è ridotta a un quarto. Fallisce se chi la usa ha già l'effetto. Se un Pokémon usa Nube, l'effetto finisce.", // NEEDS QC
			shortDesc: "Riduce a 1/4 la probabilità di brutti colpi.", // NEEDS QC
		},

		start: "  {POKEMON} si prepara alla lotta!",
		startFromItem: "  La probabilità di sferrare brutti colpi di {POKEMON} aumenta grazie {ITEM:a:definite:classified}!",
		startFromZEffect: "  Grazie al Potere Z, {POKEMON} ha più probabilità di mandare a segno un brutto colpo!",
	},
	focuspunch: {
		name: "Centripugno",
		// Official flavor text: "Chi la usa prende la mira prima di sferrare un pugno. Fallirà se verrà colpito prima di eseguire la mossa."
		desc: "Chi la usa perde la concentrazione e non fa nulla se viene colpito da un attacco che infligge danni in questo turno prima di poterla eseguire.", // NEEDS QC
		shortDesc: "Fallisce se chi la usa è colpito prima di agire.", // NEEDS QC
		gen4: {
			desc: "Chi la usa perde la concentrazione e non fa nulla se viene colpito da un attacco in questo turno prima di poter eseguire la mossa, ma perde comunque PP.", // NEEDS QC
		},

		start: "  {POKEMON} si concentra al massimo!",
		cant: "{POKEMON} perde la concentrazione e non può agire!",
	},
	followme: {
		name: "Sonoqui",
		// Official flavor text: "Chi la usa attira l’attenzione su di sé, costringendo i nemici a sceglierlo sempre come bersaglio."
		desc: "Fino alla fine del turno, tutti gli attacchi a bersaglio singolo della parte avversaria vengono reindirizzati su chi la usa. Questi attacchi vengono reindirizzati prima di poter essere rimbalzati da Magivelo o dall'abilità Magispecchio, o attirati dalle abilità Parafulmine o Acquascolo. Fallisce se non è una Lotta in Doppio o una Battle Royale. Questo effetto è ignorato mentre chi la usa è sotto l'effetto di Cadutalibera.", // NEEDS QC
		shortDesc: "Le mosse nemiche puntano chi la usa in questo turno.", // NEEDS QC
		gen6: {
			desc: "Fino alla fine del turno, tutti gli attacchi a bersaglio singolo della parte avversaria vengono reindirizzati a chi la usa, se è a portata. Tali attacchi vengono reindirizzati prima di poter essere respinti da Magivelo o dall'abilità Magispecchio, o attirati dalle abilità Parafulmine o Acquascolo. Fallisce se non è una Lotta in Doppio o in Triplo. Questo effetto è ignorato mentre chi la usa è sotto l'effetto di Cadutalibera.", // NEEDS QC
		},
		gen4: {
			desc: "Fino alla fine del turno, tutti gli attacchi a bersaglio singolo della parte avversaria vengono reindirizzati a chi la usa. Tali attacchi vengono reindirizzati prima di poter essere respinti da Magivelo, o attirati dalle abilità Parafulmine o Acquascolo. Questo effetto resta attivo anche se chi la usa lascia il campo. Fallisce se non è una Lotta in Doppio.", // NEEDS QC
		},
		gen3: {
			desc: "Fino alla fine del turno, tutti gli attacchi a bersaglio singolo della parte avversaria vengono reindirizzati a chi la usa. Tali attacchi vengono reindirizzati prima di poter essere respinti da Magivelo, o attirati dall'abilità Parafulmine. Questo effetto resta attivo anche se chi la usa lascia il campo. Fallisce se non è una Lotta in Doppio.", // NEEDS QC
		},

		start: "  {POKEMON} è al centro dell’attenzione!",
		startFromZEffect: "  {POKEMON} è al centro dell’attenzione!",
	},
	forcepalm: {
		name: "Palmoforza",
		// Official flavor text: "Chi la usa attacca con un’onda d’urto che può anche paralizzare il bersaglio."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "30% di paralizzare il bersaglio.", // NEEDS QC
	},
	foresight: {
		name: "Preveggenza",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Finché il bersaglio resta in campo, il suo livello di elusione viene ignorato nei calcoli di precisione contro di lui se è superiore a 0, e gli attacchi di tipo Normale e Lotta possono colpirlo se è di tipo Spettro. Fallisce se il bersaglio è già sotto questo effetto, o sotto quello di Miracolvista o Segugio.", // NEEDS QC
		shortDesc: "Lotta e Normale colpiscono Spettro. Ignora elusione.", // NEEDS QC
		gen4: {
			desc: "Finché il bersaglio resta in campo, il suo livello di elusione viene ignorato nei controlli di precisione contro di lui se è superiore a 0, e gli attacchi di tipo Normale e Lotta possono colpirlo anche se è di tipo Spettro.", // NEEDS QC
		},
		gen3: {
			desc: "Finché il bersaglio resta in campo, il suo livello di elusione viene ignorato nei controlli di precisione contro di lui, e gli attacchi di tipo Normale e Lotta possono colpirlo anche se è di tipo Spettro.", // NEEDS QC
		},
		gen2: {
			desc: "Finché il bersaglio resta in campo, se il suo livello di elusione è superiore al livello di precisione dell'attaccante, entrambi vengono ignorati nei controlli di precisione, e gli attacchi di tipo Normale e Lotta possono colpirlo anche se è di tipo Spettro. Se il bersaglio lascia il campo con Staffetta, il sostituto resta sotto questo effetto. Fallisce se il bersaglio è già colpito.", // NEEDS QC
		},

		start: "  {POKEMON} è stato identificato!",
	},
	forestscurse: {
		name: "Boscomalocchio",
		// Official flavor text: "Chi la usa invoca la maledizione del bosco sul bersaglio, che acquisisce così anche il tipo Erba."
		desc: "Aggiunge il tipo Erba al bersaglio, che quindi ha due o tre tipi. Fallisce se il bersaglio è già di tipo Erba. Se Halloween aggiunge un tipo al bersaglio, sostituisce quello aggiunto da questa mossa e viceversa.", // NEEDS QC
		shortDesc: "Aggiunge il tipo Erba al bersaglio.", // NEEDS QC
	},
	foulplay: {
		name: "Ripicca",
		// Official flavor text: "Chi la usa sfrutta la forza del bersaglio. Il danno inflitto è proporzionale all’Attacco del nemico."
		desc: "I danni sono calcolati usando l'Attacco del bersaglio, compresi i livelli delle statistiche. L'abilità, lo strumento e la scottatura di chi la usa si applicano normalmente.", // NEEDS QC
		shortDesc: "Usa l'Attacco del bersaglio nel calcolo dei danni.", // NEEDS QC
	},
	freezedry: {
		name: "Liofilizzazione",
		// Official flavor text: "Chi la usa raffredda istantaneamente il bersaglio e può congelarlo. Risulta superefficace contro i Pokémon di tipo Acqua."
		desc: "Ha il 10% di probabilità di congelare il bersaglio. L'efficacia di questa mossa contro il tipo Acqua diventa superefficace, indipendentemente dal tipo della mossa.", // NEEDS QC
		shortDesc: "10% di congelare. Superefficace contro l'Acqua.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	freezeshock: {
		name: "Elettrogelo",
		// Official flavor text: "Chi la usa lancia contro il bersaglio al turno successivo una sfera di ghiaccio ricoperta di elettricità. Può anche paralizzarlo."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Carica, colpisce al turno 2. 30% di paralisi.", // NEEDS QC

		prepare: "  {POKEMON} è avvolto da una luce fredda!",
	},
	freezingglare: {
		name: "Sguardo Gelido",
		// Official flavor text: "Il Pokémon attacca rilasciando energia psichica dagli occhi. Può congelare il bersaglio."
		desc: "Ha il 10% di probabilità di congelare il bersaglio.", // NEEDS QC
		shortDesc: "10% di congelare il bersaglio.", // NEEDS QC
	},
	freezyfrost: {
		name: "Scricchiagelo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Azzera i livelli delle statistiche di tutti i Pokémon in campo.", // NEEDS QC
		shortDesc: "Annulla tutti i cambi di statistiche.", // NEEDS QC
	},
	frenzyplant: {
		name: "Radicalbero",
		// Official flavor text: "Un groviglio di radici colpisce il bersaglio. Chi la usa salta il turno successivo."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
	},
	frostbreath: {
		name: "Alitogelido",
		// Official flavor text: "Chi la usa attacca il bersaglio con un soffio d’aria gelida. Brutto colpo assicurato."
		desc: "Questa mossa è sempre un brutto colpo, a meno che il bersaglio non sia sotto l'effetto di Fortuncanto o abbia l'abilità Lottascudo o Guscioscudo.", // NEEDS QC
		shortDesc: "È sempre un brutto colpo.", // NEEDS QC
	},
	frustration: {
		name: "Frustrazione",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza è pari a ((255 - felicità di chi la usa) × 2/5), arrotondato per difetto, ma non meno di 1.", // NEEDS QC
		shortDesc: "Potenza max (102) con la felicità minima.", // NEEDS QC
	},
	furyattack: {
		name: "Furia",
		// Official flavor text: "Infilza il bersaglio con corna affilate o con il becco da due a cinque volte di fila."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. I danni sono calcolati una sola volta per il primo colpo e ripetuti per ogni colpo. Se uno dei colpi rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	furycutter: {
		name: "Tagliofuria",
		// Official flavor text: "Colpisce il bersaglio con falci o artigli. Se usata in successione aumenta di potenza ogni volta che va a segno."
		desc: "La potenza raddoppia a ogni colpo riuscito, fino a un massimo di 160. La potenza si azzera se questa mossa fallisce o se viene usata un'altra mossa.", // NEEDS QC
		shortDesc: "Potenza doppia a ogni colpo, fino a 160.", // NEEDS QC
	},
	furyswipes: {
		name: "Sfuriate",
		// Official flavor text: "Colpisce il bersaglio con artigli o falci affilate da due a cinque volte in rapida successione."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. I danni sono calcolati una sola volta per il primo colpo e ripetuti per ogni colpo. Se uno dei colpi rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	fusionbolt: {
		name: "Incrotuono",
		// Official flavor text: "Chi la usa lancia un fulmine enorme. Se usata in combinazione con Incrofiamma, il danno provocato dalla mossa aumenta."
		desc: "La potenza raddoppia se l'ultima mossa usata da un Pokémon in questo turno era Incrofiamma.", // NEEDS QC
		shortDesc: "Potenza x2 dopo Incrofiamma in questo turno.", // NEEDS QC
	},
	fusionflare: {
		name: "Incrofiamma",
		// Official flavor text: "Chi la usa lancia una fiammata enorme. Se usata in combinazione con Incrotuono, il danno provocato dalla mossa aumenta."
		desc: "La potenza raddoppia se l'ultima mossa usata da un Pokémon in questo turno era Incrotuono.", // NEEDS QC
		shortDesc: "Potenza x2 dopo Incrotuono in questo turno.", // NEEDS QC
	},
	futuresight: {
		name: "Divinazione",
		// Official flavor text: "Due turni dopo l’utilizzo di questa mossa, il bersaglio viene attaccato con energia psichica."
		desc: "Infligge danni due turni dopo l'uso. Alla fine di quel turno, i danni vengono calcolati in quel momento e inflitti al Pokémon nella posizione che il bersaglio aveva quando la mossa è stata usata. Se chi la usa non è più in campo, i danni vengono calcolati in base al suo Attacco Speciale naturale, ai suoi tipi e al suo livello, senza bonus da strumento o abilità. Fallisce se questa mossa o Obbliderio è già in effetto per la posizione del bersaglio.", // NEEDS QC
		shortDesc: "Colpisce due turni dopo l'uso.", // NEEDS QC
		gen4: {
			desc: "Infligge due turni dopo l'uso danni senza tipo che non possono essere un brutto colpo. I danni vengono calcolati contro il bersaglio al momento dell'uso e inflitti alla fine dell'ultimo turno al Pokémon nella posizione originale del bersaglio. Fallisce se questa mossa o Obbliderio è già in corso per la posizione del bersaglio.", // NEEDS QC
		},
		gen2: {
			desc: "Infligge due turni dopo l'uso danni senza tipo che non possono essere un brutto colpo. I danni vengono calcolati contro il bersaglio al momento dell'uso e inflitti alla fine dell'ultimo turno al Pokémon nella posizione originale del bersaglio. Fallisce se questa mossa è già in corso per la posizione del bersaglio.", // NEEDS QC
		},

		start: "  {POKEMON} presagisce l’attacco imminente!",
		activate: "  {TARGET} subisce Divinazione!",
	},
	gastroacid: {
		name: "Gastroacido",
		// Official flavor text: "Chi la usa lancia acidi gastrici sul bersaglio. Il fluido annulla l’abilità del Pokémon colpito."
		desc: "L'abilità del bersaglio viene resa inefficace finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta sotto questo effetto. Se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teramorfosi, Stato Zen o Supercambio, questa mossa fallisce, e ricevere l'effetto tramite Staffetta lo fa finire immediatamente.", // NEEDS QC
		shortDesc: "Annulla l'abilità del bersaglio.", // NEEDS QC
		gen8: {
			desc: "L'abilità del bersaglio viene resa inefficace finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta sotto questo effetto. Se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen, questa mossa fallisce, e ricevere l'effetto tramite Staffetta lo fa finire immediatamente.", // NEEDS QC
		},
		gen7: {
			desc: "L'abilità del bersaglio viene resa inefficace finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta sotto questo effetto. Se l'abilità del bersaglio è Morfosintonia, Sonno Assoluto, Fantasmanto, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen, questa mossa fallisce, e ricevere l'effetto tramite Staffetta lo fa finire immediatamente.", // NEEDS QC
		},
		gen6: {
			desc: "L'abilità del bersaglio viene resa inefficace finché resta in campo. Se il bersaglio usa Staffetta, il sostituto resta sotto questo effetto. Se l'abilità del bersaglio è Multitipo o Accendilotta, questa mossa fallisce, e ricevere l'effetto tramite Staffetta lo fa finire immediatamente.", // NEEDS QC
		},

		start: "  L’abilità di {POKEMON} perde ogni efficacia!",
	},
	geargrind: {
		name: "Ingracolpo",
		// Official flavor text: "Chi la usa colpisce il bersaglio due volte di fila lanciandogli contro degli ingranaggi d’acciaio."
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		shortDesc: "Colpisce 2 volte in un turno.", // NEEDS QC
	},
	gearup: {
		name: "Marciainpiù",
		// Official flavor text: "Dà una marcia in più agli alleati con le abilità Meno o Più aumentandone l’Attacco e l’Attacco Speciale."
		desc: "Aumenta l'Attacco e l'Attacco Speciale dei Pokémon della squadra di chi la usa con l'abilità Più o Meno di un livello.", // NEEDS QC
		shortDesc: "+1 Att e Att. Sp. agli alleati con Più/Meno.", // NEEDS QC
	},
	genesissupernova: {
		name: "Supernova delle Origini",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Se questa mossa va a segno, il terreno diventa un Campo Psichico.", // NEEDS QC
		shortDesc: "Evoca un Campo Psichico.", // NEEDS QC
	},
	geomancy: {
		name: "Geocontrollo",
		// Official flavor text: "Chi la usa assorbe energia nel primo turno per aumentare poi notevolmente l’Attacco Speciale, la Difesa Speciale e la Velocità in quello seguente."
		desc: "Aumenta l'Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa di 2 livelli. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Carica, poi +2 Att. Sp., Dif. Sp. e Vel. al turno 2.", // NEEDS QC

		prepare: "{POKEMON} accumula energia!",
	},
	gigadrain: {
		name: "Gigassorbimento",
		// Official flavor text: "Mossa che assorbe PS. Chi la usa recupera una quantità di PS pari alla metà del danno inferto."
		desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei danni inflitti.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto.", // NEEDS QC
		},
	},
	gigaimpact: {
		name: "Gigaimpatto",
		// Official flavor text: "Chi la usa carica il bersaglio usando tutta la sua forza, ma al turno successivo deve riposarsi."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
	},
	gigatonhammer: {
		name: "Granmartello",
		shortDesc: "Non può essere scelta due turni di fila.", // NEEDS QC
	},
	gigavolthavoc: {
		name: "Gigascarica Folgorante",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	glaciallance: {
		name: "Lancia Glaciale",
		// Official flavor text: "Il Pokémon attacca i nemici scagliando una lancia di ghiaccio accompagnata da una tormenta di neve."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i nemici adiacenti.", // NEEDS QC
	},
	glaciate: {
		name: "Gelamondo",
		// Official flavor text: "Chi la usa attacca i nemici intorno con una folata d’aria gelida e ne riduce anche la Velocità."
		desc: "Ha il 100% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Velocità dei nemici di 1.", // NEEDS QC
	},
	glaiverush: {
		name: "Spadoncarica",
		desc: "Se questa mossa va a segno, le mosse che bersagliano chi la usa infliggono danni doppi e non verificano la precisione fino alla sua prossima azione.", // NEEDS QC
		shortDesc: "Subisce danni x2 sicuri fino al suo prossimo turno.", // NEEDS QC
	},
	glare: {
		name: "Sguardo Feroce",
		// Official flavor text: "Chi la usa spaventa il bersaglio con uno sguardo terrificante e ne causa la paralisi."
		desc: "Paralizza il bersaglio.", // NEEDS QC
		shortDesc: "Paralizza il bersaglio.", // NEEDS QC
		gen3: {
			desc: "Paralizza il bersaglio. Questa mossa non ignora l'immunità di tipo.", // NEEDS QC
		},
		gen1: {
			desc: "Paralizza il bersaglio.", // NEEDS QC
		},
	},
	glitzyglow: {
		name: "Auraswoosh",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Questa mossa evoca Schermoluce per 5 turni.", // NEEDS QC
		shortDesc: "Evoca Schermoluce.", // NEEDS QC
	},
	gmaxbefuddle: {
		name: "Gigastupore",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria si addormenta, viene avvelenato o viene paralizzato, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: sonno, vlm o par.", // NEEDS QC
	},
	gmaxcannonade: {
		name: "Gigacannonata",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, per 4 turni ogni Pokémon non di tipo Acqua della parte avversaria subisce danni pari a 1/6 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno dell'effetto, ultimo compreso.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1/6 PS, 4 turni.", // NEEDS QC

		start: "  {PARTY:capitalize} sono travolti dalla corrente impetuosa.",
		damage: "  {POKEMON} è travolto dall’impetuosa corrente di Gigacannonata!",
	},
	gmaxcentiferno: {
		name: "Gigamillefiamme",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria non può essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli), anche dietro un sostituto. Infligge loro danni pari a 1/8 dei loro PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Possono comunque essere sostituiti se hanno una Disfoguscio o usano Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce per un bersaglio se lascia il campo o usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici intrappolati 4-5 turni.", // NEEDS QC
	},
	gmaxchistrike: {
		name: "Gigapugnointuito",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte di chi la usa vede il proprio tasso di brutto colpo aumentare di un livello, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Alleati: brutto colpo +1.", // NEEDS QC

		start: "#focusenergy",
	},
	gmaxcuddle: {
		name: "Gigabbraccio",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria si infatua, anche dietro un sostituto. Questo effetto non si verifica per un bersaglio se è dello stesso sesso di chi la usa, se uno dei due non ha sesso o se è già infatuato.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: infatuati.", // NEEDS QC
	},
	gmaxdepletion: {
		name: "Gigalogoramento",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria perde 2 PP dalla sua ultima mossa usata, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -2 PP.", // NEEDS QC

		activate: "  I PP di {TARGET} sono diminuiti!",
	},
	gmaxdrumsolo: {
		name: "Gigarullio",
		desc: "La potenza è 160, indipendentemente da quella della mossa Dynamax della mossa di base. Questa mossa e i suoi effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		shortDesc: "Sempre 160 di potenza. Ignora le abilità.", // NEEDS QC
	},
	gmaxfinale: {
		name: "Gigagranfinale",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte di chi la usa recupera 1/6 dei suoi PS max attuali, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Alleati: +1/6 dei PS max.", // NEEDS QC
	},
	gmaxfireball: {
		name: "Gigafiammopalla",
		desc: "La potenza è 160, indipendentemente da quella della mossa Dynamax della mossa di base. Questa mossa e i suoi effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		shortDesc: "Sempre 160 di potenza. Ignora le abilità.", // NEEDS QC
	},
	gmaxfoamburst: {
		name: "Gigaschiuma",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, la Velocità di ogni Pokémon della parte avversaria diminuisce di 2 livelli, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -2 Velocità.", // NEEDS QC
	},
	gmaxgoldrush: {
		name: "Gigamonete",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria viene confuso, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici confusi.", // NEEDS QC
	},
	gmaxgravitas: {
		name: "Gigagravitoforza",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Gravità.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Attiva Gravità.", // NEEDS QC
	},
	gmaxhydrosnipe: {
		name: "Gigasparomirato",
		desc: "La potenza è 160, indipendentemente da quella della mossa Dynamax della mossa di base. Questa mossa e i suoi effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		shortDesc: "Sempre 160 di potenza. Ignora le abilità.", // NEEDS QC
	},
	gmaxmalodor: {
		name: "Gigafetore",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria viene avvelenato, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: avvelenati.", // NEEDS QC
	},
	gmaxmeltdown: {
		name: "Gigaliquefazione",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Attaccalite per ogni Pokémon della parte avversaria, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: sotto Attaccalite.", // NEEDS QC
	},
	gmaxoneblow: {
		name: "Gigasingolcolpo",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Questa mossa supera tutti gli effetti di protezione, compreso Dynabarriera.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Supera Dynabarriera.", // NEEDS QC
	},
	gmaxrapidflow: {
		name: "Gigapluricolpo",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Questa mossa supera tutti gli effetti di protezione, compreso Dynabarriera.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Supera Dynabarriera.", // NEEDS QC
	},
	gmaxreplenish: {
		name: "Gigarinnovamento",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, c'è il 50% di probabilità che ogni Pokémon della parte di chi la usa recuperi la sua bacca, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. 50% di recuperare le bacche.", // NEEDS QC
	},
	gmaxresonance: {
		name: "Gigamelodia",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Velaurora nella parte di chi la usa.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Alleati: Velaurora.", // NEEDS QC
	},
	gmaxsandblast: {
		name: "Gigavortisabbia",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria non può essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli), anche dietro un sostituto. Infligge loro danni pari a 1/8 dei loro PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Possono comunque essere sostituiti se hanno una Disfoguscio o usano Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce per un bersaglio se lascia il campo o usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici intrappolati 4-5 turni.", // NEEDS QC
	},
	gmaxsmite: {
		name: "Gigacastigo",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria viene confuso, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici confusi.", // NEEDS QC
	},
	gmaxsnooze: {
		name: "Gigatorpore",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, c'è il 50% di probabilità che l'effetto di Sbadiglio inizi sul bersaglio, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. 50% di Sbadiglio sul bersaglio.", // NEEDS QC
	},
	gmaxsteelsurge: {
		name: "Gigaferroaculei",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo. Gli avversari perdono 1/32, 1/16, 1/8, 1/4 o 1/2 dei loro PS max, arrotondato per difetto, in base alla loro debolezza al tipo Acciaio (0,25x, 0,5x, neutra, 2x o 4x rispettivamente). Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Trappola di tipo Acciaio.", // NEEDS QC

		start: "  Schegge di metallo affilate sospese in aria circondano {PARTY}!",
		end: "  Non ci sono più schegge di metallo intorno a {PARTY}!",
		damage: "  Schegge di metallo affilato colpiscono {POKEMON}!",
	},
	gmaxstonesurge: {
		name: "Gigarocciagetto",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo. Gli avversari perdono 1/32, 1/16, 1/8, 1/4 o 1/2 dei loro PS max, arrotondato per difetto, in base alla loro debolezza al tipo Roccia (0,25x, 0,5x, neutra, 2x o 4x rispettivamente). Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Piazza Levitoroccia.", // NEEDS QC
	},
	gmaxstunshock: {
		name: "Gigatoxiscossa",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria viene avvelenato o paralizzato, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: vlm o par.", // NEEDS QC
	},
	gmaxsweetness: {
		name: "Gigambrosia",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte di chi la usa viene curato dal suo problema di stato, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Alleati: stato curato.", // NEEDS QC
	},
	gmaxtartness: {
		name: "Gigattaccoacido",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, l'elusione di ogni Pokémon della parte avversaria diminuisce di un livello, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1 elusione.", // NEEDS QC
	},
	gmaxterror: {
		name: "Gigaillusione",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria non può più essere sostituito, anche dietro un sostituto. Possono comunque essere sostituiti se hanno una Disfoguscio o usano Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: intrappolati.", // NEEDS QC
	},
	gmaxvinelash: {
		name: "Gigasferzata",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, per 4 turni ogni Pokémon non di tipo Erba della parte avversaria subisce danni pari a 1/6 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno dell'effetto, ultimo compreso.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1/6 PS, 4 turni.", // NEEDS QC

		start: "  {PARTY:capitalize} sono avvolti da liane sferzanti!",
		damage: "  {POKEMON} è ferito dalle violente frustate di Gigasferzata!",
	},
	gmaxvolcalith: {
		name: "Gigalapilli",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, per 4 turni ogni Pokémon non di tipo Roccia della parte avversaria subisce danni pari a 1/6 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno dell'effetto, ultimo compreso.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1/6 PS, 4 turni.", // NEEDS QC

		start: "  {PARTY:capitalize} sono circondati da rocce!",
		damage: "  {POKEMON} è ferito da pietre scagliate da Gigalapilli!",
	},
	gmaxvoltcrash: {
		name: "Gigapikafolgori",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, ogni Pokémon della parte avversaria viene paralizzato, anche dietro un sostituto.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: paralizzati.", // NEEDS QC
	},
	gmaxwildfire: {
		name: "Gigavampa",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, per 4 turni ogni Pokémon non di tipo Fuoco della parte avversaria subisce danni pari a 1/6 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno dell'effetto, ultimo compreso.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1/6 PS, 4 turni.", // NEEDS QC

		start: "  {PARTY:capitalize} sono avvolti dalle fiamme!",
		damage: "  {POKEMON} è avvolto dalle fiamme prodotte da Gigavampa!",
	},
	gmaxwindrage: {
		name: "Gigaciclone",
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, gli effetti di Campo Elettrico, Campo Erboso, Campo Nebbioso e Campo Psichico finiscono, gli effetti di Riflesso, Schermoluce, Velaurora, Salvaguardia, Nebbia, Gigaferroaculei, Punte, Fielepunte, Levitoroccia e Rete Vischiosa finiscono per la parte del bersaglio, e gli effetti di Gigaferroaculei, Punte, Fielepunte, Levitoroccia e Rete Vischiosa finiscono per la parte di chi la usa.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Rimuove campi e trappole.", // NEEDS QC
	},
	grassknot: {
		name: "Laccioerboso",
		// Official flavor text: "Chi la usa intrappola il bersaglio con l’erba e lo fa cadere. Danneggia maggiormente i Pokémon più pesanti."
		desc: "La potenza è 20 se il bersaglio pesa meno di 10 kg, 40 se meno di 25 kg, 60 se meno di 50 kg, 80 se meno di 100 kg, 100 se meno di 200 kg, e 120 se 200 kg o più.", // NEEDS QC
		shortDesc: "Più potente se il bersaglio è pesante.", // NEEDS QC
	},
	grasspledge: {
		name: "Erbapatto",
		// Official flavor text: "Attacca il bersaglio con una colonna d’erba. Se usata con Acquapatto, gli effetti aumentano e il campo diventa una palude."
		desc: "Se un alleato di chi la usa ha scelto di usare Fiammapatto o Acquapatto in questo turno e non ha ancora agito, agisce subito dopo chi la usa e la mossa di chi la usa non fa nulla. Combinata con Fiammapatto, l'alleato usa Fiammapatto con 150 di potenza e un mare di fuoco appare nella parte del bersaglio per 4 turni, infliggendo ai Pokémon non di tipo Fuoco danni pari a 1/8 dei loro PS max, arrotondato per difetto, alla fine di ogni turno dell'effetto, ultimo compreso. Combinata con Acquapatto, l'alleato usa Erbapatto con 150 di potenza e una palude appare nella parte del bersaglio per 4 turni, riducendo a 1/4 la Velocità di ogni Pokémon di quella parte. Usata come mossa combinata, ottiene lo STAB indipendentemente dal tipo di chi la usa. Questa mossa non consuma la Bijouerba.", // NEEDS QC
		shortDesc: "Da combinare con gli altri Auspici per più effetti.", // NEEDS QC

		activate: "#waterpledge",
		start: "  {TEAM:capitalize} è circondata da una palude!",
		end: "  {TEAM:capitalize} non è più circondata dalla palude!",
	},
	grasswhistle: {
		name: "Meloderba",
		shortDesc: "Addormenta il bersaglio.", // NEEDS QC
	},
	grassyglide: {
		name: "Erboscivolata",
		// Official flavor text: "Chi la usa attacca il bersaglio scivolando sul terreno. Se utilizzata quando è attivo un Campo Erboso, ha priorità alta."
		desc: "Se il terreno attuale è un Campo Erboso e chi la usa è a terra, questa mossa ha la priorità aumentata di 1.", // NEEDS QC
		shortDesc: "Su Campo Erboso: priorità +1.", // NEEDS QC
	},
	grassyterrain: {
		name: "Campo Erboso",
		// Official flavor text: "Per cinque turni il terreno entra nello stato di Campo Erboso: i Pokémon a terra recuperano PS a ogni turno e la potenza delle mosse di tipo Erba aumenta."
		desc: "Per 5 turni, il terreno diventa un Campo Erboso. Durante l'effetto, la potenza degli attacchi di tipo Erba dei Pokémon a terra è moltiplicata per 1,3, la potenza di Battiterra, Terremoto e Magnitudo contro i Pokémon a terra è moltiplicata per 0,5, e i Pokémon a terra recuperano 1/16 dei loro PS max, arrotondato per difetto, alla fine di ogni turno, ultimo compreso. Camuffamento trasforma chi la usa in tipo Erba, Naturforza diventa Energipalla e Forzasegreta ha il 30% di probabilità di addormentare. Fallisce se il terreno attuale è già un Campo Erboso.", // NEEDS QC
		shortDesc: "5 turni: Erba potenziata e cura 1/16 dei PS a turno.", // NEEDS QC
		gen7: {
			desc: "Per 5 turni, è attivo un Campo Erboso. Durante l'effetto, la potenza degli attacchi di tipo Erba dei Pokémon a terra è moltiplicata per 1,5, la potenza di Battiterra, Terremoto e Magnitudo contro i Pokémon a terra è moltiplicata per 0,5, e i Pokémon a terra recuperano 1/16 dei loro PS max, arrotondato per difetto, alla fine di ogni turno, compreso l'ultimo. Camuffamento trasforma chi la usa in tipo Erba, Naturforza diventa Energipalla, e Forzasegreta ha il 30% di probabilità di addormentare. Fallisce se un Campo Erboso è già attivo.", // NEEDS QC
		},
	},
	gravapple: {
		name: "Forza G",
		// Official flavor text: "Chi la usa fa cadere una mela sul bersaglio da una grande altezza, infliggendogli danni e riducendone la Difesa."
		desc: "Ha il 100% di probabilità di ridurre la Difesa del bersaglio di un livello. La potenza è moltiplicata per 1,5 durante l'effetto di Gravità.", // NEEDS QC
		shortDesc: "100% di -1 Difesa. Con Gravità: x1,5.", // NEEDS QC
	},
	gravity: {
		name: "Gravità",
		// Official flavor text: "Per cinque turni rende vulnerabili alle mosse di tipo Terra i Pokémon con Levitazione o di tipo Volante. Non è possibile usare mosse che fanno volare."
		desc: "Per 5 turni, l'elusione di tutti i Pokémon in campo è moltiplicata per 0,6. Al momento dell'uso, Rimbalzo, Volo, Magnetascesa, Cadutalibera e Telecinesi finiscono immediatamente per tutti i Pokémon in campo. Durante l'effetto, Rimbalzo, Volo, Schiacciatuffo, Calcinvolo, Calciosalto, Magnetascesa, Cadutalibera, Splash e Telecinesi non possono essere usate dai Pokémon in campo. Gli attacchi di tipo Terra, Punte, Fielepunte, Rete Vischiosa e l'abilità Trappoarena possono influenzare i Pokémon di tipo Volante o con l'abilità Levitazione. Fallisce se questo effetto è già attivo.", // NEEDS QC
		shortDesc: "5 turni: niente immunità al Terra, precisione x1,67.", // NEEDS QC
		gen7: {
			desc: "Per 5 turni, l'elusione di tutti i Pokémon attivi è moltiplicata per 0,6. Al momento dell'uso, Rimbalzo, Volo, Magnetascesa, Cadutalibera e Telecinesi finiscono immediatamente per tutti i Pokémon. Durante l'effetto, Rimbalzo, Volo, Schiacciatuffo, Calcinvolo, Calciosalto, Magnetascesa, Cadutalibera, Splash e Telecinesi non possono essere usate da alcun Pokémon. Gli attacchi di tipo Terra, Punte, Fielepunte, Rete Vischiosa e l'abilità Trappoarena possono colpire i Pokémon di tipo Volante o con l'abilità Levitazione. Fallisce se l'effetto è già attivo. Le mosse Z interessate possono comunque essere scelte, ma saranno impedite all'esecuzione durante questo effetto.", // NEEDS QC
		},
		gen6: {
			desc: "Per 5 turni, l'elusione di tutti i Pokémon in campo è moltiplicata per 0,6. Al momento dell'uso, Rimbalzo, Volo, Magnetascesa, Cadutalibera e Telecinesi finiscono immediatamente per tutti i Pokémon in campo. Durante l'effetto, Rimbalzo, Volo, Schiacciatuffo, Calcinvolo, Calciosalto, Magnetascesa, Cadutalibera, Splash e Telecinesi non possono essere usate dai Pokémon in campo. Gli attacchi di tipo Terra, Punte, Fielepunte, Rete Vischiosa e l'abilità Trappoarena possono influenzare i Pokémon di tipo Volante o con l'abilità Levitazione. Fallisce se questo effetto è già attivo.", // NEEDS QC
		},
		gen5: {
			desc: "Per 5 turni, l'elusione di tutti i Pokémon attivi è moltiplicata per 0,6. Al momento dell'uso, Rimbalzo, Volo, Magnetascesa, Cadutalibera e Telecinesi finiscono immediatamente per tutti i Pokémon. Durante l'effetto, Rimbalzo, Volo, Calcinvolo, Calciosalto, Magnetascesa, Cadutalibera, Splash e Telecinesi non possono essere usate da alcun Pokémon. Gli attacchi di tipo Terra, Punte, Fielepunte e l'abilità Trappoarena possono colpire i Pokémon di tipo Volante o con l'abilità Levitazione. Fallisce se l'effetto è già attivo.", // NEEDS QC
		},
		gen4: {
			desc: "Per 5 turni, l'elusione di tutti i Pokémon attivi è moltiplicata per 0,6. Al momento dell'uso, Rimbalzo, Volo e Magnetascesa finiscono immediatamente per tutti i Pokémon. Durante l'effetto, Rimbalzo, Volo, Calcinvolo, Calciosalto, Magnetascesa e Splash non possono essere usate da alcun Pokémon. Gli attacchi di tipo Terra, Punte, Fielepunte e l'abilità Trappoarena possono colpire i Pokémon di tipo Volante o con l'abilità Levitazione. Fallisce se l'effetto è già attivo.", // NEEDS QC
		},
	},
	growl: {
		name: "Ruggito",
		// Official flavor text: "Distrae i nemici intorno con un tenero ruggito e ne riduce l’Attacco."
		desc: "Riduce l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce l'Attacco dei nemici di 1.", // NEEDS QC
		gen2: {
			shortDesc: "Riduce l'Attacco del bersaglio di 1.", // NEEDS QC
		},
	},
	growth: {
		name: "Crescita",
		// Official flavor text: "Provoca la crescita immediata del corpo e l’aumento dell’Attacco e dell’Attacco Speciale di chi la usa."
		desc: "Aumenta l'Attacco e l'Attacco Speciale di chi la usa di un livello. Se il tempo è Sole intenso o Sole accecante, li aumenta di 2 livelli. Se chi la usa ha un Superombrello, aumentano solo di un livello anche con Sole intenso o Sole accecante.", // NEEDS QC
		shortDesc: "+1 Attacco e Att. Sp. di chi la usa (+2 col sole).", // NEEDS QC
		gen7: {
			desc: "Aumenta l'Attacco e l'Attacco Speciale di chi la usa di un livello. Con la luce solare intensa o estremamente intensa, aumentano di 2 livelli.", // NEEDS QC
		},
		gen5: {
			desc: "Aumenta l'Attacco e l'Attacco Speciale di chi la usa di un livello. Con Sole intenso, aumentano di 2 livelli.", // NEEDS QC
		},
		gen4: {
			desc: "Aumenta l'Attacco Speciale di chi la usa di un livello.", // NEEDS QC
			shortDesc: "Aumenta l'Att. Sp. di chi la usa di 1.", // NEEDS QC
		},
		gen1: {
			desc: "Aumenta lo Speciale di chi la usa di un livello.", // NEEDS QC
			shortDesc: "Aumenta lo Speciale di chi la usa di 1.", // NEEDS QC
		},
	},
	grudge: {
		name: "Rancore",
		// Official flavor text: "Se chi la usa va KO, i PP della mossa nemica che lo ha messo fuori gioco si azzerano."
		desc: "Fino alla prossima azione di chi la usa, se un attacco avversario lo manda KO, quella mossa perde tutti i PP restanti.", // NEEDS QC
		shortDesc: "Se chi la usa va KO, la mossa usata perde i PP.", // NEEDS QC

		activate: "  La mossa {MOVE} di {POKEMON} perde tutti i PP a causa del rancore!",
		start: "{POKEMON} avvolge l’avversario in un’aura di rancore!",
	},
	guardianofalola: {
		name: "Collera del Guardiano",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Infligge al bersaglio danni pari a 3/4 dei suoi PS attuali, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Infligge 3/4 dei PS attuali del bersaglio.", // NEEDS QC
	},
	guardsplit: {
		name: "Paridifesa",
		// Official flavor text: "Chi la usa sfrutta la sua forza psichica per sommare Difesa e Difesa Speciale a quelle del bersaglio e dividerle equamente."
		desc: "La Difesa e la Difesa Speciale di chi la usa e del bersaglio vengono impostate alla media delle rispettive statistiche, arrotondato per difetto. I livelli delle statistiche non sono influenzati.", // NEEDS QC
		shortDesc: "Media di Dif e Dif. Sp. con il bersaglio.", // NEEDS QC

		activate: "  {POKEMON} somma le sue capacità difensive con quelle del bersaglio e le ripartisce equamente!",
	},
	guardswap: {
		name: "Barattoscudo",
		// Official flavor text: "Chi la usa sfrutta la sua forza psichica per scambiare le modifiche a Difesa e Difesa Speciale con il bersaglio."
		desc: "Chi la usa scambia i propri livelli di Difesa e Difesa Speciale con quelli del bersaglio.", // NEEDS QC
		shortDesc: "Scambia i cambi di Dif e Dif. Sp. con il bersaglio.", // NEEDS QC
	},
	guillotine: {
		name: "Ghigliottina",
		// Official flavor text: "Attacca il bersaglio con pericolose tenaglie. Se l’attacco va a segno, il Pokémon colpito va subito KO."
		desc: "Infligge al bersaglio danni pari ai suoi PS max. Ignora i modificatori di precisione ed elusione. La precisione di questo attacco è pari a (livello di chi la usa - livello del bersaglio + 30)%, e fallisce se il bersaglio è di livello superiore. I Pokémon con l'abilità Vigore sono immuni.", // NEEDS QC
		shortDesc: "KO in un colpo. Fallisce se il livello è inferiore.", // NEEDS QC
		gen2: {
			desc: "Infligge 65535 danni al bersaglio. La precisione di questa mossa su 256 è pari al minore tra (2 × (livello di chi la usa − livello del bersaglio) + 76) e 255, prima di applicare i modificatori di precisione ed elusione. Fallisce se il bersaglio è di livello superiore.", // NEEDS QC
		},
		gen1: {
			desc: "Infligge 65535 danni al bersaglio. Fallisce se la Velocità del bersaglio è superiore a quella di chi la usa.", // NEEDS QC
			shortDesc: "65535 danni. Fallisce se il bersaglio è più veloce.", // NEEDS QC
		},
	},
	gunkshot: {
		name: "Sporcolancio",
		// Official flavor text: "Chi la usa attacca il bersaglio con rifiuti sudici che possono anche avvelenarlo."
		desc: "Ha il 30% di probabilità di avvelenare il bersaglio.", // NEEDS QC
		shortDesc: "30% di avvelenare il bersaglio.", // NEEDS QC
	},
	gust: {
		name: "Raffica",
		// Official flavor text: "Infligge danni al bersaglio con una folata di vento sollevata dalle ali."
		desc: "La potenza raddoppia se il bersaglio sta usando Rimbalzo, Volo o Cadutalibera, o è sotto l'effetto di Cadutalibera.", // NEEDS QC
		shortDesc: "Potenza x2 contro Rimbalzo, Volo e Cadutalibera.", // NEEDS QC
		gen4: {
			desc: "La potenza raddoppia se il bersaglio sta usando Rimbalzo o Volo.", // NEEDS QC
			shortDesc: "Potenza doppia contro Rimbalzo e Volo.", // NEEDS QC
		},
		gen2: {
			desc: "La potenza raddoppia se il bersaglio sta usando Volo.", // NEEDS QC
			shortDesc: "Potenza doppia contro Volo.", // NEEDS QC
		},
		gen1: {
			desc: "Nessun effetto aggiuntivo.", // NEEDS QC
			shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		},
	},
	gyroball: {
		name: "Vortexpalla",
		// Official flavor text: "Chi la usa si scaglia sul bersaglio facendo ruotare vorticosamente il proprio corpo. Più lento è chi la usa, maggiore è il danno."
		desc: "La potenza è pari a (25 × Velocità attuale del bersaglio / Velocità attuale di chi la usa) + 1, arrotondato per difetto, fino a un massimo di 150. Se la Velocità attuale di chi la usa è 0, la potenza è 1.", // NEEDS QC
		shortDesc: "Più potente se più lento del bersaglio.", // NEEDS QC
		gen5: {
			desc: "La potenza è pari a (25 × Velocità attuale del bersaglio ÷ Velocità attuale di chi la usa) + 1, arrotondato per difetto, ma non più di 150. Se la Velocità attuale di chi la usa è 0, viene trattata come 1.", // NEEDS QC
		},
	},
	hail: {
		name: "Grandine",
		// Official flavor text: "Chi la usa causa una grandinata che dura cinque turni. Danneggia tutti i Pokémon tranne quelli di tipo Ghiaccio."
		desc: "Per 5 turni, il tempo diventa grandine. Alla fine di ogni turno tranne l'ultimo, tutti i Pokémon in campo perdono 1/16 dei loro PS max, arrotondato per difetto, a meno che non siano di tipo Ghiaccio o abbiano l'abilità Corpogelo, Magicscudo, Copricapo o Mantelneve. Dura 8 turni se chi la usa ha una Rocciafredda. Fallisce se il tempo attuale è già grandine.", // NEEDS QC
		shortDesc: "Per 5 turni, cade la grandine.", // NEEDS QC
		gen4: {
			desc: "Per 5 turni, grandina. Alla fine di ogni turno tranne l'ultimo, tutti i Pokémon attivi perdono 1/16 dei loro PS max, arrotondato per difetto, a meno che non siano di tipo Ghiaccio o abbiano l'abilità Corpogelo, Magicscudo o Mantelneve. Dura 8 turni se chi la usa ha una Rocciafredda. Fallisce se sta già grandinando.", // NEEDS QC
		},
		gen3: {
			desc: "Per 5 turni, grandina. Alla fine di ogni turno tranne l'ultimo, tutti i Pokémon attivi perdono 1/16 dei loro PS max, arrotondato per difetto, a meno che non siano di tipo Ghiaccio. Fallisce se sta già grandinando.", // NEEDS QC
		},
	},
	hammerarm: {
		name: "Martelpugno",
		// Official flavor text: "Infligge danni al bersaglio colpendolo con un pugno molto potente. Riduce la Velocità di chi la usa."
		desc: "Riduce la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Riduce la Velocità di chi la usa di 1.", // NEEDS QC
	},
	happyhour: {
		name: "Cuccagna",
		shortDesc: "Nessuna utilità in lotta.", // NEEDS QC

		activate: "  Una sensazione di euforia si diffonde nell’aria!",
	},
	harden: {
		name: "Rafforzatore",
		// Official flavor text: "Tutti i muscoli del corpo si tonificano per aumentare la Difesa."
		desc: "Aumenta la Difesa di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta la Difesa di chi la usa di 1.", // NEEDS QC
	},
	hardpress: {
		name: "Pressa d’Acciaio",
		desc: "La potenza è pari a 100 × (PS attuali del bersaglio / PS max del bersaglio), arrotondato per difetto da 0,5, ma non meno di 1.", // NEEDS QC
		shortDesc: "Più potente se il bersaglio ha molti PS.", // NEEDS QC
	},
	haze: {
		name: "Nube",
		// Official flavor text: "Chi la usa crea una nube nera che annulla ogni modifica alle statistiche di tutti i Pokémon in campo."
		desc: "Azzera i livelli delle statistiche di tutti i Pokémon in campo.", // NEEDS QC
		shortDesc: "Annulla tutti i cambi di statistiche.", // NEEDS QC
		gen1: {
			desc: "Azzera i livelli delle statistiche di entrambi i Pokémon e rimuove le riduzioni dovute a scottatura e paralisi. Azzera i contatori di Tossina e rimuove gli effetti della confusione e di Stordiraggio, Inibitore, Focalenergia, Parassiseme, Schermoluce, Nebbia e Riflesso da entrambi i Pokémon. Rimuove il problema di stato dell'avversario.", // NEEDS QC
			shortDesc: "Azzera i livelli. Cura lo stato del nemico.", // NEEDS QC
		},

		// Only used in Gen 1
		activate: "  Eliminato ogni cambio di STATO!",
	},
	headbutt: {
		name: "Bottintesta",
		// Official flavor text: "Chi la usa si lancia diritto di testa contro il bersaglio. Può anche farlo tentennare."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
	},
	headcharge: {
		name: "Ricciolata",
		// Official flavor text: "Chi la usa carica il bersaglio con la testa in stile afro, ma subisce un po’ di danni per il contraccolpo."
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo di 1/4 dei danni.", // NEEDS QC
	},
	headlongrush: {
		name: "Scontro Frontale",
		desc: "Riduce la Difesa e la Difesa Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Riduce la Difesa e la Dif. Sp. di chi la usa di 1.", // NEEDS QC
	},
	headsmash: {
		name: "Zuccata",
		// Official flavor text: "Chi la usa attacca con tutta la potenza di cui dispone, ma subisce danni considerevoli."
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo di metà dei danni.", // NEEDS QC
		gen4: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/2 dei PS persi, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		},
	},
	healbell: {
		name: "Rintoccasana",
		// Official flavor text: "Chi la usa produce uno scampanellio che cura i problemi di stato suoi e dei Pokémon alleati."
		desc: "Tutti i Pokémon della squadra di chi la usa vengono curati dai problemi di stato. I Pokémon in campo con l'abilità Antisuono non vengono curati, a meno che non siano chi la usa.", // NEEDS QC
		shortDesc: "Cura lo stato di tutta la squadra di chi la usa.", // NEEDS QC
		gen7: {
			desc: "Ogni Pokémon della squadra viene curato dal suo problema di stato. I Pokémon attivi con l'abilità Antisuono non vengono curati.", // NEEDS QC
		},
		gen5: {
			desc: "Ogni Pokémon della squadra viene curato dal suo problema di stato. Anche i Pokémon attivi con l'abilità Antisuono vengono curati.", // NEEDS QC
		},
		gen4: {
			desc: "Ogni Pokémon della squadra viene curato dal suo problema di stato. I Pokémon con l'abilità Antisuono non vengono curati.", // NEEDS QC
		},
		gen2: {
			desc: "Tutti i Pokémon della squadra di chi la usa vengono curati dai problemi di stato.", // NEEDS QC
		},

		activate: "  Si sente suonare una campanella!",
	},
	healblock: {
		name: "Anticura",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Per 5 turni, il bersaglio non può recuperare PS finché resta in campo. Durante l'effetto, le mosse curative e assorbenti sono inutilizzabili, e le abilità e gli strumenti curativi non curano. Se un Pokémon colpito usa Staffetta, il sostituto resta incapace di recuperare PS. Malcomune e l'abilità Rigenergia non sono influenzate.", // NEEDS QC
		shortDesc: "5 turni: i nemici non possono curarsi.", // NEEDS QC
		gen8: {
			end: "  {POKEMON} può nuovamente curarsi!",
			cant: "{POKEMON} non può usare {MOVE} a causa di Anticura!",
		},
		gen7: {
			desc: "Per 5 turni, il bersaglio non può recuperare PS finché resta in campo. Durante l'effetto, le mosse di cura e assorbimento sono inutilizzabili, e le abilità e gli strumenti che curano non hanno effetto. Se un Pokémon colpito usa Staffetta, il sostituto resta incapace di recuperare PS. Malcomune e l'abilità Rigenergia non sono influenzati. Le mosse Z interessate possono comunque essere scelte ed eseguite durante questo effetto.", // NEEDS QC
		},
		gen6: {
			desc: "Per 5 turni, il bersaglio non può recuperare PS finché resta in campo. Durante l'effetto, le mosse curative e assorbenti sono inutilizzabili, e le abilità e gli strumenti curativi non curano. Se un Pokémon colpito usa Staffetta, il sostituto resta incapace di recuperare PS. Malcomune e l'abilità Rigenergia non sono influenzate.", // NEEDS QC
		},
		gen4: {
			desc: "Per 5 turni, il bersaglio non può recuperare PS finché resta in campo. Durante l'effetto, le mosse di cura sono inutilizzabili e gli effetti curativi delle mosse non agiscono, ma le abilità e gli strumenti continuano a curare. Se un Pokémon colpito usa Staffetta, il sostituto resta sotto l'effetto. Malcomune non è influenzata.", // NEEDS QC
		},

		start: "  {POKEMON} non può curarsi!",
		end: "  {POKEMON} può nuovamente curarsi!",
		cant: "{POKEMON} non può usare {MOVE} perché gli effetti curativi sono disabilitati!",
		fail: "  Ma fallisce su {POKEMON}!",
	},
	healingwish: {
		name: "Curardore",
		// Official flavor text: "Chi la usa va KO, ma il Pokémon che lo sostituisce recupera tutti i PS e guarisce dai problemi di stato."
		desc: "Chi la usa va KO, e se il Pokémon mandato a sostituirlo non ha tutti i PS o ha un problema di stato, i suoi PS vengono ripristinati del tutto e il problema di stato curato. Il sostituto entra alla fine del turno, e la cura avviene prima dell'effetto delle trappole. Questo effetto continua finché un Pokémon che soddisfa una di queste condizioni non entra nella posizione di chi la usa o non viene scambiato in quella posizione con Cambiaposto. Fallisce se chi la usa è l'ultimo Pokémon non KO della squadra.", // NEEDS QC
		shortDesc: "Va KO; il prossimo Pokémon ferito viene curato.", // NEEDS QC
		gen7: {
			desc: "Chi la usa va KO e il Pokémon che lo sostituisce recupera tutti i PS e viene curato dal suo problema di stato. Il nuovo Pokémon viene mandato in campo alla fine del turno, e la cura avviene prima dell'effetto delle trappole. Fallisce se chi la usa è l'ultimo Pokémon non KO della squadra.", // NEEDS QC
			shortDesc: "Chi la usa va KO. Il sostituto è curato del tutto.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa va KO e il Pokémon che lo sostituisce recupera tutti i PS e viene curato dal suo problema di stato. Il nuovo Pokémon viene mandato in campo immediatamente, e la cura avviene dopo l'effetto delle trappole. Fallisce se chi la usa è l'ultimo Pokémon non KO della squadra.", // NEEDS QC
		},

		heal: "  {POKEMON} riceve i benefici effetti di Curardore!",
	},
	healorder: {
		name: "Comandocura",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per eccesso da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei suoi PS max.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per difetto.", // NEEDS QC
		},
	},
	healpulse: {
		name: "Ondasana",
		// Official flavor text: "Chi la usa lancia un’onda rilassante che fa recuperare al bersaglio metà dei suoi PS massimi."
		desc: "Il bersaglio recupera metà dei suoi PS max, arrotondato per eccesso da 0,5. Se chi la usa ha l'abilità Megalancio, recupera invece 3/4 dei suoi PS max, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Il bersaglio recupera metà dei suoi PS max.", // NEEDS QC
		gen5: {
			desc: "Il bersaglio recupera metà dei suoi PS max, arrotondato per eccesso da 0,5.", // NEEDS QC
		},
	},
	heartstamp: {
		name: "Cuorestampo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
	},
	heartswap: {
		name: "Cuorbaratto",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Chi la usa scambia tutti i propri livelli delle statistiche con quelli del bersaglio.", // NEEDS QC
		shortDesc: "Scambia tutti i cambi di statistiche col bersaglio.", // NEEDS QC
	},
	heatcrash: {
		name: "Marchiafuoco",
		// Official flavor text: "Chi la usa carica con il suo corpo rovente. Più è pesante rispetto al bersaglio, più danni causa."
		desc: "La potenza dipende da (peso di chi la usa / peso del bersaglio), arrotondato per difetto. La potenza è 120 se il risultato è 5 o più, 100 se è 4, 80 se è 3, 60 se è 2, e 40 se è 1 o meno. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		shortDesc: "Più potente se chi la usa pesa più del bersaglio.", // NEEDS QC
		gen5: {
			desc: "La potenza dipende da (peso di chi la usa ÷ peso del bersaglio), arrotondato per difetto. È pari a 120 se il risultato è 5 o più, 100 se 4, 80 se 3, 60 se 2 e 40 se 1 o meno.", // NEEDS QC
		},
	},
	heatwave: {
		name: "Ondacalda",
		// Official flavor text: "Chi la usa investe i nemici che ha intorno con una folata di vento caldo. Può anche scottarli."
		desc: "Ha il 10% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "10% di scottare il bersaglio.", // NEEDS QC
	},
	heavyslam: {
		name: "Pesobomba",
		// Official flavor text: "Chi la usa si lancia contro il bersaglio con tutto il proprio peso. Più è pesante rispetto ad esso, più danni causa."
		desc: "La potenza dipende da (peso di chi la usa / peso del bersaglio), arrotondato per difetto. La potenza è 120 se il risultato è 5 o più, 100 se è 4, 80 se è 3, 60 se è 2, e 40 se è 1 o meno. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		shortDesc: "Più potente se chi la usa pesa più del bersaglio.", // NEEDS QC
		gen6: {
			desc: "La potenza dipende da (peso di chi la usa ÷ peso del bersaglio), arrotondato per difetto. È pari a 120 se il risultato è 5 o più, 100 se 4, 80 se 3, 60 se 2 e 40 se 1 o meno.", // NEEDS QC
		},
	},
	helpinghand: {
		name: "Altruismo",
		// Official flavor text: "Mossa che aumenta la potenza dell’attacco di un alleato."
		desc: "La potenza dell'attacco del bersaglio in questo turno è moltiplicata per 1,5 (questo effetto è cumulabile). Fallisce se nessun alleato è adiacente a chi la usa o se l'alleato ha già agito in questo turno, ma non fallisce se l'alleato sta usando una mossa in due turni.", // NEEDS QC
		shortDesc: "La mossa di un alleato adiacente fa x1,5 nel turno.", // NEEDS QC

		start: "  {SOURCE} è pronto ad aiutare {POKEMON}!",
	},
	hex: {
		name: "Sciagura",
		// Official flavor text: "Attacco che causa un danno enorme se il bersaglio ha problemi di stato."
		desc: "La potenza raddoppia se il bersaglio ha un problema di stato.", // NEEDS QC
		shortDesc: "Potenza doppia contro un problema di stato.", // NEEDS QC
	},
	hiddenpower: {
		name: "Introforza",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Il tipo di questa mossa dipende dai valori individuali (IV) di chi la usa, e può essere qualsiasi tipo tranne Folletto e Normale.", // NEEDS QC
		shortDesc: "Il tipo varia in base agli IV di chi la usa.", // NEEDS QC
		gen5: {
			desc: "Il tipo e la potenza di questa mossa dipendono dagli IV di chi la usa. La potenza varia tra 30 e 70, e il tipo può essere qualsiasi tranne Normale.", // NEEDS QC
			shortDesc: "Potenza e tipo variano in base agli IV.", // NEEDS QC
		},
	},
	hiddenpowerbug: {
		name: "Introforza Coleottero", // NEEDS QC
	},
	hiddenpowerdark: {
		name: "Introforza Buio", // NEEDS QC
	},
	hiddenpowerdragon: {
		name: "Introforza Drago", // NEEDS QC
	},
	hiddenpowerelectric: {
		name: "Introforza Elettro", // NEEDS QC
	},
	hiddenpowerfighting: {
		name: "Introforza Lotta", // NEEDS QC
	},
	hiddenpowerfire: {
		name: "Introforza Fuoco", // NEEDS QC
	},
	hiddenpowerflying: {
		name: "Introforza Volante", // NEEDS QC
	},
	hiddenpowerghost: {
		name: "Introforza Spettro", // NEEDS QC
	},
	hiddenpowergrass: {
		name: "Introforza Erba", // NEEDS QC
	},
	hiddenpowerground: {
		name: "Introforza Terra", // NEEDS QC
	},
	hiddenpowerice: {
		name: "Introforza Ghiaccio", // NEEDS QC
	},
	hiddenpowerpoison: {
		name: "Introforza Veleno", // NEEDS QC
	},
	hiddenpowerpsychic: {
		name: "Introforza Psico", // NEEDS QC
	},
	hiddenpowerrock: {
		name: "Introforza Roccia", // NEEDS QC
	},
	hiddenpowersteel: {
		name: "Introforza Acciaio", // NEEDS QC
	},
	hiddenpowerwater: {
		name: "Introforza Acqua", // NEEDS QC
	},
	highhorsepower: {
		name: "Forza Equina",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	highjumpkick: {
		name: "Calcinvolo",
		// Official flavor text: "Chi la usa colpisce il bersaglio con una ginocchiata in volo. Se fallisce, subisce danni."
		desc: "Se questo attacco fallisce, chi la usa perde metà dei suoi PS max, arrotondato per difetto, come danni da fallimento. I Pokémon con l'abilità Magicscudo non subiscono i danni da fallimento.", // NEEDS QC
		shortDesc: "Se fallisce, chi la usa perde metà dei PS max.", // NEEDS QC
		gen4: {
			desc: "Se questo attacco non va a segno, chi la usa perde come danni da caduta metà dei PS max del bersaglio, arrotondato per difetto, se questo era immune, altrimenti metà dei danni che il bersaglio avrebbe subito, arrotondato per difetto, ma non meno di 1 PS né più di metà dei PS max del bersaglio. I Pokémon con l'abilità Magicscudo non subiscono danni da caduta.", // NEEDS QC
			shortDesc: "Se manca, chi la usa subisce 1/2 dei danni previsti.", // NEEDS QC
		},
		gen3: {
			desc: "Se questo attacco non va a segno e il bersaglio non era immune, chi la usa perde come danni da caduta metà dei danni che il bersaglio avrebbe subito, arrotondato per difetto, ma non meno di 1 PS né più di metà dei PS max del bersaglio.", // NEEDS QC
			shortDesc: "Se manca, chi la usa subisce 1/2 dei danni previsti.", // NEEDS QC
		},
		gen2: {
			desc: "Se questo attacco non va a segno e il bersaglio non era immune, chi la usa perde come danni da caduta 1/8 dei danni che il bersaglio avrebbe subito, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
			shortDesc: "Se manca, chi la usa subisce 1/8 dei danni previsti.", // NEEDS QC
		},
		gen1: {
			desc: "Se questo attacco manca il bersaglio, chi la usa subisce 1 PS di danni da caduta. Se chi la usa ha un sostituto, questi danni vengono inflitti al sostituto del bersaglio se ne ha uno, altrimenti non vengono inflitti danni da caduta.", // NEEDS QC
			shortDesc: "Se manca, chi la usa perde 1 PS.", // NEEDS QC
		},

		damage: "#crash",
	},
	holdback: {
		name: "Riguardo",
		// Official flavor text: "Chi la usa attacca il bersaglio, modulando il colpo in modo da lasciargli almeno un PS."
		desc: "Lascia il bersaglio con almeno 1 PS.", // NEEDS QC
		shortDesc: "Lascia sempre almeno 1 PS al bersaglio.", // NEEDS QC
	},
	holdhands: {
		name: "Mano nella Mano",
		// Official flavor text: "Il Pokémon che la usa e un alleato si prendono per mano e fanno salti di gioia."
		desc: "Nessuna utilità in lotta. Fallisce se nessun alleato è adiacente a chi la usa.", // NEEDS QC
		shortDesc: "Nessuna utilità in lotta.", // NEEDS QC
	},
	honeclaws: {
		name: "Unghiaguzze",
		// Official flavor text: "Chi la usa affila i propri artigli aumentando Attacco e precisione."
		desc: "Aumenta l'Attacco e la precisione di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta l'Attacco e la precisione di chi la usa di 1.", // NEEDS QC
	},
	hornattack: {
		name: "Incornata",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	horndrill: {
		name: "Perforcorno",
		// Official flavor text: "Colpisce il bersaglio con un corno perforante come un trapano. Se il colpo va a segno, il Pokémon colpito va KO."
		desc: "Infligge al bersaglio danni pari ai suoi PS max. Ignora i modificatori di precisione ed elusione. La precisione di questo attacco è pari a (livello di chi la usa - livello del bersaglio + 30)%, e fallisce se il bersaglio è di livello superiore. I Pokémon con l'abilità Vigore sono immuni.", // NEEDS QC
		shortDesc: "KO in un colpo. Fallisce se il livello è inferiore.", // NEEDS QC
		gen2: {
			desc: "Infligge 65535 danni al bersaglio. La precisione di questa mossa su 256 è pari al minore tra (2 × (livello di chi la usa − livello del bersaglio) + 76) e 255, prima di applicare i modificatori di precisione ed elusione. Fallisce se il bersaglio è di livello superiore.", // NEEDS QC
		},
		gen1: {
			desc: "Infligge 65535 danni al bersaglio. Fallisce se la Velocità del bersaglio è superiore a quella di chi la usa.", // NEEDS QC
			shortDesc: "65535 danni. Fallisce se il bersaglio è più veloce.", // NEEDS QC
		},
	},
	hornleech: {
		name: "Legnicorno",
		// Official flavor text: "Chi la usa infilza il bersaglio con le corna e assorbe una quantità di PS pari a metà del danno inferto."
		desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei danni inflitti.", // NEEDS QC
	},
	howl: {
		name: "Gridodilotta",
		// Official flavor text: "Chi la usa emette un forte verso per darsi coraggio e aumentare il proprio Attacco e quello degli alleati."
		desc: "Aumenta l'Attacco di chi la usa e di tutti gli alleati di un livello.", // NEEDS QC
		shortDesc: "+1 Attacco di chi la usa e dell'alleato.", // NEEDS QC
		gen7: {
			desc: "Aumenta l'Attacco di chi la usa di un livello.", // NEEDS QC
			shortDesc: "Aumenta l'Attacco di chi la usa di 1.", // NEEDS QC
		},
	},
	hurricane: {
		name: "Tifone",
		// Official flavor text: "Chi la usa attacca il bersaglio avvolgendolo con un vento fortissimo. Può anche confonderlo."
		desc: "Ha il 30% di probabilità di confondere il bersaglio. Questa mossa può colpire un bersaglio che sta usando Rimbalzo, Volo o Cadutalibera, o sotto l'effetto di Cadutalibera. Se il tempo è Acquazzone o Pioggia, questa mossa non verifica la precisione. Se il tempo è Sole accecante o Sole intenso, la precisione è del 50%. Se usata contro un Pokémon con un Superombrello, la precisione resta al 70%.", // NEEDS QC
		shortDesc: "30% di confondere. Non fallisce con la pioggia.", // NEEDS QC
		gen7: {
			desc: "Ha il 30% di probabilità di confondere il bersaglio. Questa mossa può colpire un bersaglio che sta usando Rimbalzo, Volo o Cadutalibera, o sotto l'effetto di Cadutalibera. Con la pioggia battente o Pioggia, questa mossa non verifica la precisione. Con la luce solare estremamente intensa o Sole intenso, la sua precisione è del 50%.", // NEEDS QC
		},
		gen5: {
			desc: "Ha il 30% di probabilità di confondere il bersaglio. Questa mossa può colpire un bersaglio che sta usando Rimbalzo, Volo o Cadutalibera, o sotto l'effetto di Cadutalibera. Con Pioggia, questa mossa non verifica la precisione. Con Sole intenso, la sua precisione è del 50%.", // NEEDS QC
		},
	},
	hydrocannon: {
		name: "Idrocannone",
		// Official flavor text: "Colpisce il bersaglio con un potente getto d’acqua. Chi la usa salta il turno successivo."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
	},
	hydropump: {
		name: "Idropompa",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	hydrosteam: {
		name: "Idrovapore",
		desc: "Se il tempo attuale è Sole intenso e chi la usa non ha un Superombrello, i danni di questa mossa sono moltiplicati per 1,5 invece di essere dimezzati per il suo tipo Acqua.", // NEEDS QC
		shortDesc: "Col sole: danni x1,5 invece che dimezzati.", // NEEDS QC
	},
	hydrovortex: {
		name: "Idrovortice Abissale",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	hyperbeam: {
		name: "Iper Raggio",
		// Official flavor text: "Colpisce il bersaglio con un potente raggio. Chi la usa salta il turno successivo per recuperare energia."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
		gen1: {
			desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può scegliere mosse, a meno che il bersaglio o il suo sostituto non sia stato mandato KO da questa mossa.", // NEEDS QC
			shortDesc: "Deve riposare se il bersaglio non va KO.", // NEEDS QC
		},
	},
	hyperdrill: {
		name: "Ipertrapano",
		shortDesc: "Supera le protezioni senza romperle.", // NEEDS QC
	},
	hyperfang: {
		name: "Iperzanna",
		// Official flavor text: "Chi la usa morde il bersaglio con i suoi incisivi affilati. Può anche farlo tentennare."
		desc: "Ha il 10% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "10% di far tentennare il bersaglio.", // NEEDS QC
	},
	hyperspacefury: {
		name: "Urtodimensionale",
		// Official flavor text: "Permette di attaccare ripetutamente grazie ai molti arti, ignorando mosse come Protezione o Individua. Riduce la Difesa di chi la usa."
		desc: "Riduce la Difesa di chi la usa di un livello. Questa mossa può essere usata con successo solo se la forma attuale di chi la usa, considerando Trasformazione, è Hoopa Libero. Se questa mossa va a segno, rompe gli effetti di Fortino, Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno.", // NEEDS QC
		shortDesc: "Hoopa Libero: -1 Dif; rompe le protezioni.", // NEEDS QC
		gen6: {
			desc: "Riduce la Difesa di chi la usa di un livello. Questa mossa può essere usata solo se la forma attuale di chi la usa, considerando Trasformazione, è Hoopa Libero. Se questa mossa va a segno, rompe Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno.", // NEEDS QC
		},

		activate: "#shadowforce",
		fail: "#darkvoid",
	},
	hyperspacehole: {
		name: "Forodimensionale",
		// Official flavor text: "Chi la usa sfrutta un passaggio interdimensionale per comparire a fianco del bersaglio e colpirlo, eludendo mosse come Protezione e Individua."
		desc: "Se questa mossa va a segno, rompe gli effetti di Fortino, Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno.", // NEEDS QC
		shortDesc: "Rompe la protezione del bersaglio nel turno.", // NEEDS QC
		gen6: {
			desc: "Se questa mossa va a segno, rompe Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno.", // NEEDS QC
		},

		activate: "#shadowforce",
	},
	hypervoice: {
		name: "Granvoce",
		// Official flavor text: "Chi la usa lancia un urlo straziante che danneggia i nemici intorno a sé."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i nemici adiacenti.", // NEEDS QC
	},
	hypnosis: {
		name: "Ipnosi",
		shortDesc: "Addormenta il bersaglio.", // NEEDS QC
	},
	iceball: {
		name: "Palla Gelo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Se questa mossa va a segno, chi la usa resta bloccato su di essa e non può fare altre azioni finché non fallisce, non passano 5 turni o l'attacco non può essere usato. La potenza raddoppia a ogni colpo riuscito, e raddoppia di nuovo se chi la usa ha usato Ricciolscudo in precedenza. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno.", // NEEDS QC
		shortDesc: "Potenza doppia a ogni colpo. Si ripete 5 turni.", // NEEDS QC
		gen7: {
			desc: "Se questa mossa va a segno, chi la usa resta bloccato su di essa e non può usare altre mosse finché non manca il bersaglio, non passano 5 turni o l'attacco non può essere usato. La potenza raddoppia a ogni colpo riuscito e raddoppia ancora se chi la usa ha usato Ricciolscudo in precedenza. Se questa mossa è usata tramite Sonnolalia, viene usata per un turno. Se questa mossa colpisce un Fantasmanto attivo durante l'effetto, il moltiplicatore di potenza si mette in pausa ma il contatore dei turni no, il che può permettere di applicare il moltiplicatore alla mossa successiva dopo la fine dell'effetto.", // NEEDS QC
		},
		gen6: {
			desc: "Se questa mossa va a segno, chi la usa resta bloccato su di essa e non può fare altre azioni finché non fallisce, non passano 5 turni o l'attacco non può essere usato. La potenza raddoppia a ogni colpo riuscito, e raddoppia di nuovo se chi la usa ha usato Ricciolscudo in precedenza. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno.", // NEEDS QC
		},
	},
	icebeam: {
		name: "Geloraggio",
		// Official flavor text: "Il bersaglio è colpito da un raggio di energia gelida che può anche congelarlo."
		desc: "Ha il 10% di probabilità di congelare il bersaglio.", // NEEDS QC
		shortDesc: "10% di congelare il bersaglio.", // NEEDS QC
	},
	iceburn: {
		name: "Vampagelida",
		// Official flavor text: "Chi la usa attacca il bersaglio al turno successivo e lo avvolge in un soffio d’aria gelida. Può anche scottarlo."
		desc: "Ha il 30% di probabilità di scottare il bersaglio. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Carica, colpisce al turno 2. 30% di scottare.", // NEEDS QC

		prepare: "  {POKEMON} è avvolto da un’atmosfera gelida!",
	},
	icefang: {
		name: "Gelodenti",
		// Official flavor text: "Chi la usa morde con denti ghiacciati. Può anche congelare o far tentennare il bersaglio."
		desc: "Ha il 10% di probabilità di congelare il bersaglio e il 10% di farlo tentennare.", // NEEDS QC
		shortDesc: "10% di congelare. 10% di far tentennare.", // NEEDS QC
	},
	icehammer: {
		name: "Martelgelo",
		// Official flavor text: "Infligge danni al bersaglio colpendolo con un pugno molto potente. Riduce la Velocità di chi la usa."
		desc: "Riduce la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Riduce la Velocità di chi la usa di 1.", // NEEDS QC
	},
	icepunch: {
		name: "Gelopugno",
		// Official flavor text: "Colpisce il bersaglio con un pugno di ghiaccio che può congelarlo."
		desc: "Ha il 10% di probabilità di congelare il bersaglio.", // NEEDS QC
		shortDesc: "10% di congelare il bersaglio.", // NEEDS QC
	},
	iceshard: {
		name: "Geloscheggia",
		// Official flavor text: "Chi la usa crea dei pezzi di ghiaccio e li lancia. Questa mossa ha priorità alta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
	},
	icespinner: {
		name: "Vortighiaccio",
		desc: "Pone fine agli effetti di Campo Elettrico, Campo Erboso, Campo Nebbioso e Campo Psichico.", // NEEDS QC
		shortDesc: "Pone fine agli effetti dei campi.", // NEEDS QC
	},
	iciclecrash: {
		name: "Scagliagelo",
		// Official flavor text: "Chi la usa attacca violentemente il bersaglio con grosse stalattiti di ghiaccio che possono anche farlo tentennare."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
	},
	iciclespear: {
		name: "Gelolancia",
		// Official flavor text: "Chi la usa spara ghiaccioli affilati contro il bersaglio da due a cinque volte di fila."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
	},
	icywind: {
		name: "Ventogelato",
		// Official flavor text: "Chi la usa attacca i nemici intorno con una folata di aria gelida e ne riduce anche la Velocità."
		desc: "Ha il 100% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Velocità dei nemici di 1.", // NEEDS QC
		gen2: {
			shortDesc: "100% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
		},
	},
	imprison: {
		name: "Esclusiva",
		// Official flavor text: "Chi la usa impedisce al nemico di usare mosse che conoscono entrambi."
		desc: "Gli avversari non possono più usare le mosse che anche chi la usa conosce, finché resta in campo.", // NEEDS QC
		shortDesc: "I nemici non possono usare le sue stesse mosse.", // NEEDS QC
		gen7: {
			desc: "Finché chi la usa resta in campo, i Pokémon avversari non possono usare le mosse che anche chi la usa conosce. Le mosse potenziate dalla Forza Z possono comunque essere scelte ed eseguite durante l'effetto.", // NEEDS QC
		},
		gen6: {
			desc: "Gli avversari non possono più usare le mosse che anche chi la usa conosce, finché resta in campo.", // NEEDS QC
		},
		gen4: {
			desc: "Finché chi la usa resta in campo, i Pokémon avversari non possono usare le mosse che anche chi la usa conosce. Fallisce se nessun avversario conosce una delle mosse di chi la usa.", // NEEDS QC
		},

		start: "  {POKEMON} ha bloccato le mosse in comune con l’avversario!",
		cant: "{POKEMON} non può usare la mossa {MOVE}: è bloccata!",
	},
	incinerate: {
		name: "Bruciatutto",
		// Official flavor text: "Attacca i nemici che ha intorno con una fiammata. Il fuoco distruggerà le bacche o alcuni tipi di strumenti che i Pokémon hanno con sé."
		desc: "Il bersaglio perde il suo strumento se è una bacca o una gemma. Questa mossa non può far perdere lo strumento ai Pokémon con l'abilità Antifurto. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		shortDesc: "Distrugge la bacca o la gemma dei nemici.", // NEEDS QC
		gen5: {
			desc: "Il bersaglio perde il suo strumento se è una bacca. Questa mossa non può far perdere lo strumento ai Pokémon con l'abilità Antifurto. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
			shortDesc: "Distrugge la bacca dei nemici.", // NEEDS QC
		},

		removeItem: "  {ITEM:definite:capitalize} di {POKEMON} v{INFLECT:ITEM:ms=iene distrutto:fs=iene distrutta:mp=engono distrutti:fp=engono distrutte} dal fuoco!",
	},
	infernalparade: {
		name: "Corteo Spettrale",
		desc: "Ha il 30% di probabilità di scottare il bersaglio. La potenza raddoppia se il bersaglio ha un problema di stato.", // NEEDS QC
		shortDesc: "30% di scottare. Potenza x2 contro chi ha uno stato.", // NEEDS QC
	},
	inferno: {
		name: "Marchiatura",
		// Official flavor text: "Il bersaglio viene avvolto da intense fiammate che causano scottature."
		desc: "Ha il 100% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "100% di scottare il bersaglio.", // NEEDS QC
	},
	infernooverdrive: {
		name: "Fiammobomba Detonante",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	infestation: {
		name: "Assillo",
		// Official flavor text: "Chi la usa lancia un attacco che tormenta il bersaglio per quattro o cinque turni, durante i quali gli impedisce di fuggire."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},

		start: "  {POKEMON} subisce l’assillo di {SOURCE}!",
	},
	ingrain: {
		name: "Radicamento",
		// Official flavor text: "Chi la usa mette delle radici che gli fanno recuperare PS a ogni turno. Non può essere sostituito."
		desc: "Chi la usa recupera 1/16 dei suoi PS max alla fine di ogni turno, ma non può più essere sostituito e gli altri Pokémon non possono costringerlo a lasciare il campo. Può comunque essere sostituito se usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. Se lascia il campo con Staffetta, il sostituto resta intrappolato e riceve l'effetto curativo. Durante l'effetto, chi la usa può essere colpito normalmente dagli attacchi di tipo Terra ed essere influenzato da Punte, Fielepunte e Rete Vischiosa, anche se è di tipo Volante o ha l'abilità Levitazione.", // NEEDS QC
		shortDesc: "Si radica: +1/16 dei PS a turno, non può uscire.", // NEEDS QC
		gen7: {
			desc: "Chi la usa recupera 1/16 dei suoi PS max alla fine di ogni turno, ma non può più essere sostituito e gli altri Pokémon non possono costringerlo a lasciare il campo. Può comunque essere sostituito se usa Staffetta, Monito, Retromarcia o Invertivolt. Se lascia il campo con Staffetta, il sostituto resta intrappolato e continua a ricevere la cura. Durante l'effetto, chi la usa può essere colpito normalmente dagli attacchi di tipo Terra ed essere influenzato da Punte, Fielepunte e Rete Vischiosa, anche se è di tipo Volante o ha l'abilità Levitazione.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa recupera 1/16 dei suoi PS max alla fine di ogni turno, ma non può più essere sostituito e gli altri Pokémon non possono costringerlo a lasciare il campo. Può comunque essere sostituito se usa Staffetta, Retromarcia o Invertivolt. Se lascia il campo con Staffetta, il sostituto resta intrappolato e continua a ricevere la cura. Durante l'effetto, chi la usa può essere colpito normalmente dagli attacchi di tipo Terra ed essere influenzato da Punte e Fielepunte, anche se è di tipo Volante o ha l'abilità Levitazione.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa recupera 1/16 dei suoi PS max alla fine di ogni turno, ma non può più essere sostituito e gli altri Pokémon non possono costringerlo a lasciare il campo. Può comunque essere sostituito se usa Staffetta o Retromarcia. Se lascia il campo con Staffetta, il sostituto resta intrappolato e continua a ricevere la cura. Durante l'effetto, chi la usa può essere colpito normalmente dagli attacchi di tipo Terra ed essere influenzato da Punte e Fielepunte, anche se è di tipo Volante o ha l'abilità Levitazione.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa recupera 1/16 dei suoi PS max alla fine di ogni turno, ma non può più essere sostituito e gli altri Pokémon non possono costringerlo a lasciare il campo. Può comunque essere sostituito se usa Staffetta; il sostituto resta intrappolato e continua a ricevere la cura.", // NEEDS QC
			shortDesc: "Recupera 1/16 a turno. Non può più uscire.", // NEEDS QC
		},

		start: "  {POKEMON} pianta le radici!",
		block: "  {POKEMON} è ancorato al suolo grazie alle radici!",
		heal: "  {POKEMON} assorbe sostanze nutritive con le radici!",
	},
	instruct: {
		name: "Imposizione",
		// Official flavor text: "Costringe il bersaglio a ripetere immediatamente l’ultima mossa che ha sferrato."
		desc: "Il bersaglio usa immediatamente la sua ultima mossa usata. Fallisce se il bersaglio non ha ancora agito, se la mossa ha 0 PP, se il bersaglio sta preparando Cannonbecco, Centripugno o Gusciotrappola, o se la mossa è Assistente, Cannonbecco, Rutto, Pazienza, Turboustione, Auguri, Schiamazzo, Turborissa, Copione, Cannone Dynamax, Centripugno, Mano nella Mano, Palla Gelo, Imposizione, Scudo Reale, Turboincanto, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Turbotossina, Sbarramento, Oltraggio, Petalodanza, Rotolamento, Gusciotrappola, Schizzo, Sonnolalia, Scontro, Colpo, Trasformazione, Baraonda o Turbotenebra, una mossa in due turni o una mossa con ricarica.", // NEEDS QC
		shortDesc: "Il bersaglio ripete subito la sua ultima mossa.", // NEEDS QC
		gen8: {
			desc: "Il bersaglio usa immediatamente l'ultima mossa usata. Fallisce se il bersaglio non ha ancora agito, se la mossa ha 0 PP, se il bersaglio è dynamaxizzato, se il bersaglio sta preparando Cannonbecco, Centripugno o Gusciotrappola, o se la mossa è Assistente, Cannonbecco, Rutto, Pazienza, Auguri, Schiamazzo, Copione, Cannone Dynamax, Centripugno, Mano nella Mano, Palla Gelo, Imposizione, Scudo Reale, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Sbarramento, Oltraggio, Petalodanza, Rotolamento, Gusciotrappola, Schizzo, Sonnolalia, Scontro, Colpo, Trasformazione o Baraonda, una mossa in due turni, una mossa che richiede ricarica, o una mossa Dynamax o Gigamax.", // NEEDS QC
		},
		gen7: {
			desc: "Il bersaglio usa immediatamente l'ultima mossa usata. Fallisce se il bersaglio non ha ancora agito, se la mossa ha 0 PP, se il bersaglio sta preparando Cannonbecco, Centripugno o Gusciotrappola, o se la mossa è Assistente, Cannonbecco, Rutto, Pazienza, Auguri, Schiamazzo, Copione, Centripugno, Mano nella Mano, Palla Gelo, Imposizione, Scudo Reale, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Oltraggio, Petalodanza, Rotolamento, Gusciotrappola, Schizzo, Sonnolalia, Scontro, Colpo, Trasformazione o Baraonda, una mossa in due turni, una mossa che richiede ricarica, o una mossa Z.", // NEEDS QC
		},

		activate: "  {POKEMON} costringe {TARGET} a ripetere immediatamente la mossa!",
	},
	iondeluge: {
		name: "Pioggiaplasma",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Le mosse di tipo Normale diventano di tipo Elettro in questo turno. Questo effetto si applica dopo gli altri effetti che cambiano il tipo di una mossa.", // NEEDS QC
		shortDesc: "Le mosse Normale diventano Elettro in questo turno.", // NEEDS QC

		activate: "  Una pioggia di elettroni si rovescia sui Pokémon!",
	},
	irondefense: {
		name: "Ferroscudo",
		// Official flavor text: "Il corpo di chi la usa si indurisce come il ferro, facendone salire di molto la Difesa."
		desc: "Aumenta la Difesa di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta la Difesa di chi la usa di 2.", // NEEDS QC
	},
	ironhead: {
		name: "Metaltestata",
		// Official flavor text: "Chi la usa colpisce il bersaglio con la sua testa dura come l’acciaio. Può anche farlo tentennare."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	irontail: {
		name: "Codacciaio",
		// Official flavor text: "Il bersaglio viene colpito da una robusta coda d’acciaio. Può anche ridurne la Difesa."
		desc: "Ha il 30% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "30% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
	},
	ivycudgel: {
		name: "Clava di Liane",
		desc: "Ha una probabilità più alta di brutto colpo. Se chi la usa è un Ogerpon, il tipo di questa mossa dipende dalla sua forma: tipo Acqua con la Maschera Pozzo, tipo Fuoco con la Maschera Focolare e tipo Roccia con la Maschera Fondamenta.", // NEEDS QC
		shortDesc: "Alta prob. di brutto colpo. Tipo in base alla forma.", // NEEDS QC
	},
	jawlock: {
		name: "Morsostretto",
		// Official flavor text: "Impedisce a chi la usa e al bersaglio di essere sostituiti finché non vanno KO. L’effetto svanisce se uno dei due lascia il campo."
		desc: "Impedisce a chi la usa e al bersaglio di essere sostituiti. Possono comunque essere sostituiti se uno dei due ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Chi la usa e il bersaglio non possono più uscire.", // NEEDS QC
	},
	jetpunch: {
		name: "Pugnojet",
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
	},
	judgment: {
		name: "Giudizio",
		// Official flavor text: "Chi la usa rilascia numerosi colpi di luce. Il tipo varia a seconda della lastra che ha."
		desc: "Il tipo di questa mossa dipende dalla lastra di chi la usa.", // NEEDS QC
		shortDesc: "Il tipo dipende dalla lastra che tiene.", // NEEDS QC
	},
	jumpkick: {
		name: "Calciosalto",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Se questo attacco fallisce, chi la usa perde metà dei suoi PS max, arrotondato per difetto, come danni da fallimento. I Pokémon con l'abilità Magicscudo non subiscono i danni da fallimento.", // NEEDS QC
		shortDesc: "Se fallisce, chi la usa perde metà dei PS max.", // NEEDS QC
		gen4: {
			desc: "Se questo attacco non va a segno, chi la usa perde come danni da caduta metà dei PS max del bersaglio, arrotondato per difetto, se questo era immune, altrimenti metà dei danni che il bersaglio avrebbe subito, arrotondato per difetto, ma non meno di 1 PS né più di metà dei PS max del bersaglio. I Pokémon con l'abilità Magicscudo non subiscono danni da caduta.", // NEEDS QC
			shortDesc: "Se manca, chi la usa subisce 1/2 dei danni previsti.", // NEEDS QC
		},
		gen3: {
			desc: "Se questo attacco non va a segno e il bersaglio non era immune, chi la usa perde come danni da caduta metà dei danni che il bersaglio avrebbe subito, arrotondato per difetto, ma non meno di 1 PS né più di metà dei PS max del bersaglio.", // NEEDS QC
			shortDesc: "Se manca, chi la usa subisce 1/2 dei danni previsti.", // NEEDS QC
		},
		gen2: {
			desc: "Se questo attacco non va a segno e il bersaglio non era immune, chi la usa perde come danni da caduta 1/8 dei danni che il bersaglio avrebbe subito, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
			shortDesc: "Se manca, chi la usa subisce 1/8 dei danni previsti.", // NEEDS QC
		},
		gen1: {
			desc: "Se questo attacco manca il bersaglio, chi la usa subisce 1 PS di danni da caduta. Se chi la usa ha un sostituto, questi danni vengono inflitti al sostituto del bersaglio se ne ha uno, altrimenti non vengono inflitti danni da caduta.", // NEEDS QC
			shortDesc: "Se manca, chi la usa perde 1 PS.", // NEEDS QC
		},

		damage: "#crash",
	},
	junglehealing: {
		name: "Giunglacura",
		// Official flavor text: "Il Pokémon diventa tutt’uno con la giungla, ripristinando i PS e curando i problemi di stato per sé e per l’alleato in campo."
		desc: "Ogni Pokémon della parte di chi la usa recupera 1/4 dei suoi PS max, arrotondato per eccesso da 0,5, e viene curato dal suo problema di stato.", // NEEDS QC
		shortDesc: "Squadra: +1/4 dei PS max e stato curato.", // NEEDS QC
	},
	karatechop: {
		name: "Colpokarate",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	kinesis: {
		name: "Cinèsi",
		// Official flavor text: "Chi la usa distrae il bersaglio piegando un cucchiaio e ne riduce la precisione."
		desc: "Riduce la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce la precisione del bersaglio di 1.", // NEEDS QC
	},
	kingsshield: {
		name: "Scudo Reale",
		// Official flavor text: "Chi la usa si protegge, assumendo una posizione di difesa e riducendo l’Attacco di nemici o alleati con cui entra in contatto."
		desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che provano a colpirlo con mosse da contatto vedono il proprio Attacco ridursi di un livello. Le mosse senza danni superano questa protezione. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Protegge dagli attacchi. Contatto: -1 Attacco.", // NEEDS QC
		gen8: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che provano a colpirlo con mosse da contatto vedono il loro Attacco ridursi di un livello. Le mosse di stato passano attraverso questa protezione. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che provano a colpirlo con mosse da contatto vedono il loro Attacco ridursi di 2 livelli. Le mosse di stato passano attraverso questa protezione. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
			shortDesc: "Protegge dagli attacchi. Contatto: -2 Attacco.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che provano a colpirlo con mosse da contatto vedono il loro Attacco ridursi di 2 livelli. Le mosse di stato passano attraverso questa protezione. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
	},
	knockoff: {
		name: "Privazione",
		// Official flavor text: "Attacco che fa cadere lo strumento del bersaglio, impedendone l’uso nella lotta. La sua potenza aumenta se il Pokémon colpito ha uno strumento."
		desc: "La potenza è moltiplicata per 1,5 se il bersaglio ha uno strumento, e il bersaglio lo perde se chi la usa non è KO. Un bersaglio con l'abilità Antifurto non perde lo strumento se non è KO. Questa mossa non aumenta di potenza né rimuove lo strumento se è Gemma blu, Gemma rossa, Adamasferoide, Splendisferoide, Grigiosferoide, una lastra, un modulo, una ROM, Spada rovinata, Scudo rovinato, una Capsula energetica o una maschera tenuta rispettivamente da Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradosso o Ogerpon, o se chi la usa è una di quelle specie e il bersaglio ha lo strumento corrispondente. In questo caso, i Pokémon Paradosso includono tutte le specie con le abilità Paleoattivazione e Carica Quark, tranne Vampeaguzze, Furiatonante, Massoferreo e Capoferreo. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		shortDesc: "Danni x1,5 se il bersaglio ha uno strumento; lo toglie.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "La potenza di questa mossa è moltiplicata per 1,5 se il bersaglio ha uno strumento, e il bersaglio perde il suo strumento se chi la usa non è KO. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. La potenza non aumenta e lo strumento non viene rimosso se è Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo, una ROM, Spada rovinata o Scudo rovinato avuti rispettivamente da Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen7: {
			desc: "La potenza di questa mossa è moltiplicata per 1,5 se il bersaglio ha uno strumento, e il bersaglio perde il suo strumento se chi la usa non è KO. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. La potenza non aumenta e lo strumento non viene rimosso se è un Cristallo Z, una megapietra avuta dalla specie che può megaevolversi con essa, o Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo o una ROM avuti rispettivamente da Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen6: {
			desc: "La potenza di questa mossa è moltiplicata per 1,5 se il bersaglio ha uno strumento, e il bersaglio perde il suo strumento se chi la usa non è KO. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. La potenza non aumenta e lo strumento non viene rimosso se è una megapietra avuta dalla specie che può megaevolversi con essa, o Gemma blu, Gemma rossa, Grigiosfera, una lastra o un modulo avuti rispettivamente da Kyogre, Groudon, Giratina, Arceus, Genesect, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen5: {
			desc: "Se chi la usa non è KO, il bersaglio perde il suo strumento. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rimosso se è Grigiosfera, una lastra o un modulo avuti rispettivamente da Giratina, Arceus o Genesect, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
			shortDesc: "Rimuove lo strumento del bersaglio.", // NEEDS QC
		},
		gen4: {
			desc: "Il bersaglio perde il suo strumento per il resto della lotta, a meno che lo strumento non sia una Grigiosfera o il bersaglio non abbia l'abilità Multitipo o Antifurto. Durante l'effetto, il bersaglio non può ottenere un nuovo strumento in alcun modo.", // NEEDS QC
			shortDesc: "Il bersaglio perde lo strumento per sempre.", // NEEDS QC
		},
		gen3: {
			desc: "Il bersaglio perde il suo strumento per il resto della lotta, a meno che non abbia l'abilità Antifurto. Durante l'effetto, il bersaglio non può ottenere un nuovo strumento in alcun modo.", // NEEDS QC
		},

		removeItem: "  {SOURCE} fa cadere {ITEM:definite:classified} di {POKEMON}!",
	},
	kowtowcleave: {
		name: "Genufendente",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	landswrath: {
		name: "Forza Tellurica",
		// Official flavor text: "Chi la usa raccoglie energia tellurica e ne concentra il potere sui nemici che ha intorno, danneggiandoli."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i nemici adiacenti.", // NEEDS QC
	},
	laserfocus: {
		name: "Concentrazione",
		// Official flavor text: "Chi la usa si concentra e nel turno successivo metterà sicuramente a segno un brutto colpo."
		desc: "Fino alla fine del turno successivo, gli attacchi di chi la usa saranno brutti colpi.", // NEEDS QC
		shortDesc: "Colpi sicuri e critici fino a fine turno successivo.", // NEEDS QC

		start: "  {POKEMON} si concentra!",
	},
	lashout: {
		name: "Sfogarabbia",
		// Official flavor text: "Chi la usa attacca il bersaglio con tutta la propria ira. Se ha subito riduzioni delle statistiche durante quel turno, la potenza della mossa raddoppia."
		desc: "La potenza raddoppia se i livelli delle statistiche di chi la usa sono diminuiti in questo turno.", // NEEDS QC
		shortDesc: "Potenza x2 se le sue statistiche sono calate nel turno.", // NEEDS QC
	},
	lastresort: {
		name: "Ultimascelta",
		// Official flavor text: "Per usare questa mossa, bisogna prima avvalersi in lotta di tutte le altre mosse conosciute."
		desc: "Questa mossa fallisce se chi la usa non conosce almeno un'altra mossa oltre a questa, o se non ha usato almeno una volta ciascuna delle sue altre mosse da quando è in campo o si è trasformato.", // NEEDS QC
		shortDesc: "Fallisce se non ha già usato le altre sue mosse.", // NEEDS QC
	},
	lastrespects: {
		name: "Omaggio ai KO",
		desc: "La potenza è pari a 50 + (X × 50), dove X è il numero totale di Pokémon della squadra di chi la usa andati KO, fino a un massimo di 100.", // NEEDS QC
		shortDesc: "+50 di potenza per ogni compagno andato KO.", // NEEDS QC
	},
	lavaplume: {
		name: "Lavasbuffo",
		// Official flavor text: "Chi la usa lancia fiamme scarlatte su tutti i Pokémon nelle vicinanze, danneggiandoli. Può anche scottarli."
		desc: "Ha il 30% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "30% di scottare i Pokémon adiacenti.", // NEEDS QC
	},
	leafage: {
		name: "Fogliame",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	leafblade: {
		name: "Fendifoglia",
		// Official flavor text: "Colpisce il bersaglio usando una foglia affilata come una spada. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	leafstorm: {
		name: "Verdebufera",
		// Official flavor text: "Si forma una tempesta di foglie affilate. Il contraccolpo riduce di molto l’Attacco Speciale di chi la usa."
		desc: "Riduce l'Attacco Speciale di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce l'Att. Sp. di chi la usa di 2.", // NEEDS QC
	},
	leaftornado: {
		name: "Vorticerba",
		// Official flavor text: "Chi la usa avvolge e attacca il bersaglio con foglie affilate che possono anche ridurne la precisione."
		desc: "Ha il 50% di probabilità di ridurre la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "50% di ridurre la precisione del bersaglio di 1.", // NEEDS QC
	},
	leechlife: {
		name: "Sanguisuga",
		// Official flavor text: "Mossa succhiasangue. Chi la usa recupera una quantità di PS pari alla metà del danno inferto."
		desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei danni inflitti.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto.", // NEEDS QC
		},
	},
	leechseed: {
		name: "Parassiseme",
		// Official flavor text: "Vengono piantati semi sul bersaglio. Questi sottraggono PS a ogni turno permettendo a chi la usa di curarsi."
		desc: "Il Pokémon nella posizione di chi la usa ruba 1/8 dei PS max del bersaglio, arrotondato per difetto, alla fine di ogni turno. Se il beneficiario ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5. Se il bersaglio usa Staffetta, il sostituto continua a essere prosciugato. Se il bersaglio viene sostituito o usa Glitturbine o Rapigiro con successo, l'effetto finisce. I Pokémon di tipo Erba sono immuni all'uso di questa mossa, ma non al suo effetto.", // NEEDS QC
		shortDesc: "Prosciuga 1/8 dei PS del bersaglio a ogni turno.", // NEEDS QC
		gen8: {
			desc: "Il Pokémon nella posizione di chi la usa ruba 1/8 dei PS max del bersaglio, arrotondato per difetto, alla fine di ogni turno. Se il beneficiario ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5. Se il bersaglio usa Staffetta, il sostituto continua a essere prosciugato. Se il bersaglio lascia il campo o usa Rapigiro con successo, l'effetto finisce. I Pokémon di tipo Erba sono immuni a questa mossa all'uso, ma non al suo effetto.", // NEEDS QC
		},
		gen3: {
			desc: "Il Pokémon nella posizione di chi la usa ruba 1/8 dei PS max del bersaglio, arrotondato per difetto, alla fine di ogni turno. Se il bersaglio usa Staffetta, il sostituto continua a essere prosciugato. Se il bersaglio lascia il campo o usa Rapigiro, l'effetto finisce. I Pokémon di tipo Erba sono immuni a questa mossa all'uso, ma non al suo effetto.", // NEEDS QC
		},
		gen1: {
			desc: "Alla fine di ogni turno del bersaglio, il Pokémon nella posizione di chi la usa ruba 1/16 dei PS max del bersaglio, arrotondato per difetto e moltiplicato per il contatore di Tossina attuale del bersaglio se ne ha uno, anche se il bersaglio ha meno PS rimanenti. Se il bersaglio lascia il campo o un Pokémon usa Nube, questo effetto finisce. I Pokémon di tipo Erba sono immuni a questa mossa.", // NEEDS QC
			shortDesc: "Ruba 1/16 dei PS del bersaglio ogni turno.", // NEEDS QC
		},

		start: "  {POKEMON} è pieno di semi!",
		end: "  {POKEMON} si è liberato da Parassiseme!",
		damage: "  Parassiseme sottrae energia {POKEMON:a}!",
	},
	leer: {
		name: "Fulmisguardo",
		// Official flavor text: "Terrorizza i nemici intorno con uno sguardo fulminante e intimidatorio, riducendone la Difesa."
		desc: "Riduce la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce la Difesa dei nemici di 1.", // NEEDS QC
		gen2: {
			shortDesc: "Riduce la Difesa del bersaglio di 1.", // NEEDS QC
		},
	},
	letssnuggleforever: {
		name: "Dolcesacco di Botte",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	lick: {
		name: "Leccata",
		// Official flavor text: "Una lingua lunga infligge danni al bersaglio e può anche paralizzarlo."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "30% di paralizzare il bersaglio.", // NEEDS QC
	},
	lifedew: {
		name: "Goccia Vitale",
		// Official flavor text: "Sparge tutt’intorno dell’acqua misteriosa che fa recuperare PS a sé a agli alleati in campo."
		desc: "Ogni Pokémon della parte di chi la usa recupera 1/4 dei suoi PS max, arrotondato per eccesso da 0,5.", // NEEDS QC
		shortDesc: "Cura chi la usa e gli alleati di 1/4 dei PS max.", // NEEDS QC
	},
	lightofruin: {
		name: "Luce Nefasta",
		// Official flavor text: "Concentra il potere del Fiore Eterno in un raggio di luce potentissimo con cui attacca il bersaglio. Causa danni ingenti anche a chi la usa."
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo di metà dei danni.", // NEEDS QC
	},
	lightscreen: {
		name: "Schermoluce",
		// Official flavor text: "Innalza una barriera misteriosa che riduce i danni degli attacchi speciali per sé e gli alleati per cinque turni."
		desc: "Per 5 turni, chi la usa e la sua squadra subiscono 0,5 volte i danni degli attacchi speciali, o 0,66 volte in Lotta in Doppio. I danni non vengono ridotti ulteriormente con Velaurora. I brutti colpi ignorano questo effetto. Viene rimosso dalla parte di chi la usa se lui o un alleato viene colpito da Breccia, Psicozanna o Scacciabruma. Dura 8 turni se chi la usa ha una Creta Luce. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "5 turni: danni speciali subiti dimezzati.", // NEEDS QC
		gen6: {
			desc: "Per 5 turni, chi la usa e la sua squadra subiscono 0,5 volte i danni degli attacchi speciali, o 0,66 volte in Lotta in Doppio o in Triplo. I brutti colpi ignorano questo effetto. Viene rimossa dalla parte di chi la usa se lui o un alleato viene colpito da Breccia o Scacciabruma. Dura 8 turni se chi la usa ha una Creta Luce. Fallisce se l'effetto è già attivo dalla parte di chi la usa.", // NEEDS QC
		},
		gen4: {
			desc: "Per 5 turni, chi la usa e la sua squadra subiscono 1/2 dei danni degli attacchi speciali, o 2/3 se ci sono più Pokémon attivi dalla parte di chi la usa. I brutti colpi ignorano questo effetto. Viene rimossa dalla parte di chi la usa se lui o un alleato viene colpito da Breccia o Scacciabruma. Dura 8 turni se chi la usa ha una Creta Luce. Fallisce se l'effetto è già attivo dalla parte di chi la usa.", // NEEDS QC
		},
		gen3: {
			desc: "Per 5 turni, chi la usa e la sua squadra subiscono 1/2 dei danni degli attacchi speciali, o 2/3 se ci sono più Pokémon attivi dalla parte di chi la usa. I brutti colpi ignorano questo effetto. Viene rimossa dalla parte di chi la usa se lui o un alleato viene colpito da Breccia. Fallisce se l'effetto è già attivo dalla parte di chi la usa.", // NEEDS QC
		},
		gen2: {
			desc: "Per 5 turni, chi la usa e la sua squadra hanno la Difesa Speciale raddoppiata. I brutti colpi ignorano questo effetto. Fallisce se l'effetto è già attivo dalla parte di chi la usa.", // NEEDS QC
			shortDesc: "5 turni: Dif. Sp. della squadra raddoppiata.", // NEEDS QC
		},
		gen1: {
			desc: "Finché chi la usa resta in campo, il suo Speciale è raddoppiato quando subisce danni. I brutti colpi ignorano questo effetto. Se un Pokémon usa Nube, l'effetto finisce.", // NEEDS QC
			shortDesc: "Finché è in campo, Speciale x2 quando subisce danni.", // NEEDS QC
			start: "  {POKEMON} è immune agli attacchi speciali",
		},

		start: "  La resistenza di {TEAM} agli attacchi speciali aumenta grazie a Schermoluce!",
		end: "  L’effetto di Schermoluce su {TEAM} è finito!",
	},
	lightthatburnsthesky: {
		name: "Fotodistruzione Apocalittica",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Questa mossa diventa un attacco fisico se l'Attacco di chi la usa è superiore al suo Attacco Speciale, compresi i livelli delle statistiche. Questa mossa e i suoi effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		shortDesc: "Fisica se Att > Att. Sp. Ignora le abilità.", // NEEDS QC
	},
	liquidation: {
		name: "Idrobreccia",
		// Official flavor text: "Chi la usa colpisce il bersaglio con la forza dell’acqua. Può anche ridurne la Difesa."
		desc: "Ha il 20% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "20% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
	},
	lockon: {
		name: "Localizza",
		// Official flavor text: "Chi la usa punta il bersaglio con precisione. La mossa successiva andrà a segno."
		desc: "Fino alla fine del turno successivo, il bersaglio non può evitare le mosse di chi la usa, anche se è a metà di una mossa in due turni. L'effetto finisce se chi la usa o il bersaglio lascia il campo. Fallisce se questo effetto è già attivo per chi la usa.", // NEEDS QC
		shortDesc: "La sua prossima mossa non fallirà sul bersaglio.", // NEEDS QC
		gen4: {
			desc: "Fino alla fine del turno successivo, il bersaglio non può evitare le mosse di chi la usa, nemmeno nel mezzo di una mossa in due turni. Quando questo effetto inizia contro il bersaglio, questo effetto e quello di Leggimente finiscono per ogni altro Pokémon contro quel bersaglio. Se il bersaglio lascia il campo con Staffetta, il sostituto resta sotto questo effetto. Se chi la usa lascia il campo con Staffetta, l'effetto riparte contro lo stesso bersaglio per il sostituto. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		},
		gen2: {
			desc: "Il prossimo controllo di precisione contro il bersaglio riesce. Il bersaglio evita comunque Terremoto, Abisso e Magnitudo se sta usando Volo. Se il bersaglio lascia il campo con Staffetta, il sostituto resta sotto questo effetto. Questo effetto finisce quando il bersaglio lascia il campo o viene fatto un controllo di precisione contro di lui.", // NEEDS QC
			shortDesc: "La prossima mossa non mancherà il bersaglio.", // NEEDS QC
		},

		start: "  {SOURCE} prende la mira su {POKEMON}!",
	},
	lovelykiss: {
		name: "Demonbacio",
		shortDesc: "Addormenta il bersaglio.", // NEEDS QC
	},
	lowkick: {
		name: "Colpo Basso",
		// Official flavor text: "Un calcio basso e potente che fa cadere il bersaglio. Danneggia maggiormente i Pokémon più pesanti."
		desc: "La potenza è 20 se il bersaglio pesa meno di 10 kg, 40 se meno di 25 kg, 60 se meno di 50 kg, 80 se meno di 100 kg, 100 se meno di 200 kg, e 120 se 200 kg o più.", // NEEDS QC
		shortDesc: "Più potente se il bersaglio è pesante.", // NEEDS QC
		gen2: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
			shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
		},
	},
	lowsweep: {
		name: "Calciobasso",
		// Official flavor text: "Chi la usa colpisce con un attacco fulmineo la parte inferiore del corpo del bersaglio, riducendone la Velocità."
		desc: "Ha il 100% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
	},
	luckychant: {
		name: "Fortuncanto",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Per 5 turni, chi la usa e la sua squadra non possono subire brutti colpi. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "5 turni: la squadra non subisce brutti colpi.", // NEEDS QC

		start: "  Fortuncanto protegge {TEAM} dai brutti colpi!",
		end: "  L’effetto di Fortuncanto su {TEAM} è finito!",
	},
	luminacrash: {
		name: "Fotocollisione",
		desc: "Ha il 100% di probabilità di ridurre la Difesa Speciale del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "100% di ridurre la Dif. Sp. del bersaglio di 2.", // NEEDS QC
	},
	lunarblessing: {
		name: "Invocaluna",
		desc: "Ogni Pokémon della parte di chi la usa recupera 1/4 dei suoi PS max, arrotondato per eccesso da 0,5, e viene curato dal suo problema di stato.", // NEEDS QC
		shortDesc: "Squadra: +1/4 dei PS max e stato curato.", // NEEDS QC
	},
	lunardance: {
		name: "Lunardanza",
		// Official flavor text: "Chi la usa va KO. Il Pokémon che lo sostituisce guarisce dai propri problemi di stato e recupera tutti i PS e i PP."
		desc: "Chi la usa va KO, e se il Pokémon mandato a sostituirlo non ha tutti i PS o i PP, o ha un problema di stato, i suoi PS e PP vengono ripristinati del tutto e il problema di stato curato. Il sostituto entra alla fine del turno, e la cura avviene prima dell'effetto delle trappole. Questo effetto continua finché un Pokémon che soddisfa una di queste condizioni non entra nella posizione di chi la usa o non viene scambiato in quella posizione con Cambiaposto. Fallisce se chi la usa è l'ultimo Pokémon non KO della squadra.", // NEEDS QC
		shortDesc: "Va KO; il prossimo Pokémon ferito è curato del tutto.", // NEEDS QC
		gen7: {
			desc: "Chi la usa va KO e il Pokémon che lo sostituisce recupera tutti i PS e i PP e viene curato dal suo problema di stato. Il nuovo Pokémon viene mandato in campo alla fine del turno, e la cura avviene prima dell'effetto delle trappole. Fallisce se chi la usa è l'ultimo Pokémon non KO della squadra.", // NEEDS QC
			shortDesc: "Chi la usa va KO. Sostituto curato, PP compresi.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa va KO e il Pokémon che lo sostituisce recupera tutti i PS e i PP e viene curato dal suo problema di stato. Il nuovo Pokémon viene mandato in campo immediatamente, e la cura avviene dopo l'effetto delle trappole. Fallisce se chi la usa è l'ultimo Pokémon non KO della squadra.", // NEEDS QC
		},

		heal: "  Una mistica luce lunare avvolge {POKEMON}!",
	},
	lunge: {
		name: "Assalto",
		// Official flavor text: "Chi la usa si lancia con tutte le sue forze sul bersaglio e ne riduce l’Attacco."
		desc: "Ha il 100% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Attacco del bersaglio di 1.", // NEEDS QC
	},
	lusterpurge: {
		name: "Abbagliante",
		// Official flavor text: "Chi la usa scatena un’esplosione abbagliante che può anche ridurre la Difesa Speciale del Pokémon colpito."
		desc: "Ha il 50% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "50% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
	},
	machpunch: {
		name: "Pugnorapido",
		// Official flavor text: "Chi la usa tira un pugno a una velocità impressionante. Questa mossa ha priorità alta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
	},
	magicalleaf: {
		name: "Fogliamagica",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	magicaltorque: {
		name: "Turboincanto",
		desc: "Ha il 30% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "30% di confondere il bersaglio.", // NEEDS QC
	},
	magiccoat: {
		name: "Magivelo",
		// Official flavor text: "Una barriera rimanda al mittente l’effetto di mosse come Parassiseme e di mosse che influenzano lo stato."
		desc: "Fino alla fine del turno, chi la usa non è influenzato da certe mosse senza danni che lo bersagliano: le rimbalza contro chi le ha usate. Le mosse rimbalzate così non possono essere rimbalzate di nuovo da questo effetto o dall'abilità Magispecchio. Punte, Levitoroccia, Rete Vischiosa e Fielepunte possono essere rimbalzate solo una volta per parte, dal Pokémon più a sinistra sotto questo effetto o con l'abilità Magispecchio. Le abilità Parafulmine e Acquascolo reindirizzano le rispettive mosse prima che questa mossa agisca.", // NEEDS QC
		shortDesc: "Rimbalza certe mosse di stato.", // NEEDS QC
		gen5: {
			desc: "Fino alla fine del turno, chi la usa non è influenzato da certe mosse di stato dirette contro di lui e le usa invece contro chi le ha usate. Le mosse così respinte non possono essere respinte di nuovo da questo effetto o da quello dell'abilità Magispecchio. Punte, Levitoroccia e Fielepunte possono essere respinte solo una volta per parte, dal Pokémon più a sinistra sotto questo effetto o quello dell'abilità Magispecchio. Le abilità Parafulmine e Acquascolo reindirizzano le rispettive mosse prima che questa mossa agisca.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa non è influenzato da certe mosse di stato dirette contro di lui e le usa invece contro chi le ha usate. Se la mossa mira a entrambi gli avversari, il Pokémon sotto questo effetto la respinge solo contro chi l'ha usata. L'effetto finisce quando una mossa viene respinta o alla fine del turno. Le abilità Parafulmine e Acquascolo reindirizzano le rispettive mosse prima che questa mossa agisca.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa non è influenzato da certe mosse di stato dirette contro di lui e le usa invece contro chi le ha usate. Se la mossa mira a entrambi gli avversari e il Pokémon sotto questo effetto è a sinistra, respinge la mossa mirando a entrambi gli avversari e il suo alleato non è influenzato dalla mossa originale; se è a destra, il suo alleato è influenzato dalla mossa originale ed esso respinge la mossa solo contro chi l'ha usata. L'effetto finisce quando una mossa viene respinta o alla fine del turno. Le mosse così respinte possono essere respinte di nuovo da un altro Pokémon sotto questo effetto. Se chi la usa ha l'abilità Antisuono, questa annulla le mosse sonore prima che questo effetto agisca. L'abilità Parafulmine reindirizza le mosse di tipo Elettro prima che questa mossa agisca.", // NEEDS QC
		},

		start: "  {POKEMON} si avvolge in un Magivelo!",
		move: "{POKEMON} respinge la mossa {MOVE} e la rimanda al mittente!",
	},
	magicpowder: {
		name: "Magipolvere",
		// Official flavor text: "Chi la usa getta addosso al bersaglio una polvere magica che lo rende di tipo Psico."
		desc: "Il bersaglio diventa di tipo Psico. Fallisce se il bersaglio è un Arceus o un Silvally, se è già puramente di tipo Psico o se è teracristallizzato.", // NEEDS QC
		shortDesc: "Il bersaglio diventa di tipo Psico.", // NEEDS QC
		gen8: {
			desc: "Il bersaglio diventa di tipo Psico. Fallisce se il bersaglio è un Arceus o un Silvally, o se è già puramente di tipo Psico.", // NEEDS QC
		},
	},
	magicroom: {
		name: "Magicozona",
		// Official flavor text: "Chi la usa crea una dimensione in cui l’effetto degli strumenti di tutti i Pokémon è annullato per cinque turni."
		desc: "Per 5 turni, gli strumenti di tutti i Pokémon in campo non hanno effetto. I cambi di forma causati da uno strumento non sono influenzati, ma tutti gli altri effetti di tali strumenti vengono annullati. Durante l'effetto, nessun Pokémon in campo può usare Lancio né Dononaturale. Se questa mossa viene usata durante l'effetto, l'effetto finisce.", // NEEDS QC
		shortDesc: "5 turni: nessuno strumento ha effetto.", // NEEDS QC
	},
	magmastorm: {
		name: "Magmaclisma",
		// Official flavor text: "Intrappola il bersaglio in un turbine di fuoco che dura per quattro o cinque turni."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max (1/8 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni (sempre cinque se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
			shortDesc: "Intrappola e ferisce il bersaglio per 2-5 turni.", // NEEDS QC
		},

		start: "  {POKEMON} è intrappolato in un turbine di magma!",
	},
	magnetbomb: {
		name: "Bombagnete",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	magneticflux: {
		name: "Controllo Polare",
		// Official flavor text: "Tramite il controllo dei campi magnetici, aumenta la Difesa e la Difesa Speciale dei Pokémon alleati dotati delle abilità Più o Meno."
		desc: "Aumenta la Difesa e la Difesa Speciale dei Pokémon della squadra di chi la usa con l'abilità Più o Meno di un livello.", // NEEDS QC
		shortDesc: "+1 Dif e Dif. Sp. agli alleati con Più/Meno.", // NEEDS QC
	},
	magnetrise: {
		name: "Magnetascesa",
		// Official flavor text: "Chi la usa si solleva in aria per cinque turni grazie a un campo elettromagnetico."
		desc: "Per 5 turni, chi la usa è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte, Rete Vischiosa e dell'abilità Trappoarena finché resta in campo. Se chi la usa usa Staffetta, il sostituto eredita l'effetto. Radicamento, Abbattimento, Mille Frecce e la Ferropalla prevalgono su questa mossa se chi la usa è sotto uno dei loro effetti. Fallisce se chi la usa è già sotto questo effetto o sotto quelli di Radicamento, Abbattimento o Mille Frecce.", // NEEDS QC
		shortDesc: "5 turni: chi la usa è immune al tipo Terra.", // NEEDS QC
		gen5: {
			desc: "Per 5 turni, chi la usa è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte e dell'abilità Trappoarena finché resta in campo. Se chi la usa usa Staffetta, il sostituto eredita l'effetto. Radicamento, Abbattimento e la Ferropalla prevalgono su questa mossa se chi la usa è sotto uno dei loro effetti. Fallisce se chi la usa è già sotto questo effetto o sotto quelli di Radicamento o Abbattimento.", // NEEDS QC
		},
		gen4: {
			desc: "Per 5 turni, chi la usa è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte e dell'abilità Trappoarena finché resta in campo. Se chi la usa usa Staffetta, il sostituto eredita l'effetto. Radicamento e la Ferropalla prevalgono su questa mossa se chi la usa è sotto uno dei loro effetti. Fallisce se chi la usa è già sotto questo effetto o sotto quello di Radicamento.", // NEEDS QC
		},

		start: "  {POKEMON} si solleva in aria a causa dell’elettromagnetismo!",
		end: "  L’effetto dell’elettromagnetismo di {POKEMON} è terminato!",
	},
	magnitude: {
		name: "Magnitudo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza varia: 5% di probabilità per 10 e 150, 10% per 30 e 110, 20% per 50 e 90, e 30% per 70. I danni raddoppiano se il bersaglio sta usando Fossa.", // NEEDS QC
		shortDesc: "Adiacenti. Potenza variabile; x2 su Fossa.", // NEEDS QC
		gen4: {
			desc: "La potenza varia: 5% di probabilità per 10 e 150, 10% per 30 e 110, 20% per 50 e 90, e 30% per 70. La potenza raddoppia se il bersaglio sta usando Fossa.", // NEEDS QC
		},

		activate: "  Magnitudo {NUMBER}!",
	},
	makeitrain: {
		name: "Corsa all’Oro",
		desc: "Riduce l'Attacco Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "-1 Att. Sp. di chi la usa. Colpisce i nemici.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "#payday",
	},
	maliciousmoonsault: {
		name: "Iperschianto delle Tenebre",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		shortDesc: "Danni x2 se il bersaglio ha usato Minimizzato.", // NEEDS QC
	},
	malignantchain: {
		name: "Intossicatena",
		desc: "Ha il 50% di probabilità di iperavvelenare il bersaglio.", // NEEDS QC
		shortDesc: "50% di iperavvelenare il bersaglio.", // NEEDS QC
	},
	matblock: {
		name: "Ribaltappeto",
		// Official flavor text: "Chi la usa protegge se stesso e i propri alleati dai danni di mosse nemiche, adoperando un tappetino come scudo. Non è efficace contro mosse di stato."
		desc: "Chi la usa e la sua squadra sono protetti dagli attacchi che infliggono danni degli altri Pokémon, alleati compresi, in questo turno. Fallisce se non è il primo turno di chi la usa in campo, se agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "Protegge la squadra dagli attacchi. Solo al turno 1.", // NEEDS QC

		start: "  {POKEMON} si prepara a respingere gli attacchi!",
		block: "  Ribaltappeto protegge da {MOVE}!",
	},
	matchagotcha: {
		name: "Spruzzatè",
		desc: "Ha il 20% di probabilità di scottare il bersaglio. Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5. Il bersaglio viene scongelato se era congelato.", // NEEDS QC
		shortDesc: "20% di scottare. Recupera metà danni. Scongela.", // NEEDS QC
	},
	maxairstream: {
		name: "Dynajet",
		// Official flavor text: "Un attacco di tipo Volante che può essere eseguito dai Pokémon dynamaxizzati. Aumenta la Velocità degli alleati."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, la Velocità di ogni Pokémon della parte di chi la usa aumenta di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Alleati: +1 Velocità.", // NEEDS QC
	},
	maxdarkness: {
		name: "Dynatenebre",
		// Official flavor text: "Un attacco di tipo Buio che può essere eseguito dai Pokémon dynamaxizzati. Riduce la Difesa Speciale dei nemici intorno."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, la Difesa Speciale di ogni Pokémon della parte avversaria diminuisce di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1 Dif. Sp.", // NEEDS QC
	},
	maxflare: {
		name: "Dynafiammata",
		// Official flavor text: "Un attacco di tipo Fuoco che può essere eseguito dai Pokémon dynamaxizzati. Intensifica i raggi solari per cinque turni."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Sole intenso. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Evoca la luce solare.", // NEEDS QC
	},
	maxflutterby: {
		name: "Dynainsetto",
		// Official flavor text: "Un attacco di tipo Coleottero che può essere eseguito dai Pokémon dynamaxizzati. Riduce l’Attacco Speciale dei nemici intorno."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, l'Attacco Speciale di ogni Pokémon della parte avversaria diminuisce di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1 Att. Sp.", // NEEDS QC
	},
	maxgeyser: {
		name: "Dynaflusso",
		// Official flavor text: "Un attacco di tipo Acqua che può essere eseguito dai Pokémon dynamaxizzati. Provoca una forte pioggia per cinque turni."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Pioggia. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Evoca la pioggia.", // NEEDS QC
	},
	maxguard: {
		name: "Dynabarriera",
		// Official flavor text: "Permette di eludere tutti gli attacchi. Se usata in successione può fallire."
		desc: "Chi la usa è protetto da quasi tutti gli attacchi degli altri Pokémon in questo turno, comprese le mosse Dynamax e Gigamax. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Protegge anche dalle mosse Dynamax in questo turno.", // NEEDS QC

		activate: "  {POKEMON} si protegge!",
	},
	maxhailstorm: {
		name: "Dynagelo",
		// Official flavor text: "Un attacco di tipo Ghiaccio che può essere eseguito dai Pokémon dynamaxizzati. Causa una grandinata che dura per cinque turni."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Grandine. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Evoca la grandine.", // NEEDS QC
	},
	maxknuckle: {
		name: "Dynapugno",
		// Official flavor text: "Un attacco di tipo Lotta che può essere eseguito dai Pokémon dynamaxizzati. Aumenta l’Attacco degli alleati."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, l'Attacco di ogni Pokémon della parte di chi la usa aumenta di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Alleati: +1 Attacco.", // NEEDS QC
	},
	maxlightning: {
		name: "Dynasaetta",
		// Official flavor text: "Un attacco di tipo Elettro che può essere eseguito dai Pokémon dynamaxizzati. Per cinque turni il terreno entra nello stato di Campo Elettrico."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Campo Elettrico. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Campo Elettrico.", // NEEDS QC
	},
	maxmindstorm: {
		name: "Dynapsiche",
		// Official flavor text: "Un attacco di tipo Psico che può essere eseguito dai Pokémon dynamaxizzati. Per cinque turni il terreno entra nello stato di Campo Psichico."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Campo Psichico. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Campo Psichico.", // NEEDS QC
	},
	maxooze: {
		name: "Dynacorrosione",
		// Official flavor text: "Un attacco di tipo Veleno che può essere eseguito dai Pokémon dynamaxizzati. Aumenta l’Attacco Speciale degli alleati."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, l'Attacco Speciale di ogni Pokémon della parte di chi la usa aumenta di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Alleati: +1 Att. Sp.", // NEEDS QC
	},
	maxovergrowth: {
		name: "Dynaflora",
		// Official flavor text: "Un attacco di tipo Erba che può essere eseguito dai Pokémon dynamaxizzati. Per cinque turni il terreno entra nello stato di Campo Erboso."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Campo Erboso. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Campo Erboso.", // NEEDS QC
	},
	maxphantasm: {
		name: "Dynavuoto",
		// Official flavor text: "Un attacco di tipo Spettro che può essere eseguito dai Pokémon dynamaxizzati. Riduce la Difesa dei nemici intorno."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, la Difesa di ogni Pokémon della parte avversaria diminuisce di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1 Difesa.", // NEEDS QC
	},
	maxquake: {
		name: "Dynasisma",
		// Official flavor text: "Un attacco di tipo Terra che può essere eseguito dai Pokémon dynamaxizzati. Aumenta la Difesa Speciale degli alleati."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, la Difesa Speciale di ogni Pokémon della parte di chi la usa aumenta di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Alleati: +1 Dif. Sp.", // NEEDS QC
	},
	maxrockfall: {
		name: "Dynamacigno",
		// Official flavor text: "Un attacco di tipo Roccia che può essere eseguito dai Pokémon dynamaxizzati. Causa una tempesta di sabbia per cinque turni."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Terrempesta. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Tempesta di sabbia.", // NEEDS QC
	},
	maxstarfall: {
		name: "Dynafata",
		// Official flavor text: "Un attacco di tipo Folletto che può essere eseguito dai Pokémon dynamaxizzati. Per cinque turni il terreno entra nello stato di Campo Nebbioso."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, inizia l'effetto di Campo Nebbioso. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Campo Nebbioso.", // NEEDS QC
	},
	maxsteelspike: {
		name: "Dynametallo",
		// Official flavor text: "Un attacco di tipo Acciaio che può essere eseguito dai Pokémon dynamaxizzati. Aumenta la Difesa degli alleati."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, la Difesa di ogni Pokémon della parte di chi la usa aumenta di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Alleati: +1 Difesa.", // NEEDS QC
	},
	maxstrike: {
		name: "Dynattacco",
		// Official flavor text: "Un attacco di tipo Normale che può essere eseguito dai Pokémon dynamaxizzati. Riduce la Velocità dei nemici intorno."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, la Velocità di ogni Pokémon della parte avversaria diminuisce di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1 Velocità.", // NEEDS QC
	},
	maxwyrmwind: {
		name: "Dynadragone",
		// Official flavor text: "Un attacco di tipo Drago che può essere eseguito dai Pokémon dynamaxizzati. Riduce l’Attacco dei nemici intorno."
		desc: "La potenza è pari a quella della mossa Dynamax della mossa di base. Se questa mossa va a segno, l'Attacco di ogni Pokémon della parte avversaria diminuisce di un livello, anche dietro un sostituto. Questo effetto non si verifica se chi la usa non è dynamaxizzato. Se questa mossa viene usata come mossa di base, infligge danni con potenza 0.", // NEEDS QC
		shortDesc: "Potenza da mossa base. Nemici: -1 Attacco.", // NEEDS QC
	},
	meanlook: {
		name: "Malosguardo",
		// Official flavor text: "Chi la usa blocca il bersaglio con uno sguardo oscuro e ammaliante, impedendogli la fuga."
		desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Impedisce al bersaglio di lasciare il campo.", // NEEDS QC
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo, a meno che non usi Staffetta: in tal caso il bersaglio resta intrappolato.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se usa Staffetta. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo, a meno che non usi Staffetta: in tal caso il bersaglio resta intrappolato.", // NEEDS QC
		},
	},
	meditate: {
		name: "Meditazione",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Aumenta l'Attacco di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta l'Attacco di chi la usa di 1.", // NEEDS QC
	},
	mefirst: {
		name: "Precedenza",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Chi la usa esegue contro il bersaglio, se possibile, la mossa che questo ha scelto per il turno, con la potenza moltiplicata per 1,5. La mossa deve essere una mossa offensiva diversa da Cannonbecco, Rutto, Turboustione, Turborissa, Ritorsione, Contrattacco, Supplica, Centripugno, Turboincanto, Precedenza, Metalscoppio, Specchiovelo, Turbotossina, Gusciotrappola, Scontro, Furto o Turbotenebra. Fallisce se il bersaglio agisce prima di chi la usa. Ignora il sostituto del bersaglio ai fini della copia.", // NEEDS QC
		shortDesc: "Copia il nemico con x1,5. Deve agire per primo.", // NEEDS QC
		gen8: {
			desc: "Chi la usa esegue contro il bersaglio, se possibile, la mossa che questo ha scelto per il turno, con la potenza moltiplicata per 1,5. La mossa deve essere una mossa offensiva diversa da Cannonbecco, Rutto, Schiamazzo, Contrattacco, Supplica, Centripugno, Precedenza, Metalscoppio, Specchiovelo, Gusciotrappola, Scontro o Furto. Fallisce se il bersaglio agisce prima di chi la usa. Ignora il sostituto del bersaglio ai fini della copia.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa esegue contro il bersaglio, se possibile, la mossa che questo ha scelto per il turno, con la potenza moltiplicata per 1,5. La mossa deve essere una mossa offensiva diversa da Cannonbecco, Rutto, Schiamazzo, Contrattacco, Supplica, Centripugno, Precedenza, Metalscoppio, Specchiovelo, Gusciotrappola, Scontro, Furto o da una mossa Z. Fallisce se il bersaglio agisce prima di chi la usa. Ignora il sostituto del bersaglio ai fini della copia.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa esegue contro il bersaglio, se possibile, la mossa che questo ha scelto per il turno, con la potenza moltiplicata per 1,5. La mossa deve essere una mossa offensiva diversa da Rutto, Schiamazzo, Contrattacco, Supplica, Centripugno, Precedenza, Metalscoppio, Specchiovelo, Scontro o Furto. Fallisce se il bersaglio agisce prima di chi la usa. Ignora il sostituto del bersaglio ai fini della copia.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa esegue contro il bersaglio, se possibile, la mossa che questo ha scelto per il turno, con la potenza moltiplicata per 1,5. La mossa deve essere una mossa offensiva diversa da Schiamazzo, Contrattacco, Supplica, Centripugno, Precedenza, Metalscoppio, Specchiovelo, Scontro o Furto. Fallisce se il bersaglio agisce prima di chi la usa. Ignora il sostituto del bersaglio ai fini della copia.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa esegue contro il bersaglio, se possibile, la mossa che questo ha scelto per il turno, con la potenza moltiplicata per 1,5. La mossa deve essere una mossa offensiva diversa da Schiamazzo, Contrattacco, Supplica, Centripugno, Precedenza, Specchiovelo, Scontro o Furto. Fallisce se il bersaglio agisce prima di chi la usa. Ignora il sostituto del bersaglio ai fini della copia.", // NEEDS QC
		},
	},
	megadrain: {
		name: "Megassorbimento",
		// Official flavor text: "Mossa che assorbe PS. Chi la usa recupera una quantità di PS pari alla metà del danno inferto."
		desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei danni inflitti.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per difetto.", // NEEDS QC
		},
	},
	megahorn: {
		name: "Megacorno",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	megakick: {
		name: "Megacalcio",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	megapunch: {
		name: "Megapugno",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	memento: {
		name: "Memento",
		// Official flavor text: "Chi la usa va KO. Tuttavia, riduce di molto l’Attacco e l’Attacco Speciale del bersaglio."
		desc: "Riduce l'Attacco e l'Attacco Speciale del bersaglio di 2 livelli. Chi la usa va KO, a meno che questa mossa non fallisca o non ci sia un bersaglio. Fallisce del tutto se colpisce un sostituto, ma non fallisce se le statistiche del bersaglio non possono cambiare.", // NEEDS QC
		shortDesc: "-2 Att e Att. Sp. del bersaglio. Chi la usa va KO.", // NEEDS QC
		gen4: {
			desc: "Riduce l'Attacco e l'Attacco Speciale del bersaglio di 2 livelli. Chi la usa va KO, anche se questa mossa manca il bersaglio. Questa mossa può colpire bersagli nel mezzo di una mossa in due turni. Fallisce del tutto se non c'è un bersaglio, ma non fallisce se le statistiche del bersaglio non possono cambiare.", // NEEDS QC
		},
		gen3: {
			desc: "Riduce l'Attacco e l'Attacco Speciale del bersaglio di 2 livelli. Chi la usa va KO. Questa mossa non verifica la precisione e può colpire bersagli nel mezzo di una mossa in due turni. Fallisce del tutto se i livelli di Attacco e Attacco Speciale del bersaglio sono entrambi a -6.", // NEEDS QC
		},

		heal: "  {POKEMON} recupera PS grazie al Potere Z!",
	},
	menacingmoonrazemaelstrom: {
		name: "Deflagrazione Lunare",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Questa mossa e i suoi effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		shortDesc: "Ignora le abilità degli altri Pokémon.", // NEEDS QC
	},
	metalburst: {
		name: "Metalscoppio",
		// Official flavor text: "Chi la usa si vendica sul nemico che l’ha appena ferito con una mossa anche più potente."
		desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco fisico o speciale in questo turno danni pari a 1,5 volte i PS persi in quell'attacco, arrotondato per difetto. Se chi la usa non ha perso PS, questa mossa infligge 1 PS di danni. Se la posizione di quell'avversario non è più occupata e un altro avversario è in campo, i danni vengono inflitti a lui. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco fisico o speciale avversario in questo turno.", // NEEDS QC
		shortDesc: "Se viene colpito, restituisce 1,5x i danni.", // NEEDS QC
		gen6: {
			desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco fisico o speciale in questo turno danni pari a 1,5 volte i PS persi in quell'attacco, arrotondato per difetto. Se chi la usa non ha perso PS, questa mossa infligge invece danni con una potenza di 1. Se la posizione di quell'avversario non è più occupata, i danni vengono inflitti a un avversario a caso nel raggio d'azione. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco fisico o speciale avversario in questo turno.", // NEEDS QC
		},
		gen4: {
			desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco fisico o speciale in questo turno danni pari a 1,5 volte i PS persi in quell'attacco, arrotondato per difetto. Se la posizione di quell'avversario non è più occupata e un altro avversario è in campo, i danni vengono inflitti a lui. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco fisico o speciale avversario in questo turno, o se non ha perso PS in quell'attacco.", // NEEDS QC
		},
	},
	metalclaw: {
		name: "Ferrartigli",
		// Official flavor text: "Colpisce il bersaglio con artigli d’acciaio. Può anche aumentare l’Attacco di chi la usa."
		desc: "Ha il 10% di probabilità di aumentare l'Attacco di chi la usa di un livello.", // NEEDS QC
		shortDesc: "10% di aumentare l'Attacco di chi la usa di 1.", // NEEDS QC
	},
	metalsound: {
		name: "Ferrostrido",
		// Official flavor text: "Orribile stridio, simile a quello prodotto dal metallo, che riduce di molto la Difesa Speciale del bersaglio."
		desc: "Riduce la Difesa Speciale del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce la Dif. Sp. del bersaglio di 2.", // NEEDS QC
	},
	meteorassault: {
		name: "Sfolgorassalto",
		// Official flavor text: "Chi la usa attacca il bersaglio brandendo un grosso gambo, ma perde l’equilibrio e nel turno successivo non può agire."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
	},
	meteorbeam: {
		name: "Raggiometeora",
		// Official flavor text: "Chi la usa accumula l’energia dello spazio nel primo turno per aumentare l’Attacco Speciale, quindi attacca nel turno successivo."
		desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Aumenta l'Attacco Speciale di chi la usa di un livello nel primo turno. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "+1 Att. Sp. al turno 1, colpisce al turno 2.", // NEEDS QC

		prepare: "La forza dell’universo pervade {POKEMON}!",
	},
	meteormash: {
		name: "Meteorpugno",
		// Official flavor text: "Colpisce il bersaglio con un pugno veloce come una meteora. Può far salire l’Attacco di chi la usa."
		desc: "Ha il 20% di probabilità di aumentare l'Attacco di chi la usa di un livello.", // NEEDS QC
		shortDesc: "20% di aumentare l'Attacco di chi la usa di 1.", // NEEDS QC
	},
	metronome: {
		name: "Metronomo",
		// Official flavor text: "Chi la usa fa di no con il dito e stimola il cervello a usare a caso una delle tante mosse esistenti."
		desc: "Usa una mossa scelta a caso, diversa da Cortesia, Acido Malico, Corazza Cannone, Assistente, Schegge Astrali, Ruota d’Aura, Fortino, Cannonbecco, Colpo Maestoso, Taglio Maestoso, Rutto, Cediregalo, Turboustione, Schiacciacorpo, Ramostoccata, Vastoimpatto, Auguri, Schiamazzo, Doccia Fredda, Freddura, Dracofonia, Turboschianto, Turborissa, Ritorsione, Copione, Contrattacco, Supplica, Truccodifesa, Decorazione, Destinobbligato, Individua, Diamantempesta, Ricalco, Pugni Corazzati, Doppiolampo, Ascesa del Drago, Dragoenergia, Tamburattacco, Cannone Dynamax, Fulmiscatto, Resistenza, Raggio Infinito, Supplicolpo, Fintoattacco, Furia Ardente, Alleggerimento, Cannonfiore, Centripugno, Sonoqui, Elettrogelo, Sguardo Gelido, Lancia Glaciale, Forza G, Altruismo, Mano nella Mano, Ipertrapano, Urtodimensionale, Forodimensionale, Vampagelida, Imposizione, Pugnojet, Giunglacura, Scudo Reale, Goccia Vitale, Luce Nefasta, Turboincanto, Corsa all’Oro, Ribaltappeto, Precedenza, Sfolgorassalto, Metronomo, Mimica, Sbalorditesta, Specchiovelo, Speculmossa, Raggio d’Ombra, Naturforza, Ira della Natura, Turbotossina, Sbarramento, Alta Cucina, Primopulsar, Overdrive, Geyser Fotonico, Pugni Plasma, Infestazione, Balzo, Scambioforza, Spade Telluriche, Protezione, Palla Infuocata, Spintone, Anticipo, Pugno Furibondo, Polverabbia, Scatenatoro, Ira Furente, Cantoantico, Preghiera Vitale, Catastrofe, Sotto Sale, Spadamistica, Tagliacoda, Gusciotrappola, Telatrappola, Schizzo, Sonnolalia, Tagliola, Urlorabbia, Scippo, Russare, Neve, Ombrafurto, Essenza Piccante, Agodifesa, Frantumanima, Riflettore, Tempesta Zefirea, Vaporscoppio, Raggio d’Acciaio, Vapore Incantato, Scontro, Astrocarica, Idroraffica, Rapidscambio, Tecnobotto, Teracluster, Furto, Mille Frecce, Mille Onde, Elettrogabbia, Calcio Tonante, Pulizie, Apripista, Trasformazione, Raggiro, Doppioraggio, Generatore V, Pugnotenebra, Turbotenebra o Bodyguard.", // NEEDS QC
		shortDesc: "Usa una mossa a caso.", // NEEDS QC
		gen8: {
			desc: "Usa una mossa scelta a caso, diversa da Cortesia, Acido Malico, Assistente, Schegge Astrali, Ruota d’Aura, Fortino, Cannonbecco, Colpo Maestoso, Taglio Maestoso, Rutto, Cediregalo, Schiacciacorpo, Ramostoccata, Vastoimpatto, Auguri, Schiamazzo, Dracofonia, Copione, Contrattacco, Supplica, Truccodifesa, Decorazione, Destinobbligato, Individua, Diamantempesta, Pugni Corazzati, Ascesa del Drago, Dragoenergia, Marteldrago, Tamburattacco, Cannone Dynamax, Resistenza, Raggio Infinito, Supplicolpo, Fintoattacco, Furia Ardente, Cannonfiore, Centripugno, Sonoqui, Elettrogelo, Sguardo Gelido, Lancia Glaciale, Forza G, Altruismo, Mano nella Mano, Urtodimensionale, Forodimensionale, Vampagelida, Imposizione, Giunglacura, Scudo Reale, Goccia Vitale, Luce Nefasta, Ribaltappeto, Precedenza, Sfolgorassalto, Metronomo, Mimica, Sbalorditesta, Specchiovelo, Speculmossa, Raggio d’Ombra, Naturforza, Ira della Natura, Sbarramento, Primopulsar, Overdrive, Geyser Fotonico, Pugni Plasma, Spade Telluriche, Protezione, Palla Infuocata, Spintone, Anticipo, Polverabbia, Cantoantico, Spadamistica, Gusciotrappola, Schizzo, Sonnolalia, Tagliola, Urlorabbia, Scippo, Russare, Ombrafurto, Agodifesa, Frantumanima, Riflettore, Vaporscoppio, Raggio d’Acciaio, Vapore Incantato, Scontro, Astrocarica, Idroraffica, Rapidscambio, Tecnobotto, Furto, Mille Frecce, Mille Onde, Elettrogabbia, Calcio Tonante, Trasformazione, Raggiro, Generatore V, Pugnotenebra o Bodyguard.", // NEEDS QC
		},
		gen7: {
			desc: "Usa una mossa scelta a caso, diversa da Cortesia, Assistente, Fortino, Cannonbecco, Rutto, Cediregalo, Auguri, Schiamazzo, Copione, Contrattacco, Supplica, Truccodifesa, Destinobbligato, Individua, Diamantempesta, Ascesa del Drago, Resistenza, Fintoattacco, Cannonfiore, Centripugno, Sonoqui, Elettrogelo, Altruismo, Mano nella Mano, Urtodimensionale, Forodimensionale, Vampagelida, Imposizione, Scudo Reale, Luce Nefasta, Ribaltappeto, Precedenza, Metronomo, Mimica, Sbalorditesta, Specchiovelo, Speculmossa, Naturforza, Primopulsar, Geyser Fotonico, Pugni Plasma, Spade Telluriche, Protezione, Spintone, Anticipo, Polverabbia, Cantoantico, Spadamistica, Gusciotrappola, Schizzo, Sonnolalia, Urlorabbia, Scippo, Russare, Ombrafurto, Agodifesa, Riflettore, Vaporscoppio, Scontro, Rapidscambio, Tecnobotto, Furto, Mille Frecce, Mille Onde, Trasformazione, Raggiro, Generatore V o Bodyguard.", // NEEDS QC
		},
		gen6: {
			desc: "Usa una mossa scelta a caso, diversa da Cortesia, Assistente, Rutto, Cediregalo, Auguri, Schiamazzo, Copione, Contrattacco, Supplica, Truccodifesa, Destinobbligato, Individua, Diamantempesta, Ascesa del Drago, Resistenza, Fintoattacco, Centripugno, Sonoqui, Elettrogelo, Altruismo, Mano nella Mano, Urtodimensionale, Forodimensionale, Vampagelida, Scudo Reale, Luce Nefasta, Ribaltappeto, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Primopulsar, Spade Telluriche, Protezione, Spintone, Anticipo, Polverabbia, Cantoantico, Spadamistica, Schizzo, Sonnolalia, Urlorabbia, Scippo, Russare, Agodifesa, Vaporscoppio, Scontro, Rapidscambio, Tecnobotto, Furto, Mille Frecce, Mille Onde, Trasformazione, Raggiro, Generatore V o Bodyguard.", // NEEDS QC
		},
		gen5: {
			desc: "Usa una mossa scelta a caso, diversa da Cortesia, Assistente, Cediregalo, Schiamazzo, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Resistenza, Fintoattacco, Centripugno, Sonoqui, Elettrogelo, Altruismo, Vampagelida, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Naturforza, Protezione, Spintone, Anticipo, Polverabbia, Cantoantico, Spadamistica, Schizzo, Sonnolalia, Urlorabbia, Scippo, Russare, Scontro, Rapidscambio, Tecnobotto, Furto, Trasformazione, Raggiro, Generatore V o Bodyguard.", // NEEDS QC
		},
		gen4: {
			desc: "Usa una mossa scelta a caso, diversa da Assistente, Schiamazzo, Copione, Contrattacco, Supplica, Destinobbligato, Individua, Resistenza, Fintoattacco, Centripugno, Sonoqui, Altruismo, Precedenza, Metronomo, Mimica, Specchiovelo, Speculmossa, Protezione, Schizzo, Sonnolalia, Scippo, Scontro, Rapidscambio, Furto, Raggiro o dalle mosse che chi la usa già conosce.", // NEEDS QC
		},
		gen3: {
			desc: "Usa una mossa scelta a caso, diversa da Contrattacco, Supplica, Destinobbligato, Individua, Resistenza, Centripugno, Sonoqui, Altruismo, Metronomo, Mimica, Specchiovelo, Protezione, Schizzo, Sonnolalia, Scippo, Scontro, Furto o Raggiro.", // NEEDS QC
		},
		gen2: {
			desc: "Usa una mossa scelta a caso, diversa da Contrattacco, Destinobbligato, Individua, Resistenza, Metronomo, Mimica, Specchiovelo, Protezione, Schizzo, Sonnolalia, Scontro, Furto o dalle mosse che chi la usa già conosce.", // NEEDS QC
		},
		gen1: {
			desc: "Usa una mossa scelta a caso, diversa da Metronomo o Scontro.", // NEEDS QC
		},

		move: "Grazie a Metronomo, il Pokémon può sferrare la mossa {MOVE}!",
	},
	mightycleave: {
		name: "Taglio Poderoso",
		shortDesc: "Supera le protezioni senza romperle.", // NEEDS QC
	},
	milkdrink: {
		name: "Buonlatte",
		// Official flavor text: "Chi la usa recupera metà dei propri PS massimi."
		desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per eccesso da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei suoi PS max.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per difetto.", // NEEDS QC
		},
	},
	mimic: {
		name: "Mimica",
		// Official flavor text: "Chi la usa copia l’ultima mossa usata dal bersaglio e la conserva finché rimane in campo."
		desc: "Finché chi la usa resta in campo, questa mossa viene sostituita dall'ultima mossa usata dal bersaglio. La mossa copiata ha il massimo dei PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa si è trasformato, se conosce già la mossa o se la mossa è Assistente, Colpo Maestoso, Taglio Maestoso, Rutto, Turboustione, Auguri, Schiamazzo, Turborissa, Copione, Cannone Dynamax, Mano nella Mano, Turboincanto, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Turbotossina, Schizzo, Sonnolalia, Scontro, Teracluster, Trasformazione o Turbotenebra.", // NEEDS QC
		shortDesc: "Copia l'ultima mossa del bersaglio.", // NEEDS QC
		gen8: {
			desc: "Finché chi la usa resta in campo, questa mossa viene sostituita dall'ultima mossa usata dal bersaglio. La mossa copiata ha il massimo dei PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa si è trasformato, se conosce già la mossa o se la mossa è Colpo Maestoso, Taglio Maestoso, Schiamazzo, Cannone Dynamax, Mimica, Schizzo, Scontro, Trasformazione o una mossa Dynamax o Gigamax.", // NEEDS QC
		},
		gen7: {
			desc: "Finché chi la usa resta in campo, questa mossa viene sostituita dall'ultima mossa usata dal bersaglio. La mossa copiata ha il massimo dei PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa si è trasformato, se conosce già la mossa o se la mossa è Schiamazzo, Mimica, Schizzo, Scontro, Trasformazione o una mossa Z.", // NEEDS QC
		},
		gen6: {
			desc: "Finché chi la usa resta in campo, questa mossa viene sostituita dall'ultima mossa usata dal bersaglio. La mossa copiata ha il massimo dei PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa si è trasformato, se conosce già la mossa o se la mossa è Schiamazzo, Mimica, Schizzo, Scontro o Trasformazione.", // NEEDS QC
		},
		gen4: {
			desc: "Finché chi la usa resta in campo, questa mossa viene sostituita dall'ultima mossa usata dal bersaglio. La mossa copiata ha 5 PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa si è trasformato, se conosce già la mossa o se la mossa è Schiamazzo, Metronomo, Mimica, Schizzo o Scontro.", // NEEDS QC
		},
		gen3: {
			desc: "Finché chi la usa resta in campo, questa mossa viene sostituita dall'ultima mossa usata dal bersaglio. La mossa copiata ha 5 PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa si è trasformato, se conosce già la mossa o se la mossa è Metronomo, Mimica, Schizzo o Scontro.", // NEEDS QC
		},
		gen2: {
			desc: "Finché chi la usa resta in campo, questa mossa viene sostituita dall'ultima mossa usata dal bersaglio. La mossa copiata ha 5 PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa conosce già la mossa o se la mossa è Scontro.", // NEEDS QC
		},
		gen1: {
			desc: "Finché chi la usa resta in campo, questa mossa viene sostituita da una mossa a caso conosciuta dal bersaglio, anche se chi la usa la conosce già. La mossa copiata mantiene i PP rimanenti di questa mossa, indipendentemente dal suo massimo di PP. Ogni volta che viene usato un PP della mossa copiata, viene usato anche un PP di questa mossa.", // NEEDS QC
			shortDesc: "Sostituita da una mossa a caso del bersaglio.", // NEEDS QC
		},

		start: "  {POKEMON} impara {MOVE}!",
	},
	mindblown: {
		name: "Sbalorditesta",
		// Official flavor text: "Chi la usa fa esplodere la propria testa per attaccare tutti i Pokémon che ha intorno, ma subisce danni."
		desc: "Che questa mossa vada a segno o meno, e anche se questo lo manda KO, chi la usa perde metà dei suoi PS max, arrotondato per eccesso, a meno che non abbia l'abilità Magicscudo. Questa mossa non viene eseguita e chi la usa non perde PS se un Pokémon in campo ha l'abilità Umidità, o se questa mossa è di tipo Fuoco e chi la usa è sotto l'effetto di Pulviscoppio o il tempo è Acquazzone.", // NEEDS QC
		shortDesc: "Perde metà dei PS max. Colpisce gli adiacenti.", // NEEDS QC

		damage: "  ({POKEMON} sacrifica dei PS per potenziare la sua mossa!)", // NEEDS QC
	},
	mindreader: {
		name: "Leggimente",
		// Official flavor text: "Chi la usa prevede i movimenti del bersaglio per mandare a segno l’attacco successivo."
		desc: "Fino alla fine del turno successivo, il bersaglio non può evitare le mosse di chi la usa, anche se è a metà di una mossa in due turni. L'effetto finisce se chi la usa o il bersaglio lascia il campo. Fallisce se questo effetto è già attivo per chi la usa.", // NEEDS QC
		shortDesc: "La sua prossima mossa non fallirà sul bersaglio.", // NEEDS QC
		gen4: {
			desc: "Fino alla fine del turno successivo, il bersaglio non può evitare le mosse di chi la usa, nemmeno nel mezzo di una mossa in due turni. Quando questo effetto inizia contro il bersaglio, questo effetto e quello di Localizza finiscono per ogni altro Pokémon contro quel bersaglio. Se il bersaglio lascia il campo con Staffetta, il sostituto resta sotto questo effetto. Se chi la usa lascia il campo con Staffetta, l'effetto riparte contro lo stesso bersaglio per il sostituto. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		},
		gen2: {
			desc: "Il prossimo controllo di precisione contro il bersaglio riesce. Il bersaglio evita comunque Terremoto, Abisso e Magnitudo se sta usando Volo. Se il bersaglio lascia il campo con Staffetta, il sostituto resta sotto questo effetto. Questo effetto finisce quando il bersaglio lascia il campo o viene fatto un controllo di precisione contro di lui.", // NEEDS QC
			shortDesc: "La prossima mossa non mancherà il bersaglio.", // NEEDS QC
		},

		start: "#lockon",
	},
	minimize: {
		name: "Minimizzato",
		// Official flavor text: "Il corpo di chi la usa si comprime e diventa più piccolo. La sua capacità di elusione aumenta di molto."
		desc: "Aumenta l'elusione di chi la usa di 2 livelli. Che l'elusione sia cambiata o meno, Corposcontro, Dragofuria, Schiacciatuffo, Marchiafuoco, Pesobomba, Iperschianto delle Tenebre, Rulloduro, Pestone e Elettrotuffo non verificano la precisione e infliggono danni doppi contro chi la usa finché resta in campo.", // NEEDS QC
		shortDesc: "Aumenta l'elusione di chi la usa di 2.", // NEEDS QC
		gen8: {
			desc: "Aumenta l'elusione di chi la usa di 2 livelli. Che l'elusione sia cambiata o meno, Corposcontro, Dragofuria, Schiacciatuffo, Marchiafuoco, Pesobomba, Iperschianto delle Tenebre, Rulloduro e Pestone non verificano la precisione e infliggono danni doppi contro chi la usa finché resta in campo.", // NEEDS QC
		},
		gen6: {
			desc: "Aumenta l'elusione di chi la usa di 2 livelli. Che l'elusione sia cambiata o meno, Corposcontro, Dragofuria, Schiacciatuffo, Marchiafuoco, Spettrotuffo, Oscurotuffo, Rulloduro e Pestone non verificano la precisione e infliggono danni doppi contro chi la usa finché resta in campo.", // NEEDS QC
		},
		gen5: {
			desc: "Aumenta l'elusione di chi la usa di 2 livelli. Che l'elusione sia cambiata o meno, Pestone e Rulloduro infliggono danni doppi contro chi la usa finché resta in campo.", // NEEDS QC
		},
		gen4: {
			desc: "Aumenta l'elusione di chi la usa di un livello. Che l'elusione sia cambiata o meno, Pestone ha la potenza raddoppiata contro chi la usa finché resta in campo.", // NEEDS QC
			shortDesc: "Aumenta l'elusione di chi la usa di 1.", // NEEDS QC
		},
		gen3: {
			desc: "Aumenta l'elusione di chi la usa di un livello. Che l'elusione sia cambiata o meno, Sgomento, Extrasenso, Pugnospine e Pestone infliggono danni doppi contro chi la usa finché resta in campo.", // NEEDS QC
		},
		gen2: {
			desc: "Aumenta l'elusione di chi la usa di un livello. Che l'elusione sia cambiata o meno, Pestone ha la potenza raddoppiata contro chi la usa finché resta in campo. Staffetta può trasferire questo effetto a un alleato.", // NEEDS QC
		},
		gen1: {
			desc: "Aumenta l'elusione di chi la usa di un livello.", // NEEDS QC
		},
	},
	miracleeye: {
		name: "Miracolvista",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Finché il bersaglio resta in campo, il suo livello di elusione viene ignorato nei calcoli di precisione contro di lui se è superiore a 0, e gli attacchi di tipo Psico possono colpirlo se è di tipo Buio. Fallisce se il bersaglio è già sotto questo effetto, o sotto quello di Preveggenza o Segugio.", // NEEDS QC
		shortDesc: "Psico colpisce Buio. Ignora l'elusione.", // NEEDS QC
		gen4: {
			desc: "Finché il bersaglio resta in campo, il suo livello di elusione viene ignorato nei calcoli di precisione contro di lui se è superiore a 0, e gli attacchi di tipo Psico possono colpirlo se è di tipo Buio.", // NEEDS QC
		},

		start: "#foresight",
	},
	mirrorcoat: {
		name: "Specchiovelo",
		// Official flavor text: "Mossa che replica ogni attacco speciale, arrecando il doppio del danno ricevuto."
		desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco speciale in questo turno danni pari al doppio dei PS persi in quell'attacco. Se chi la usa non ha perso PS, questa mossa infligge 1 PS di danni. Se la posizione di quell'avversario non è più occupata e un altro avversario è in campo, i danni vengono inflitti a lui. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco speciale avversario in questo turno.", // NEEDS QC
		shortDesc: "Restituisce il doppio dei danni di un attacco speciale.", // NEEDS QC
		gen6: {
			desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco speciale in questo turno danni pari al doppio dei PS persi in quell'attacco. Se chi la usa non ha perso PS, questa mossa infligge invece danni con una potenza di 1. Se la posizione di quell'avversario non è più occupata, i danni vengono inflitti a un avversario a caso nel raggio d'azione. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco speciale avversario in questo turno.", // NEEDS QC
		},
		gen4: {
			desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco speciale in questo turno danni pari al doppio dei PS persi in quell'attacco. Se la posizione di quell'avversario non è più occupata e un altro avversario è in campo, i danni vengono inflitti a lui. Solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco speciale avversario in questo turno, o se non ha perso PS in quell'attacco.", // NEEDS QC
		},
		gen3: {
			desc: "Infligge all'ultimo avversario che ha colpito chi la usa con un attacco speciale in questo turno danni pari al doppio dei PS persi in quell'attacco. Se la posizione di quell'avversario non è più occupata e un altro avversario è in campo, i danni vengono inflitti a lui. Questa mossa considera Introforza di tipo Normale, e solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa non è stato colpito da un attacco speciale avversario in questo turno, o se non ha perso PS in quell'attacco.", // NEEDS QC
		},
		gen2: {
			desc: "Infligge all'avversario danni pari al doppio dei PS persi da chi la usa a causa di un attacco speciale in questo turno. Questa mossa considera Introforza di tipo Normale, e solo l'ultimo colpo di una mossa multicolpo viene contato. Fallisce se chi la usa agisce per primo, se non è stato colpito da un attacco speciale in questo turno, o se non ha perso PS in quell'attacco.", // NEEDS QC
		},
	},
	mirrormove: {
		name: "Speculmossa",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Chi la usa esegue l'ultima mossa usata dal bersaglio, contro di lui se possibile. Fallisce se il bersaglio non ha ancora agito o se la sua ultima mossa non può essere copiata.", // NEEDS QC
		shortDesc: "Usa l'ultima mossa del bersaglio contro di lui.", // NEEDS QC
		gen4: {
			desc: "Chi la usa esegue l'ultima mossa che lo ha bersagliato con successo. La mossa copiata viene usata senza un bersaglio preciso. Fallisce se nessuna mossa ha bersagliato chi la usa, se la mossa è stata richiamata da un'altra mossa, se la mossa è Ripeti, o se la mossa non può essere copiata da questa mossa.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa esegue l'ultima mossa che lo ha bersagliato con successo. La mossa copiata viene usata senza un bersaglio preciso. Fallisce se nessuna mossa ha bersagliato chi la usa, se la mossa ha mancato, è fallita o non ha avuto effetto su chi la usa, o se la mossa non può essere copiata da questa mossa.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa esegue l'ultima mossa usata dal bersaglio. Fallisce se il bersaglio non ha usato mosse da quando chi la usa è entrato in campo, o se l'ultima mossa usata è Metronomo, Mimica, Speculmossa, Schizzo, Sonnolalia o Trasformazione o una mossa che chi la usa conosce.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa esegue l'ultima mossa usata dal bersaglio. Fallisce se il bersaglio non ha usato mosse da quando chi la usa è entrato in campo, o se l'ultima mossa usata è Speculmossa.", // NEEDS QC
		},
	},
	mirrorshot: {
		name: "Cristalcolpo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 30% di probabilità di ridurre la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "30% di ridurre la precisione del bersaglio di 1.", // NEEDS QC
	},
	mist: {
		name: "Nebbia",
		// Official flavor text: "Chi la usa attira una nebbia che blocca la riduzione delle statistiche per sé e gli alleati per cinque turni."
		desc: "Per 5 turni, chi la usa e la sua squadra non possono subire riduzioni dei livelli delle statistiche da altri Pokémon. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "5 turni: la squadra non subisce riduzioni di stat.", // NEEDS QC
		gen2: {
			desc: "Finché chi la usa resta in campo, i suoi livelli delle statistiche non possono essere ridotti da altri Pokémon. Fallisce se chi la usa ha già questo effetto. Staffetta può trasferire questo effetto a un alleato.", // NEEDS QC
			shortDesc: "Finché è in campo, le sue statistiche non calano.", // NEEDS QC
			start: "  La NEBBIA avvolge {POKEMON}!",
			block: "  La NEBBIA protegge {POKEMON}.",
		},
		gen1: {
			desc: "Finché chi la usa resta in campo, i suoi livelli delle statistiche non possono essere ridotti da altri Pokémon, salvo che dall'effetto secondario di una mossa. Fallisce se chi la usa ha già questo effetto. Se un Pokémon usa Nube, l'effetto finisce.", // NEEDS QC
			start: "  La NEBBIA avvolge {POKEMON}!",
			block: "  Ma fallisce!",
		},

		start: "  {TEAM:capitalize} è avvolta dalla nebbia!",
		end: "  La nebbia intorno a {TEAM} si è diradata!",
		block: "  {POKEMON} è protetto da un velo di nebbia!",
	},
	mistball: {
		name: "Foschisfera",
		// Official flavor text: "Una sfera di nebbia avvolge e danneggia il bersaglio. Può anche ridurne l’Attacco Speciale."
		desc: "Ha il 50% di probabilità di ridurre l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "50% di ridurre l'Att. Sp. del bersaglio di 1.", // NEEDS QC
	},
	mistyexplosion: {
		name: "Nebbioscoppio",
		// Official flavor text: "Chi la usa attacca tutti i Pokémon che ha intorno, ma poi va KO. La potenza della mossa aumenta quando è attivo un Campo Nebbioso."
		desc: "Se il terreno attuale è un Campo Nebbioso e chi la usa è a terra, la potenza è moltiplicata per 1,5. Chi la usa va KO dopo averla usata, anche se fallisce per mancanza di bersagli. Questa mossa non può essere eseguita se un Pokémon in campo ha l'abilità Umidità.", // NEEDS QC
		shortDesc: "Va KO. Su Campo Nebbioso: potenza x1,5.", // NEEDS QC
	},
	mistyterrain: {
		name: "Campo Nebbioso",
		// Official flavor text: "Per cinque turni il terreno entra nello stato di Campo Nebbioso: i Pokémon a terra sono immuni ai problemi di stato e la potenza delle mosse Drago è dimezzata."
		desc: "Per 5 turni, il terreno diventa un Campo Nebbioso. Durante l'effetto, la potenza degli attacchi di tipo Drago contro i Pokémon a terra è moltiplicata per 0,5, e i Pokémon a terra non possono subire problemi di stato né confusione. I Pokémon a terra possono essere colpiti da Sbadiglio ma non addormentarsi per il suo effetto. Camuffamento trasforma chi la usa in tipo Folletto, Naturforza diventa Forza Lunare e Forzasegreta ha il 30% di probabilità di ridurre l'Attacco Speciale di un livello. Fallisce se il terreno attuale è già un Campo Nebbioso.", // NEEDS QC
		shortDesc: "5 turni: niente stati; Drago indebolito a terra.", // NEEDS QC
		gen6: {
			desc: "Per 5 turni, il terreno diventa un Campo Nebbioso. Durante l'effetto, la potenza degli attacchi di tipo Drago contro i Pokémon a terra è moltiplicata per 0,5, e i Pokémon a terra non possono subire problemi di stato. I Pokémon a terra possono essere colpiti da Sbadiglio ma non addormentarsi per il suo effetto. Camuffamento trasforma chi la usa in tipo Folletto, Naturforza diventa Forza Lunare e Forzasegreta ha il 30% di probabilità di ridurre l'Attacco Speciale di un livello. Fallisce se il terreno attuale è già un Campo Nebbioso.", // NEEDS QC
		},
	},
	moonblast: {
		name: "Forza Lunare",
		// Official flavor text: "Chi la usa sfrutta il potere della luna per attaccare il bersaglio. Può anche ridurne l’Attacco Speciale."
		desc: "Ha il 30% di probabilità di ridurre l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "30% di ridurre l'Att. Sp. del bersaglio di 1.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	moongeistbeam: {
		name: "Raggio d’Ombra",
		// Official flavor text: "Chi la usa proietta sul bersaglio un misterioso raggio di luce. Questo attacco ignora l’abilità del bersaglio."
		desc: "Questa mossa e i suoi effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		shortDesc: "Ignora le abilità degli altri Pokémon.", // NEEDS QC
	},
	moonlight: {
		name: "Lucelunare",
		// Official flavor text: "Chi la usa recupera PS. Il numero di PS recuperati dipende dalle condizioni atmosferiche."
		desc: "Chi la usa recupera metà dei suoi PS max se Vento misterioso è attiva, se non c'è alcun tempo atmosferico o se ha un Superombrello; 2/3 dei suoi PS max se il tempo è Sole accecante o Sole intenso; e 1/4 dei suoi PS max se il tempo è Acquazzone, Pioggia, tempesta di sabbia o neve, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Cura chi la usa in base al tempo atmosferico.", // NEEDS QC
		gen8: {
			desc: "Chi la usa recupera metà dei suoi PS max se Vento misterioso è attiva, se non c'è alcun tempo atmosferico o se ha un Superombrello; 2/3 dei suoi PS max se il tempo è Sole accecante o Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Acquazzone, Pioggia o Terrempesta, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa recupera metà dei suoi PS max se Vento misterioso è attiva o se non c'è alcun tempo atmosferico; 2/3 dei suoi PS max se il tempo è Sole accecante o Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Acquazzone, Pioggia o Terrempesta, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa recupera metà dei suoi PS max se non c'è alcun tempo atmosferico; 2/3 dei suoi PS max se il tempo è Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Pioggia o Terrempesta, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa recupera metà dei suoi PS max se non c'è alcun tempo atmosferico; 2/3 dei suoi PS max se il tempo è Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Pioggia o Terrempesta, il tutto arrotondato per difetto.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa recupera metà dei suoi PS max se non c'è alcun tempo atmosferico; tutti i suoi PS se il tempo è Sole intenso; e 1/4 dei suoi PS max se il tempo è Pioggia o Terrempesta, il tutto arrotondato per difetto.", // NEEDS QC
		},
	},
	morningsun: {
		name: "Mattindoro",
		// Official flavor text: "Chi la usa recupera PS. Il numero di PS recuperati dipende dalle condizioni atmosferiche."
		desc: "Chi la usa recupera metà dei suoi PS max se Vento misterioso è attiva, se non c'è alcun tempo atmosferico o se ha un Superombrello; 2/3 dei suoi PS max se il tempo è Sole accecante o Sole intenso; e 1/4 dei suoi PS max se il tempo è Acquazzone, Pioggia, tempesta di sabbia o neve, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Cura chi la usa in base al tempo atmosferico.", // NEEDS QC
		gen8: {
			desc: "Chi la usa recupera metà dei suoi PS max se Vento misterioso è attiva, se non c'è alcun tempo atmosferico o se ha un Superombrello; 2/3 dei suoi PS max se il tempo è Sole accecante o Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Acquazzone, Pioggia o Terrempesta, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa recupera metà dei suoi PS max se Vento misterioso è attiva o se non c'è alcun tempo atmosferico; 2/3 dei suoi PS max se il tempo è Sole accecante o Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Acquazzone, Pioggia o Terrempesta, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa recupera metà dei suoi PS max se non c'è alcun tempo atmosferico; 2/3 dei suoi PS max se il tempo è Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Pioggia o Terrempesta, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa recupera metà dei suoi PS max se non c'è alcun tempo atmosferico; 2/3 dei suoi PS max se il tempo è Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Pioggia o Terrempesta, il tutto arrotondato per difetto.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa recupera metà dei suoi PS max se non c'è alcun tempo atmosferico; tutti i suoi PS se il tempo è Sole intenso; e 1/4 dei suoi PS max se il tempo è Pioggia o Terrempesta, il tutto arrotondato per difetto.", // NEEDS QC
		},
	},
	mortalspin: {
		name: "Glitturbine",
		desc: "Se questa mossa va a segno e chi la usa non è KO, gli effetti di Parassiseme e delle mosse intrappolanti finiscono per chi la usa, e tutte le trappole vengono rimosse dalla sua parte del campo. Ha il 100% di probabilità di avvelenare il bersaglio.", // NEEDS QC
		shortDesc: "Avvelena, si libera da trappole e prosciugamenti.", // NEEDS QC
	},
	mountaingale: {
		name: "Soffio d’Iceberg",
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
	},
	mudbomb: {
		name: "Pantanobomba",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 30% di probabilità di ridurre la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "30% di ridurre la precisione del bersaglio di 1.", // NEEDS QC
	},
	muddywater: {
		name: "Fanghiglia",
		// Official flavor text: "Chi la usa attacca i nemici che ha intorno con un getto di fango che può anche ridurne la precisione."
		desc: "Ha il 30% di probabilità di ridurre la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "30% di ridurre la precisione dei nemici di 1.", // NEEDS QC
	},
	mudshot: {
		name: "Colpodifango",
		// Official flavor text: "Chi la usa attacca lanciando fango sul bersaglio, riducendone anche la Velocità."
		desc: "Ha il 100% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
	},
	mudslap: {
		name: "Fangosberla",
		// Official flavor text: "Chi la usa butta fango in faccia al bersaglio per arrecargli danni e ridurne la precisione."
		desc: "Ha il 100% di probabilità di ridurre la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la precisione del bersaglio di 1.", // NEEDS QC
	},
	mudsport: {
		name: "Fangata",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Per 5 turni, tutti gli attacchi di tipo Elettro dei Pokémon in campo hanno la potenza moltiplicata per 0,33. Fallisce se questo effetto è già attivo.", // NEEDS QC
		shortDesc: "5 turni: gli attacchi Elettro fanno 1/3 dei danni.", // NEEDS QC
		gen5: {
			desc: "Finché chi la usa è in campo, tutti gli attacchi di tipo Elettro dei Pokémon in campo hanno la potenza moltiplicata per 0,33. Fallisce se questo effetto è già attivo per un Pokémon.", // NEEDS QC
			shortDesc: "Riduce le mosse Elettro a 1/3 della potenza.", // NEEDS QC
		},
		gen4: {
			desc: "Finché chi la usa è in campo, tutti gli attacchi di tipo Elettro dei Pokémon in campo hanno la potenza dimezzata. Fallisce se questo effetto è già attivo per chi la usa. Staffetta può trasferire questo effetto a un alleato.", // NEEDS QC
			shortDesc: "Riduce le mosse Elettro a 1/2 della potenza.", // NEEDS QC
		},
	},
	multiattack: {
		name: "Multiattacco",
		// Official flavor text: "Chi la usa si avvolge in un potente campo energetico e colpisce il bersaglio. Il tipo della mossa varia in base alla ROM installata."
		desc: "Il tipo di questa mossa dipende dalla ROM di chi la usa.", // NEEDS QC
		shortDesc: "Il tipo dipende dalla ROM che tiene.", // NEEDS QC
	},
	mysticalfire: {
		name: "Magifiamma",
		// Official flavor text: "Colpisce il bersaglio soffiandogli contro delle fiammate incredibilmente roventi, riducendone l’Attacco Speciale."
		desc: "Ha il 100% di probabilità di ridurre l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Att. Sp. del bersaglio di 1.", // NEEDS QC
	},
	mysticalpower: {
		name: "Forza Mistica",
		desc: "Ha il 100% di probabilità di aumentare l'Attacco Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "100% di aumentare l'Att. Sp. di chi la usa di 1.", // NEEDS QC
	},
	nastyplot: {
		name: "Congiura",
		// Official flavor text: "Chi la usa stimola il cervello pensando a cose cattive. Aumenta di molto l’Attacco Speciale."
		desc: "Aumenta l'Attacco Speciale di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta l'Att. Sp. di chi la usa di 2.", // NEEDS QC
	},
	naturalgift: {
		name: "Dononaturale",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Il tipo e la potenza di questa mossa dipendono dalla bacca di chi la usa, e la bacca viene persa. Fallisce se chi la usa non ha una bacca, se ha l'abilità Impaccio o se Divieto o Magicozona è in effetto per chi la usa.", // NEEDS QC
		shortDesc: "Potenza e tipo in base alla bacca di chi la usa.", // NEEDS QC
		gen4: {
			desc: "Il tipo e la potenza di questa mossa dipendono dalla bacca di chi la usa, e la bacca viene persa. Fallisce se chi la usa non ha una bacca, se ha l'abilità Impaccio o se Divieto è in effetto per chi la usa.", // NEEDS QC
		},
	},
	naturepower: {
		name: "Naturforza",
		// Official flavor text: "Mossa che fa uso della forza della natura. Il suo effetto varia in base all’ambiente."
		desc: "Questa mossa ne richiama un'altra in base al terreno di lotta: Tripletta sul terreno standard, Fulmine su un Campo Elettrico, Forza Lunare su un Campo Nebbioso, Energipalla su un Campo Erboso e Psichico su un Campo Psichico.", // NEEDS QC
		shortDesc: "Mossa in base al terreno (Tripletta per impostazione).", // NEEDS QC
		gen6: {
			desc: "Questa mossa ne richiama un'altra in base al terreno di lotta: Tripletta sul terreno Wi-Fi standard, Fulmine su un Campo Elettrico, Forza Lunare su un Campo Nebbioso e Energipalla su un Campo Erboso.", // NEEDS QC
		},
		gen5: {
			desc: "Questa mossa ne richiama un'altra in base al terreno di lotta: Terremoto sul terreno Wi-Fi standard.", // NEEDS QC
			shortDesc: "La mossa dipende dal terreno. (Terremoto)", // NEEDS QC
		},
		gen4: {
			desc: "Questa mossa ne richiama un'altra in base al terreno di lotta: Tripletta nelle lotte Wi-Fi.", // NEEDS QC
			shortDesc: "La mossa dipende dal terreno. (Tripletta)", // NEEDS QC
		},
		gen3: {
			desc: "Questa mossa ne richiama un'altra in base al terreno di lotta: Comete nelle lotte Wi-Fi.", // NEEDS QC
			shortDesc: "La mossa dipende dal terreno. (Comete)", // NEEDS QC
		},

		move: "Naturforza diventa {MOVE}!",
	},
	naturesmadness: {
		name: "Ira della Natura",
		// Official flavor text: "Scatena l’ira della natura sul bersaglio e ne dimezza i PS."
		desc: "Infligge al bersaglio danni pari a metà dei suoi PS attuali, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Infligge metà dei PS attuali del bersaglio.", // NEEDS QC
	},
	needlearm: {
		name: "Pugnospine",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
		gen3: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio. I danni raddoppiano se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		},
	},
	neverendingnightmare: {
		name: "Abbraccio Spettrale",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	nightdaze: {
		name: "Urtoscuro",
		// Official flavor text: "Chi la usa attacca il bersaglio con un’onda d’urto oscura che può anche ridurne la precisione."
		desc: "Ha il 40% di probabilità di ridurre la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "40% di ridurre la precisione del bersaglio di 1.", // NEEDS QC
	},
	nightmare: {
		name: "Incubo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Il bersaglio perde 1/4 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno finché dorme. Questa mossa influenza il bersaglio solo se dorme. L'effetto finisce quando il bersaglio si sveglia, anche se si riaddormenta nello stesso turno.", // NEEDS QC
		shortDesc: "Un bersaglio addormentato perde 1/4 dei PS a turno.", // NEEDS QC

		start: "  {POKEMON} ha un incubo!",
		damage: "  {POKEMON} è prigioniero di un incubo!",
	},
	nightshade: {
		name: "Ombra Notturna",
		// Official flavor text: "Fa apparire un orribile miraggio al bersaglio e infligge un danno pari al livello di chi la usa."
		desc: "Infligge al bersaglio danni pari al livello di chi la usa.", // NEEDS QC
		shortDesc: "Infligge danni pari al livello di chi la usa.", // NEEDS QC
		gen1: {
			desc: "Infligge al bersaglio danni pari al livello di chi la usa. Questa mossa ignora l'immunità di tipo.", // NEEDS QC
			shortDesc: "Danni = livello. Colpisce i tipi Normale.", // NEEDS QC
		},
	},
	nightslash: {
		name: "Nottesferza",
		// Official flavor text: "Chi la usa colpisce il bersaglio appena si presenta l’occasione. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	nobleroar: {
		name: "Urlo",
		// Official flavor text: "Chi la usa emette un urlo potente che intimidisce il bersaglio, riducendone l’Attacco e l’Attacco Speciale."
		desc: "Riduce l'Attacco e l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce l'Attacco e l'Att. Sp. del bersaglio di 1.", // NEEDS QC
	},
	noretreat: {
		name: "Spalle al Muro",
		// Official flavor text: "Chi la usa aumenta tutte le sue statistiche ma non può più fuggire o essere sostituito."
		desc: "Aumenta l'Attacco, la Difesa, l'Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa di un livello, ma non può più essere sostituito. Può comunque essere sostituito se usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. Fallisce se chi la usa è già intrappolato da questo effetto.", // NEEDS QC
		shortDesc: "+1 a tutte le sue statistiche, ma resta intrappolato.", // NEEDS QC

		start: "  Spalle al Muro impedisce {POKEMON:a} di fuggire!",
	},
	noxioustorque: {
		name: "Turbotossina",
		desc: "Ha il 30% di probabilità di avvelenare il bersaglio.", // NEEDS QC
		shortDesc: "30% di avvelenare il bersaglio.", // NEEDS QC
	},
	nuzzle: {
		name: "Elettrococcola",
		// Official flavor text: "Chi la usa strofina le guance elettrizzate contro il bersaglio, paralizzandolo."
		desc: "Ha il 100% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "100% di paralizzare il bersaglio.", // NEEDS QC
	},
	oblivionwing: {
		name: "Ali del Fato",
		// Official flavor text: "Chi la usa assorbe energia dal bersaglio recuperando una quantità di PS pari a più della metà del danno inferto."
		desc: "Chi la usa recupera 3/4 dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera 3/4 dei danni inflitti.", // NEEDS QC
	},
	obstruct: {
		name: "Sbarramento",
		// Official flavor text: "Permette di eludere tutti gli attacchi. Se usata in successione può fallire. Se un Pokémon tocca chi la usa, la sua Difesa diminuisce di molto."
		desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che provano a colpirlo con mosse da contatto vedono la propria Difesa ridursi di 2 livelli. Le mosse senza danni superano questa protezione. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Protegge dagli attacchi. Contatto: -2 Difesa.", // NEEDS QC
		gen8: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che provano a colpirlo con mosse da contatto vedono la propria Difesa ridursi di 2 livelli. Le mosse senza danni superano questa protezione. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
	},
	oceanicoperetta: {
		name: "Sinfonia del Mare",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	octazooka: {
		name: "Octazooka",
		// Official flavor text: "Chi la usa spruzza inchiostro in faccia al bersaglio. Può anche ridurne la precisione."
		desc: "Ha il 50% di probabilità di ridurre la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "50% di ridurre la precisione del bersaglio di 1.", // NEEDS QC
	},
	octolock: {
		name: "Tentacolock",
		// Official flavor text: "Chi la usa immobilizza il bersaglio impedendogli di fuggire e ne diminuisce la Difesa e la Difesa Speciale a ogni turno."
		desc: "Impedisce al bersaglio di essere sostituito. Alla fine di ogni turno durante l'effetto, la Difesa e la Difesa Speciale del bersaglio diminuiscono di un livello. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Intrappola il bersaglio: -1 Dif e Dif. Sp. a turno.", // NEEDS QC

		start: "  Tentacolock impedisce {POKEMON:a} di fuggire!",
	},
	odorsleuth: {
		name: "Segugio",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Finché il bersaglio resta in campo, il suo livello di elusione viene ignorato nei calcoli di precisione contro di lui se è superiore a 0, e gli attacchi di tipo Normale e Lotta possono colpirlo se è di tipo Spettro. Fallisce se il bersaglio è già sotto questo effetto, o sotto quello di Preveggenza o Miracolvista.", // NEEDS QC
		shortDesc: "Lotta e Normale colpiscono Spettro. Ignora elusione.", // NEEDS QC
		gen4: {
			desc: "Finché il bersaglio resta in campo, il suo livello di elusione viene ignorato nei controlli di precisione contro di lui se è superiore a 0, e gli attacchi di tipo Normale e Lotta possono colpirlo anche se è di tipo Spettro.", // NEEDS QC
		},
		gen3: {
			desc: "Finché il bersaglio resta in campo, il suo livello di elusione viene ignorato nei controlli di precisione contro di lui, e gli attacchi di tipo Normale e Lotta possono colpirlo anche se è di tipo Spettro.", // NEEDS QC
		},
	},
	ominouswind: {
		name: "Funestovento",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 10% di probabilità di aumentare l'Attacco, la Difesa, l'Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "10% di aumentare tutte le sue statistiche di 1.", // NEEDS QC
	},
	orderup: {
		name: "Alta Cucina",
		desc: "Se un Tatsugiri alleato ha attivato la sua abilità Torre di Comando, questa mossa aumenta di un livello l'Attacco di chi la usa se il Tatsugiri è in Forma Curva, la Difesa se è in Forma Flaccida, o la Velocità se è in Forma Tesa. L'effetto si verifica anche se il Tatsugiri che l'ha attivato è andato KO.", // NEEDS QC
		shortDesc: "In base al Tatsugiri alleato: +1 Att, Dif o Vel.", // NEEDS QC
	},
	originpulse: {
		name: "Primopulsar",
		// Official flavor text: "Attacca i nemici intorno colpendoli con miriadi di raggi di luce blu."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i nemici adiacenti.", // NEEDS QC
	},
	outrage: {
		name: "Oltraggio",
		// Official flavor text: "Chi la usa sfoga la sua ira e attacca il nemico per due o tre turni prima di essere lasciato in preda alla confusione."
		desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio nel primo turno dell'effetto o nel secondo di un effetto di tre turni, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia e chi la usa dorme, viene usata per un solo turno e non lo confonde.", // NEEDS QC
		shortDesc: "Dura 2-3 turni, poi chi la usa si confonde.", // NEEDS QC
		gen6: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario adiacente a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio nel primo turno dell'effetto o nel secondo di un effetto di tre turni, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso alla fine dell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso alla fine dell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, si addormenta, viene congelato, o se l'attacco fallisce contro il bersaglio, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen2: {
			desc: "Che questa mossa riesca o meno, chi la usa resta bloccato su di essa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, anche se è già confuso. Se chi la usa non può agire, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
	},
	overdrive: {
		name: "Overdrive",
		// Official flavor text: "Chi la usa suona la chitarra o il basso creando un’onda sonora potentissima con cui attacca il bersaglio."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i nemici.", // NEEDS QC
	},
	overheat: {
		name: "Vampata",
		// Official flavor text: "Chi la usa sferra un potente attacco, ma il contraccolpo riduce di molto il suo Attacco Speciale."
		desc: "Riduce l'Attacco Speciale di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce l'Att. Sp. di chi la usa di 2.", // NEEDS QC
	},
	painsplit: {
		name: "Malcomune",
		// Official flavor text: "Chi la usa somma i propri PS a quelli di un altro Pokémon per poi dividerli in parti uguali."
		desc: "I PS di chi la usa e del bersaglio diventano la media dei loro PS attuali, arrotondato per difetto, senza superare i PS max di ciascuno.", // NEEDS QC
		shortDesc: "Divide i PS in parti uguali con il bersaglio.", // NEEDS QC

		activate: "  I Pokémon si dividono i PS!",
	},
	paleowave: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Ha il 20% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "20% di ridurre l'Attacco del bersaglio di 1.", // NEEDS QC
	},
	paraboliccharge: {
		name: "Caricaparabola",
		// Official flavor text: "Infligge danni a tutti i Pokémon vicini. Chi la usa recupera una quantità di PS pari alla metà del danno inferto."
		desc: "Chi la usa recupera metà dei PS persi dal bersaglio, arrotondato per eccesso da 0,5. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei danni inflitti.", // NEEDS QC
	},
	partingshot: {
		name: "Monito",
		// Official flavor text: "Chi la usa lancia un monito intimidatorio al bersaglio, riducendone l’Attacco e l’Attacco Speciale, e si fa sostituire da un altro Pokémon della squadra."
		desc: "Riduce l'Attacco e l'Attacco Speciale del bersaglio di un livello. Se questa mossa va a segno, chi la usa viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se i livelli di Attacco e Attacco Speciale del bersaglio non sono cambiati, o se non ci sono altri membri non KO.", // NEEDS QC
		shortDesc: "-1 Att e Att. Sp. del bersaglio. Chi la usa esce.", // NEEDS QC
		gen6: {
			desc: "Riduce l'Attacco e l'Attacco Speciale del bersaglio di un livello. Se questa mossa va a segno, chi la usa viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se non ci sono altri membri non KO.", // NEEDS QC
		},

		heal: "#memento",
		switchOut: "#uturn",
	},
	payback: {
		name: "Rivincita",
		// Official flavor text: "Chi la usa accumula forza, poi attacca. La potenza raddoppia se il Pokémon agisce dopo il bersaglio."
		desc: "La potenza raddoppia se chi la usa agisce dopo il bersaglio in questo turno, comprese le azioni tramite Imposizione o l'abilità Sincrodanza. Entrare in campo non conta come azione.", // NEEDS QC
		shortDesc: "Potenza doppia se agisce dopo il bersaglio.", // NEEDS QC
		gen6: {
			desc: "La potenza raddoppia se chi la usa agisce dopo il bersaglio in questo turno. Entrare in campo non conta come azione.", // NEEDS QC
		},
		gen4: {
			desc: "La potenza raddoppia se chi la usa agisce dopo il bersaglio in questo turno. Entrare in campo conta come azione.", // NEEDS QC
		},
	},
	payday: {
		name: "Giornopaga",
		// Official flavor text: "Colpisce il bersaglio con una gran quantità di monete recuperabili dopo la lotta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Sparge monete.", // NEEDS QC

		activate: "  Ci sono monete sparse ovunque!",
	},
	peck: {
		name: "Beccata",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	perishsong: {
		name: "Ultimocanto",
		// Official flavor text: "Qualunque Pokémon che senta questo canto va KO in tre turni, se non lo si sostituisce."
		desc: "Ogni Pokémon in campo riceve un conto alla rovescia di 4 se non ne ha già uno. Alla fine di ogni turno, compreso quello dell'uso, il conto alla rovescia di tutti i Pokémon in campo diminuisce di 1, e i Pokémon per cui arriva a 0 vanno KO. Il conto alla rovescia viene rimosso dai Pokémon che lasciano il campo. Se un Pokémon usa Staffetta con un conto alla rovescia, il sostituto lo eredita e il conteggio continua.", // NEEDS QC
		shortDesc: "I Pokémon in campo andranno KO entro 3 turni.", // NEEDS QC

		start: "  Tutti i Pokémon che ascoltano Ultimocanto andranno KO dopo tre turni!",
		activate: "  Il conto alla rovescia di Ultimocanto per {POKEMON} scende a {NUMBER}!",
	},
	petalblizzard: {
		name: "Fiortempesta",
		// Official flavor text: "Infligge danni ai Pokémon che ha intorno attaccandoli con una tempesta di fiori."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i Pokémon adiacenti.", // NEEDS QC
	},
	petaldance: {
		name: "Petalodanza",
		// Official flavor text: "Attacca il nemico cospargendolo di petali per due o tre turni, ma chi la usa rimane confuso."
		desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio nel primo turno dell'effetto o nel secondo di un effetto di tre turni, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia e chi la usa dorme, viene usata per un solo turno e non lo confonde.", // NEEDS QC
		shortDesc: "Dura 2-3 turni, poi chi la usa si confonde.", // NEEDS QC
		gen6: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario adiacente a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio nel primo turno dell'effetto o nel secondo di un effetto di tre turni, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso alla fine dell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso alla fine dell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, si addormenta, viene congelato, o se l'attacco fallisce contro il bersaglio, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen2: {
			desc: "Che questa mossa riesca o meno, chi la usa resta bloccato su di essa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, anche se è già confuso. Se chi la usa non può agire, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen1: {
			desc: "Che questa mossa riesca o meno, chi la usa resta bloccato su di essa per tre o quattro turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, anche se è già confuso. Se chi la usa non può agire, l'effetto finisce senza causare confusione. Durante l'effetto, la precisione di questa mossa viene sovrascritta a ogni turno con la precisione attuale calcolata, compresi i cambi di livello, ma non sotto 1/256 né sopra 255/256.", // NEEDS QC
			shortDesc: "Dura 3-4 turni, poi confonde chi la usa.", // NEEDS QC
		},
	},
	phantomforce: {
		name: "Spettrotuffo",
		// Official flavor text: "Chi la usa scompare improvvisamente per attaccare poi nel turno seguente. Questa mossa neutralizza le protezioni del bersaglio."
		desc: "Se questa mossa va a segno, rompe gli effetti di Fortino, Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Sparisce, colpisce al turno 2. Rompe le protezioni.", // NEEDS QC
		gen6: {
			desc: "Se questa mossa va a segno, rompe gli effetti di Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno e gli altri Pokémon possono attaccare quella parte normalmente. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi. Se chi la usa ha una Vigorerba, la mossa si completa in un turno. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato mentre era in campo.", // NEEDS QC
		},

		prepare: "#shadowforce",
		activate: "#shadowforce",
	},
	photongeyser: {
		name: "Geyser Fotonico",
		// Official flavor text: "Attacca il bersaglio con una colonna di luce. Infligge danni in base all’Attacco o all’Attacco Speciale scegliendo il più alto tra i due."
		desc: "Questa mossa diventa un attacco fisico se l'Attacco di chi la usa è superiore al suo Attacco Speciale, compresi i livelli delle statistiche. Questa mossa e i suoi effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		shortDesc: "Fisica se Att > Att. Sp. Ignora le abilità.", // NEEDS QC
	},
	pikapapow: {
		name: "Pikasaetta",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza è pari a (felicità di chi la usa × 2/5), arrotondato per difetto, ma non meno di 1.", // NEEDS QC
		shortDesc: "Felicità max: 102 di potenza. Non fallisce mai.", // NEEDS QC
	},
	pinmissile: {
		name: "Missilspillo",
		// Official flavor text: "Il bersaglio viene colpito da due a cinque volte in rapida successione con delle spine."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. I danni sono calcolati una sola volta per il primo colpo e ripetuti per ogni colpo. Se uno dei colpi rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	plasmafists: {
		name: "Pugni Plasma",
		// Official flavor text: "Chi la usa attacca con pugni carichi di elettricità. Trasforma le mosse di tipo Normale in mosse di tipo Elettro."
		desc: "Se questa mossa va a segno, le mosse di tipo Normale diventano di tipo Elettro in questo turno.", // NEEDS QC
		shortDesc: "Le mosse Normale diventano Elettro in questo turno.", // NEEDS QC
	},
	playnice: {
		name: "Simpatia",
		// Official flavor text: "Chi la usa diventa amico del bersaglio, rabbonendolo e riducendone così l’Attacco."
		desc: "Riduce l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce l'Attacco del bersaglio di 1.", // NEEDS QC
	},
	playrough: {
		name: "Carineria",
		// Official flavor text: "Chi la usa attacca il bersaglio con delle carinerie. Può anche ridurne l’Attacco."
		desc: "Ha il 10% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre l'Attacco del bersaglio di 1.", // NEEDS QC
	},
	pluck: {
		name: "Spennata",
		// Official flavor text: "Chi la usa becca il bersaglio. Inoltre, se questi ha una bacca, gliela ruba e ne sfrutta gli effetti."
		desc: "Se questa mossa va a segno e chi la usa non è KO, ruba la bacca del bersaglio e la mangia subito, ottenendone gli effetti anche se il proprio strumento è ignorato. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		shortDesc: "Ruba e mangia la bacca del bersaglio.", // NEEDS QC
		gen4: {
			desc: "Chi la usa ruba la bacca del bersaglio e la mangia subito, ottenendone gli effetti a meno che il proprio strumento non sia ignorato. Gli strumenti persi con questa mossa possono essere recuperati con Riciclo.", // NEEDS QC
		},

		removeItem: "#bugbite",
	},
	poisonfang: {
		name: "Velenodenti",
		// Official flavor text: "Chi la usa morde il bersaglio con denti avvelenati che possono anche iperavvelenarlo."
		desc: "Ha il 50% di probabilità di iperavvelenare il bersaglio.", // NEEDS QC
		shortDesc: "50% di iperavvelenare il bersaglio.", // NEEDS QC
		gen5: {
			desc: "Ha il 30% di probabilità di iperavvelenare il bersaglio.", // NEEDS QC
			shortDesc: "30% di iperavvelenare il bersaglio.", // NEEDS QC
		},
	},
	poisongas: {
		name: "Velenogas",
		// Official flavor text: "Spruzza in faccia ai nemici che ha intorno una nuvola di gas tossico che avvelena."
		desc: "Avvelena il bersaglio.", // NEEDS QC
		shortDesc: "Avvelena i nemici.", // NEEDS QC
		gen2: {
			shortDesc: "Avvelena il bersaglio.", // NEEDS QC
		},
	},
	poisonjab: {
		name: "Velenpuntura",
		// Official flavor text: "Il bersaglio è colpito da un tentacolo o da un arto intriso di una sostanza tossica che può anche avvelenarlo."
		desc: "Ha il 30% di probabilità di avvelenare il bersaglio.", // NEEDS QC
		shortDesc: "30% di avvelenare il bersaglio.", // NEEDS QC
	},
	poisonpowder: {
		name: "Velenpolvere",
		// Official flavor text: "Investe il bersaglio con una nuvola di polvere tossica che avvelena."
		desc: "Avvelena il bersaglio.", // NEEDS QC
		shortDesc: "Avvelena il bersaglio.", // NEEDS QC
	},
	poisonsting: {
		name: "Velenospina",
		// Official flavor text: "Colpisce il bersaglio con un aculeo tossico che può anche avvelenarlo."
		desc: "Ha il 30% di probabilità di avvelenare il bersaglio.", // NEEDS QC
		shortDesc: "30% di avvelenare il bersaglio.", // NEEDS QC
		gen1: {
			desc: "Ha il 20% di probabilità di avvelenare il bersaglio.", // NEEDS QC
			shortDesc: "20% di avvelenare il bersaglio.", // NEEDS QC
		},
	},
	poisontail: {
		name: "Velenocoda",
		// Official flavor text: "Chi la usa colpisce con la coda e può avvelenare il bersaglio. Probabile brutto colpo."
		desc: "Ha il 10% di probabilità di avvelenare il bersaglio e una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta prob. di brutto colpo. 10% di avvelenare.", // NEEDS QC
	},
	polarflare: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Ha il 10% di probabilità di congelare il bersaglio. Questa mossa non può scongelare un bersaglio congelato. Se va a segno contro almeno un bersaglio e chi la usa è un Ramnarok, assume la Radiant Forme se è in Dormant Forme, e viceversa. Questo cambio di forma non avviene se il Ramnarok ha l'abilità Forzabruta. La Radiant Forme torna Dormant Forme quando Ramnarok lascia il campo.", // NEEDS QC
		shortDesc: "10% di congelare. Ramnarok cambia forma.", // NEEDS QC
	},
	pollenpuff: {
		name: "Sferapolline",
		// Official flavor text: "Chi la usa attacca il nemico con una sfera esplosiva. Se colpisce degli alleati, fa recuperare loro dei PS."
		desc: "Se il bersaglio è un alleato, questa mossa gli fa recuperare metà dei suoi PS max, arrotondato per difetto, invece di infliggere danni.", // NEEDS QC
		shortDesc: "Cura un alleato bersaglio di metà dei suoi PS max.", // NEEDS QC
	},
	poltergeist: {
		name: "Poltergeist",
		shortDesc: "Fallisce se il bersaglio non ha strumenti.", // NEEDS QC

		activate: "  {ITEM:definite:capitalize} attacca{INFLECT:ITEM:s=:p=no} {POKEMON}!",
	},
	populationbomb: {
		name: "Infestazione",
		desc: "Colpisce dieci volte. Questa mossa verifica la precisione a ogni colpo, e l'attacco finisce se il bersaglio ne evita uno. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre dieci volte. Se chi la usa ha un Dado truccato, colpisce da quattro a dieci volte a caso senza verificare la precisione tra i colpi.", // NEEDS QC
		shortDesc: "Colpisce 10 volte. Ogni colpo può fallire.", // NEEDS QC
	},
	pounce: {
		name: "Balzo",
		desc: "Ha il 100% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
	},
	pound: {
		name: "Botta",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	powder: {
		name: "Pulviscoppio",
		// Official flavor text: "Il bersaglio viene coperto da un pulviscolo che esplode danneggiandolo se questi utilizza una mossa di tipo Fuoco nello stesso turno."
		desc: "Se il bersaglio usa una mossa di tipo Fuoco in questo turno, la mossa non viene eseguita e il bersaglio perde 1/4 dei suoi PS max, arrotondato per eccesso da 0,5. Questo effetto non si verifica se la mossa di tipo Fuoco è impedita da Acquazzone.", // NEEDS QC
		shortDesc: "Se usa una mossa Fuoco, il bersaglio perde 1/4 dei PS.", // NEEDS QC
		gen6: {
			desc: "Se il bersaglio usa una mossa di tipo Fuoco in questo turno, la mossa non viene eseguita e il bersaglio perde 1/4 dei suoi PS max, arrotondato per eccesso da 0,5. Questo effetto si verifica prima che la mossa di tipo Fuoco venga impedita da Acquazzone.", // NEEDS QC
		},

		start: "  {POKEMON} è cosparso di polvere esplosiva!",
		activate: "  Il pulviscolo esplode per reazione alla mossa {MOVE}!",
	},
	powdersnow: {
		name: "Polneve",
		// Official flavor text: "Attacca i nemici che ha intorno con una raffica di neve farinosa e può anche congelarli."
		desc: "Ha il 10% di probabilità di congelare il bersaglio.", // NEEDS QC
		shortDesc: "10% di congelare il bersaglio.", // NEEDS QC
		gen2: {
			shortDesc: "10% di congelare il bersaglio.", // NEEDS QC
		},
	},
	powergem: {
		name: "Gemmoforza",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	powersplit: {
		name: "Pariattacco",
		// Official flavor text: "Chi la usa sfrutta la sua forza psichica per sommare Attacco e Attacco Speciale a quelli del bersaglio e dividerli equamente."
		desc: "L'Attacco e l'Attacco Speciale di chi la usa e del bersaglio vengono impostati alla media delle rispettive statistiche, arrotondato per difetto. I livelli delle statistiche non sono influenzati.", // NEEDS QC
		shortDesc: "Media di Att e Att. Sp. con il bersaglio.", // NEEDS QC

		activate: "  {POKEMON} somma le sue capacità offensive con quelle del bersaglio e le ripartisce equamente!",
	},
	powerswap: {
		name: "Barattoforza",
		// Official flavor text: "Chi la usa sfrutta la sua forza psichica per scambiare le modifiche ad Attacco e Attacco Speciale con il bersaglio."
		desc: "Chi la usa scambia i propri livelli di Attacco e Attacco Speciale con quelli del bersaglio.", // NEEDS QC
		shortDesc: "Scambia i cambi di Att e Att. Sp. con il bersaglio.", // NEEDS QC
	},
	powershift: {
		name: "Scambioforza",
		desc: "Chi la usa scambia le proprie statistiche di Attacco e Difesa; i livelli restano sulle rispettive statistiche. Questa mossa può essere usata di nuovo per ripristinare le statistiche. Se chi la usa usa Staffetta, il sostituto ha Attacco e Difesa scambiati se l'effetto è attivo. Se le statistiche di chi la usa vengono ricalcolate per un cambio di forma mentre sono scambiate, questo effetto viene ignorato ma resta attivo per Staffetta.", // NEEDS QC
		shortDesc: "Scambia l'Attacco e la Difesa di chi la usa.", // NEEDS QC

		start: "  {POKEMON} ha invertito la sua forza offensiva con la forza difensiva!",
		end: "#.start",
	},
	powertrick: {
		name: "Ingannoforza",
		// Official flavor text: "Mossa psichica che permette a chi la usa di scambiare i valori delle sue statistiche di Attacco e Difesa."
		desc: "Chi la usa scambia le proprie statistiche di Attacco e Difesa; i livelli restano sulle rispettive statistiche. Questa mossa può essere usata di nuovo per ripristinare le statistiche. Se chi la usa usa Staffetta, il sostituto ha Attacco e Difesa scambiati se l'effetto è attivo. Se le statistiche di chi la usa vengono ricalcolate per un cambio di forma mentre sono scambiate, questo effetto viene ignorato ma resta attivo per Staffetta.", // NEEDS QC
		shortDesc: "Scambia l'Attacco e la Difesa di chi la usa.", // NEEDS QC

		start: "  {POKEMON} inverte l’Attacco con la Difesa!",
		end: "#.start",
	},
	powertrip: {
		name: "Tracotanza",
		// Official flavor text: "Chi la usa attacca il bersaglio sfoggiando la propria forza. Più le sue statistiche sono state aumentate, più la mossa è potente."
		desc: "La potenza è pari a 20 + (X × 20), dove X è il totale dei livelli positivi delle statistiche di chi la usa.", // NEEDS QC
		shortDesc: "+20 di potenza per ogni aumento di statistica.", // NEEDS QC
	},
	poweruppunch: {
		name: "Crescipugno",
		// Official flavor text: "Rende i pugni più duri a ogni colpo inferto. Se i pugni vanno a segno, l’Attacco di chi la usa aumenta."
		desc: "Ha il 100% di probabilità di aumentare l'Attacco di chi la usa di un livello.", // NEEDS QC
		shortDesc: "100% di aumentare l'Attacco di chi la usa di 1.", // NEEDS QC
	},
	powerwhip: {
		name: "Vigorcolpo",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	precipiceblades: {
		name: "Spade Telluriche",
		// Official flavor text: "Attacca i nemici intorno trasformando la potenza della terra in lame affilate."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Nessun effetto extra. Colpisce i nemici adiacenti.", // NEEDS QC
	},
	present: {
		name: "Regalino",
		// Official flavor text: "Chi la usa dà un regalo bomba al bersaglio. A volte, però, può fargli recuperare PS."
		desc: "Se questa mossa va a segno, infligge danni o cura il bersaglio: 40% di probabilità per 40 di potenza, 30% per 80, 10% per 120, e 20% di probabilità di curare il bersaglio di 1/4 dei suoi PS max, arrotondato per difetto.", // NEEDS QC
		shortDesc: "Potenza 40, 80 o 120, o cura il bersaglio di 1/4 PS.", // NEEDS QC
		gen2: {
			desc: "Se questa mossa va a segno, infligge danni o cura il bersaglio: 102/256 di probabilità per 40 di potenza, 76/256 per 80, 26/256 per 120, e 52/256 di probabilità di curare il bersaglio di 1/4 dei suoi PS max, arrotondato per difetto. Se questa mossa infligge danni, usa una versione anomala della formula dei danni sostituendo certi valori: l'Attacco di chi la usa è sostituito da 10 volte l'efficacia di questa mossa contro il bersaglio, la Difesa del bersaglio dal numero indice del secondo tipo di chi la usa, e il livello di chi la usa dal numero indice del secondo tipo del bersaglio. Se un Pokémon non ha un secondo tipo, viene usato il suo primo tipo. I numeri indice dei tipi sono Normale: 0, Lotta: 1, Volante: 2, Veleno: 3, Terra: 4, Roccia: 5, Coleottero: 7, Spettro: 8, Acciaio: 9, Fuoco: 20, Acqua: 21, Erba: 22, Elettro: 23, Psico: 24, Ghiaccio: 25, Drago: 26, Buio: 27. Se nella formula dei danni si verificasse una divisione per 0, si divide invece per 1.", // NEEDS QC
		},
	},
	prismaticlaser: {
		name: "Prismalaser",
		// Official flavor text: "Chi la usa proietta dei potenti raggi di luce grazie alla potenza del suo prisma, ma non può agire nel turno successivo."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
	},
	protect: {
		name: "Protezione",
		// Official flavor text: "Permette di eludere tutti gli attacchi. Se usata in successione può fallire."
		desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Protegge chi la usa dalle mosse in questo turno.", // NEEDS QC
		gen8: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e raddoppia a ogni uso riuscito. X torna a 1 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza, Protezione, Anticipo o Bodyguard. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e raddoppia a ogni uso riuscito, fino a un massimo di 8. X torna a 1 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza o Protezione. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno. Questa mossa ha X probabilità su 65536 di riuscire, dove X parte da 65535 e si dimezza, arrotondato per difetto, a ogni uso riuscito. Dopo il quarto successo di fila, X scende a 118 e assume poi valori apparentemente casuali tra 0 e 65535. X torna a 65535 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza o Protezione. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa è protetto dagli attacchi dell'avversario in questo turno. Questa mossa ha X probabilità su 255 di riuscire, dove X parte da 255 e si dimezza, arrotondato per difetto, a ogni uso riuscito. X torna a 255 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza o Protezione. Fallisce se chi la usa ha un sostituto o agisce per ultimo in questo turno.", // NEEDS QC
		},

		start: "  {POKEMON} si è protetto!",
		block: "  {POKEMON} si protegge!",
	},
	psybeam: {
		name: "Psicoraggio",
		// Official flavor text: "Colpisce il bersaglio con un raggio speciale. Può anche confonderlo."
		desc: "Ha il 10% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "10% di confondere il bersaglio.", // NEEDS QC
	},
	psyblade: {
		name: "Psicolama",
		desc: "Se il terreno attuale è un Campo Elettrico, la potenza di questa mossa è moltiplicata per 1,5.", // NEEDS QC
		shortDesc: "Su Campo Elettrico: potenza x1,5.", // NEEDS QC
	},
	psychic: {
		name: "Psichico",
		// Official flavor text: "Il bersaglio viene colpito da una potente forza telecinetica che può anche ridurne la Difesa Speciale."
		desc: "Ha il 10% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "10% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
		gen1: {
			desc: "Ha il 33% di probabilità di ridurre lo Speciale del bersaglio di un livello.", // NEEDS QC
			shortDesc: "33% di ridurre lo Speciale del bersaglio di 1.", // NEEDS QC
		},
	},
	psychicfangs: {
		name: "Psicozanna",
		// Official flavor text: "Morde il bersaglio con delle zanne generate con l’energia psichica e rompe barriere come Riflesso e Schermoluce."
		desc: "Se questo attacco non fallisce, gli effetti di Riflesso, Schermoluce e Velaurora finiscono per la parte del bersaglio prima del calcolo dei danni.", // NEEDS QC
		shortDesc: "Distrugge gli schermi, salvo bersaglio immune.", // NEEDS QC
	},
	psychicnoise: {
		name: "Psicorumore",
		desc: "Per 2 turni, il bersaglio non può recuperare PS finché resta in campo. Durante l'effetto, le mosse curative e assorbenti sono inutilizzabili, e le abilità e gli strumenti curativi non curano. Se un Pokémon colpito usa Staffetta, il sostituto resta incapace di recuperare PS. Malcomune e l'abilità Rigenergia non sono influenzate.", // NEEDS QC
		shortDesc: "2 turni: il bersaglio non può curarsi.", // NEEDS QC
	},
	psychicterrain: {
		name: "Campo Psichico",
		// Official flavor text: "Per cinque turni il terreno entra nello stato di Campo Psichico: i Pokémon a terra non subiscono mosse ad alta priorità e le mosse di tipo Psico sono potenziate."
		desc: "Per 5 turni, il terreno diventa un Campo Psichico. Durante l'effetto, la potenza degli attacchi di tipo Psico dei Pokémon a terra è moltiplicata per 1,3, e i Pokémon a terra non possono essere colpiti da mosse con priorità superiore a 0, a meno che il bersaglio non sia un alleato. Camuffamento trasforma chi la usa in tipo Psico, Naturforza diventa Psichico e Forzasegreta ha il 30% di probabilità di ridurre la Velocità del bersaglio di un livello. Fallisce se il terreno attuale è già un Campo Psichico.", // NEEDS QC
		shortDesc: "5 turni: Psico +; blocca le mosse con priorità.", // NEEDS QC
		gen7: {
			desc: "Per 5 turni, il terreno diventa un Campo Psichico. Durante l'effetto, la potenza degli attacchi di tipo Psico dei Pokémon a terra è moltiplicata per 1,5, e i Pokémon a terra non possono essere colpiti da mosse con priorità superiore a 0, a meno che il bersaglio non sia un alleato. Camuffamento trasforma chi la usa in tipo Psico, Naturforza diventa Psichico e Forzasegreta ha il 30% di probabilità di ridurre la Velocità del bersaglio di un livello. Fallisce se il terreno attuale è già un Campo Psichico.", // NEEDS QC
		},
	},
	psychoboost: {
		name: "Psicoslancio",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Riduce l'Attacco Speciale di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce l'Att. Sp. di chi la usa di 2.", // NEEDS QC
	},
	psychocut: {
		name: "Psicotaglio",
		// Official flavor text: "Chi la usa colpisce il bersaglio con lame fatte di forza psichica. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	psychoshift: {
		name: "Psicotransfer",
		// Official flavor text: "Con la forza psichica e la suggestione, chi la usa può trasferire i suoi problemi di stato al Pokémon colpito."
		desc: "Il problema di stato di chi la usa viene trasferito al bersaglio, e chi la usa viene curato. Fallisce se chi la usa non ha problemi di stato o se il bersaglio ne ha già uno.", // NEEDS QC
		shortDesc: "Trasferisce il suo problema di stato al bersaglio.", // NEEDS QC
	},
	psychup: {
		name: "Psicamisù",
		// Official flavor text: "Chi la usa s’ipnotizza per copiare ogni modifica alle statistiche del bersaglio."
		desc: "Chi la usa copia tutti i livelli attuali delle statistiche del bersaglio.", // NEEDS QC
		shortDesc: "Copia i cambi di statistiche del bersaglio.", // NEEDS QC
		gen2: {
			desc: "Chi la usa copia tutti i livelli attuali delle statistiche del bersaglio. Fallisce se i livelli delle statistiche del bersaglio sono tutti a 0.", // NEEDS QC
		},
	},
	psyshieldbash: {
		name: "Barrierassalto",
		desc: "Ha il 100% di probabilità di aumentare la Difesa di chi la usa di un livello.", // NEEDS QC
		shortDesc: "100% di aumentare la Difesa di chi la usa di 1.", // NEEDS QC
	},
	psyshock: {
		name: "Psicoshock",
		// Official flavor text: "Chi la usa attacca il bersaglio facendo materializzare misteriose onde psichiche che provocano danni fisici."
		desc: "Infligge danni al bersaglio in base alla sua Difesa invece che alla sua Difesa Speciale.", // NEEDS QC
		shortDesc: "Colpisce la Difesa del bersaglio, non la Dif. Sp.", // NEEDS QC
	},
	psystrike: {
		name: "Psicobotta",
		// Official flavor text: "Chi la usa attacca il bersaglio facendo materializzare misteriose onde psichiche che provocano danni fisici."
		desc: "Infligge danni al bersaglio in base alla sua Difesa invece che alla sua Difesa Speciale.", // NEEDS QC
		shortDesc: "Colpisce la Difesa del bersaglio, non la Dif. Sp.", // NEEDS QC
	},
	psywave: {
		name: "Psiconda",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Infligge al bersaglio danni pari a (livello di chi la usa) × (X + 50) / 100, dove X è un numero casuale tra 0 e 100, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Danni casuali tra 0,5x e 1,5x il suo livello.", // NEEDS QC
		gen4: {
			desc: "Infligge al bersaglio danni pari a (livello di chi la usa) × (X × 10 + 50) / 100, dove X è un numero casuale tra 0 e 10, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		},
		gen2: {
			desc: "Infligge al bersaglio danni pari a un numero casuale tra 1 e (livello di chi la usa × 1,5 − 1), arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
			shortDesc: "Danni casuali da 1 a (livello x 1,5 - 1).", // NEEDS QC
		},
	},
	pulverizingpancake: {
		name: "Adesso Faccio sul Serio",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	punishment: {
		name: "Punizione",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza è pari a 60 + (X × 20), dove X è il totale dei livelli positivi delle statistiche del bersaglio, fino a un massimo di 200.", // NEEDS QC
		shortDesc: "Potenza 60, +20 per ogni aumento del bersaglio.", // NEEDS QC
	},
	purify: {
		name: "Purificazione",
		// Official flavor text: "Chi la usa cura i problemi di stato del bersaglio e in cambio recupera PS."
		desc: "Cura il problema di stato del bersaglio. Se il bersaglio è stato curato, chi la usa recupera metà dei suoi PS max, arrotondato per difetto.", // NEEDS QC
		shortDesc: "Cura lo stato del bersaglio; se sì, recupera 1/2 PS.", // NEEDS QC
	},
	pursuit: {
		name: "Inseguimento",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Se un avversario lascia il campo in questo turno, questa mossa lo colpisce prima che esca, anche se non era il bersaglio originale. Se chi la usa agisce dopo un avversario che usa Virata, Monito, Teletrasporto, Retromarcia o Invertivolt, ma non Staffetta, lo colpisce prima che esca. La potenza raddoppia e la precisione non viene verificata se chi la usa colpisce un avversario in uscita, e il suo turno finisce; se un avversario va KO così, il sostituto entra solo alla fine del turno.", // NEEDS QC
		shortDesc: "Colpisce a potenza x2 i nemici in uscita.", // NEEDS QC
		gen7: {
			desc: "Se un avversario adiacente lascia il campo in questo turno, questa mossa lo colpisce prima che esca, anche se non era il bersaglio originale. Se chi la usa agisce dopo un avversario che usa Monito, Retromarcia o Invertivolt, ma non Staffetta, lo colpisce prima che esca. La potenza raddoppia e la precisione non viene verificata se chi la usa colpisce un avversario in uscita, e il suo turno finisce; se un avversario va KO così, il sostituto entra solo alla fine del turno.", // NEEDS QC
		},
		gen5: {
			desc: "Se un avversario adiacente lascia il campo in questo turno, questa mossa lo colpisce prima che esca, anche se non era il bersaglio originale. Se chi la usa agisce dopo un avversario che usa Retromarcia o Invertivolt, ma non Staffetta, lo colpisce prima che esca. La potenza raddoppia e la precisione non viene verificata se chi la usa colpisce un avversario in uscita, e il suo turno finisce; se un avversario va KO così, il sostituto entra solo alla fine del turno.", // NEEDS QC
		},
		gen4: {
			desc: "Se un avversario lascia il campo in questo turno, questa mossa lo colpisce prima che esca, anche se non era il bersaglio originale. Se chi la usa agisce dopo un avversario che usa Retromarcia, ma non Staffetta, lo colpisce prima che esca. La potenza raddoppia e la precisione non viene verificata se chi la usa colpisce un avversario in uscita, e il suo turno finisce; se un avversario va KO così, il sostituto entra immediatamente.", // NEEDS QC
		},
		gen3: {
			desc: "Se il bersaglio è un avversario e lascia il campo in questo turno, questa mossa lo colpisce prima che esca. La potenza raddoppia e la precisione non viene verificata se chi la usa colpisce un avversario in uscita, e il suo turno finisce; se un avversario va KO così, il sostituto entra immediatamente.", // NEEDS QC
			shortDesc: "Potenza doppia se il bersaglio scelto si ritira.", // NEEDS QC
		},
		gen2: {
			desc: "Se il bersaglio lascia il campo in questo turno, questa mossa lo colpisce con potenza raddoppiata prima che esca, e il turno di chi la usa finisce.", // NEEDS QC
			shortDesc: "Potenza doppia se il nemico si ritira.", // NEEDS QC
		},

		activate: "  ({TARGET} sta per essere richiamato...)", // NEEDS QC
	},
	pyroball: {
		name: "Palla Infuocata",
		// Official flavor text: "Chi la usa attacca con una palla creata incendiando una piccola pietra. Può anche scottare il bersaglio."
		desc: "Ha il 10% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "10% di scottare. Scongela chi la usa.", // NEEDS QC
	},
	quash: {
		name: "Spintone",
		// Official flavor text: "Chi la usa spinge via il bersaglio, costringendolo ad agire per ultimo."
		desc: "Il bersaglio agisce dopo tutti gli altri Pokémon in questo turno, indipendentemente dalla priorità della mossa scelta. Fallisce se il bersaglio ha già agito in questo turno.", // NEEDS QC
		shortDesc: "Costringe il bersaglio ad agire per ultimo nel turno.", // NEEDS QC

		activate: "  Il turno di {TARGET} slitta!",
	},
	quickattack: {
		name: "Attacco Rapido",
		// Official flavor text: "Chi la usa colpisce a una tale velocità da rendersi quasi invisibile. Questa mossa ha priorità alta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
	},
	quickguard: {
		name: "Anticipo",
		// Official flavor text: "Chi la usa protegge sé e gli alleati dalle mosse ad alta priorità."
		desc: "Chi la usa e la sua squadra sono protetti dagli attacchi con priorità (originale o modificata) superiore a 0 degli altri Pokémon, alleati compresi, in questo turno. Questa mossa modifica lo stesso contatore di 1 probabilità su X delle altre mosse di protezione, dove X parte da 1 e triplica a ogni uso riuscito, ma non usa quella probabilità per determinare il fallimento. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "Protegge la squadra dalle mosse con priorità.", // NEEDS QC
		gen8: {
			desc: "Chi la usa e la sua squadra sono protetti dagli attacchi con priorità (originale o modificata) superiore a 0 degli altri Pokémon, alleati compresi, in questo turno. Questa mossa modifica lo stesso contatore di 1 probabilità su X delle altre mosse di protezione, dove X parte da 1 e triplica a ogni uso riuscito, ma non usa quella probabilità per determinare il fallimento. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa e la sua squadra sono protetti dagli attacchi con priorità (originale o modificata) superiore a 0 degli altri Pokémon, alleati compresi, in questo turno. Questa mossa modifica lo stesso contatore di 1 probabilità su X delle altre mosse di protezione, dove X parte da 1 e triplica a ogni uso riuscito, ma non usa quella probabilità per determinare il fallimento. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa e la sua squadra sono protetti dagli attacchi con priorità (originale o modificata) superiore a 0 degli altri Pokémon, alleati compresi, in questo turno. Questa mossa modifica lo stesso contatore di 1 probabilità su X delle altre mosse di protezione, dove X parte da 1 e triplica a ogni uso riuscito, ma non usa quella probabilità per determinare il fallimento. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa e la sua squadra sono protetti dagli attacchi con priorità originale superiore a 0 degli altri Pokémon, alleati compresi, in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e raddoppia a ogni uso riuscito. X torna a 1 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza, Protezione, Anticipo o Bodyguard. Se X è 256 o più, questa mossa ha 1 probabilità su 2^32 di riuscire. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		},

		start: "  {TEAM} è protetto da Anticipo!",
		block: "  {POKEMON} è protetto da Anticipo!",
	},
	quiverdance: {
		name: "Eledanza",
		// Official flavor text: "Danza leggiadra ed elegante che aumenta l’Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa."
		desc: "Aumenta l'Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "+1 Att. Sp., Dif. Sp. e Vel. di chi la usa.", // NEEDS QC
	},
	rage: {
		name: "Ira",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Una volta usata con successo, l'Attacco di chi la usa aumenta di un livello ogni volta che viene colpito dall'attacco di un altro Pokémon, finché questa mossa resta selezionata.", // NEEDS QC
		shortDesc: "+1 Attacco se viene colpito mentre la usa.", // NEEDS QC
		gen3: {
			desc: "Una volta usata questa mossa, e a meno che il bersaglio non si sia protetto, l'Attacco di chi la usa aumenta di un livello ogni volta che viene colpito dall'attacco di un altro Pokémon, finché questa mossa resta selezionata.", // NEEDS QC
		},
		gen2: {
			desc: "Una volta usata con successo, X parte da 1. I danni di questa mossa sono moltiplicati per X, e ogni volta che chi la usa viene colpito dall'avversario, X aumenta di 1, fino a un massimo di 255. X torna a 1 quando chi la usa non è più in campo o non ha scelto questa mossa.", // NEEDS QC
			shortDesc: "La prossima Ira aumenta se viene colpito.", // NEEDS QC
		},
		gen1: {
			desc: "Una volta usata con successo, chi la usa esegue automaticamente questa mossa ogni turno e non può più essere sostituito. Durante l'effetto, il suo Attacco aumenta di un livello ogni volta che viene colpito dall'avversario, e la precisione di questa mossa viene sovrascritta a ogni turno con la precisione attuale calcolata, compresi i cambi di livello, ma non sotto 1/256 né sopra 255/256.", // NEEDS QC
			shortDesc: "Dura per sempre. +1 Attacco quando viene colpito.", // NEEDS QC
		},
	},
	ragefist: {
		name: "Pugno Furibondo",
		desc: "La potenza è pari a 50 + (X × 50), dove X è il numero totale di volte in cui chi la usa è stato colpito da un attacco che infligge danni durante la lotta, anche se non ha perso PS. X non può superare 6 e non si azzera con la sostituzione o il KO. Ogni colpo di una mossa multicolpo viene contato, ma non i danni da confusione.", // NEEDS QC
		shortDesc: "+50 di potenza per ogni colpo subito (max 6).", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	ragepowder: {
		name: "Polverabbia",
		// Official flavor text: "Chi la usa attira l’attenzione dei nemici cospargendosi di una polvere irritante e diventando bersaglio di tutti gli attacchi."
		desc: "Fino alla fine del turno, tutti gli attacchi a bersaglio singolo della parte avversaria vengono reindirizzati su chi la usa. Questi attacchi vengono reindirizzati prima di poter essere rimbalzati da Magivelo o dall'abilità Magispecchio, o attirati dalle abilità Parafulmine o Acquascolo. Fallisce se non è una Lotta in Doppio o una Battle Royale. Questo effetto è ignorato mentre chi la usa è sotto l'effetto di Cadutalibera.", // NEEDS QC
		shortDesc: "Le mosse nemiche puntano chi la usa in questo turno.", // NEEDS QC
		gen6: {
			desc: "Fino alla fine del turno, tutti gli attacchi a bersaglio singolo della parte avversaria vengono reindirizzati a chi la usa, se è a portata. Tali attacchi vengono reindirizzati prima di poter essere respinti da Magivelo o dall'abilità Magispecchio, o attirati dalle abilità Parafulmine o Acquascolo. Fallisce se non è una Lotta in Doppio o in Triplo. Questo effetto è ignorato mentre chi la usa è sotto l'effetto di Cadutalibera.", // NEEDS QC
		},

		start: "#followme",
		startFromZEffect: "#followme",
	},
	ragingbull: {
		name: "Scatenatoro",
		desc: "Se questo attacco non fallisce, gli effetti di Riflesso, Schermoluce e Velaurora finiscono per la parte del bersaglio prima del calcolo dei danni. Se la forma attuale di chi la usa è un Tauros di Paldea, il tipo di questa mossa cambia di conseguenza: tipo Lotta per la Stirpe Combattiva, tipo Fuoco per la Stirpe Fiammante e tipo Acqua per la Stirpe Acquatica.", // NEEDS QC
		shortDesc: "Distrugge gli schermi. Tipo in base alla forma.", // NEEDS QC

		activate: "  {POKEMON} infrange le protezioni di {TEAM}!", // NEEDS QC
	},
	ragingfury: {
		name: "Ira Furente",
		desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio nel primo turno dell'effetto o nel secondo di un effetto di tre turni, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia e chi la usa dorme, viene usata per un solo turno e non lo confonde.", // NEEDS QC
		shortDesc: "Dura 2-3 turni, poi chi la usa si confonde.", // NEEDS QC
	},
	raindance: {
		name: "Pioggiadanza",
		// Official flavor text: "Chi la usa provoca una forte pioggia per cinque turni, potenziando le mosse di tipo Acqua e riducendo la potenza di quelle di tipo Fuoco."
		desc: "Per 5 turni, il tempo diventa Pioggia. Durante l'effetto, i danni degli attacchi di tipo Acqua sono moltiplicati per 1,5 e quelli degli attacchi di tipo Fuoco per 0,5. Dura 8 turni se chi la usa ha una Rocciaumida. Fallisce se il tempo attuale è già Pioggia.", // NEEDS QC
		shortDesc: "5 turni: la pioggia potenzia le mosse Acqua.", // NEEDS QC
		gen3: {
			desc: "Per 5 turni, il tempo diventa Pioggia. Durante l'effetto, i danni degli attacchi di tipo Acqua sono moltiplicati per 1,5 e quelli degli attacchi di tipo Fuoco per 0,5. Fallisce se il tempo attuale è già Pioggia.", // NEEDS QC
		},
		gen2: {
			desc: "Per 5 turni, il tempo diventa Pioggia, anche se il tempo attuale è già Pioggia. Durante l'effetto, i danni degli attacchi di tipo Acqua sono moltiplicati per 1,5 e quelli degli attacchi di tipo Fuoco per 0,5.", // NEEDS QC
		},
	},
	rapidspin: {
		name: "Rapigiro",
		// Official flavor text: "Attacco rotante che elimina gli effetti di mosse come Legatutto, Avvolgibotta e Parassiseme. Aumenta anche la Velocità di chi la usa."
		desc: "Se questa mossa va a segno e chi la usa non è KO, gli effetti di Parassiseme e delle mosse intrappolanti finiscono per chi la usa, e tutte le trappole vengono rimosse dalla sua parte del campo. Ha il 100% di probabilità di aumentare la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Si libera da trappole e morse; +1 Velocità.", // NEEDS QC
		gen7: {
			desc: "Se questa mossa va a segno e chi la usa non è KO, gli effetti di Parassiseme e delle mosse intrappolanti finiscono per chi la usa, e tutte le trappole vengono rimosse dalla sua parte del campo.", // NEEDS QC
			shortDesc: "Libera da trappole, morse e Parassiseme.", // NEEDS QC
		},
		gen4: {
			desc: "Se questa mossa va a segno, gli effetti di Parassiseme e delle mosse intrappolanti finiscono per chi la usa, e tutte le trappole vengono rimosse dalla sua parte del campo.", // NEEDS QC
		},
		gen3: {
			desc: "Se questa mossa va a segno, gli effetti di Parassiseme e delle mosse intrappolanti finiscono per chi la usa, e Punte viene rimossa dalla sua parte del campo.", // NEEDS QC
		},
	},
	razorleaf: {
		name: "Foglielama",
		// Official flavor text: "Foglie taglienti sferzano i nemici intorno. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta prob. di brutto colpo. Colpisce i nemici vicini.", // NEEDS QC
		gen2: {
			shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
		},
	},
	razorshell: {
		name: "Conchilama",
		// Official flavor text: "Chi la usa colpisce il bersaglio con il suo guscio affilato. Il colpo può anche ridurre la Difesa del bersaglio."
		desc: "Ha il 50% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "50% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
	},
	razorwind: {
		name: "Ventagliente",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha una probabilità più alta di brutto colpo. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Carica, colpisce al turno 2. Alta prob. di critico.", // NEEDS QC
		gen4: {
			desc: "Ha una probabilità più alta di brutto colpo. Questo attacco si carica nel primo turno e viene eseguito nel secondo.", // NEEDS QC
		},
		gen3: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo.", // NEEDS QC
			shortDesc: "Si carica, poi colpisce i nemici al turno 2.", // NEEDS QC
		},
		gen2: {
			desc: "Ha una probabilità più alta di brutto colpo. Questo attacco si carica nel primo turno e viene eseguito nel secondo.", // NEEDS QC
			shortDesc: "Si carica e colpisce al turno 2. Alto tasso critico.", // NEEDS QC
		},
		gen1: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo.", // NEEDS QC
			shortDesc: "Si carica al turno 1. Colpisce al turno 2.", // NEEDS QC
		},

		prepare: "  {POKEMON} genera un uragano!",
	},
	recover: {
		name: "Ripresa",
		// Official flavor text: "Mossa autocurativa. Chi la usa recupera metà dei PS massimi."
		desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per eccesso da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei suoi PS max.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per difetto.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per difetto. Fallisce se (PS max di chi la usa − PS attuali + 1) è divisibile per 256.", // NEEDS QC
		},
	},
	recycle: {
		name: "Riciclo",
		// Official flavor text: "Chi la usa ricicla uno strumento che ha usato nella lotta e può riutilizzarlo."
		desc: "Chi la usa recupera l'ultimo strumento che ha usato. Fallisce se chi la usa ha uno strumento, se non ne ha tenuto uno, se lo strumento era un Palloncino scoppiato, se è stato raccolto da un Pokémon con l'abilità Raccolta, o se è stato perso a causa di Coleomorso, Gas Corrosivo, Supplica, Bruciatutto, Privazione, Spennata o Furto. Gli strumenti lanciati con Lancio possono essere recuperati.", // NEEDS QC
		shortDesc: "Recupera l'ultimo strumento che ha usato.", // NEEDS QC
		gen7: {
			desc: "Chi la usa recupera l'ultimo strumento che ha usato. Fallisce se chi la usa ha uno strumento, se non ne ha tenuto uno, se lo strumento era un Palloncino scoppiato, se è stato raccolto da un Pokémon con l'abilità Raccolta, o se è stato perso a causa di Coleomorso, Supplica, Bruciatutto, Privazione, Spennata o Furto. Gli strumenti lanciati con Lancio possono essere recuperati.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa recupera lo strumento usato per ultimo da un Pokémon nella sua posizione attuale sul campo, anche se quel Pokémon non era chi la usa. Fallisce se chi la usa ha uno strumento, se nessuno strumento è stato usato nella sua posizione, o se lo strumento è stato perso a causa di Supplica, Privazione o Furto. Gli strumenti lanciati con Lancio possono essere recuperati.", // NEEDS QC
		},

		addItem: "  {POKEMON} ricicla {ITEM}!",
	},
	reflect: {
		name: "Riflesso",
		// Official flavor text: "Innalza una barriera misteriosa che riduce i danni degli attacchi fisici per sé e gli alleati per cinque turni."
		desc: "Per 5 turni, chi la usa e la sua squadra subiscono 0,5 volte i danni degli attacchi fisici, o 0,66 volte in Lotta in Doppio. I danni non vengono ridotti ulteriormente con Velaurora. I brutti colpi ignorano questo effetto. Viene rimosso dalla parte di chi la usa se lui o un alleato viene colpito da Breccia, Psicozanna o Scacciabruma. Dura 8 turni se chi la usa ha una Creta Luce. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "5 turni: danni fisici subiti dimezzati.", // NEEDS QC
		gen6: {
			desc: "Per 5 turni, chi la usa e la sua squadra subiscono 0,5 volte i danni degli attacchi fisici, o 0,66 volte in Lotta in Doppio o in Triplo. I brutti colpi ignorano questo effetto. Viene rimosso dalla parte di chi la usa se lui o un alleato viene colpito da Breccia o Scacciabruma. Dura 8 turni se chi la usa ha una Creta Luce. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		},
		gen4: {
			desc: "Per 5 turni, chi la usa e la sua squadra subiscono 1/2 dei danni degli attacchi fisici, o 2/3 se ci sono più Pokémon attivi dalla parte di chi la usa. I brutti colpi ignorano questo effetto. Viene rimosso dalla parte di chi la usa se lui o un alleato viene colpito da Breccia o Scacciabruma. Dura 8 turni se chi la usa ha una Creta Luce. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		},
		gen3: {
			desc: "Per 5 turni, chi la usa e la sua squadra subiscono 1/2 dei danni degli attacchi fisici, o 2/3 se ci sono più Pokémon attivi dalla parte di chi la usa. I brutti colpi ignorano questo effetto. Viene rimosso dalla parte di chi la usa se lui o un alleato viene colpito da Breccia. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		},
		gen2: {
			desc: "Per 5 turni, chi la usa e la sua squadra hanno la Difesa raddoppiata. I brutti colpi ignorano questo effetto. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
			shortDesc: "5 turni: Difesa della squadra raddoppiata.", // NEEDS QC
		},
		gen1: {
			desc: "Finché chi la usa resta in campo, la sua Difesa è raddoppiata quando subisce danni. I brutti colpi ignorano questa protezione. Questo effetto può essere rimosso da Nube.", // NEEDS QC
			shortDesc: "Finché è in campo, la sua Difesa raddoppia.", // NEEDS QC
			start: "  {POKEMON} si è corazzato!",
		},

		start: "  La resistenza di {TEAM} agli attacchi fisici aumenta grazie a Riflesso!",
		end: "  L’effetto di Riflesso su {TEAM} è finito!",
	},
	reflecttype: {
		name: "Riflettipo",
		// Official flavor text: "Chi la usa cambia il proprio tipo in quello del bersaglio."
		desc: "I tipi di chi la usa diventano i tipi attuali del bersaglio. Se i tipi attuali del bersaglio includono l'assenza di tipo e un tipo non aggiunto, l'assenza di tipo viene ignorata. Se includono l'assenza di tipo e un tipo aggiunto da Boscomalocchio o Halloween, l'assenza di tipo viene copiata come tipo Normale. Fallisce se chi la usa è un Arceus o un Silvally, se è teracristallizzato o se il bersaglio non ha alcun tipo.", // NEEDS QC
		shortDesc: "Copia i tipi del bersaglio.", // NEEDS QC
		gen8: {
			desc: "I tipi di chi la usa diventano i tipi attuali del bersaglio. Se i tipi attuali del bersaglio includono l'assenza di tipo e un tipo non aggiunto, l'assenza di tipo viene ignorata. Se includono l'assenza di tipo e un tipo aggiunto da Boscomalocchio o Halloween, l'assenza di tipo viene copiata come tipo Normale. Fallisce se chi la usa è un Arceus o un Silvally, o se il bersaglio non ha alcun tipo.", // NEEDS QC
		},
		gen6: {
			desc: "I tipi di chi la usa diventano i tipi attuali del bersaglio. Fallisce se chi la usa è un Arceus.", // NEEDS QC
		},

		typeChange: "  {POKEMON} assume il tipo di {SOURCE}!",
	},
	refresh: {
		name: "Rinfrescata",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Cura la scottatura, l'avvelenamento o la paralisi di chi la usa. Fallisce se chi la usa non è scottato, avvelenato o paralizzato.", // NEEDS QC
		shortDesc: "Cura la sua scottatura, veleno o paralisi.", // NEEDS QC
	},
	relicsong: {
		name: "Cantoantico",
		// Official flavor text: "Chi la usa attacca i nemici intorno a sé intonando un’antica melodia che colpisce il loro spirito. Può anche farli addormentare."
		desc: "Ha il 10% di probabilità di addormentare il bersaglio. Se va a segno contro almeno un bersaglio e chi la usa è una Meloetta, assume la Forma Danza se è in Forma Canto, o la Forma Canto se è in Forma Danza. Questo cambio di forma non avviene se la Meloetta ha l'abilità Forzabruta. La Forma Danza torna Forma Canto quando Meloetta lascia il campo.", // NEEDS QC
		shortDesc: "10% di addormentare. Meloetta cambia forma.", // NEEDS QC
	},
	rest: {
		name: "Riposo",
		// Official flavor text: "Chi la usa recupera tutti i PS e guarisce da tutti i suoi problemi di stato, ma dorme per due turni."
		desc: "Chi la usa si addormenta per i due turni successivi e recupera tutti i suoi PS, curandosi da ogni problema di stato. Fallisce se chi la usa ha tutti i PS, se dorme già o se un altro effetto impedisce il sonno.", // NEEDS QC
		shortDesc: "Dorme 2 turni: recupera tutti i PS e lo stato.", // NEEDS QC
		gen2: {
			desc: "Chi la usa si addormenta per i due turni successivi e recupera tutti i suoi PS, curandosi da ogni problema di stato, anche se dorme già. Fallisce se chi la usa ha tutti i PS.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa si addormenta per i due turni successivi e recupera tutti i suoi PS, curandosi da ogni problema di stato. Questo non rimuove la penalità alle statistiche dovuta a scottatura o paralisi. Fallisce se chi la usa ha tutti i PS.", // NEEDS QC
		},
	},
	retaliate: {
		name: "Nemesi",
		// Official flavor text: "Vendica un alleato messo KO. Se ciò è accaduto al turno precedente, il danno è maggiore."
		desc: "La potenza raddoppia se un membro della squadra di chi la usa è andato KO nel turno precedente.", // NEEDS QC
		shortDesc: "Potenza x2 se un alleato è andato KO al turno prima.", // NEEDS QC
	},
	return: {
		name: "Ritorno",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza è pari a (felicità di chi la usa × 2/5), arrotondato per difetto, ma non meno di 1.", // NEEDS QC
		shortDesc: "Potenza max (102) con la felicità massima.", // NEEDS QC
	},
	revelationdance: {
		name: "Mutadanza",
		// Official flavor text: "Chi la usa si lancia in una danza e attacca il nemico con tutte le sue forze. Il tipo della mossa corrisponde al tipo del Pokémon che la usa."
		desc: "Il tipo di questa mossa dipende dal tipo primario di chi la usa. Se il tipo primario è l'assenza di tipo, questa mossa assume il suo tipo secondario se ne ha uno, altrimenti il tipo aggiunto da Boscomalocchio o Halloween. Questa mossa è senza tipo se chi la usa non ha alcun tipo.", // NEEDS QC
		shortDesc: "Il tipo è il primo tipo di chi la usa.", // NEEDS QC
	},
	revenge: {
		name: "Vendetta",
		// Official flavor text: "Mossa d’attacco che infligge un danno doppio se si è stati colpiti dal Pokémon bersaglio nello stesso turno."
		desc: "La potenza raddoppia se chi la usa è stato colpito dal bersaglio in questo turno.", // NEEDS QC
		shortDesc: "Potenza doppia se il bersaglio lo ha danneggiato.", // NEEDS QC
		gen4: {
			desc: "La potenza raddoppia se chi la usa è stato colpito in questo turno da un Pokémon nella posizione attuale del bersaglio.", // NEEDS QC
		},
		gen3: {
			desc: "I danni raddoppiano se chi la usa è stato colpito in questo turno da un Pokémon nella posizione attuale del bersaglio, e quel Pokémon è stato l'ultimo a colpirlo.", // NEEDS QC
			shortDesc: "Danni doppi se è stato colpito dal bersaglio.", // NEEDS QC
		},
	},
	reversal: {
		name: "Contropiede",
		// Official flavor text: "Chi la usa attacca con tutte le sue forze. Più i PS sono bassi, maggiore è la potenza di questa mossa."
		desc: "La potenza è 20 se X è tra 33 e 48, 40 se X è tra 17 e 32, 80 se X è tra 10 e 16, 100 se X è tra 5 e 9, 150 se X è tra 2 e 4, e 200 se X è 0 o 1, dove X è pari a (PS attuali di chi la usa × 48 / PS max di chi la usa), arrotondato per difetto.", // NEEDS QC
		shortDesc: "Più potente se chi la usa ha pochi PS.", // NEEDS QC
		gen4: {
			desc: "La potenza è 20 se X va da 43 a 48, 40 da 22 a 42, 80 da 13 a 21, 100 da 6 a 12, 150 da 2 a 5 e 200 se X è 0 o 1, dove X è pari a (PS attuali di chi la usa × 64 ÷ PS max di chi la usa), arrotondato per difetto.", // NEEDS QC
		},
		gen3: {
			desc: "La potenza è 20 se X è tra 33 e 48, 40 se X è tra 17 e 32, 80 se X è tra 10 e 16, 100 se X è tra 5 e 9, 150 se X è tra 2 e 4, e 200 se X è 0 o 1, dove X è pari a (PS attuali di chi la usa × 48 / PS max di chi la usa), arrotondato per difetto.", // NEEDS QC
		},
		gen2: {
			desc: "La potenza è 20 se X va da 33 a 48, 40 da 17 a 32, 80 da 10 a 16, 100 da 5 a 9, 150 da 2 a 4 e 200 se X è 0 o 1, dove X è pari a (PS attuali di chi la usa × 48 ÷ PS max di chi la usa), arrotondato per difetto. Questa mossa non ha varianza di danni e non può essere un brutto colpo.", // NEEDS QC
		},
	},
	revivalblessing: {
		name: "Preghiera Vitale",
		desc: "Un membro della squadra andato KO viene scelto e rianimato con metà dei suoi PS max, arrotondato per difetto. Fallisce se nessun membro della squadra è KO.", // NEEDS QC
		shortDesc: "Rianima un compagno KO con metà dei suoi PS.", // NEEDS QC

		heal: "  {POKEMON} torna in forze e può lottare di nuovo!",
	},
	risingvoltage: {
		name: "Elettroimpennata",
		// Official flavor text: "Chi la usa attacca con dell’elettricità che si alza dal suolo. La potenza della mossa raddoppia quando l’avversario si trova in un Campo Elettrico."
		desc: "Se il terreno attuale è un Campo Elettrico e il bersaglio è a terra, la potenza di questa mossa raddoppia.", // NEEDS QC
		shortDesc: "x2 su un bersaglio a terra su Campo Elettrico.", // NEEDS QC
	},
	roar: {
		name: "Boato",
		// Official flavor text: "Il bersaglio lascia il campo e viene sostituito. Mette fine alle lotte contro singoli Pokémon selvatici."
		desc: "Il bersaglio è costretto a lasciare il campo e viene sostituito da un alleato non KO scelto a caso. Fallisce se il bersaglio è l'ultimo Pokémon non KO della squadra, se ha usato Radicamento o se ha l'abilità Ventose.", // NEEDS QC
		shortDesc: "Il bersaglio viene sostituito da un alleato a caso.", // NEEDS QC
		gen4: {
			desc: "Il bersaglio è costretto a lasciare il campo e viene sostituito da un alleato non KO scelto a caso. Fallisce se il bersaglio è l'ultimo Pokémon non KO della squadra, se ha usato Radicamento o se ha l'abilità Ventose, o se il livello di chi la usa è inferiore a quello del bersaglio e X × (livello di chi la usa + livello del bersaglio) / 256 + 1 è minore o uguale a (livello del bersaglio / 4), arrotondato per difetto, dove X è un numero casuale tra 0 e 255.", // NEEDS QC
		},
		gen2: {
			desc: "Il bersaglio è costretto a lasciare il campo e viene sostituito da un alleato non KO scelto a caso. Fallisce se il bersaglio è l'ultimo Pokémon non KO della squadra, o se chi la usa agisce prima del bersaglio.", // NEEDS QC
		},
		gen1: {
			desc: "Nessuna utilità in lotta.", // NEEDS QC
			shortDesc: "Nessuna utilità in lotta.", // NEEDS QC
		},
	},
	roaroftime: {
		name: "Fragortempo",
		// Official flavor text: "Chi la usa colpisce il bersaglio con una forza capace di alterare il tempo, ma deve stare fermo al turno successivo."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
	},
	rockblast: {
		name: "Cadutamassi",
		// Official flavor text: "Colpisce il bersaglio con dei massi pesanti lanciati in rapida successione. Il numero di massi varia da due a cinque."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
	},
	rockclimb: {
		name: "Scalaroccia",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 20% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "20% di confondere il bersaglio.", // NEEDS QC
	},
	rockpolish: {
		name: "Lucidatura",
		// Official flavor text: "Chi la usa leviga il proprio corpo per ridurne l’attrito. Aumenta di molto la Velocità."
		desc: "Aumenta la Velocità di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta la Velocità di chi la usa di 2.", // NEEDS QC
	},
	rockslide: {
		name: "Frana",
		// Official flavor text: "I nemici vengono colpiti con violenza da grandi massi che possono anche farli tentennare."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
		gen1: {
			desc: "Nessun effetto aggiuntivo.", // NEEDS QC
			shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		},
		gen2: {
			shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
		},
	},
	rocksmash: {
		name: "Spaccaroccia",
		// Official flavor text: "Chi la usa colpisce il bersaglio con un pugno che può anche ridurne la Difesa."
		desc: "Ha il 50% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "50% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
	},
	rockthrow: {
		name: "Sassata",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	rocktomb: {
		name: "Rocciotomba",
		// Official flavor text: "Colpisce il bersaglio con rocce. Inoltre, lo rallenta riducendone la Velocità."
		desc: "Ha il 100% di probabilità di ridurre la Velocità del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Velocità del bersaglio di 1.", // NEEDS QC
	},
	rockwrecker: {
		name: "Devastomasso",
		// Official flavor text: "Chi la usa attacca il bersaglio con un enorme masso, ma si deve riposare al turno successivo."
		desc: "Se questa mossa va a segno, chi la usa deve ricaricarsi nel turno successivo e non può selezionare mosse.", // NEEDS QC
		shortDesc: "Chi la usa non può agire nel turno successivo.", // NEEDS QC
	},
	roleplay: {
		name: "Giocodiruolo",
		// Official flavor text: "Chi la usa mima in tutto il bersaglio, copiandone l’abilità."
		desc: "L'abilità di chi la usa diventa quella del bersaglio. Fallisce se l'abilità di chi la usa è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teramorfosi, Stato Zen o Supercambio o già uguale a quella del bersaglio, o se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Torre di Comando, Fantasmanto, Albergamemorie, Regalfiore, Previsioni, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Malia Tossica, Sciamefusione, Forza Chimica, Paleoattivazione, Carica Quark, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teraguscio, Teramorfosi, Zeroformazione, Traccia, Magidifesa, Stato Zen o Supercambio.", // NEEDS QC
		shortDesc: "Copia l'abilità del bersaglio.", // NEEDS QC
		gen8: {
			desc: "L'abilità di chi la usa diventa quella del bersaglio. Fallisce se l'abilità di chi la usa è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen o già uguale a quella del bersaglio, o se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Inghiottimissile, Pancialterna, Gelofaccia, Illusione, Sosia, Multitipo, Gas Reagente, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia, Magidifesa o Stato Zen.", // NEEDS QC
		},
		gen7: {
			desc: "L'abilità di chi la usa diventa quella del bersaglio. Fallisce se l'abilità di chi la usa è Morfosintonia, Sonno Assoluto, Fantasmanto, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta o Stato Zen o già uguale a quella del bersaglio, o se l'abilità del bersaglio è Morfosintonia, Sonno Assoluto, Fantasmanto, Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Sciamefusione, Forza Chimica, Ricezione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Traccia, Magidifesa o Stato Zen.", // NEEDS QC
		},
		gen6: {
			desc: "L'abilità di chi la usa diventa quella del bersaglio. Fallisce se l'abilità di chi la usa è Multitipo o Accendilotta o già uguale a quella del bersaglio, o se l'abilità del bersaglio è Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Accendilotta, Traccia, Magidifesa o Stato Zen.", // NEEDS QC
		},
		gen5: {
			desc: "L'abilità di chi la usa diventa quella del bersaglio. Fallisce se l'abilità di chi la usa è Multitipo o già uguale a quella del bersaglio, o se l'abilità del bersaglio è Regalfiore, Previsioni, Illusione, Sosia, Multitipo, Traccia, Magidifesa o Stato Zen.", // NEEDS QC
		},
		gen4: {
			desc: "L'abilità di chi la usa diventa quella del bersaglio. Fallisce se l'abilità di chi la usa è Multitipo o già uguale a quella del bersaglio, se l'abilità del bersaglio è Multitipo o Magidifesa, o se chi la usa ha una Grigiosfera.", // NEEDS QC
		},
		gen3: {
			desc: "L'abilità di chi la usa diventa quella del bersaglio. Fallisce se l'abilità del bersaglio è Magidifesa.", // NEEDS QC
		},

		changeAbility: "  {POKEMON} copia l’abilità {ABILITY} di {SOURCE}!",
	},
	rollingkick: {
		name: "Calciorullo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
	},
	rollout: {
		name: "Rotolamento",
		// Official flavor text: "Chi la usa colpisce il bersaglio rotolando per cinque turni, con aumento progressivo della potenza ogni volta che va a segno."
		desc: "Se questa mossa va a segno, chi la usa resta bloccato su di essa e non può fare altre azioni finché non fallisce, non passano 5 turni o l'attacco non può essere usato. La potenza raddoppia a ogni colpo riuscito, e raddoppia di nuovo se chi la usa ha usato Ricciolscudo in precedenza. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno.", // NEEDS QC
		shortDesc: "Potenza doppia a ogni colpo. Si ripete 5 turni.", // NEEDS QC
		gen7: {
			desc: "Se questa mossa va a segno, chi la usa resta bloccato su di essa e non può usare altre mosse finché non manca il bersaglio, non passano 5 turni o l'attacco non può essere usato. La potenza raddoppia a ogni colpo riuscito e raddoppia ancora se chi la usa ha usato Ricciolscudo in precedenza. Se questa mossa è usata tramite Sonnolalia, viene usata per un turno. Se questa mossa colpisce un Fantasmanto attivo durante l'effetto, il moltiplicatore di potenza si mette in pausa ma il contatore dei turni no, il che può permettere di applicare il moltiplicatore alla mossa successiva dopo la fine dell'effetto.", // NEEDS QC
		},
		gen6: {
			desc: "Se questa mossa va a segno, chi la usa resta bloccato su di essa e non può fare altre azioni finché non fallisce, non passano 5 turni o l'attacco non può essere usato. La potenza raddoppia a ogni colpo riuscito, e raddoppia di nuovo se chi la usa ha usato Ricciolscudo in precedenza. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno.", // NEEDS QC
		},
	},
	roost: {
		name: "Trespolo",
		// Official flavor text: "Chi la usa sta fermo e riposa, recuperando metà dei propri PS massimi."
		desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per eccesso da 0,5. Se chi la usa non è teracristallizzato, fino alla fine del turno chi è di tipo Volante perde il tipo Volante e chi è puramente di tipo Volante diventa di tipo Normale. Non fa nulla se chi la usa ha tutti i PS.", // NEEDS QC
		shortDesc: "Recupera 1/2 PS. Senza tipo Volante fino a fine turno.", // NEEDS QC
		gen8: {
			desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per eccesso da 0,5. Fino alla fine del turno, chi è di tipo Volante perde il tipo Volante e chi è puramente di tipo Volante diventa di tipo Normale. Non fa nulla se chi la usa ha tutti i PS.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per difetto. Fino alla fine del turno, chi è di tipo Volante perde il tipo Volante e chi è puramente di tipo Volante resta senza tipo. Non fa nulla se chi la usa ha tutti i PS.", // NEEDS QC
		},

		start: "  ({POKEMON} perde il tipo Volante per questo turno.)", // NEEDS QC
	},
	rototiller: {
		name: "Aracampo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Aumenta l'Attacco e l'Attacco Speciale di tutti i Pokémon di tipo Erba a terra di un livello.", // NEEDS QC
		shortDesc: "+1 Att e Att. Sp. ai tipi Erba a terra.", // NEEDS QC
	},
	round: {
		name: "Coro",
		// Official flavor text: "Attacca il bersaglio con una melodia. Se usata durante lo stesso turno da più Pokémon, i danni inflitti aumentano."
		desc: "Se altri Pokémon in campo hanno scelto questa mossa in questo turno, agiscono subito dopo chi la usa, in ordine di Velocità, e la potenza di questa mossa è 120 per ognuno di loro.", // NEEDS QC
		shortDesc: "Potenza x2 se un altro ha usato Coro nel turno.", // NEEDS QC
	},
	ruination: {
		name: "Catastrofe",
		desc: "Infligge al bersaglio danni pari a metà dei suoi PS attuali, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Infligge metà dei PS attuali del bersaglio.", // NEEDS QC
	},
	sacredfire: {
		name: "Magifuoco",
		// Official flavor text: "Colpisce il bersaglio con un fuoco mistico di enorme intensità che può anche causargli una scottatura."
		desc: "Ha il 50% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "50% di scottare. Scongela chi la usa.", // NEEDS QC
	},
	sacredsword: {
		name: "Spadasolenne",
		// Official flavor text: "Chi la usa taglia il bersaglio con una spada magica. Il danno inflitto ignora le modifiche alle statistiche del Pokémon colpito."
		desc: "Ignora i livelli delle statistiche del bersaglio, elusione compresa.", // NEEDS QC
		shortDesc: "Ignora i cambi di statistiche del bersaglio.", // NEEDS QC
	},
	safeguard: {
		name: "Salvaguardia",
		// Official flavor text: "Chi la usa crea un campo protettivo che evita problemi di stato per sé e gli alleati per cinque turni."
		desc: "Per 5 turni, chi la usa e la sua squadra non possono subire problemi di stato né confusione inflitti da altri Pokémon. I Pokémon della parte di chi la usa non possono essere colpiti da Sbadiglio, ma possono addormentarsi per il suo effetto. Viene rimossa dalla parte di chi la usa se lui o un alleato viene colpito da Scacciabruma. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "5 turni: protegge la squadra dai problemi di stato.", // NEEDS QC
		gen3: {
			desc: "Per 5 turni, chi la usa e la sua squadra non possono subire problemi di stato né confusione inflitti da altri Pokémon. I Pokémon della parte di chi la usa non possono essere colpiti da Sbadiglio, ma possono addormentarsi per il suo effetto. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		},
		gen2: {
			desc: "Per 5 turni, chi la usa e la sua squadra non possono subire problemi di stato né confusione inflitti da altri Pokémon. Durante l'effetto, Oltraggio, Colpo e Petalodanza non confondono chi la usa. Fallisce se l'effetto è già attivo nella sua parte.", // NEEDS QC
		},

		start: "  Un velo mistico ricopre {TEAM}!",
		end: "  {TEAM:capitalize} non è più protetta da Salvaguardia!",
		block: "  Salvaguardia protegge {POKEMON}!",
	},
	saltcure: {
		name: "Sotto Sale",
		desc: "Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/4 se il bersaglio è di tipo Acciaio o Acqua), arrotondato per difetto, alla fine di ogni turno durante l'effetto. L'effetto finisce quando il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Infligge 1/8 dei PS a turno; 1/4 ad Acciaio e Acqua.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  {POKEMON} è sotto sale!",
		damage: "  {POKEMON} subisce i danni della mossa Sotto Sale!",
	},
	sandattack: {
		name: "Turbosabbia",
		// Official flavor text: "Getta sabbia in faccia al bersaglio e ne riduce la precisione."
		desc: "Riduce la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce la precisione del bersaglio di 1.", // NEEDS QC
	},
	sandsearstorm: {
		name: "Tempesta Ardente",
		desc: "Ha il 20% di probabilità di scottare il bersaglio. Se il tempo è Acquazzone o Pioggia, questa mossa non verifica la precisione. Se usata contro un Pokémon con un Superombrello, la precisione resta all'80%.", // NEEDS QC
		shortDesc: "20% di scottare. Non fallisce con la pioggia.", // NEEDS QC
	},
	sandstorm: {
		name: "Terrempesta",
		// Official flavor text: "Causa una tempesta di sabbia per cinque turni che danneggia tutti i tipi esclusi Terra, Roccia e Acciaio. Aumenta la Dif. Speciale dei Pokémon di tipo Roccia."
		desc: "Per 5 turni, il tempo diventa tempesta di sabbia. Alla fine di ogni turno tranne l'ultimo, tutti i Pokémon in campo perdono 1/16 dei loro PS max, arrotondato per difetto, a meno che non siano di tipo Terra, Roccia o Acciaio, o abbiano l'abilità Magicscudo, Copricapo, Silicoforza, Remasabbia o Sabbiavelo. Durante l'effetto, la Difesa Speciale dei Pokémon di tipo Roccia è moltiplicata per 1,5 quando subiscono un attacco speciale. Dura 8 turni se chi la usa ha una Roccialiscia. Fallisce se il tempo attuale è già tempesta di sabbia.", // NEEDS QC
		shortDesc: "5 turni: tempesta di sabbia. Roccia: Dif. Sp. x1,5.", // NEEDS QC
		gen4: {
			desc: "Per 5 turni, il tempo diventa tempesta di sabbia. Alla fine di ogni turno tranne l'ultimo, tutti i Pokémon in campo perdono 1/16 dei loro PS max, arrotondato per difetto, a meno che non siano di tipo Terra, Roccia o Acciaio, o abbiano l'abilità Magicscudo o Sabbiavelo. Durante l'effetto, la Difesa Speciale dei Pokémon di tipo Roccia è moltiplicata per 1,5 quando subiscono un attacco speciale. Dura 8 turni se chi la usa ha una Roccialiscia. Fallisce se il tempo attuale è già tempesta di sabbia.", // NEEDS QC
		},
		gen3: {
			desc: "Per 5 turni, il tempo diventa tempesta di sabbia. Alla fine di ogni turno tranne l'ultimo, tutti i Pokémon in campo perdono 1/16 dei loro PS max, arrotondato per difetto, a meno che non siano di tipo Terra, Roccia o Acciaio, o abbiano l'abilità Sabbiavelo. Fallisce se il tempo attuale è già tempesta di sabbia.", // NEEDS QC
			shortDesc: "Per 5 turni infuria una tempesta di sabbia.", // NEEDS QC
		},
		gen2: {
			desc: "Per 5 turni, il tempo diventa tempesta di sabbia. Alla fine di ogni turno tranne l'ultimo, tutti i Pokémon in campo perdono 1/8 dei loro PS max, arrotondato per difetto, a meno che non siano di tipo Terra, Roccia o Acciaio. Fallisce se il tempo attuale è già tempesta di sabbia.", // NEEDS QC
		},
	},
	sandtomb: {
		name: "Sabbiotomba",
		// Official flavor text: "Chi la usa intrappola il bersaglio in una tempesta di sabbia per quattro o cinque turni."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max (1/8 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni (sempre cinque se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
			shortDesc: "Intrappola e ferisce il bersaglio per 2-5 turni.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni. Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se usa Staffetta. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},

		start: "  {POKEMON} è intrappolato da Sabbiotomba!",
	},
	sappyseed: {
		name: "Bombafrush",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Questa mossa evoca Parassiseme sul bersaglio.", // NEEDS QC
		shortDesc: "Evoca l'effetto di Parassiseme.", // NEEDS QC
	},
	savagespinout: {
		name: "Bozzolo Fatale",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	scald: {
		name: "Idrovampata",
		// Official flavor text: "Chi la usa attacca il bersaglio con un getto d’acqua bollente che può anche scottarlo."
		desc: "Ha il 30% di probabilità di scottare il bersaglio. Il bersaglio viene scongelato se era congelato.", // NEEDS QC
		shortDesc: "30% di scottare. Scongela il bersaglio.", // NEEDS QC
		gen5: {
			desc: "Ha il 30% di probabilità di scottare il bersaglio.", // NEEDS QC
			shortDesc: "30% di scottare il bersaglio.", // NEEDS QC
		},
	},
	scaleshot: {
		name: "Squamacolpo",
		// Official flavor text: "Il Pokémon attacca lanciando delle squame da due a cinque volte di fila. Aumenta la Velocità di chi la usa, ma ne riduce la Difesa."
		desc: "Colpisce da due a cinque volte. Riduce la Difesa di chi la usa di un livello e aumenta la sua Velocità di un livello dopo l'ultimo colpo. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce 2-5 volte. Dopo: -1 Dif, +1 Velocità.", // NEEDS QC
	},
	scaryface: {
		name: "Visotruce",
		// Official flavor text: "Chi la usa spaventa il bersaglio con una faccia terribile e ne riduce di molto la Velocità."
		desc: "Riduce la Velocità del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce la Velocità del bersaglio di 2.", // NEEDS QC
	},
	scorchingsands: {
		name: "Sabbiardente",
		// Official flavor text: "Chi la usa attacca il bersaglio scagliandogli addosso della sabbia incandescente. Può anche scottarlo."
		desc: "Ha il 30% di probabilità di scottare il bersaglio. Il bersaglio viene scongelato se era congelato.", // NEEDS QC
		shortDesc: "30% di scottare. Scongela il bersaglio.", // NEEDS QC
	},
	scratch: {
		name: "Graffio",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	screech: {
		name: "Stridio",
		// Official flavor text: "Stridio assordante che riduce di molto la Difesa del bersaglio."
		desc: "Riduce la Difesa del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce la Difesa del bersaglio di 2.", // NEEDS QC
	},
	searingshot: {
		name: "Sparafuoco",
		// Official flavor text: "Chi la usa lancia fiamme scarlatte su tutti i Pokémon nelle vicinanze, danneggiandoli. Può anche scottarli."
		desc: "Ha il 30% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "30% di scottare i Pokémon adiacenti.", // NEEDS QC
	},
	searingsunrazesmash: {
		name: "Supercollisione Solare",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Questa mossa e i suoi effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		shortDesc: "Ignora le abilità degli altri Pokémon.", // NEEDS QC
	},
	secretpower: {
		name: "Forzasegreta",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 30% di probabilità di causare un effetto secondario in base al terreno di lotta: paralisi sul terreno standard, paralisi su un Campo Elettrico, riduzione di un livello dell'Attacco Speciale su un Campo Nebbioso, sonno su un Campo Erboso e riduzione di un livello della Velocità su un Campo Psichico.", // NEEDS QC
		shortDesc: "Effetto in base al terreno (30% di paralisi).", // NEEDS QC
		gen6: {
			desc: "Ha il 30% di probabilità di causare un effetto secondario in base al terreno di lotta: paralisi sul terreno Wi-Fi standard, paralisi su un Campo Elettrico, riduzione di un livello dell'Attacco Speciale su un Campo Nebbioso e sonno su un Campo Erboso.", // NEEDS QC
		},
		gen5: {
			desc: "Ha il 30% di probabilità di causare un effetto secondario in base al terreno di lotta: riduzione di un livello della precisione sul terreno Wi-Fi standard. La probabilità dell'effetto secondario non è influenzata dall'abilità Leggiadro.", // NEEDS QC
			shortDesc: "Effetto in base al terreno. (30%: precisione -1)", // NEEDS QC
		},
		gen4: {
			desc: "Ha il 30% di probabilità di causare un effetto secondario in base al terreno di lotta: paralisi sul terreno Wi-Fi standard.", // NEEDS QC
			shortDesc: "Effetto in base al terreno (30% di paralisi).", // NEEDS QC
		},
	},
	secretsword: {
		name: "Spadamistica",
		// Official flavor text: "Chi la usa attacca il bersaglio tagliandolo con una spada mistica. La misteriosa energia sprigionata provoca danni fisici."
		desc: "Infligge danni al bersaglio in base alla sua Difesa invece che alla sua Difesa Speciale.", // NEEDS QC
		shortDesc: "Colpisce la Difesa del bersaglio, non la Dif. Sp.", // NEEDS QC
	},
	seedbomb: {
		name: "Semebomba",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	seedflare: {
		name: "Infuriaseme",
		// Official flavor text: "Chi la usa genera un’onda d’urto dal suo corpo. Può anche ridurre di molto la Difesa Speciale del bersaglio."
		desc: "Ha il 40% di probabilità di ridurre la Difesa Speciale del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "40% di ridurre la Dif. Sp. del bersaglio di 2.", // NEEDS QC
	},
	seismictoss: {
		name: "Movim. Sismico",
		// Official flavor text: "Colpisce il bersaglio con la forza di gravità. Infligge un danno pari al livello di chi la usa."
		desc: "Infligge al bersaglio danni pari al livello di chi la usa.", // NEEDS QC
		shortDesc: "Infligge danni pari al livello di chi la usa.", // NEEDS QC
		gen1: {
			desc: "Infligge al bersaglio danni pari al livello di chi la usa. Questa mossa ignora l'immunità di tipo.", // NEEDS QC
			shortDesc: "Danni = livello. Colpisce i tipi Spettro.", // NEEDS QC
		},
	},
	selfdestruct: {
		name: "Autodistruzione",
		// Official flavor text: "Chi la usa esplode e infligge danni ai Pokémon che ha intorno, ma poi va KO."
		desc: "Chi la usa va KO dopo averla usata, anche se fallisce per mancanza di bersagli. Questa mossa non può essere eseguita se un Pokémon in campo ha l'abilità Umidità.", // NEEDS QC
		shortDesc: "Colpisce gli adiacenti. Chi la usa va KO.", // NEEDS QC
		gen4: {
			desc: "Chi la usa va KO dopo aver usato questa mossa, a meno che non abbia bersagli. La Difesa del bersaglio è dimezzata durante il calcolo dei danni. Questa mossa non viene eseguita se un Pokémon con l'abilità Umidità è in campo.", // NEEDS QC
			shortDesc: "Dif. nemica dimezzata nel calcolo. Chi la usa va KO.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa va KO dopo aver usato questa mossa. La Difesa del bersaglio è dimezzata durante il calcolo dei danni. Questa mossa non viene eseguita se un Pokémon con l'abilità Umidità è in campo.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa va KO dopo aver usato questa mossa. La Difesa del bersaglio è dimezzata durante il calcolo dei danni.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa va KO dopo averla usata, a meno che il sostituto del bersaglio non sia stato distrutto dai danni. La Difesa del bersaglio è dimezzata durante il calcolo dei danni.", // NEEDS QC
		},
	},
	shadowball: {
		name: "Palla Ombra",
		// Official flavor text: "Lancia sul bersaglio una sfera nera. Può anche ridurne la Difesa Speciale."
		desc: "Ha il 20% di probabilità di ridurre la Difesa Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "20% di ridurre la Dif. Sp. del bersaglio di 1.", // NEEDS QC
	},
	shadowbone: {
		name: "Ossotetro",
		// Official flavor text: "Chi la usa colpisce il bersaglio con un osso in cui alberga uno spirito. Può anche ridurne la Difesa."
		desc: "Ha il 20% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "20% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
	},
	shadowclaw: {
		name: "Ombrartigli",
		// Official flavor text: "Chi la usa attacca con artigli d’ombra che colpiscono con gran forza. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	shadowforce: {
		name: "Oscurotuffo",
		// Official flavor text: "Chi la usa sparisce e poi colpisce il bersaglio al turno successivo. Colpisce anche un Pokémon che ha usato Protezione, Individua o simili."
		desc: "Se questa mossa va a segno, rompe gli effetti di Fortino, Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Sparisce, colpisce al turno 2. Rompe le protezioni.", // NEEDS QC
		gen6: {
			desc: "Se questa mossa va a segno, rompe gli effetti di Individua, Scudo Reale, Protezione o Agodifesa del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se la parte del bersaglio è protetta da Truccodifesa, Ribaltappeto, Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno e gli altri Pokémon possono attaccare quella parte normalmente. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi. Se chi la usa ha una Vigorerba, la mossa si completa in un turno. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato mentre era in campo.", // NEEDS QC
		},
		gen5: {
			desc: "Se questa mossa va a segno, rompe gli effetti di Individua o Protezione del bersaglio per questo turno, permettendo agli altri Pokémon di attaccarlo normalmente. Se il bersaglio è un avversario e la sua parte è protetta da Anticipo o Bodyguard, anche quella protezione viene rotta per questo turno e gli altri Pokémon possono attaccare la parte avversaria normalmente. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa evita tutti gli attacchi. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		},

		activate: "  La protezione di {TARGET} è stata infranta!",
		prepare: "{POKEMON} sparisce improvvisamente!",
	},
	shadowpunch: {
		name: "Pugnodombra",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	shadowsneak: {
		name: "Furtivombra",
		// Official flavor text: "Chi la usa estende la sua ombra e attacca il nemico alle spalle. Questa mossa ha priorità alta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
	},
	shadowstrike: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Ha il 50% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "50% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
	},
	sharpen: {
		name: "Affilatore",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Aumenta l'Attacco di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta l'Attacco di chi la usa di 1.", // NEEDS QC
	},
	shatteredpsyche: {
		name: "Impatto Psicocinetico",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	shedtail: {
		name: "Tagliacoda",
		desc: "Chi la usa sacrifica metà dei suoi PS max, arrotondato per eccesso, per creare un sostituto con 1/4 dei suoi PS max, arrotondato per difetto. Chi la usa viene sostituito da un altro Pokémon della squadra, che eredita il sostituto. Fallisce se chi la usa andrebbe KO o se non ci sono altri membri della squadra non KO.", // NEEDS QC
		shortDesc: "Perde metà dei PS e lascia un sostituto in eredità.", // NEEDS QC

		start: "  {POKEMON} si taglia la coda e ne fa un sostituto!",
		alreadyStarted: "#substitute",
		fail: "#substitute",
	},
	sheercold: {
		name: "Purogelo",
		// Official flavor text: "Il bersaglio esaurisce i PS in un colpo solo. Se viene usata da Pokémon che non sono di tipo Ghiaccio, difficilmente va a segno."
		desc: "Infligge al bersaglio danni pari ai suoi PS max. Ignora i modificatori di precisione ed elusione. La precisione di questo attacco è pari a (livello di chi la usa - livello del bersaglio + X)%, dove X è 30 se chi la usa è di tipo Ghiaccio e 20 altrimenti, e fallisce se il bersaglio è di livello superiore. I Pokémon di tipo Ghiaccio e quelli con l'abilità Vigore sono immuni.", // NEEDS QC
		shortDesc: "KO in un colpo. Non ha effetto sul tipo Ghiaccio.", // NEEDS QC
		gen6: {
			desc: "Infligge al bersaglio danni pari ai suoi PS max. Ignora i modificatori di precisione ed elusione. La precisione di questo attacco è pari a (livello di chi la usa - livello del bersaglio + 30)%, e fallisce se il bersaglio è di livello superiore. I Pokémon con l'abilità Vigore sono immuni.", // NEEDS QC
			shortDesc: "KO in un colpo. Fallisce se il livello è inferiore.", // NEEDS QC
		},
	},
	shellsidearm: {
		name: "Armaguscio",
		// Official flavor text: "Il Pokémon esegue un attacco fisico o speciale, in base a quale causa danni maggiori. Può anche avvelenare il bersaglio."
		desc: "Ha il 20% di probabilità di avvelenare il bersaglio. Questa mossa diventa un attacco fisico da contatto se il valore di ((((2 × livello di chi la usa / 5 + 2) × 90 × X) / Y) / 50), dove X è l'Attacco di chi la usa e Y la Difesa del bersaglio, è superiore allo stesso valore dove X è l'Attacco Speciale di chi la usa e Y la Difesa Speciale del bersaglio. Nessun modificatore diverso dai livelli delle statistiche viene considerato per questo calcolo. Se i due valori sono uguali, la categoria di danno viene scelta a caso.", // NEEDS QC
		shortDesc: "20% di avvelenare. Fisica se fa più danni così.", // NEEDS QC
	},
	shellsmash: {
		name: "Gettaguscio",
		// Official flavor text: "Chi la usa si disfa del guscio. Difesa e Difesa Speciale calano, ma aumentano di molto Attacco, Attacco Speciale e Velocità."
		desc: "Riduce la Difesa e la Difesa Speciale di chi la usa di un livello. Aumenta il suo Attacco, il suo Attacco Speciale e la sua Velocità di 2 livelli.", // NEEDS QC
		shortDesc: "-1 Dif e Dif. Sp.; +2 Att, Att. Sp. e Vel.", // NEEDS QC
	},
	shelltrap: {
		name: "Gusciotrappola",
		// Official flavor text: "Il guscio del Pokémon diventa una trappola. Se un nemico lo colpisce con una mossa fisica, innesca un’esplosione e subisce dei danni."
		desc: "Fallisce se chi la usa non viene colpito da un attacco fisico avversario in questo turno prima di poterla eseguire. Se chi la usa è stato colpito e non è KO, attacca subito dopo essere stato colpito, e l'effetto finisce. Se l'attacco fisico avversario ha avuto l'effetto secondario rimosso dall'abilità Forzabruta, non conta per questo effetto.", // NEEDS QC
		shortDesc: "Deve subire danni fisici prima di agire.", // NEEDS QC

		start: "  {POKEMON} ha preparato la Gusciotrappola!",
		prepare: "  {POKEMON} ha preparato la Gusciotrappola!",
		cant: "La Gusciotrappola di {POKEMON} non si è attivata!",
	},
	shelter: {
		name: "Barricata",
		desc: "Aumenta la Difesa di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta la Difesa di chi la usa di 2.", // NEEDS QC
	},
	shiftgear: {
		name: "Cambiomarcia",
		// Official flavor text: "Facendo ruotare gli ingranaggi, chi la usa aumenta non solo il proprio Attacco, ma anche di molto la propria Velocità."
		desc: "Aumenta la Velocità di chi la usa di 2 livelli e il suo Attacco di un livello.", // NEEDS QC
		shortDesc: "Aumenta la Velocità di 2 livelli e l'Attacco di 1.", // NEEDS QC
	},
	shockwave: {
		name: "Ondashock",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	shoreup: {
		name: "Sabbiaccumulo",
		// Official flavor text: "Chi la usa recupera metà dei propri PS massimi. Durante le tempeste di sabbia ne recupera di più."
		desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per difetto da 0,5. Se il tempo è tempesta di sabbia, recupera 2/3 dei suoi PS max, arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Recupera 1/2 PS; 2/3 nella tempesta di sabbia.", // NEEDS QC
	},
	signalbeam: {
		name: "Segnoraggio",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 10% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "10% di confondere il bersaglio.", // NEEDS QC
	},
	silktrap: {
		name: "Telatrappola",
		desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che provano a colpirlo con mosse da contatto vedono la propria Velocità ridursi di un livello. Le mosse senza danni superano questa protezione. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Protegge dagli attacchi. Contatto: -1 Velocità.", // NEEDS QC
	},
	silverwind: {
		name: "Ventargenteo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 10% di probabilità di aumentare l'Attacco, la Difesa, l'Attacco Speciale, la Difesa Speciale e la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "10% di aumentare tutte le sue statistiche di 1.", // NEEDS QC
	},
	simplebeam: {
		name: "Ondisinvolta",
		// Official flavor text: "Chi la usa emette un misterioso raggio psichico che trasforma l’abilità del Pokémon colpito in Disinvoltura."
		desc: "L'abilità del bersaglio diventa Disinvoltura. Fallisce se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Disinvoltura, Accendilotta, Teramorfosi, Pigrone, Stato Zen o Supercambio.", // NEEDS QC
		shortDesc: "L'abilità del bersaglio diventa Disinvoltura.", // NEEDS QC
		gen8: {
			desc: "L'abilità del bersaglio diventa Disinvoltura. Fallisce se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Disinvoltura, Accendilotta, Pigrone o Stato Zen.", // NEEDS QC
		},
		gen7: {
			desc: "L'abilità del bersaglio diventa Disinvoltura. Fallisce se l'abilità del bersaglio è Morfosintonia, Sonno Assoluto, Fantasmanto, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Disinvoltura, Accendilotta, Pigrone o Stato Zen.", // NEEDS QC
		},
		gen6: {
			desc: "L'abilità del bersaglio diventa Disinvoltura. Fallisce se l'abilità del bersaglio è Multitipo, Disinvoltura, Accendilotta o Pigrone.", // NEEDS QC
		},
		gen5: {
			desc: "L'abilità del bersaglio diventa Disinvoltura. Fallisce se l'abilità del bersaglio è Multitipo, Disinvoltura o Pigrone.", // NEEDS QC
		},
	},
	sing: {
		name: "Canto",
		shortDesc: "Addormenta il bersaglio.", // NEEDS QC
	},
	sinisterarrowraid: {
		name: "Dardoassalto Spettrale",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	sizzlyslide: {
		name: "Fiammabam",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 100% di probabilità di scottare il bersaglio.", // NEEDS QC
		shortDesc: "100% di scottare il bersaglio.", // NEEDS QC
	},
	sketch: {
		name: "Schizzo",
		// Official flavor text: "Permette a chi la usa di imparare l’ultima mossa usata dal bersaglio. La nuova mossa appresa sostituisce Schizzo."
		desc: "Questa mossa viene sostituita definitivamente dall'ultima mossa usata dal bersaglio. La mossa copiata ha il massimo dei PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa si è trasformato, o se la mossa è Turboustione, Turborissa, Vuototetro, Urtodimensionale, Turboincanto, Turbotossina, Preghiera Vitale, Schizzo, Scontro, Teracluster o Turbotenebra o una mossa che chi la usa già conosce.", // NEEDS QC
		shortDesc: "Copia per sempre l'ultima mossa del bersaglio.", // NEEDS QC
		gen8: {
			desc: "Questa mossa viene sostituita definitivamente dall'ultima mossa usata dal bersaglio. La mossa copiata ha il massimo dei PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa si è trasformato, o se la mossa è Schiamazzo, Schizzo o Scontro o una mossa che chi la usa già conosce.", // NEEDS QC
		},
		gen3: {
			desc: "Questa mossa viene sostituita definitivamente dall'ultima mossa usata dal bersaglio. La mossa copiata ha il massimo dei PP. Fallisce se il bersaglio non ha ancora agito, se chi la usa si è trasformato, o se la mossa è Schizzo o Scontro o una mossa che chi la usa già conosce.", // NEEDS QC
		},
		gen2: {
			desc: "Fallisce se usata nelle lotte in collegamento.", // NEEDS QC
			shortDesc: "Fallisce nelle lotte in collegamento.", // NEEDS QC
		},

		activate: "  {POKEMON} disegna uno schizzo della mossa {MOVE}!",
	},
	skillswap: {
		name: "Baratto",
		// Official flavor text: "Chi la usa sfrutta i suoi poteri psichici per scambiare l’abilità con il bersaglio."
		desc: "Chi la usa scambia la propria abilità con quella del bersaglio. Fallisce se l'abilità di chi la usa o del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Torre di Comando, Fantasmanto, Albergamemorie, Pancialterna, Gelofaccia, Illusione, Multitipo, Gas Reagente, Malia Tossica, Sciamefusione, Paleoattivazione, Carica Quark, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teraguscio, Teramorfosi, Zeroformazione, Magidifesa, Stato Zen o Supercambio.", // NEEDS QC
		shortDesc: "Scambia le abilità con il bersaglio.", // NEEDS QC
		gen8: {
			desc: "Chi la usa scambia la propria abilità con quella del bersaglio. Fallisce se l'abilità di chi la usa o del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Pancialterna, Gelofaccia, Illusione, Multitipo, Gas Reagente, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Magidifesa o Stato Zen.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa scambia la propria abilità con quella del bersaglio. Fallisce se l'abilità di chi la usa o del bersaglio è Morfosintonia, Sonno Assoluto, Fantasmanto, Illusione, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Magidifesa o Stato Zen.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa scambia la propria abilità con quella del bersaglio. Fallisce se l'abilità di chi la usa o del bersaglio è Illusione, Multitipo, Accendilotta o Magidifesa.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa scambia la propria abilità con quella del bersaglio. Fallisce se l'abilità di chi la usa o del bersaglio è Illusione, Multitipo o Magidifesa, o se entrambi hanno la stessa abilità.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa scambia la propria abilità con quella del bersaglio. Fallisce se l'abilità di chi la usa o del bersaglio è Multitipo o Magidifesa, se entrambi hanno la stessa abilità, o se uno dei due ha una Grigiosfera.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa scambia la propria abilità con quella del bersaglio. Fallisce se l'abilità di chi la usa o del bersaglio è Magidifesa.", // NEEDS QC
		},

		activate: "  {POKEMON} scambia la sua abilità con il bersaglio!",
	},
	skittersmack: {
		name: "Strisciacolpo",
		// Official flavor text: "Chi la usa attacca il bersaglio strisciandogli alle spalle e riducendo il suo Attacco Speciale."
		desc: "Ha il 100% di probabilità di ridurre l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Att. Sp. del bersaglio di 1.", // NEEDS QC
	},
	skullbash: {
		name: "Capocciata",
		// Official flavor text: "Chi la usa ritira la testa per aumentare la Difesa e poi attacca al turno successivo."
		desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Aumenta la Difesa di chi la usa di un livello nel primo turno. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "+1 Difesa al turno 1, colpisce al turno 2.", // NEEDS QC
		gen3: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. Nel primo turno, la Difesa di chi la usa aumenta di un livello.", // NEEDS QC
		},
		gen1: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo.", // NEEDS QC
			shortDesc: "Si carica al turno 1. Colpisce al turno 2.", // NEEDS QC
		},

		prepare: "{POKEMON} abbassa la testa!",
	},
	skyattack: {
		name: "Aeroattacco",
		// Official flavor text: "Attacco in due turni e probabile brutto colpo. Può anche far tentennare il bersaglio."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio e una probabilità più alta di brutto colpo. Questo attacco si carica nel primo turno e viene eseguito nel secondo. Se chi la usa ha una Vigorerba, la mossa si completa in un turno.", // NEEDS QC
		shortDesc: "Carica, colpisce al turno 2. 30% tentenna. Crit alto.", // NEEDS QC
		gen3: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio e una probabilità più alta di brutto colpo. Questo attacco si carica nel primo turno e viene eseguito nel secondo.", // NEEDS QC
		},
		gen2: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo.", // NEEDS QC
			shortDesc: "Si carica al turno 1. Colpisce al turno 2.", // NEEDS QC
		},

		prepare: "{POKEMON} è avvolto da una luce intensa!",
	},
	skydrop: {
		name: "Cadutalibera",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Questo attacco porta il bersaglio in aria con chi la usa nel primo turno e viene eseguito nel secondo. I Pokémon che pesano 200 kg o più non possono essere sollevati. Nel primo turno, chi la usa e il bersaglio evitano tutti gli attacchi tranne Raffica, Tifone, Stramontante, Abbattimento, Mille Frecce, Tuono e Tornado. Chi la usa e il bersaglio non possono agire tra i turni, ma il bersaglio può selezionare una mossa. Questa mossa non può danneggiare i Pokémon di tipo Volante. Fallisce nel primo turno se il bersaglio è un alleato, se ha un sostituto o se sta usando Rimbalzo, Fossa, Sub, Volo, Spettrotuffo, Oscurotuffo o Cadutalibera.", // NEEDS QC
		shortDesc: "Porta il bersaglio in cielo, colpisce al turno 2.", // NEEDS QC
		gen5: {
			desc: "Questo attacco porta il bersaglio in aria con chi la usa nel primo turno e viene eseguito nel secondo. Nel primo turno, chi la usa e il bersaglio evitano tutti gli attacchi tranne Raffica, Tifone, Stramontante, Abbattimento, Tuono e Tornado. Chi la usa e il bersaglio non possono agire tra i turni, ma il bersaglio può selezionare una mossa. Questa mossa non può danneggiare i Pokémon di tipo Volante. Fallisce nel primo turno se il bersaglio è un alleato, se ha un sostituto o se sta usando Rimbalzo, Fossa, Sub, Volo, Oscurotuffo o Cadutalibera. Se l'effetto di Gravità termina questo effetto prima del secondo turno, chi la usa e il bersaglio tornano a terra; altrimenti, il bersaglio resta sotto questo effetto finché chi la usa non lascia il campo o non esegue con successo il secondo turno di una mossa in due turni.", // NEEDS QC
		},

		prepare: "{POKEMON} trascina in aria {TARGET}!",
		end: "  {POKEMON} si libera da Cadutalibera!",
		failSelect: "{POKEMON} non può muoversi a causa di Cadutalibera!",
		failTooHeavy: "  {POKEMON} è troppo pesante e non può essere trascinato in aria!",
	},
	skyuppercut: {
		name: "Stramontante",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Questa mossa può colpire un bersaglio che sta usando Rimbalzo, Volo o Cadutalibera, o sotto l'effetto di Cadutalibera.", // NEEDS QC
		shortDesc: "Colpisce anche chi usa Rimbalzo, Volo o Cadutalibera.", // NEEDS QC
		gen4: {
			desc: "Questa mossa può colpire un bersaglio che sta usando Rimbalzo o Volo.", // NEEDS QC
			shortDesc: "Colpisce chi sta usando Rimbalzo o Volo.", // NEEDS QC
		},
	},
	slackoff: {
		name: "Pigro",
		// Official flavor text: "Chi la usa si rilassa recuperando metà dei propri PS massimi."
		desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per eccesso da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei suoi PS max.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per difetto.", // NEEDS QC
		},
	},
	slam: {
		name: "Schianto",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	slash: {
		name: "Lacerazione",
		// Official flavor text: "Attacca il bersaglio con artigli, falci o altro. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	sleeppowder: {
		name: "Sonnifero",
		shortDesc: "Addormenta il bersaglio.", // NEEDS QC
	},
	sleeptalk: {
		name: "Sonnolalia",
		// Official flavor text: "Chi la usa sferra a caso una delle proprie mosse mentre sta dormendo."
		desc: "Una delle mosse conosciute da chi la usa, diversa da questa, viene scelta a caso e usata. Fallisce se chi la usa non dorme. La mossa scelta non consuma PP e può avere 0 PP. Questa mossa non può scegliere Assistente, Cannonbecco, Rutto, Pazienza, Turboustione, Auguri, Schiamazzo, Turborissa, Copione, Cannone Dynamax, Centripugno, Mano nella Mano, Turboincanto, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Turbotossina, Gusciotrappola, Schizzo, Sonnolalia, Scontro, Baraonda o Turbotenebra né una mossa in due turni.", // NEEDS QC
		shortDesc: "Deve dormire. Usa un'altra mossa che conosce.", // NEEDS QC
		gen8: {
			desc: "Una delle mosse conosciute da chi la usa, diversa da questa, viene scelta a caso e usata. Fallisce se chi la usa non dorme. La mossa scelta non consuma PP e può avere 0 PP. Questa mossa non può scegliere Assistente, Cannonbecco, Rutto, Pazienza, Auguri, Schiamazzo, Copione, Cannone Dynamax, Centripugno, Mano nella Mano, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Gusciotrappola, Schizzo, Sonnolalia, Scontro, Baraonda né una mossa in due turni o una mossa Dynamax.", // NEEDS QC
		},
		gen7: {
			desc: "Una delle mosse conosciute da chi la usa, diversa da questa, viene scelta a caso e usata. Fallisce se chi la usa non dorme. La mossa scelta non consuma PP e può avere 0 PP. Questa mossa non può scegliere Assistente, Cannonbecco, Rutto, Pazienza, Auguri, Schiamazzo, Copione, Centripugno, Mano nella Mano, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Gusciotrappola, Schizzo, Sonnolalia, Scontro, Baraonda né una mossa in due turni o una mossa Z.", // NEEDS QC
		},
		gen6: {
			desc: "Una delle mosse conosciute da chi la usa, diversa da questa, viene scelta a caso e usata. Fallisce se chi la usa non dorme. La mossa scelta non consuma PP e può avere 0 PP. Questa mossa non può scegliere Assistente, Rutto, Pazienza, Auguri, Schiamazzo, Copione, Centripugno, Mano nella Mano, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Schizzo, Sonnolalia, Scontro, Baraonda né una mossa in due turni.", // NEEDS QC
		},
		gen5: {
			desc: "Una delle mosse conosciute da chi la usa, diversa da questa, viene scelta a caso e usata. Fallisce se chi la usa non dorme. La mossa scelta non consuma PP e può avere 0 PP. Questa mossa non può scegliere Assistente, Pazienza, Schiamazzo, Copione, Centripugno, Precedenza, Metronomo, Mimica, Speculmossa, Naturforza, Schizzo, Sonnolalia, Scontro, Baraonda né una mossa in due turni.", // NEEDS QC
		},
		gen4: {
			desc: "Una delle mosse conosciute da chi la usa, diversa da questa, viene scelta a caso e usata. Fallisce se chi la usa non dorme. La mossa scelta non consuma PP e può avere 0 PP. Questa mossa non può scegliere Assistente, Pazienza, Schiamazzo, Copione, Centripugno, Precedenza, Metronomo, Speculmossa, Sonnolalia, Baraonda né una mossa in due turni.", // NEEDS QC
		},
		gen3: {
			desc: "Una delle mosse conosciute da chi la usa, diversa da questa, viene scelta a caso e usata. Fallisce se chi la usa non dorme. La mossa scelta non consuma PP, ma se ha attualmente 0 PP fallisce. Questa mossa non può scegliere Assistente, Pazienza, Centripugno, Metronomo, Speculmossa, Sonnolalia, Baraonda né una mossa in due turni.", // NEEDS QC
		},
		gen2: {
			desc: "Una delle mosse conosciute da chi la usa, diversa da questa, viene scelta a caso e usata. Fallisce se chi la usa non dorme. La mossa scelta non consuma PP e può avere 0 PP. Questa mossa non può scegliere Pazienza, Sonnolalia né una mossa in due turni.", // NEEDS QC
		},
	},
	sludge: {
		name: "Fango",
		// Official flavor text: "Chi la usa lancia fango malsano sul bersaglio. Può anche avvelenarlo."
		desc: "Ha il 30% di probabilità di avvelenare il bersaglio.", // NEEDS QC
		shortDesc: "30% di avvelenare il bersaglio.", // NEEDS QC
		gen1: {
			desc: "Ha il 40% di probabilità di avvelenare il bersaglio.", // NEEDS QC
			shortDesc: "40% di avvelenare il bersaglio.", // NEEDS QC
		},
	},
	sludgebomb: {
		name: "Fangobomba",
		// Official flavor text: "Chi la usa lancia fango malsano sul bersaglio. Può anche avvelenarlo."
		desc: "Ha il 30% di probabilità di avvelenare il bersaglio.", // NEEDS QC
		shortDesc: "30% di avvelenare il bersaglio.", // NEEDS QC
	},
	sludgewave: {
		name: "Fangonda",
		// Official flavor text: "Lancia un’onda di fango che attacca tutti i Pokémon nelle vicinanze. Può anche avvelenarli."
		desc: "Ha il 10% di probabilità di avvelenare il bersaglio.", // NEEDS QC
		shortDesc: "10% di avvelenare i Pokémon adiacenti.", // NEEDS QC
	},
	smackdown: {
		name: "Abbattimento",
		// Official flavor text: "Chi la usa lancia una pietra o un proiettile. Può colpire anche un bersaglio in volo e farlo cadere."
		desc: "Questa mossa può colpire un bersaglio che sta usando Rimbalzo, Volo o Cadutalibera, o sotto l'effetto di Cadutalibera. Se colpisce un bersaglio sotto l'effetto di Rimbalzo, Volo, Magnetascesa o Telecinesi, l'effetto finisce. Se il bersaglio è di tipo Volante e non ha usato Trespolo in questo turno, o ha l'abilità Levitazione, perde l'immunità agli attacchi di tipo Terra e all'abilità Trappoarena finché resta in campo. Durante l'effetto, Magnetascesa fallisce per il bersaglio e Telecinesi fallisce contro di lui.", // NEEDS QC
		shortDesc: "Rimuove l'immunità al tipo Terra del bersaglio.", // NEEDS QC

		start: "  {POKEMON} si schianta al suolo!",
	},
	smartstrike: {
		name: "Sottilcorno",
		shortDesc: "Non verifica la precisione.", // NEEDS QC
	},
	smellingsalts: {
		name: "Maniereforti",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza raddoppia se il bersaglio è paralizzato. Se chi la usa non è KO, il bersaglio viene curato dalla paralisi.", // NEEDS QC
		shortDesc: "x2 contro i paralizzati, ma li cura.", // NEEDS QC
		gen4: {
			desc: "La potenza raddoppia se il bersaglio è paralizzato. Se questa mossa va a segno, il bersaglio viene curato dalla paralisi.", // NEEDS QC
		},
		gen3: {
			desc: "I danni raddoppiano se il bersaglio è paralizzato. Se questa mossa va a segno, il bersaglio viene curato dalla paralisi.", // NEEDS QC
			shortDesc: "Danni doppi se il bersaglio è paralizzato; lo cura.", // NEEDS QC
		},
	},
	smog: {
		name: "Smog",
		// Official flavor text: "Colpisce il bersaglio con una scarica di gas maleodoranti. Può anche avvelenarlo."
		desc: "Ha il 40% di probabilità di avvelenare il bersaglio.", // NEEDS QC
		shortDesc: "40% di avvelenare il bersaglio.", // NEEDS QC
	},
	smokescreen: {
		name: "Muro di Fumo",
		// Official flavor text: "Nuvola di fumo o inchiostro che riduce la precisione del bersaglio."
		desc: "Riduce la precisione del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce la precisione del bersaglio di 1.", // NEEDS QC
	},
	snaptrap: {
		name: "Tagliola",
		// Official flavor text: "Chi la usa intrappola il bersaglio in una tagliola e lo attacca per quattro o cinque turni."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},

		start: "  {POKEMON} è rimasto incastrato nella Tagliola!",
	},
	snarl: {
		name: "Urlorabbia",
		// Official flavor text: "Chi la usa si mette a urlare per un po’, riducendo l’Attacco Speciale dei nemici intorno."
		desc: "Ha il 100% di probabilità di ridurre l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Att. Sp. dei nemici di 1.", // NEEDS QC
	},
	snatch: {
		name: "Scippo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Se un altro Pokémon usa certe mosse senza danni in questo turno, chi la usa gliele ruba per usarle. Se più Pokémon usano una di quelle mosse in questo turno, vengono tutte rubate dal primo Pokémon nell'ordine del turno che ha usato questa mossa. Questo effetto è ignorato mentre chi la usa è sotto l'effetto di Cadutalibera.", // NEEDS QC
		shortDesc: "Ruba certe mosse di supporto per usarle lui.", // NEEDS QC
		gen4: {
			desc: "Se un altro Pokémon usa certe mosse senza danni in questo turno, chi la usa gliele ruba per usarle. Se più Pokémon usano questa mossa in questo turno, le mosse in questione vengono rubate da ciascuno di quei Pokémon nell'ordine del turno, e solo l'ultimo nell'ordine del turno ne ottiene gli effetti.", // NEEDS QC
		},

		start: "  {POKEMON} aspetta la mossa del bersaglio!",
		activate: "  {POKEMON} ruba la mossa di {TARGET} con Scippo!",
	},
	snipeshot: {
		name: "Tiromirato",
		// Official flavor text: "Permette di attaccare un bersaglio ignorando gli effetti di mosse e abilità che attirano altre mosse."
		desc: "Ha una probabilità più alta di brutto colpo. Questa mossa non può essere reindirizzata verso un altro bersaglio da nessun effetto.", // NEEDS QC
		shortDesc: "Alta prob. di brutto colpo. Non reindirizzabile.", // NEEDS QC
	},
	snore: {
		name: "Russare",
		// Official flavor text: "Mossa che può essere usata solo mentre si dorme. Il chiasso assordante può anche far tentennare il bersaglio."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio. Fallisce se chi la usa non dorme.", // NEEDS QC
		shortDesc: "Deve dormire. 30% di far tentennare.", // NEEDS QC
	},
	snowscape: {
		name: "Vista Innevata",
		desc: "Per 5 turni, nevica. Durante l'effetto, la Difesa dei Pokémon di tipo Ghiaccio è moltiplicata per 1,5 quando subiscono un attacco fisico. Dura 8 turni se chi la usa ha una Rocciafredda. Fallisce se nevica già.", // NEEDS QC
		shortDesc: "5 turni: neve. Ghiaccio: Difesa x1,5.", // NEEDS QC
	},
	soak: {
		name: "Inondazione",
		// Official flavor text: "Chi la usa proietta un lungo getto d’acqua contro il bersaglio e lo rende un Pokémon di tipo Acqua."
		desc: "Il bersaglio diventa di tipo Acqua. Fallisce se il bersaglio è un Arceus o un Silvally, se è già puramente di tipo Acqua o se è teracristallizzato.", // NEEDS QC
		shortDesc: "Il bersaglio diventa di tipo Acqua.", // NEEDS QC
		gen8: {
			desc: "Il bersaglio diventa di tipo Acqua. Fallisce se il bersaglio è un Arceus o un Silvally, o se è già puramente di tipo Acqua.", // NEEDS QC
		},
		gen6: {
			desc: "Il bersaglio diventa di tipo Acqua. Fallisce se il bersaglio è un Arceus, o se è già puramente di tipo Acqua.", // NEEDS QC
		},
		gen5: {
			desc: "Il bersaglio diventa di tipo Acqua. Fallisce se il bersaglio è un Arceus.", // NEEDS QC
		},
	},
	softboiled: {
		name: "Covauova",
		// Official flavor text: "Chi la usa recupera metà dei propri PS massimi."
		desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per eccesso da 0,5.", // NEEDS QC
		shortDesc: "Chi la usa recupera metà dei suoi PS max.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per difetto.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa recupera metà dei suoi PS max, arrotondato per difetto. Fallisce se (PS max di chi la usa − PS attuali + 1) è divisibile per 256.", // NEEDS QC
		},
	},
	solarbeam: {
		name: "Solarraggio",
		// Official flavor text: "Chi la usa assorbe luce al primo turno per proiettare un raggio intenso al turno successivo."
		desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. La potenza è dimezzata se il tempo è Acquazzone, Pioggia, tempesta di sabbia o neve e chi la usa non ha un Superombrello. Se chi la usa ha una Vigorerba o il tempo è Sole accecante o Sole intenso, la mossa si completa in un turno. Se chi la usa ha un Superombrello e il tempo è Sole accecante o Sole intenso, la mossa richiede comunque un turno di carica.", // NEEDS QC
		shortDesc: "Carica, colpisce al turno 2. Subito col sole.", // NEEDS QC
		gen8: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. La potenza è dimezzata se il tempo è grandine, Acquazzone, Pioggia o tempesta di sabbia e chi la usa non ha un Superombrello. Se chi la usa ha una Vigorerba o il tempo è Sole accecante o Sole intenso, la mossa si completa in un turno. Se chi la usa ha un Superombrello e il tempo è Sole accecante o Sole intenso, la mossa richiede comunque un turno di carica.", // NEEDS QC
		},
		gen7: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. La potenza è dimezzata se il tempo è Grandine, Acquazzone, Pioggia o Terrempesta. Se chi la usa ha una Vigorerba o il tempo è Sole accecante o Sole intenso, la mossa si completa in un turno.", // NEEDS QC
		},
		gen5: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. La potenza è dimezzata se il tempo è Grandine, Pioggia o Terrempesta. Se chi la usa ha una Vigorerba o il tempo è Sole intenso, la mossa si completa in un turno.", // NEEDS QC
		},
		gen4: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. I danni sono dimezzati se il tempo è Grandine, Pioggia o Terrempesta. Se chi la usa ha una Vigorerba o il tempo è Sole intenso, la mossa si completa in un turno.", // NEEDS QC
		},
		gen3: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. I danni sono dimezzati se il tempo è Grandine, Pioggia o Terrempesta. Se il tempo è Sole intenso, la mossa si completa in un turno.", // NEEDS QC
		},
		gen2: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. I danni sono dimezzati se il tempo è Pioggia. Se il tempo è Sole intenso, la mossa si completa in un turno.", // NEEDS QC
		},
		gen1: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo.", // NEEDS QC
			shortDesc: "Si carica al turno 1. Colpisce al turno 2.", // NEEDS QC
		},

		prepare: "  {POKEMON} assorbe la luce!",
	},
	solarblade: {
		name: "Lama Solare",
		// Official flavor text: "Chi la usa assorbe la luce condensandola in una lama al primo turno per poi attaccare al turno successivo."
		desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. La potenza è dimezzata se il tempo è grandine, Acquazzone, Pioggia o tempesta di sabbia e chi la usa non ha un Superombrello. Se chi la usa ha una Vigorerba o il tempo è Sole accecante o Sole intenso, la mossa si completa in un turno. Se chi la usa ha un Superombrello e il tempo è Sole accecante o Sole intenso, la mossa richiede comunque un turno di carica.", // NEEDS QC
		shortDesc: "Carica, colpisce al turno 2. Subito col sole.", // NEEDS QC
		gen8: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. La potenza è dimezzata se il tempo è Acquazzone, Pioggia, tempesta di sabbia o neve e chi la usa non ha un Superombrello. Se chi la usa ha una Vigorerba o il tempo è Sole accecante o Sole intenso, la mossa si completa in un turno. Se chi la usa ha un Superombrello e il tempo è Sole accecante o Sole intenso, la mossa richiede comunque un turno di carica.", // NEEDS QC
		},
		gen7: {
			desc: "Questo attacco si carica nel primo turno e viene eseguito nel secondo. La potenza è dimezzata se il tempo è Grandine, Acquazzone, Pioggia o Terrempesta. Se chi la usa ha una Vigorerba o il tempo è Sole accecante o Sole intenso, la mossa si completa in un turno.", // NEEDS QC
		},

		prepare: "#solarbeam",
	},
	sonicboom: {
		name: "Sonicboom",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Infligge 20 PS di danni al bersaglio.", // NEEDS QC
		shortDesc: "Infligge sempre 20 PS di danni.", // NEEDS QC
		gen1: {
			desc: "Infligge 20 PS di danni al bersaglio. Questa mossa ignora l'immunità di tipo.", // NEEDS QC
		},
	},
	soulstealing7starstrike: {
		name: "Colpo Eptastellare Rubanima",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	spacialrend: {
		name: "Fendispazio",
		// Official flavor text: "Chi la usa lacera il bersaglio e lo spazio che lo circonda. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	spark: {
		name: "Scintilla",
		// Official flavor text: "Colpisce il bersaglio con una scarica elettrica e può anche paralizzarlo."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "30% di paralizzare il bersaglio.", // NEEDS QC
	},
	sparklingaria: {
		name: "Canto Effimero",
		// Official flavor text: "Chi la usa si mette a cantare emettendo tanti palloncini d’acqua. I Pokémon che subiscono danni da questa mossa guariscono dalle scottature."
		desc: "Se chi la usa non è KO, la scottatura del bersaglio viene curata.", // NEEDS QC
		shortDesc: "Cura la scottatura del bersaglio.", // NEEDS QC
	},
	sparklyswirl: {
		name: "Sbrilluccibufera",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Tutti i Pokémon della squadra di chi la usa vengono curati dai problemi di stato.", // NEEDS QC
		shortDesc: "Cura lo stato di tutta la squadra di chi la usa.", // NEEDS QC
	},
	spectralthief: {
		name: "Ombrafurto",
		// Official flavor text: "Chi la usa ruba gli aumenti delle statistiche del bersaglio, poi si nasconde nella sua ombra e lo attacca."
		desc: "I livelli positivi delle statistiche del bersaglio gli vengono rubati e applicati a chi la usa prima del calcolo dei danni.", // NEEDS QC
		shortDesc: "Ruba gli aumenti del bersaglio prima di colpire.", // NEEDS QC

		clearBoost: "  {SOURCE} ha rubato gli aumenti delle statistiche!",
	},
	speedswap: {
		name: "Velociscambio",
		// Official flavor text: "Chi la usa scambia la propria Velocità con quella del bersaglio."
		desc: "Chi la usa scambia la propria statistica di Velocità con quella del bersaglio. I livelli delle statistiche non sono influenzati.", // NEEDS QC
		shortDesc: "Scambia la sua Velocità con quella del bersaglio.", // NEEDS QC

		activate: "  {POKEMON} scambia la sua Velocità con quella del bersaglio!",
	},
	spicyextract: {
		name: "Essenza Piccante",
		desc: "Aumenta l'Attacco del bersaglio di 2 livelli e riduce la sua Difesa di 2 livelli.", // NEEDS QC
		shortDesc: "+2 Attacco e -2 Difesa del bersaglio.", // NEEDS QC
	},
	spiderweb: {
		name: "Ragnatela",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Impedisce al bersaglio di lasciare il campo.", // NEEDS QC
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo, a meno che non usi Staffetta: in tal caso il bersaglio resta intrappolato.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se usa Staffetta. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo, a meno che non usi Staffetta: in tal caso il bersaglio resta intrappolato.", // NEEDS QC
		},
	},
	spikecannon: {
		name: "Sparalance",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen4: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce da due a cinque volte. Ha 3/8 di probabilità di colpire due o tre volte e 1/8 di colpire quattro o cinque volte. I danni sono calcolati una sola volta per il primo colpo e ripetuti per ogni colpo. Se uno dei colpi rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	spikes: {
		name: "Punte",
		// Official flavor text: "Chi la usa piazza sul terreno una trappola di punte che danneggia i nemici quando scendono in campo."
		desc: "Piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Può essere usata fino a tre volte prima di fallire. Gli avversari perdono 1/8 dei loro PS max con uno strato, 1/6 con due strati e 1/4 con tre strati, arrotondato per difetto. Può essere rimossa dalla parte avversaria se un Pokémon usa Pulizie, o se un avversario usa Glitturbine, Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		shortDesc: "Ferisce i nemici che entrano a terra. Max 3 strati.", // NEEDS QC
		gen8: {
			desc: "Piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Può essere usata fino a tre volte prima di fallire. Gli avversari perdono 1/8 dei loro PS max con uno strato, 1/6 con due strati e 1/4 con tre strati, arrotondato per difetto. Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		},
		gen5: {
			desc: "Piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Può essere usata fino a tre volte prima di fallire. Gli avversari perdono 1/8 dei loro PS max con uno strato, 1/6 con due strati e 1/4 con tre strati, arrotondato per difetto. Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		},
		gen3: {
			desc: "Piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Può essere usata fino a tre volte prima di fallire. Gli avversari perdono 1/8 dei loro PS max con uno strato, 1/6 con due strati e 1/4 con tre strati, arrotondato per difetto. Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro con successo.", // NEEDS QC
		},
		gen2: {
			desc: "Piazza una trappola nella parte avversaria che fa perdere a ogni avversario che entra in campo 1/8 dei suoi PS max, arrotondato per difetto, a meno che non sia di tipo Volante. Fallisce se l'effetto è già attivo nella parte avversaria. Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro con successo.", // NEEDS QC
			shortDesc: "Ferisce i nemici che entrano. Max 1 strato.", // NEEDS QC
		},

		start: "  Ai piedi di {TEAM} c’è una trappola di punte!",
		end: "  Ai piedi di {TEAM} non c’è più la trappola di punte!",
		damage: "  {POKEMON} è colpito dalle punte!",
	},
	spikyshield: {
		name: "Agodifesa",
		// Official flavor text: "Protegge dagli attacchi, riducendo inoltre i PS dei Pokémon che entrano in contatto con chi la usa."
		desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che lo colpiscono con mosse da contatto perdono 1/8 dei loro PS max, arrotondato per difetto. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		shortDesc: "Protegge dalle mosse. Contatto: perde 1/8 dei PS.", // NEEDS QC
		gen8: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che lo colpiscono con mosse da contatto perdono 1/8 dei loro PS max, arrotondato per difetto. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che lo colpiscono con mosse da contatto perdono 1/8 dei loro PS max, arrotondato per difetto. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa è protetto dalla maggior parte degli attacchi degli altri Pokémon in questo turno, e i Pokémon che lo colpiscono con mosse da contatto perdono 1/8 dei loro PS max, arrotondato per difetto. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e triplica a ogni uso riuscito. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno.", // NEEDS QC
		},

		damage: "  {POKEMON} subisce dei danni!",
	},
	spinout: {
		name: "Slittaruote",
		desc: "Riduce la Velocità di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce la Velocità di chi la usa di 2.", // NEEDS QC
	},
	spiritbreak: {
		name: "Frantumanima",
		// Official flavor text: "Chi la usa attacca il bersaglio con un tale impeto da fargli perdere la voglia di lottare e ne riduce l’Attacco Speciale."
		desc: "Ha il 100% di probabilità di ridurre l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Att. Sp. del bersaglio di 1.", // NEEDS QC
	},
	spiritshackle: {
		name: "Cucitura d’Ombra",
		// Official flavor text: "Chi la usa attacca il bersaglio e fissa la sua ombra a terra impedendogli di fuggire."
		desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Impedisce al bersaglio di lasciare il campo.", // NEEDS QC
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo.", // NEEDS QC
		},
	},
	spite: {
		name: "Dispetto",
		// Official flavor text: "Chi la usa sfoga la propria rabbia sull’ultima mossa usata dal bersaglio e le sottrae quattro PP."
		desc: "L'ultima mossa usata dal bersaglio perde 4 PP. Fallisce se il bersaglio non ha ancora agito, se la mossa ha 0 PP o se non la conosce più.", // NEEDS QC
		shortDesc: "Toglie 4 PP all'ultima mossa del bersaglio.", // NEEDS QC
		gen3: {
			desc: "L'ultima mossa usata dal bersaglio perde da 2 a 5 PP, a caso. Fallisce se il bersaglio non ha ancora agito, se la mossa ha 0 o 1 PP o se non la conosce più.", // NEEDS QC
			shortDesc: "L'ultima mossa del bersaglio perde 2-5 PP.", // NEEDS QC
		},
		gen2: {
			desc: "L'ultima mossa usata dal bersaglio perde da 2 a 5 PP, a caso. Fallisce se il bersaglio non ha ancora agito o se la mossa ha 0 PP.", // NEEDS QC
		},

		activate: "  La mossa {MOVE} di {TARGET} perde {NUMBER} PP!",
	},
	spitup: {
		name: "Sfoghenergia",
		// Official flavor text: "Tutta l’energia accumulata in precedenza con Accumulo è rilasciata nell’attacco. Maggiore è l’energia, più danni si arrecano."
		desc: "La potenza è pari a 100 volte il contatore di Accumulo di chi la usa. Fallisce se il contatore è a 0. Che questa mossa vada a segno o meno, la Difesa e la Difesa Speciale di chi la usa diminuiscono di tanti livelli quanti Accumulo li aveva aumentati, e il contatore torna a 0.", // NEEDS QC
		shortDesc: "Più potente con più usi di Accumulo.", // NEEDS QC
		gen4: {
			desc: "La potenza è pari a 100 volte il contatore di Accumulo di chi la usa. Questa mossa non applica la varianza dei danni. Fallisce se il contatore è a 0. Salvo che non ci sia un bersaglio, che questa mossa vada a segno o meno, la Difesa e la Difesa Speciale di chi la usa diminuiscono di tanti livelli quanti Accumulo li aveva aumentati, e il contatore torna a 0.", // NEEDS QC
		},
		gen3: {
			desc: "I danni sono moltiplicati per il contatore di Accumulo di chi la usa. Questa mossa non applica la varianza dei danni e non può essere un brutto colpo. Fallisce se il contatore è a 0. A meno che questa mossa non manchi il bersaglio, il contatore torna a 0.", // NEEDS QC
		},
	},
	splash: {
		name: "Splash",
		shortDesc: "Nessuna utilità in lotta.", // NEEDS QC

		activate: "  Ma non succede nulla!",
	},
	splinteredstormshards: {
		name: "Litotempesta Radiale",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Pone fine agli effetti di Campo Elettrico, Campo Erboso, Campo Nebbioso e Campo Psichico.", // NEEDS QC
		shortDesc: "Pone fine agli effetti dei campi.", // NEEDS QC
	},
	splishysplash: {
		name: "Surfasplash",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "30% di paralizzare il bersaglio.", // NEEDS QC
	},
	spore: {
		name: "Spora",
		shortDesc: "Addormenta il bersaglio.", // NEEDS QC
	},
	spotlight: {
		name: "Riflettore",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Fino alla fine del turno, tutti gli attacchi a bersaglio singolo degli avversari del bersaglio vengono reindirizzati su di lui. Questi attacchi vengono reindirizzati prima di poter essere rimbalzati da Magivelo o dall'abilità Magispecchio, o attirati dalle abilità Parafulmine o Acquascolo. Fallisce se non è una Lotta in Doppio o una Battle Royale.", // NEEDS QC
		shortDesc: "Gli attacchi nemici sono reindirizzati sul bersaglio.", // NEEDS QC

		start: "#followme",
		startFromZEffect: "#followme",
	},
	springtidestorm: {
		name: "Tempesta Zefirea",
		desc: "Ha il 30% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "30% di ridurre l'Attacco dei nemici di 1.", // NEEDS QC
	},
	stealthrock: {
		name: "Levitoroccia",
		// Official flavor text: "Chi la usa piazza una trappola di rocce sospese che danneggia i nemici che entrano in campo."
		desc: "Piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo. Fallisce se l'effetto è già attivo nella parte avversaria. Gli avversari perdono 1/32, 1/16, 1/8, 1/4 o 1/2 dei loro PS max, arrotondato per difetto, in base alla loro debolezza al tipo Roccia (0,25x, 0,5x, neutra, 2x o 4x rispettivamente). Può essere rimossa dalla parte avversaria se un Pokémon usa Pulizie, o se un avversario usa Glitturbine, Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		shortDesc: "Ferisce i nemici entranti secondo la debolezza Roccia.", // NEEDS QC
		gen8: {
			desc: "Piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo. Fallisce se l'effetto è già attivo nella parte avversaria. Gli avversari perdono 1/32, 1/16, 1/8, 1/4 o 1/2 dei loro PS max, arrotondato per difetto, in base alla loro debolezza al tipo Roccia (0,25x, 0,5x, neutra, 2x o 4x rispettivamente). Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		},
		gen5: {
			desc: "Piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo. Fallisce se l'effetto è già attivo nella parte avversaria. Gli avversari perdono 1/32, 1/16, 1/8, 1/4 o 1/2 dei loro PS max, arrotondato per difetto, in base alla loro debolezza al tipo Roccia (0,25x, 0,5x, neutra, 2x o 4x rispettivamente). Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		},

		start: "  {TEAM:capitalize} è circondata da rocce aguzze sospese in aria!",
		end: "  Levitoroccia non ha più effetto su {TEAM}!",
		damage: "  Rocce aguzze colpiscono {POKEMON}!",
	},
	steameruption: {
		name: "Vaporscoppio",
		// Official flavor text: "Travolge il bersaglio con un’ondata di vapore rovente che può anche scottarlo."
		desc: "Ha il 30% di probabilità di scottare il bersaglio. Il bersaglio viene scongelato se era congelato.", // NEEDS QC
		shortDesc: "30% di scottare. Scongela il bersaglio.", // NEEDS QC
	},
	steamroller: {
		name: "Rulloduro",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
		gen5: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio. I danni raddoppiano se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		},
	},
	steelbeam: {
		name: "Raggio d’Acciaio",
		// Official flavor text: "Chi la usa utilizza l’acciaio del proprio corpo per sparare un violento raggio, ma subisce danni."
		desc: "Che questa mossa vada a segno o meno, e anche se questo lo manda KO, chi la usa perde metà dei suoi PS max, arrotondato per eccesso, a meno che non abbia l'abilità Magicscudo.", // NEEDS QC
		shortDesc: "Chi la usa perde metà dei suoi PS max.", // NEEDS QC

		damage: "#mindblown",
	},
	steelroller: {
		name: "Ferrorullo",
		// Official flavor text: "Chi la usa attacca eliminando lo stato del terreno di lotta. La mossa fallisce se nel terreno non è attivo alcuno stato."
		desc: "Fallisce se nessun campo è attivo. Pone fine agli effetti di Campo Elettrico, Campo Erboso, Campo Nebbioso e Campo Psichico.", // NEEDS QC
		shortDesc: "Fallisce senza campo attivo. Rimuove il campo.", // NEEDS QC
	},
	steelwing: {
		name: "Alacciaio",
		// Official flavor text: "Colpisce il bersaglio con ali d’acciaio. Può anche aumentare la Difesa di chi la usa."
		desc: "Ha il 10% di probabilità di aumentare la Difesa di chi la usa di un livello.", // NEEDS QC
		shortDesc: "10% di aumentare la Difesa di chi la usa di 1.", // NEEDS QC
	},
	stickyweb: {
		name: "Rete Vischiosa",
		// Official flavor text: "Chi la usa intreccia una rete appiccicosa attorno alla squadra avversaria, diminuendo la Velocità dei Pokémon nemici che entreranno in campo."
		desc: "Piazza una trappola nella parte avversaria che riduce di un livello la Velocità di ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Fallisce se l'effetto è già attivo nella parte avversaria. Può essere rimossa dalla parte avversaria se un Pokémon usa Pulizie, o se un avversario usa Glitturbine, Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		shortDesc: "-1 Velocità ai nemici che entrano a terra.", // NEEDS QC
		gen8: {
			desc: "Piazza una trappola nella parte avversaria che riduce di un livello la Velocità di ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Fallisce se l'effetto è già attivo nella parte avversaria. Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		},

		start: "  Una Rete Vischiosa viene stesa ai piedi di {TEAM}!",
		end: "  La Rete Vischiosa ai piedi di {TEAM} svanisce!",
		activate: "  {POKEMON} rimane impigliato nella Rete Vischiosa!",
	},
	stockpile: {
		name: "Accumulo",
		// Official flavor text: "Chi la usa accumula energia aumentando la Difesa e la Difesa Speciale. Si può utilizzare tre volte."
		desc: "Aumenta la Difesa e la Difesa Speciale di chi la usa di un livello. Il contatore di Accumulo aumenta di 1. Fallisce se il contatore è a 3. Il contatore torna a 0 quando chi la usa lascia il campo.", // NEEDS QC
		shortDesc: "+1 Dif e Dif. Sp. Si accumula fino a 3 volte.", // NEEDS QC
		gen3: {
			desc: "Il contatore di Accumulo di chi la usa aumenta di 1. Fallisce se il contatore è a 3. Il contatore torna a 0 quando chi la usa lascia il campo.", // NEEDS QC
			shortDesc: "Contatore di Accumulo +1. Max 3 usi.", // NEEDS QC
		},

		start: "  {POKEMON} ha usato Accumulo per la {NUMBER}ª volta!",
		end: "  L’effetto della mossa Accumulo di {POKEMON} è terminato!",
	},
	stokedsparksurfer: {
		name: "Elettrosurf Folgorante",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 100% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "100% di paralizzare il bersaglio.", // NEEDS QC
	},
	stomp: {
		name: "Pestone",
		// Official flavor text: "Colpisce il bersaglio con un grosso piede e può anche farlo tentennare."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
		gen5: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio. I danni raddoppiano se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		},
		gen4: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio. La potenza raddoppia se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		},
		gen3: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio. I danni raddoppiano se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		},
		gen2: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio. La potenza raddoppia se il bersaglio è sotto l'effetto di Minimizzato.", // NEEDS QC
		},
		gen1: {
			desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		},
	},
	stompingtantrum: {
		name: "Battipiedi",
		// Official flavor text: "Chi la usa attacca battendo i piedi per la rabbia. Se la mossa usata al turno precedente non è andata a segno, la potenza raddoppia."
		desc: "La potenza raddoppia se l'ultima mossa di chi la usa nel turno precedente, comprese le mosse richiamate da altre mosse o usate tramite Imposizione, Magivelo, Scippo o le abilità Sincrodanza o Magispecchio, non ha prodotto nessuno dei suoi effetti normali — senza contare i danni di un Calcinvolo, Calciosalto o Sbalorditesta fallito — o se chi la usa non ha potuto agire per un effetto diverso dalla ricarica o da Cadutalibera. Una mossa bloccata da Fortino, Individua, Scudo Reale, Protezione, Agodifesa, Truccodifesa, Ribaltappeto, Anticipo o Bodyguard non raddoppia la potenza di questa mossa, e nemmeno un Rimbalzo o un Volo interrotto dall'effetto di Gravità, Abbattimento o Mille Frecce.", // NEEDS QC
		shortDesc: "Potenza doppia se l'ultima mossa è fallita.", // NEEDS QC
	},
	stoneaxe: {
		name: "Rocciascure",
		desc: "Se questa mossa va a segno, piazza una trappola nella parte avversaria che ferisce ogni avversario che entra in campo. Gli avversari perdono 1/32, 1/16, 1/8, 1/4 o 1/2 dei loro PS max, arrotondato per difetto, in base alla loro debolezza al tipo Roccia (0,25x, 0,5x, neutra, 2x o 4x rispettivamente). Può essere rimossa dalla parte avversaria se un Pokémon usa Pulizie, o se un avversario usa Glitturbine, Rapigiro o Scacciabruma con successo, o viene colpito da Scacciabruma.", // NEEDS QC
		shortDesc: "Piazza Levitoroccia nella parte avversaria.", // NEEDS QC
	},
	stoneedge: {
		name: "Pietrataglio",
		// Official flavor text: "Chi la usa colpisce il bersaglio dal basso con pietre affilate. Probabile brutto colpo."
		desc: "Ha una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Alta probabilità di brutto colpo.", // NEEDS QC
	},
	storedpower: {
		name: "Veicolaforza",
		// Official flavor text: "Attacca il bersaglio con l’energia accumulata. Più sono state aumentate le statistiche, maggiore è il danno inflitto."
		desc: "La potenza è pari a 20 + (X × 20), dove X è il totale dei livelli positivi delle statistiche di chi la usa.", // NEEDS QC
		shortDesc: "+20 di potenza per ogni aumento di statistica.", // NEEDS QC
	},
	stormthrow: {
		name: "Tempestretta",
		// Official flavor text: "Chi la usa sferra un colpo micidiale al bersaglio. Brutto colpo assicurato."
		desc: "Questa mossa è sempre un brutto colpo, a meno che il bersaglio non sia sotto l'effetto di Fortuncanto o abbia l'abilità Lottascudo o Guscioscudo.", // NEEDS QC
		shortDesc: "È sempre un brutto colpo.", // NEEDS QC
	},
	strangesteam: {
		name: "Vapore Incantato",
		// Official flavor text: "Chi la usa attacca il bersaglio con getti di vapore che possono anche confonderlo."
		desc: "Ha il 20% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "20% di confondere il bersaglio.", // NEEDS QC
	},
	strength: {
		name: "Forza",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	strengthsap: {
		name: "Assorbiforza",
		// Official flavor text: "Fa recuperare una quantità di PS pari all’Attacco del bersaglio, che vedrà diminuire questa statistica."
		desc: "Riduce l'Attacco del bersaglio di un livello. Chi la usa recupera PS pari all'Attacco del bersaglio calcolato con il livello che aveva prima dell'uso. Se chi la usa ha una Granradice, i PS recuperati sono moltiplicati per 1,3, arrotondato per difetto da 0,5. Fallisce se il livello di Attacco del bersaglio è a -6.", // NEEDS QC
		shortDesc: "Recupera PS pari all'Attacco del bersaglio; -1 Att.", // NEEDS QC
	},
	stringshot: {
		name: "Millebave",
		// Official flavor text: "Chi la usa produce della seta che avvolge i nemici intorno e ne riduce di molto la Velocità."
		desc: "Riduce la Velocità del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce la Velocità dei nemici di 2 livelli.", // NEEDS QC
		gen5: {
			desc: "Riduce la Velocità del bersaglio di un livello.", // NEEDS QC
			shortDesc: "Riduce la Velocità dei nemici di 1.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Riduce la Velocità del bersaglio di 1.", // NEEDS QC
		},
	},
	struggle: {
		name: "Scontro",
		// Official flavor text: "Mossa da usare solo in caso estremo, quando non si hanno più PP. Danneggia anche chi la usa."
		desc: "Infligge danni senza tipo a un avversario a caso. Se questa mossa va a segno, chi la usa perde 1/4 dei suoi PS max, arrotondato per eccesso da 0,5, e l'abilità Testadura non lo impedisce. Questa mossa viene usata automaticamente se nessuna delle mosse conosciute può essere selezionata.", // NEEDS QC
		shortDesc: "Chi la usa perde 1/4 dei suoi PS max.", // NEEDS QC
		gen6: {
			desc: "Infligge danni senza tipo a un avversario adiacente a caso. Se questa mossa va a segno, chi la usa perde 1/4 dei suoi PS max, arrotondato per eccesso da 0,5, e l'abilità Testadura non lo impedisce. Questa mossa viene usata automaticamente se nessuna delle mosse conosciute può essere selezionata.", // NEEDS QC
		},
		gen4: {
			desc: "Infligge danni senza tipo a un avversario a caso. Se questa mossa va a segno, chi la usa perde 1/4 dei suoi PS max, arrotondato per difetto, e l'abilità Testadura non lo impedisce. Questa mossa viene usata automaticamente se nessuna delle mosse conosciute può essere selezionata.", // NEEDS QC
		},
		gen3: {
			desc: "Infligge danni senza tipo a un avversario a caso. Se questa mossa va a segno, chi la usa subisce danni pari a 1/4 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS, e l'abilità Testadura non lo impedisce. Questa mossa viene usata automaticamente se nessuna delle mosse conosciute può essere selezionata.", // NEEDS QC
			shortDesc: "Chi la usa perde 1/4 dei PS persi dal bersaglio.", // NEEDS QC
		},
		gen2: {
			desc: "Infligge danni senza tipo. Se questa mossa va a segno, chi la usa subisce danni pari a 1/4 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS. Questa mossa viene usata automaticamente se nessuna delle mosse conosciute può essere selezionata.", // NEEDS QC
		},
		gen1: {
			desc: "Infligge danni di tipo Normale. Se questa mossa va a segno, chi la usa subisce danni pari a 1/2 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS. Questa mossa viene usata automaticamente se nessuna delle mosse conosciute può essere selezionata.", // NEEDS QC
			shortDesc: "Chi la usa perde 1/2 dei PS persi dal bersaglio.", // NEEDS QC
		},
	},
	strugglebug: {
		name: "Entomoblocco",
		// Official flavor text: "Colpisce i nemici intorno opponendo resistenza e riducendo il loro Attacco Speciale."
		desc: "Ha il 100% di probabilità di ridurre l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Att. Sp. dei nemici di 1.", // NEEDS QC
	},
	stuffcheeks: {
		name: "Riempiguance",
		// Official flavor text: "Se chi la usa ha con sé una bacca, la mangia e la sua Difesa aumenta di molto."
		desc: "Questa mossa può essere selezionata solo se chi la usa ha una bacca. Chi la usa mangia la sua bacca e aumenta la sua Difesa di 2 livelli. Questo effetto non è impedito dalle abilità Impaccio o Agitazione, né dagli effetti di Divieto o Magicozona. Fallisce se chi la usa non ha una bacca.", // NEEDS QC
		shortDesc: "Mangia la sua bacca e aumenta la Difesa di 2.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	stunspore: {
		name: "Paralizzante",
		// Official flavor text: "Investe il bersaglio con una nuvola di polvere che paralizza."
		desc: "Paralizza il bersaglio.", // NEEDS QC
		shortDesc: "Paralizza il bersaglio.", // NEEDS QC
		gen3: {
			desc: "Paralizza il bersaglio. Questa mossa non ignora l'immunità di tipo.", // NEEDS QC
		},
		gen1: {
			desc: "Paralizza il bersaglio.", // NEEDS QC
		},
	},
	submission: {
		name: "Sottomissione",
		// Official flavor text: "Chi la usa carica il bersaglio in modo spericolato, ma danneggia anche se stesso."
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo di 1/4 dei danni.", // NEEDS QC
		gen4: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		},
		gen2: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS. Se questa mossa colpisce un sostituto, il contraccolpo è sempre di 1 PS.", // NEEDS QC
		},
		gen1: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS. Se questa mossa rompe il sostituto del bersaglio, chi la usa non subisce contraccolpo.", // NEEDS QC
		},
	},
	substitute: {
		name: "Sostituto",
		// Official flavor text: "Chi la usa crea una copia di se stesso usando alcuni PS. La copia serve come esca per il nemico."
		desc: "Chi la usa sacrifica 1/4 dei suoi PS max, arrotondato per difetto, per creare un sostituto che lo rimpiazza in lotta. Il sostituto sparisce quando ha subito abbastanza danni, se chi la usa viene sostituito o va KO, o se un Pokémon usa Pulizie. Staffetta può trasferire il sostituto a un alleato, con i suoi PS restanti. Finché il sostituto non si rompe, subisce i danni di tutti gli attacchi degli altri Pokémon e protegge chi la usa dagli effetti di stato e dai cambi di livello causati dagli altri Pokémon. Le mosse basate sul suono e i Pokémon con l'abilità Intrapasso ignorano i sostituti. Chi la usa subisce normalmente i danni del tempo atmosferico e dei problemi di stato dietro il sostituto. Se il sostituto si rompe durante una mossa multicolpo, chi la usa subisce i danni dei colpi restanti. Se un sostituto viene creato mentre chi la usa è intrappolato da una mossa intrappolante, quell'effetto finisce immediatamente. Fallisce se chi la usa non ha abbastanza PS per creare un sostituto senza andare KO, o se ha già un sostituto.", // NEEDS QC
		shortDesc: "Spende 1/4 dei suoi PS per creare un sostituto.", // NEEDS QC
		gen8: {
			desc: "Chi la usa sacrifica 1/4 dei suoi PS max, arrotondato per difetto, per creare un sostituto che lo rimpiazza in lotta. Il sostituto sparisce quando ha subito abbastanza danni, o se chi la usa viene sostituito o va KO. Staffetta può trasferire il sostituto a un alleato, con i suoi PS restanti. Finché il sostituto non si rompe, subisce i danni di tutti gli attacchi degli altri Pokémon e protegge chi la usa dagli effetti di stato e dai cambi di livello causati dagli altri Pokémon. Le mosse basate sul suono e i Pokémon con l'abilità Intrapasso ignorano i sostituti. Chi la usa subisce normalmente i danni del tempo atmosferico e dei problemi di stato dietro il sostituto. Se il sostituto si rompe durante una mossa multicolpo, chi la usa subisce i danni dei colpi restanti. Se un sostituto viene creato mentre chi la usa è intrappolato da una mossa intrappolante, quell'effetto finisce immediatamente. Fallisce se chi la usa non ha abbastanza PS per creare un sostituto senza andare KO, o se ha già un sostituto.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa sacrifica 1/4 dei suoi PS max, arrotondato per difetto, per creare un sostituto che lo rimpiazza in lotta. Il sostituto sparisce quando ha subito abbastanza danni, o se chi la usa viene sostituito o va KO. Staffetta può trasferire il sostituto a un alleato, con i suoi PS restanti. Finché il sostituto non si rompe, subisce i danni di tutti gli attacchi degli altri Pokémon e protegge chi la usa dagli effetti di stato e dai cambi di livello causati dagli altri Pokémon. Chi la usa subisce normalmente i danni del tempo atmosferico e dei problemi di stato dietro il sostituto. Se il sostituto si rompe durante una mossa multicolpo, chi la usa subisce i danni dei colpi restanti. Se un sostituto viene creato mentre chi la usa è intrappolato da una mossa intrappolante, quell'effetto finisce immediatamente. Fallisce se chi la usa non ha abbastanza PS per creare un sostituto senza andare KO, o se ha già un sostituto.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa sacrifica 1/4 dei suoi PS max, arrotondato per difetto, per creare un sostituto che lo rimpiazza in lotta. Il sostituto ha 1 PS più i PS usati per crearlo, e sparisce quando ha subito abbastanza danni o 255 danni in una volta, o se chi la usa viene sostituito o va KO. Finché il sostituto non si rompe, subisce i danni di tutti gli attacchi dell'avversario e protegge chi la usa dagli effetti di stato e dai cambi di livello causati dall'avversario, a meno che l'effetto non sia Inibitore, Parassiseme, il sonno, la paralisi come effetto principale o la confusione come effetto secondario e il sostituto non si sia rotto. Chi la usa subisce normalmente i danni dei problemi di stato dietro il sostituto, ma i danni da confusione vengono inflitti invece al sostituto dell'avversario. Se il sostituto si rompe durante una mossa multicolpo, l'attacco finisce. Fallisce se chi la usa non ha abbastanza PS per creare un sostituto, o se ha già un sostituto. Chi la usa crea un sostituto e poi va KO se i suoi PS attuali sono esattamente 1/4 dei suoi PS max.", // NEEDS QC
			shortDesc: "Sacrifica 1/4 dei PS max per un sostituto.", // NEEDS QC
		},

		start: "  Appare un sostituto di {POKEMON}!",
		alreadyStarted: "  {POKEMON} ha già un sostituto!",
		end: "  Il sostituto di {POKEMON} svanisce!",
		fail: "  È troppo debole! Non può creare un sostituto!",
		activate: "  Il sostituto viene colpito al posto di {POKEMON}!",
	},
	subzeroslammer: {
		name: "Criodistruzione Polare",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	suckerpunch: {
		name: "Sbigoattacco",
		// Official flavor text: "Chi la usa attacca con alta priorità, ma fallisce se il bersaglio non sta preparando un attacco."
		desc: "Fallisce se il bersaglio non ha scelto un attacco fisico, un attacco speciale o Precedenza in questo turno, o se agisce prima di chi la usa.", // NEEDS QC
		shortDesc: "Va per primo. Fallisce se il bersaglio non attacca.", // NEEDS QC
		gen4: {
			desc: "Fallisce se il bersaglio non ha scelto un attacco fisico o speciale in questo turno, o se agisce prima di chi la usa.", // NEEDS QC
		},
	},
	sunnyday: {
		name: "Giornodisole",
		// Official flavor text: "Chi la usa intensifica i raggi solari per cinque turni, potenziando le mosse di tipo Fuoco e riducendo la potenza di quelle di tipo Acqua."
		desc: "Per 5 turni, il tempo diventa Sole intenso. Durante l'effetto, i danni degli attacchi di tipo Fuoco sono moltiplicati per 1,5 e quelli degli attacchi di tipo Acqua per 0,5. Dura 8 turni se chi la usa ha una Rocciacalda. Fallisce se il tempo attuale è già Sole intenso.", // NEEDS QC
		shortDesc: "5 turni: il sole potenzia le mosse Fuoco.", // NEEDS QC
		gen3: {
			desc: "Per 5 turni, il tempo diventa Sole intenso. Durante l'effetto, i danni degli attacchi di tipo Fuoco sono moltiplicati per 1,5 e quelli degli attacchi di tipo Acqua per 0,5. Fallisce se il tempo attuale è già Sole intenso.", // NEEDS QC
		},
		gen2: {
			desc: "Per 5 turni, il tempo diventa Sole intenso, anche se il tempo attuale è già Sole intenso. Durante l'effetto, i danni degli attacchi di tipo Fuoco sono moltiplicati per 1,5 e quelli degli attacchi di tipo Acqua per 0,5.", // NEEDS QC
		},
	},
	sunsteelstrike: {
		name: "Astrocarica",
		// Official flavor text: "Chi la usa travolge il bersaglio con la potenza di una meteora. Questo attacco ignora l’abilità del bersaglio."
		desc: "Questa mossa e i suoi effetti ignorano le abilità degli altri Pokémon.", // NEEDS QC
		shortDesc: "Ignora le abilità degli altri Pokémon.", // NEEDS QC
	},
	supercellslam: {
		name: "Elettrotuffo",
		desc: "Se questo attacco fallisce, chi la usa perde metà dei suoi PS max, arrotondato per difetto, come danni da fallimento. I Pokémon con l'abilità Magicscudo non subiscono i danni da fallimento. I danni raddoppiano e la precisione non viene verificata se il bersaglio ha usato Minimizzato da quando è in campo.", // NEEDS QC
		shortDesc: "Se fallisce, chi la usa perde metà dei PS max.", // NEEDS QC

		damage: "#crash",
	},
	superfang: {
		name: "Superzanna",
		// Official flavor text: "Chi la usa salta sul bersaglio azzannandolo con i suoi incisivi affilati e facendogli perdere metà dei PS."
		desc: "Infligge al bersaglio danni pari a metà dei suoi PS attuali, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Infligge metà dei PS attuali del bersaglio.", // NEEDS QC
		gen1: {
			desc: "Infligge al bersaglio danni pari a metà dei suoi PS attuali, arrotondato per difetto, ma non meno di 1 PS. Questa mossa ignora l'immunità di tipo.", // NEEDS QC
			shortDesc: "Danni = 1/2 dei PS attuali. Colpisce gli Spettro.", // NEEDS QC
		},
	},
	superpower: {
		name: "Troppoforte",
		// Official flavor text: "Chi la usa attacca il bersaglio con grande forza, ma il suo Attacco e la sua Difesa diminuiscono."
		desc: "Riduce l'Attacco e la Difesa di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Riduce l'Attacco e la Difesa di chi la usa di 1.", // NEEDS QC
	},
	supersonic: {
		name: "Supersuono",
		shortDesc: "Confonde il bersaglio.", // NEEDS QC
	},
	supersonicskystrike: {
		name: "Picchiata Devastante",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	surf: {
		name: "Surf",
		// Official flavor text: "Un’onda enorme sommerge il campo di lotta, colpendo tutti i Pokémon intorno a chi la scatena."
		desc: "I danni raddoppiano se il bersaglio sta usando Sub.", // NEEDS QC
		shortDesc: "Colpisce gli adiacenti. Danni x2 su Sub.", // NEEDS QC
		gen4: {
			desc: "La potenza raddoppia se il bersaglio sta usando Sub.", // NEEDS QC
			shortDesc: "Colpisce i Pokémon adiacenti. 2x contro Sub.", // NEEDS QC
		},
		gen2: {
			desc: "Nessun effetto aggiuntivo.", // NEEDS QC
			shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		},
		gen3: {
			shortDesc: "Colpisce i nemici. 2x contro Sub.", // NEEDS QC
		},
	},
	surgingstrikes: {
		name: "Idroraffica",
		// Official flavor text: "Il Pokémon sferra una fluida serie di tre attacchi, massima espressione dello stile di tipo Acqua. Brutto colpo assicurato."
		desc: "Colpisce tre volte. Questa mossa è sempre un brutto colpo, a meno che il bersaglio non sia sotto l'effetto di Fortuncanto o abbia l'abilità Lottascudo o Guscioscudo.", // NEEDS QC
		shortDesc: "Colpisce 3 volte. Sempre brutti colpi.", // NEEDS QC
	},
	swagger: {
		name: "Bullo",
		// Official flavor text: "Chi la usa provoca il bersaglio e lo confonde, facendo aumentare però di molto il suo Attacco."
		desc: "Aumenta l'Attacco del bersaglio di 2 livelli e lo confonde.", // NEEDS QC
		shortDesc: "+2 Attacco del bersaglio e lo confonde.", // NEEDS QC
		gen2: {
			desc: "Aumenta l'Attacco del bersaglio di 2 livelli e lo confonde. Questa mossa manca il bersaglio se il suo Attacco non può essere aumentato.", // NEEDS QC
		},
	},
	swallow: {
		name: "Introenergia",
		// Official flavor text: "Chi la usa assorbe l’energia raccolta con la mossa Accumulo e recupera PS. Maggiore è l’energia, più PS si recuperano."
		desc: "Chi la usa recupera PS in base al suo contatore di Accumulo: 1/4 dei suoi PS max se è a 1, metà se è a 2, arrotondato per difetto da 0,5, e tutti i PS se è a 3. Fallisce se il contatore è a 0. La Difesa e la Difesa Speciale di chi la usa diminuiscono di tanti livelli quanti Accumulo li aveva aumentati, e il contatore torna a 0.", // NEEDS QC
		shortDesc: "Si cura in base agli usi di Accumulo.", // NEEDS QC
		gen4: {
			desc: "Chi la usa recupera PS in base al suo contatore di Accumulo: 1/4 dei suoi PS max se è a 1, metà se è a 2, arrotondato per difetto, e tutti i PS se è a 3. Fallisce se il contatore è a 0. La Difesa e la Difesa Speciale di chi la usa diminuiscono di tanti livelli quanti Accumulo li aveva aumentati, e il contatore torna a 0.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa recupera PS in base al suo contatore di Accumulo: 1/4 dei suoi PS max se è a 1, metà se è a 2, arrotondato per difetto da 0,5, e tutti i PS se è a 3. Fallisce se il contatore è a 0. Il contatore torna a 0.", // NEEDS QC
		},
	},
	sweetkiss: {
		name: "Dolcebacio",
		shortDesc: "Confonde il bersaglio.", // NEEDS QC
	},
	sweetscent: {
		name: "Profumino",
		// Official flavor text: "Un dolce profumo che riduce di molto l’elusione dei nemici intorno a chi la usa."
		desc: "Riduce l'elusione del bersaglio di 2 livelli.", // NEEDS QC
		shortDesc: "Riduce l'elusione dei nemici di 2 livelli.", // NEEDS QC
		gen5: {
			desc: "Riduce l'elusione del bersaglio di un livello.", // NEEDS QC
			shortDesc: "Riduce l'elusione dei nemici di 1.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Riduce l'elusione del bersaglio di 1.", // NEEDS QC
		},
	},
	swift: {
		name: "Comete",
		// Official flavor text: "Chi la usa colpisce i nemici intorno con raggi a forma di stella. Questo attacco è infallibile."
		desc: "Questa mossa non verifica la precisione.", // NEEDS QC
		shortDesc: "Non verifica la precisione. Colpisce i nemici.", // NEEDS QC
		gen1: {
			desc: "Questa mossa non verifica la precisione e colpisce anche un bersaglio che sta usando Fossa o Volo.", // NEEDS QC
			shortDesc: "Non manca mai, nemmeno contro Fossa e Volo.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Non verifica la precisione.", // NEEDS QC
		},
	},
	switcheroo: {
		name: "Rapidscambio",
		// Official flavor text: "Chi la usa scambia lo strumento che ha con quello del bersaglio a una velocità impressionante."
		desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, o se chi la usa prova a dare o prendere Gemma blu, Gemma rossa, Adamasferoide, Splendisferoide, Grigiosferoide, una lastra, un modulo, una ROM, Spada rovinata, Scudo rovinato, una Capsula energetica o una maschera a o da Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradosso o Ogerpon, rispettivamente. In questo caso, i Pokémon Paradosso includono tutte le specie con le abilità Paleoattivazione e Carica Quark, tranne Vampeaguzze, Furiatonante, Massoferreo e Capoferreo. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		shortDesc: "Scambia il suo strumento con quello del bersaglio.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, o se chi la usa prova a dare o prendere Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo, una ROM, Spada rovinata o Scudo rovinato a o da Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian o Zamazenta, rispettivamente. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, se uno dei due ha un Cristallo Z, se chi la usa prova a dare o prendere una megapietra a o dalla specie che può megaevolversi con essa, o se prova a dare o prendere Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo o una ROM a o da Kyogre, Groudon, Giratina, Arceus, Genesect o Silvally, rispettivamente. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, se chi la usa prova a dare o prendere una megapietra a o dalla specie che può megaevolversi con essa, o se prova a dare o prendere Gemma blu, Gemma rossa, Grigiosfera, una lastra o un modulo a o da Kyogre, Groudon, Giratina, Arceus o Genesect, rispettivamente. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, se uno dei due ha un Messaggio, o se chi la usa prova a dare o prendere Grigiosfera, una lastra o un modulo a o da Giratina, Arceus o Genesect, rispettivamente. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, se uno dei due ha un Messaggio o un Grigiosfera, se uno dei due ha l'abilità Multitipo, se uno dei due è sotto l'effetto di Privazione, o se il bersaglio ha l'abilità Antifurto.", // NEEDS QC
		},

		activate: "#trick",
	},
	swordsdance: {
		name: "Danzaspada",
		// Official flavor text: "Danza frenetica che incrementa lo spirito combattivo. Chi la usa aumenta di molto il suo Attacco."
		desc: "Aumenta l'Attacco di chi la usa di 2 livelli.", // NEEDS QC
		shortDesc: "Aumenta l'Attacco di chi la usa di 2.", // NEEDS QC
	},
	synchronoise: {
		name: "Sincrumore",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Il bersaglio è immune se non condivide alcun tipo con chi la usa.", // NEEDS QC
		shortDesc: "Colpisce gli adiacenti che condividono il suo tipo.", // NEEDS QC
	},
	synthesis: {
		name: "Sintesi",
		// Official flavor text: "Chi la usa recupera PS. Il numero di PS recuperati dipende dalle condizioni atmosferiche."
		desc: "Chi la usa recupera metà dei suoi PS max se Vento misterioso è attiva, se non c'è alcun tempo atmosferico o se ha un Superombrello; 2/3 dei suoi PS max se il tempo è Sole accecante o Sole intenso; e 1/4 dei suoi PS max se il tempo è Acquazzone, Pioggia, tempesta di sabbia o neve, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		shortDesc: "Cura chi la usa in base al tempo atmosferico.", // NEEDS QC
		gen8: {
			desc: "Chi la usa recupera metà dei suoi PS max se Vento misterioso è attiva, se non c'è alcun tempo atmosferico o se ha un Superombrello; 2/3 dei suoi PS max se il tempo è Sole accecante o Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Acquazzone, Pioggia o Terrempesta, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa recupera metà dei suoi PS max se Vento misterioso è attiva o se non c'è alcun tempo atmosferico; 2/3 dei suoi PS max se il tempo è Sole accecante o Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Acquazzone, Pioggia o Terrempesta, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa recupera metà dei suoi PS max se non c'è alcun tempo atmosferico; 2/3 dei suoi PS max se il tempo è Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Pioggia o Terrempesta, il tutto arrotondato per difetto da 0,5.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa recupera metà dei suoi PS max se non c'è alcun tempo atmosferico; 2/3 dei suoi PS max se il tempo è Sole intenso; e 1/4 dei suoi PS max se il tempo è Grandine, Pioggia o Terrempesta, il tutto arrotondato per difetto.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa recupera metà dei suoi PS max se non c'è alcun tempo atmosferico; tutti i suoi PS se il tempo è Sole intenso; e 1/4 dei suoi PS max se il tempo è Pioggia o Terrempesta, il tutto arrotondato per difetto.", // NEEDS QC
		},
	},
	syrupbomb: {
		name: "Bomba Sciroppata",
		desc: "Se questa mossa va a segno, la Velocità del bersaglio diminuisce di un livello alla fine di ogni turno per 3 turni.", // NEEDS QC
		shortDesc: "-1 Velocità del bersaglio a ogni turno per 3 turni.", // NEEDS QC

		start: "  {POKEMON} è ricoperto di sciroppo!",
	},
	tackle: {
		name: "Azione",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	tachyoncutter: {
		name: "Tachiontaglio",
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo. Questa mossa non verifica la precisione.", // NEEDS QC
		shortDesc: "Colpisce 2 volte. Non verifica la precisione.", // NEEDS QC
	},
	tailglow: {
		name: "Codadiluce",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Aumenta l'Attacco Speciale di chi la usa di 3 livelli.", // NEEDS QC
		shortDesc: "Aumenta l'Att. Sp. di chi la usa di 3.", // NEEDS QC
		gen4: {
			desc: "Aumenta l'Attacco Speciale di chi la usa di 2 livelli.", // NEEDS QC
			shortDesc: "Aumenta l'Att. Sp. di chi la usa di 2.", // NEEDS QC
		},
	},
	tailslap: {
		name: "Spazzasberla",
		// Official flavor text: "Chi la usa colpisce il bersaglio con la sua coda dura da due a cinque volte di fila."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Colpisce da 2 a 5 volte in un turno.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
	},
	tailwhip: {
		name: "Colpocoda",
		// Official flavor text: "Chi la usa agita la coda per distrarre i nemici che ha intorno, riducendone la Difesa."
		desc: "Riduce la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce la Difesa dei nemici di 1.", // NEEDS QC
		gen2: {
			shortDesc: "Riduce la Difesa del bersaglio di 1.", // NEEDS QC
		},
	},
	tailwind: {
		name: "Ventoincoda",
		// Official flavor text: "Chi la usa scatena un turbine che aumenta la Velocità di tutti i Pokémon della squadra per quattro turni."
		desc: "Per 4 turni, chi la usa e la sua squadra hanno la Velocità raddoppiata. Fallisce se questo effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "4 turni: la Velocità della squadra raddoppia.", // NEEDS QC
		gen4: {
			desc: "Per 3 turni, chi la usa e la sua squadra hanno la Velocità raddoppiata. Fallisce se questo effetto è già attivo nella sua parte.", // NEEDS QC
			shortDesc: "3 turni: la Velocità della squadra raddoppia.", // NEEDS QC
		},

		start: "  Comincia a soffiare Ventoincoda su {TEAM}!",
		end: "  Ventoincoda non soffia più su {TEAM}!",
	},
	takedown: {
		name: "Riduttore",
		// Official flavor text: "Carica spericolata con tutto il corpo contro il bersaglio. Danneggia un po’ anche chi la usa."
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo di 1/4 dei danni.", // NEEDS QC
		gen4: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
		},
		gen2: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS. Se questa mossa colpisce un sostituto, il contraccolpo è sempre di 1 PS.", // NEEDS QC
		},
		gen1: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS. Se questa mossa rompe il sostituto del bersaglio, chi la usa non subisce contraccolpo.", // NEEDS QC
		},
	},
	takeheart: {
		name: "Baldimpulso",
		desc: "Cura il problema di stato di chi la usa. Aumenta il suo Attacco Speciale e la sua Difesa Speciale di un livello.", // NEEDS QC
		shortDesc: "Cura il suo stato; +1 Att. Sp. e Dif. Sp.", // NEEDS QC
	},
	tarshot: {
		name: "Colpocatrame",
		// Official flavor text: "Chi la usa getta catrame appiccicoso sul bersaglio abbassandone la Velocità e rendendolo vulnerabile al tipo Fuoco."
		desc: "Riduce la Velocità del bersaglio di un livello. Finché il bersaglio non lascia il campo, l'efficacia delle mosse di tipo Fuoco raddoppia contro di lui.", // NEEDS QC
		shortDesc: "-1 Velocità e rende il bersaglio debole al Fuoco.", // NEEDS QC

		start: "  {POKEMON} è diventato vulnerabile al tipo Fuoco!",
	},
	taunt: {
		name: "Provocazione",
		// Official flavor text: "Provoca il bersaglio inducendolo a usare solo mosse d’attacco per tre turni."
		desc: "Il bersaglio non può usare mosse senza danni per i suoi prossimi tre turni. I Pokémon con l'abilità Indifferenza o protetti dall'abilità Aromavelo sono immuni.", // NEEDS QC
		shortDesc: "Il bersaglio non può usare mosse di stato per 3 turni.", // NEEDS QC
		gen7: {
			desc: "Il bersaglio non può usare mosse senza danni per i suoi prossimi tre turni. I Pokémon con l'abilità Indifferenza o protetti dall'abilità Aromavelo sono immuni. Le mosse potenziate dalla Forza Z possono comunque essere scelte ed eseguite durante l'effetto.", // NEEDS QC
		},
		gen6: {
			desc: "Il bersaglio non può usare mosse senza danni per i suoi prossimi tre turni. I Pokémon con l'abilità Indifferenza o protetti dall'abilità Aromavelo sono immuni.", // NEEDS QC
		},
		gen5: {
			desc: "Il bersaglio non può usare mosse senza danni per i suoi prossimi tre turni.", // NEEDS QC
		},
		gen4: {
			desc: "Per 3-5 turni, il bersaglio non può usare mosse senza danni.", // NEEDS QC
			shortDesc: "Niente mosse di stato per il bersaglio per 3-5 turni.", // NEEDS QC
		},
		gen3: {
			desc: "Per 2 turni, il bersaglio non può usare mosse senza danni.", // NEEDS QC
			shortDesc: "Niente mosse di stato per il bersaglio per 2 turni.", // NEEDS QC
		},

		start: "  {POKEMON} è in balia di Provocazione!",
		end: "  Provocazione non ha più effetto su {POKEMON}!",
		cant: "A causa di Provocazione {POKEMON} non può usare {MOVE}!",
	},
	tearfullook: {
		name: "Occhionilucidi",
		// Official flavor text: "Chi la usa guarda il bersaglio con gli occhi pieni di lacrime e gli fa perdere lo spirito combattivo, riducendone l’Attacco e l’Attacco Speciale."
		desc: "Riduce l'Attacco e l'Attacco Speciale del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce l'Attacco e l'Att. Sp. del bersaglio di 1.", // NEEDS QC
	},
	teatime: {
		name: "Ora del Tè",
		// Official flavor text: "Chi la usa invita tutti i Pokémon in campo a prendere il tè. Quelli che hanno con sé una bacca la mangiano."
		desc: "Tutti i Pokémon in campo consumano la loro bacca. Questo effetto non è impedito né dai sostituti, né dalle abilità Impaccio o Agitazione, né dagli effetti di Divieto o Magicozona. Fallisce se nessun Pokémon in campo ha una bacca.", // NEEDS QC
		shortDesc: "Tutti i Pokémon in campo mangiano le loro bacche.", // NEEDS QC

		activate: "  È l’ora del tè e tutti mangiano la loro bacca!",
		fail: "  Ma non succede nulla!",
	},
	technoblast: {
		name: "Tecnobotto",
		// Official flavor text: "Chi la usa rilascia un colpo di luce contro il bersaglio. Il tipo varia a seconda del modulo che ha."
		desc: "Il tipo di questa mossa dipende dal modulo di chi la usa.", // NEEDS QC
		shortDesc: "Il tipo dipende dal modulo che tiene.", // NEEDS QC
	},
	tectonicrage: {
		name: "Furore della Terra",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	teeterdance: {
		name: "Strampadanza",
		// Official flavor text: "Chi la usa esegue una danza goffa che confonde tutti i Pokémon attorno."
		desc: "Confonde il bersaglio.", // NEEDS QC
		shortDesc: "Confonde i Pokémon adiacenti.", // NEEDS QC
	},
	telekinesis: {
		name: "Telecinesi",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Per 3 turni, il bersaglio non può evitare alcun attacco, tranne le mosse KO in un colpo, finché resta in campo. Durante l'effetto, il bersaglio è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte, Rete Vischiosa e dell'abilità Trappoarena finché resta in campo. Se il bersaglio usa Staffetta, il sostituto eredita l'effetto. Radicamento, Abbattimento, Mille Frecce e la Ferropalla prevalgono su questa mossa se il bersaglio è sotto uno dei loro effetti. Fallisce se il bersaglio è già sotto questo effetto o sotto quelli di Radicamento, Abbattimento o Mille Frecce. Il bersaglio è immune all'uso di questa mossa se la sua specie è Diglett, Dugtrio, Diglett (Forma di Alola), Dugtrio (Forma di Alola), Sandygast, Palossand o Gengar megaevoluto. MegaGengar non può essere sotto questo effetto in alcun modo.", // NEEDS QC
		shortDesc: "3 turni: il bersaglio fluttua e non può schivare.", // NEEDS QC
		gen6: {
			desc: "Per 3 turni, il bersaglio non può evitare alcun attacco, tranne le mosse KO in un colpo, finché resta in campo. Durante l'effetto, il bersaglio è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte, Rete Vischiosa e dell'abilità Trappoarena finché resta in campo. Se il bersaglio usa Staffetta, il sostituto eredita l'effetto. Radicamento, Abbattimento, Mille Frecce e la Ferropalla prevalgono su questa mossa se il bersaglio è sotto uno dei loro effetti. Fallisce se il bersaglio è già sotto questo effetto o sotto quelli di Radicamento, Abbattimento o Mille Frecce. Il bersaglio è immune all'uso di questa mossa se la sua specie è Diglett, Dugtrio o Gengar megaevoluto. MegaGengar non può essere sotto questo effetto in alcun modo.", // NEEDS QC
		},
		gen5: {
			desc: "Per 3 turni, il bersaglio non può evitare alcun attacco, tranne le mosse KO in un colpo, finché resta in campo. Durante l'effetto, il bersaglio è immune agli attacchi di tipo Terra e agli effetti di Punte, Fielepunte e dell'abilità Trappoarena finché resta in campo. Se il bersaglio usa Staffetta, il sostituto eredita l'effetto. Radicamento, Abbattimento e la Ferropalla prevalgono su questa mossa se il bersaglio è sotto uno dei loro effetti. Fallisce se il bersaglio è già sotto questo effetto o sotto quelli di Radicamento o Abbattimento. Il bersaglio è immune a questa mossa se la sua specie è Diglett o Dugtrio.", // NEEDS QC
		},

		start: "  {POKEMON} è stato lanciato in aria!",
		end: "  {POKEMON} si libera dalla telecinesi!",
	},
	teleport: {
		name: "Teletrasporto",
		// Official flavor text: "Chi la usa viene sostituito se ci sono altri Pokémon in squadra. Se un Pokémon selvatico usa questa mossa, fugge dalla lotta."
		desc: "Se questa mossa va a segno e chi la usa non è KO, viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se non ci sono altri membri della squadra non KO.", // NEEDS QC
		shortDesc: "Chi la usa lascia il campo.", // NEEDS QC
		gen7: {
			desc: "Fallisce quando viene usata.", // NEEDS QC
			shortDesc: "Fallisce quando viene usata.", // NEEDS QC
		},
	},
	temperflare: {
		name: "Rabbia Bruciante",
		desc: "La potenza raddoppia se l'ultima mossa di chi la usa nel turno precedente, comprese le mosse richiamate da altre mosse o usate tramite Imposizione, Magivelo, Scippo o le abilità Sincrodanza o Magispecchio, non ha prodotto nessuno dei suoi effetti normali — senza contare i danni di un Calcinvolo, Calciosalto o Sbalorditesta fallito — o se chi la usa non ha potuto agire per un effetto diverso dalla ricarica o da Cadutalibera. Una mossa bloccata da Fortino, Individua, Scudo Reale, Protezione, Agodifesa, Truccodifesa, Ribaltappeto, Anticipo o Bodyguard non raddoppia la potenza di questa mossa, e nemmeno un Rimbalzo o un Volo interrotto dall'effetto di Gravità, Abbattimento o Mille Frecce.", // NEEDS QC
		shortDesc: "Potenza doppia se l'ultima mossa è fallita.", // NEEDS QC
	},
	terablast: {
		name: "Terascoppio",
		desc: "Se chi la usa è teracristallizzato, questa mossa diventa un attacco fisico se il suo Attacco è superiore al suo Attacco Speciale, compresi i livelli delle statistiche, e il suo tipo diventa il teratipo di chi la usa. Inoltre, se il teratipo è Astrale, questa mossa ha 100 di potenza, è superefficace contro i bersagli teracristallizzati e neutra contro gli altri, e riduce l'Attacco e l'Attacco Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Teracristal: fisica se Att > Att. Sp., tipo teratipo.", // NEEDS QC
	},
	terastarstorm: {
		name: "Teracluster",
		desc: "Se chi la usa è un Terapagos in Forma Astrale, il tipo di questa mossa diventa Astrale, colpisce tutti gli avversari e diventa un attacco fisico se l'Attacco di chi la usa è superiore al suo Attacco Speciale, compresi i livelli delle statistiche.", // NEEDS QC
		shortDesc: "Terapagos Astrale: tipo Astrale, colpisce entrambi.", // NEEDS QC
	},
	terrainpulse: {
		name: "Campopulsar",
		// Official flavor text: "Chi la usa attacca sfruttando l’energia del terreno di lotta. Il tipo e la potenza della mossa variano a seconda dello stato del terreno stesso."
		desc: "La potenza raddoppia se chi la usa è a terra e un campo è attivo, e il tipo di questa mossa cambia di conseguenza: tipo Elettro su un Campo Elettrico, tipo Erba su un Campo Erboso, tipo Folletto su un Campo Nebbioso e tipo Psico su un Campo Psichico.", // NEEDS QC
		shortDesc: "Su un campo: potenza doppia e tipo variabile.", // NEEDS QC
	},
	thief: {
		name: "Furto",
		// Official flavor text: "Chi la usa attacca il bersaglio e può rubargli lo strumento, se non ne ha già uno."
		desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è Gemma blu, Gemma rossa, Adamasferoide, Splendisferoide, Grigiosferoide, una lastra, un modulo, una ROM, Spada rovinata, Scudo rovinato, una Capsula energetica o una maschera tenuta rispettivamente da Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradosso o Ogerpon, o se chi la usa è una di quelle specie e il bersaglio ha lo strumento corrispondente. In questo caso, i Pokémon Paradosso includono tutte le specie con le abilità Paleoattivazione e Carica Quark, tranne Vampeaguzze, Furiatonante, Massoferreo e Capoferreo. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		shortDesc: "Senza strumenti, ruba quello del bersaglio.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo, una ROM, Spada rovinata o Scudo rovinato avuti rispettivamente da Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen7: {
			desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è un Cristallo Z, una megapietra avuta dalla specie che può megaevolversi con essa, o Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo o una ROM avuti rispettivamente da Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen6: {
			desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è una megapietra avuta dalla specie che può megaevolversi con essa, o Gemma blu, Gemma rossa, Grigiosfera, una lastra o un modulo avuti rispettivamente da Kyogre, Groudon, Giratina, Arceus, Genesect, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen5: {
			desc: "Se questo attacco va a segno e chi la usa non è KO, ruba lo strumento del bersaglio se non ne ha uno. Un bersaglio con l'abilità Antifurto non perde il suo strumento se non è KO. Lo strumento non viene rubato se è un Messaggio, o Grigiosfera, una lastra o un modulo avuti rispettivamente da Giratina, Arceus o Genesect, o se chi la usa è una di queste specie e il bersaglio ha lo strumento corrispondente. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo o l'abilità Coglibacche.", // NEEDS QC
		},
		gen4: {
			desc: "Se questo attacco va a segno e chi la usa non ha strumenti, ruba lo strumento del bersaglio. Lo strumento non viene rubato se è un Messaggio o una Grigiosfera, o se il bersaglio ha l'abilità Multitipo o Antifurto. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo.", // NEEDS QC
		},
		gen3: {
			desc: "Se questo attacco va a segno e chi la usa non ha strumenti, ruba lo strumento del bersaglio. Lo strumento non viene rubato se è un Messaggio o una Baccaenigma, o se il bersaglio ha l'abilità Antifurto. Gli strumenti persi con questa mossa non possono essere recuperati con Riciclo.", // NEEDS QC
		},
		gen2: {
			desc: "Ha il 100% di probabilità di rubare lo strumento del bersaglio se chi la usa non ne ha uno. Lo strumento non viene rubato se è un Messaggio.", // NEEDS QC
		},
	},
	thousandarrows: {
		name: "Mille Frecce",
		// Official flavor text: "Colpisce i nemici intorno scaraventando a terra quelli che si trovano in aria."
		desc: "Questa mossa può colpire i Pokémon in aria, cioè i Pokémon di tipo Volante, quelli con l'abilità Levitazione, quelli con un Palloncino e quelli sotto l'effetto di Magnetascesa o Telecinesi. Se il bersaglio è di tipo Volante e non è già a terra, questa mossa infligge danni neutri indipendentemente dagli altri suoi tipi. Questa mossa può colpire un bersaglio che sta usando Rimbalzo, Volo o Cadutalibera. Se colpisce un bersaglio sotto l'effetto di Rimbalzo, Volo, Magnetascesa o Telecinesi, l'effetto finisce. Se il bersaglio è di tipo Volante e non ha usato Trespolo in questo turno, o ha l'abilità Levitazione, perde l'immunità agli attacchi di tipo Terra e all'abilità Trappoarena finché resta in campo. Durante l'effetto, Magnetascesa fallisce per il bersaglio e Telecinesi fallisce contro di lui.", // NEEDS QC
		shortDesc: "Atterra i nemici. Neutra contro i Volante.", // NEEDS QC
	},
	thousandwaves: {
		name: "Mille Onde",
		// Official flavor text: "Un’onda strisciante investe i nemici intorno impedendo loro di fuggire."
		desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Colpisce i nemici e impedisce loro di uscire.", // NEEDS QC
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. Se il bersaglio lascia il campo con Staffetta, chi lo sostituisce resta intrappolato. L'effetto finisce se chi la usa lascia il campo.", // NEEDS QC
		},
	},
	thrash: {
		name: "Colpo",
		// Official flavor text: "Assale e attacca il nemico per due o tre turni, ma confonde chi la usa."
		desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio nel primo turno dell'effetto o nel secondo di un effetto di tre turni, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia e chi la usa dorme, viene usata per un solo turno e non lo confonde.", // NEEDS QC
		shortDesc: "Dura 2-3 turni, poi chi la usa si confonde.", // NEEDS QC
		gen6: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario adiacente a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio nel primo turno dell'effetto o nel secondo di un effetto di tre turni, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso alla fine dell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, se dorme all'inizio di un turno, o se l'attacco fallisce contro il bersaglio, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa resta bloccato su questa mossa per due o tre turni e viene confuso alla fine dell'ultimo turno dell'effetto, se non lo è già. Questa mossa bersaglia un avversario a caso a ogni turno. Se chi la usa non può agire, si addormenta, viene congelato, o se l'attacco fallisce contro il bersaglio, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen2: {
			desc: "Che questa mossa riesca o meno, chi la usa resta bloccato su di essa per due o tre turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, anche se è già confuso. Se chi la usa non può agire, l'effetto finisce senza causare confusione. Se questa mossa viene richiamata da Sonnolalia, viene usata per un solo turno e non confonde chi la usa.", // NEEDS QC
		},
		gen1: {
			desc: "Che questa mossa riesca o meno, chi la usa resta bloccato su di essa per tre o quattro turni e viene confuso subito dopo la sua azione nell'ultimo turno dell'effetto, anche se è già confuso. Se chi la usa non può agire, l'effetto finisce senza causare confusione. Durante l'effetto, la precisione di questa mossa viene sovrascritta a ogni turno con la precisione attuale calcolata, compresi i cambi di livello, ma non sotto 1/256 né sopra 255/256.", // NEEDS QC
			shortDesc: "Dura 3-4 turni, poi confonde chi la usa.", // NEEDS QC
		},
	},
	throatchop: {
		name: "Colpo Infernale",
		// Official flavor text: "Chi viene colpito da questa mossa prova un dolore lancinante e non può più usare mosse basate sul suono per due turni."
		desc: "Per 2 turni, il bersaglio non può usare mosse basate sul suono.", // NEEDS QC
		shortDesc: "2 turni: il bersaglio non può usare mosse sonore.", // NEEDS QC
		gen7: {
			desc: "Per 2 turni, il bersaglio non può usare mosse basate sul suono. Le mosse sonore potenziate dalla Forza Z possono comunque essere scelte ed eseguite durante l'effetto.", // NEEDS QC
		},

		cant: "Colpo Infernale impedisce {POKEMON:a} di usare la mossa!",
	},
	thunder: {
		name: "Tuono",
		// Official flavor text: "Il bersaglio è colpito da un fulmine molto violento che può anche paralizzarlo."
		desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questa mossa può colpire un bersaglio che sta usando Rimbalzo, Volo o Cadutalibera, o sotto l'effetto di Cadutalibera. Se il tempo è Acquazzone o Pioggia, questa mossa non verifica la precisione. Se il tempo è Sole accecante o Sole intenso, la precisione è del 50%. Se usata contro un Pokémon con un Superombrello, la precisione resta al 70%.", // NEEDS QC
		shortDesc: "30% di paralizzare. Non fallisce con la pioggia.", // NEEDS QC
		gen7: {
			desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questa mossa può colpire un bersaglio che sta usando Rimbalzo, Volo o Cadutalibera, o sotto l'effetto di Cadutalibera. Se il tempo è Acquazzone o Pioggia, questa mossa non verifica la precisione. Se il tempo è Sole accecante o Sole intenso, la precisione è del 50%.", // NEEDS QC
		},
		gen5: {
			desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questa mossa può colpire un bersaglio che sta usando Rimbalzo, Volo o Cadutalibera, o sotto l'effetto di Cadutalibera. Se il tempo è Pioggia, questa mossa non verifica la precisione. Se il tempo è Sole intenso, la precisione è del 50%.", // NEEDS QC
		},
		gen4: {
			desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questa mossa può colpire un bersaglio che sta usando Rimbalzo o Volo. Se il tempo è Pioggia, questa mossa non verifica la precisione. Se il tempo è Sole intenso, la precisione è del 50%.", // NEEDS QC
		},
		gen2: {
			desc: "Ha il 30% di probabilità di paralizzare il bersaglio. Questa mossa può colpire un bersaglio che sta usando Volo. Se il tempo è Pioggia, questa mossa non verifica la precisione. Se il tempo è Sole intenso, la precisione è del 50%.", // NEEDS QC
		},
		gen1: {
			desc: "Ha il 10% di probabilità di paralizzare il bersaglio.", // NEEDS QC
			shortDesc: "10% di paralizzare il bersaglio.", // NEEDS QC
		},
	},
	thunderbolt: {
		name: "Fulmine",
		// Official flavor text: "Il bersaglio viene colpito da una potente scarica elettrica che può anche paralizzarlo."
		desc: "Ha il 10% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "10% di paralizzare il bersaglio.", // NEEDS QC
	},
	thundercage: {
		name: "Elettrogabbia",
		// Official flavor text: "Il Pokémon attacca il bersaglio imprigionandolo in una gabbia di elettricità, che sprigiona corrente per quattro o cinque turni."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},

		start: "  {SOURCE} intrappola {POKEMON}!",
	},
	thunderclap: {
		name: "Saetta",
		desc: "Fallisce se il bersaglio non ha scelto un attacco fisico, un attacco speciale o Precedenza in questo turno, o se agisce prima di chi la usa.", // NEEDS QC
		shortDesc: "Va per primo. Fallisce se il bersaglio non attacca.", // NEEDS QC
	},
	thunderfang: {
		name: "Fulmindenti",
		// Official flavor text: "Chi la usa morde con denti elettrificati che possono anche paralizzare o far tentennare il bersaglio."
		desc: "Ha il 10% di probabilità di paralizzare il bersaglio e il 10% di farlo tentennare.", // NEEDS QC
		shortDesc: "10% di paralizzare. 10% di far tentennare.", // NEEDS QC
	},
	thunderouskick: {
		name: "Calcio Tonante",
		// Official flavor text: "Il Pokémon sferra calci al bersaglio dopo averlo distratto con movimenti fulminei, riducendone la Difesa."
		desc: "Ha il 100% di probabilità di ridurre la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre la Difesa del bersaglio di 1.", // NEEDS QC
	},
	thunderpunch: {
		name: "Tuonopugno",
		// Official flavor text: "Colpisce il bersaglio con un pugno elettrico che può paralizzarlo."
		desc: "Ha il 10% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "10% di paralizzare il bersaglio.", // NEEDS QC
	},
	thundershock: {
		name: "Tuonoshock",
		// Official flavor text: "Danneggia il bersaglio con una scarica elettrica che può anche paralizzarlo."
		desc: "Ha il 10% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "10% di paralizzare il bersaglio.", // NEEDS QC
	},
	thunderwave: {
		name: "Tuononda",
		// Official flavor text: "Colpisce il bersaglio con una debole scarica elettrica che lo paralizza."
		desc: "Paralizza il bersaglio. Questa mossa non ignora l'immunità di tipo.", // NEEDS QC
		shortDesc: "Paralizza il bersaglio.", // NEEDS QC
	},
	tickle: {
		name: "Solletico",
		// Official flavor text: "Chi la usa solletica il bersaglio e lo fa ridere, riducendo il suo Attacco e la sua Difesa."
		desc: "Riduce l'Attacco e la Difesa del bersaglio di un livello.", // NEEDS QC
		shortDesc: "Riduce l'Attacco e la Difesa del bersaglio di 1.", // NEEDS QC
	},
	tidyup: {
		name: "Pulizie",
		desc: "Aumenta l'Attacco e la Velocità di chi la usa di un livello. Rimuove i sostituti di tutti i Pokémon in campo e pone fine agli effetti di Punte, Levitoroccia, Rete Vischiosa e Fielepunte per entrambe le parti.", // NEEDS QC
		shortDesc: "+1 Att e Vel. Rimuove sostituti e trappole.", // NEEDS QC

		activate: "  Le pulizie sono terminate!",
	},
	topsyturvy: {
		name: "Sottosopra",
		// Official flavor text: "Inverte tutte le modifiche alle statistiche del Pokémon bersaglio."
		desc: "I livelli positivi delle statistiche del bersaglio diventano negativi e viceversa. Fallisce se tutti i livelli del bersaglio sono a 0.", // NEEDS QC
		shortDesc: "Inverte i cambi di statistiche del bersaglio.", // NEEDS QC
	},
	torchsong: {
		name: "Canzone Ardente",
		desc: "Ha il 100% di probabilità di aumentare l'Attacco Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "100% di aumentare l'Att. Sp. di chi la usa di 1.", // NEEDS QC
	},
	torment: {
		name: "Attaccalite",
		// Official flavor text: "Chi la usa tormenta e fa infuriare il bersaglio, impedendogli di usare la stessa mossa due volte di seguito."
		desc: "Il bersaglio non può selezionare la stessa mossa due turni di fila. Questo effetto finisce quando il bersaglio lascia il campo.", // NEEDS QC
		shortDesc: "Il bersaglio non può ripetere la stessa mossa.", // NEEDS QC

		start: "  {POKEMON} subisce Attaccalite!",
		end: "  L’effetto di Attaccalite su {POKEMON} è terminato!",
	},
	toxic: {
		name: "Tossina",
		// Official flavor text: "Iperavvelena il bersaglio con una potente tossina. Il danno peggiora a ogni turno."
		desc: "Iperavvelena il bersaglio. Se un Pokémon di tipo Veleno usa questa mossa, il bersaglio non può evitarla, anche se è a metà di una mossa in due turni.", // NEEDS QC
		shortDesc: "Iperavvelena. Il tipo Veleno non fallisce mai.", // NEEDS QC
		gen5: {
			desc: "Iperavvelena il bersaglio.", // NEEDS QC
			shortDesc: "Iperavvelena il bersaglio.", // NEEDS QC
		},
	},
	toxicspikes: {
		name: "Fielepunte",
		// Official flavor text: "Chi la usa piazza una trappola di punte che avvelenano i nemici che scendono in campo."
		desc: "Piazza una trappola nella parte avversaria che avvelena ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Può essere usata fino a due volte prima di fallire. Gli avversari vengono avvelenati con uno strato e iperavvelenati con due strati. Può essere rimossa dalla parte avversaria se un Pokémon usa Pulizie, se un avversario usa Glitturbine, Rapigiro o Scacciabruma con successo, viene colpito da Scacciabruma, o se un Pokémon di tipo Veleno a terra entra in campo. Salvaguardia impedisce alla squadra avversaria di essere avvelenata all'entrata, ma un sostituto no.", // NEEDS QC
		shortDesc: "Avvelena i nemici che entrano. Max 2 strati.", // NEEDS QC
		gen8: {
			desc: "Piazza una trappola nella parte avversaria che avvelena ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Può essere usata fino a due volte prima di fallire. Gli avversari vengono avvelenati con uno strato e iperavvelenati con due strati. Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro o Scacciabruma con successo, viene colpito da Scacciabruma, o se un Pokémon di tipo Veleno a terra entra in campo. Salvaguardia impedisce alla squadra avversaria di essere avvelenata all'entrata, ma un sostituto no.", // NEEDS QC
		},
		gen5: {
			desc: "Piazza una trappola nella parte avversaria che avvelena ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Può essere usata fino a due volte prima di fallire. Gli avversari vengono avvelenati con uno strato e iperavvelenati con due strati. Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro con successo, viene colpito da Scacciabruma, o se un Pokémon di tipo Veleno a terra entra in campo. Salvaguardia impedisce alla squadra avversaria di essere avvelenata all'entrata, ma un sostituto no.", // NEEDS QC
		},
		gen4: {
			desc: "Piazza una trappola nella parte avversaria che avvelena ogni avversario che entra in campo, a meno che non sia di tipo Volante o abbia l'abilità Levitazione. Può essere usata fino a due volte prima di fallire. Gli avversari vengono avvelenati con uno strato e iperavvelenati con due strati. Può essere rimossa dalla parte avversaria se un avversario usa Rapigiro con successo, viene colpito da Scacciabruma, o se un Pokémon di tipo Veleno a terra entra in campo. Salvaguardia impedisce l'avvelenamento all'entrata, così come entrare in campo con un sostituto.", // NEEDS QC
		},

		start: "  Ai piedi di {TEAM} c’è una trappola di punte velenose!",
		end: "  Ai piedi di {TEAM} non c’è più la trappola di punte velenose!",
	},
	toxicthread: {
		name: "Velenotela",
		// Official flavor text: "Avvelena il bersaglio avvolgendolo con filamenti tossici e ne riduce la Velocità."
		desc: "Riduce la Velocità del bersaglio di un livello e lo avvelena.", // NEEDS QC
		shortDesc: "-1 Velocità del bersaglio e lo avvelena.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	trailblaze: {
		name: "Apripista",
		desc: "Ha il 100% di probabilità di aumentare la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "100% di aumentare la Velocità di chi la usa di 1.", // NEEDS QC
	},
	transform: {
		name: "Trasformazione",
		// Official flavor text: "Chi la usa si trasforma in una copia esatta del bersaglio per sfruttarne le mosse."
		desc: "Chi la usa si trasforma nel bersaglio. Vengono copiati le statistiche attuali, i livelli delle statistiche, i tipi, le mosse, l'abilità, il peso, il sesso e l'aspetto del bersaglio. Il livello e i PS di chi la usa restano gli stessi, e ogni mossa copiata riceve solo 5 PP, con un massimo di 5 PP ciascuna. Chi la usa non può più cambiare forma se ne avrebbe la possibilità. Questa mossa fallisce se colpisce un sostituto, se chi la usa o il bersaglio è già trasformato, o se uno dei due è dietro un'Illusione.", // NEEDS QC
		shortDesc: "Copia statistiche, mosse, tipi e abilità.", // NEEDS QC
		gen4: {
			desc: "Chi la usa si trasforma nel bersaglio. Vengono copiati le statistiche attuali, i livelli delle statistiche, i tipi, le mosse, l'abilità, il peso, gli IV, la specie e l'aspetto del bersaglio. Il livello e i PS di chi la usa restano gli stessi, e ogni mossa copiata riceve solo 5 PP. Questa mossa fallisce se il bersaglio è trasformato.", // NEEDS QC
		},
		gen2: {
			desc: "Chi la usa si trasforma nel bersaglio. Vengono copiati le statistiche attuali, i livelli delle statistiche, i tipi, le mosse, i DV, la specie e l'aspetto del bersaglio. Il livello e i PS di chi la usa restano gli stessi, e ogni mossa copiata riceve solo 5 PP. Questa mossa fallisce se il bersaglio è trasformato.", // NEEDS QC
			shortDesc: "Copia statistiche, mosse, tipi e specie del nemico.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa si trasforma nel bersaglio. Vengono copiati le statistiche attuali, i livelli delle statistiche, i tipi, le mosse, i DV, la specie e l'aspetto del bersaglio. Il livello e i PS di chi la usa restano gli stessi, e ogni mossa copiata riceve solo 5 PP. Questa mossa può colpire un bersaglio che sta usando Fossa o Volo.", // NEEDS QC
		},

		transform: "{POKEMON} assume le sembianze di {SPECIES}!",
	},
	triattack: {
		name: "Tripletta",
		// Official flavor text: "Colpisce il bersaglio con tre raggi di luce che possono paralizzarlo, scottarlo o congelarlo."
		desc: "Ha il 20% di probabilità di scottare, congelare o paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "20% di paralizzare, scottare o congelare.", // NEEDS QC
		gen2: {
			desc: "Questa mossa sceglie a caso scottatura, congelamento o paralisi, e ha il 20% di probabilità di infliggere quello stato al bersaglio. Se il bersaglio è congelato ed è stata scelta la scottatura, si scongela.", // NEEDS QC
		},
		gen1: {
			desc: "Nessun effetto aggiuntivo.", // NEEDS QC
			shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		},
	},
	trick: {
		name: "Raggiro",
		// Official flavor text: "Chi la usa coglie il bersaglio in contropiede e lo obbliga a cambiare il suo strumento con il proprio."
		desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, o se chi la usa prova a dare o prendere Gemma blu, Gemma rossa, Adamasferoide, Splendisferoide, Grigiosferoide, una lastra, un modulo, una ROM, Spada rovinata, Scudo rovinato, una Capsula energetica o una maschera a o da Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, un Pokémon Paradosso o Ogerpon, rispettivamente. In questo caso, i Pokémon Paradosso includono tutte le specie con le abilità Paleoattivazione e Carica Quark, tranne Vampeaguzze, Furiatonante, Massoferreo e Capoferreo. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		shortDesc: "Scambia il suo strumento con quello del bersaglio.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, o se chi la usa prova a dare o prendere Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo, una ROM, Spada rovinata o Scudo rovinato a o da Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian o Zamazenta, rispettivamente. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, se uno dei due ha un Cristallo Z, se chi la usa prova a dare o prendere una megapietra a o dalla specie che può megaevolversi con essa, o se prova a dare o prendere Gemma blu, Gemma rossa, Grigiosfera, una lastra, un modulo o una ROM a o da Kyogre, Groudon, Giratina, Arceus, Genesect o Silvally, rispettivamente. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, se chi la usa prova a dare o prendere una megapietra a o dalla specie che può megaevolversi con essa, o se prova a dare o prendere Gemma blu, Gemma rossa, Grigiosfera, una lastra o un modulo a o da Kyogre, Groudon, Giratina, Arceus o Genesect, rispettivamente. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, se uno dei due ha un Messaggio, o se chi la usa prova a dare o prendere Grigiosfera, una lastra o un modulo a o da Giratina, Arceus o Genesect, rispettivamente. Il bersaglio è immune a questa mossa se ha l'abilità Antifurto.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, se uno dei due ha un Messaggio o un Grigiosfera, se uno dei due ha l'abilità Multitipo, se uno dei due è sotto l'effetto di Privazione, o se il bersaglio ha l'abilità Antifurto.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa scambia il proprio strumento con quello del bersaglio. Fallisce se né chi la usa né il bersaglio hanno strumenti, se uno dei due ha un Messaggio, se uno dei due è sotto l'effetto di Privazione, o se il bersaglio ha l'abilità Antifurto.", // NEEDS QC
		},

		activate: "  {POKEMON} scambia il suo strumento con quello del bersaglio!",
	},
	trickortreat: {
		name: "Halloween",
		// Official flavor text: "Il bersaglio viene invitato a festeggiare Halloween e aggiunge così al proprio tipo anche il tipo Spettro."
		desc: "Aggiunge il tipo Spettro al bersaglio, che quindi ha due o tre tipi. Fallisce se il bersaglio è già di tipo Spettro. Se Boscomalocchio aggiunge un tipo al bersaglio, sostituisce quello aggiunto da questa mossa e viceversa.", // NEEDS QC
		shortDesc: "Aggiunge il tipo Spettro al bersaglio.", // NEEDS QC
	},
	trickroom: {
		name: "Distortozona",
		// Official flavor text: "Chi la usa crea una dimensione in cui i Pokémon più lenti agiscono per primi per cinque turni."
		desc: "Per 5 turni, la Velocità di ogni Pokémon viene ricalcolata per determinare l'ordine del turno. Durante l'effetto, la Velocità di ogni Pokémon è considerata pari a (10000 - la sua Velocità normale), e se questo valore supera 8191, gli viene sottratto 8192. Se questa mossa viene usata durante l'effetto, l'effetto finisce.", // NEEDS QC
		shortDesc: "Va per ultima. 5 turni: ordine del turno invertito.", // NEEDS QC
		gen4: {
			desc: "Per 5 turni, tutti i Pokémon in campo con Velocità più bassa agiscono prima di quelli con Velocità più alta, all'interno del loro livello di priorità. Se questa mossa viene usata durante l'effetto, l'effetto finisce.", // NEEDS QC
		},
	},
	triplearrows: {
		name: "Triplodardo",
		desc: "Ha il 50% di probabilità di ridurre la Difesa del bersaglio di un livello, il 30% di farlo tentennare e una probabilità più alta di brutto colpo.", // NEEDS QC
		shortDesc: "Crit alto. 50% -1 Difesa, 30% tentennamento.", // NEEDS QC
	},
	tripleaxel: {
		name: "Triplo Axel",
		// Official flavor text: "Chi la usa sferra fino a tre calci consecutivi la cui potenza aumenta a ogni colpo."
		desc: "Colpisce tre volte. La potenza sale a 40 al secondo colpo e a 60 al terzo. Questa mossa verifica la precisione a ogni colpo, e l'attacco finisce se il bersaglio ne evita uno. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre tre volte.", // NEEDS QC
		shortDesc: "Colpisce 3 volte. Ogni colpo può fallire, potenza sale.", // NEEDS QC
	},
	tripledive: {
		name: "Triplo Tuffo",
		desc: "Colpisce tre volte.", // NEEDS QC
		shortDesc: "Colpisce 3 volte.", // NEEDS QC
	},
	triplekick: {
		name: "Triplocalcio",
		// Official flavor text: "Chi la usa sferra fino a tre calci consecutivi la cui potenza aumenta a ogni colpo."
		desc: "Colpisce tre volte. La potenza sale a 20 al secondo colpo e a 30 al terzo. Questa mossa verifica la precisione a ogni colpo, e l'attacco finisce se il bersaglio ne evita uno. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre tre volte.", // NEEDS QC
		shortDesc: "Colpisce 3 volte. Ogni colpo può fallire, potenza sale.", // NEEDS QC
		gen4: {
			desc: "Colpisce tre volte. La potenza sale a 20 al secondo colpo e a 30 al terzo. Questa mossa verifica la precisione a ogni colpo, e l'attacco finisce se il bersaglio ne evita uno. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO, indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce tre volte. La potenza sale a 20 al secondo colpo e a 30 al terzo. Questa mossa verifica la precisione a ogni colpo, e l'attacco finisce se il bersaglio ne evita uno. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti.", // NEEDS QC
		},
		gen2: {
			desc: "Colpisce da una a tre volte, a caso. La potenza sale a 20 al secondo colpo e a 30 al terzo.", // NEEDS QC
			shortDesc: "Colpisce 1-3 volte. La potenza sale a ogni colpo.", // NEEDS QC
		},
	},
	tropkick: {
		name: "Tropicalcio",
		// Official flavor text: "Chi la usa colpisce il bersaglio con un potente calcio sfruttando una tecnica originaria dei paesi tropicali e ne riduce l’Attacco."
		desc: "Ha il 100% di probabilità di ridurre l'Attacco del bersaglio di un livello.", // NEEDS QC
		shortDesc: "100% di ridurre l'Attacco del bersaglio di 1.", // NEEDS QC
	},
	trumpcard: {
		name: "Asso",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza dipende dai PP restanti dopo la normale riduzione di PP e l'effetto dell'abilità Pressione: 200 di potenza con 0 PP, 80 con 1 PP, 60 con 2 PP, 50 con 3 PP e 40 con 4 o più PP.", // NEEDS QC
		shortDesc: "Più potente con meno PP rimasti.", // NEEDS QC
	},
	twinbeam: {
		name: "Doppioraggio",
		desc: "Colpisce due volte. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		shortDesc: "Colpisce 2 volte in un turno.", // NEEDS QC
	},
	twineedle: {
		name: "Doppio Ago",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Colpisce due volte, e ogni colpo ha il 20% di probabilità di avvelenare il bersaglio. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		shortDesc: "Colpisce 2 volte. Ognuna: 20% di avvelenare.", // NEEDS QC
		gen4: {
			desc: "Colpisce due volte, e ogni colpo ha il 20% di probabilità di avvelenare il bersaglio. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo. Se il bersaglio ha una Focalnastro e aveva tutti i PS all'inizio di questa mossa, non va KO, indipendentemente dal numero di colpi.", // NEEDS QC
		},
		gen3: {
			desc: "Colpisce due volte, e ogni colpo ha il 20% di probabilità di avvelenare il bersaglio. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo.", // NEEDS QC
		},
		gen2: {
			desc: "Colpisce due volte, e il secondo colpo ha il 20% di probabilità di avvelenare il bersaglio. Se il primo colpo rompe il sostituto del bersaglio, questo subisce i danni del secondo colpo, ma non può esserne avvelenato.", // NEEDS QC
			shortDesc: "Colpisce 2 volte. Il secondo avvelena al 20%.", // NEEDS QC
		},
		gen1: {
			desc: "Colpisce due volte, e il secondo colpo ha il 20% di probabilità di avvelenare il bersaglio. Se il primo colpo rompe il sostituto del bersaglio, la mossa finisce.", // NEEDS QC
		},
	},
	twinkletackle: {
		name: "Astroimpatto Fatato",
		shortDesc: "Potenza in base ai Poteri Z della mossa di base.", // NEEDS QC
	},
	twister: {
		name: "Tornado",
		// Official flavor text: "Un potente tornado si abbatte sui nemici nei paraggi. Può anche farli tentennare."
		desc: "Ha il 20% di probabilità di far tentennare il bersaglio. La potenza raddoppia se il bersaglio sta usando Rimbalzo, Volo o Cadutalibera, o è sotto l'effetto di Cadutalibera.", // NEEDS QC
		shortDesc: "20% di far tentennare il bersaglio.", // NEEDS QC
		gen4: {
			desc: "Ha il 20% di probabilità di far tentennare il bersaglio. La potenza raddoppia se il bersaglio sta usando Rimbalzo o Volo.", // NEEDS QC
		},
		gen2: {
			desc: "Ha il 20% di probabilità di far tentennare il bersaglio. La potenza raddoppia se il bersaglio sta usando Volo.", // NEEDS QC
			shortDesc: "20% di far tentennare il bersaglio.", // NEEDS QC
		},
	},
	upperhand: {
		name: "Colpo di Mano",
		desc: "Ha il 100% di probabilità di far tentennare il bersaglio. Fallisce se il bersaglio non ha scelto in questo turno un attacco fisico o speciale con priorità modificata superiore a 0, o se agisce prima di chi la usa.", // NEEDS QC
		shortDesc: "100% tentennamento. Fallisce senza mossa prioritaria.", // NEEDS QC
	},
	uproar: {
		name: "Baraonda",
		// Official flavor text: "Chi la usa attacca per tre turni con un frastuono che non fa dormire nessuno."
		desc: "Chi la usa resta bloccato su questa mossa per tre turni. Questa mossa bersaglia un avversario a caso a ogni turno. Nel primo dei tre turni, tutti i Pokémon in campo addormentati si svegliano. Durante i tre turni, nessun Pokémon in campo può addormentarsi in alcun modo, e i Pokémon entrati durante l'effetto non si svegliano. Se chi la usa non può agire o l'attacco fallisce contro il bersaglio in uno dei turni, l'effetto finisce.", // NEEDS QC
		shortDesc: "Dura 3 turni. Nessuno può addormentarsi.", // NEEDS QC
		gen6: {
			desc: "Chi la usa resta bloccato su questa mossa per tre turni. Questa mossa bersaglia un avversario adiacente a caso a ogni turno. Nel primo dei tre turni, tutti i Pokémon in campo addormentati si svegliano. Durante i tre turni, nessun Pokémon in campo può addormentarsi in alcun modo, e i Pokémon entrati durante l'effetto non si svegliano. Se chi la usa non può agire o l'attacco fallisce contro il bersaglio in uno dei turni, l'effetto finisce.", // NEEDS QC
		},
		gen4: {
			desc: "Chi la usa resta bloccato su questa mossa da tre a sei turni. Questa mossa bersaglia un avversario a caso a ogni turno. Durante l'effetto, nessun Pokémon in campo può addormentarsi in alcun modo, e i Pokémon già addormentati si svegliano all'inizio del loro turno o alla fine di ogni turno, compreso l'ultimo. Se chi la usa non può agire o l'attacco fallisce contro il bersaglio in uno dei turni, l'effetto finisce.", // NEEDS QC
			shortDesc: "Dura 3-6 turni. Nessuno può addormentarsi.", // NEEDS QC
		},
		gen3: {
			desc: "Chi la usa resta bloccato su questa mossa da due a cinque turni. Questa mossa bersaglia un avversario a caso a ogni turno. Durante l'effetto, nessun Pokémon in campo può addormentarsi in alcun modo, e i Pokémon già addormentati si svegliano all'inizio del loro turno o alla fine di ogni turno, compreso l'ultimo. Se chi la usa non può agire o l'attacco fallisce contro il bersaglio in uno dei turni, l'effetto finisce.", // NEEDS QC
			shortDesc: "Dura 2-5 turni. Nessuno può addormentarsi.", // NEEDS QC
		},

		start: "  {POKEMON} scatena una baraonda!",
		end: "  {POKEMON} si calma.",
		upkeep: "  {POKEMON} continua con la baraonda!",
		block: "  La baraonda impedisce che {POKEMON} si addormenti!",
		blockSelf: "  {POKEMON} non riesce a dormire a causa della baraonda!",
	},
	uturn: {
		name: "Retromarcia",
		// Official flavor text: "Chi usa questa mossa fa marcia indietro per farsi sostituire dopo aver sferrato l’attacco."
		desc: "Se questa mossa va a segno e chi la usa non è KO, viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se non ci sono altri membri non KO, o se il bersaglio è stato sostituito con un Pulsantefuga o tramite le abilità Passoindietro o Fuggifuggi.", // NEEDS QC
		shortDesc: "Chi la usa esce dopo aver danneggiato il bersaglio.", // NEEDS QC
		gen6: {
			desc: "Se questa mossa va a segno e chi la usa non è KO, viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se non ci sono altri membri non KO, o se il bersaglio è stato sostituito con un Pulsantefuga.", // NEEDS QC
		},
		gen4: {
			desc: "Se questa mossa va a segno e chi la usa non è KO, viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se non ci sono altri membri della squadra non KO.", // NEEDS QC
		},

		switchOut: "{POKEMON} torna d{TRAINER:a:definite}!",
	},
	vacuumwave: {
		name: "Vuotonda",
		// Official flavor text: "Chi la usa rotea i pugni per lanciare un’onda di vuoto assoluto verso il bersaglio. Questa mossa ha priorità alta."
		desc: "Nessun effetto aggiuntivo.", // NEEDS QC
		shortDesc: "Di solito agisce per primo (priorità +1).", // NEEDS QC
	},
	vcreate: {
		name: "Generatore V",
		// Official flavor text: "Chi la usa carica emettendo fiamme ardenti dalla fronte, a costo di una riduzione di Difesa, Difesa Speciale e Velocità."
		desc: "Riduce la Velocità, la Difesa e la Difesa Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "-1 Dif, Dif. Sp. e Vel. di chi la usa.", // NEEDS QC
	},
	veeveevolley: {
		name: "Eeveempatto",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza è pari a (felicità di chi la usa × 2/5), arrotondato per difetto, ma non meno di 1.", // NEEDS QC
		shortDesc: "Felicità max: 102 di potenza. Non fallisce mai.", // NEEDS QC
	},
	venomdrench: {
		name: "Velenotrappola",
		// Official flavor text: "Emette un liquido particolare che riduce l’Attacco, l’Attacco Speciale e la Velocità dei nemici avvelenati intorno a chi la usa."
		desc: "Riduce l'Attacco, l'Attacco Speciale e la Velocità del bersaglio di un livello se è avvelenato. Fallisce se il bersaglio non è avvelenato.", // NEEDS QC
		shortDesc: "-1 Att, Att. Sp. e Vel. ai nemici avvelenati.", // NEEDS QC
	},
	venoshock: {
		name: "Velenoshock",
		// Official flavor text: "Lancia uno speciale liquido tossico sul bersaglio. Se questi è avvelenato, il danno provocato raddoppia."
		desc: "La potenza raddoppia se il bersaglio è avvelenato.", // NEEDS QC
		shortDesc: "Potenza doppia contro bersagli avvelenati.", // NEEDS QC
	},
	victorydance: {
		name: "Danzavittoria",
		desc: "Aumenta l'Attacco, la Difesa e la Velocità di chi la usa di un livello.", // NEEDS QC
		shortDesc: "+1 Att, Dif e Vel. di chi la usa.", // NEEDS QC
	},
	vinewhip: {
		name: "Frustata",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	visegrip: {
		name: "Presa",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	vitalthrow: {
		name: "Vitaltiro",
		// Official flavor text: "Chi la usa attacca per ultimo, ma il colpo è sempre infallibile."
		desc: "Questa mossa non verifica la precisione.", // NEEDS QC
		shortDesc: "Non verifica la precisione. Agisce per ultimo.", // NEEDS QC
	},
	voltswitch: {
		name: "Invertivolt",
		// Official flavor text: "Chi usa questa mossa si tira indietro per farsi sostituire dopo aver sferrato l’attacco."
		desc: "Se questa mossa va a segno e chi la usa non è KO, viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se non ci sono altri membri non KO, o se il bersaglio è stato sostituito con un Pulsantefuga o tramite le abilità Passoindietro o Fuggifuggi.", // NEEDS QC
		shortDesc: "Chi la usa esce dopo aver danneggiato il bersaglio.", // NEEDS QC
		gen6: {
			desc: "Se questa mossa va a segno e chi la usa non è KO, viene sostituito, anche se intrappolato, immediatamente da un membro della squadra scelto. Chi la usa non viene sostituito se non ci sono altri membri non KO, o se il bersaglio è stato sostituito con un Pulsantefuga.", // NEEDS QC
		},

		switchOut: "#uturn",
	},
	volttackle: {
		name: "Locomovolt",
		// Official flavor text: "Chi la usa si carica di elettricità e poi attacca. Può paralizzare il bersaglio. Il contraccolpo causa seri danni."
		desc: "Ha il 10% di probabilità di paralizzare il bersaglio. Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari al 33% dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo del 33%. 10% di paralizzare.", // NEEDS QC
		gen4: {
			desc: "Ha il 10% di probabilità di paralizzare il bersaglio. Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a 1/3 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
			shortDesc: "1/3 di contraccolpo. 10% di paralizzare.", // NEEDS QC
		},
		gen3: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/3 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
			shortDesc: "Ha 1/3 di contraccolpo.", // NEEDS QC
		},
	},
	wakeupslap: {
		name: "Svegliopacca",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza raddoppia se il bersaglio dorme. Se chi la usa non è KO, il bersaglio si sveglia.", // NEEDS QC
		shortDesc: "x2 contro chi dorme, ma lo sveglia.", // NEEDS QC
		gen4: {
			desc: "La potenza raddoppia se il bersaglio dorme. Se questa mossa va a segno, il bersaglio si sveglia.", // NEEDS QC
		},
	},
	waterfall: {
		name: "Cascata",
		// Official flavor text: "Carica il bersaglio a grande velocità e può farlo tentennare."
		desc: "Ha il 20% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "20% di far tentennare il bersaglio.", // NEEDS QC
		gen3: {
			desc: "Nessun effetto aggiuntivo.", // NEEDS QC
			shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
		},
	},
	watergun: {
		name: "Pistolacqua",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	waterpledge: {
		name: "Acquapatto",
		// Official flavor text: "Attacca il bersaglio con una colonna d’acqua. Se usata con Fiammapatto, gli effetti aumentano e appare un arcobaleno."
		desc: "Se un alleato di chi la usa ha scelto di usare Fiammapatto o Erbapatto in questo turno e non ha ancora agito, agisce subito dopo chi la usa e la mossa di chi la usa non fa nulla. Combinata con Fiammapatto, l'alleato usa Acquapatto con 150 di potenza e un arcobaleno appare nella parte di chi la usa per 4 turni, raddoppiando le probabilità di effetto secondario, cumulandosi con l'abilità Leggiadro, tranne che per gli effetti che fanno tentennare, la cui probabilità può raddoppiare solo una volta. Combinata con Erbapatto, l'alleato usa Erbapatto con 150 di potenza e una palude appare nella parte del bersaglio per 4 turni, riducendo a 1/4 la Velocità di ogni Pokémon di quella parte. Usata come mossa combinata, ottiene lo STAB indipendentemente dal tipo di chi la usa. Questa mossa non consuma la Bijouacqua e non può essere reindirizzata dall'abilità Acquascolo.", // NEEDS QC
		shortDesc: "Da combinare con gli altri Auspici per più effetti.", // NEEDS QC

		activate: "  {POKEMON} attende {TARGET}...",
		start: "  Appare un arcobaleno su {TEAM}!",
		end: "  L’arcobaleno su {TEAM} scompare!",
	},
	waterpulse: {
		name: "Idropulsar",
		// Official flavor text: "Il bersaglio viene colpito da un getto d’acqua potentissimo che può anche confonderlo."
		desc: "Ha il 20% di probabilità di confondere il bersaglio.", // NEEDS QC
		shortDesc: "20% di confondere il bersaglio.", // NEEDS QC
	},
	watershuriken: {
		name: "Acqualame",
		// Official flavor text: "Chi la usa attacca il bersaglio con degli shuriken di muco da due a cinque volte di fila. Questa mossa ha priorità alta."
		desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte. Se chi la usa è un Greninja Forma Ash con l'abilità Morfosintonia, questa mossa ha 20 di potenza e colpisce sempre tre volte. Se chi la usa ha un Dado truccato, questa mossa colpisce 4 o 5 volte.", // NEEDS QC
		shortDesc: "Di solito va per prima. Colpisce da 2 a 5 volte.", // NEEDS QC
		gen8: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
		gen6: {
			desc: "Colpisce da due a cinque volte. Ha il 35% di probabilità di colpire due o tre volte e il 15% di colpire quattro o cinque volte. Se uno dei colpi rompe il sostituto del bersaglio, questo subisce i danni dei colpi restanti. Se chi la usa ha l'abilità Abillegame, questa mossa colpisce sempre cinque volte.", // NEEDS QC
		},
	},
	watersport: {
		name: "Docciascudo",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Per 5 turni, tutti gli attacchi di tipo Fuoco dei Pokémon in campo hanno la potenza moltiplicata per 0,33. Fallisce se questo effetto è già attivo.", // NEEDS QC
		shortDesc: "5 turni: gli attacchi Fuoco fanno 1/3 dei danni.", // NEEDS QC
		gen5: {
			desc: "Finché chi la usa è in campo, tutti gli attacchi di tipo Fuoco dei Pokémon in campo hanno la potenza moltiplicata per 0,33. Fallisce se questo effetto è già attivo per un Pokémon.", // NEEDS QC
			shortDesc: "Riduce le mosse Fuoco a 1/3 della potenza.", // NEEDS QC
		},
		gen4: {
			desc: "Finché chi la usa è in campo, tutti gli attacchi di tipo Fuoco dei Pokémon in campo hanno la potenza dimezzata. Fallisce se questo effetto è già attivo per chi la usa. Staffetta può trasferire questo effetto a un alleato.", // NEEDS QC
			shortDesc: "Riduce le mosse Fuoco a 1/2 della potenza.", // NEEDS QC
		},
	},
	waterspout: {
		name: "Zampillo",
		// Official flavor text: "Lancia un getto d’acqua contro il nemico che ha davanti e quelli adiacenti. La potenza è proporzionale al numero di PS di chi la usa."
		desc: "La potenza è pari a (PS attuali di chi la usa × 150 / PS max di chi la usa), arrotondato per difetto, ma non meno di 1.", // NEEDS QC
		shortDesc: "Meno PS = meno potente. Colpisce i nemici.", // NEEDS QC
	},
	wavecrash: {
		name: "Ondaschianto",
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari al 33% dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo del 33% dei danni.", // NEEDS QC
	},
	weatherball: {
		name: "Palla Clima",
		// Official flavor text: "Mossa d’attacco il cui tipo e la cui potenza variano in base alle condizioni atmosferiche."
		desc: "La potenza raddoppia se un tempo atmosferico diverso da Vento misterioso è attivo, e il tipo di questa mossa cambia di conseguenza: tipo Ghiaccio con la neve, tipo Acqua con Acquazzone o Pioggia, tipo Roccia con la tempesta di sabbia e tipo Fuoco con Sole accecante o Sole intenso. Se chi la usa ha un Superombrello e usa questa mossa con Acquazzone, Pioggia, Sole accecante o Sole intenso, resta di tipo Normale e la potenza non raddoppia.", // NEEDS QC
		shortDesc: "Con un tempo attivo: potenza x2 e tipo variabile.", // NEEDS QC
		gen8: {
			desc: "La potenza raddoppia se un tempo atmosferico diverso da Vento misterioso è attivo, e il tipo di questa mossa cambia di conseguenza: tipo Ghiaccio con Grandine, tipo Acqua con Acquazzone o Pioggia, tipo Roccia con Terrempesta e tipo Fuoco con Sole accecante o Sole intenso. Se chi la usa ha un Superombrello e usa questa mossa con Acquazzone, Pioggia, Sole accecante o Sole intenso, resta di tipo Normale e la potenza non raddoppia.", // NEEDS QC
		},
		gen5: {
			desc: "La potenza raddoppia se un tempo atmosferico è attivo, e il tipo di questa mossa cambia di conseguenza: tipo Ghiaccio con Grandine, tipo Acqua con Pioggia, tipo Roccia con Terrempesta e tipo Fuoco con Sole intenso.", // NEEDS QC
		},
		gen3: {
			desc: "I danni raddoppiano se un tempo atmosferico è attivo, e il tipo di questa mossa cambia di conseguenza: tipo Ghiaccio con Grandine, tipo Acqua con Pioggia, tipo Roccia con Terrempesta e tipo Fuoco con Sole intenso.", // NEEDS QC
			shortDesc: "Danni doppi e tipo variabile con il tempo.", // NEEDS QC
		},

		move: "A causa delle condizioni atmosferiche, la mossa Carica Travolgente diventa {MOVE}!",
	},
	whirlpool: {
		name: "Mulinello",
		// Official flavor text: "Intrappola il bersaglio in un turbine d’acqua per quattro o cinque turni infliggendo danni a ogni turno."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max (1/8 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni (sempre cinque se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
			shortDesc: "Intrappola e ferisce il bersaglio per 2-5 turni.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni. Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se usa Staffetta. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},

		start: "  {POKEMON} è intrappolato nel mulinello!",
	},
	whirlwind: {
		name: "Turbine",
		// Official flavor text: "Il bersaglio lascia il campo e viene sostituito. Mette fine alle lotte contro singoli Pokémon selvatici."
		desc: "Il bersaglio è costretto a lasciare il campo e viene sostituito da un alleato non KO scelto a caso. Fallisce se il bersaglio è l'ultimo Pokémon non KO della squadra, se ha usato Radicamento o se ha l'abilità Ventose.", // NEEDS QC
		shortDesc: "Il bersaglio viene sostituito da un alleato a caso.", // NEEDS QC
		gen4: {
			desc: "Il bersaglio è costretto a lasciare il campo e viene sostituito da un alleato non KO scelto a caso. Fallisce se il bersaglio è l'ultimo Pokémon non KO della squadra, se ha usato Radicamento o se ha l'abilità Ventose, o se il livello di chi la usa è inferiore a quello del bersaglio e X × (livello di chi la usa + livello del bersaglio) / 256 + 1 è minore o uguale a (livello del bersaglio / 4), arrotondato per difetto, dove X è un numero casuale tra 0 e 255.", // NEEDS QC
		},
		gen2: {
			desc: "Il bersaglio è costretto a lasciare il campo e viene sostituito da un alleato non KO scelto a caso. Fallisce se il bersaglio è l'ultimo Pokémon non KO della squadra, o se chi la usa agisce prima del bersaglio.", // NEEDS QC
		},
		gen1: {
			desc: "Nessuna utilità in lotta.", // NEEDS QC
			shortDesc: "Nessuna utilità in lotta.", // NEEDS QC
		},
	},
	wickedblow: {
		name: "Pugnotenebra",
		// Official flavor text: "Il Pokémon sferra un singolo colpo potentissimo, massima espressione dello stile di tipo Buio. Brutto colpo assicurato."
		desc: "Questa mossa è sempre un brutto colpo, a meno che il bersaglio non sia sotto l'effetto di Fortuncanto o abbia l'abilità Lottascudo o Guscioscudo.", // NEEDS QC
		shortDesc: "È sempre un brutto colpo.", // NEEDS QC
	},
	wickedtorque: {
		name: "Turbotenebra",
		desc: "Ha il 10% di probabilità di addormentare il bersaglio.", // NEEDS QC
		shortDesc: "10% di addormentare il bersaglio.", // NEEDS QC
	},
	wideguard: {
		name: "Bodyguard",
		// Official flavor text: "Chi la usa protegge sé e gli alleati da colpi ad ampio raggio per un turno."
		desc: "Chi la usa e la sua squadra sono protetti dalle mosse degli altri Pokémon, alleati compresi, che bersagliano tutti i nemici adiacenti o tutti i Pokémon adiacenti in questo turno. Questa mossa modifica lo stesso contatore di 1 probabilità su X delle altre mosse di protezione, dove X parte da 1 e triplica a ogni uso riuscito, ma non usa quella probabilità per determinare il fallimento. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Egida Ignea, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Telatrappola, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		shortDesc: "Protegge la squadra dalle mosse multibersaglio.", // NEEDS QC
		gen8: {
			desc: "Chi la usa e la sua squadra sono protetti dalle mosse degli altri Pokémon, alleati compresi, che bersagliano tutti i nemici adiacenti o tutti i Pokémon adiacenti in questo turno. Questa mossa modifica lo stesso contatore di 1 probabilità su X delle altre mosse di protezione, dove X parte da 1 e triplica a ogni uso riuscito, ma non usa quella probabilità per determinare il fallimento. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Dynabarriera, Sbarramento, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		},
		gen7: {
			desc: "Chi la usa e la sua squadra sono protetti dalle mosse degli altri Pokémon, alleati compresi, che bersagliano tutti i nemici adiacenti o tutti i Pokémon adiacenti in questo turno. Questa mossa modifica lo stesso contatore di 1 probabilità su X delle altre mosse di protezione, dove X parte da 1 e triplica a ogni uso riuscito, ma non usa quella probabilità per determinare il fallimento. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Fortino, Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		},
		gen6: {
			desc: "Chi la usa e la sua squadra sono protetti dalle mosse che infliggono danni degli altri Pokémon, alleati compresi, che bersagliano tutti i nemici adiacenti o tutti i Pokémon adiacenti in questo turno. Questa mossa modifica lo stesso contatore di 1 probabilità su X delle altre mosse di protezione, dove X parte da 1 e triplica a ogni uso riuscito, ma non usa quella probabilità per determinare il fallimento. X torna a 1 se questa mossa fallisce, se l'ultima mossa usata non è Individua, Resistenza, Scudo Reale, Protezione, Anticipo, Agodifesa o Bodyguard, o se era una di queste mosse e la protezione è stata rotta. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
			shortDesc: "Protegge la squadra dagli attacchi multipli.", // NEEDS QC
		},
		gen5: {
			desc: "Chi la usa e la sua squadra sono protetti dalle mosse che infliggono danni degli altri Pokémon, alleati compresi, che bersagliano tutti i nemici adiacenti o tutti i Pokémon adiacenti in questo turno. Questa mossa ha 1 probabilità su X di riuscire, dove X parte da 1 e raddoppia a ogni uso riuscito. X torna a 1 se questa mossa fallisce o se l'ultima mossa usata non è Individua, Resistenza, Protezione, Anticipo o Bodyguard. Se X è 256 o più, questa mossa ha 1 probabilità su 2^32 di riuscire. Fallisce se chi la usa agisce per ultimo in questo turno o se questo effetto è già attivo nella sua parte.", // NEEDS QC
		},

		start: "  {TEAM} è protetto da Bodyguard!",
		block: "  {POKEMON} è protetto da Bodyguard!",
	},
	wildboltstorm: {
		name: "Tempesta Tonante",
		desc: "Ha il 20% di probabilità di paralizzare il bersaglio. Se il tempo è Acquazzone o Pioggia, questa mossa non verifica la precisione. Se usata contro un Pokémon con un Superombrello, la precisione resta all'80%.", // NEEDS QC
		shortDesc: "20% di paralizzare. Non fallisce con la pioggia.", // NEEDS QC
	},
	wildcharge: {
		name: "Sprizzalampo",
		// Official flavor text: "Chi la usa si carica di elettricità per poi scagliarsi sul bersaglio, ma subisce dei danni per il contraccolpo."
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari a 1/4 dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo di 1/4 dei danni.", // NEEDS QC
	},
	willowisp: {
		name: "Fuocofatuo",
		// Official flavor text: "Fiamme sinistre e misteriose causano una scottatura al bersaglio."
		desc: "Scotta il bersaglio.", // NEEDS QC
		shortDesc: "Scotta il bersaglio.", // NEEDS QC
	},
	wingattack: {
		name: "Attacco d’Ala",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	wish: {
		name: "Desiderio",
		// Official flavor text: "Quando un Pokémon la usa, al turno successivo la metà dei suoi PS massimi viene recuperata da lui stesso o dal Pokémon che lo sostituisce."
		desc: "Alla fine del turno successivo, il Pokémon nella posizione di chi la usa recupera metà dei PS max di chi la usa, arrotondato per difetto. Fallisce se questo effetto è già attivo per la posizione di chi la usa.", // NEEDS QC
		shortDesc: "Al turno dopo recupera metà dei suoi PS max.", // NEEDS QC
		gen4: {
			desc: "Alla fine del turno successivo, il Pokémon nella posizione di chi la usa recupera metà dei propri PS max, arrotondato per difetto. Fallisce se questo effetto è già attivo per la posizione di chi la usa.", // NEEDS QC
			shortDesc: "Al turno dopo cura il 50% dei PS max di chi riceve.", // NEEDS QC
		},

		heal: "  Il desiderio di {NICKNAME} si avvera!",
	},
	withdraw: {
		name: "Ritirata",
		// Official flavor text: "Il corpo si ritira nel suo duro guscio per aumentare la Difesa."
		desc: "Aumenta la Difesa di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta la Difesa di chi la usa di 1.", // NEEDS QC
	},
	wonderroom: {
		name: "Mirabilzona",
		// Official flavor text: "Chi la usa crea una dimensione in cui Difesa e Difesa Speciale di tutti i Pokémon vengono scambiate per cinque turni."
		desc: "Per 5 turni, tutti i Pokémon in campo hanno la Difesa e la Difesa Speciale scambiate. I livelli delle statistiche non sono influenzati. Se questa mossa viene usata durante l'effetto, l'effetto finisce.", // NEEDS QC
		shortDesc: "5 turni: Difesa e Dif. Sp. sono scambiate.", // NEEDS QC
	},
	woodhammer: {
		name: "Mazzuolegno",
		// Official flavor text: "Chi la usa si lancia con tutto il corpo contro il bersaglio, ma subisce anche considerevoli danni."
		desc: "Se il bersaglio ha perso PS, chi la usa subisce un contraccolpo pari al 33% dei PS persi dal bersaglio, arrotondato per eccesso da 0,5, ma non meno di 1 PS.", // NEEDS QC
		shortDesc: "Contraccolpo del 33% dei danni.", // NEEDS QC
		gen4: {
			desc: "Se il bersaglio ha perso PS, chi la usa subisce danni da contraccolpo pari a 1/3 dei PS persi dal bersaglio, arrotondato per difetto, ma non meno di 1 PS.", // NEEDS QC
			shortDesc: "Ha 1/3 di contraccolpo.", // NEEDS QC
		},
	},
	workup: {
		name: "Cuordileone",
		// Official flavor text: "Chi la usa si tira su di morale, aumentando il proprio Attacco e l’Attacco Speciale."
		desc: "Aumenta l'Attacco e l'Attacco Speciale di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Aumenta l'Attacco e l'Att. Sp. di chi la usa di 1.", // NEEDS QC
	},
	worryseed: {
		name: "Affannoseme",
		// Official flavor text: "Un seme che causa ansia viene piantato sul bersaglio. Ne muta l’abilità in Insonnia e ne previene o rimuove il sonno."
		desc: "L'abilità del bersaglio diventa Insonnia. Fallisce se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Insonnia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Teramorfosi, Pigrone, Stato Zen o Supercambio.", // NEEDS QC
		shortDesc: "L'abilità del bersaglio diventa Insonnia.", // NEEDS QC
		gen8: {
			desc: "L'abilità del bersaglio diventa Insonnia. Fallisce se l'abilità del bersaglio è Sintonia Equina, Morfosintonia, Sonno Assoluto, Fantasmanto, Inghiottimissile, Gelofaccia, Insonnia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Pigrone o Stato Zen.", // NEEDS QC
		},
		gen7: {
			desc: "L'abilità del bersaglio diventa Insonnia. Fallisce se l'abilità del bersaglio è Morfosintonia, Sonno Assoluto, Fantasmanto, Insonnia, Multitipo, Sciamefusione, Sistema Primevo, Banco, Scudosoglia, Accendilotta, Pigrone o Stato Zen.", // NEEDS QC
		},
		gen6: {
			desc: "L'abilità del bersaglio diventa Insonnia. Fallisce se l'abilità del bersaglio è Insonnia, Multitipo, Accendilotta o Pigrone.", // NEEDS QC
		},
		gen5: {
			desc: "L'abilità del bersaglio diventa Insonnia. Fallisce se l'abilità del bersaglio è Insonnia, Multitipo o Pigrone.", // NEEDS QC
		},
		gen4: {
			desc: "L'abilità del bersaglio diventa Insonnia. Fallisce se l'abilità del bersaglio è Multitipo o Pigrone, o se il bersaglio ha una Grigiosfera.", // NEEDS QC
		},
	},
	wrap: {
		name: "Avvolgibotta",
		// Official flavor text: "Il lungo corpo o le liane di chi la usa avvolgono e stritolano il bersaglio per quattro o cinque turni."
		desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Tagliacoda, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Glitturbine, Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		shortDesc: "Intrappola e danneggia il bersaglio per 4-5 turni.", // NEEDS QC
		gen8: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Virata, Monito, Teletrasporto, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen7: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/8 dei suoi PS max (1/6 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Monito, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen5: {
			desc: "Impedisce al bersaglio di essere sostituito per quattro o cinque turni (sette se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max (1/8 se chi la usa ha una Legafascia), arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta, Retromarcia o Invertivolt. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen4: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni (sempre cinque se chi la usa ha una Presartigli). Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se ha una Disfoguscio o usa Staffetta o Retromarcia. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
			shortDesc: "Intrappola e ferisce il bersaglio per 2-5 turni.", // NEEDS QC
		},
		gen3: {
			desc: "Impedisce al bersaglio di essere sostituito per da due a cinque turni. Infligge al bersaglio danni pari a 1/16 dei suoi PS max, arrotondato per difetto, alla fine di ogni turno durante l'effetto. Il bersaglio può comunque essere sostituito se usa Staffetta. L'effetto finisce se chi la usa o il bersaglio lascia il campo, o se il bersaglio usa Rapigiro o Sostituto con successo. Questo effetto non è cumulabile né azzerabile usando questa o un'altra mossa intrappolante.", // NEEDS QC
		},
		gen1: {
			desc: "Chi la usa usa questa mossa per due-cinque turni. Ha 3/8 di probabilità di durare due o tre turni e 1/8 di durare quattro o cinque turni. I danni calcolati al primo turno vengono ripetuti per ogni altro turno. Chi la usa non può scegliere mosse e il bersaglio non può eseguire mosse durante l'effetto, ma entrambi possono essere sostituiti. Se chi la usa viene sostituito, il bersaglio resta incapace di agire in quel turno. Se il bersaglio viene sostituito, chi la usa usa di nuovo questa mossa automaticamente, e se in quel momento aveva 0 PP, diventano 63. Se chi la usa o il bersaglio viene sostituito, o chi la usa non può agire, l'effetto finisce. Questa mossa può impedire al bersaglio di agire anche se ha un'immunità di tipo, ma in tal caso non infligge danni.", // NEEDS QC
			shortDesc: "Il bersaglio non può agire per 2-5 turni.", // NEEDS QC
		},

		start: "  {SOURCE} stritola {POKEMON} con Avvolgibotta!",
		move: "{POKEMON} attacca ancora!",
	},
	wringout: {
		name: "Strizzata",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "La potenza è pari a 120 × (PS attuali del bersaglio / PS max del bersaglio), arrotondato per difetto da 0,5, ma non meno di 1.", // NEEDS QC
		shortDesc: "Più potente se il bersaglio ha molti PS.", // NEEDS QC
		gen4: {
			desc: "La potenza è pari a 120 × (PS attuali del bersaglio ÷ PS max del bersaglio) + 1, arrotondato per difetto.", // NEEDS QC
		},
	},
	xscissor: {
		name: "Forbice X",
		shortDesc: "Nessun effetto aggiuntivo.", // NEEDS QC
	},
	yawn: {
		name: "Sbadiglio",
		// Official flavor text: "Chi la usa fa un grande sbadiglio che addormenta il bersaglio al turno seguente."
		desc: "Addormenta il bersaglio alla fine del turno successivo. Fallisce all'uso se il bersaglio non può addormentarsi o se ha già un problema di stato. Alla fine del turno successivo, se il bersaglio è ancora in campo, non ha problemi di stato e può addormentarsi, si addormenta. Una volta colpito il bersaglio, questo effetto non può essere impedito né da Salvaguardia né da un sostituto, né addormentandosi e svegliandosi durante l'effetto.", // NEEDS QC
		shortDesc: "Addormenta il bersaglio alla fine del turno dopo.", // NEEDS QC

		start: "  {POKEMON} sta per assopirsi!",
	},
	zapcannon: {
		name: "Falcecannone",
		// Official flavor text: "Chi la usa scaglia una sfera elettrica che infligge danni e paralizza il bersaglio."
		desc: "Ha il 100% di probabilità di paralizzare il bersaglio.", // NEEDS QC
		shortDesc: "100% di paralizzare il bersaglio.", // NEEDS QC
	},
	zenheadbutt: {
		name: "Cozzata Zen",
		// Official flavor text: "Chi la usa concentra le energie psichiche nella testa e si lancia contro il bersaglio. Può anche farlo tentennare."
		desc: "Ha il 20% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "20% di far tentennare il bersaglio.", // NEEDS QC
	},
	zingzap: {
		name: "Elettropizzico",
		// Official flavor text: "Chi la usa colpisce il bersaglio investendolo con una potente scarica elettrica che può anche farlo tentennare."
		desc: "Ha il 30% di probabilità di far tentennare il bersaglio.", // NEEDS QC
		shortDesc: "30% di far tentennare il bersaglio.", // NEEDS QC
	},
	zippyzap: {
		name: "Sprintaboom",
		// Official flavor text: "Questa mossa non può essere usata. È consigliabile farla dimenticare al Pokémon. Tuttavia, una volta dimenticata, non potrà più essere ricordata."
		desc: "Ha il 100% di probabilità di aumentare l'elusione di chi la usa di un livello.", // NEEDS QC
		shortDesc: "Agisce per prima. Aumenta la sua elusione di 1.", // NEEDS QC
		gen7: {
			desc: "È sempre un brutto colpo.", // NEEDS QC
			shortDesc: "Agisce quasi sempre per primo. Sempre brutto colpo.", // NEEDS QC
		},
	},
};
