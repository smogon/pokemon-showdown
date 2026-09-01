export const MovesText: { [id: IDEntry]: MoveText } = {
	"10000000voltthunderbolt": {
		name: "Tausendfacher Donnerblitz",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine stark erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Stark erhöhte Volltrefferquote.", // NEEDS QC
	},
	absorb: {
		name: "Absorber",
		// Official flavor text: "Attacke, die die Hälfte des Schadens absorbiert."
		desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 50 % des Schadens.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, abgerundet.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet. Hat das Ziel einen Delegator, verfehlt diese Attacke.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet. Zerbricht diese Attacke den Delegator des Ziels, stellt der Anwender keine KP wieder her.", // NEEDS QC
		},
	},
	accelerock: {
		name: "Turbofelsen",
		// Official flavor text: "Bei dieser Erstschlag-Attacke prallt der Anwender mit großer Geschwindigkeit auf das Ziel."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
	},
	acid: {
		name: "Säure",
		// Official flavor text: "Versprüht ätzende Flüssigkeit, die eventuell die Spezial-Verteidigung der gegnerischen Pokémon senkt."
		desc: "Hat eine Chance von 10 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Sp.-Vert. der Gegner.", // NEEDS QC
		gen3: {
			desc: "Hat eine Chance von 10 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
			shortDesc: "10 % Chance auf -1 Vert. der Gegner.", // NEEDS QC
		},
		gen1: {
			desc: "Hat eine Chance von 33 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
			shortDesc: "33 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
		},
	},
	acidarmor: {
		name: "Säurepanzer",
		// Official flavor text: "Verflüssigt Körperzellen des Anwenders. Erhöht den Verteidigungs-Wert stark."
		desc: "Erhöht die Verteidigung des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Verteidigung des Anwenders um 2 Stufen.", // NEEDS QC
	},
	aciddownpour: {
		name: "Vernichtender Säureregen",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	acidspray: {
		name: "Säurespeier",
		// Official flavor text: "Anwender greift an, indem er eine ätzende Flüssigkeit auf das Ziel speit. Senkt dessen Spezial-Verteidigung stark."
		desc: "Hat eine Chance von 100 %, die Spezial-Verteidigung des Ziels um 2 Stufen zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -2 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	acrobatics: {
		name: "Akrobatik",
		shortDesc: "Doppelte Stärke, wenn der Anwender kein Item trägt.", // NEEDS QC
	},
	acupressure: {
		name: "Akupressur",
		// Official flavor text: "Anwender übt Druck auf Stresspunkte aus und erhöht einen Statuswert stark."
		desc: "Erhöht einen zufälligen Statuswert um 2 Stufen, sofern er nicht bereits bei Stufe 6 liegt. Der Anwender kann sich selbst oder einen benachbarten Mitstreiter wählen. Schlägt fehl, wenn kein Wert erhöht werden kann oder ein Mitstreiter hinter einem Delegator gewählt wird.", // NEEDS QC
		shortDesc: "+2 auf einen zufälligen Wert im eigenen Team.", // NEEDS QC
		gen4: {
			desc: "Erhöht einen zufälligen Statuswert um 2 Stufen, sofern er nicht bereits bei Stufe 6 liegt. Der Anwender kann sich selbst oder einen Mitstreiter wählen. Schlägt fehl, wenn kein Wert erhöht werden kann oder der Anwender oder der Mitstreiter einen Delegator hat.", // NEEDS QC
		},
	},
	aerialace: {
		name: "Aero-Ass",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	aeroblast: {
		name: "Luftstoß",
		// Official flavor text: "Erzeugt Luftstrudel gegen das Ziel. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	afteryou: {
		name: "Galanterie",
		// Official flavor text: "Anwender ermöglicht dem Ziel direkt nach ihm zu handeln, solange der Anwender als Erstes zum Zug kommt."
		desc: "Das Ziel handelt in dieser Runde direkt nach dem Anwender, unabhängig von der Priorität seiner gewählten Attacke. Schlägt fehl, wenn das Ziel ohnehin als Nächstes gehandelt hätte oder bereits gehandelt hat.", // NEEDS QC
		shortDesc: "Das Ziel handelt direkt nach dem Anwender.", // NEEDS QC

		activate: "  {TARGET} lässt sich auf Galanterie ein!",
	},
	agility: {
		name: "Agilität",
		// Official flavor text: "Entspannt den Körper, um den Initiative-Wert stark zu erhöhen."
		desc: "Erhöht die Initiative des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Initiative des Anwenders um 2 Stufen.", // NEEDS QC
	},
	aircutter: {
		name: "Windschnitt",
		// Official flavor text: "Greift gegnerische Pokémon mit rasierklingenartigem Wind an. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Hohe Volltrefferquote. Trifft benachbarte Gegner.", // NEEDS QC
	},
	airslash: {
		name: "Luftschnitt",
		// Official flavor text: "Das Ziel wird mit einer Luftklinge angegriffen. Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	alloutpummeling: {
		name: "Fulminante Faustschläge",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	alluringvoice: {
		name: "Lockstimme",
		desc: "Hat eine Chance von 100 %, das Ziel zu verwirren, wenn seine Statuswerte in dieser Runde erhöht wurden.", // NEEDS QC
		shortDesc: "100 % Verwirrung, wenn das Ziel Werte erhöht hat.", // NEEDS QC
	},
	allyswitch: {
		name: "Seitentausch",
		// Official flavor text: "Wundersame Kräfte teleportieren den Anwender an den Platz eines Mitstreiters."
		desc: "Der Anwender tauscht seine Position mit der seines Mitstreiters. Schlägt fehl, wenn der Anwender das einzige Pokémon seines Teams auf dem Feld ist. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Seitentausch ist.", // NEEDS QC
		shortDesc: "Tauscht den Platz mit dem Partner; kann scheitern.", // NEEDS QC
		gen8: {
			desc: "Der Anwender tauscht seine Position mit der seines Mitstreiters. Schlägt fehl, wenn der Anwender das einzige Pokémon seines Teams auf dem Feld ist.", // NEEDS QC
			shortDesc: "Anwender tauscht den Platz mit dem Mitstreiter.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender tauscht seine Position mit der des Mitstreiters auf der gegenüberliegenden Seite des Feldes. Schlägt fehl, wenn sich dort kein Pokémon befindet, wenn der Anwender das einzige Pokémon seines Teams auf dem Feld ist oder wenn er in der Mitte steht.", // NEEDS QC
			shortDesc: "Tauscht den Platz mit dem entfernten Mitstreiter.", // NEEDS QC
		},
	},
	amnesia: {
		name: "Amnesie",
		// Official flavor text: "Gedächtnisverlust, der die Spezial-Verteidigung stark erhöht."
		desc: "Erhöht die Spezial-Verteidigung des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Sp.-Vert. des Anwenders um 2 Stufen.", // NEEDS QC
		gen1: {
			desc: "Erhöht den Spezial-Wert des Anwenders um 2 Stufen.", // NEEDS QC
			shortDesc: "Erhöht den Spezial-Wert des Anwenders um 2.", // NEEDS QC
		},
	},
	anchorshot: {
		name: "Ankerschuss",
		// Official flavor text: "Der Anwender greift das Ziel an, indem er es mit einer Ankerkette umwickelt. Dadurch wird das Ziel an der Flucht gehindert."
		desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		shortDesc: "Hindert das Ziel am Auswechseln.", // NEEDS QC
		gen7: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt.", // NEEDS QC
		},
	},
	ancientpower: {
		name: "Antik-Kraft",
		// Official flavor text: "Angriff mit antiker Kraft, der alle Statuswerte erhöhen kann."
		desc: "Hat eine Chance von 10 %, Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung und Initiative des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "10 % Chance, alle Statuswerte um 1 zu erhöhen.", // NEEDS QC
	},
	appleacid: {
		name: "Apfelsäure",
		// Official flavor text: "Der Anwender greift mit einer aus einem sauren Apfel hergestellten säurehaltigen Flüssigkeit an. Dabei wird die Spezial-Verteidigung des Zieles gesenkt."
		desc: "Hat eine Chance von 100 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	aquacutter: {
		name: "Aquaschnitt",
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	aquajet: {
		name: "Wasserdüse",
		// Official flavor text: "Bei dieser Erstschlag-Attacke stürzt sich der Anwender so schnell auf das Ziel, dass er quasi unsichtbar wird."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
	},
	aquaring: {
		name: "Wasserring",
		// Official flavor text: "Anwender umgibt sich mit einem Schleier aus Wasser. Dabei regeneriert er einige KP pro Runde."
		desc: "Der Anwender stellt am Ende jeder Runde 1/16 seiner maximalen KP wieder her, abgerundet, solange er im Kampf bleibt. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet. Setzt der Anwender Stafette ein, erbt der Nachfolger den Heileffekt.", // NEEDS QC
		shortDesc: "Der Anwender heilt pro Runde 1/16 seiner max. KP.", // NEEDS QC

		start: "  {POKEMON} umgibt sich mit einem Wasserring!",
		heal: "  Der Wasserring stellt KP von {POKEMON} wieder her!",
	},
	aquastep: {
		name: "Wogentanz",
		desc: "Hat eine Chance von 100 %, die Initiative des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "100 % Chance auf +1 Init. des Anwenders.", // NEEDS QC
	},
	aquatail: {
		name: "Nassschweif",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	armorcannon: {
		name: "Rüstungskanone",
		desc: "Senkt die Verteidigung und die Spezial-Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Vert. und Sp.-Vert. des Anwenders.", // NEEDS QC
	},
	armthrust: {
		name: "Armstoß",
		// Official flavor text: "Schläge mit geradem Arm, die das Ziel zwei- bis fünfmal treffen."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
	},
	aromatherapy: {
		name: "Aromakur",
		// Official flavor text: "Heilt alle Statusprobleme des Teams mit beruhigendem Duft."
		desc: "Alle Pokémon im Team des Anwenders werden von ihren Statusproblemen geheilt. Pokémon im Kampf mit der Fähigkeit Vegetarier werden nicht geheilt, außer es handelt sich um den Anwender.", // NEEDS QC
		shortDesc: "Heilt die Statusprobleme des ganzen Teams.", // NEEDS QC
		gen5: {
			desc: "Alle Pokémon im Team des Anwenders werden von ihren Statusproblemen geheilt.", // NEEDS QC
		},

		activate: "  Ein wohltuendes Aroma breitet sich aus!",
	},
	aromaticmist: {
		name: "Duftwolke",
		// Official flavor text: "Der Anwender erhöht mithilfe eines mysteriösen Duftes die Spezial-Verteidigung eines Mitstreiters."
		desc: "Erhöht die Spezial-Verteidigung des Ziels um eine Stufe. Schlägt fehl, wenn kein Mitstreiter neben dem Anwender steht.", // NEEDS QC
		shortDesc: "+1 Sp.-Vert. für einen Mitstreiter.", // NEEDS QC
	},
	assist: {
		name: "Zuschuss",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Setzt eine zufällig gewählte Attacke ein, die ein Teammitglied kennt. Kann nicht Zuschuss, Bunker, Schnabelkanone, Rülpser, Offerte, Hitzeturbo, Sprungfeder, Ehrentag, Geschwätz, Überkopfwurf, Raufturbo, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Schaufler, Taucher, Drachenrute, Ausdauer, Offenlegung, Fliegen, Power-Punch, Spotlight, Rechte Hand, Händchenhalten, Königsschild, Zauberturbo, Tatami-Schild, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Toxiturbo, Phantomkraft, Schutzschild, Wutpulver, Brüller, Schemenkraft, Panzerfalle, Nachahmer, Freier Fall, Schlafrede, Übernahme, Schutzstacheln, Rampenlicht, Verzweifler, Wechseldich, Tera-Sternhagel, Raub, Wandler, Trickbetrug, Wirbelwind oder Finsterturbo wählen.", // NEEDS QC
		shortDesc: "Setzt eine zufällige Attacke eines Teammitglieds ein.", // NEEDS QC
		gen8: {
			desc: "Setzt eine zufällig gewählte Attacke ein, die ein Teammitglied kennt. Kann nicht Zuschuss, Bunker, Schnabelkanone, Rülpser, Offerte, Sprungfeder, Ehrentag, Geschwätz, Überkopfwurf, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Schaufler, Taucher, Drachenrute, Ausdauer, Offenlegung, Fliegen, Power-Punch, Spotlight, Rechte Hand, Händchenhalten, Königsschild, Tatami-Schild, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Phantomkraft, Schutzschild, Wutpulver, Brüller, Schemenkraft, Panzerfalle, Nachahmer, Freier Fall, Schlafrede, Übernahme, Schutzstacheln, Rampenlicht, Verzweifler, Wechseldich, Raub, Wandler, Trickbetrug oder Wirbelwind wählen.", // NEEDS QC
		},
		gen7: {
			desc: "Setzt eine zufällig gewählte Attacke ein, die ein Teammitglied kennt. Kann nicht Zuschuss, Bunker, Schnabelkanone, Rülpser, Offerte, Sprungfeder, Ehrentag, Geschwätz, Überkopfwurf, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Schaufler, Taucher, Drachenrute, Ausdauer, Offenlegung, Fliegen, Power-Punch, Spotlight, Rechte Hand, Händchenhalten, Königsschild, Tatami-Schild, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Phantomkraft, Schutzschild, Wutpulver, Brüller, Schemenkraft, Panzerfalle, Nachahmer, Freier Fall, Schlafrede, Übernahme, Schutzstacheln, Rampenlicht, Verzweifler, Wechseldich, Raub, Wandler, Trickbetrug oder Wirbelwind oder eine Z-Attacke wählen.", // NEEDS QC
		},
		gen6: {
			desc: "Setzt eine zufällig gewählte Attacke ein, die ein Teammitglied kennt. Kann nicht Zuschuss, Rülpser, Offerte, Sprungfeder, Ehrentag, Geschwätz, Überkopfwurf, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Schaufler, Taucher, Drachenrute, Ausdauer, Offenlegung, Fliegen, Power-Punch, Spotlight, Rechte Hand, Händchenhalten, Königsschild, Tatami-Schild, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Phantomkraft, Schutzschild, Wutpulver, Brüller, Schemenkraft, Nachahmer, Freier Fall, Schlafrede, Übernahme, Schutzstacheln, Verzweifler, Wechseldich, Raub, Wandler, Trickbetrug oder Wirbelwind wählen.", // NEEDS QC
		},
		gen5: {
			desc: "Setzt eine zufällig gewählte Attacke ein, die ein Teammitglied kennt. Kann nicht Zuschuss, Offerte, Geschwätz, Überkopfwurf, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Drachenrute, Ausdauer, Offenlegung, Power-Punch, Spotlight, Rechte Hand, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Schutzschild, Wutpulver, Nachahmer, Schlafrede, Übernahme, Verzweifler, Wechseldich, Raub, Wandler oder Trickbetrug wählen.", // NEEDS QC
		},
		gen4: {
			desc: "Setzt eine zufällig gewählte Attacke ein, die ein Teammitglied kennt. Kann nicht Zuschuss, Geschwätz, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Ausdauer, Offenlegung, Power-Punch, Spotlight, Rechte Hand, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Schutzschild, Nachahmer, Schlafrede, Übernahme, Verzweifler, Wechseldich, Raub oder Trickbetrug wählen.", // NEEDS QC
		},
		gen3: {
			desc: "Setzt eine zufällig gewählte Attacke ein, die ein Teammitglied kennt. Kann nicht Zuschuss, Konter, Bezirzer, Abgangsbund, Scanner, Ausdauer, Power-Punch, Spotlight, Rechte Hand, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Schutzschild, Nachahmer, Schlafrede, Übernahme, Verzweifler, Raub oder Trickbetrug wählen.", // NEEDS QC
		},
	},
	assurance: {
		name: "Gewissheit",
		// Official flavor text: "Hat das Ziel während der Runde schon Schaden genommen, wird die Stärke der Attacke verdoppelt."
		desc: "Die Stärke wird verdoppelt, wenn das Ziel in dieser Runde bereits Schaden erlitten hat, ausgenommen direkter Schaden durch Bauchtrommel, Verwirrung, Fluch oder Leidteiler.", // NEEDS QC
		shortDesc: "Doppelte Stärke, wenn das Ziel schon Schaden erlitt.", // NEEDS QC
		gen4: {
			desc: "Die Stärke wird verdoppelt, wenn das Ziel in dieser Runde bereits Schaden erlitten hat.", // NEEDS QC
		},
	},
	astonish: {
		name: "Erstauner",
		// Official flavor text: "Anwender greift mit einem Schrei an. Ein Angriff, der das Ziel eventuell zurückschrecken lässt."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
		gen3: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Der Schaden wird verdoppelt, wenn das Ziel Komprimator eingesetzt hat, seit es im Kampf ist.", // NEEDS QC
		},
	},
	astralbarrage: {
		name: "Astralfragmente",
		// Official flavor text: "Der Anwender greift gegnerische Pokémon mit vielen kleinen Spukgestalten an."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Gegner.", // NEEDS QC
	},
	attackorder: {
		name: "Schlagbefehl",
		// Official flavor text: "Anwender ruft seine Untergebenen zum Angriff. Hat eine hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	attract: {
		name: "Anziehung",
		// Official flavor text: "Wenn das Ziel nicht dem Geschlecht des Anwenders angehört, fühlt es sich zu ihm hingezogen und greift eventuell nicht an."
		desc: "Das Ziel verliebt sich und kann in 50 % der Fälle nicht angreifen. Schlägt fehl, wenn Anwender und Ziel dasselbe Geschlecht haben, einer von beiden geschlechtslos ist oder das Ziel bereits verliebt ist. Der Effekt endet, wenn der Anwender oder das Ziel den Kampf verlässt. Pokémon mit der Fähigkeit Dösigkeit oder unter dem Schutz der Fähigkeit Dufthülle sind immun.", // NEEDS QC
		shortDesc: "Verliebt ein Ziel des anderen Geschlechts.", // NEEDS QC
		gen5: {
			desc: "Das Ziel verliebt sich und kann in 50 % der Fälle nicht angreifen. Schlägt fehl, wenn Anwender und Ziel dasselbe Geschlecht haben, einer von beiden geschlechtslos ist oder das Ziel bereits verliebt ist. Der Effekt endet, wenn der Anwender oder das Ziel den Kampf verlässt. Pokémon mit der Fähigkeit Dösigkeit sind immun.", // NEEDS QC
		},
		gen2: {
			desc: "Das Ziel verliebt sich und kann in 50 % der Fälle nicht angreifen. Schlägt fehl, wenn Anwender und Ziel dasselbe Geschlecht haben, einer von beiden geschlechtslos ist oder das Ziel bereits verliebt ist. Der Effekt endet, wenn der Anwender oder das Ziel den Kampf verlässt.", // NEEDS QC
		},

		start: "  {POKEMON} hat sich verliebt!",
		startFromItem: "  {ITEM} hat bewirkt, dass {POKEMON} sich verliebt!",
		end: "  {POKEMON} ist nicht mehr verliebt!",
		endFromItem: "  {ITEM} von {POKEMON} bewirkt, dass es nicht mehr verliebt ist.",
		activate: "  {POKEMON} hat sich in {TARGET} verliebt!",
		cant: "{POKEMON} ist starr vor Liebe!",
	},
	aurasphere: {
		name: "Aurasphäre",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	aurawheel: {
		name: "Aura-Rad",
		// Official flavor text: "Mithilfe der in den Backentaschen gespeicherten Energie greift der Anwender an und erhöht seine Initiative. Der Typ der Attacke hängt von Morpekos Form ab."
		desc: "Hat eine Chance von 100 %, die Initiative des Anwenders um eine Stufe zu erhöhen. Ist der Anwender ein Morpeko im Pappsattmuster, ist diese Attacke vom Typ Elektro. Im Kohldampfmuster ist sie vom Typ Unlicht. Diese Attacke kann nur erfolgreich eingesetzt werden, wenn die aktuelle Form des Anwenders, unter Berücksichtigung von Wandler, ein Morpeko im Pappsatt- oder Kohldampfmuster ist.", // NEEDS QC
		shortDesc: "Pappsatt: Elektro; Kohldampf: Unlicht. 100 % +1 Init.", // NEEDS QC
	},
	aurorabeam: {
		name: "Aurorastrahl",
		// Official flavor text: "Regenbogenfarbener Strahl, der eventuell den Angriffs-Wert des Zieles senkt."
		desc: "Hat eine Chance von 10 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Ang. des Ziels.", // NEEDS QC
		gen1: {
			desc: "Hat eine Chance von 33 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
			shortDesc: "33 % Chance auf -1 Angriff des Ziels.", // NEEDS QC
		},
	},
	auroraveil: {
		name: "Auroraschleier",
		// Official flavor text: "Diese Attacke schwächt fünf Runden lang den durch physische sowie durch Spezial-Attacken erhaltenen Schaden. Kann nur bei Hagel eingesetzt werden."
		desc: "5 Runden lang erleiden der Anwender und sein Team 0,5-fachen Schaden durch physische und spezielle Angriffe, bzw. 0,66-fachen in Doppelkämpfen; der Schaden wird durch Reflektor oder Lichtschild nicht weiter verringert. Volltreffer ignorieren diesen Schutz. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch, Psychobeißer oder Auflockern getroffen wird. Hält 8 Runden an, wenn der Anwender ein Lichtlehm trägt. Schlägt fehl, wenn es nicht schneit.", // NEEDS QC
		shortDesc: "5 Runden: halber Schaden fürs Team. Nur bei Schnee.", // NEEDS QC
		gen8: {
			desc: "5 Runden lang erleiden der Anwender und sein Team 0,5-fachen Schaden durch physische und spezielle Angriffe, bzw. 0,66-fachen in Doppelkämpfen; der Schaden wird durch Reflektor oder Lichtschild nicht weiter verringert. Volltreffer ignorieren diesen Schutz. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch, Psychobeißer oder Auflockern getroffen wird. Hält 8 Runden an, wenn der Anwender ein Lichtlehm trägt. Schlägt fehl, wenn es nicht hagelt.", // NEEDS QC
			shortDesc: "5 Runden halber Schaden fürs Team. Nur bei Hagel.", // NEEDS QC
		},

		start: "  Auroraschleier stärkt {TEAM} gegen physische und Spezial-Attacken!",
		end: "  Der Auroraschleier, der {TEAM} umgab, hat sich gelüftet!",
	},
	autotomize: {
		name: "Autotomie",
		// Official flavor text: "Anwender trennt sich von überflüssigen Körperteilen und erhöht seine Initiative stark. Sein Gewicht nimmt deutlich ab."
		desc: "Erhöht die Initiative des Anwenders um 2 Stufen. Hat sich die Initiative geändert, verringert sich sein Gewicht um 100 kg, solange er im Kampf bleibt. Dieser Effekt ist kumulierbar, kann das Gewicht aber nicht unter 0,1 kg senken.", // NEEDS QC
		shortDesc: "+2 Initiative; der Anwender verliert 100 kg.", // NEEDS QC

		start: "  {POKEMON} ist leichter geworden!",
	},
	avalanche: {
		name: "Lawine",
		// Official flavor text: "Wurde der Anwender in dieser Runde vom Ziel getroffen, verdoppelt sich die Stärke der Attacke bei Angriffen auf dieses Ziel."
		desc: "Die Stärke wird verdoppelt, wenn der Anwender in dieser Runde vom Ziel getroffen wurde.", // NEEDS QC
		shortDesc: "Doppelte Stärke, wenn das Ziel den Anwender verletzte.", // NEEDS QC
		gen4: {
			desc: "Die Stärke wird verdoppelt, wenn der Anwender in dieser Runde von einem Pokémon auf der Position des Ziels getroffen wurde.", // NEEDS QC
		},
	},
	axekick: {
		name: "Fersenkick",
		desc: "Hat eine Chance von 30 %, das Ziel zu verwirren. Schlägt dieser Angriff fehl, verliert der Anwender die Hälfte seiner maximalen KP, abgerundet, als Fehlschlagschaden. Pokémon mit der Fähigkeit Magieschild erleiden keinen Fehlschlagschaden.", // NEEDS QC
		shortDesc: "30 % Verwirrung. Verfehlt sie, kostet es halbe KP.", // NEEDS QC

		damage: "#crash",
	},
	babydolleyes: {
		name: "Kulleraugen",
		// Official flavor text: "Bei dieser Erstschlag-Attacke erobert der Anwender das Herz des Zieles, indem er es mit Kulleraugen ansieht, und senkt dabei dessen Angriffs-Wert."
		desc: "Senkt den Angriff des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Angriff des Ziels um eine Stufe.", // NEEDS QC
	},
	baddybad: {
		name: "Quälzone",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Diese Attacke ruft Reflektor für 5 Runden hervor.", // NEEDS QC
		shortDesc: "Erzeugt Reflektor für 5 Runden.", // NEEDS QC
	},
	banefulbunker: {
		name: "Bunker",
		// Official flavor text: "Der Anwender wird vor Angriffen geschützt. Gleichzeitig werden alle Pokémon, die mit ihm in Berührung kommen, vergiftet."
		desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke treffen, werden vergiftet. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Schützt vor Attacken. Kontakt: Vergiftung.", // NEEDS QC
		gen8: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke treffen, werden vergiftet. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke treffen, werden vergiftet. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
	},
	barbbarrage: {
		name: "Giftstachelregen",
		desc: "Hat eine Chance von 50 %, das Ziel zu vergiften. Die Stärke wird verdoppelt, wenn das Ziel bereits vergiftet ist.", // NEEDS QC
		shortDesc: "50 % Gift-Chance. Doppelt gegen vergiftete Ziele.", // NEEDS QC
	},
	barrage: {
		name: "Stakkato",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Der Schaden wird nur für den ersten Treffer berechnet und für jeden weiteren übernommen. Zerbricht einer der Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	barrier: {
		name: "Barriere",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Erhöht die Verteidigung des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Verteidigung des Anwenders um 2 Stufen.", // NEEDS QC
	},
	batonpass: {
		name: "Stafette",
		// Official flavor text: "Tauscht den Anwender aus und überträgt alle Statusveränderungen auf das eingewechselte Pokémon."
		desc: "Der Anwender wird gegen ein anderes Pokémon seines Teams ausgewechselt. Das gewählte Pokémon erbt die Statusveränderungen des Anwenders sowie die Effekte von Verwirrung, Wasserring, Fluch, Drachenschrei, Itemsperre, Energiefokus, Magensäfte, Heilblockade, Verwurzler, Egelsamen, Zielschuss, Magnetflug, Abgesang, Krafttrick und Telekinese (und Willensleser) sowie einen Delegator mit seinen verbleibenden KP. Der Effekt von Magensäfte wird nicht übertragen, wenn der Nachfolger eine Fähigkeit hat, die nicht beeinflusst werden kann.", // NEEDS QC
		shortDesc: "Wechselt aus und übergibt Statusveränderungen usw.", // NEEDS QC
		gen8: {
			desc: "Der Anwender wird gegen ein anderes Pokémon seines Teams ausgewechselt. Das gewählte Pokémon erbt die Statusveränderungen des Anwenders sowie die Effekte von Verwirrung, Wasserring, Fluch, Itemsperre, Energiefokus, Magensäfte, Heilblockade, Verwurzler, Egelsamen, Zielschuss (und Willensleser), Magnetflug, Abgesang, Krafttrick und Telekinese sowie einen Delegator mit seinen verbleibenden KP. Der Effekt von Magensäfte wird nicht übertragen, wenn der Nachfolger eine Fähigkeit hat, die nicht beeinflusst werden kann.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender wird gegen ein anderes Pokémon seines Teams ausgewechselt. Das gewählte Pokémon erbt die Statusveränderungen des Anwenders sowie die Effekte von Verwirrung, Wasserring, Fluch, Itemsperre, Energiefokus, Magensäfte, Heilblockade, Verwurzler, Egelsamen, Zielschuss (und Willensleser), Magnetflug, Abgesang, Krafttrick und Telekinese und den Gefangen-Effekt von Horrorblick (Rückentzug, Spinnennetz) sowie einen Delegator mit seinen verbleibenden KP. Der Effekt von Magensäfte wird nicht übertragen, wenn der Nachfolger eine Fähigkeit hat, die nicht beeinflusst werden kann. Der Effekt von Telekinese wird nicht übertragen, wenn der Nachfolger ein Mega-Gengar ist.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender wird gegen ein anderes Pokémon seines Teams ausgewechselt. Das gewählte Pokémon erbt die Statusveränderungen des Anwenders sowie die Effekte von Verwirrung, Wasserring, Fluch, Itemsperre, Energiefokus, Magensäfte, Heilblockade, Verwurzler, Egelsamen, Zielschuss (und Willensleser), Magnetflug, Abgesang, Krafttrick und Telekinese und den Gefangen-Effekt von Horrorblick (Rückentzug, Spinnennetz) sowie einen Delegator mit seinen verbleibenden KP.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender wird gegen ein anderes Pokémon seines Teams ausgewechselt. Das gewählte Pokémon erbt die Statusveränderungen des Anwenders sowie die Effekte von Verwirrung, Wasserring, Fluch, Itemsperre, Energiefokus, Magensäfte, Heilblockade, Verwurzler, Egelsamen, Zielschuss (und Willensleser), Magnetflug, Lehmsuhler, Abgesang, Krafttrick und Nassmacher sowie den Fänger- oder Gefangen-Effekt von Horrorblick (Rückentzug, Spinnennetz) sowie einen Delegator mit seinen verbleibenden KP.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender wird gegen ein anderes Pokémon seines Teams ausgewechselt. Das gewählte Pokémon erbt die Statusveränderungen des Anwenders sowie die Effekte von Verwirrung, Fluch, Energiefokus, Verwurzler, Egelsamen, Zielschuss (und Willensleser), Lehmsuhler, Abgesang und Nassmacher sowie den Fänger- oder Gefangen-Effekt von Horrorblick (Rückentzug, Spinnennetz) sowie einen Delegator mit seinen verbleibenden KP.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender wird gegen ein anderes Pokémon seines Teams ausgewechselt. Das gewählte Pokémon erbt die Statusveränderungen des Anwenders sowie die Effekte von Verwirrung, Fluch, Einigler, Energiefokus, Scharfblick, Egelsamen, Zielschuss (und Willensleser), Komprimator, Weißnebel und Abgesang sowie den Fänger- oder Gefangen-Effekt von Horrorblick (Spinnennetz) sowie einen Delegator mit seinen verbleibenden KP.", // NEEDS QC
		},
	},
	beakblast: {
		name: "Schnabelkanone",
		// Official flavor text: "Der Anwender erhitzt zuerst seinen Schnabel und greift dann an. Pokémon, die ihn während des Erhitzens berühren, erleiden Verbrennungen."
		desc: "Wird der Anwender in dieser Runde von einer Kontaktattacke getroffen, bevor er diese Attacke ausführen kann, wird der Angreifer verbrannt.", // NEEDS QC
		shortDesc: "Verbrennt Angreifer bei Kontakt vor der Ausführung.", // NEEDS QC

		start: "  {POKEMON} erhitzt seinen Schnabel!",
	},
	beatup: {
		name: "Prügler",
		// Official flavor text: "Der Anwender greift zusammen mit allen Mitgliedern seines Teams das Ziel an. Je mehr Pokémon sich im Team befinden, desto höher die Anzahl der Angriffe."
		desc: "Trifft einmal für den Anwender und einmal für jedes nicht kampfunfähige Teammitglied ohne Statusproblem. Die Stärke jedes Treffers beträgt 5 + (X/10), wobei X der Basis-Angriff des jeweiligen Pokémon ist; jeder Treffer gilt als vom Anwender ausgeführt.", // NEEDS QC
		shortDesc: "Alle gesunden Teammitglieder greifen mit an.", // NEEDS QC
		gen4: {
			desc: "Fügt typenlosen Schaden zu. Trifft einmal für den Anwender und einmal für jedes nicht kampfunfähige Teammitglied ohne Statusproblem. Für jeden Treffer verwendet die Schadensformel den Basis-Angriff des teilnehmenden Pokémon als Angriffswert und die Basis-Verteidigung des Ziels als Verteidigungswert und ignoriert Statusveränderungen und andere Effekte, die Angriff oder Verteidigung beeinflussen; jeder Treffer gilt als vom Anwender ausgeführt.", // NEEDS QC
		},
		gen3: {
			desc: "Fügt typenlosen Schaden zu. Trifft einmal für jedes nicht kampfunfähige Teammitglied ohne Statusproblem, oder schlägt fehl, wenn kein Pokémon die Bedingungen erfüllt. Für jeden Treffer verwendet die Schadensformel den Basis-Angriff des teilnehmenden Pokémon als Angriffswert und die Basis-Verteidigung des Ziels als Verteidigungswert und ignoriert Statusveränderungen und andere Effekte, die Angriff oder Verteidigung beeinflussen; jeder Treffer gilt als vom Anwender ausgeführt.", // NEEDS QC
		},
		gen2: {
			desc: "Fügt typenlosen Schaden zu. Trifft einmal für jedes nicht kampfunfähige Teammitglied ohne Statusproblem. Für jeden Treffer verwendet die Schadensformel das Level des teilnehmenden Pokémon, seinen Basis-Angriff als Angriffswert und die Basis-Verteidigung des Ziels als Verteidigungswert und ignoriert Statusveränderungen und andere Effekte, die Angriff oder Verteidigung beeinflussen. Schlägt fehl, wenn kein Teammitglied teilnehmen kann.", // NEEDS QC
		},

		activate: "  Angriff von {NAME}!",
	},
	behemothbash: {
		name: "Gigantenstoß",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		gen8: {
			shortDesc: "Doppelter Schaden gegen dynamaximierte Ziele.", // NEEDS QC
		},
	},
	behemothblade: {
		name: "Gigantenhieb",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		gen8: {
			shortDesc: "Doppelter Schaden gegen dynamaximierte Ziele.", // NEEDS QC
		},
	},
	belch: {
		name: "Rülpser",
		// Official flavor text: "Der Anwender fügt dem Ziel Schaden zu, indem er es anrülpst. Diese Attacke gelingt nur nach dem Konsum einer getragenen Beere."
		desc: "Diese Attacke kann erst gewählt werden, wenn der Anwender eine Beere gegessen hat – die getragene, eine mit Käferbiss oder Pflücker gestohlene und gegessene oder eine mit Schleuder auf ihn geworfene. Ist die Bedingung erfüllt, kann diese Attacke für den Rest des Kampfes gewählt und eingesetzt werden, selbst wenn der Anwender ein anderes Item erhält oder verwendet oder ausgewechselt wird. Das Verzehren einer Beere durch Beerenkräfte zählt nicht.", // NEEDS QC
		shortDesc: "Nur wählbar, nachdem der Anwender eine Beere aß.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	bellydrum: {
		name: "Bauchtrommel",
		// Official flavor text: "Der Anwender maximiert den Angriffs-Wert auf Kosten der Hälfte seiner maximalen KP."
		desc: "Erhöht den Angriff des Anwenders um 12 Stufen im Tausch gegen die Hälfte seiner maximalen KP, abgerundet. Schlägt fehl, wenn der Anwender kampfunfähig würde oder seine Angriffs-Stufe bereits bei 6 liegt.", // NEEDS QC
		shortDesc: "Kostet halbe max. KP. Maximiert den Angriff.", // NEEDS QC
		gen2: {
			desc: "Der Anwender verliert die Hälfte seiner maximalen KP, abgerundet, außer er würde dadurch kampfunfähig oder sein Angriff liegt bereits bei Stufe 6. Hatte der Anwender nicht genug KP, wird sein Angriff um 2 Stufen erhöht. Andernfalls wird sein Angriff um je 2 Stufen erhöht, solange er unter Stufe 6 liegt; betrug der Angriffswert vor einem dieser Schritte 999, wird die Stufe um 1 gesenkt und die Schleife endet.", // NEEDS QC
		},

		boost: "  {POKEMON} nutzt seine KP und maximiert dadurch seinen Angriffs-Wert!",
	},
	bestow: {
		name: "Offerte",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Das Ziel erhält das getragene Item des Anwenders. Schlägt fehl, wenn der Anwender kein Item oder einen Z-Kristall trägt, wenn das Ziel bereits ein Item trägt, wenn das Item ein Mega-Stein ist und Anwender oder Ziel die Art ist, die sich damit mega-entwickeln kann, oder wenn das Item Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul oder eine Disc ist und Anwender oder Ziel jeweils Kyogre, Groudon, Giratina, Arceus, Genesect oder Amigento ist.", // NEEDS QC
		shortDesc: "Übergibt dem Ziel das eigene Item.", // NEEDS QC
		gen6: {
			desc: "Das Ziel erhält das getragene Item des Anwenders. Schlägt fehl, wenn der Anwender kein Item trägt, wenn das Ziel bereits ein Item trägt, wenn das Item ein Mega-Stein ist und Anwender oder Ziel die Art ist, die sich damit mega-entwickeln kann, oder wenn das Item Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel oder ein Modul ist und Anwender oder Ziel jeweils Kyogre, Groudon, Giratina, Arceus oder Genesect ist.", // NEEDS QC
		},
		gen5: {
			desc: "Das Ziel erhält das getragene Item des Anwenders. Schlägt fehl, wenn der Anwender kein Item oder einen Brief trägt, wenn das Ziel bereits ein Item trägt, oder wenn das Item Platinum-Orb, eine Tafel oder ein Modul ist und Anwender oder Ziel jeweils Giratina, Arceus oder Genesect ist.", // NEEDS QC
		},

		takeItem: "  {POKEMON} erhält von {SOURCE} das Item {ITEM}!",
	},
	bide: {
		name: "Geduld",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Der Anwender ist zwei Runden lang an diese Attacke gebunden und greift dann in der zweiten Runde das letzte Pokémon an, das ihn getroffen hat, wobei er das Doppelte der in diesen zwei Runden durch Angriffe verlorenen KP als Schaden zufügt. Ist das letzte Pokémon, das ihn getroffen hat, nicht mehr im Kampf, greift er einen zufälligen Gegner an. Wird der Anwender während des Einsatzes am Handeln gehindert, endet der Effekt. Diese Attacke prüft keine Genauigkeit und ignoriert Typ-Immunität.", // NEEDS QC
		shortDesc: "Wartet 2 Runden; zahlt doppelten Schaden zurück.", // NEEDS QC
		gen4: {
			desc: "Der Anwender ist zwei Runden lang an diese Attacke gebunden und greift dann in der zweiten Runde das letzte Pokémon an, das ihn getroffen hat, wobei er das Doppelte der in diesen zwei Runden durch Angriffe verlorenen KP als Schaden zufügt. Ist das letzte Pokémon, das ihn getroffen hat, nicht mehr im Kampf, greift er einen zufälligen Gegner an. Wird der Anwender während des Einsatzes am Handeln gehindert, endet der Effekt. Diese Attacke prüft keine Genauigkeit und ignoriert Typ-Immunität.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender ist zwei Runden lang an diese Attacke gebunden und greift dann in der zweiten Runde das letzte Pokémon an, das ihn getroffen hat, wobei er das Doppelte der in diesen zwei Runden verlorenen KP als Schaden zufügt. Ist das letzte Pokémon, das ihn getroffen hat, nicht mehr im Kampf, greift er einen zufälligen Gegner an. Wird der Anwender während des Einsatzes am Handeln gehindert, endet der Effekt. Diese Attacke ignoriert Typ-Immunität nicht.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und greift dann in der zweiten oder dritten Runde den Gegner an, wobei er das Doppelte der in diesen Runden verlorenen KP als Schaden zufügt. Wird der Anwender während des Einsatzes am Handeln gehindert, endet der Effekt. Diese Attacke ignoriert Typ-Immunität nicht.", // NEEDS QC
			shortDesc: "Wartet 2-3 Runden, gibt 2x erlittenen Schaden zurück.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und greift dann in der zweiten oder dritten Runde den Gegner an, wobei er das Doppelte der in diesen Runden verlorenen KP als Schaden zufügt. Diese Attacke ignoriert Typ-Immunität und kann nicht verfehlt werden, selbst wenn das Ziel Schaufler oder Fliegen einsetzt. Der Anwender kann sich während des Effekts auswechseln lassen. Wird er ausgewechselt oder am Handeln gehindert, endet der Effekt. Wechselt der Gegner während des Effekts aus oder setzt Konfusstrahl, Umwandlung, Energiefokus, Schlangenblick, Dunkelnebel, Egelsamen, Lichtschild, Mimikry, Weißnebel, Giftwolke, Giftpuder, Genesung, Reflektor, Erholung, Weichei, Platscher, Stachelspore, Delegator, Superschall, Teleport, Donnerwelle, Toxin oder Wandler ein, wird der zuvor erlittene Schaden zur Summe addiert.", // NEEDS QC
		},

		start: "  {POKEMON} speichert Energie!",
		end: "  {POKEMON} setzt Energie frei!",
		activate: "  {POKEMON} speichert Energie!",
	},
	bind: {
		name: "Klammergriff",
		// Official flavor text: "Umklammert und quetscht das Ziel über vier bis fünf Runden."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen7: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP (1/8 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang (immer fünf mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
			shortDesc: "Fängt und schädigt das Ziel 2-5 Runden lang.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es Stafette einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender setzt diese Attacke zwei bis fünf Runden lang ein. Hält mit einer Chance von 3/8 zwei oder drei Runden und mit einer Chance von 1/8 vier oder fünf Runden an. Der für die erste Runde berechnete Schaden wird für jede weitere Runde übernommen. Der Anwender kann keine Attacke wählen und das Ziel kann während des Effekts keine Attacke ausführen, aber beide können ausgewechselt werden. Wird der Anwender ausgewechselt, kann das Ziel in dieser Runde weiterhin keine Attacke ausführen. Wird das Ziel ausgewechselt, setzt der Anwender diese Attacke automatisch erneut ein; hatte sie dabei 0 AP, werden es 63. Wird der Anwender oder das Ziel ausgewechselt oder der Anwender am Handeln gehindert, endet der Effekt. Diese Attacke kann das Ziel auch bei Typ-Immunität am Handeln hindern, fügt dann aber keinen Schaden zu.", // NEEDS QC
			shortDesc: "Das Ziel kann 2-5 Runden nicht handeln.", // NEEDS QC
		},

		start: "  {SOURCE} setzt gegen {POKEMON} Klammergriff ein!",
		move: "#wrap",
	},
	bite: {
		name: "Biss",
		// Official flavor text: "Beißt zu und lässt das Ziel eventuell zurückschrecken."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
		gen1: {
			desc: "Hat eine Chance von 10 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
			shortDesc: "10 % Chance auf Zurückschrecken.", // NEEDS QC
		},
	},
	bitterblade: {
		name: "Reueschwert",
		desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 50 % des Schadens.", // NEEDS QC
	},
	bittermalice: {
		name: "Niedertracht",
		desc: "Hat eine Chance von 100 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Ang. des Ziels.", // NEEDS QC
	},
	blackholeeclipse: {
		name: "Schwarzes Loch des Grauens",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	blastburn: {
		name: "Lohekanonade",
		// Official flavor text: "Das Ziel wird von einer starken Explosion getroffen. Anwender setzt eine Runde aus."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
	},
	blazekick: {
		name: "Feuerfeger",
		// Official flavor text: "Starker Tritt mit hoher Volltrefferquote. Verursacht eventuell Verbrennungen."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen, und eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Hohe Volltrefferquote. 10 % Chance auf Verbrennung.", // NEEDS QC
	},
	blazingtorque: {
		name: "Hitzeturbo",
		desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "30 % Chance auf Verbrennung.", // NEEDS QC
	},
	bleakwindstorm: {
		name: "Polarorkan",
		desc: "Hat eine Chance von 30 %, die Initiative des Ziels um eine Stufe zu senken. Ist das Wetter Strömender Regen oder Regen, prüft diese Attacke keine Genauigkeit. Gegen ein Pokémon mit Allzweckschirm bleibt die Genauigkeit bei 80 %.", // NEEDS QC
		shortDesc: "30 % Chance auf -1 Init. Trifft bei Regen immer.", // NEEDS QC
	},
	blizzard: {
		name: "Blizzard",
		// Official flavor text: "Ein Schneesturm wütet, der gegnerische Pokémon einfrieren kann."
		desc: "Hat eine Chance von 10 %, das Ziel einzufrieren. Bei Schnee prüft diese Attacke keine Genauigkeit.", // NEEDS QC
		shortDesc: "10 % Chance auf Einfrieren. Trifft bei Schnee immer.", // NEEDS QC
		gen8: {
			desc: "Hat eine Chance von 10 %, das Ziel einzufrieren. Bei Hagel prüft diese Attacke keine Genauigkeit.", // NEEDS QC
			shortDesc: "10 % Chance auf Einfrieren. Trifft bei Hagel immer.", // NEEDS QC
		},
		gen3: {
			desc: "Hat eine Chance von 10 %, das Ziel einzufrieren.", // NEEDS QC
			shortDesc: "10 % Chance, die Gegner einzufrieren.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10 % Chance auf Einfrieren.", // NEEDS QC
		},
	},
	block: {
		name: "Rückentzug",
		// Official flavor text: "Anwender versperrt den Fluchtweg des Zieles."
		desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		shortDesc: "Hindert das Ziel am Auswechseln.", // NEEDS QC
		gen7: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt, außer er setzt Stafette ein – dann bleibt das Ziel gefangen.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es Stafette einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt, außer er setzt Stafette ein – dann bleibt das Ziel gefangen.", // NEEDS QC
		},
	},
	bloodmoon: {
		name: "Blutmond",
		shortDesc: "Kann nicht zweimal in Folge gewählt werden.", // NEEDS QC
	},
	bloomdoom: {
		name: "Brillante Blütenpracht",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	blueflare: {
		name: "Blauflammen",
		// Official flavor text: "Anwender greift an, indem er das Ziel in wunderschöne, intensivblaue Flammen hüllt, durch die es eventuell Verbrennungen erleidet."
		desc: "Hat eine Chance von 20 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "20 % Chance auf Verbrennung.", // NEEDS QC
	},
	bodypress: {
		name: "Body Press",
		// Official flavor text: "Der Anwender greift mit seinem ganzen Körper an. Je höher seine Verteidigung ist, desto mehr Schaden richtet er an."
		desc: "Der Schaden wird mit der Verteidigung des Anwenders anstelle seines Angriffs berechnet, einschließlich Statusveränderungen. Andere Effekte, die den Angriff verändern, gelten normal.", // NEEDS QC
		shortDesc: "Greift mit der Verteidigung statt dem Angriff an.", // NEEDS QC
	},
	bodyslam: {
		name: "Bodyslam",
		// Official flavor text: "Trifft das Ziel mit vollem Körpereinsatz. Bewirkt eventuell Paralyse."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		shortDesc: "30 % Chance auf Paralyse.", // NEEDS QC
		gen5: {
			desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren.", // NEEDS QC
		},
	},
	boltbeak: {
		name: "Schockschnabel",
		// Official flavor text: "Der Anwender sticht mit einem elektrisch aufgeladenen Schnabel zu. Kommt er vor dem Ziel zum Zug, verdoppelt sich die Stärke der Attacke."
		desc: "Die Stärke wird verdoppelt, wenn der Anwender vor dem Ziel handelt.", // NEEDS QC
		shortDesc: "Doppelte Stärke, wenn der Anwender zuerst handelt.", // NEEDS QC
	},
	boltstrike: {
		name: "Blitzschlag",
		// Official flavor text: "Lädt seinen Körper mit einer gewaltigen Menge an Elektrizität auf und rammt damit das Ziel. Ziel wird eventuell paralysiert."
		desc: "Hat eine Chance von 20 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "20 % Chance auf Paralyse.", // NEEDS QC
	},
	boneclub: {
		name: "Knochenkeule",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 10 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "10 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	bonemerang: {
		name: "Knochmerang",
		// Official flavor text: "Ein Bumerang aus Knochen, der zweimal trifft."
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		shortDesc: "Trifft 2-mal in einer Runde.", // NEEDS QC
		gen4: {
			desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	bonerush: {
		name: "Knochenhatz",
		// Official flavor text: "Greift Ziel zwei- bis fünfmal in Folge mit einem harten Knochen an."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
	},
	boomburst: {
		name: "Überschallknall",
		// Official flavor text: "Der Anwender greift alle Pokémon im Umkreis mit einem gewaltigen Knall an."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Pokémon.", // NEEDS QC
	},
	bounce: {
		name: "Sprungfeder",
		// Official flavor text: "Anwender springt und landet in der nächsten Runde auf dem Ziel. Das Ziel wird eventuell paralysiert."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Windstoß, Orkan, Himmelhieb, Katapult, Tausend Pfeile, Donner und Windhose, wobei Windstoß und Windhose gegen ihn doppelte Stärke haben. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Springt hoch, trifft in Runde 2. 30 % Paralyse.", // NEEDS QC
		gen5: {
			desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Windstoß, Orkan, Himmelhieb, Katapult, Donner und Windhose, wobei Windstoß und Windhose gegen ihn doppelte Stärke haben. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen4: {
			desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Windstoß, Himmelhieb, Donner und Windhose, wobei Windstoß und Windhose gegen ihn doppelte Stärke haben. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen3: {
			desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Windstoß, Himmelhieb, Donner und Windhose, wobei Windstoß und Windhose gegen ihn doppelte Stärke haben.", // NEEDS QC
		},

		prepare: "{POKEMON} springt hoch in die Luft!",
	},
	bouncybubble: {
		name: "Blubbsauger",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 50 % des Schadens.", // NEEDS QC
	},
	branchpoke: {
		name: "Zweigstoß",
		// Official flavor text: "Der Anwender attackiert das Ziel mit einem spitzen Zweig."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	bravebird: {
		name: "Sturzflug",
		// Official flavor text: "Anwender greift aus niedriger Höhe an. Er erleidet bei dieser Attacke selbst großen Schaden."
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 33 % der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "33 % Rückstoßschaden.", // NEEDS QC
		gen4: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/3 der verlorenen KP, abgerundet, aber mindestens 1 KP.", // NEEDS QC
			shortDesc: "Hat 1/3 Rückstoß.", // NEEDS QC
		},
	},
	breakingswipe: {
		name: "Breitseite",
		// Official flavor text: "Der Anwender schwingt heftig seinen robusten Schweif, um damit gegnerische Pokémon anzugreifen und ihren Angriffs-Wert zu senken."
		desc: "Hat eine Chance von 100 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Angriff der Gegner.", // NEEDS QC
	},
	breakneckblitz: {
		name: "Hyper-Sprintangriff",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	brickbreak: {
		name: "Durchbruch",
		// Official flavor text: "Ein beherzter Handkantenschlag. Durchbricht Barrieren wie Lichtschild und Reflektor."
		desc: "Verfehlt dieser Angriff nicht, enden die Effekte von Reflektor, Lichtschild und Auroraschleier auf der Seite des Ziels vor der Schadensberechnung.", // NEEDS QC
		shortDesc: "Zerstört Schilde, außer das Ziel ist immun.", // NEEDS QC
		gen6: {
			desc: "Verfehlt dieser Angriff nicht, enden die Effekte von Reflektor und Lichtschild auf der Seite des Ziels vor der Schadensberechnung.", // NEEDS QC
		},
		gen4: {
			desc: "Verfehlt dieser Angriff nicht, enden die Effekte von Reflektor und Lichtschild auf der Seite des Ziels vor der Schadensberechnung, unabhängig davon, ob das Ziel immun ist.", // NEEDS QC
			shortDesc: "Zerstört Schilde, selbst wenn das Ziel immun ist.", // NEEDS QC
		},
		gen3: {
			desc: "Verfehlt dieser Angriff nicht, enden die Effekte von Reflektor und Lichtschild auf der gegnerischen Seite vor der Schadensberechnung, unabhängig davon, ob das Ziel immun ist.", // NEEDS QC
		},

		activate: "  {POKEMON} zerschmettert den Schutz von {TEAM}!", // NEEDS QC
	},
	brine: {
		name: "Lake",
		// Official flavor text: "Hat das Ziel die Hälfte oder weniger seiner maximalen KP, trifft diese Attacke mit doppelter Kraft."
		desc: "Die Stärke wird verdoppelt, wenn das Ziel die Hälfte oder weniger seiner maximalen KP hat.", // NEEDS QC
		shortDesc: "Doppelte Stärke bei halben KP des Ziels oder weniger.", // NEEDS QC
	},
	brutalswing: {
		name: "Wirbler",
		// Official flavor text: "Der Anwender dreht schwungvoll seinen Körper und fügt allen Pokémon im Umkreis dabei Schaden zu."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Pokémon.", // NEEDS QC
	},
	bubble: {
		name: "Blubber",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 10 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Initiative der Gegner.", // NEEDS QC
		gen1: {
			desc: "Hat eine Chance von 33 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
			shortDesc: "33 % Chance auf -1 Initiative des Ziels.", // NEEDS QC
		},
		gen2: {
			shortDesc: "10 % Chance auf -1 Init. des Ziels.", // NEEDS QC
		},
	},
	bubblebeam: {
		name: "Blubbstrahl",
		// Official flavor text: "Versprüht Blasen, die eventuell den Initiative-Wert des Zieles senken."
		desc: "Hat eine Chance von 10 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Init. des Ziels.", // NEEDS QC
		gen1: {
			desc: "Hat eine Chance von 33 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
			shortDesc: "33 % Chance auf -1 Initiative des Ziels.", // NEEDS QC
		},
	},
	bugbite: {
		name: "Käferbiss",
		// Official flavor text: "Anwender beißt das Ziel. Trägt dieses eine Beere, isst der Anwender sie und erhält ihren Effekt."
		desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, stiehlt er die getragene Beere des Ziels und isst sie sofort, wobei er ihre Effekte erhält, selbst wenn sein eigenes Item ignoriert wird. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		shortDesc: "Stiehlt und isst die Beere des Ziels.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stiehlt die getragene Beere des Ziels und isst sie sofort, wobei er ihre Effekte erhält, sofern sein eigenes Item nicht ignoriert wird. Durch diese Attacke verlorene Items können mit Aufbereitung zurückgeholt werden.", // NEEDS QC
		},

		removeItem: "  {SOURCE} hat dem Ziel seine {ITEM} weggefuttert!",
	},
	bugbuzz: {
		name: "Käfergebrumm",
		// Official flavor text: "Anwender erzeugt Schallwellen, die beim Ziel Schaden verursachen und eventuell dessen Spezial-Verteidigung senken."
		desc: "Hat eine Chance von 10 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	bulkup: {
		name: "Protzer",
		// Official flavor text: "Der Anwender spannt seine Muskeln an, um den Angriff und die Verteidigung zu erhöhen."
		desc: "Erhöht den Angriff und die Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Ang. und Vert. des Anwenders.", // NEEDS QC
	},
	bulldoze: {
		name: "Dampfwalze",
		// Official flavor text: "Anwender walzt den Boden platt und greift dabei alle Pokémon im Umkreis an. Die Initiative aller betroffenen Pokémon sinkt."
		desc: "Hat eine Chance von 100 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Init. benachbarter Pokémon.", // NEEDS QC
	},
	bulletpunch: {
		name: "Patronenhieb",
		// Official flavor text: "Erstschlag-Attacke, bei der das Ziel von ultraschnellen Hieben getroffen wird."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
	},
	bulletseed: {
		name: "Kugelsaat",
		// Official flavor text: "Der Anwender wirft zwei- bis fünfmal in rascher Folge Samen auf das Ziel."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
	},
	burningbulwark: {
		name: "Flammenschild",
		desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke zu treffen versuchen, werden verbrannt. Nicht schädigende Attacken durchdringen diesen Schutz. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Schützt vor Angriffen. Kontakt: Verbrennung.", // NEEDS QC
	},
	burningjealousy: {
		name: "Neidflammen",
		// Official flavor text: "Der Anwender greift mit der Energie seines Neids an und fügt allen gegnerischen Pokémon, deren Statuswerte in dieser Runde erhöht wurden, Verbrennungen zu."
		desc: "Hat eine Chance von 100 %, das Ziel zu verbrennen, wenn seine Statuswerte in dieser Runde erhöht wurden.", // NEEDS QC
		shortDesc: "100 % Verbrennung, wenn das Ziel Werte erhöht hat.", // NEEDS QC
	},
	burnup: {
		name: "Ausbrennen",
		// Official flavor text: "Der Anwender nutzt das gesamte Feuer in seinem Körper, um großen Schaden auszuteilen. Die restliche Kampfdauer gehört er nicht mehr dem Typ Feuer an."
		desc: "Schlägt fehl, wenn der Anwender nicht vom Typ Feuer ist. Gelingt diese Attacke und ist der Anwender nicht terakristallisiert, verliert er seinen Typ Feuer, solange er im Kampf bleibt.", // NEEDS QC
		shortDesc: "Verliert seinen Feuer-Typ; nur als Feuer-Typ.", // NEEDS QC
		gen8: {
			desc: "Schlägt fehl, wenn der Anwender kein Feuer-Pokémon ist. Gelingt diese Attacke, verliert der Anwender seinen Typ Feuer, solange er im Kampf bleibt, und wird typenlos.", // NEEDS QC
		},

		typeChange: "  {POKEMON} braucht sein Feuer komplett auf!",
	},
	buzzybuzz: {
		name: "Knisterladung",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 100 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "100 % Chance auf Paralyse.", // NEEDS QC
	},
	calmmind: {
		name: "Gedankengut",
		// Official flavor text: "Erhöht Spezial-Angriff und Spezial-Verteidigung durch Konzentration."
		desc: "Erhöht den Spezial-Angriff und die Spezial-Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Sp.-Ang. und Sp.-Vert. des Anwenders.", // NEEDS QC
	},
	camouflage: {
		name: "Tarnung",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Der Typ des Anwenders ändert sich je nach Untergrund: Typ Normal auf normalem Untergrund, Typ Elektro auf einem Elektrofeld, Typ Fee auf einem Nebelfeld, Typ Pflanze auf einem Grasfeld und Typ Psycho auf einem Psychofeld. Schlägt fehl, wenn der Typ des Anwenders nicht geändert werden kann oder er bereits ausschließlich diesen Typ hat.", // NEEDS QC
		shortDesc: "Typ je nach Untergrund (standardmäßig Normal).", // NEEDS QC
		gen6: {
			desc: "Der Typ des Anwenders ändert sich je nach Untergrund: Typ Normal auf normalem Untergrund, Typ Elektro auf einem Elektrofeld, Typ Fee auf einem Nebelfeld und Typ Pflanze auf einem Grasfeld. Schlägt fehl, wenn der Typ des Anwenders nicht geändert werden kann oder er bereits ausschließlich diesen Typ hat.", // NEEDS QC
		},
		gen5: {
			desc: "Der Typ des Anwenders ändert sich je nach Untergrund: Typ Boden auf normalem Untergrund. Schlägt fehl, wenn der Typ des Anwenders nicht geändert werden kann oder er bereits ausschließlich diesen Typ hat.", // NEEDS QC
			shortDesc: "Ändert den Typ je nach Untergrund. (Boden)", // NEEDS QC
		},
		gen4: {
			desc: "Der Typ des Anwenders ändert sich je nach Untergrund: Typ Normal auf normalem Untergrund. Schlägt fehl, wenn der Anwender die Fähigkeit Variabilität hat oder der Typ bereits einer seiner aktuellen Typen ist.", // NEEDS QC
			shortDesc: "Ändert den Typ je nach Untergrund. (Normal)", // NEEDS QC
		},
		gen3: {
			desc: "Der Typ des Anwenders ändert sich je nach Untergrund: Typ Normal auf normalem Untergrund. Schlägt fehl, wenn der Typ bereits einer der aktuellen Typen des Anwenders ist.", // NEEDS QC
		},
	},
	captivate: {
		name: "Liebreiz",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Senkt den Spezial-Angriff des Ziels um 2 Stufen. Das Ziel bleibt unbeeinflusst, wenn es dasselbe Geschlecht wie der Anwender hat oder einer von beiden geschlechtslos ist. Pokémon mit der Fähigkeit Dösigkeit sind immun.", // NEEDS QC
		shortDesc: "-2 Sp.-Ang. bei Gegnern des anderen Geschlechts.", // NEEDS QC
	},
	catastropika: {
		name: "Perfektes Pika-Projektil",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	ceaselessedge: {
		name: "Klingenschwall",
		desc: "Gelingt diese Attacke, legt sie auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Es können höchstens drei Schichten ausgelegt werden: Gegner verlieren 1/8 ihrer maximalen KP bei einer Schicht, 1/6 bei zwei und 1/4 bei drei Schichten, abgerundet. Kann von der gegnerischen Seite entfernt werden, wenn ein Pokémon Aufräumen einsetzt oder ein Gegner Letalwirbler, Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		shortDesc: "Legt eine Schicht Stachler beim Gegner aus.", // NEEDS QC
	},
	celebrate: {
		name: "Ehrentag",
		shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC

		activate: "  Glückwunsch, {TRAINER}!",
	},
	charge: {
		name: "Ladevorgang",
		// Official flavor text: "Hebt die Stärke für die kommende Elektro-Attacke an und erhöht die Spezial-Verteidigung."
		desc: "Erhöht die Spezial-Verteidigung des Anwenders um eine Stufe. Sein nächster Angriff vom Typ Elektro hat doppelte Stärke; der Effekt endet, wenn der Anwender den Kampf verlässt oder nachdem er versucht hat, eine andere Attacke vom Typ Elektro als Ladevorgang einzusetzen, auch ohne Erfolg.", // NEEDS QC
		shortDesc: "+1 Sp.-Vert.; nächste Elektro-Attacke verdoppelt.", // NEEDS QC
		gen8: {
			desc: "Erhöht die Spezial-Verteidigung des Anwenders um eine Stufe. Setzt der Anwender in der nächsten Runde einen Angriff vom Typ Elektro ein, wird dessen Stärke verdoppelt.", // NEEDS QC
			shortDesc: "+1 Sp.-Vert. Nächste Elektro-Attacke mit 2x Stärke.", // NEEDS QC
		},
		gen3: {
			desc: "Setzt der Anwender in der nächsten Runde einen Angriff vom Typ Elektro ein, wird dessen Stärke verdoppelt.", // NEEDS QC
			shortDesc: "Nächste Elektro-Attacke des Anwenders: 2x Stärke.", // NEEDS QC
		},

		start: "  {POKEMON} lädt sich auf!",
	},
	chargebeam: {
		name: "Ladestrahl",
		// Official flavor text: "Ziel wird von einem Elektrostrahl getroffen. Erhöht eventuell Spezial-Angriff des Anwenders."
		desc: "Hat eine Chance von 70 %, den Spezial-Angriff des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "70 % Chance auf +1 Sp.-Ang. des Anwenders.", // NEEDS QC
	},
	charm: {
		name: "Charme",
		// Official flavor text: "Betört das Ziel und reduziert dessen Angriffs-Wert stark."
		desc: "Senkt den Angriff des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Angriff des Ziels um 2 Stufen.", // NEEDS QC
	},
	chatter: {
		name: "Geschwätz",
		// Official flavor text: "Der Anwender labert das Ziel zu und greift es mit den dadurch entstehenden Schallwellen an, wodurch das Ziel verwirrt wird."
		desc: "Hat eine Chance von 100 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "100 % Chance auf Verwirrung.", // NEEDS QC
		gen5: {
			desc: "Hat eine Chance von X %, das Ziel zu verwirren, wobei X 0 ist, außer der Anwender ist ein nicht verwandeltes Plaudagei. Ist der Anwender ein Plaudagei, ist X je nach Lautstärke des aufgenommenen Rufs 0 oder 10: 0 bei geringer Lautstärke oder ohne Aufnahme, 10 bei mittlerer bis hoher Lautstärke.", // NEEDS QC
			shortDesc: "Bei Plaudagei: 10 % Chance auf Verwirrung.", // NEEDS QC
		},
		gen4: {
			desc: "Hat eine Chance von X %, das Ziel zu verwirren, wobei X 0 ist, außer der Anwender ist ein nicht verwandeltes Plaudagei. Ist der Anwender ein Plaudagei, ist X je nach Lautstärke des aufgenommenen Rufs 1, 11 oder 31: 1 ohne Aufnahme oder bei geringer Lautstärke, 11 bei mittlerer und 31 bei hoher Lautstärke.", // NEEDS QC
			shortDesc: "Bei Plaudagei: 31 % Chance auf Verwirrung.", // NEEDS QC
		},
	},
	chillingwater: {
		name: "Kalte Dusche",
		desc: "Hat eine Chance von 100 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Ang. des Ziels.", // NEEDS QC
	},
	chillyreception: {
		name: "Eisige Stimmung",
		desc: "5 Runden lang schneit es. Der Anwender wird ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn kein anderes Teammitglied kampffähig ist.", // NEEDS QC
		shortDesc: "Erzeugt Schnee, und der Anwender wechselt aus.", // NEEDS QC

		prepare: "  {POKEMON} erzählt einen schlechten Witz, der nicht besonders gut ankommt...",
	},
	chipaway: {
		name: "Zermürben",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Ignoriert die Statusveränderungen des Ziels, einschließlich Fluchtwert.", // NEEDS QC
		shortDesc: "Ignoriert die Statusveränderungen des Ziels.", // NEEDS QC
	},
	chloroblast: {
		name: "Chlorostrahl",
		desc: "Gelingt diese Attacke, verliert der Anwender die Hälfte seiner maximalen KP, aufgerundet, außer er hat die Fähigkeit Magieschild oder Steinhaupt.", // NEEDS QC
		shortDesc: "Der Anwender verliert die Hälfte seiner max. KP.", // NEEDS QC
	},
	circlethrow: {
		name: "Überkopfwurf",
		// Official flavor text: "Schleudert das Ziel davon und bewirkt damit, dass ein anderes Pokémon eingewechselt wird. Beendet Kämpfe gegen wilde Pokémon."
		desc: "Sind weder Anwender noch Ziel kampfunfähig, wird das Ziel gezwungen, das Feld zu verlassen, und durch einen zufällig gewählten kampffähigen Mitstreiter ersetzt. Dieser Effekt schlägt fehl, wenn das Ziel unter dem Effekt von Verwurzler steht, die Fähigkeit Saugnapf hat oder diese Attacke einen Delegator getroffen hat.", // NEEDS QC
		shortDesc: "Tauscht das Ziel gegen einen zufälligen Mitstreiter.", // NEEDS QC
	},
	clamp: {
		name: "Schnapper",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen7: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP (1/8 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang (immer fünf mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
			shortDesc: "Fängt und schädigt das Ziel 2-5 Runden lang.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es Stafette einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender setzt diese Attacke zwei bis fünf Runden lang ein. Hält mit einer Chance von 3/8 zwei oder drei Runden und mit einer Chance von 1/8 vier oder fünf Runden an. Der für die erste Runde berechnete Schaden wird für jede weitere Runde übernommen. Der Anwender kann keine Attacke wählen und das Ziel kann während des Effekts keine Attacke ausführen, aber beide können ausgewechselt werden. Wird der Anwender ausgewechselt, kann das Ziel in dieser Runde weiterhin keine Attacke ausführen. Wird das Ziel ausgewechselt, setzt der Anwender diese Attacke automatisch erneut ein; hatte sie dabei 0 AP, werden es 63. Wird der Anwender oder das Ziel ausgewechselt oder der Anwender am Handeln gehindert, endet der Effekt. Diese Attacke kann das Ziel auch bei Typ-Immunität am Handeln hindern, fügt dann aber keinen Schaden zu.", // NEEDS QC
			shortDesc: "Das Ziel kann 2-5 Runden nicht handeln.", // NEEDS QC
		},

		start: "  {POKEMON} wurde von {SOURCE} geschnappt!",
		move: "#wrap",
	},
	clangingscales: {
		name: "Schuppenrasseln",
		// Official flavor text: "Der Anwender erzeugt durch das Rasseln mit seinen Schuppen ein lautes Geräusch und greift gegnerische Pokémon an. Anschließend sinkt seine Verteidigung."
		desc: "Senkt die Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
	},
	clangoroussoul: {
		name: "Seelentanz",
		// Official flavor text: "Der Anwender setzt eine kleine Menge an KP ein, um alle seine Statuswerte zu erhöhen."
		desc: "Erhöht Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung und Initiative des Anwenders um eine Stufe im Tausch gegen 33 % seiner maximalen KP, abgerundet. Schlägt fehl, wenn der Anwender kampfunfähig würde oder sich keine dieser Stufen ändern würde.", // NEEDS QC
		shortDesc: "Kostet 1/3 der max. KP. +1 auf alle Statuswerte.", // NEEDS QC
	},
	clangoroussoulblaze: {
		name: "Rasselnder Seelentanz",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Erhöht Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung und Initiative des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Ang., Vert., Sp.-Ang., Sp.-Vert. und Init.", // NEEDS QC
	},
	clearsmog: {
		name: "Klärsmog",
		shortDesc: "Setzt alle Statusveränderungen des Ziels auf 0.", // NEEDS QC
	},
	closecombat: {
		name: "Nahkampf",
		// Official flavor text: "Nahkampf-Attacke ohne Rücksicht auf Verluste. Senkt Verteidigung und Spezial-Verteidigung des Anwenders."
		desc: "Senkt die Verteidigung und die Spezial-Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Vert. und Sp.-Vert. des Anwenders.", // NEEDS QC
	},
	coaching: {
		name: "Coaching",
		// Official flavor text: "Der Anwender sorgt durch geschickte Anweisungen dafür, dass der Angriff und die Verteidigung seiner Mitstreiter steigen."
		desc: "Erhöht den Angriff und die Verteidigung des Ziels um eine Stufe. Schlägt fehl, wenn kein Mitstreiter neben dem Anwender steht.", // NEEDS QC
		shortDesc: "+1 Angriff und Verteidigung für einen Mitstreiter.", // NEEDS QC
	},
	coil: {
		name: "Einrollen",
		// Official flavor text: "Anwender rollt sich zusammen und sammelt sich. Dabei werden Angriff, Verteidigung und Genauigkeit erhöht."
		desc: "Erhöht den Angriff, die Verteidigung und die Genauigkeit des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Angriff, Verteidigung und Genauigkeit.", // NEEDS QC
	},
	collisioncourse: {
		name: "Kollisionskurs",
		desc: "Der Schaden wird mit 1,3333 multipliziert, wenn diese Attacke sehr effektiv gegen das Ziel ist.", // NEEDS QC
		shortDesc: "Schaden x1,3333, wenn sehr effektiv.", // NEEDS QC
	},
	combattorque: {
		name: "Raufturbo",
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "30 % Chance auf Paralyse.", // NEEDS QC
	},
	cometpunch: {
		name: "Kometenhieb",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Der Schaden wird nur für den ersten Treffer berechnet und für jeden weiteren übernommen. Zerbricht einer der Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	comeuppance: {
		name: "Vendetta",
		desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem physischen oder speziellen Angriff getroffen hat, Schaden in Höhe des 1,5-Fachen der dabei verlorenen KP zu, abgerundet. Hat der Anwender dabei keine KP verloren, verursacht diese Attacke 1 KP Schaden. Ist die Position dieses Gegners nicht mehr besetzt und ein anderer Gegner auf dem Feld, wird ihm der Schaden zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem physischen oder speziellen Angriff eines Gegners getroffen wurde.", // NEEDS QC
		shortDesc: "Wird er getroffen, zahlt er 1,5x zurück.", // NEEDS QC
	},
	confide: {
		name: "Vertrauenssache",
		// Official flavor text: "Der Anwender vertraut dem Ziel ein Geheimnis an und stört auf diese Weise dessen Konzentration. Der Spezial-Angriff des Zieles sinkt."
		desc: "Senkt den Spezial-Angriff des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Sp.-Ang. des Ziels um eine Stufe.", // NEEDS QC
	},
	confuseray: {
		name: "Konfusstrahl",
		// Official flavor text: "Ein fieser Strahl, der das Ziel verwirrt."
		desc: "Verwirrt das Ziel.", // NEEDS QC
		shortDesc: "Verwirrt das Ziel.", // NEEDS QC
	},
	confusion: {
		name: "Konfusion",
		// Official flavor text: "Das Ziel wird von schwacher telekinetischer Energie getroffen und eventuell verwirrt."
		desc: "Hat eine Chance von 10 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "10 % Chance auf Verwirrung.", // NEEDS QC
	},
	constrict: {
		name: "Umklammerung",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 10 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Init. des Ziels.", // NEEDS QC
		gen1: {
			desc: "Hat eine Chance von 33 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
			shortDesc: "33 % Chance auf -1 Initiative des Ziels.", // NEEDS QC
		},
	},
	continentalcrush: {
		name: "Apokalyptische Steinpresse",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	conversion: {
		name: "Umwandlung",
		// Official flavor text: "Wandelt den Typ des Anwenders in den Typ seiner ersten Attacke um."
		desc: "Der Typ des Anwenders wird zum ursprünglichen Typ der Attacke in seinem ersten Attackenplatz. Schlägt fehl, wenn der Anwender seinen Typ nicht ändern kann oder dieser Typ bereits einer seiner aktuellen Typen ist.", // NEEDS QC
		shortDesc: "Nimmt den Typ seiner ersten Attacke an.", // NEEDS QC
		gen5: {
			desc: "Der Typ des Anwenders wird zufällig zum ursprünglichen Typ einer seiner Attacken außer dieser, aber zu keinem seiner aktuellen Typen. Schlägt fehl, wenn der Anwender seinen Typ nicht ändern kann oder diese Attacke nur einen seiner aktuellen Typen wählen könnte.", // NEEDS QC
			shortDesc: "Ändert den Typ passend zu einer eigenen Attacke.", // NEEDS QC
		},
		gen4: {
			desc: "Der Typ des Anwenders wird zufällig zum ursprünglichen Typ einer seiner Attacken außer dieser und Fluch, aber zu keinem seiner aktuellen Typen. Schlägt fehl, wenn der Anwender seinen Typ nicht ändern kann oder diese Attacke nur einen seiner aktuellen Typen wählen könnte.", // NEEDS QC
		},
		gen3: {
			desc: "Der Typ des Anwenders wird zufällig zum ursprünglichen Typ einer seiner Attacken außer Fluch, aber zu keinem seiner aktuellen Typen. Schlägt fehl, wenn der Anwender seinen Typ nicht ändern kann oder diese Attacke nur einen seiner aktuellen Typen wählen könnte.", // NEEDS QC
		},
		gen1: {
			desc: "Die Typen des Anwenders werden zu den aktuellen Typen des Ziels.", // NEEDS QC
			shortDesc: "Nimmt die Typen des Ziels an.", // NEEDS QC
		},

		typeChange: "  {SOURCE}s Elem. adaptiert!",
	},
	conversion2: {
		name: "Umwandlung2",
		// Official flavor text: "Anwender ändert Typ und wird gegen letzten Angriffstyp resistent."
		desc: "Der Typ des Anwenders wird zu einem Typ, der gegen den Typ der zuletzt vom Ziel eingesetzten Attacke resistent oder immun ist, aber keiner seiner aktuellen Typen. Verwendet wird der bestimmte Typ der Attacke, nicht ihr ursprünglicher. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender seinen Typ nicht ändern kann oder diese Attacke nur einen seiner aktuellen Typen wählen könnte.", // NEEDS QC
		shortDesc: "Nimmt einen Typ an, der die letzte Attacke aushält.", // NEEDS QC
		gen4: {
			desc: "Der Typ des Anwenders wird zu einem Typ, der gegen den Typ der zuletzt gegen ihn eingesetzten Attacke resistent oder immun ist, sofern sie erfolgreich war, aber zu keinem seiner aktuellen Typen. Verwendet wird der bestimmte Typ der Attacke, nicht ihr ursprünglicher. Schlägt fehl, wenn die zuletzt gegen den Anwender eingesetzte Attacke nicht erfolgreich war, wenn der Anwender die Fähigkeit Variabilität hat oder diese Attacke nur einen seiner aktuellen Typen wählen könnte.", // NEEDS QC
			shortDesc: "Wird zum Typ, der die letzte Attacke resistiert.", // NEEDS QC
		},
		gen3: {
			desc: "Der Typ des Anwenders wird zu einem Typ, der gegen den Typ der zuletzt gegen ihn eingesetzten Attacke resistent oder immun ist, sofern sie erfolgreich war, aber zu keinem seiner aktuellen Typen. Verwendet wird der bestimmte Typ der Attacke, nicht ihr ursprünglicher, wobei Verzweifler als Typ Normal gilt. Schlägt fehl, wenn die zuletzt gegen den Anwender eingesetzte Attacke nicht erfolgreich war oder diese Attacke nur einen seiner aktuellen Typen wählen könnte.", // NEEDS QC
		},
		gen2: {
			desc: "Der Typ des Anwenders wird zu einem Typ, der gegen den Typ der zuletzt vom Gegner eingesetzten Attacke resistent oder immun ist, selbst wenn es einer seiner aktuellen Typen ist. Verwendet wird der ursprüngliche Typ der Attacke, nicht der bestimmte. Schlägt fehl, wenn der Gegner noch keine Attacke eingesetzt hat.", // NEEDS QC
			shortDesc: "Wird zum Typ, der die letzte Attacke resistiert.", // NEEDS QC
		},
	},
	copycat: {
		name: "Imitator",
		// Official flavor text: "Anwender imitiert die gerade verwendete Attacke. Dies schlägt fehl, falls zuvor keine Attacke verwendet wurde."
		desc: "Der Anwender setzt die zuletzt von einem beliebigen Pokémon eingesetzte Attacke ein, auch von sich selbst. Schlägt fehl, wenn noch keine Attacke eingesetzt wurde oder die letzte Attacke Zuschuss, Bunker, Schnabelkanone, Gigantenstoß, Gigantenhieb, Rülpser, Offerte, Hitzeturbo, Ehrentag, Geschwätz, Überkopfwurf, Raufturbo, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Drachenrute, Dynamax-Kanone, Ausdauer, Offenlegung, Power-Punch, Spotlight, Rechte Hand, Händchenhalten, Königsschild, Zauberturbo, Tatami-Schild, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Toxiturbo, Schutzschild, Wutpulver, Brüller, Panzerfalle, Nachahmer, Schlafrede, Übernahme, Schutzstacheln, Rampenlicht, Verzweifler, Wechseldich, Tera-Sternhagel, Raub, Wandler, Trickbetrug, Wirbelwind oder Finsterturbo war.", // NEEDS QC
		shortDesc: "Setzt die zuletzt eingesetzte Attacke ein.", // NEEDS QC
		gen8: {
			desc: "Der Anwender setzt die zuletzt von einem beliebigen Pokémon eingesetzte Attacke ein, auch von sich selbst. Bei Dynamax- und Gigadynamax-Attacken zählt die zugrunde liegende Attacke. Schlägt fehl, wenn noch keine Attacke eingesetzt wurde oder die letzte Attacke Zuschuss, Bunker, Schnabelkanone, Gigantenstoß, Gigantenhieb, Rülpser, Offerte, Ehrentag, Geschwätz, Überkopfwurf, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Drachenrute, Dynamax-Kanone, Ausdauer, Offenlegung, Power-Punch, Spotlight, Rechte Hand, Händchenhalten, Königsschild, Tatami-Schild, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Schutzschild, Wutpulver, Brüller, Panzerfalle, Nachahmer, Schlafrede, Übernahme, Schutzstacheln, Rampenlicht, Verzweifler, Wechseldich, Raub, Wandler, Trickbetrug oder Wirbelwind war.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender setzt die zuletzt von einem beliebigen Pokémon eingesetzte Attacke ein, auch von sich selbst. Schlägt fehl, wenn noch keine Attacke eingesetzt wurde oder die letzte Attacke Zuschuss, Bunker, Schnabelkanone, Rülpser, Offerte, Ehrentag, Geschwätz, Überkopfwurf, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Drachenrute, Ausdauer, Offenlegung, Power-Punch, Spotlight, Rechte Hand, Händchenhalten, Königsschild, Tatami-Schild, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Schutzschild, Wutpulver, Brüller, Panzerfalle, Nachahmer, Schlafrede, Übernahme, Schutzstacheln, Rampenlicht, Verzweifler, Wechseldich, Raub, Wandler, Trickbetrug oder Wirbelwind oder eine Z-Attacke war.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender setzt die zuletzt von einem beliebigen Pokémon eingesetzte Attacke ein, auch von sich selbst. Schlägt fehl, wenn noch keine Attacke eingesetzt wurde oder die letzte Attacke Zuschuss, Rülpser, Offerte, Ehrentag, Geschwätz, Überkopfwurf, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Drachenrute, Ausdauer, Offenlegung, Power-Punch, Spotlight, Rechte Hand, Händchenhalten, Königsschild, Tatami-Schild, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Schutzschild, Wutpulver, Brüller, Nachahmer, Schlafrede, Übernahme, Schutzstacheln, Verzweifler, Wechseldich, Raub, Wandler, Trickbetrug oder Wirbelwind war.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender setzt die zuletzt von einem beliebigen Pokémon eingesetzte Attacke ein, auch von sich selbst. Schlägt fehl, wenn noch keine Attacke eingesetzt wurde oder die letzte Attacke Zuschuss, Offerte, Geschwätz, Überkopfwurf, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Drachenrute, Ausdauer, Offenlegung, Power-Punch, Spotlight, Rechte Hand, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Schutzschild, Wutpulver, Nachahmer, Schlafrede, Übernahme, Verzweifler, Wechseldich, Raub, Wandler oder Trickbetrug war.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender setzt die zuletzt von einem beliebigen Pokémon eingesetzte Attacke ein, auch von sich selbst. Schlägt fehl, wenn noch keine Attacke eingesetzt wurde oder die letzte Attacke Zuschuss, Geschwätz, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Ausdauer, Offenlegung, Power-Punch, Spotlight, Rechte Hand, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Schutzschild, Nachahmer, Schlafrede, Übernahme, Verzweifler, Wechseldich, Raub oder Trickbetrug war.", // NEEDS QC
		},
	},
	coreenforcer: {
		name: "Sanktionskern",
		// Official flavor text: "Hat das gegnerische Pokémon, das durch diese Attacke Schaden genommen hat, in dieser Runde bereits gehandelt, verliert es seine Fähigkeit."
		desc: "Handelt der Anwender nach dem Ziel, wird dessen Fähigkeit wirkungslos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, bleibt der Nachfolger unter diesem Effekt. Ist die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Wandel, Trance-Modus oder Superwechsel, tritt dieser Effekt nicht ein, und ihn über Stafette zu erhalten beendet ihn sofort.", // NEEDS QC
		shortDesc: "Hebt Fähigkeiten von Gegnern auf, die schon handelten.", // NEEDS QC
		gen8: {
			desc: "Handelt der Anwender nach dem Ziel, wird dessen Fähigkeit wirkungslos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, bleibt der Nachfolger unter diesem Effekt. Ist die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus, tritt dieser Effekt nicht ein, und ihn über Stafette zu erhalten beendet ihn sofort.", // NEEDS QC
		},
		gen7: {
			desc: "Handelt der Anwender nach dem Ziel, wird dessen Fähigkeit wirkungslos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, bleibt der Nachfolger unter diesem Effekt. Ist die Fähigkeit des Ziels Freundschaftsakt, Dauerschlaf, Kostümspuk, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus, tritt dieser Effekt nicht ein, und ihn über Stafette zu erhalten beendet ihn sofort.", // NEEDS QC
		},
	},
	corkscrewcrash: {
		name: "Turbo-Spiralkombo",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	corrosivegas: {
		name: "Korrosionsgas",
		// Official flavor text: "Der Anwender greift alle Pokémon im Umkreis mit einem ätzenden Gas an. Getragene Items werden dadurch zersetzt."
		desc: "Das Ziel verliert sein getragenes Item. Diese Attacke kann Pokémon mit der Fähigkeit Klebekörper ihr Item nicht nehmen und Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta, einem Paradox-Pokémon oder Ogerpon nicht jeweils Blauer Edelstein, Roter Edelstein, Adamantkristall, Weißkristall, Platinumkristall, eine Tafel, ein Modul, eine Disc, Rostiges Schwert, Rostiger Schild, eine Energiekapsel oder eine Maske nehmen. In diesem Fall zählen zu den Paradox-Pokémon alle Arten mit den Fähigkeiten Paläosynthese und Quantenantrieb, außer Keilflamme, Furienblitz, Eisenfels und Eisenhaupt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		shortDesc: "Zerstört die Items benachbarter Pokémon.", // NEEDS QC
		gen8: {
			desc: "Das Ziel verliert sein getragenes Item. Diese Attacke kann Pokémon mit der Fähigkeit Klebekörper ihr Item nicht nehmen und Kyogre, Groudon, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta nicht jeweils Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul, eine Disc, Rostiges Schwert oder Rostiger Schild nehmen. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},

		fail: "#healblock",
		removeItem: "  {SOURCE} hat das Item {ITEM} von {POKEMON} zersetzt!",
	},
	cosmicpower: {
		name: "Kosmik-Kraft",
		// Official flavor text: "Erhöht Verteidigung und Spezial-Verteidigung durch eine mystische Kraft."
		desc: "Erhöht die Verteidigung und die Spezial-Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Vert. und Sp.-Vert. des Anwenders.", // NEEDS QC
	},
	cottonguard: {
		name: "Watteschild",
		// Official flavor text: "Anwender schützt sich, indem er sich in einen luftigen Flaum hüllt. Erhöht die Verteidigung drastisch."
		desc: "Erhöht die Verteidigung des Anwenders um 3 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Verteidigung des Anwenders um 3 Stufen.", // NEEDS QC
	},
	cottonspore: {
		name: "Baumwollsaat",
		// Official flavor text: "Wattebäusche heften sich an gegnerische Pokémon, deren Initiative-Wert dadurch stark sinkt."
		desc: "Senkt die Initiative des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Initiative des Ziels um 2 Stufen.", // NEEDS QC
	},
	counter: {
		name: "Konter",
		// Official flavor text: "Kontert physische Treffer und fügt dem Ziel das Doppelte des Schadens zu, den der Anwender erlitten hat."
		desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem physischen Angriff getroffen hat, Schaden in Höhe des Doppelten der dabei verlorenen KP zu. Hat der Anwender dabei keine KP verloren, verursacht diese Attacke 1 KP Schaden. Ist die Position dieses Gegners nicht mehr besetzt und ein anderer Gegner auf dem Feld, wird ihm der Schaden zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem physischen Angriff eines Gegners getroffen wurde.", // NEEDS QC
		shortDesc: "Zahlt physischen Schaden doppelt zurück.", // NEEDS QC
		gen6: {
			desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem physischen Angriff getroffen hat, Schaden in Höhe des Doppelten der dabei verlorenen KP zu. Hat der Anwender dabei keine KP verloren, richtet diese Attacke Schaden mit einer Stärke von 1 an. Ist die Position dieses Gegners nicht mehr besetzt, wird der Schaden einem zufälligen Gegner in Reichweite zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem physischen Angriff eines Gegners getroffen wurde.", // NEEDS QC
		},
		gen4: {
			desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem physischen Angriff getroffen hat, Schaden in Höhe des Doppelten der dabei verlorenen KP zu. Ist die Position dieses Gegners nicht mehr besetzt und ein anderer Gegner auf dem Feld, wird ihm der Schaden zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem physischen Angriff eines Gegners getroffen wurde oder dabei keine KP verloren hat.", // NEEDS QC
		},
		gen3: {
			desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem physischen Angriff getroffen hat, Schaden in Höhe des Doppelten der dabei verlorenen KP zu. Ist die Position dieses Gegners nicht mehr besetzt und ein anderer Gegner auf dem Feld, wird ihm der Schaden zugefügt. Kraftreserve gilt dabei als Typ Normal, und nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem physischen Angriff eines Gegners getroffen wurde oder dabei keine KP verloren hat.", // NEEDS QC
		},
		gen2: {
			desc: "Fügt dem Gegner Schaden in Höhe des Doppelten der KP zu, die der Anwender in dieser Runde durch einen physischen Angriff verloren hat. Kraftreserve gilt dabei als Typ Normal, und nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender zuerst handelt, in dieser Runde nicht von einem physischen Angriff getroffen wurde oder dabei keine KP verloren hat. Hat der Gegner Geofissur oder Hornbohrer eingesetzt und verfehlt, richtet diese Attacke 65535 Schaden an.", // NEEDS QC
		},
		gen1: {
			desc: "Fügt dem Gegner Schaden in Höhe des Doppelten des Schadens zu, den die zuletzt im Kampf eingesetzte Attacke angerichtet hat. Diese Attacke ignoriert Typ-Immunität. Schlägt fehl, wenn der Anwender zuerst handelt oder die letzte Attacke der gegnerischen Seite Konter war, 0 Stärke hatte oder nicht vom Typ Normal oder Kampf war. Schlägt fehl, wenn die letzte Attacke einer der beiden Seiten 0 Schaden angerichtet hat und nicht Konfusstrahl, Umwandlung, Energiefokus, Schlangenblick, Dunkelnebel, Egelsamen, Lichtschild, Mimikry, Weißnebel, Giftwolke, Giftpuder, Genesung, Reflektor, Erholung, Weichei, Platscher, Stachelspore, Delegator, Superschall, Teleport, Donnerwelle, Toxin oder Wandler war.", // NEEDS QC
			shortDesc: "Gibt bei Normal-/Kampf-Attacken 2x Schaden zurück.", // NEEDS QC
		},
	},
	courtchange: {
		name: "Seitenwechsel",
		// Official flavor text: "Durch eine mysteriöse Macht werden wirksame Effekte auf Mitstreiterseite und gegnerischer Seite getauscht."
		desc: "Tauscht die Effekte von Weißnebel, Lichtschild, Reflektor, Stachler, Bodyguard, Rückenwind, Giftspitzen, Tarnsteine, Wassersäulen, Feuersäulen, Pflanzensäulen, Klebenetz, Auroraschleier, Giga-Stahlschlag, Giga-Beschuss, Giga-Geißel und Giga-Feuerflug zwischen der Seite des Anwenders und der gegnerischen Seite.", // NEEDS QC
		shortDesc: "Tauscht die Feldeffekte beider Seiten.", // NEEDS QC

		activate: "  {POKEMON} hat die Effekte, die auf den beiden Seiten des Kampffeldes wirken, miteinander getauscht!",
	},
	covet: {
		name: "Bezirzer",
		// Official flavor text: "Der Anwender schmeichelt sich beim Ziel ein und stiehlt dann das von ihm getragene Item."
		desc: "Gelingt dieser Angriff und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es Blauer Edelstein, Roter Edelstein, Adamantkristall, Weißkristall, Platinumkristall, eine Tafel, ein Modul, eine Disc, Rostiges Schwert, Rostiger Schild, eine Energiekapsel oder eine Maske ist, getragen jeweils von Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta, einem Paradox-Pokémon oder Ogerpon, oder wenn der Anwender eine dieser Arten ist und das Ziel das entsprechende Item trägt. In diesem Fall zählen zu den Paradox-Pokémon alle Arten mit den Fähigkeiten Paläosynthese und Quantenantrieb, außer Keilflamme, Furienblitz, Eisenfels und Eisenhaupt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		shortDesc: "Ohne eigenes Item stiehlt er das des Ziels.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "War dieser Angriff erfolgreich und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul, eine Disc, Rostiges Schwert oder Rostiger Schild ist und jeweils von Kyogre, Groudon, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta getragen wird, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen7: {
			desc: "War dieser Angriff erfolgreich und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es ein Z-Kristall ist, ein Mega-Stein, der von der Art getragen wird, die sich damit mega-entwickeln kann, oder Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul oder eine Disc, jeweils getragen von Kyogre, Groudon, Giratina, Arceus, Genesect, Amigento, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen6: {
			desc: "War dieser Angriff erfolgreich und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es ein Mega-Stein ist, der von der Art getragen wird, die sich damit mega-entwickeln kann, oder Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel oder ein Modul, jeweils getragen von Kyogre, Groudon, Giratina, Arceus, Genesect, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen5: {
			desc: "War dieser Angriff erfolgreich und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es ein Brief ist oder Platinum-Orb, eine Tafel oder ein Modul, jeweils getragen von Giratina, Arceus oder Genesect, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen4: {
			desc: "War dieser Angriff erfolgreich und trägt der Anwender kein Item, stiehlt er das getragene Item des Ziels. Das Item wird nicht gestohlen, wenn es ein Brief oder Platinum-Orb ist oder das Ziel die Fähigkeit Variabilität oder Klebekörper hat. Durch diese Attacke verlorene Items können nicht mit Aufbereitung zurückgeholt werden.", // NEEDS QC
		},
		gen3: {
			desc: "War dieser Angriff erfolgreich und trägt der Anwender kein Item, stiehlt er das getragene Item des Ziels. Das Item wird nicht gestohlen, wenn es ein Brief oder eine Enigmabeere ist oder das Ziel die Fähigkeit Klebekörper hat. Durch diese Attacke verlorene Items können nicht mit Aufbereitung zurückgeholt werden.", // NEEDS QC
		},
	},
	crabhammer: {
		name: "Krabbhammer",
		// Official flavor text: "Schlägt mit Schere zu. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	craftyshield: {
		name: "Trickschutz",
		// Official flavor text: "Schützt mit einer mysteriösen Macht seine Mitstreiter und sich vor Status-Attacken, nicht jedoch vor Attacken, die Schaden verursachen."
		desc: "Der Anwender und sein Team sind in dieser Runde vor nicht schädigenden Attacken anderer Pokémon geschützt, auch von Mitstreitern. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "Schützt das Team diese Runde vor Status-Attacken.", // NEEDS QC

		start: "  {TEAM} wird durch Trickschutz geschützt!",
		block: "  {POKEMON} wird durch Trickschutz geschützt!",
	},
	crosschop: {
		name: "Kreuzhieb",
		// Official flavor text: "Doppelter Hieb mit den Unterarmen. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	crosspoison: {
		name: "Giftstreich",
		// Official flavor text: "Ein schneidender Hieb, der das Ziel eventuell vergiftet. Hat eine hohe Volltrefferquote."
		desc: "Hat eine Chance von 10 %, das Ziel zu vergiften, und eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Hohe Volltrefferquote. 10 % Chance auf Gift.", // NEEDS QC
	},
	crunch: {
		name: "Knirscher",
		// Official flavor text: "Beißt mit scharfen Reißzähnen zu und senkt eventuell die Verteidigung."
		desc: "Hat eine Chance von 20 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "20 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
		gen3: {
			desc: "Hat eine Chance von 20 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
			shortDesc: "20 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
		},
	},
	crushclaw: {
		name: "Zermalmklaue",
		// Official flavor text: "Angriff mit scharfen Klauen. Senkt eventuell den Verteidigungs-Wert."
		desc: "Hat eine Chance von 50 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "50 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
	},
	crushgrip: {
		name: "Quetschgriff",
		// Official flavor text: "Ziel wird mit großer Kraft getroffen. Je höher die KP des Zieles, desto stärker die Attacke."
		desc: "Die Stärke beträgt 120 × (aktuelle KP des Ziels / maximale KP des Ziels), ab 0,5 abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Je mehr KP das Ziel hat, desto stärker.", // NEEDS QC
		gen4: {
			desc: "Die Stärke beträgt 120 × (aktuelle KP des Ziels ÷ maximale KP des Ziels) + 1, abgerundet.", // NEEDS QC
		},
	},
	curse: {
		name: "Fluch",
		// Official flavor text: "Attacke, deren Wirkung davon abhängt, ob der Anwender ein Geister-Pokémon ist."
		desc: "Ist der Anwender nicht vom Typ Geist, sinkt seine Initiative um eine Stufe und sein Angriff und seine Verteidigung steigen um eine Stufe. Ist der Anwender vom Typ Geist, verliert er die Hälfte seiner maximalen KP, abgerundet, selbst wenn er dadurch kampfunfähig wird, und das Ziel verliert am Ende jeder Runde 1/4 seiner maximalen KP, abgerundet, solange es im Kampf ist. Setzt das Ziel Stafette ein, bleibt der Nachfolger betroffen. Schlägt fehl, wenn es kein Ziel gibt oder es bereits betroffen ist.", // NEEDS QC
		shortDesc: "Geist: Fluch; sonst -1 Init., +1 Ang. und Vert.", // NEEDS QC
		gen4: {
			desc: "Ist der Anwender kein Geist-Pokémon, senkt dies seine Initiative um eine Stufe und erhöht seinen Angriff und seine Verteidigung um je eine Stufe. Ist der Anwender ein Geist-Pokémon, verliert er die Hälfte seiner maximalen KP, abgerundet und selbst wenn er dadurch kampfunfähig wird; dafür verliert das Ziel am Ende jeder Runde, in der es im Kampf ist, 1/4 seiner maximalen KP, abgerundet. Setzt das Ziel Stafette ein, bleibt der Nachfolger betroffen. Schlägt fehl, wenn es kein Ziel gibt oder das Ziel bereits betroffen ist oder einen Delegator hat.", // NEEDS QC
		},
		gen2: {
			desc: "Ist der Anwender kein Geist-Pokémon, senkt dies seine Initiative um eine Stufe und erhöht seinen Angriff und seine Verteidigung um je eine Stufe, außer Angriff und Verteidigung liegen beide bereits bei Stufe 6. Ist der Anwender ein Geist-Pokémon, verliert er die Hälfte seiner maximalen KP, abgerundet und selbst wenn er dadurch kampfunfähig wird; dafür verliert das Ziel am Ende jeder Runde, in der es im Kampf ist, 1/4 seiner maximalen KP, abgerundet. Setzt das Ziel Stafette ein, bleibt der Nachfolger betroffen. Schlägt fehl, wenn das Ziel bereits betroffen ist oder einen Delegator hat.", // NEEDS QC
		},

		start: "  {SOURCE} nimmt einen Teil seiner KP und legt einen Fluch auf {POKEMON}!",
		damage: "  {POKEMON} wurde durch den Fluch verletzt!",
	},
	cut: {
		name: "Zerschneider",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	darkestlariat: {
		name: "Dark Lariat",
		// Official flavor text: "Der Anwender wirbelt mit beiden Armen und prallt so auf das Ziel. Richtet unabhängig von den Statusveränderungen des Zieles Schaden an."
		desc: "Ignoriert die Statusveränderungen des Ziels, einschließlich Fluchtwert.", // NEEDS QC
		shortDesc: "Ignoriert die Statusveränderungen des Ziels.", // NEEDS QC
	},
	darkpulse: {
		name: "Finsteraura",
		// Official flavor text: "Anwender greift mit fürchterlicher Aura schlechter Gedanken an. Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 20 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "20 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	darkvoid: {
		name: "Schlummerort",
		// Official flavor text: "Gegnerische Pokémon werden in eine Welt der Dunkelheit gezogen und in Schlaf versetzt."
		desc: "Schläfert das Ziel ein. Diese Attacke kann nur erfolgreich eingesetzt werden, wenn die aktuelle Form des Anwenders, unter Berücksichtigung von Wandler, Darkrai ist.", // NEEDS QC
		shortDesc: "Darkrai: Schläfert die Gegner ein.", // NEEDS QC
		gen6: {
			desc: "Schläfert das Ziel ein.", // NEEDS QC
			shortDesc: "Lässt die Gegner einschlafen.", // NEEDS QC
		},

		fail: "Aber {POKEMON} kann die Attacke nicht einsetzen!",
		failWrongForme: "Aber {POKEMON} kann die Attacke im Moment nicht einsetzen!",
	},
	dazzlinggleam: {
		name: "Zauberschein",
		// Official flavor text: "Der Anwender feuert einen mächtigen Lichtblitz ab, der gegnerischen Pokémon Schaden zufügt."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Gegner.", // NEEDS QC
	},
	decorate: {
		name: "Verzierung",
		// Official flavor text: "Durch Verzierungen werden der Angriff und Spezial-Angriff des Zieles stark erhöht."
		desc: "Erhöht den Angriff und den Spezial-Angriff des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Angriff und Sp.-Ang. des Ziels um 2 Stufen.", // NEEDS QC
	},
	defendorder: {
		name: "Blockbefehl",
		// Official flavor text: "Untergebene bilden einen lebenden Schild um den Anwender. Erhöht Verteidigung und Spezial-Verteidigung."
		desc: "Erhöht die Verteidigung und die Spezial-Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Vert. und Sp.-Vert. des Anwenders.", // NEEDS QC
	},
	defensecurl: {
		name: "Einigler",
		// Official flavor text: "Verbirgt Schwächen durch Einrollen und hebt gleichzeitig den Verteidigungs-Wert."
		desc: "Erhöht die Verteidigung des Anwenders um eine Stufe. Solange der Anwender im Kampf bleibt, wird die Stärke seiner Frostbeule und Walzer verdoppelt (dieser Effekt ist nicht kumulierbar).", // NEEDS QC
		shortDesc: "Erhöht Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		gen2: {
			desc: "Erhöht die Verteidigung des Anwenders um eine Stufe. Solange der Anwender im Kampf bleibt, hat sein Walzer doppelte Stärke (nicht kumulierbar). Dieser Effekt kann mit Stafette übertragen werden.", // NEEDS QC
		},
		gen1: {
			desc: "Erhöht die Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		},
	},
	defog: {
		name: "Auflockern",
		// Official flavor text: "Starker Wind hebt Attacken wie Reflektor und Lichtschild des Zieles auf. Senkt außerdem den Ausweichwert."
		desc: "Senkt den Fluchtwert des Ziels um eine Stufe. Gelingt diese Attacke, enden – unabhängig davon, ob der Fluchtwert beeinflusst wurde – die Effekte von Reflektor, Lichtschild, Auroraschleier, Bodyguard, Weißnebel, Stachler, Giftspitzen, Tarnsteine und Klebenetz auf der Seite des Ziels sowie die Effekte von Stachler, Giftspitzen, Tarnsteine und Klebenetz auf der Seite des Anwenders. Ignoriert den Delegator des Ziels, dieser verhindert jedoch weiterhin die Fluchtwert-Senkung. Ist ein Feld aktiv und gelingt diese Attacke, wird das Feld entfernt.", // NEEDS QC
		shortDesc: "-1 Fluchtwert; entfernt Fallen und Felder beidseitig.", // NEEDS QC
		gen7: {
			desc: "Senkt den Fluchtwert des Ziels um eine Stufe. Gelingt diese Attacke, enden unabhängig davon, ob der Fluchtwert gesenkt wurde, die Effekte von Reflektor, Lichtschild, Auroraschleier, Bodyguard, Weißnebel, Stachler, Giftspitzen, Tarnsteine und Klebenetz auf der Seite des Ziels sowie die Effekte von Stachler, Giftspitzen, Tarnsteine und Klebenetz auf der Seite des Anwenders. Ignoriert den Delegator des Ziels, wobei ein Delegator die Senkung des Fluchtwerts dennoch verhindert.", // NEEDS QC
			shortDesc: "-1 Fluchtwert; entfernt Fallen auf beiden Seiten.", // NEEDS QC
		},
		gen6: {
			desc: "Senkt den Fluchtwert des Ziels um eine Stufe. Gelingt diese Attacke, enden unabhängig davon, ob der Fluchtwert gesenkt wurde, die Effekte von Reflektor, Lichtschild, Bodyguard, Weißnebel, Stachler, Giftspitzen, Tarnsteine und Klebenetz auf der Seite des Ziels sowie die Effekte von Stachler, Giftspitzen, Tarnsteine und Klebenetz auf der Seite des Anwenders. Ignoriert den Delegator des Ziels, wobei ein Delegator die Senkung des Fluchtwerts dennoch verhindert.", // NEEDS QC
		},
		gen5: {
			desc: "Senkt den Fluchtwert des Ziels um eine Stufe. Gelingt diese Attacke, enden unabhängig davon, ob der Fluchtwert gesenkt wurde, die Effekte von Reflektor, Lichtschild, Bodyguard, Weißnebel, Stachler, Giftspitzen und Tarnsteine auf der Seite des Ziels. Ignoriert den Delegator des Ziels, wobei ein Delegator die Senkung des Fluchtwerts dennoch verhindert.", // NEEDS QC
			shortDesc: "-1 Fluchtwert; entfernt Fallen/Schilde des Ziels.", // NEEDS QC
		},
	},
	destinybond: {
		name: "Abgangsbund",
		// Official flavor text: "Wird der Anwender nach Einsatz dieser Attacke kampfunfähig, führt dies auch beim Pokémon, das ihn besiegt hat, zum K.O. Scheitert bei Wiederholung."
		desc: "Macht ein gegnerischer Angriff den Anwender vor seiner nächsten Aktion kampfunfähig, wird auch dieser Gegner kampfunfähig, außer der Angriff war Kismetwunsch oder Seher. Schlägt fehl, wenn der Anwender diese Attacke bei seiner letzten Aktion bereits erfolgreich eingesetzt hat, Attacken über die Fähigkeit Tänzer nicht mitgezählt.", // NEEDS QC
		shortDesc: "Wird er besiegt, wird auch der Angreifer besiegt.", // NEEDS QC
		gen6: {
			desc: "Bis zur nächsten Runde des Anwenders wird ein Gegner, der ihn mit einem Angriff kampfunfähig macht, ebenfalls kampfunfähig, außer der Angriff war Kismetwunsch oder Seher.", // NEEDS QC
		},
		gen2: {
			desc: "Bis zur nächsten Runde des Anwenders wird ein Gegner, der ihn mit einem Angriff kampfunfähig macht, ebenfalls kampfunfähig.", // NEEDS QC
		},

		start: "  {POKEMON} versucht, den Angreifer mit sich zu nehmen!",
		activate: "{POKEMON} nimmt den Angreifer mit sich!",
	},
	detect: {
		name: "Scanner",
		// Official flavor text: "Anwender wehrt jede Attacke ab. Scheitert eventuell bei Wiederholung."
		desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Schützt den Anwender in dieser Runde vor Attacken.", // NEEDS QC
		gen8: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdoppelt. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Schutzschild, Rapidschutz oder Rundumschutz ist. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdoppelt, bis maximal 8. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer oder Schutzschild ist. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von X/65536, wobei X bei 65535 beginnt und sich bei jedem Erfolg halbiert, abgerundet. Nach dem vierten Erfolg in Folge fällt X auf 118 und nimmt bei weiteren Erfolgen scheinbar zufällige Werte von 0–65535 an. X wird auf 65535 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer oder Schutzschild ist. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender ist in dieser Runde vor Attacken des Gegners geschützt. Diese Attacke hat eine Erfolgschance von X/255, wobei X bei 255 beginnt und sich bei jedem Erfolg halbiert, abgerundet. X wird auf 255 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer oder Schutzschild ist. Schlägt fehl, wenn der Anwender einen Delegator hat oder in dieser Runde als Letzter handelt.", // NEEDS QC
		},
	},
	devastatingdrake: {
		name: "Drastisches Drachendröhnen",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	diamondstorm: {
		name: "Diamantsturm",
		// Official flavor text: "Der Anwender beschwört einen zerstörerischen Diamantsturm herauf. Kann die Verteidigung des Anwenders stark erhöhen."
		desc: "Hat eine Chance von 50 %, die Verteidigung des Anwenders um 2 Stufen zu erhöhen.", // NEEDS QC
		shortDesc: "50 % Chance auf +2 Verteidigung des Anwenders.", // NEEDS QC
		gen6: {
			desc: "Hat für jeden Treffer eine Chance von 50 %, die Verteidigung des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
			shortDesc: "50 % Chance auf +1 Vert. pro Treffer.", // NEEDS QC
		},
	},
	dig: {
		name: "Schaufler",
		// Official flavor text: "In Runde 1 gräbt sich der Anwender ein und in Runde 2 greift er an."
		desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Erdbeben und Intensität, von denen er doppelten Schaden erleidet, und wird nicht vom Wetter beeinflusst. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Gräbt sich ein, trifft in Runde 2.", // NEEDS QC
		gen4: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Erdbeben und Intensität, die gegen ihn doppelte Stärke haben, und ist zudem vom Wetter unbeeinflusst. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen3: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Erdbeben und Intensität, die gegen ihn doppelte Stärke haben, und ist zudem vom Wetter unbeeinflusst.", // NEEDS QC
		},
		gen2: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Erdbeben, Geofissur und Intensität, ist vom Wetter unbeeinflusst, und Erdbeben und Intensität haben gegen ihn doppelte Stärke.", // NEEDS QC
		},
		gen1: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Geduld, Sternschauer und Wandler. Ist der Anwender in der zweiten Runde voll paralysiert, weicht er weiterhin Attacken aus, bis er ausgewechselt wird oder die zweite Runde dieser Attacke oder von Fliegen erfolgreich ausführt.", // NEEDS QC
		},

		prepare: "{POKEMON} vergräbt sich in der Erde!",
	},
	direclaw: {
		name: "Unheilsklauen",
		desc: "Hat eine Chance von 50 %, das Ziel einzuschläfern, zu vergiften oder zu paralysieren.", // NEEDS QC
		shortDesc: "50 % Chance auf Schlaf, Gift oder Paralyse.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	disable: {
		name: "Aussetzer",
		// Official flavor text: "Die zuletzt eingesetzte Attacke des Zieles wird für vier Runden blockiert."
		desc: "Die zuletzt vom Ziel eingesetzte Attacke wird 4 Runden lang blockiert. Schlägt fehl, wenn bereits eine Attacke des Ziels blockiert ist, das Ziel noch nicht gehandelt hat, es die Attacke nicht mehr kennt oder es eine Dynamax- oder Gigadynamax-Attacke war.", // NEEDS QC
		shortDesc: "Blockiert die letzte Attacke des Ziels 4 Runden lang.", // NEEDS QC
		gen7: {
			desc: "4 Runden lang ist die zuletzt vom Ziel eingesetzte Attacke blockiert. Schlägt fehl, wenn bereits eine Attacke des Ziels blockiert ist, das Ziel noch nicht gehandelt hat, es die Attacke nicht mehr beherrscht oder die Attacke eine Z-Attacke war. Mit Z-Kraft verstärkte Attacken können während des Effekts weiterhin gewählt und eingesetzt werden.", // NEEDS QC
		},
		gen6: {
			desc: "4 Runden lang ist die zuletzt vom Ziel eingesetzte Attacke blockiert. Schlägt fehl, wenn bereits eine Attacke des Ziels blockiert ist, das Ziel noch nicht gehandelt hat oder es die Attacke nicht mehr beherrscht.", // NEEDS QC
		},
		gen4: {
			desc: "4 bis 7 Runden lang ist die zuletzt vom Ziel eingesetzte Attacke blockiert. Schlägt fehl, wenn bereits eine Attacke des Ziels blockiert ist, das Ziel noch nicht gehandelt hat, es die Attacke nicht mehr beherrscht oder die Attacke 0 AP hat.", // NEEDS QC
			shortDesc: "Blockiert die letzte Attacke des Ziels 4-7 Runden.", // NEEDS QC
		},
		gen3: {
			desc: "2 bis 5 Runden lang ist die zuletzt vom Ziel eingesetzte Attacke blockiert. Schlägt fehl, wenn bereits eine Attacke des Ziels blockiert ist, das Ziel noch nicht gehandelt hat, es die Attacke nicht mehr beherrscht oder die Attacke 0 AP hat.", // NEEDS QC
			shortDesc: "Blockiert die letzte Attacke des Ziels 2-5 Runden.", // NEEDS QC
		},
		gen2: {
			desc: "1 bis 7 Runden lang ist die zuletzt vom Ziel eingesetzte Attacke blockiert. Schlägt fehl, wenn bereits eine Attacke des Ziels blockiert ist, das Ziel noch nicht gehandelt hat, es die Attacke nicht mehr beherrscht oder die Attacke 0 AP hat.", // NEEDS QC
			shortDesc: "Blockiert die letzte Attacke des Ziels 1-7 Runden.", // NEEDS QC
		},
		gen1: {
			desc: "0 bis 7 Runden lang wird eine zufällige Attacke des Ziels mit mindestens 1 AP blockiert. Schlägt fehl, wenn bereits eine Attacke des Ziels blockiert ist oder keine seiner Attacken AP übrig hat. Setzt ein Pokémon Dunkelnebel ein, endet der Effekt. Unabhängig vom Erfolg zählt diese Attacke für Raserei des Gegners als Treffer.", // NEEDS QC
			shortDesc: "Blockiert eine Attacke des Ziels 0-7 Runden.", // NEEDS QC
		},

		start: "  {MOVE} von {POKEMON} wurde blockiert!",
		end: "  Die Attacke von {POKEMON} ist nicht mehr blockiert!",
		cant: "{MOVE} von {POKEMON} ist blockiert!",
	},
	disarmingvoice: {
		name: "Säuselstimme",
		// Official flavor text: "Der Anwender stößt einen bezirzenden Ruf aus, mit dem er gegnerische Pokémon in seinen Bann schlägt und ihnen mentalen Schaden zufügt. Trifft garantiert."
		desc: "Diese Attacke prüft keine Genauigkeit.", // NEEDS QC
		shortDesc: "Prüft keine Genauigkeit. Trifft die Gegner.", // NEEDS QC
	},
	discharge: {
		name: "Ladungsstoß",
		// Official flavor text: "Anwender greift alle Pokémon im Umkreis mit Elektrizität an. Diese werden eventuell auch paralysiert."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "30 % Chance, Nachbarn zu paralysieren.", // NEEDS QC
	},
	dive: {
		name: "Taucher",
		// Official flavor text: "Anwender taucht in Runde 1 ab und greift in Runde 2 aus der Tiefe an."
		desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Surfer und Whirlpool, von denen er doppelten Schaden erleidet, und wird nicht vom Wetter beeinflusst. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Taucht ab, trifft in Runde 2.", // NEEDS QC
		gen4: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Surfer und Whirlpool, die gegen ihn doppelte Stärke haben, und ist zudem vom Wetter unbeeinflusst. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen3: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Surfer und Whirlpool, die gegen ihn doppelte Stärke haben, und ist zudem vom Wetter unbeeinflusst.", // NEEDS QC
		},

		prepare: "{POKEMON} taucht unter!",
	},
	dizzypunch: {
		name: "Irrschlag",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 20 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "20 % Chance auf Verwirrung.", // NEEDS QC
		gen1: {
			desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
			shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		},
	},
	doodle: {
		name: "Abpausen",
		desc: "Die Fähigkeit des Anwenders und die seines Mitstreiters werden zu der des Ziels. Ändert die Fähigkeit des Anwenders oder Mitstreiters nicht, wenn sie Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Wandel, Trance-Modus oder Superwechsel ist oder bereits der des Ziels entspricht. Schlägt fehl, wenn die Fähigkeiten von Anwender und Mitstreiter bereits der des Ziels entsprechen oder die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kommandant, Kostümspuk, Erinnerungskraft, Pflanzengabe, Prognose, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Giftpuppenspiel, Scharwandel, Chemiekraft, Paläosynthese, Quantenantrieb, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Panzer, Tera-Wandel, Teraforming Null, Erfassen, Wunderwache, Trance-Modus oder Superwechsel ist.", // NEEDS QC
		shortDesc: "Anwender und Partner kopieren die Fähigkeit des Ziels.", // NEEDS QC
	},
	doomdesire: {
		name: "Kismetwunsch",
		// Official flavor text: "Angriff mit gebündeltem Licht erfolgt zwei Runden nach Attackeneinsatz."
		desc: "Fügt zwei Runden nach dem Einsatz Schaden zu. Am Ende jener Runde wird der Schaden zu diesem Zeitpunkt berechnet und dem Pokémon an der Position zugefügt, die das Ziel beim Einsatz hatte. Ist der Anwender dann nicht mehr im Kampf, wird der Schaden anhand seines natürlichen Spezial-Angriffs, seiner Typen und seines Levels berechnet, ohne Boni durch Item oder Fähigkeit. Schlägt fehl, wenn diese Attacke oder Seher bereits für die Position des Ziels wirkt.", // NEEDS QC
		shortDesc: "Trifft zwei Runden nach dem Einsatz.", // NEEDS QC
		gen4: {
			desc: "Richtet zwei Runden nach dem Einsatz typenlosen Schaden an, der kein Volltreffer sein kann. Der Schaden wird beim Einsatz gegen das Ziel berechnet und am Ende der letzten Runde dem Pokémon auf der ursprünglichen Position des Ziels zugefügt. Schlägt fehl, wenn diese Attacke oder Seher bereits für die Position des Ziels aktiv ist.", // NEEDS QC
		},

		start: "  {POKEMON} äußert einen Kismetwunsch für die Zukunft!",
		activate: "  {TARGET} wurde von Kismetwunsch getroffen!",
	},
	doubleedge: {
		name: "Risikotackle",
		// Official flavor text: "Lebensgefährlicher Angriff, bei dem sich der Anwender selbst verletzt."
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 33 % der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "33 % Rückstoßschaden.", // NEEDS QC
		gen4: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/3 der verlorenen KP, abgerundet, aber mindestens 1 KP.", // NEEDS QC
			shortDesc: "Hat 1/3 Rückstoß.", // NEEDS QC
		},
		gen2: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der verlorenen KP, abgerundet, aber mindestens 1 KP. Trifft diese Attacke einen Delegator, beträgt der Rückstoßschaden immer 1 KP.", // NEEDS QC
			shortDesc: "1/4 Rückstoßschaden.", // NEEDS QC
		},
		gen1: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der verlorenen KP, abgerundet, aber mindestens 1 KP. Zerbricht diese Attacke den Delegator des Ziels, erleidet der Anwender keinen Rückstoßschaden.", // NEEDS QC
		},
	},
	doublehit: {
		name: "Doppelschlag",
		// Official flavor text: "Anwender trifft das Ziel mit dem Schweif oder Ähnlichem. Ziel wird doppelt getroffen."
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		shortDesc: "Trifft 2-mal in einer Runde.", // NEEDS QC
		gen4: {
			desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
	},
	doubleironbash: {
		name: "Panzerfäuste",
		// Official flavor text: "Der Anwender rotiert um die Schraubenmutter in seinem Brustkorb und schlägt zweimal hintereinander mit den Armen zu. Das Ziel schreckt eventuell zurück."
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers. Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "Trifft 2-mal. 30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	doublekick: {
		name: "Doppelkick",
		// Official flavor text: "Der Anwender tritt in einer Runde zweimal schnell zu."
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		shortDesc: "Trifft 2-mal in einer Runde.", // NEEDS QC
		gen4: {
			desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zweimal. Der Schaden wird nur für den ersten Treffer berechnet und für beide übernommen. Zerbricht der erste Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	doubleshock: {
		name: "Zweifachladung",
		desc: "Schlägt fehl, wenn der Anwender nicht vom Typ Elektro ist. Gelingt diese Attacke und ist der Anwender nicht terakristallisiert, verliert er seinen Typ Elektro, solange er im Kampf bleibt.", // NEEDS QC
		shortDesc: "Verliert seinen Elektro-Typ; nur als Elektro-Typ.", // NEEDS QC

		typeChange: "  {POKEMON} braucht seinen Strom komplett auf!",
	},
	doubleslap: {
		name: "Duplexhieb",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Der Schaden wird nur für den ersten Treffer berechnet und für jeden weiteren übernommen. Zerbricht einer der Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	doubleteam: {
		name: "Doppelteam",
		// Official flavor text: "Erzeugt durch schnelle Bewegungen Ebenbilder, um den Ausweichwert zu erhöhen."
		desc: "Erhöht den Fluchtwert des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "Erhöht Fluchtwert des Anwenders um eine Stufe.", // NEEDS QC
	},
	dracometeor: {
		name: "Draco Meteor",
		// Official flavor text: "Kometen werden heraufbeschworen. Der Rückstoß reduziert den Spezial-Angriff des Anwenders stark."
		desc: "Senkt den Spezial-Angriff des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Sp.-Ang. des Anwenders um 2 Stufen.", // NEEDS QC
	},
	dragonascent: {
		name: "Zenitstürmer",
		// Official flavor text: "Der Anwender greift das Ziel aus atemberaubender Höhe im Sturzflug an. Senkt Verteidigung und Spezial-Verteidigung des Anwenders."
		desc: "Senkt die Verteidigung und die Spezial-Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Vert. und Sp.-Vert. des Anwenders.", // NEEDS QC

		megaNoItem: "  Der innige Wunsch von {TRAINER} erreicht {POKEMON}!",
	},
	dragonbreath: {
		name: "Feuerodem",
		// Official flavor text: "Fegt das Ziel mit zerstörerisch heißem Atem weg. Paralysiert das Ziel eventuell."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "30 % Chance auf Paralyse.", // NEEDS QC
	},
	dragoncheer: {
		name: "Drachenschrei",
		desc: "Erhöht die Volltrefferquote des Ziels um eine Stufe, oder um 2 Stufen, wenn das Ziel vom Typ Drache ist. Schlägt fehl, wenn kein Mitstreiter neben dem Anwender steht oder das Ziel bereits diesen Effekt oder den von Energiefokus hat. Stafette kann diesen Effekt an einen Mitstreiter weitergeben.", // NEEDS QC
		shortDesc: "Partner: Volltrefferquote +1, +2 bei Drachen-Typ.", // NEEDS QC

		start: "#focusenergy",
	},
	dragonclaw: {
		name: "Drachenklaue",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	dragondance: {
		name: "Drachentanz",
		// Official flavor text: "Ein mystischer Tanz, der den Angriffs- und Initiative-Wert erhöht."
		desc: "Erhöht den Angriff und die Initiative des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Ang. und Init. des Anwenders.", // NEEDS QC
	},
	dragondarts: {
		name: "Drachenpfeile",
		// Official flavor text: "Der Anwender greift zweimal mit Grolldra an. Bei zwei Zielen werden beide jeweils einmal angegriffen."
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers. In Doppelkämpfen versucht diese Attacke, das anvisierte Pokémon und dessen Mitstreiter je einmal zu treffen. Kann eines der beiden wegen Immunität, Schutz, Halb-Unverwundbarkeit, einer Fähigkeit oder der Genauigkeit nicht getroffen werden, versucht sie, das andere zweimal zu treffen. Wird diese Attacke umgelenkt, trifft sie dieses Ziel zweimal.", // NEEDS QC
		shortDesc: "Trifft 2-mal. Im Doppel: je einmal pro Gegner.", // NEEDS QC
	},
	dragonenergy: {
		name: "Drachenkräfte",
		// Official flavor text: "Der Anwender wandelt seine Lebenskraft in Energie um und greift gegnerische Pokémon an. Je höher seine KP sind, desto mehr Schaden wird angerichtet."
		desc: "Die Stärke beträgt (aktuelle KP des Anwenders × 150 / maximale KP des Anwenders), abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Schwächer bei weniger KP. Trifft die Gegner.", // NEEDS QC
	},
	dragonhammer: {
		name: "Drachenhammer",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	dragonpulse: {
		name: "Drachenpuls",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	dragonrage: {
		name: "Drachenwut",
		shortDesc: "Fügt dem Ziel 40 KP Schaden zu.", // NEEDS QC
	},
	dragonrush: {
		name: "Drachenstoß",
		// Official flavor text: "Anwender führt einen furchteinflößenden Angriff aus. Das Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 20 %, das Ziel zurückschrecken zu lassen. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		shortDesc: "20 % Chance auf Zurückschrecken.", // NEEDS QC
		gen5: {
			desc: "Hat eine Chance von 20 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		},
	},
	dragontail: {
		name: "Drachenrute",
		// Official flavor text: "Putzt das Ziel vom Feld und wechselt es mit einem anderen Pokémon aus. Beendet Kämpfe gegen wilde Pokémon."
		desc: "Sind weder Anwender noch Ziel kampfunfähig, wird das Ziel gezwungen, das Feld zu verlassen, und durch einen zufällig gewählten kampffähigen Mitstreiter ersetzt. Dieser Effekt schlägt fehl, wenn das Ziel Verwurzler eingesetzt hat, die Fähigkeit Saugnapf hat oder diese Attacke einen Delegator getroffen hat.", // NEEDS QC
		shortDesc: "Tauscht das Ziel gegen einen zufälligen Mitstreiter.", // NEEDS QC
	},
	drainingkiss: {
		name: "Diebeskuss",
		// Official flavor text: "Der Anwender stiehlt dem Ziel mit einem Kuss KP. Die Höhe der Heilung beträgt mehr als die Hälfte des beim Ziel angerichteten Schadens."
		desc: "Der Anwender stellt 3/4 der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 75 % des Schadens.", // NEEDS QC
	},
	drainpunch: {
		name: "Ableithieb",
		// Official flavor text: "Entzieht dem Ziel Energie. Die Hälfte des Schadens wird den KP des Anwenders zugerechnet."
		desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 50 % des Schadens.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, abgerundet.", // NEEDS QC
		},
	},
	dreameater: {
		name: "Traumfresser",
		// Official flavor text: "Frisst die Träume eines schlafenden Zieles. Anwender wird um die Hälfte des zugefügten Schadens geheilt."
		desc: "Das Ziel ist von dieser Attacke nur betroffen, wenn es schläft. Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt um halben Schaden. Nur gegen Schlafende.", // NEEDS QC
		gen4: {
			desc: "Wirkt nur, wenn das Ziel schläft und keinen Delegator hat. Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet, aber mindestens 1 KP. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, abgerundet.", // NEEDS QC
		},
		gen3: {
			desc: "Wirkt nur, wenn das Ziel schläft und keinen Delegator hat. Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet, aber mindestens 1 KP.", // NEEDS QC
		},
		gen1: {
			desc: "Wirkt nur, wenn das Ziel schläft. Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet, aber mindestens 1 KP. Zerbricht diese Attacke den Delegator des Ziels, stellt der Anwender keine KP wieder her.", // NEEDS QC
		},
	},
	drillpeck: {
		name: "Bohrschnabel",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	drillrun: {
		name: "Schlagbohrer",
		// Official flavor text: "Anwender rammt das Ziel, während er seinen Körper wie einen Bohrer dreht. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	drumbeating: {
		name: "Trommelschläge",
		// Official flavor text: "Der Anwender kontrolliert durch Trommeln Wurzeln, die das Ziel angreifen und dessen Initiative senken."
		desc: "Hat eine Chance von 100 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Init. des Ziels.", // NEEDS QC
	},
	dualchop: {
		name: "Doppelhieb",
		// Official flavor text: "Versetzt dem Ziel mit massiven Extremitäten Hiebe. Angriff erfolgt zweimal hintereinander."
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		shortDesc: "Trifft 2-mal in einer Runde.", // NEEDS QC
	},
	dualwingbeat: {
		name: "Doppelflügel",
		// Official flavor text: "Der Anwender trifft das Ziel zweimal hintereinander mit seinen Flügeln und fügt ihm so Schaden zu."
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		shortDesc: "Trifft 2-mal in einer Runde.", // NEEDS QC
	},
	dynamaxcannon: {
		name: "Dynamax-Kanone",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		gen8: {
			shortDesc: "Doppelter Schaden gegen dynamaximierte Ziele.", // NEEDS QC
		},
	},
	dynamicpunch: {
		name: "Wuchtschlag",
		// Official flavor text: "Kräftiger Schlag, der das Ziel bei Erfolg verwirrt."
		desc: "Hat eine Chance von 100 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "100 % Chance auf Verwirrung.", // NEEDS QC
	},
	earthpower: {
		name: "Erdkräfte",
		// Official flavor text: "Der Boden unter dem Ziel erzittert durch die Kraft der Erde. Senkt eventuell Spezial-Verteidigung."
		desc: "Hat eine Chance von 10 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	earthquake: {
		name: "Erdbeben",
		// Official flavor text: "Ein mächtiges Beben, das alle Pokémon im Umkreis trifft."
		desc: "Der Schaden wird verdoppelt, wenn das Ziel gerade Schaufler einsetzt.", // NEEDS QC
		shortDesc: "Trifft Nachbarn. Doppelt gegen Schaufler.", // NEEDS QC
		gen4: {
			desc: "Die Stärke wird verdoppelt, wenn das Ziel Schaufler einsetzt.", // NEEDS QC
			shortDesc: "Trifft alle Nachbarn. 2x Stärke gegen Schaufler.", // NEEDS QC
		},
		gen1: {
			desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
			shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		},
		gen2: {
			shortDesc: "2x Stärke gegen Schaufler.", // NEEDS QC
		},
	},
	echoedvoice: {
		name: "Widerhall",
		// Official flavor text: "Angriff mit widerhallender Stimme. Wenn in jeder Runde ein Teilnehmer wiederholt die Attacke einsetzt, steigt die Stärke."
		desc: "Für jede aufeinanderfolgende Runde, in der diese Attacke von mindestens einem Pokémon eingesetzt wird, wird ihre Stärke mit der Zahl der vergangenen Runden multipliziert, höchstens jedoch mit 5.", // NEEDS QC
		shortDesc: "Wird bei Einsatz in Folgerunden stärker.", // NEEDS QC
	},
	eerieimpulse: {
		name: "Mystowellen",
		// Official flavor text: "Der Körper des Anwenders erzeugt mysteriöse Wellen und senkt den Spezial-Angriff des Zieles dadurch stark."
		desc: "Senkt den Spezial-Angriff des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Sp.-Ang. des Ziels um 2 Stufen.", // NEEDS QC
	},
	eeriespell: {
		name: "Schauderspruch",
		// Official flavor text: "Der Anwender greift mit gewaltigen Psycho-Kräften an. Die AP der letzten Attacke des Zieles werden um 3 Punkte gesenkt."
		desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, verliert das Ziel 3 AP seiner zuletzt eingesetzten Attacke.", // NEEDS QC
		shortDesc: "Die letzte Attacke des Ziels verliert 3 AP.", // NEEDS QC

		activate: "#spite",
	},
	eggbomb: {
		name: "Eierbombe",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	electricterrain: {
		name: "Elektrofeld",
		// Official flavor text: "Hindert fünf Runden lang alle Pokémon, die den Boden berühren, am Einschlafen. Erhöht die Stärke von Elektro-Attacken."
		desc: "5 Runden lang liegt ein Elektrofeld vor. Währenddessen wird die Stärke von Attacken vom Typ Elektro von Pokémon am Boden mit 1,3 multipliziert und Pokémon am Boden können nicht einschlafen; bereits schlafende wachen nicht auf. Pokémon am Boden können nicht von Gähner betroffen werden oder durch dessen Effekt einschlafen. Tarnung macht den Anwender zum Typ Elektro, Natur-Kraft wird zu Donnerblitz und Geheimpower hat eine Chance von 30 %, zu paralysieren. Schlägt fehl, wenn bereits ein Elektrofeld vorliegt.", // NEEDS QC
		shortDesc: "5 Runden: Elektro stärker, kein Schlaf am Boden.", // NEEDS QC
		gen7: {
			desc: "5 Runden lang liegt ein Elektrofeld vor. Während des Effekts haben Elektro-Angriffe von Pokémon am Boden 1,5-fache Stärke, und Pokémon am Boden können nicht einschlafen; bereits schlafende Pokémon wachen nicht auf. Pokémon am Boden können nicht von Gähner betroffen werden oder durch dessen Effekt einschlafen. Tarnung verwandelt den Anwender in ein Elektro-Pokémon, Natur-Kraft wird zu Donnerblitz, und Geheimpower hat eine Chance von 30 %, zu paralysieren. Schlägt fehl, wenn bereits ein Elektrofeld vorliegt.", // NEEDS QC
		},
	},
	electrify: {
		name: "Elektrifizierung",
		// Official flavor text: "Kommt die Attacke zum Einsatz, bevor das Ziel seine Attacke ausführt, nimmt diese für die Dauer dieser Runde den Typ Elektro an."
		desc: "Die Attacke des Ziels wird in dieser Runde zum Typ Elektro. Unter den Effekten, die den Typ einer Attacke ändern können, tritt dieser als Letztes ein. Schlägt fehl, wenn das Ziel in dieser Runde bereits gehandelt hat.", // NEEDS QC
		shortDesc: "Die Attacke des Ziels wird diese Runde zu Elektro.", // NEEDS QC

		start: "  Die nächste Attacke von {POKEMON} nimmt durch Elektrifizierung den Typ Elektro an!",
	},
	electroball: {
		name: "Elektroball",
		// Official flavor text: "Je höher die Initiative des Anwenders im Vergleich zum Ziel ist, desto stärker trifft dieses eine geballte Ladung Strom."
		desc: "Die Stärke hängt von (aktuelle Initiative des Anwenders / aktuelle Initiative des Ziels) ab, abgerundet. Sie beträgt 150 bei einem Ergebnis von 4 oder mehr, 120 bei 3, 80 bei 2, 60 bei 1 und 40 bei weniger als 1. Beträgt die aktuelle Initiative des Ziels 0, beträgt die Stärke 40.", // NEEDS QC
		shortDesc: "Je schneller als das Ziel, desto stärker.", // NEEDS QC
		gen5: {
			desc: "Die Stärke hängt von (aktuelle Initiative des Anwenders ÷ aktuelle Initiative des Ziels) ab, abgerundet. Sie beträgt 150 bei einem Ergebnis von 4 oder mehr, 120 bei 3, 80 bei 2, 60 bei 1 und 40 bei weniger als 1. Beträgt die aktuelle Initiative des Ziels 0, wird sie als 1 behandelt.", // NEEDS QC
		},
	},
	electrodrift: {
		name: "Blitztour",
		desc: "Der Schaden wird mit 1,3333 multipliziert, wenn diese Attacke sehr effektiv gegen das Ziel ist.", // NEEDS QC
		shortDesc: "Schaden x1,3333, wenn sehr effektiv.", // NEEDS QC
	},
	electroshot: {
		name: "Stromstrahl",
		desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Erhöht in der ersten Runde den Spezial-Angriff des Anwenders um eine Stufe. Trägt der Anwender ein Energiekraut oder ist das Wetter Strömender Regen oder Regen, wird die Attacke in einer Runde ausgeführt. Trägt der Anwender einen Allzweckschirm und ist das Wetter Strömender Regen oder Regen, benötigt die Attacke dennoch eine Runde zum Aufladen.", // NEEDS QC
		shortDesc: "+1 Sp.-Ang., trifft in Runde 2. Sofort bei Regen.", // NEEDS QC

		prepare: "{POKEMON} absorbiert elektrische Energie!",
	},
	electroweb: {
		name: "Elektronetz",
		// Official flavor text: "Fängt gegnerische Pokémon mit einem elektrischen Netz und senkt deren Initiative."
		desc: "Hat eine Chance von 100 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Initiative der Gegner.", // NEEDS QC
	},
	embargo: {
		name: "Itemsperre",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "5 Runden lang hat das getragene Item des Ziels keine Wirkung. Formwechsel durch Items sind nicht betroffen, alle anderen Effekte solcher Items werden jedoch aufgehoben. Während des Effekts kann das Ziel weder Schleuder noch Beerenkräfte einsetzen. Mit Schleuder auf das Ziel geworfene Items wirken dennoch. Setzt das Ziel Stafette ein, kann auch der Nachfolger keine Items verwenden.", // NEEDS QC
		shortDesc: "5 Runden: Das Item des Ziels ist wirkungslos.", // NEEDS QC

		start: "  {POKEMON} kann keine Items mehr einsetzen!",
		end: "  {POKEMON} kann wieder Items einsetzen!",
	},
	ember: {
		name: "Glut",
		// Official flavor text: "Schwache Feuer-Attacke, durch die das Ziel eventuell Verbrennungen erleidet."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "10 % Chance auf Verbrennung.", // NEEDS QC
	},
	encore: {
		name: "Zugabe",
		// Official flavor text: "Das Ziel wiederholt die letzte Attacke drei Runden lang."
		desc: "Das Ziel ist in seinen nächsten 3 Runden gezwungen, seine zuletzt eingesetzte Attacke zu wiederholen. Gehen deren AP aus, endet der Effekt. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt steht, noch nicht gehandelt hat, die Attacke 0 AP hat oder sie Zuschuss, Hitzeturbo, Raufturbo, Imitator, Dynamax-Kanone, Zugabe, Zauberturbo, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Toxiturbo, Nachahmer, Schlafrede, Verzweifler, Wandler oder Finsterturbo ist.", // NEEDS QC
		shortDesc: "Das Ziel wiederholt 3 Runden seine letzte Attacke.", // NEEDS QC
		gen8: {
			desc: "In seinen nächsten 3 Runden muss das Ziel seine zuletzt eingesetzte Attacke wiederholen. Gehen die AP der Attacke aus, endet der Effekt. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt steht, noch nicht gehandelt hat, die Attacke 0 AP hat, das Ziel dynamaximiert ist oder die Attacke Zuschuss, Imitator, Dynamax-Kanone, Zugabe, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Nachahmer, Schlafrede, Verzweifler oder Wandler ist.", // NEEDS QC
		},
		gen7: {
			desc: "In seinen nächsten 3 Runden muss das Ziel seine zuletzt eingesetzte Attacke wiederholen. Gehen die AP der Attacke aus, endet der Effekt. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt steht, noch nicht gehandelt hat, die Attacke 0 AP hat oder die Attacke Zuschuss, Imitator, Zugabe, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Nachahmer, Schlafrede, Verzweifler oder Wandler oder eine Z-Attacke ist. Mit Z-Kraft verstärkte Attacken können während des Effekts weiterhin gewählt und eingesetzt werden.", // NEEDS QC
		},
		gen6: {
			desc: "3 Runden lang muss das Ziel seine zuletzt eingesetzte Attacke wiederholen. Gehen die AP der Attacke aus, endet der Effekt. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt steht, noch nicht gehandelt hat, die Attacke 0 AP hat oder die Attacke Zugabe, Mimikry, Spiegeltrick, Nachahmer, Verzweifler oder Wandler ist.", // NEEDS QC
		},
		gen4: {
			desc: "4 bis 8 Runden lang muss das Ziel seine zuletzt eingesetzte Attacke wiederholen. Gehen die AP der Attacke aus, endet der Effekt. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt steht, noch nicht gehandelt hat, die Attacke 0 AP hat oder die Attacke Zugabe, Mimikry, Spiegeltrick, Nachahmer, Verzweifler oder Wandler ist.", // NEEDS QC
			shortDesc: "Das Ziel wiederholt 4-8 Runden die letzte Attacke.", // NEEDS QC
		},
		gen3: {
			desc: "3 bis 6 Runden lang muss das Ziel seine zuletzt eingesetzte Attacke wiederholen. Gehen die AP der Attacke aus, endet der Effekt. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt steht, noch nicht gehandelt hat, die Attacke 0 AP hat oder die Attacke Zugabe, Mimikry, Spiegeltrick, Nachahmer, Verzweifler oder Wandler ist.", // NEEDS QC
			shortDesc: "Das Ziel wiederholt 3-6 Runden die letzte Attacke.", // NEEDS QC
		},
		gen2: {
			desc: "3 bis 6 Runden lang muss das Ziel seine zuletzt eingesetzte Attacke wiederholen. Gehen die AP der Attacke aus, endet der Effekt. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt steht, noch nicht gehandelt hat, die Attacke 0 AP hat oder die Attacke Zugabe, Metronom, Mimikry, Spiegeltrick, Nachahmer, Schlafrede, Verzweifler oder Wandler ist.", // NEEDS QC
		},

		start: "  {POKEMON} gibt eine Zugabe!",
		end: "  Die Zugabe von {POKEMON} ist beendet!",
	},
	endeavor: {
		name: "Notsituation",
		// Official flavor text: "Trifft nur, wenn KP des Anwenders geringer als KP des Zieles sind. Senkt dessen KP auf die Höhe der KP des Anwenders."
		desc: "Fügt dem Ziel Schaden in Höhe von (aktuelle KP des Ziels - aktuelle KP des Anwenders) zu. Das Ziel bleibt unbeeinflusst, wenn seine aktuellen KP höchstens denen des Anwenders entsprechen.", // NEEDS QC
		shortDesc: "Senkt die KP des Ziels auf die des Anwenders.", // NEEDS QC
	},
	endure: {
		name: "Ausdauer",
		// Official flavor text: "Nach fatalen Attacken bleibt stets 1 KP übrig. Misserfolg bei Wiederholung möglich."
		desc: "Der Anwender übersteht Attacken anderer Pokémon in dieser Runde mit mindestens 1 KP. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Übersteht alle Attacken der Runde mit mind. 1 KP.", // NEEDS QC
		gen8: {
			desc: "Der Anwender übersteht Attacken anderer Pokémon in dieser Runde mit mindestens 1 KP. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender übersteht Attacken anderer Pokémon in dieser Runde mit mindestens 1 KP. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender übersteht Attacken anderer Pokémon in dieser Runde mit mindestens 1 KP. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender übersteht Attacken anderer Pokémon in dieser Runde mit mindestens 1 KP. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdoppelt. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Schutzschild, Rapidschutz oder Rundumschutz ist. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender übersteht Attacken anderer Pokémon in dieser Runde mit mindestens 1 KP. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdoppelt, bis maximal 8. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer oder Schutzschild ist. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender übersteht Attacken anderer Pokémon in dieser Runde mit mindestens 1 KP. Diese Attacke hat eine Erfolgschance von X/65536, wobei X bei 65535 beginnt und sich bei jedem Erfolg halbiert, abgerundet. Nach dem vierten Erfolg in Folge fällt X auf 118 und nimmt bei weiteren Erfolgen scheinbar zufällige Werte von 0–65535 an. X wird auf 65535 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer oder Schutzschild ist. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender übersteht Attacken des Gegners in dieser Runde mit mindestens 1 KP. Diese Attacke hat eine Erfolgschance von X/255, wobei X bei 255 beginnt und sich bei jedem Erfolg halbiert, abgerundet. X wird auf 255 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer oder Schutzschild ist. Schlägt fehl, wenn der Anwender einen Delegator hat oder in dieser Runde als Letzter handelt.", // NEEDS QC
		},

		start: "  {POKEMON} sammelt sich, um die nächste Attacke zu überstehen!",
		activate: "  {POKEMON} übersteht die Attacke!",
	},
	energyball: {
		name: "Energieball",
		// Official flavor text: "Anwender zieht Kraft aus der Natur und feuert sie auf das Ziel. Senkt eventuell Spezial-Verteidigung des Zieles."
		desc: "Hat eine Chance von 10 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	entrainment: {
		name: "Zwango",
		// Official flavor text: "Anwender tanzt zu einem seltsamen Rhythmus und zwingt das Ziel mitzumachen. Dieses nimmt dabei die Fähigkeit des Anwenders an."
		desc: "Die Fähigkeit des Ziels wird zu der des Anwenders. Schlägt fehl, wenn die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Wandel, Schnarchnase, Trance-Modus oder Superwechsel oder dieselbe wie die des Anwenders ist, oder wenn die Fähigkeit des Anwenders Reitgespann, Freundschaftsakt, Dauerschlaf, Kommandant, Kostümspuk, Erinnerungskraft, Pflanzengabe, Prognose, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Giftpuppenspiel, Scharwandel, Chemiekraft, Paläosynthese, Quantenantrieb, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Panzer, Tera-Wandel, Teraforming Null, Erfassen, Wunderwache, Trance-Modus oder Superwechsel ist.", // NEEDS QC
		shortDesc: "Das Ziel erhält die Fähigkeit des Anwenders.", // NEEDS QC
		gen8: {
			desc: "Die Fähigkeit des Ziels wird zu der des Anwenders. Schlägt fehl, wenn die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Schnarchnase oder Trance-Modus oder dieselbe wie die des Anwenders ist, oder wenn die Fähigkeit des Anwenders Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Würggeschoss, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen oder Trance-Modus ist.", // NEEDS QC
		},
		gen7: {
			desc: "Die Fähigkeit des Ziels wird zu der des Anwenders. Schlägt fehl, wenn die Fähigkeit des Ziels Freundschaftsakt, Dauerschlaf, Kostümspuk, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Schnarchnase oder Trance-Modus oder dieselbe wie die des Anwenders ist, oder wenn die Fähigkeit des Anwenders Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen oder Trance-Modus ist.", // NEEDS QC
		},
		gen6: {
			desc: "Die Fähigkeit des Ziels wird zu der des Anwenders. Schlägt fehl, wenn die Fähigkeit des Ziels Variabilität, Taktikwechsel oder Schnarchnase oder dieselbe wie die des Anwenders ist, oder wenn die Fähigkeit des Anwenders Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Taktikwechsel, Erfassen oder Trance-Modus ist.", // NEEDS QC
		},
		gen5: {
			desc: "Die Fähigkeit des Ziels wird zu der des Anwenders. Schlägt fehl, wenn die Fähigkeit des Ziels Variabilität oder Schnarchnase oder dieselbe wie die des Anwenders ist, oder wenn die Fähigkeit des Anwenders Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Erfassen oder Trance-Modus ist.", // NEEDS QC
		},
	},
	eruption: {
		name: "Eruption",
		// Official flavor text: "Explosiver Angriff gegen gegnerische Pokémon. Je höher die KP des Anwenders sind, desto mehr Schaden wird angerichtet."
		desc: "Die Stärke beträgt (aktuelle KP des Anwenders × 150 / maximale KP des Anwenders), abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Schwächer bei weniger KP. Trifft die Gegner.", // NEEDS QC
	},
	esperwing: {
		name: "Auraschwingen",
		desc: "Hat eine Chance von 100 %, die Initiative des Anwenders um eine Stufe zu erhöhen, und eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "100 % Chance auf +1 Init. Hohe Volltrefferquote.", // NEEDS QC
	},
	eternabeam: {
		name: "Unendynastrahlen",
		// Official flavor text: "Der mächtigste Angriff, über den Endynalos in seiner ursprünglichen Form verfügt. In der nächsten Runde kann der Anwender nicht handeln."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
	},
	expandingforce: {
		name: "Flächenmacht",
		// Official flavor text: "Der Anwender greift das Ziel mit Psycho-Kräften an. Wenn ein Psychofeld aktiv ist, steigt die Stärke und es wird allen gegnerischen Pokémon Schaden zugefügt."
		desc: "Liegt ein Psychofeld vor und ist der Anwender am Boden, trifft diese Attacke alle Gegner und ihre Stärke wird mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Im Psychofeld: x1,5 und trifft beide Gegner.", // NEEDS QC
	},
	explosion: {
		name: "Explosion",
		// Official flavor text: "Anwender explodiert, richtet bei allen Pokémon im Umkreis großen Schaden an und wird selbst kampfunfähig."
		desc: "Der Anwender wird nach dem Einsatz kampfunfähig, selbst wenn diese Attacke mangels Ziel fehlschlägt. Diese Attacke kann nicht ausgeführt werden, wenn ein Pokémon im Kampf die Fähigkeit Feuchtigkeit hat.", // NEEDS QC
		shortDesc: "Trifft Nachbarn. Der Anwender wird besiegt.", // NEEDS QC
		gen4: {
			desc: "Der Anwender wird nach dem Einsatz kampfunfähig, außer diese Attacke hat kein Ziel. Bei der Schadensberechnung wird die Verteidigung des Ziels halbiert. Diese Attacke wird nicht ausgeführt, wenn ein Pokémon mit der Fähigkeit Feuchtigkeit im Kampf ist.", // NEEDS QC
			shortDesc: "Halbiert Vert. des Ziels beim Rechnen. K.O. danach.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender wird nach dem Einsatz kampfunfähig. Bei der Schadensberechnung wird die Verteidigung des Ziels halbiert. Diese Attacke wird nicht ausgeführt, wenn ein Pokémon mit der Fähigkeit Feuchtigkeit im Kampf ist.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender wird nach dem Einsatz kampfunfähig. Bei der Schadensberechnung wird die Verteidigung des Ziels halbiert.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender wird nach dem Einsatz kampfunfähig, außer diese Attacke hat den Delegator des Ziels zerbrochen. Bei der Schadensberechnung wird die Verteidigung des Ziels halbiert.", // NEEDS QC
		},
	},
	extrasensory: {
		name: "Sondersensor",
		// Official flavor text: "Besonderer Angriff mit einer unsichtbaren Kraft, die das Ziel eventuell zurückschrecken lässt."
		desc: "Hat eine Chance von 10 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "10 % Chance auf Zurückschrecken.", // NEEDS QC
		gen3: {
			desc: "Hat eine Chance von 10 %, das Ziel zurückschrecken zu lassen. Der Schaden wird verdoppelt, wenn das Ziel Komprimator eingesetzt hat, seit es im Kampf ist.", // NEEDS QC
		},
	},
	extremeevoboost: {
		name: "Macht der Neun",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Erhöht Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung und Initiative des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "+2 Ang., Vert., Sp.-Ang., Sp.-Vert. und Init.", // NEEDS QC
	},
	extremespeed: {
		name: "Turbotempo",
		// Official flavor text: "Extrem schnelle und kraftvolle Erstschlag-Attacke."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt fast immer zuerst.", // NEEDS QC
		gen4: {
			shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
		},
	},
	facade: {
		name: "Fassade",
		// Official flavor text: "Ist der Anwender vergiftet, paralysiert oder leidet er unter Verbrennungen, verdoppelt sich die Kraft der Attacke."
		desc: "Die Stärke wird verdoppelt, wenn der Anwender verbrannt, paralysiert oder vergiftet ist. Die Halbierung des physischen Schadens durch die Verbrennung des Anwenders wird ignoriert.", // NEEDS QC
		shortDesc: "Doppelt bei Verbrennung, Gift oder Paralyse.", // NEEDS QC
		gen5: {
			desc: "Die Stärke wird verdoppelt, wenn der Anwender verbrannt, paralysiert oder vergiftet ist.", // NEEDS QC
		},
	},
	fairylock: {
		name: "Feenschloss",
		// Official flavor text: "Der Anwender sperrt alle Pokémon ein und hindert sie damit in der nächsten Runde an der Flucht."
		desc: "In der nächsten Runde kann kein Pokémon im Kampf ausgewechselt werden. Ein Pokémon kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Schlägt fehl, wenn der Effekt bereits aktiv ist.", // NEEDS QC
		shortDesc: "Nächste Runde kann kein Pokémon auswechseln.", // NEEDS QC
		gen7: {
			desc: "In der nächsten Runde kann kein Pokémon im Kampf ausgewechselt werden. Ein Pokémon kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Schlägt fehl, wenn der Effekt bereits aktiv ist.", // NEEDS QC
		},

		activate: "  Während der nächsten Runde ist keine Flucht möglich!",
	},
	fairywind: {
		name: "Feenbrise",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	fakeout: {
		name: "Mogelhieb",
		// Official flavor text: "Erstschlag-Attacke, die das Ziel zurückschrecken lässt. Gelingt nur, wenn sie sofort eingesetzt wird, nachdem der Anwender das Kampffeld betreten hat."
		desc: "Hat eine Chance von 100 %, das Ziel zurückschrecken zu lassen. Schlägt fehl, wenn es nicht die erste Runde des Anwenders auf dem Feld ist.", // NEEDS QC
		shortDesc: "Zuerst; nur in Runde 1. 100 % Zurückschrecken.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	faketears: {
		name: "Trugträne",
		// Official flavor text: "Täuscht Weinen vor, um die Spezial-Verteidigung des Zieles stark zu senken."
		desc: "Senkt die Spezial-Verteidigung des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Sp.-Vert. des Ziels um 2 Stufen.", // NEEDS QC
	},
	falsesurrender: {
		name: "Kniefalltrick",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	falseswipe: {
		name: "Trugschlag",
		// Official flavor text: "Ein Angriff, der dem Ziel zumindest 1 KP lässt."
		desc: "Lässt dem Ziel mindestens 1 KP.", // NEEDS QC
		shortDesc: "Lässt dem Ziel immer mindestens 1 KP.", // NEEDS QC
	},
	featherdance: {
		name: "Daunenreigen",
		// Official flavor text: "Hüllt das Ziel in Daunen und senkt dessen Angriffs-Wert stark."
		desc: "Senkt den Angriff des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Angriff des Ziels um 2 Stufen.", // NEEDS QC
	},
	feint: {
		name: "Offenlegung",
		// Official flavor text: "Ziele, die Attacken wie Schutzschild oder Scanner eingesetzt haben, werden getroffen. Entfernt Effekte dieser Attacken."
		desc: "Gelingt diese Attacke, durchbricht sie für diese Runde die Effekte von Bunker, Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen.", // NEEDS QC
		shortDesc: "Durchbricht Schutz und Wächter-Attacken.", // NEEDS QC
		gen6: {
			desc: "Gelingt diese Attacke, durchbricht sie in dieser Runde Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen.", // NEEDS QC
		},
		gen5: {
			desc: "Gelingt diese Attacke, durchbricht sie in dieser Runde Scanner oder Schutzschild des Ziels, sodass andere Pokémon es normal angreifen können. Ist das Ziel ein Gegner und seine Seite durch Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen.", // NEEDS QC
		},
		gen4: {
			desc: "Schlägt fehl, wenn das Ziel nicht Scanner oder Schutzschild einsetzt. Gelingt diese Attacke, durchbricht sie diesen Schutz für diese Runde, sodass andere Pokémon das Ziel normal angreifen können.", // NEEDS QC
			shortDesc: "Durchbricht Schutz. Schlägt sonst fehl.", // NEEDS QC
		},

		activate: "  {TARGET} ist auf die Offenlegung hereingefallen!",
	},
	feintattack: {
		name: "Finte",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	fellstinger: {
		name: "Stachelfinale",
		// Official flavor text: "Gelingt es dem Anwender, das Ziel mit dieser Attacke zu besiegen, steigt sein Angriffs-Wert drastisch."
		desc: "Erhöht den Angriff des Anwenders um 3 Stufen, wenn diese Attacke das Ziel kampfunfähig macht.", // NEEDS QC
		shortDesc: "+3 Angriff, wenn diese Attacke das Ziel besiegt.", // NEEDS QC
		gen6: {
			desc: "Erhöht den Angriff des Anwenders um 2 Stufen, wenn diese Attacke das Ziel kampfunfähig macht.", // NEEDS QC
			shortDesc: "+2 Angriff, wenn diese Attacke das Ziel besiegt.", // NEEDS QC
		},
	},
	ficklebeam: {
		name: "Launenlaser",
		shortDesc: "30 % Chance auf doppelte Stärke.", // NEEDS QC

		activate: "  {POKEMON} legt sich ins Zeug!",
	},
	fierydance: {
		name: "Feuerreigen",
		// Official flavor text: "Hüllt das Ziel mit einer Feuerhose in Flammen. Kann den Spezial-Angriff des Anwenders erhöhen."
		desc: "Hat eine Chance von 50 %, den Spezial-Angriff des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "50 % Chance auf +1 Sp.-Ang. des Anwenders.", // NEEDS QC
	},
	fierywrath: {
		name: "Brennender Zorn",
		// Official flavor text: "Der Anwender wandelt seinen Zorn in eine flammende Aura um und greift damit gegnerische Pokémon an. Diese schrecken eventuell zurück."
		desc: "Hat eine Chance von 20 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "20 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	filletaway: {
		name: "Abspaltung",
		desc: "Erhöht Angriff, Spezial-Angriff und Initiative des Anwenders um 2 Stufen im Tausch gegen die Hälfte seiner maximalen KP, abgerundet. Schlägt fehl, wenn der Anwender kampfunfähig würde oder sich diese Stufen nicht ändern würden.", // NEEDS QC
		shortDesc: "Kostet halbe KP. +2 Ang., Sp.-Ang. und Init.", // NEEDS QC
	},
	finalgambit: {
		name: "Wagemut",
		// Official flavor text: "Ein Angriff, der dem Ziel Schaden in Höhe der aktuellen KP des Anwenders zufügt. Letzterer wird dadurch selbst besiegt."
		desc: "Fügt dem Ziel Schaden in Höhe der aktuellen KP des Anwenders zu. Gelingt diese Attacke, wird der Anwender kampfunfähig.", // NEEDS QC
		shortDesc: "Schaden = eigene KP. Der Anwender wird besiegt.", // NEEDS QC
	},
	fireblast: {
		name: "Feuersturm",
		// Official flavor text: "Feuersbrunst, die das Ziel versengt und ihm eventuell eine Verbrennung zufügt."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "10 % Chance auf Verbrennung.", // NEEDS QC
		gen1: {
			desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen.", // NEEDS QC
			shortDesc: "30 % Chance auf Verbrennung.", // NEEDS QC
		},
	},
	firefang: {
		name: "Feuerzahn",
		// Official flavor text: "Anwender beißt mit flammenden Reißzähnen zu. Ziel schreckt eventuell zurück oder erleidet Verbrennungen."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen, und eine Chance von 10 %, es zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "Je 10 % Verbrennungs- und Zurückschreck-Chance.", // NEEDS QC
		gen4: {
			desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen, und eine Chance von 10 %, es zurückschrecken zu lassen. Diese Attacke kann Pokémon mit der Fähigkeit Wunderwache unabhängig von ihrem Typ treffen.", // NEEDS QC
		},
	},
	firelash: {
		name: "Feuerpeitsche",
		// Official flavor text: "Der Anwender greift das Ziel mit einer brennenden Peitsche an und senkt dabei zusätzlich dessen Verteidigungs-Wert."
		desc: "Hat eine Chance von 100 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
	},
	firepledge: {
		name: "Feuersäulen",
		// Official flavor text: "Ein Angriff mit Feuersäulen. Mit Pflanzensäulen kombiniert steigt die Wirkung und die Umgebung wird zu einem Meer aus Feuer."
		desc: "Hat ein Mitstreiter des Anwenders in dieser Runde Pflanzensäulen oder Wassersäulen gewählt und noch nicht gehandelt, handelt er direkt nach dem Anwender und dessen Attacke bewirkt nichts. In Kombination mit Pflanzensäulen setzt der Mitstreiter Feuersäulen mit 150 Stärke ein und ein Feuermeer erscheint 4 Runden lang auf der Seite des Ziels, das Pokémon, die nicht vom Typ Feuer sind, am Ende jeder Runde des Effekts – einschließlich der letzten – Schaden in Höhe von 1/8 ihrer maximalen KP zufügt, abgerundet. In Kombination mit Wassersäulen setzt der Mitstreiter Wassersäulen mit 150 Stärke ein und ein Regenbogen erscheint 4 Runden lang auf der Seite des Anwenders, der die Sekundäreffekt-Chancen verdoppelt und mit der Fähigkeit Edelmut kumulierbar ist – Effekte, die zurückschrecken lassen, können ihre Chance jedoch nur einmal verdoppeln. Als Kombi-Attacke erhält diese Attacke den Typenbonus unabhängig vom Typ des Anwenders. Diese Attacke verbraucht das Feuerjuwel des Anwenders nicht.", // NEEDS QC
		shortDesc: "Mit Pflanzen-/Wassersäulen: Zusatzeffekt.", // NEEDS QC

		activate: "#waterpledge",
		start: "  Um {TEAM} erstreckt sich ein Meer aus Feuer!",
		end: "  Das Meer aus Feuer um {TEAM} ist verschwunden!",
		damage: "  {POKEMON} nimmt Schaden durch das Meer aus Feuer!",
	},
	firepunch: {
		name: "Feuerschlag",
		// Official flavor text: "Ein feuriger Schlag, der dem Ziel eventuell Verbrennungen zufügt."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "10 % Chance auf Verbrennung.", // NEEDS QC
	},
	firespin: {
		name: "Feuerwirbel",
		// Official flavor text: "Das Ziel wird für vier bis fünf Runden in einem Feuerkreis gefangen."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen7: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP (1/8 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang (immer fünf mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
			shortDesc: "Fängt und schädigt das Ziel 2-5 Runden lang.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es Stafette einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender setzt diese Attacke zwei bis fünf Runden lang ein. Hält mit einer Chance von 3/8 zwei oder drei Runden und mit einer Chance von 1/8 vier oder fünf Runden an. Der für die erste Runde berechnete Schaden wird für jede weitere Runde übernommen. Der Anwender kann keine Attacke wählen und das Ziel kann während des Effekts keine Attacke ausführen, aber beide können ausgewechselt werden. Wird der Anwender ausgewechselt, kann das Ziel in dieser Runde weiterhin keine Attacke ausführen. Wird das Ziel ausgewechselt, setzt der Anwender diese Attacke automatisch erneut ein; hatte sie dabei 0 AP, werden es 63. Wird der Anwender oder das Ziel ausgewechselt oder der Anwender am Handeln gehindert, endet der Effekt. Diese Attacke kann das Ziel auch bei Typ-Immunität am Handeln hindern, fügt dann aber keinen Schaden zu.", // NEEDS QC
			shortDesc: "Das Ziel kann 2-5 Runden nicht handeln.", // NEEDS QC
		},

		start: "  {POKEMON} wurde in wirbelndem Feuer eingeschlossen!",
		move: "#wrap",
	},
	firstimpression: {
		name: "Überrumpler",
		// Official flavor text: "Eine sehr starke Attacke, die jedoch nur erfolgreich ist, wenn sie sofort eingesetzt wird, nachdem der Anwender das Kampffeld betreten hat."
		desc: "Schlägt fehl, wenn es nicht die erste Runde des Anwenders auf dem Feld ist.", // NEEDS QC
		shortDesc: "Fast immer zuerst; nur in der 1. Runde im Kampf.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	fishiousrend: {
		name: "Kiemenbiss",
		// Official flavor text: "Der Anwender beißt mit seinen harten Kiemen zu. Kommt er vor dem Ziel zum Zug, verdoppelt sich die Stärke der Attacke."
		desc: "Die Stärke wird verdoppelt, wenn der Anwender vor dem Ziel handelt.", // NEEDS QC
		shortDesc: "Doppelte Stärke, wenn der Anwender zuerst handelt.", // NEEDS QC
	},
	fissure: {
		name: "Geofissur",
		// Official flavor text: "Das Ziel wird in eine Erdspalte geworfen. Ist die Attacke erfolgreich, führt sie zu einem K.O."
		desc: "Fügt dem Ziel Schaden in Höhe seiner maximalen KP zu. Ignoriert Genauigkeits- und Fluchtwert-Modifikatoren. Die Genauigkeit dieses Angriffs beträgt (Level des Anwenders - Level des Ziels + 30) %, und er schlägt fehl, wenn das Ziel ein höheres Level hat. Pokémon mit der Fähigkeit Robustheit sind immun.", // NEEDS QC
		shortDesc: "K.O. mit einem Treffer. Nicht bei höherem Ziel-Level.", // NEEDS QC
		gen2: {
			desc: "Fügt dem Ziel 65535 Schaden zu. Die Genauigkeit dieser Attacke von 256 entspricht dem kleineren Wert von (2 × (Level des Anwenders − Level des Ziels) + 76) und 255, bevor Genauigkeits- und Fluchtwert-Veränderungen angewendet werden. Schlägt fehl, wenn das Ziel ein höheres Level hat. Kann ein Ziel treffen, das Schaufler einsetzt.", // NEEDS QC
		},
		gen1: {
			desc: "Fügt dem Ziel 65535 Schaden zu. Schlägt fehl, wenn die Initiative des Ziels höher ist als die des Anwenders.", // NEEDS QC
			shortDesc: "65535 Schaden. Scheitert bei schnellerem Ziel.", // NEEDS QC
		},
	},
	flail: {
		name: "Dreschflegel",
		// Official flavor text: "Attacke richtet mehr Schaden an, wenn eigene KP niedrig sind."
		desc: "Die Stärke beträgt 20 bei X zwischen 33 und 48, 40 bei X zwischen 17 und 32, 80 bei X zwischen 10 und 16, 100 bei X zwischen 5 und 9, 150 bei X zwischen 2 und 4 und 200 bei X gleich 0 oder 1, wobei X = (aktuelle KP des Anwenders × 48 / maximale KP des Anwenders), abgerundet.", // NEEDS QC
		shortDesc: "Je weniger KP der Anwender hat, desto stärker.", // NEEDS QC
		gen4: {
			desc: "Die Stärke beträgt 20, wenn X 43–48 ist, 40 bei 22–42, 80 bei 13–21, 100 bei 6–12, 150 bei 2–5 und 200 bei 0 oder 1, wobei X (aktuelle KP des Anwenders × 64 ÷ maximale KP des Anwenders) ist, abgerundet.", // NEEDS QC
		},
		gen3: {
			desc: "Die Stärke beträgt 20 bei X zwischen 33 und 48, 40 bei X zwischen 17 und 32, 80 bei X zwischen 10 und 16, 100 bei X zwischen 5 und 9, 150 bei X zwischen 2 und 4 und 200 bei X gleich 0 oder 1, wobei X = (aktuelle KP des Anwenders × 48 / maximale KP des Anwenders), abgerundet.", // NEEDS QC
		},
		gen2: {
			desc: "Die Stärke beträgt 20, wenn X 33–48 ist, 40 bei 17–32, 80 bei 10–16, 100 bei 5–9, 150 bei 2–4 und 200 bei 0 oder 1, wobei X (aktuelle KP des Anwenders × 48 ÷ maximale KP des Anwenders) ist, abgerundet. Diese Attacke hat keine Schadensstreuung und kann kein Volltreffer sein.", // NEEDS QC
		},
	},
	flameburst: {
		name: "Funkenflug",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Gelingt diese Attacke, verliert der Mitstreiter des Ziels 1/16 seiner maximalen KP, abgerundet, außer er hat die Fähigkeit Magieschild.", // NEEDS QC
		shortDesc: "Trifft auch die Nachbarn des Ziels.", // NEEDS QC
		gen6: {
			desc: "Gelingt diese Attacke, verliert jeder dem Ziel benachbarte Mitstreiter 1/16 seiner maximalen KP, abgerundet, außer er hat die Fähigkeit Magieschild.", // NEEDS QC
		},

		damage: "  {POKEMON} wurde ebenfalls vom Funkenflug erfasst!",
	},
	flamecharge: {
		name: "Nitroladung",
		// Official flavor text: "Anwender hüllt sich in Flammen und greift das Ziel an. Sammelt seine Energie und erhöht dadurch die eigene Initiative."
		desc: "Hat eine Chance von 100 %, die Initiative des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "100 % Chance auf +1 Init. des Anwenders.", // NEEDS QC
	},
	flamethrower: {
		name: "Flammenwurf",
		// Official flavor text: "Starke Feuer-Attacke, durch die das Ziel eventuell Verbrennungen erleidet."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "10 % Chance auf Verbrennung.", // NEEDS QC
	},
	flamewheel: {
		name: "Flammenrad",
		// Official flavor text: "Anwender hüllt sich in Flammen und rammt das Ziel. Verursacht beim Ziel eventuell Verbrennungen."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "10 % Chance auf Verbrennung. Taut den Anwender auf.", // NEEDS QC
	},
	flareblitz: {
		name: "Flammenblitz",
		// Official flavor text: "Anwender hüllt sich in Flammen und stürmt auf das Ziel zu, das dadurch eventuell Verbrennungen erleidet. Anwender nimmt selbst großen Schaden."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen. Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 33 % der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "33 % Rückstoß. 10 % Verbrennung. Taut auf.", // NEEDS QC
		gen4: {
			desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen. Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/3 der verlorenen KP, abgerundet, aber mindestens 1 KP.", // NEEDS QC
			shortDesc: "1/3 Rückstoß. 10 % Verbrennung. Taut Anwender auf.", // NEEDS QC
		},
	},
	flash: {
		name: "Blitz",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Senkt die Genauigkeit des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Genauigkeit des Ziels um eine Stufe.", // NEEDS QC
	},
	flashcannon: {
		name: "Lichtkanone",
		// Official flavor text: "Anwender sammelt Lichtenergie und feuert sie auf einmal ab. Senkt eventuell Spezial-Verteidigung des Zieles."
		desc: "Hat eine Chance von 10 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	flatter: {
		name: "Schmeichler",
		// Official flavor text: "Schmeichelt dem Ziel, um es zu verwirren. Erhöht dessen Spezial-Angriff."
		desc: "Erhöht den Spezial-Angriff des Ziels um eine Stufe und verwirrt es.", // NEEDS QC
		shortDesc: "+1 Sp.-Ang. für das Ziel, verwirrt es aber.", // NEEDS QC
	},
	fleurcannon: {
		name: "Kanonenbouquet",
		// Official flavor text: "Der Anwender greift das Ziel mit einem gewaltigen Strahl an. Sein eigener Spezial-Angriff sinkt dadurch stark."
		desc: "Senkt den Spezial-Angriff des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Sp.-Ang. des Anwenders um 2 Stufen.", // NEEDS QC
	},
	fling: {
		name: "Schleuder",
		// Official flavor text: "Anwender schleudert sein Item auf das Ziel. Stärke und Effekt der Attacke hängen vom Item ab."
		desc: "Die Stärke hängt vom getragenen Item des Anwenders ab. Das Item geht verloren und wirkt gegebenenfalls auf das Ziel. Gibt es kein Ziel oder weicht es durch Schutz aus, geht das Item dennoch verloren. Der Anwender kann ein geworfenes Item mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückholen. Schlägt fehl, wenn der Anwender kein Item trägt, das Item nicht geworfen werden kann, er unter dem Effekt von Itemsperre oder Magieraum steht oder die Fähigkeit Tollpatsch hat.", // NEEDS QC
		shortDesc: "Wirft das Item auf das Ziel. Stärke variiert.", // NEEDS QC
		gen4: {
			desc: "Die Stärke dieser Attacke hängt vom getragenen Item des Anwenders ab. Das Item geht verloren und wird gegebenenfalls beim Ziel aktiviert. Weicht das Ziel dieser Attacke durch Schutz aus, geht das Item dennoch verloren. Ein geworfenes Item kann mit Aufbereitung zurückgeholt werden. Schlägt fehl, wenn der Anwender kein Item trägt, das Item nicht geworfen werden kann oder der Anwender unter dem Effekt von Itemsperre steht.", // NEEDS QC
		},

		removeItem: "  {POKEMON} schleudert das Item {ITEM}!",
	},
	flipturn: {
		name: "Rollwende",
		// Official flavor text: "Nach der Attacke eilt der Anwender zurück und tauscht den Platz mit einem anderen Pokémon."
		desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, wird er ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn kein anderes Teammitglied kampffähig ist oder das Ziel durch einen Fluchtknopf oder die Fähigkeiten Rückzug bzw. Reißaus ausgewechselt wurde.", // NEEDS QC
		shortDesc: "Der Anwender wechselt nach dem Angriff aus.", // NEEDS QC

		switchOut: "#uturn",
	},
	floatyfall: {
		name: "Schwebesturz",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	floralhealing: {
		name: "Florakur",
		// Official flavor text: "KP des Zieles werden um 50 % der maximalen KP aufgefüllt. Die Wirkung steigt, wenn der Untergrund in ein Grasfeld verwandelt wurde."
		desc: "Das Ziel stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet. Liegt ein Grasfeld vor, stellt es stattdessen 2/3 seiner maximalen KP wieder her, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt das Ziel um die Hälfte seiner max. KP.", // NEEDS QC
	},
	flowershield: {
		name: "Floraschutz",
		// Official flavor text: "Erhöht mit einer mysteriösen Macht die Verteidigung aller am Kampf beteiligten Pflanzen-Pokémon."
		desc: "Erhöht die Verteidigung aller Pokémon vom Typ Pflanze im Kampf um eine Stufe. Schlägt fehl, wenn kein Pokémon vom Typ Pflanze im Kampf ist.", // NEEDS QC
		shortDesc: "+1 Verteidigung für alle Pflanzen-Pokémon.", // NEEDS QC
	},
	flowertrick: {
		name: "Blumentrick",
		desc: "Diese Attacke ist immer ein Volltreffer, außer das Ziel steht unter dem Effekt von Beschwörung oder hat die Fähigkeit Kampfpanzer oder Panzerhaut. Diese Attacke prüft keine Genauigkeit.", // NEEDS QC
		shortDesc: "Immer ein Volltreffer; trifft immer.", // NEEDS QC
	},
	fly: {
		name: "Fliegen",
		// Official flavor text: "Steigt in Runde 1 empor und trifft das Ziel in Runde 2."
		desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Windstoß, Orkan, Himmelhieb, Katapult, Tausend Pfeile, Donner und Windhose, wobei Windstoß und Windhose gegen ihn doppelte Stärke haben. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Fliegt hoch, trifft in Runde 2.", // NEEDS QC
		gen5: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Windstoß, Orkan, Himmelhieb, Katapult, Donner und Windhose, wobei Windstoß und Windhose gegen ihn doppelte Stärke haben. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen4: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Windstoß, Himmelhieb, Donner und Windhose, wobei Windstoß und Windhose gegen ihn doppelte Stärke haben. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen3: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Windstoß, Himmelhieb, Donner und Windhose, wobei Windstoß und Windhose gegen ihn doppelte Stärke haben.", // NEEDS QC
		},
		gen2: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Windstoß, Donner, Windhose und Wirbelwind, wobei Windstoß und Windhose gegen ihn doppelte Stärke haben.", // NEEDS QC
		},
		gen1: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus außer Geduld, Sternschauer und Wandler. Ist der Anwender in der zweiten Runde voll paralysiert, weicht er weiterhin Attacken aus, bis er ausgewechselt wird oder die zweite Runde dieser Attacke oder von Schaufler erfolgreich ausführt.", // NEEDS QC
		},

		prepare: "{POKEMON} fliegt hoch empor!",
	},
	flyingpress: {
		name: "Flying Press",
		// Official flavor text: "Der Anwender stürzt sich aus der Luft auf das Ziel. Die Attacke gehört sowohl dem Typ Kampf als auch dem Typ Flug an."
		desc: "Diese Attacke bezieht den Typ Flug in ihre Effektivität gegen das Ziel ein. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		shortDesc: "Effektivität zusätzlich mit Flug berechnet.", // NEEDS QC
	},
	focusblast: {
		name: "Fokusstoß",
		// Official flavor text: "Anwender erhöht seinen mentalen Fokus und greift dann an. Senkt eventuell Spezial-Verteidigung des Zieles."
		desc: "Hat eine Chance von 10 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	focusenergy: {
		name: "Energiefokus",
		// Official flavor text: "Anwender atmet ein und bündelt Kraft. Die Volltrefferquote steigt dadurch."
		desc: "Erhöht die Volltrefferquote des Anwenders um 2 Stufen. Schlägt fehl, wenn der Anwender diesen Effekt bereits hat. Stafette kann diesen Effekt an einen Mitstreiter weitergeben.", // NEEDS QC
		shortDesc: "Erhöht die Volltrefferquote um 2 Stufen.", // NEEDS QC
		gen2: {
			desc: "Erhöht die Volltrefferquote des Anwenders um eine Stufe. Schlägt fehl, wenn der Anwender den Effekt bereits hat. Dieser Effekt kann mit Stafette übertragen werden.", // NEEDS QC
			shortDesc: "Erhöht die Volltrefferquote des Anwenders um 1.", // NEEDS QC
		},
		gen1: {
			desc: "Solange der Anwender im Kampf bleibt, wird seine Volltrefferquote geviertelt. Schlägt fehl, wenn der Anwender den Effekt bereits hat. Setzt ein Pokémon Dunkelnebel ein, endet der Effekt.", // NEEDS QC
			shortDesc: "Viertelt die Volltrefferchance des Anwenders.", // NEEDS QC
		},

		start: "  {POKEMON} läuft zu Hochtouren auf!",
		startFromItem: "  {POKEMON} läuft dank des Items {ITEM} zu Hochtouren auf!",
		startFromZEffect: "  Volltrefferquote von {POKEMON} wurde durch Z-Kraft erhöht!",
	},
	focuspunch: {
		name: "Power-Punch",
		// Official flavor text: "Anwender konzentriert sich, bevor er angreift. Wird er vorher getroffen, ist die Attacke erfolglos."
		desc: "Der Anwender verliert die Konzentration und tut nichts, wenn er in dieser Runde von einem schädigenden Angriff getroffen wird, bevor er diese Attacke ausführen kann.", // NEEDS QC
		shortDesc: "Scheitert bei Schaden vor der Ausführung.", // NEEDS QC
		gen4: {
			desc: "Wird der Anwender in dieser Runde von einem Angriff getroffen, bevor er diese Attacke ausführen kann, verliert er die Konzentration und tut nichts, verliert aber dennoch AP.", // NEEDS QC
		},

		start: "  {POKEMON} konzentriert sich!",
		cant: "{POKEMON} kann sich nicht mehr konzentrieren. Es kann nicht angreifen!",
	},
	followme: {
		name: "Spotlight",
		// Official flavor text: "Zieht Aufmerksamkeit auf sich. Gegner greifen nur den Anwender an."
		desc: "Bis zum Ende der Runde werden alle Angriffe der gegnerischen Seite mit einzelnem Ziel auf den Anwender umgelenkt. Diese Angriffe werden umgelenkt, bevor sie von Magiemantel oder der Fähigkeit Magiespiegel zurückgeworfen oder von den Fähigkeiten Blitzfänger bzw. Sturmsog angezogen werden können. Schlägt fehl, wenn es kein Doppelkampf oder Battle Royale ist. Dieser Effekt wird ignoriert, solange der Anwender unter dem Effekt von Freier Fall steht.", // NEEDS QC
		shortDesc: "Gegnerische Attacken zielen diese Runde auf ihn.", // NEEDS QC
		gen6: {
			desc: "Bis zum Ende der Runde werden alle Einzelziel-Angriffe der gegnerischen Seite auf den Anwender umgelenkt, sofern er in Reichweite ist. Solche Angriffe werden umgelenkt, bevor sie von Magiemantel oder der Fähigkeit Magiespiegel reflektiert oder von den Fähigkeiten Blitzfänger oder Sturmsog angezogen werden können. Schlägt fehl, wenn es kein Doppel- oder Dreierkampf ist. Dieser Effekt wird ignoriert, während der Anwender unter dem Effekt von Freier Fall steht.", // NEEDS QC
		},
		gen4: {
			desc: "Bis zum Ende der Runde werden alle Einzelziel-Angriffe der gegnerischen Seite auf den Anwender umgelenkt. Solche Angriffe werden umgelenkt, bevor sie von Magiemantel reflektiert oder von den Fähigkeiten Blitzfänger oder Sturmsog angezogen werden können. Dieser Effekt bleibt aktiv, selbst wenn der Anwender das Feld verlässt. Schlägt fehl, wenn es kein Doppelkampf ist.", // NEEDS QC
		},
		gen3: {
			desc: "Bis zum Ende der Runde werden alle Einzelziel-Angriffe der gegnerischen Seite auf den Anwender umgelenkt. Solche Angriffe werden umgelenkt, bevor sie von Magiemantel reflektiert oder von der Fähigkeit Blitzfänger angezogen werden können. Dieser Effekt bleibt aktiv, selbst wenn der Anwender das Feld verlässt. Schlägt fehl, wenn es kein Doppelkampf ist.", // NEEDS QC
		},

		start: "  {POKEMON} zieht alle Aufmerksamkeit auf sich!",
		startFromZEffect: "  {POKEMON} zieht alle Aufmerksamkeit auf sich!",
	},
	forcepalm: {
		name: "Kraftwelle",
		// Official flavor text: "Das Ziel wird mit einer Schockwelle angegriffen, die es eventuell paralysiert."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "30 % Chance auf Paralyse.", // NEEDS QC
	},
	foresight: {
		name: "Scharfblick",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Solange das Ziel im Kampf bleibt, wird seine Fluchtwert-Stufe bei Genauigkeitsprüfungen gegen es ignoriert, sofern sie über 0 liegt, und Angriffe der Typen Normal und Kampf können es treffen, wenn es vom Typ Geist ist. Schlägt fehl, wenn das Ziel bereits von diesem Effekt, Wunderauge oder Schnüffler betroffen ist.", // NEEDS QC
		shortDesc: "Kampf und Normal treffen Geist. Ignoriert Fluchtwert.", // NEEDS QC
		gen4: {
			desc: "Solange das Ziel im Kampf bleibt, wird sein Fluchtwert bei Genauigkeitsprüfungen gegen es ignoriert, sofern er über 0 liegt, und Attacken vom Typ Normal und Kampf können es treffen, selbst wenn es ein Geist-Pokémon ist.", // NEEDS QC
		},
		gen3: {
			desc: "Solange das Ziel im Kampf bleibt, wird sein Fluchtwert bei Genauigkeitsprüfungen gegen es ignoriert, und Attacken vom Typ Normal und Kampf können es treffen, selbst wenn es ein Geist-Pokémon ist.", // NEEDS QC
		},
		gen2: {
			desc: "Solange das Ziel im Kampf bleibt, werden, wenn sein Fluchtwert höher ist als die Genauigkeitsstufe des Angreifers, beide bei Genauigkeitsprüfungen ignoriert, und Attacken vom Typ Normal und Kampf können es treffen, selbst wenn es ein Geist-Pokémon ist. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger unter diesem Effekt. Schlägt fehl, wenn das Ziel bereits betroffen ist.", // NEEDS QC
		},

		start: "  {POKEMON} wurde erkannt!",
	},
	forestscurse: {
		name: "Waldesfluch",
		// Official flavor text: "Der Anwender belegt das Ziel mit einem Waldesfluch, durch den dieses zusätzlich den Typ Pflanze annimmt."
		desc: "Fügt dem Ziel den Typ Pflanze hinzu, sodass es zwei oder drei Typen hat. Schlägt fehl, wenn das Ziel bereits vom Typ Pflanze ist. Fügt Halloween dem Ziel einen Typ hinzu, ersetzt dieser den durch diese Attacke hinzugefügten und umgekehrt.", // NEEDS QC
		shortDesc: "Das Ziel erhält zusätzlich den Pflanzen-Typ.", // NEEDS QC
	},
	foulplay: {
		name: "Schmarotzer",
		// Official flavor text: "Anwender macht sich die Kraft des Zieles zunutze. Je höher dessen Angriff, desto mehr Schaden richtet die Attacke an."
		desc: "Der Schaden wird mit dem Angriff des Ziels berechnet, einschließlich Statusveränderungen. Fähigkeit, Item und Verbrennung des Anwenders gelten normal.", // NEEDS QC
		shortDesc: "Greift mit dem Angriffs-Wert des Ziels an.", // NEEDS QC
	},
	freezedry: {
		name: "Gefriertrockner",
		// Official flavor text: "Das Ziel wird stark abgekühlt und manchmal sogar eingefroren. Die Attacke ist sehr effektiv gegen Wasser-Pokémon."
		desc: "Hat eine Chance von 10 %, das Ziel einzufrieren. Die Effektivität dieser Attacke gegen den Typ Wasser wird zu sehr effektiv, unabhängig vom Typ der Attacke.", // NEEDS QC
		shortDesc: "10 % Einfrieren. Sehr effektiv gegen Wasser.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	freezeshock: {
		name: "Frostvolt",
		// Official flavor text: "Feuert in der zweiten Runde elektrisch geladene Eisklumpen auf das Ziel ab. Paralysiert das Ziel eventuell."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Lädt auf, trifft in Runde 2. 30 % Paralyse.", // NEEDS QC

		prepare: "  {POKEMON} wird von einem kühlen Licht umhüllt!",
	},
	freezingglare: {
		name: "Eisiger Blick",
		// Official flavor text: "Der Anwender greift das Ziel mit Psycho-Kräften an, die er aus seinen Augen abschießt. Das Ziel friert eventuell ein."
		desc: "Hat eine Chance von 10 %, das Ziel einzufrieren.", // NEEDS QC
		shortDesc: "10 % Chance auf Einfrieren.", // NEEDS QC
	},
	freezyfrost: {
		name: "Klirrfrost",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Setzt die Statusveränderungen aller Pokémon im Kampf auf 0 zurück.", // NEEDS QC
		shortDesc: "Hebt alle Statusveränderungen auf.", // NEEDS QC
	},
	frenzyplant: {
		name: "Flora-Statue",
		// Official flavor text: "Mächtiger Angriff mit Ästen. Der Anwender muss eine Runde aussetzen."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
	},
	frostbreath: {
		name: "Eisesodem",
		// Official flavor text: "Anwender greift an, indem er dem Ziel eisigen Atem entgegenhaucht. Volltreffergarantie."
		desc: "Diese Attacke ist immer ein Volltreffer, außer das Ziel steht unter dem Effekt von Beschwörung oder hat die Fähigkeit Kampfpanzer oder Panzerhaut.", // NEEDS QC
		shortDesc: "Ist immer ein Volltreffer.", // NEEDS QC
	},
	frustration: {
		name: "Frustration",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke beträgt ((255 - Freundschaft des Anwenders) × 2/5), abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Max. 102 Stärke bei minimaler Freundschaft.", // NEEDS QC
	},
	furyattack: {
		name: "Furienschlag",
		// Official flavor text: "Spießt das Ziel zwei- bis fünfmal mit spitzem Horn oder Schnabel auf."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Der Schaden wird nur für den ersten Treffer berechnet und für jeden weiteren übernommen. Zerbricht einer der Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	furycutter: {
		name: "Zornklinge",
		// Official flavor text: "Eine Attacke mit Scheren oder Klauen, deren Härte bei aufeinanderfolgenden Treffern zunimmt."
		desc: "Die Stärke verdoppelt sich mit jedem Treffer, bis maximal 160. Sie wird zurückgesetzt, wenn diese Attacke verfehlt oder eine andere Attacke eingesetzt wird.", // NEEDS QC
		shortDesc: "Verdoppelt sich pro Treffer, bis 160 Stärke.", // NEEDS QC
	},
	furyswipes: {
		name: "Kratzfurie",
		// Official flavor text: "Beharkt das Ziel zwei- bis fünfmal mit scharfen Klauen oder Sicheln."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Der Schaden wird nur für den ersten Treffer berechnet und für jeden weiteren übernommen. Zerbricht einer der Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	fusionbolt: {
		name: "Kreuzdonner",
		// Official flavor text: "Feuert einen monströsen Blitz ab. Wird die Attacke durch eine gigantische Flamme modifiziert, steigt die Stärke."
		desc: "Die Stärke wird verdoppelt, wenn die zuletzt in dieser Runde eingesetzte Attacke Kreuzflamme war.", // NEEDS QC
		shortDesc: "Doppelt direkt nach Kreuzflamme.", // NEEDS QC
	},
	fusionflare: {
		name: "Kreuzflamme",
		// Official flavor text: "Feuert eine monströse Flamme ab. Wird die Attacke durch einen gigantischen Blitz modifiziert, steigt die Stärke."
		desc: "Die Stärke wird verdoppelt, wenn die zuletzt in dieser Runde eingesetzte Attacke Kreuzdonner war.", // NEEDS QC
		shortDesc: "Doppelt direkt nach Kreuzdonner.", // NEEDS QC
	},
	futuresight: {
		name: "Seher",
		// Official flavor text: "Zwei Runden, nachdem Seher eingesetzt wurde, erfolgt ein Angriff mit Psycho-Energie."
		desc: "Fügt zwei Runden nach dem Einsatz Schaden zu. Am Ende jener Runde wird der Schaden zu diesem Zeitpunkt berechnet und dem Pokémon an der Position zugefügt, die das Ziel beim Einsatz hatte. Ist der Anwender dann nicht mehr im Kampf, wird der Schaden anhand seines natürlichen Spezial-Angriffs, seiner Typen und seines Levels berechnet, ohne Boni durch Item oder Fähigkeit. Schlägt fehl, wenn diese Attacke oder Kismetwunsch bereits für die Position des Ziels wirkt.", // NEEDS QC
		shortDesc: "Trifft zwei Runden nach dem Einsatz.", // NEEDS QC
		gen4: {
			desc: "Richtet zwei Runden nach dem Einsatz typenlosen Schaden an, der kein Volltreffer sein kann. Der Schaden wird beim Einsatz gegen das Ziel berechnet und am Ende der letzten Runde dem Pokémon auf der ursprünglichen Position des Ziels zugefügt. Schlägt fehl, wenn diese Attacke oder Kismetwunsch bereits für die Position des Ziels aktiv ist.", // NEEDS QC
		},
		gen2: {
			desc: "Richtet zwei Runden nach dem Einsatz typenlosen Schaden an, der kein Volltreffer sein kann. Der Schaden wird beim Einsatz gegen das Ziel berechnet und am Ende der letzten Runde dem Pokémon auf der ursprünglichen Position des Ziels zugefügt. Schlägt fehl, wenn diese Attacke bereits für die Position des Ziels aktiv ist.", // NEEDS QC
		},

		start: "  {POKEMON} sieht einen Angriff voraus!",
		activate: "  {TARGET} wurde von Seher getroffen!",
	},
	gastroacid: {
		name: "Magensäfte",
		// Official flavor text: "Anwender greift das Ziel mit eigenen Magensäften an. Entfernt Effekte von dessen Fähigkeit."
		desc: "Die Fähigkeit des Ziels wird wirkungslos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, bleibt der Nachfolger unter diesem Effekt. Ist die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Wandel, Trance-Modus oder Superwechsel, schlägt diese Attacke fehl, und den Effekt über Stafette zu erhalten beendet ihn sofort.", // NEEDS QC
		shortDesc: "Hebt die Fähigkeit des Ziels auf.", // NEEDS QC
		gen8: {
			desc: "Die Fähigkeit des Ziels wird wirkungslos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, bleibt der Nachfolger unter diesem Effekt. Ist die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus, schlägt diese Attacke fehl, und den Effekt über Stafette zu erhalten beendet ihn sofort.", // NEEDS QC
		},
		gen7: {
			desc: "Die Fähigkeit des Ziels wird wirkungslos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, bleibt der Nachfolger unter diesem Effekt. Ist die Fähigkeit des Ziels Freundschaftsakt, Dauerschlaf, Kostümspuk, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus, schlägt diese Attacke fehl, und den Effekt über Stafette zu erhalten beendet ihn sofort.", // NEEDS QC
		},
		gen6: {
			desc: "Die Fähigkeit des Ziels wird wirkungslos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, bleibt der Nachfolger unter diesem Effekt. Ist die Fähigkeit des Ziels Variabilität oder Taktikwechsel, schlägt diese Attacke fehl, und den Effekt über Stafette zu erhalten beendet ihn sofort.", // NEEDS QC
		},

		start: "  Die Fähigkeit von {POKEMON} wirkt nicht mehr!",
	},
	geargrind: {
		name: "Klikkdiskus",
		// Official flavor text: "Anwender greift an, indem er stählerne Zahnräder auf das Ziel schleudert. Angriff erfolgt zweimal hintereinander."
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		shortDesc: "Trifft 2-mal in einer Runde.", // NEEDS QC
	},
	gearup: {
		name: "Hilfsmechanik",
		// Official flavor text: "Der Anwender erhöht mithilfe von Zahnrädern Angriff und Spezial-Angriff von Team-Pokémon mit der Fähigkeit Plus oder Minus."
		desc: "Erhöht den Angriff und den Spezial-Angriff der Team-Pokémon des Anwenders mit der Fähigkeit Plus oder Minus um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Ang./Sp.-Ang. bei Partnern mit Plus/Minus.", // NEEDS QC
	},
	genesissupernova: {
		name: "Supernova des Ursprungs",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Gelingt diese Attacke, liegt danach ein Psychofeld vor.", // NEEDS QC
		shortDesc: "Erzeugt ein Psychofeld.", // NEEDS QC
	},
	geomancy: {
		name: "Geokontrolle",
		// Official flavor text: "Der Anwender saugt in Runde 1 Energie auf. In Runde 2 steigen der Spezial-Angriff, die Spezial-Verteidigung und die Initiative stark."
		desc: "Erhöht Spezial-Angriff, Spezial-Verteidigung und Initiative des Anwenders um 2 Stufen. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Lädt auf; +2 Sp.-Ang., Sp.-Vert., Init. in Runde 2.", // NEEDS QC

		prepare: "{POKEMON} saugt Kraft in sich auf!",
	},
	gigadrain: {
		name: "Gigasauger",
		// Official flavor text: "Das Ziel wird angegriffen und die Hälfte des zugefügten Schadens dem Anwender als KP gutgeschrieben."
		desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 50 % des Schadens.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, abgerundet.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet.", // NEEDS QC
		},
	},
	gigaimpact: {
		name: "Gigastoß",
		// Official flavor text: "Anwender rennt mit seiner ganzen Kraft gegen das Ziel an und muss dann eine Runde ruhen."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
	},
	gigatonhammer: {
		name: "Riesenhammer",
		shortDesc: "Kann nicht zweimal in Folge gewählt werden.", // NEEDS QC
	},
	gigavolthavoc: {
		name: "Gigavolt-Funkensalve",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	glaciallance: {
		name: "Blizzardlanze",
		// Official flavor text: "Der Anwender wirft eine in einen Blizzard gehüllte Lanze aus Eis auf gegnerische Pokémon."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Gegner.", // NEEDS QC
	},
	glaciate: {
		name: "Eiszeit",
		// Official flavor text: "Anwender greift an, indem er gegnerischen Pokémon klirrend kalte Luft entgegenbläst und dabei ihre Initiative senkt."
		desc: "Hat eine Chance von 100 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Initiative der Gegner.", // NEEDS QC
	},
	glaiverush: {
		name: "Großklingenstoß",
		desc: "Gelingt diese Attacke, verursachen Attacken gegen den Anwender bis zu seiner nächsten Aktion doppelten Schaden und prüfen keine Genauigkeit.", // NEEDS QC
		shortDesc: "Wird bis zur nächsten Runde sicher doppelt getroffen.", // NEEDS QC
	},
	glare: {
		name: "Schlangenblick",
		// Official flavor text: "Schüchtert Ziel ein, sodass dieses paralysiert wird."
		desc: "Paralysiert das Ziel.", // NEEDS QC
		shortDesc: "Paralysiert das Ziel.", // NEEDS QC
		gen3: {
			desc: "Paralysiert das Ziel. Diese Attacke ignoriert Typ-Immunität nicht.", // NEEDS QC
		},
		gen1: {
			desc: "Paralysiert das Ziel.", // NEEDS QC
		},
	},
	glitzyglow: {
		name: "Pulsieraura",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Diese Attacke ruft Lichtschild für 5 Runden hervor.", // NEEDS QC
		shortDesc: "Erzeugt Lichtschild.", // NEEDS QC
	},
	gmaxbefuddle: {
		name: "Giga-Benebelung",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, wird jedes Pokémon der gegnerischen Seite eingeschläfert, vergiftet oder paralysiert, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: Schlaf/Gift/Par.", // NEEDS QC
	},
	gmaxcannonade: {
		name: "Giga-Beschuss",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, erleidet 4 Runden lang jedes Pokémon der gegnerischen Seite, das nicht vom Typ Wasser ist, am Ende jeder Runde des Effekts – einschließlich der letzten – Schaden in Höhe von 1/6 seiner maximalen KP, abgerundet.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1/6 KP.", // NEEDS QC

		start: "  Ein Wasserwirbel umgibt {PARTY}!",
		damage: "  {POKEMON} erleidet Schaden durch den Wasserwirbel der Attacke Giga-Beschuss!",
	},
	gmaxcentiferno: {
		name: "Giga-Feuerkessel",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, kann jedes Pokémon der gegnerischen Seite vier oder fünf Runden lang (sieben mit Griffklaue) nicht ausgewechselt werden, selbst hinter einem Delegator. Fügt ihnen am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 ihrer maximalen KP zu (1/6 mit Klammerband), abgerundet. Sie können dennoch ausgewechselt werden, wenn sie eine Wechselhülle tragen oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzen. Der Effekt endet für ein Ziel, wenn es das Feld verlässt oder Turbodreher bzw. Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch zurücksetzbar.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Hält 4-5 Runden.", // NEEDS QC
	},
	gmaxchistrike: {
		name: "Giga-Fokusschlag",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, steigt die Volltrefferquote jedes Pokémon auf der Seite des Anwenders um eine Stufe, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Team: Volltreffer +1.", // NEEDS QC

		start: "#focusenergy",
	},
	gmaxcuddle: {
		name: "Giga-Gekuschel",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, verliebt sich jedes Pokémon der gegnerischen Seite, selbst hinter einem Delegator. Dieser Effekt tritt für ein Ziel nicht ein, wenn es dasselbe Geschlecht wie der Anwender hat, einer von beiden geschlechtslos ist oder es bereits verliebt ist.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: verliebt.", // NEEDS QC
	},
	gmaxdepletion: {
		name: "Giga-Dämpfer",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, verliert jedes Pokémon der gegnerischen Seite 2 AP seiner zuletzt eingesetzten Attacke, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Letzte Attacke: -2 AP.", // NEEDS QC

		activate: "  AP von {TARGET} wurden verringert!",
	},
	gmaxdrumsolo: {
		name: "Giga-Getrommel",
		desc: "Die Stärke beträgt 160, unabhängig von der Dynamax-Attacke der Basis-Attacke. Diese Attacke und ihre Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		shortDesc: "Immer 160 Stärke. Ignoriert Fähigkeiten.", // NEEDS QC
	},
	gmaxfinale: {
		name: "Giga-Lichtblick",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, stellt jedes Pokémon auf der Seite des Anwenders 1/6 seiner aktuellen maximalen KP wieder her, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Team: +1/6 der max. KP.", // NEEDS QC
	},
	gmaxfireball: {
		name: "Giga-Brandball",
		desc: "Die Stärke beträgt 160, unabhängig von der Dynamax-Attacke der Basis-Attacke. Diese Attacke und ihre Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		shortDesc: "Immer 160 Stärke. Ignoriert Fähigkeiten.", // NEEDS QC
	},
	gmaxfoamburst: {
		name: "Giga-Schaumbad",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, sinkt die Initiative jedes Pokémon der gegnerischen Seite um 2 Stufen, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -2 Initiative.", // NEEDS QC
	},
	gmaxgoldrush: {
		name: "Giga-Münzregen",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, wird jedes Pokémon der gegnerischen Seite verwirrt, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner verwirrt.", // NEEDS QC
	},
	gmaxgravitas: {
		name: "Giga-Astrowellen",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Erdanziehung.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Erzeugt Erdanziehung.", // NEEDS QC
	},
	gmaxhydrosnipe: {
		name: "Giga-Schütze",
		desc: "Die Stärke beträgt 160, unabhängig von der Dynamax-Attacke der Basis-Attacke. Diese Attacke und ihre Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		shortDesc: "Immer 160 Stärke. Ignoriert Fähigkeiten.", // NEEDS QC
	},
	gmaxmalodor: {
		name: "Giga-Gestank",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, wird jedes Pokémon der gegnerischen Seite vergiftet, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: Vergiftung.", // NEEDS QC
	},
	gmaxmeltdown: {
		name: "Giga-Schmelze",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Folterknecht für jedes Pokémon der gegnerischen Seite, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: Folterknecht.", // NEEDS QC
	},
	gmaxoneblow: {
		name: "Giga-Einzelhieb",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Diese Attacke durchdringt alle Schutzeffekte, einschließlich Dyna-Wall.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Umgeht Dyna-Wall.", // NEEDS QC
	},
	gmaxrapidflow: {
		name: "Giga-Multihieb",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Diese Attacke durchdringt alle Schutzeffekte, einschließlich Dyna-Wall.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Umgeht Dyna-Wall.", // NEEDS QC
	},
	gmaxreplenish: {
		name: "Giga-Recycling",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, besteht eine Chance von 50 %, dass jedes Pokémon auf der Seite des Anwenders seine Beere zurückerhält, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. 50 %: Beeren zurück.", // NEEDS QC
	},
	gmaxresonance: {
		name: "Giga-Melodie",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Auroraschleier auf der Seite des Anwenders.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Team: Auroraschleier.", // NEEDS QC
	},
	gmaxsandblast: {
		name: "Giga-Sandstoß",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, kann jedes Pokémon der gegnerischen Seite vier oder fünf Runden lang (sieben mit Griffklaue) nicht ausgewechselt werden, selbst hinter einem Delegator. Fügt ihnen am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 ihrer maximalen KP zu (1/6 mit Klammerband), abgerundet. Sie können dennoch ausgewechselt werden, wenn sie eine Wechselhülle tragen oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzen. Der Effekt endet für ein Ziel, wenn es das Feld verlässt oder Turbodreher bzw. Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch zurücksetzbar.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Hält 4-5 Runden.", // NEEDS QC
	},
	gmaxsmite: {
		name: "Giga-Sanktion",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, wird jedes Pokémon der gegnerischen Seite verwirrt, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner verwirrt.", // NEEDS QC
	},
	gmaxsnooze: {
		name: "Giga-Gähnzwang",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, besteht eine Chance von 50 %, dass der Effekt von Gähner auf dem Ziel beginnt, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Ziel: 50 % Gähner.", // NEEDS QC
	},
	gmaxsteelsurge: {
		name: "Giga-Stahlschlag",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, legt sie auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt. Gegner verlieren 1/32, 1/16, 1/8, 1/4 oder 1/2 ihrer maximalen KP, abgerundet, je nach ihrer Schwäche gegen den Typ Stahl (0,25-fach, 0,5-fach, neutral, 2-fach bzw. 4-fach). Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: Stahl-Falle.", // NEEDS QC

		start: "  Um {PARTY} schweben zackige Stahlsplitter!",
		end: "  Die Stahlsplitter um {PARTY} sind verschwunden!",
		damage: "  {POKEMON} wird von zackigen Stahlsplittern getroffen!",
	},
	gmaxstonesurge: {
		name: "Giga-Geröll",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, legt sie auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt. Gegner verlieren 1/32, 1/16, 1/8, 1/4 oder 1/2 ihrer maximalen KP, abgerundet, je nach ihrer Schwäche gegen den Typ Gestein (0,25-fach, 0,5-fach, neutral, 2-fach bzw. 4-fach). Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: Tarnsteine.", // NEEDS QC
	},
	gmaxstunshock: {
		name: "Giga-Voltschlag",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, wird jedes Pokémon der gegnerischen Seite vergiftet oder paralysiert, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: Gift o. Paralyse.", // NEEDS QC
	},
	gmaxsweetness: {
		name: "Giga-Nektarflut",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, wird das Statusproblem jedes Pokémon auf der Seite des Anwenders geheilt, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Team: Statusheilung.", // NEEDS QC
	},
	gmaxtartness: {
		name: "Giga-Säureguss",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, sinkt der Fluchtwert jedes Pokémon der gegnerischen Seite um eine Stufe, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1 Fluchtwert.", // NEEDS QC
	},
	gmaxterror: {
		name: "Giga-Spuksperre",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, kann jedes Pokémon der gegnerischen Seite nicht mehr ausgewechselt werden, selbst hinter einem Delegator. Sie können dennoch ausgewechselt werden, wenn sie eine Wechselhülle tragen oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzen. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: gefangen.", // NEEDS QC
	},
	gmaxvinelash: {
		name: "Giga-Geißel",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, erleidet 4 Runden lang jedes Pokémon der gegnerischen Seite, das nicht vom Typ Pflanze ist, am Ende jeder Runde des Effekts – einschließlich der letzten – Schaden in Höhe von 1/6 seiner maximalen KP, abgerundet.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1/6 KP.", // NEEDS QC

		start: "  Heftige Peitschenhiebe treffen {PARTY}!",
		damage: "  {POKEMON} erleidet Schaden durch die heftigen Hiebe der Attacke Giga-Geißel!",
	},
	gmaxvolcalith: {
		name: "Giga-Schlacke",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, erleidet 4 Runden lang jedes Pokémon der gegnerischen Seite, das nicht vom Typ Gestein ist, am Ende jeder Runde des Effekts – einschließlich der letzten – Schaden in Höhe von 1/6 seiner maximalen KP, abgerundet.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1/6 KP.", // NEEDS QC

		start: "  Steinbrocken umgeben {PARTY}!",
		damage: "  {POKEMON} erleidet Schaden durch die Steinbrocken der Attacke Giga-Schlacke!",
	},
	gmaxvoltcrash: {
		name: "Giga-Blitzhagel",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, wird jedes Pokémon der gegnerischen Seite paralysiert, selbst hinter einem Delegator.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: Paralyse.", // NEEDS QC
	},
	gmaxwildfire: {
		name: "Giga-Feuerflug",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, erleidet 4 Runden lang jedes Pokémon der gegnerischen Seite, das nicht vom Typ Feuer ist, am Ende jeder Runde des Effekts – einschließlich der letzten – Schaden in Höhe von 1/6 seiner maximalen KP, abgerundet.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1/6 KP.", // NEEDS QC

		start: "  Flammen hüllten {PARTY} ein!",
		damage: "  {POKEMON} erleidet Schaden durch die Flammen der Attacke Giga-Feuerflug!",
	},
	gmaxwindrage: {
		name: "Giga-Sturmstoß",
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, enden die Effekte von Elektrofeld, Grasfeld, Nebelfeld und Psychofeld, die Effekte von Reflektor, Lichtschild, Auroraschleier, Bodyguard, Weißnebel, Giga-Stahlschlag, Stachler, Giftspitzen, Tarnsteine und Klebenetz auf der Seite des Ziels und die Effekte von Giga-Stahlschlag, Stachler, Giftspitzen, Tarnsteine und Klebenetz auf der Seite des Anwenders.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Beendet Felder, Fallen.", // NEEDS QC
	},
	grassknot: {
		name: "Strauchler",
		// Official flavor text: "Ziel wird durch Gras ins Straucheln gebracht. Je schwerer das Ziel, desto mehr Schaden."
		desc: "Die Stärke beträgt 20, wenn das Ziel weniger als 10 kg wiegt, 40 bei weniger als 25 kg, 60 bei weniger als 50 kg, 80 bei weniger als 100 kg, 100 bei weniger als 200 kg und 120 ab 200 kg.", // NEEDS QC
		shortDesc: "Je schwerer das Ziel, desto stärker.", // NEEDS QC
	},
	grasspledge: {
		name: "Pflanzensäulen",
		// Official flavor text: "Ein Angriff mit Pflanzensäulen. Mit Wassersäulen kombiniert steigt die Wirkung und die Umgebung wird zu einem Sumpf."
		desc: "Hat ein Mitstreiter des Anwenders in dieser Runde Feuersäulen oder Wassersäulen gewählt und noch nicht gehandelt, handelt er direkt nach dem Anwender und dessen Attacke bewirkt nichts. In Kombination mit Feuersäulen setzt der Mitstreiter Feuersäulen mit 150 Stärke ein und ein Feuermeer erscheint 4 Runden lang auf der Seite des Ziels, das Pokémon, die nicht vom Typ Feuer sind, am Ende jeder Runde des Effekts – einschließlich der letzten – Schaden in Höhe von 1/8 ihrer maximalen KP zufügt, abgerundet. In Kombination mit Wassersäulen setzt der Mitstreiter Pflanzensäulen mit 150 Stärke ein und ein Sumpf erscheint 4 Runden lang auf der Seite des Ziels, der die Initiative jedes Pokémon dieser Seite viertelt. Als Kombi-Attacke erhält diese Attacke den Typenbonus unabhängig vom Typ des Anwenders. Diese Attacke verbraucht das Pflanzenjuwel des Anwenders nicht.", // NEEDS QC
		shortDesc: "Mit Feuer-/Wassersäulen: Zusatzeffekt.", // NEEDS QC

		activate: "#waterpledge",
		start: "  Ein Sumpf tut sich um {TEAM} auf!",
		end: "  Der Sumpf um {TEAM} ist verschwunden!",
	},
	grasswhistle: {
		name: "Grasflöte",
		shortDesc: "Schläfert das Ziel ein.", // NEEDS QC
	},
	grassyglide: {
		name: "Grasrutsche",
		// Official flavor text: "Der Anwender rutscht über den Boden und greift das Ziel an. Ermöglicht den Erstschlag, wenn ein Grasfeld aktiv ist."
		desc: "Liegt ein Grasfeld vor und ist der Anwender am Boden, hat diese Attacke eine um 1 erhöhte Priorität.", // NEEDS QC
		shortDesc: "Im Grasfeld: Priorität +1.", // NEEDS QC
	},
	grassyterrain: {
		name: "Grasfeld",
		// Official flavor text: "Regeneriert fünf Runden lang in jeder neuen Runde ein paar KP aller Pokémon, die den Boden berühren. Erhöht die Stärke von Pflanzen-Attacken."
		desc: "5 Runden lang liegt ein Grasfeld vor. Währenddessen wird die Stärke von Attacken vom Typ Pflanze von Pokémon am Boden mit 1,3 multipliziert, die Stärke von Dampfwalze, Erdbeben und Intensität gegen Pokémon am Boden mit 0,5 multipliziert, und Pokémon am Boden stellen am Ende jeder Runde – einschließlich der letzten – 1/16 ihrer maximalen KP wieder her, abgerundet. Tarnung macht den Anwender zum Typ Pflanze, Natur-Kraft wird zu Energieball und Geheimpower hat eine Chance von 30 %, einzuschläfern. Schlägt fehl, wenn bereits ein Grasfeld vorliegt.", // NEEDS QC
		shortDesc: "5 Runden: Pflanze stärker, +1/16 KP am Boden.", // NEEDS QC
		gen7: {
			desc: "5 Runden lang liegt ein Grasfeld vor. Während des Effekts haben Pflanzen-Angriffe von Pokémon am Boden 1,5-fache Stärke, Dampfwalze, Erdbeben und Intensität gegen Pokémon am Boden 0,5-fache Stärke, und Pokémon am Boden stellen am Ende jeder Runde, einschließlich der letzten, 1/16 ihrer maximalen KP wieder her, abgerundet. Tarnung verwandelt den Anwender in ein Pflanzen-Pokémon, Natur-Kraft wird zu Energieball, und Geheimpower hat eine Chance von 30 %, einzuschläfern. Schlägt fehl, wenn bereits ein Grasfeld vorliegt.", // NEEDS QC
		},
	},
	gravapple: {
		name: "Gravitation",
		// Official flavor text: "Ein Apfel fällt aus großer Höhe herab und richtet Schaden an. Dabei wird die Verteidigung des Zieles gesenkt."
		desc: "Hat eine Chance von 100 %, die Verteidigung des Ziels um eine Stufe zu senken. Die Stärke wird während des Effekts von Erdanziehung mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Vert. Bei Erdanziehung x1,5.", // NEEDS QC
	},
	gravity: {
		name: "Erdanziehung",
		// Official flavor text: "Ermöglicht es, Flug-Pokémon oder Pokémon mit der Fähigkeit Schwebe mit Boden-Attacken zu treffen. Verhindert Attacken, bei denen der Anwender fliegt."
		desc: "5 Runden lang wird der Fluchtwert aller Pokémon im Kampf mit 0,6 multipliziert. Beim Einsatz enden Sprungfeder, Fliegen, Magnetflug, Freier Fall und Telekinese sofort für alle Pokémon im Kampf. Während des Effekts können Sprungfeder, Fliegen, Flying Press, Turmkick, Sprungkick, Magnetflug, Freier Fall, Platscher und Telekinese von keinem Pokémon im Kampf eingesetzt werden. Angriffe vom Typ Boden, Stachler, Giftspitzen, Klebenetz und die Fähigkeit Ausweglos können Pokémon vom Typ Flug oder mit der Fähigkeit Schwebe beeinflussen. Schlägt fehl, wenn dieser Effekt bereits aktiv ist.", // NEEDS QC
		shortDesc: "5 Runden: keine Boden-Immunität, Gen. x1,67.", // NEEDS QC
		gen7: {
			desc: "5 Runden lang wird der Fluchtwert aller Pokémon im Kampf mit 0,6 multipliziert. Beim Einsatz enden Sprungfeder, Fliegen, Magnetflug, Freier Fall und Telekinese sofort für alle Pokémon. Während des Effekts können Sprungfeder, Fliegen, Flying Press, Turmkick, Sprungkick, Magnetflug, Freier Fall, Platscher und Telekinese von keinem Pokémon eingesetzt werden. Boden-Angriffe, Stachler, Giftspitzen, Klebenetz und die Fähigkeit Ausweglos können Flug-Pokémon und Pokémon mit der Fähigkeit Schwebe treffen. Schlägt fehl, wenn der Effekt bereits aktiv ist. Betroffene mit Z-Kraft verstärkte Attacken können weiterhin gewählt werden, werden aber bei der Ausführung verhindert.", // NEEDS QC
		},
		gen6: {
			desc: "5 Runden lang wird der Fluchtwert aller Pokémon im Kampf mit 0,6 multipliziert. Beim Einsatz enden Sprungfeder, Fliegen, Magnetflug, Freier Fall und Telekinese sofort für alle Pokémon im Kampf. Während des Effekts können Sprungfeder, Fliegen, Flying Press, Turmkick, Sprungkick, Magnetflug, Freier Fall, Platscher und Telekinese von keinem Pokémon im Kampf eingesetzt werden. Angriffe vom Typ Boden, Stachler, Giftspitzen, Klebenetz und die Fähigkeit Ausweglos können Pokémon vom Typ Flug oder mit der Fähigkeit Schwebe beeinflussen. Schlägt fehl, wenn dieser Effekt bereits aktiv ist.", // NEEDS QC
		},
		gen5: {
			desc: "5 Runden lang wird der Fluchtwert aller Pokémon im Kampf mit 0,6 multipliziert. Beim Einsatz enden Sprungfeder, Fliegen, Magnetflug, Freier Fall und Telekinese sofort für alle Pokémon. Während des Effekts können Sprungfeder, Fliegen, Turmkick, Sprungkick, Magnetflug, Freier Fall, Platscher und Telekinese von keinem Pokémon eingesetzt werden. Boden-Angriffe, Stachler, Giftspitzen und die Fähigkeit Ausweglos können Flug-Pokémon und Pokémon mit der Fähigkeit Schwebe treffen. Schlägt fehl, wenn der Effekt bereits aktiv ist.", // NEEDS QC
		},
		gen4: {
			desc: "5 Runden lang wird der Fluchtwert aller Pokémon im Kampf mit 0,6 multipliziert. Beim Einsatz enden Sprungfeder, Fliegen und Magnetflug sofort für alle Pokémon. Während des Effekts können Sprungfeder, Fliegen, Turmkick, Sprungkick, Magnetflug und Platscher von keinem Pokémon eingesetzt werden. Boden-Angriffe, Stachler, Giftspitzen und die Fähigkeit Ausweglos können Flug-Pokémon und Pokémon mit der Fähigkeit Schwebe treffen. Schlägt fehl, wenn der Effekt bereits aktiv ist.", // NEEDS QC
		},
	},
	growl: {
		name: "Heuler",
		// Official flavor text: "Der Anwender heult herzzerreißend, um gegnerische Pokémon nachlässig werden zu lassen und deren Angriffs-Wert zu senken."
		desc: "Senkt den Angriff des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Angriff der Gegner.", // NEEDS QC
		gen2: {
			shortDesc: "Senkt Angriff des Ziels um eine Stufe.", // NEEDS QC
		},
	},
	growth: {
		name: "Wachstum",
		// Official flavor text: "Der Körper wächst. Dadurch steigen Angriff und Spezial-Angriff."
		desc: "Erhöht den Angriff und den Spezial-Angriff des Anwenders um eine Stufe. Ist das Wetter Sonne oder Gleißende Sonne, steigen sie um 2 Stufen. Trägt der Anwender einen Allzweckschirm, steigen sie nur um eine Stufe, selbst bei Sonne oder Gleißende Sonne.", // NEEDS QC
		shortDesc: "+1 Angriff und Sp.-Ang.; +2 bei Sonne.", // NEEDS QC
		gen7: {
			desc: "Erhöht den Angriff und den Spezial-Angriff des Anwenders um je eine Stufe. Bei Sonnenlicht oder extrem starkem Sonnenlicht werden sie um je 2 Stufen erhöht.", // NEEDS QC
		},
		gen5: {
			desc: "Erhöht den Angriff und den Spezial-Angriff des Anwenders um je eine Stufe. Bei Sonne werden sie um je 2 Stufen erhöht.", // NEEDS QC
		},
		gen4: {
			desc: "Erhöht den Spezial-Angriff des Anwenders um eine Stufe.", // NEEDS QC
			shortDesc: "Erhöht den Sp.-Ang. des Anwenders um 1.", // NEEDS QC
		},
		gen1: {
			desc: "Erhöht den Spezial-Wert des Anwenders um eine Stufe.", // NEEDS QC
			shortDesc: "Erhöht den Spezial-Wert des Anwenders um 1.", // NEEDS QC
		},
	},
	grudge: {
		name: "Nachspiel",
		// Official flavor text: "Bei K.O. des Anwenders werden die AP der Attacke, durch die er besiegt wurde, auf 0 herabgesetzt."
		desc: "Macht ein gegnerischer Angriff den Anwender vor seiner nächsten Aktion kampfunfähig, verliert diese Attacke alle verbleibenden AP.", // NEEDS QC
		shortDesc: "Wird er besiegt, verliert die Attacke alle AP.", // NEEDS QC

		activate: "  {MOVE} von {POKEMON} hat durch Nachspiel alle AP verloren!",
		start: "{POKEMON} möchte, dass der Gegner ein Nachspiel erträgt!",
	},
	guardianofalola: {
		name: "Alolas Wächter",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Fügt dem Ziel Schaden in Höhe von 3/4 seiner aktuellen KP zu, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "Schaden = 3/4 der aktuellen KP des Ziels.", // NEEDS QC
	},
	guardsplit: {
		name: "Schutzteiler",
		// Official flavor text: "Durch Psycho-Kräfte werden Verteidigung und Spezial-Verteidigung des Anwenders und des Zieles addiert und in zwei gleiche Hälften geteilt."
		desc: "Verteidigung und Spezial-Verteidigung von Anwender und Ziel werden auf den Durchschnitt der jeweiligen Werte gesetzt, abgerundet. Statusveränderungen bleiben unberührt.", // NEEDS QC
		shortDesc: "Mittelt Vert. und Sp.-Vert. mit dem Ziel.", // NEEDS QC

		activate: "  {POKEMON} addiert seine Schutzkräfte mit jenen des Ziels und teilt sie gerecht auf!",
	},
	guardswap: {
		name: "Schutztausch",
		// Official flavor text: "Psychische Kräfte tauschen Änderungen an Verteidigung und Spezial-Verteidigung mit denen des Zieles."
		desc: "Der Anwender tauscht seine Statusveränderungen von Verteidigung und Spezial-Verteidigung mit denen des Ziels.", // NEEDS QC
		shortDesc: "Tauscht Vert.-/Sp.-Vert.-Änderungen mit dem Ziel.", // NEEDS QC
	},
	guillotine: {
		name: "Guillotine",
		// Official flavor text: "Ein Angriff mit einer großen Schere. Trifft die Attacke, führt sie beim Ziel sofort zum K.O."
		desc: "Fügt dem Ziel Schaden in Höhe seiner maximalen KP zu. Ignoriert Genauigkeits- und Fluchtwert-Modifikatoren. Die Genauigkeit dieses Angriffs beträgt (Level des Anwenders - Level des Ziels + 30) %, und er schlägt fehl, wenn das Ziel ein höheres Level hat. Pokémon mit der Fähigkeit Robustheit sind immun.", // NEEDS QC
		shortDesc: "K.O. mit einem Treffer. Nicht bei höherem Ziel-Level.", // NEEDS QC
		gen2: {
			desc: "Fügt dem Ziel 65535 Schaden zu. Die Genauigkeit dieser Attacke von 256 entspricht dem kleineren Wert von (2 × (Level des Anwenders − Level des Ziels) + 76) und 255, bevor Genauigkeits- und Fluchtwert-Veränderungen angewendet werden. Schlägt fehl, wenn das Ziel ein höheres Level hat.", // NEEDS QC
		},
		gen1: {
			desc: "Fügt dem Ziel 65535 Schaden zu. Schlägt fehl, wenn die Initiative des Ziels höher ist als die des Anwenders.", // NEEDS QC
			shortDesc: "65535 Schaden. Scheitert bei schnellerem Ziel.", // NEEDS QC
		},
	},
	gunkshot: {
		name: "Mülltreffer",
		// Official flavor text: "Anwender schießt mit Müll auf das Ziel. Vergiftet dieses eventuell."
		desc: "Hat eine Chance von 30 %, das Ziel zu vergiften.", // NEEDS QC
		shortDesc: "30 % Chance auf Vergiftung.", // NEEDS QC
	},
	gust: {
		name: "Windstoß",
		// Official flavor text: "Trifft das Ziel mit einem Windstoß, den es mit seinen Flügeln erzeugt."
		desc: "Die Stärke wird verdoppelt, wenn das Ziel gerade Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht.", // NEEDS QC
		shortDesc: "Doppelt gegen Fliegende (Fliegen usw.).", // NEEDS QC
		gen4: {
			desc: "Die Stärke wird verdoppelt, wenn das Ziel Sprungfeder oder Fliegen einsetzt.", // NEEDS QC
			shortDesc: "2x Stärke gegen Sprungfeder und Fliegen.", // NEEDS QC
		},
		gen2: {
			desc: "Die Stärke wird verdoppelt, wenn das Ziel Fliegen einsetzt.", // NEEDS QC
			shortDesc: "2x Stärke gegen Fliegen.", // NEEDS QC
		},
		gen1: {
			desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
			shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		},
	},
	gyroball: {
		name: "Gyroball",
		// Official flavor text: "Angriff mit hoher Geschwindigkeit. Je niedriger die Initiative des Anwenders im Vergleich zum Ziel ist, desto höher der Schaden."
		desc: "Die Stärke beträgt (25 × aktuelle Initiative des Ziels / aktuelle Initiative des Anwenders) + 1, abgerundet, höchstens jedoch 150. Beträgt die aktuelle Initiative des Anwenders 0, beträgt die Stärke 1.", // NEEDS QC
		shortDesc: "Je langsamer als das Ziel, desto stärker.", // NEEDS QC
		gen5: {
			desc: "Die Stärke beträgt (25 × aktuelle Initiative des Ziels ÷ aktuelle Initiative des Anwenders) + 1, abgerundet, aber höchstens 150. Beträgt die aktuelle Initiative des Anwenders 0, wird sie als 1 behandelt.", // NEEDS QC
		},
	},
	hail: {
		name: "Hagelsturm",
		// Official flavor text: "Hagelsturm für fünf Runden. Schadet allen außer Eis-Pokémon."
		desc: "5 Runden lang hagelt es. Am Ende jeder Runde außer der letzten verlieren alle Pokémon im Kampf 1/16 ihrer maximalen KP, abgerundet, außer sie sind vom Typ Eis oder haben die Fähigkeit Eishaut, Magieschild, Partikelschutz oder Schneemantel. Hält 8 Runden an, wenn der Anwender einen Eisbrocken trägt. Schlägt fehl, wenn es bereits hagelt.", // NEEDS QC
		shortDesc: "5 Runden lang fällt Hagel.", // NEEDS QC
		gen4: {
			desc: "5 Runden lang hagelt es. Am Ende jeder Runde außer der letzten verlieren alle Pokémon im Kampf 1/16 ihrer maximalen KP, abgerundet, außer sie sind Eis-Pokémon oder haben die Fähigkeit Eishaut, Magieschild oder Schneemantel. Hält 8 Runden an, wenn der Anwender einen Eisbrocken trägt. Schlägt fehl, wenn es bereits hagelt.", // NEEDS QC
		},
		gen3: {
			desc: "5 Runden lang hagelt es. Am Ende jeder Runde außer der letzten verlieren alle Pokémon im Kampf 1/16 ihrer maximalen KP, abgerundet, außer sie sind Eis-Pokémon. Schlägt fehl, wenn es bereits hagelt.", // NEEDS QC
		},
	},
	hammerarm: {
		name: "Hammerarm",
		// Official flavor text: "Anwender trifft mit einem starken Hieb. Senkt Initiative des Anwenders."
		desc: "Senkt die Initiative des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Initiative des Anwenders um eine Stufe.", // NEEDS QC
	},
	happyhour: {
		name: "Goldene Zeiten",
		shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC

		activate: "  Goldene Zeiten sind angebrochen!",
	},
	harden: {
		name: "Härtner",
		// Official flavor text: "Stärkt die Muskulatur und erhöht den Verteidigungs-Wert."
		desc: "Erhöht die Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "Erhöht Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
	},
	hardpress: {
		name: "Stahlpresse",
		desc: "Die Stärke beträgt 100 × (aktuelle KP des Ziels / maximale KP des Ziels), ab 0,5 abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Je mehr KP das Ziel hat, desto stärker.", // NEEDS QC
	},
	haze: {
		name: "Dunkelnebel",
		// Official flavor text: "Erzeugt einen dunklen Nebel. Alle Veränderungen der Statuswerte der Kampfteilnehmer werden annulliert."
		desc: "Setzt die Statusveränderungen aller Pokémon im Kampf auf 0 zurück.", // NEEDS QC
		shortDesc: "Hebt alle Statusveränderungen auf.", // NEEDS QC
		gen1: {
			desc: "Setzt die Statusveränderungen beider Pokémon auf 0 zurück und hebt die Wertesenkungen durch Verbrennung und Paralyse auf. Setzt Toxin-Zähler auf 0 zurück und entfernt bei beiden Pokémon die Effekte von Verwirrung sowie Konfusstrahl, Aussetzer, Energiefokus, Egelsamen, Lichtschild, Weißnebel und Reflektor. Entfernt das Statusproblem des Gegners.", // NEEDS QC
			shortDesc: "Setzt alle Statusänderungen zurück. Heilt Gegner.", // NEEDS QC
		},

		// Only used in Gen 1
		activate: "  Alle STATUSVERÄNDERUNGEN wurden entfernt!",
	},
	headbutt: {
		name: "Kopfnuss",
		// Official flavor text: "Rammt das Ziel mit einer Kopfnuss. Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	headcharge: {
		name: "Steinschädel",
		// Official flavor text: "Rempelattacke mit ausgeflippter Retrofrisur. Anwender nimmt selbst leichten Schaden."
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "1/4 Rückstoßschaden.", // NEEDS QC
	},
	headlongrush: {
		name: "Schmetterramme",
		desc: "Senkt die Verteidigung und die Spezial-Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Vert. und Sp.-Vert. des Anwenders.", // NEEDS QC
	},
	headsmash: {
		name: "Kopfstoß",
		// Official flavor text: "Anwender greift unter Einsatz seines Lebens mit einem Kopfstoß an und nimmt dabei selbst jede Menge Schaden."
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe der Hälfte der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "1/2 Rückstoßschaden.", // NEEDS QC
		gen4: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/2 der verlorenen KP, abgerundet, aber mindestens 1 KP.", // NEEDS QC
		},
	},
	healbell: {
		name: "Vitalglocke",
		// Official flavor text: "Läutet beruhigend und heilt alle Statusprobleme im Team."
		desc: "Alle Pokémon im Team des Anwenders werden von ihren Statusproblemen geheilt. Pokémon im Kampf mit der Fähigkeit Lärmschutz werden nicht geheilt, außer es handelt sich um den Anwender.", // NEEDS QC
		shortDesc: "Heilt die Statusprobleme des ganzen Teams.", // NEEDS QC
		gen7: {
			desc: "Jedes Pokémon im Team des Anwenders wird von seinem Statusproblem geheilt. Pokémon im Kampf mit der Fähigkeit Lärmschutz werden nicht geheilt.", // NEEDS QC
		},
		gen5: {
			desc: "Jedes Pokémon im Team des Anwenders wird von seinem Statusproblem geheilt. Auch Pokémon im Kampf mit der Fähigkeit Lärmschutz werden geheilt.", // NEEDS QC
		},
		gen4: {
			desc: "Jedes Pokémon im Team des Anwenders wird von seinem Statusproblem geheilt. Pokémon mit der Fähigkeit Lärmschutz werden nicht geheilt.", // NEEDS QC
		},
		gen2: {
			desc: "Alle Pokémon im Team des Anwenders werden von ihren Statusproblemen geheilt.", // NEEDS QC
		},

		activate: "  Eine Glocke läutet!",
	},
	healblock: {
		name: "Heilblockade",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "5 Runden lang kann das Ziel keine KP wiederherstellen, solange es im Kampf bleibt. Während des Effekts sind heilende und absorbierende Attacken unbrauchbar, und heilende Fähigkeiten und Items heilen nicht. Setzt ein betroffenes Pokémon Stafette ein, kann auch der Nachfolger keine KP wiederherstellen. Leidteiler und die Fähigkeit Belebekraft sind nicht betroffen.", // NEEDS QC
		shortDesc: "Gegner können sich 5 Runden nicht heilen.", // NEEDS QC
		gen8: {
			end: "  {POKEMON} kann nun wieder geheilt werden!",
			cant: "{POKEMON} kann {MOVE} aufgrund von Heilblockade nicht einsetzen.",
		},
		gen7: {
			desc: "5 Runden lang kann das Ziel keine KP wiederherstellen, solange es im Kampf bleibt. Während des Effekts sind Heil- und Absorptionsattacken unbrauchbar, und heilende Fähigkeiten und Items heilen den Betroffenen nicht. Setzt ein betroffenes Pokémon Stafette ein, kann auch der Nachfolger keine KP wiederherstellen. Leidteiler und die Fähigkeit Belebekraft sind nicht betroffen. Betroffene mit Z-Kraft verstärkte Attacken können während des Effekts weiterhin gewählt und eingesetzt werden.", // NEEDS QC
		},
		gen6: {
			desc: "5 Runden lang kann das Ziel keine KP wiederherstellen, solange es im Kampf bleibt. Während des Effekts sind heilende und absorbierende Attacken unbrauchbar, und heilende Fähigkeiten und Items heilen nicht. Setzt ein betroffenes Pokémon Stafette ein, kann auch der Nachfolger keine KP wiederherstellen. Leidteiler und die Fähigkeit Belebekraft sind nicht betroffen.", // NEEDS QC
		},
		gen4: {
			desc: "5 Runden lang kann das Ziel keine KP wiederherstellen, solange es im Kampf bleibt. Während des Effekts sind Heilattacken unbrauchbar und heilende Attackeneffekte wirken nicht, aber Fähigkeiten und Items heilen den Betroffenen weiterhin. Setzt ein betroffenes Pokémon Stafette ein, bleibt der Nachfolger unter dem Effekt. Leidteiler ist nicht betroffen.", // NEEDS QC
		},

		start: "  Die Heilung von {POKEMON} wurde verhindert!",
		end: "  {POKEMON} kann nun wieder geheilt werden!",
		cant: "{POKEMON} kann {MOVE} nicht einsetzen, da die Heilung blockiert wird!",
		fail: "  Aber der Einsatz bei {POKEMON} schlug fehl!",
	},
	healingwish: {
		name: "Heilopfer",
		// Official flavor text: "Anwender geht K.O. Das an seine Stelle tretende Pokémon hat volle KP. Statusprobleme werden geheilt."
		desc: "Der Anwender wird kampfunfähig, und hat das Pokémon, das ihn ersetzt, nicht volle KP oder ein Statusproblem, werden seine KP vollständig wiederhergestellt und sein Statusproblem geheilt. Der Ersatz wird am Ende der Runde eingewechselt, und die Heilung erfolgt vor dem Effekt von Fallen. Dieser Effekt hält an, bis ein Pokémon, das eine dieser Bedingungen erfüllt, an der Position des Anwenders eingewechselt oder mit Seitentausch dorthin getauscht wird. Schlägt fehl, wenn der Anwender das letzte kampffähige Pokémon seines Teams ist.", // NEEDS QC
		shortDesc: "Wird besiegt; heilt das nächste verletzte Pokémon.", // NEEDS QC
		gen7: {
			desc: "Der Anwender wird kampfunfähig, und das Pokémon, das ihn ersetzt, wird vollständig geheilt und von seinem Statusproblem befreit. Das neue Pokémon wird am Ende der Runde eingewechselt, und die Heilung erfolgt, bevor Fallen wirken. Schlägt fehl, wenn der Anwender das letzte nicht kampfunfähige Pokémon seines Teams ist.", // NEEDS QC
			shortDesc: "Anwender: K.O. Nachfolger wird voll geheilt.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender wird kampfunfähig, und das Pokémon, das ihn ersetzt, wird vollständig geheilt und von seinem Statusproblem befreit. Das neue Pokémon wird sofort eingewechselt, und die Heilung erfolgt, nachdem Fallen gewirkt haben. Schlägt fehl, wenn der Anwender das letzte nicht kampfunfähige Pokémon seines Teams ist.", // NEEDS QC
		},

		heal: "  Das Heilopfer erreicht {POKEMON}!",
	},
	healorder: {
		name: "Heilbefehl",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um die Hälfte der max. KP.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, abgerundet.", // NEEDS QC
		},
	},
	healpulse: {
		name: "Heilwoge",
		// Official flavor text: "Anwender löst eine Schmerzen lindernde Welle aus und heilt dabei das Ziel mit der Hälfte von dessen maximalen KP."
		desc: "Das Ziel stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet. Hat der Anwender die Fähigkeit Megawumme, stellt es stattdessen 3/4 seiner maximalen KP wieder her, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt das Ziel um die Hälfte seiner max. KP.", // NEEDS QC
		gen5: {
			desc: "Das Ziel stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet.", // NEEDS QC
		},
	},
	heartstamp: {
		name: "Herzstempel",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	heartswap: {
		name: "Statustausch",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Der Anwender tauscht alle seine Statusveränderungen mit denen des Ziels.", // NEEDS QC
		shortDesc: "Tauscht alle Statusveränderungen mit dem Ziel.", // NEEDS QC
	},
	heatcrash: {
		name: "Brandstempel",
		// Official flavor text: "Rempelattacke mit brennendem Körper. Je schwerer der Anwender im Vergleich zum Ziel ist, desto stärker die Attacke."
		desc: "Die Stärke hängt von (Gewicht des Anwenders / Gewicht des Ziels) ab, abgerundet. Sie beträgt 120 bei einem Ergebnis von 5 oder mehr, 100 bei 4, 80 bei 3, 60 bei 2 und 40 bei 1 oder weniger. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		shortDesc: "Je schwerer der Anwender als das Ziel, desto stärker.", // NEEDS QC
		gen5: {
			desc: "Die Stärke hängt von (Gewicht des Anwenders ÷ Gewicht des Ziels) ab, abgerundet. Sie beträgt 120 bei einem Ergebnis von 5 oder mehr, 100 bei 4, 80 bei 3, 60 bei 2 und 40 bei 1 oder weniger.", // NEEDS QC
		},
	},
	heatwave: {
		name: "Hitzewelle",
		// Official flavor text: "Gegnerische Pokémon werden von einem Sturm aus heißer Luft getroffen und erleiden eventuell Verbrennungen."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "10 % Chance auf Verbrennung.", // NEEDS QC
	},
	heavyslam: {
		name: "Rammboss",
		// Official flavor text: "Anwender rammt das Ziel mit massivem Körper. Je schwerer er im Vergleich zum Ziel ist, desto stärker die Attacke."
		desc: "Die Stärke hängt von (Gewicht des Anwenders / Gewicht des Ziels) ab, abgerundet. Sie beträgt 120 bei einem Ergebnis von 5 oder mehr, 100 bei 4, 80 bei 3, 60 bei 2 und 40 bei 1 oder weniger. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		shortDesc: "Je schwerer der Anwender als das Ziel, desto stärker.", // NEEDS QC
		gen6: {
			desc: "Die Stärke hängt von (Gewicht des Anwenders ÷ Gewicht des Ziels) ab, abgerundet. Sie beträgt 120 bei einem Ergebnis von 5 oder mehr, 100 bei 4, 80 bei 3, 60 bei 2 und 40 bei 1 oder weniger.", // NEEDS QC
		},
	},
	helpinghand: {
		name: "Rechte Hand",
		// Official flavor text: "Anwender steigert die Stärke der Attacke eines Mitstreiters."
		desc: "Die Stärke des Angriffs des Ziels wird in dieser Runde mit 1,5 multipliziert (dieser Effekt ist kumulierbar). Schlägt fehl, wenn kein Mitstreiter neben dem Anwender steht oder der Mitstreiter in dieser Runde bereits gehandelt hat, jedoch nicht, wenn er eine Zwei-Runden-Attacke einsetzt.", // NEEDS QC
		shortDesc: "Die Attacke eines Partners wird x1,5 verstärkt.", // NEEDS QC

		start: "  {SOURCE} will {POKEMON} helfen!",
	},
	hex: {
		name: "Bürde",
		// Official flavor text: "Eine Attacke, bei der der Anwender das Ziel bedrängt. Fügt Zielen mit Statusproblemen hohen Schaden zu."
		desc: "Die Stärke wird verdoppelt, wenn das Ziel ein Statusproblem hat.", // NEEDS QC
		shortDesc: "Doppelte Stärke gegen Ziele mit Statusproblem.", // NEEDS QC
	},
	hiddenpower: {
		name: "Kraftreserve",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Der Typ dieser Attacke hängt von den individuellen Stärken (IV) des Anwenders ab und kann jeder Typ außer Fee und Normal sein.", // NEEDS QC
		shortDesc: "Der Typ hängt von den DVs des Anwenders ab.", // NEEDS QC
		gen5: {
			desc: "Typ und Stärke dieser Attacke hängen von den DVs des Anwenders ab. Die Stärke variiert zwischen 30 und 70, und der Typ kann jeder außer Normal sein.", // NEEDS QC
			shortDesc: "Stärke und Typ hängen von den IVs ab.", // NEEDS QC
		},
	},
	hiddenpowerbug: {
		name: "Kraftreserve Käfer", // NEEDS QC
	},
	hiddenpowerdark: {
		name: "Kraftreserve Unlicht", // NEEDS QC
	},
	hiddenpowerdragon: {
		name: "Kraftreserve Drache", // NEEDS QC
	},
	hiddenpowerelectric: {
		name: "Kraftreserve Elektro", // NEEDS QC
	},
	hiddenpowerfighting: {
		name: "Kraftreserve Kampf", // NEEDS QC
	},
	hiddenpowerfire: {
		name: "Kraftreserve Feuer", // NEEDS QC
	},
	hiddenpowerflying: {
		name: "Kraftreserve Flug", // NEEDS QC
	},
	hiddenpowerghost: {
		name: "Kraftreserve Geist", // NEEDS QC
	},
	hiddenpowergrass: {
		name: "Kraftreserve Pflanze", // NEEDS QC
	},
	hiddenpowerground: {
		name: "Kraftreserve Boden", // NEEDS QC
	},
	hiddenpowerice: {
		name: "Kraftreserve Eis", // NEEDS QC
	},
	hiddenpowerpoison: {
		name: "Kraftreserve Gift", // NEEDS QC
	},
	hiddenpowerpsychic: {
		name: "Kraftreserve Psycho", // NEEDS QC
	},
	hiddenpowerrock: {
		name: "Kraftreserve Gestein", // NEEDS QC
	},
	hiddenpowersteel: {
		name: "Kraftreserve Stahl", // NEEDS QC
	},
	hiddenpowerwater: {
		name: "Kraftreserve Wasser", // NEEDS QC
	},
	highhorsepower: {
		name: "Pferdestärke",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	highjumpkick: {
		name: "Turmkick",
		// Official flavor text: "Sprungtritt mit Knie. Bei Misserfolg verletzt sich der Anwender selbst."
		desc: "Schlägt dieser Angriff fehl, verliert der Anwender die Hälfte seiner maximalen KP, abgerundet, als Fehlschlagschaden. Pokémon mit der Fähigkeit Magieschild erleiden keinen Fehlschlagschaden.", // NEEDS QC
		shortDesc: "Verfehlt sie, verliert der Anwender die halben max. KP.", // NEEDS QC
		gen4: {
			desc: "Schlägt dieser Angriff fehl, verliert der Anwender als Fehlschlagschaden die Hälfte der maximalen KP des Ziels, abgerundet, wenn das Ziel immun war, andernfalls die Hälfte des Schadens, den das Ziel erlitten hätte, abgerundet, aber mindestens 1 KP und höchstens die Hälfte der maximalen KP des Ziels. Pokémon mit der Fähigkeit Magieschild erleiden keinen Fehlschlagschaden.", // NEEDS QC
			shortDesc: "Verfehlt sie, erleidet der Anwender 1/2 des Schadens.", // NEEDS QC
		},
		gen3: {
			desc: "Schlägt dieser Angriff fehl und war das Ziel nicht immun, verliert der Anwender als Fehlschlagschaden die Hälfte des Schadens, den das Ziel erlitten hätte, abgerundet, aber mindestens 1 KP und höchstens die Hälfte der maximalen KP des Ziels.", // NEEDS QC
			shortDesc: "Verfehlt sie, erleidet der Anwender 1/2 des Schadens.", // NEEDS QC
		},
		gen2: {
			desc: "Schlägt dieser Angriff fehl und war das Ziel nicht immun, verliert der Anwender als Fehlschlagschaden 1/8 des Schadens, den das Ziel erlitten hätte, abgerundet, aber mindestens 1 KP.", // NEEDS QC
			shortDesc: "Verfehlt sie, erleidet der Anwender 1/8 des Schadens.", // NEEDS QC
		},
		gen1: {
			desc: "Verfehlt dieser Angriff das Ziel, erleidet der Anwender 1 KP Fehlschlagschaden. Hat der Anwender einen Delegator, erleidet der Delegator des Ziels diesen Schaden, falls vorhanden, andernfalls entsteht kein Fehlschlagschaden.", // NEEDS QC
			shortDesc: "Verfehlt sie, erleidet der Anwender 1 KP Schaden.", // NEEDS QC
		},

		damage: "#crash",
	},
	holdback: {
		name: "Zurückhaltung",
		// Official flavor text: "Der Anwender hält sich beim Angriff zurück und sorgt auf diese Weise dafür, dass dem Ziel danach mindestens 1 KP verbleibt."
		desc: "Lässt dem Ziel mindestens 1 KP.", // NEEDS QC
		shortDesc: "Lässt dem Ziel immer mindestens 1 KP.", // NEEDS QC
	},
	holdhands: {
		name: "Händchenhalten",
		// Official flavor text: "Der Anwender und ein Mitstreiter reichen einander die Hände und verfallen in einen Zustand tiefster Zufriedenheit."
		desc: "Kein Nutzen im Kampf. Schlägt fehl, wenn kein Mitstreiter neben dem Anwender steht.", // NEEDS QC
		shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC
	},
	honeclaws: {
		name: "Klauenwetzer",
		// Official flavor text: "Wetzt seine Klauen, um sie zu schärfen. Erhöht Angriff und Genauigkeit des Anwenders."
		desc: "Erhöht den Angriff und die Genauigkeit des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Ang. und Gen. des Anwenders.", // NEEDS QC
	},
	hornattack: {
		name: "Hornattacke",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	horndrill: {
		name: "Hornbohrer",
		// Official flavor text: "Attacke, bei der ein Horn als Bohrer eingesetzt wird. Ist sie erfolgreich, führt sie zu einem K.O."
		desc: "Fügt dem Ziel Schaden in Höhe seiner maximalen KP zu. Ignoriert Genauigkeits- und Fluchtwert-Modifikatoren. Die Genauigkeit dieses Angriffs beträgt (Level des Anwenders - Level des Ziels + 30) %, und er schlägt fehl, wenn das Ziel ein höheres Level hat. Pokémon mit der Fähigkeit Robustheit sind immun.", // NEEDS QC
		shortDesc: "K.O. mit einem Treffer. Nicht bei höherem Ziel-Level.", // NEEDS QC
		gen2: {
			desc: "Fügt dem Ziel 65535 Schaden zu. Die Genauigkeit dieser Attacke von 256 entspricht dem kleineren Wert von (2 × (Level des Anwenders − Level des Ziels) + 76) und 255, bevor Genauigkeits- und Fluchtwert-Veränderungen angewendet werden. Schlägt fehl, wenn das Ziel ein höheres Level hat.", // NEEDS QC
		},
		gen1: {
			desc: "Fügt dem Ziel 65535 Schaden zu. Schlägt fehl, wenn die Initiative des Ziels höher ist als die des Anwenders.", // NEEDS QC
			shortDesc: "65535 Schaden. Scheitert bei schnellerem Ziel.", // NEEDS QC
		},
	},
	hornleech: {
		name: "Holzgeweih",
		// Official flavor text: "Greift Ziel mit einem Astgeweih an und zapft diesem Energie ab. Anwender wird um die Hälfte des zugefügten Schadens geheilt."
		desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 50 % des Schadens.", // NEEDS QC
	},
	howl: {
		name: "Jauler",
		// Official flavor text: "Der Kampfgeist sowie der Angriffs-Wert des Anwenders und seiner Mitstreiter werden durch lautes Jaulen erhöht."
		desc: "Erhöht den Angriff des Anwenders und aller Mitstreiter um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Angriff für den Anwender und Partner.", // NEEDS QC
		gen7: {
			desc: "Erhöht den Angriff des Anwenders um eine Stufe.", // NEEDS QC
			shortDesc: "Erhöht Angriff des Anwenders um eine Stufe.", // NEEDS QC
		},
	},
	hurricane: {
		name: "Orkan",
		// Official flavor text: "Anwender greift das Ziel an, indem er es mit heftigen Windböen umgibt. Ziel wird eventuell verwirrt."
		desc: "Hat eine Chance von 30 %, das Ziel zu verwirren. Diese Attacke kann ein Ziel treffen, das gerade Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht. Ist das Wetter Strömender Regen oder Regen, prüft diese Attacke keine Genauigkeit. Ist das Wetter Gleißende Sonne oder Sonne, beträgt ihre Genauigkeit 50 %. Gegen ein Pokémon mit Allzweckschirm bleibt die Genauigkeit bei 70 %.", // NEEDS QC
		shortDesc: "30 % Verwirrung. Trifft bei Regen immer.", // NEEDS QC
		gen7: {
			desc: "Hat eine Chance von 30 %, das Ziel zu verwirren. Diese Attacke kann ein Ziel treffen, das Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht. Bei starkem Regen oder Regen prüft diese Attacke keine Genauigkeit. Bei extrem starkem Sonnenlicht oder Sonne beträgt ihre Genauigkeit 50 %.", // NEEDS QC
		},
		gen5: {
			desc: "Hat eine Chance von 30 %, das Ziel zu verwirren. Diese Attacke kann ein Ziel treffen, das Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht. Bei Regen prüft diese Attacke keine Genauigkeit. Bei Sonne beträgt ihre Genauigkeit 50 %.", // NEEDS QC
		},
	},
	hydrocannon: {
		name: "Aquahaubitze",
		// Official flavor text: "Das Ziel wird von einer Wasserkanone getroffen. Anwender setzt eine Runde aus."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
	},
	hydropump: {
		name: "Hydropumpe",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	hydrosteam: {
		name: "Hydrodampf",
		desc: "Ist das Wetter Sonne und trägt der Anwender keinen Allzweckschirm, wird der Schaden dieser Attacke mit 1,5 multipliziert, statt wegen ihres Typs Wasser halbiert zu werden.", // NEEDS QC
		shortDesc: "Bei Sonne x1,5 statt halbiert.", // NEEDS QC
	},
	hydrovortex: {
		name: "Super-Wassertornado",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	hyperbeam: {
		name: "Hyperstrahl",
		// Official flavor text: "Starke Attacke, die den Anwender zwingt, eine Runde auszusetzen."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
		gen1: {
			desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen, außer das Ziel oder sein Delegator wurde durch diese Attacke besiegt.", // NEEDS QC
			shortDesc: "Nächste Runde Pause, wenn das Ziel nicht besiegt ist.", // NEEDS QC
		},
	},
	hyperdrill: {
		name: "Hyperbohrer",
		shortDesc: "Umgeht Schutz, ohne ihn zu brechen.", // NEEDS QC
	},
	hyperfang: {
		name: "Hyperzahn",
		// Official flavor text: "Angriff mit scharfen Reißzähnen. Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 10 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "10 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	hyperspacefury: {
		name: "Dimensionswahn",
		// Official flavor text: "Eine Angriffsserie mit vielen Armen, die die Wirkung von Attacken wie Schutzschild und Scanner durchbricht. Dabei sinkt die Verteidigung des Anwenders."
		desc: "Senkt die Verteidigung des Anwenders um eine Stufe. Diese Attacke kann nur erfolgreich eingesetzt werden, wenn die aktuelle Form des Anwenders, unter Berücksichtigung von Wandler, Entfesseltes Hoopa ist. Gelingt diese Attacke, durchbricht sie für diese Runde die Effekte von Bunker, Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen.", // NEEDS QC
		shortDesc: "Nur Entfesseltes Hoopa: -1 eigene Vert.; bricht Schutz.", // NEEDS QC
		gen6: {
			desc: "Senkt die Verteidigung des Anwenders um eine Stufe. Diese Attacke kann nur eingesetzt werden, wenn die aktuelle Form des Anwenders, Verwandlung eingerechnet, Hoopas Entfesselte Form ist. Gelingt diese Attacke, durchbricht sie in dieser Runde Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen.", // NEEDS QC
		},

		activate: "#shadowforce",
		fail: "#darkvoid",
	},
	hyperspacehole: {
		name: "Dimensionsloch",
		// Official flavor text: "Der Anwender positioniert sich mithilfe eines Dimensionslochs direkt neben dem Ziel und durchbricht selbst Schutzschild, Scanner etc."
		desc: "Gelingt diese Attacke, durchbricht sie für diese Runde die Effekte von Bunker, Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen.", // NEEDS QC
		shortDesc: "Durchbricht den Schutz des Ziels.", // NEEDS QC
		gen6: {
			desc: "Gelingt diese Attacke, durchbricht sie in dieser Runde Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen.", // NEEDS QC
		},

		activate: "#shadowforce",
	},
	hypervoice: {
		name: "Schallwelle",
		// Official flavor text: "Eine laute Attacke, bei der gegnerische Pokémon mit Schallwellen angegriffen werden."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Gegner.", // NEEDS QC
	},
	hypnosis: {
		name: "Hypnose",
		shortDesc: "Schläfert das Ziel ein.", // NEEDS QC
	},
	iceball: {
		name: "Frostbeule",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Gelingt diese Attacke, ist der Anwender an sie gebunden und kann keine andere Aktion ausführen, bis sie verfehlt, 5 Runden vergangen sind oder der Angriff nicht mehr eingesetzt werden kann. Die Stärke verdoppelt sich mit jedem Treffer und noch einmal, wenn der Anwender zuvor Einigler eingesetzt hat. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt.", // NEEDS QC
		shortDesc: "Stärke verdoppelt sich je Treffer. 5 Runden lang.", // NEEDS QC
		gen7: {
			desc: "Gelingt diese Attacke, ist der Anwender an sie gebunden und kann keine andere Attacke einsetzen, bis sie verfehlt, 5 Runden vergangen sind oder die Attacke nicht eingesetzt werden kann. Die Stärke verdoppelt sich mit jedem Treffer dieser Attacke und noch einmal, wenn der Anwender zuvor Einigler eingesetzt hat. Wird diese Attacke durch Schlafrede eingesetzt, wird sie eine Runde lang eingesetzt. Trifft diese Attacke während des Effekts einen aktiven Kostümspuk-Schutz, pausiert der Stärkemultiplikator, der Rundenzähler jedoch nicht, wodurch der Multiplikator nach Ende des Effekts auf die nächste Attacke des Anwenders angewendet werden kann.", // NEEDS QC
		},
		gen6: {
			desc: "Gelingt diese Attacke, ist der Anwender an sie gebunden und kann keine andere Aktion ausführen, bis sie verfehlt, 5 Runden vergangen sind oder der Angriff nicht mehr eingesetzt werden kann. Die Stärke verdoppelt sich mit jedem Treffer und noch einmal, wenn der Anwender zuvor Einigler eingesetzt hat. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt.", // NEEDS QC
		},
	},
	icebeam: {
		name: "Eisstrahl",
		// Official flavor text: "Das Ziel wird von einem Eisstrahl getroffen und friert eventuell ein."
		desc: "Hat eine Chance von 10 %, das Ziel einzufrieren.", // NEEDS QC
		shortDesc: "10 % Chance auf Einfrieren.", // NEEDS QC
	},
	iceburn: {
		name: "Frosthauch",
		// Official flavor text: "Umgibt das Ziel in der nächsten Runde mit heftigen, alles gefrierenden Eisböen. Fügt dem Ziel eventuell Verbrennungen zu."
		desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Lädt auf, trifft in Runde 2. 30 % Verbrennung.", // NEEDS QC

		prepare: "  {POKEMON} wird in klirrend kalte Luft gehüllt!",
	},
	icefang: {
		name: "Eiszahn",
		// Official flavor text: "Anwender beißt mit eiskalten Reißzähnen zu. Ziel schreckt eventuell zurück oder friert ein."
		desc: "Hat eine Chance von 10 %, das Ziel einzufrieren, und eine Chance von 10 %, es zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "Je 10 % Einfrier- und Zurückschreck-Chance.", // NEEDS QC
	},
	icehammer: {
		name: "Eishammer",
		// Official flavor text: "Anwender trifft mit einem starken Hieb. Senkt Initiative des Anwenders."
		desc: "Senkt die Initiative des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Initiative des Anwenders um eine Stufe.", // NEEDS QC
	},
	icepunch: {
		name: "Eishieb",
		// Official flavor text: "Ein eisiger Schlag, der das Ziel eventuell einfriert."
		desc: "Hat eine Chance von 10 %, das Ziel einzufrieren.", // NEEDS QC
		shortDesc: "10 % Chance auf Einfrieren.", // NEEDS QC
	},
	iceshard: {
		name: "Eissplitter",
		// Official flavor text: "Erstschlag-Attacke, bei der das Ziel mit Eisklumpen beworfen wird."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
	},
	icespinner: {
		name: "Eiskreisel",
		desc: "Beendet die Effekte von Elektrofeld, Grasfeld, Nebelfeld und Psychofeld.", // NEEDS QC
		shortDesc: "Beendet die Effekte von Feldern.", // NEEDS QC
	},
	iciclecrash: {
		name: "Eiszapfhagel",
		// Official flavor text: "Lässt große, schwere Eiszapfen auf das Ziel herabregnen. Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	iciclespear: {
		name: "Eisspeer",
		// Official flavor text: "Feuert zwei bis fünf Eiszapfen auf das Ziel."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
	},
	icywind: {
		name: "Eissturm",
		// Official flavor text: "Eis-Attacke, die gegnerischen Pokémon Schaden zufügt und ihren Initiative-Wert senkt."
		desc: "Hat eine Chance von 100 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Initiative der Gegner.", // NEEDS QC
		gen2: {
			shortDesc: "100 % Chance auf -1 Init. des Ziels.", // NEEDS QC
		},
	},
	imprison: {
		name: "Begrenzer",
		// Official flavor text: "Hindert Gegner am Einsatz von Attacken, die der Anwender selbst auch kennt."
		desc: "Gegner können keine Attacken mehr einsetzen, die auch der Anwender kennt, solange dieser im Kampf bleibt.", // NEEDS QC
		shortDesc: "Gegner können keine Attacken des Anwenders nutzen.", // NEEDS QC
		gen7: {
			desc: "Solange der Anwender im Kampf bleibt, können Gegner keine Attacken einsetzen, die auch der Anwender beherrscht. Mit Z-Kraft verstärkte Attacken können während des Effekts weiterhin gewählt und eingesetzt werden.", // NEEDS QC
		},
		gen6: {
			desc: "Gegner können keine Attacken mehr einsetzen, die auch der Anwender kennt, solange dieser im Kampf bleibt.", // NEEDS QC
		},
		gen4: {
			desc: "Solange der Anwender im Kampf bleibt, können Gegner keine Attacken einsetzen, die auch der Anwender beherrscht. Schlägt fehl, wenn kein Gegner eine der Attacken des Anwenders beherrscht.", // NEEDS QC
		},

		start: "  {POKEMON} versiegelt jene gegnerischen Attacken, die es selbst auch beherrscht!",
		cant: "{POKEMON} kann die versiegelte Attacke {MOVE} nicht einsetzen!",
	},
	incinerate: {
		name: "Einäschern",
		// Official flavor text: "Eine Feuer-Attacke. Trägt ein gegnerisches Pokémon eine Beere oder ein ähnliches Item bei sich, wird dieses von den Flammen verzehrt und geht verloren."
		desc: "Das Ziel verliert sein getragenes Item, wenn es eine Beere oder ein Juwel ist. Diese Attacke kann Pokémon mit der Fähigkeit Klebekörper ihr Item nicht nehmen. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		shortDesc: "Zerstört die Beere/das Juwel der Gegner.", // NEEDS QC
		gen5: {
			desc: "Das Ziel verliert sein getragenes Item, wenn es eine Beere ist. Diese Attacke kann Pokémon mit der Fähigkeit Klebekörper ihr Item nicht nehmen. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
			shortDesc: "Zerstört die Beere der Gegner.", // NEEDS QC
		},

		removeItem: "  {ITEM} von {POKEMON} ist verbrannt und somit nutzlos geworden!",
	},
	infernalparade: {
		name: "Phantomparade",
		desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen. Die Stärke wird verdoppelt, wenn das Ziel ein Statusproblem hat.", // NEEDS QC
		shortDesc: "30 % Verbrennung. Doppelt bei Statusproblem.", // NEEDS QC
	},
	inferno: {
		name: "Inferno",
		// Official flavor text: "Anwender greift das Ziel an, indem er es mit dichten Flammen umhüllt. Ziel erleidet Verbrennungen."
		desc: "Hat eine Chance von 100 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "100 % Chance auf Verbrennung.", // NEEDS QC
	},
	infernooverdrive: {
		name: "Dynamische Maxiflamme",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	infestation: {
		name: "Plage",
		// Official flavor text: "Der Anwender fällt vier bis fünf Runden lang wie eine Plage über das Ziel her und greift es an. In diesem Zeitraum kann es nicht fliehen."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen7: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},

		start: "  {SOURCE} plagt {POKEMON}!",
	},
	ingrain: {
		name: "Verwurzler",
		// Official flavor text: "Verwurzelung füllt jede Runde KP auf. Austausch und Flucht sind unmöglich."
		desc: "Der Anwender stellt am Ende jeder Runde 1/16 seiner maximalen KP wieder her, kann aber nicht mehr ausgewechselt werden, und andere Pokémon können ihn nicht dazu zwingen. Der Anwender kann dennoch ausgewechselt werden, wenn er Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Verlässt er das Feld mit Stafette, bleibt der Nachfolger gefangen und erhält den Heileffekt. Während des Effekts kann der Anwender normal von Angriffen vom Typ Boden getroffen und von Stachler, Giftspitzen und Klebenetz beeinflusst werden, selbst wenn er vom Typ Flug ist oder die Fähigkeit Schwebe hat.", // NEEDS QC
		shortDesc: "Verwurzelt und erdet; heilt 1/16 KP pro Runde.", // NEEDS QC
		gen7: {
			desc: "Der Anwender stellt am Ende jeder Runde 1/16 seiner maximalen KP wieder her, kann aber nicht ausgewechselt werden, und andere Pokémon können ihn nicht zum Auswechseln zwingen. Er kann dennoch ausgewechselt werden, wenn er Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Verlässt er das Feld mit Stafette, bleibt der Nachfolger gefangen und erhält weiterhin den Heileffekt. Während des Effekts kann der Anwender normal von Boden-Angriffen getroffen und von Stachler, Giftspitzen und Klebenetz beeinflusst werden, selbst wenn er ein Flug-Pokémon ist oder die Fähigkeit Schwebe hat.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender stellt am Ende jeder Runde 1/16 seiner maximalen KP wieder her, kann aber nicht ausgewechselt werden, und andere Pokémon können ihn nicht zum Auswechseln zwingen. Er kann dennoch ausgewechselt werden, wenn er Stafette, Kehrtwende oder Voltwechsel einsetzt. Verlässt er das Feld mit Stafette, bleibt der Nachfolger gefangen und erhält weiterhin den Heileffekt. Während des Effekts kann der Anwender normal von Boden-Angriffen getroffen und von Stachler und Giftspitzen beeinflusst werden, selbst wenn er ein Flug-Pokémon ist oder die Fähigkeit Schwebe hat.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender stellt am Ende jeder Runde 1/16 seiner maximalen KP wieder her, kann aber nicht ausgewechselt werden, und andere Pokémon können ihn nicht zum Auswechseln zwingen. Er kann dennoch ausgewechselt werden, wenn er Stafette oder Kehrtwende einsetzt. Verlässt er das Feld mit Stafette, bleibt der Nachfolger gefangen und erhält weiterhin den Heileffekt. Während des Effekts kann der Anwender normal von Boden-Angriffen getroffen und von Stachler und Giftspitzen beeinflusst werden, selbst wenn er ein Flug-Pokémon ist oder die Fähigkeit Schwebe hat.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender stellt am Ende jeder Runde 1/16 seiner maximalen KP wieder her, kann aber nicht ausgewechselt werden, und andere Pokémon können ihn nicht zum Auswechseln zwingen. Er kann dennoch ausgewechselt werden, wenn er Stafette einsetzt; der Nachfolger bleibt gefangen und erhält weiterhin den Heileffekt.", // NEEDS QC
			shortDesc: "Heilt 1/16 pro Runde. Anwender kann nicht wechseln.", // NEEDS QC
		},

		start: "  {POKEMON} pflanzt seine Wurzeln!",
		block: "  {POKEMON} hat seine Wurzeln fest verankert!",
		heal: "  {POKEMON} nimmt über seine Wurzeln Nährstoffe auf!",
	},
	instruct: {
		name: "Kommando",
		// Official flavor text: "Der Anwender befiehlt dem Ziel, dessen zuletzt ausgeführte Attacke sofort wieder einzusetzen."
		desc: "Das Ziel setzt sofort seine zuletzt eingesetzte Attacke ein. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, die Attacke 0 AP hat, das Ziel Schnabelkanone, Power-Punch oder Panzerfalle vorbereitet oder die Attacke Zuschuss, Schnabelkanone, Rülpser, Geduld, Hitzeturbo, Ehrentag, Geschwätz, Raufturbo, Imitator, Dynamax-Kanone, Power-Punch, Händchenhalten, Frostbeule, Kommando, Königsschild, Zauberturbo, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Toxiturbo, Abblocker, Wutanfall, Blättertanz, Walzer, Panzerfalle, Nachahmer, Schlafrede, Verzweifler, Fuchtler, Wandler, Aufruhr oder Finsterturbo, eine Zwei-Runden-Attacke oder eine Attacke mit Erholungsrunde ist.", // NEEDS QC
		shortDesc: "Das Ziel wiederholt sofort seine letzte Attacke.", // NEEDS QC
		gen8: {
			desc: "Das Ziel setzt sofort seine zuletzt eingesetzte Attacke ein. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, die Attacke 0 AP hat, das Ziel dynamaximiert ist, das Ziel Schnabelkanone, Power-Punch oder Panzerfalle vorbereitet oder die Attacke Zuschuss, Schnabelkanone, Rülpser, Geduld, Ehrentag, Geschwätz, Imitator, Dynamax-Kanone, Power-Punch, Händchenhalten, Frostbeule, Kommando, Königsschild, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Abblocker, Wutanfall, Blättertanz, Walzer, Panzerfalle, Nachahmer, Schlafrede, Verzweifler, Fuchtler, Wandler oder Aufruhr, eine Attacke mit Aufladung oder Erholung oder eine Dynamax- oder Gigadynamax-Attacke ist.", // NEEDS QC
		},
		gen7: {
			desc: "Das Ziel setzt sofort seine zuletzt eingesetzte Attacke ein. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, die Attacke 0 AP hat, das Ziel Schnabelkanone, Power-Punch oder Panzerfalle vorbereitet oder die Attacke Zuschuss, Schnabelkanone, Rülpser, Geduld, Ehrentag, Geschwätz, Imitator, Power-Punch, Händchenhalten, Frostbeule, Kommando, Königsschild, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Wutanfall, Blättertanz, Walzer, Panzerfalle, Nachahmer, Schlafrede, Verzweifler, Fuchtler, Wandler oder Aufruhr, eine Attacke mit Aufladung oder Erholung oder eine Z-Attacke ist.", // NEEDS QC
		},

		activate: "  {TARGET} führt seine zuletzt eingesetzte Attacke auf Befehl von {POKEMON} erneut aus!",
	},
	iondeluge: {
		name: "Plasmaschauer",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Attacken vom Typ Normal werden in dieser Runde zu Attacken vom Typ Elektro. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern.", // NEEDS QC
		shortDesc: "Normal-Attacken werden diese Runde zu Elektro.", // NEEDS QC

		activate: "  Ein elektrisch geladener Niederschlag regnet auf das Kampffeld herab!",
	},
	irondefense: {
		name: "Eisenabwehr",
		// Official flavor text: "Anwender stärkt den Körper, um den Verteidigungs-Wert stark zu erhöhen."
		desc: "Erhöht die Verteidigung des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Verteidigung des Anwenders um 2 Stufen.", // NEEDS QC
	},
	ironhead: {
		name: "Eisenschädel",
		// Official flavor text: "Ziel wird durch stahlharten Kopf des Anwenders getroffen und schreckt eventuell zurück."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	irontail: {
		name: "Eisenschweif",
		// Official flavor text: "Attacke mit hartem Eisenschweif. Senkt eventuell den Verteidigungs-Wert des Zieles."
		desc: "Hat eine Chance von 30 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "30 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
	},
	ivycudgel: {
		name: "Rankenkeule",
		desc: "Hat eine erhöhte Volltrefferquote. Ist der Anwender ein Ogerpon, hängt der Typ dieser Attacke von seiner Form ab: Typ Wasser mit der Brunnenmaske, Typ Feuer mit der Ofenmaske und Typ Gestein mit der Fundamentmaske.", // NEEDS QC
		shortDesc: "Hohe Volltrefferquote. Typ je nach Form.", // NEEDS QC
	},
	jawlock: {
		name: "Fesselbiss",
		// Official flavor text: "Anwender und Ziel können nicht ausgetauscht werden, bis einer von ihnen kampfunfähig wird. Der Effekt endet, wenn eines der Pokémon das Kampffeld verlässt."
		desc: "Hindert den Anwender und das Ziel daran, sich auswechseln zu lassen. Sie können dennoch ausgewechselt werden, wenn einer von beiden eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		shortDesc: "Anwender und Ziel können nicht auswechseln.", // NEEDS QC
	},
	jetpunch: {
		name: "Düsenhieb",
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
	},
	judgment: {
		name: "Urteilskraft",
		// Official flavor text: "Anwender feuert unzählige Lichtstrahlen ab. Deren Typ hängt von der gehaltenen Tafel ab."
		desc: "Der Typ dieser Attacke hängt von der getragenen Tafel des Anwenders ab.", // NEEDS QC
		shortDesc: "Typ je nach getragener Tafel.", // NEEDS QC
	},
	jumpkick: {
		name: "Sprungkick",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Schlägt dieser Angriff fehl, verliert der Anwender die Hälfte seiner maximalen KP, abgerundet, als Fehlschlagschaden. Pokémon mit der Fähigkeit Magieschild erleiden keinen Fehlschlagschaden.", // NEEDS QC
		shortDesc: "Verfehlt sie, verliert der Anwender die halben max. KP.", // NEEDS QC
		gen4: {
			desc: "Schlägt dieser Angriff fehl, verliert der Anwender als Fehlschlagschaden die Hälfte der maximalen KP des Ziels, abgerundet, wenn das Ziel immun war, andernfalls die Hälfte des Schadens, den das Ziel erlitten hätte, abgerundet, aber mindestens 1 KP und höchstens die Hälfte der maximalen KP des Ziels. Pokémon mit der Fähigkeit Magieschild erleiden keinen Fehlschlagschaden.", // NEEDS QC
			shortDesc: "Verfehlt sie, erleidet der Anwender 1/2 des Schadens.", // NEEDS QC
		},
		gen3: {
			desc: "Schlägt dieser Angriff fehl und war das Ziel nicht immun, verliert der Anwender als Fehlschlagschaden die Hälfte des Schadens, den das Ziel erlitten hätte, abgerundet, aber mindestens 1 KP und höchstens die Hälfte der maximalen KP des Ziels.", // NEEDS QC
			shortDesc: "Verfehlt sie, erleidet der Anwender 1/2 des Schadens.", // NEEDS QC
		},
		gen2: {
			desc: "Schlägt dieser Angriff fehl und war das Ziel nicht immun, verliert der Anwender als Fehlschlagschaden 1/8 des Schadens, den das Ziel erlitten hätte, abgerundet, aber mindestens 1 KP.", // NEEDS QC
			shortDesc: "Verfehlt sie, erleidet der Anwender 1/8 des Schadens.", // NEEDS QC
		},
		gen1: {
			desc: "Verfehlt dieser Angriff das Ziel, erleidet der Anwender 1 KP Fehlschlagschaden. Hat der Anwender einen Delegator, erleidet der Delegator des Ziels diesen Schaden, falls vorhanden, andernfalls entsteht kein Fehlschlagschaden.", // NEEDS QC
			shortDesc: "Verfehlt sie, erleidet der Anwender 1 KP Schaden.", // NEEDS QC
		},

		damage: "#crash",
	},
	junglehealing: {
		name: "Dschungelheilung",
		// Official flavor text: "Der Anwender wird eins mit dem Dschungel und heilt bei sich und seinen am Kampf beteiligten Mitstreitern KP und hebt jegliche Statusprobleme auf."
		desc: "Jedes Pokémon auf der Seite des Anwenders stellt 1/4 seiner maximalen KP wieder her, ab 0,5 aufgerundet, und wird von seinem Statusproblem geheilt.", // NEEDS QC
		shortDesc: "Team: +1/4 der max. KP und Status geheilt.", // NEEDS QC
	},
	karatechop: {
		name: "Karateschlag",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	kinesis: {
		name: "Psykraft",
		// Official flavor text: "Lenkt das Ziel durch Verbiegen eines Löffels ab und senkt so dessen Genauigkeit."
		desc: "Senkt die Genauigkeit des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Genauigkeit des Ziels um eine Stufe.", // NEEDS QC
	},
	kingsshield: {
		name: "Königsschild",
		// Official flavor text: "Der Anwender geht in die Defensive und wird vor Angriffen geschützt. Berührt ihn nun ein Pokémon, sinkt dessen Angriffs-Wert."
		desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke zu treffen versuchen, verlieren eine Angriffs-Stufe. Nicht schädigende Attacken durchdringen diesen Schutz. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Schützt vor Angriffen. Kontakt: -1 Angriff.", // NEEDS QC
		gen8: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die versuchen, ihn mit einer Kontaktattacke zu treffen, verlieren eine Stufe Angriff. Status-Attacken werden nicht abgewehrt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die versuchen, ihn mit einer Kontaktattacke zu treffen, verlieren 2 Stufen Angriff. Status-Attacken werden nicht abgewehrt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
			shortDesc: "Schützt vor Angriffen. Kontakt: -2 Angriff.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die versuchen, ihn mit einer Kontaktattacke zu treffen, verlieren 2 Stufen Angriff. Status-Attacken werden nicht abgewehrt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
	},
	knockoff: {
		name: "Abschlag",
		// Official flavor text: "Schlägt das Item des Zieles weg und vereitelt so dessen Gebrauch während des Kampfes. Mehr Schaden gegen Ziele, die ein Item bei sich tragen."
		desc: "Die Stärke wird mit 1,5 multipliziert, wenn das Ziel ein Item trägt, und das Ziel verliert sein Item, sofern der Anwender nicht kampfunfähig ist. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Diese Attacke wird weder stärker noch entfernt sie das Item, wenn es Blauer Edelstein, Roter Edelstein, Adamantkristall, Weißkristall, Platinumkristall, eine Tafel, ein Modul, eine Disc, Rostiges Schwert, Rostiger Schild, eine Energiekapsel oder eine Maske ist, getragen jeweils von Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta, einem Paradox-Pokémon oder Ogerpon, oder wenn der Anwender eine dieser Arten ist und das Ziel das entsprechende Item trägt. In diesem Fall zählen zu den Paradox-Pokémon alle Arten mit den Fähigkeiten Paläosynthese und Quantenantrieb, außer Keilflamme, Furienblitz, Eisenfels und Eisenhaupt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		shortDesc: "x1,5 gegen Item-Träger. Entfernt das Item.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Die Stärke dieser Attacke wird mit 1,5 multipliziert, wenn das Ziel ein Item trägt, und das Ziel verliert sein Item, sofern der Anwender nicht kampfunfähig ist. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Die Stärke steigt nicht und das Item wird nicht entfernt, wenn es Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul, eine Disc, Rostiges Schwert oder Rostiger Schild ist und jeweils von Kyogre, Groudon, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta getragen wird, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen7: {
			desc: "Die Stärke dieser Attacke wird mit 1,5 multipliziert, wenn das Ziel ein Item trägt, und das Ziel verliert sein Item, sofern der Anwender nicht kampfunfähig ist. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Die Stärke steigt nicht und das Item wird nicht entfernt, wenn es ein Z-Kristall ist, ein Mega-Stein, der von der Art getragen wird, die sich damit mega-entwickeln kann, oder Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul oder eine Disc, jeweils getragen von Kyogre, Groudon, Giratina, Arceus, Genesect, Amigento, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen6: {
			desc: "Die Stärke dieser Attacke wird mit 1,5 multipliziert, wenn das Ziel ein Item trägt, und das Ziel verliert sein Item, sofern der Anwender nicht kampfunfähig ist. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Die Stärke steigt nicht und das Item wird nicht entfernt, wenn es ein Mega-Stein ist, der von der Art getragen wird, die sich damit mega-entwickeln kann, oder Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel oder ein Modul, jeweils getragen von Kyogre, Groudon, Giratina, Arceus, Genesect, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen5: {
			desc: "Ist der Anwender nicht kampfunfähig, verliert das Ziel sein getragenes Item. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht entfernt, wenn es Platinum-Orb, eine Tafel oder ein Modul ist, jeweils getragen von Giratina, Arceus oder Genesect, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
			shortDesc: "Entfernt das Item des Ziels.", // NEEDS QC
		},
		gen4: {
			desc: "Das Ziel verliert sein getragenes Item für den Rest des Kampfes, außer das Item ist ein Platinum-Orb oder das Ziel hat die Fähigkeit Variabilität oder Klebekörper. Während des Effekts kann das Ziel auf keine Weise ein neues Item erhalten.", // NEEDS QC
			shortDesc: "Ziel verliert sein Item und erhält kein neues.", // NEEDS QC
		},
		gen3: {
			desc: "Das Ziel verliert sein getragenes Item für den Rest des Kampfes, außer es hat die Fähigkeit Klebekörper. Während des Effekts kann das Ziel auf keine Weise ein neues Item erhalten.", // NEEDS QC
		},

		removeItem: "  {SOURCE} schlägt das Item {ITEM} von {POKEMON} weg!",
	},
	kowtowcleave: {
		name: "Kniefallspalter",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	landswrath: {
		name: "Bodengewalt",
		// Official flavor text: "Der Anwender sammelt die Kraft des weiten Landes und greift an, indem er sie gebündelt auf gegnerische Pokémon lenkt."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Gegner.", // NEEDS QC
	},
	laserfocus: {
		name: "Konzentration",
		// Official flavor text: "Der Anwender konzentriert sich, wodurch sein nächster Angriff garantiert ein Volltreffer wird."
		desc: "Bis zum Ende der nächsten Runde sind die Angriffe des Anwenders Volltreffer.", // NEEDS QC
		shortDesc: "Bis Ende der nächsten Runde: nur Volltreffer.", // NEEDS QC

		start: "  {POKEMON} schärft seine Sinne!",
	},
	lashout: {
		name: "Frustventil",
		// Official flavor text: "Der Anwender entlädt seinen Frust in einem Angriff. Die Stärke der Attacke wird verdoppelt, wenn seine Statuswerte in dieser Runde gesenkt wurden."
		desc: "Die Stärke wird verdoppelt, wenn die Statuswerte des Anwenders in dieser Runde gesenkt wurden.", // NEEDS QC
		shortDesc: "Doppelt, wenn diese Runde ein Wert gesenkt wurde.", // NEEDS QC
	},
	lastresort: {
		name: "Zuflucht",
		// Official flavor text: "Diese Attacke kann nur eingesetzt werden, nachdem alle verfügbaren Attacken ausgeführt worden sind."
		desc: "Diese Attacke schlägt fehl, wenn der Anwender nicht mindestens eine weitere Attacke kennt oder nicht alle seine anderen Attacken seit dem Einwechseln oder der Verwandlung mindestens einmal eingesetzt hat.", // NEEDS QC
		shortDesc: "Nur, wenn alle anderen Attacken benutzt wurden.", // NEEDS QC
	},
	lastrespects: {
		name: "Letzte Ehre",
		desc: "Die Stärke beträgt 50 + (X × 50), wobei X die Gesamtzahl der kampfunfähig gewordenen Team-Pokémon des Anwenders ist, höchstens jedoch 100.", // NEEDS QC
		shortDesc: "+50 Stärke pro besiegtem Teammitglied.", // NEEDS QC
	},
	lavaplume: {
		name: "Flammensturm",
		// Official flavor text: "Anwender greift alle Pokémon im Umkreis mit tiefroten Flammen an. Ziele erleiden eventuell Verbrennungen."
		desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "30 % Chance, Nachbarn zu verbrennen.", // NEEDS QC
	},
	leafage: {
		name: "Blattwerk",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	leafblade: {
		name: "Laubklinge",
		// Official flavor text: "Hieb mit scharfkantigem Blatt. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	leafstorm: {
		name: "Blättersturm",
		// Official flavor text: "Anwender erzeugt einen Sturm aus scharfen Blättern. Rückstoß senkt Spezial-Angriff des Anwenders stark."
		desc: "Senkt den Spezial-Angriff des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Sp.-Ang. des Anwenders um 2 Stufen.", // NEEDS QC
	},
	leaftornado: {
		name: "Grasmixer",
		// Official flavor text: "Anwender greift an, indem er das Ziel in scharfes Blattwerk einwickelt. Kann die Genauigkeit des Zieles senken."
		desc: "Hat eine Chance von 50 %, die Genauigkeit des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "50 % Chance auf -1 Gen. des Ziels.", // NEEDS QC
	},
	leechlife: {
		name: "Blutsauger",
		// Official flavor text: "Die Hälfte des zugefügten Schadens wird dem Anwender gutgeschrieben."
		desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 50 % des Schadens.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, abgerundet.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet.", // NEEDS QC
		},
	},
	leechseed: {
		name: "Egelsamen",
		// Official flavor text: "Ziel wird bepflanzt und verliert jede Runde KP, die ein Pokémon aus dem Team des Anwenders heilen."
		desc: "Das Pokémon an der Position des Anwenders entzieht dem Ziel am Ende jeder Runde 1/8 seiner maximalen KP, abgerundet. Trägt der Empfänger eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet. Setzt das Ziel Stafette ein, wird auch der Nachfolger weiter ausgesaugt. Wird das Ziel ausgewechselt oder setzt es Letalwirbler oder Turbodreher erfolgreich ein, endet der Effekt. Pokémon vom Typ Pflanze sind gegen den Einsatz dieser Attacke immun, nicht aber gegen ihren Effekt.", // NEEDS QC
		shortDesc: "Saugt pro Runde 1/8 der KP des Ziels ab.", // NEEDS QC
		gen8: {
			desc: "Das Pokémon auf der Position des Anwenders stiehlt am Ende jeder Runde 1/8 der maximalen KP des Ziels, abgerundet. Trägt der Empfänger eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet. Setzt das Ziel Stafette ein, wird weiterhin vom Nachfolger abgesaugt. Wechselt das Ziel aus oder setzt erfolgreich Turbodreher ein, endet der Effekt. Pflanzen-Pokémon sind beim Einsatz gegen diese Attacke immun, nicht aber gegen ihren Effekt.", // NEEDS QC
		},
		gen3: {
			desc: "Das Pokémon auf der Position des Anwenders stiehlt am Ende jeder Runde 1/8 der maximalen KP des Ziels, abgerundet. Setzt das Ziel Stafette ein, wird weiterhin vom Nachfolger abgesaugt. Wechselt das Ziel aus oder setzt Turbodreher ein, endet der Effekt. Pflanzen-Pokémon sind beim Einsatz gegen diese Attacke immun, nicht aber gegen ihren Effekt.", // NEEDS QC
		},
		gen1: {
			desc: "Am Ende jeder Runde des Ziels stiehlt das Pokémon auf der Position des Anwenders 1/16 der maximalen KP des Ziels, abgerundet und mit dem aktuellen Toxin-Zähler des Ziels multipliziert, falls vorhanden, selbst wenn das Ziel weniger KP übrig hat. Wechselt das Ziel aus oder setzt ein Pokémon Dunkelnebel ein, endet dieser Effekt. Pflanzen-Pokémon sind gegen diese Attacke immun.", // NEEDS QC
			shortDesc: "Saugt jede Runde 1/16 der KP des Ziels.", // NEEDS QC
		},

		start: "  {POKEMON} wurde bepflanzt!",
		end: "  {POKEMON} wurde von Egelsamen befreit!",
		damage: "  {POKEMON} wurden durch Egelsamen KP geraubt!",
	},
	leer: {
		name: "Silberblick",
		// Official flavor text: "Der Verteidigungs-Wert gegnerischer Pokémon wird durch einen angsteinflößenden Blick gesenkt."
		desc: "Senkt die Verteidigung des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Verteidigung der Gegner.", // NEEDS QC
		gen2: {
			shortDesc: "Senkt die Verteidigung des Ziels um 1.", // NEEDS QC
		},
	},
	letssnuggleforever: {
		name: "Herzliche Knuddelkloppe",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	lick: {
		name: "Schlecker",
		// Official flavor text: "Leck-Attacke mit langer Zunge. Das Ziel wird eventuell paralysiert."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "30 % Chance auf Paralyse.", // NEEDS QC
	},
	lifedew: {
		name: "Lebenstropfen",
		// Official flavor text: "Wundersames Wasser heilt die KP des Anwenders und seiner am Kampf beteiligten Mitstreiter."
		desc: "Jedes Pokémon auf der Seite des Anwenders stellt 1/4 seiner maximalen KP wieder her, ab 0,5 aufgerundet.", // NEEDS QC
		shortDesc: "Heilt Anwender und Partner um 1/4 der max. KP.", // NEEDS QC
	},
	lightofruin: {
		name: "Lux Calamitatis",
		// Official flavor text: "Die Attacke basiert auf der Kraft des Ewigblütlers, die als mächtiger Lichtstrahl abgefeuert wird. Der Anwender nimmt dabei selbst großen Schaden."
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe der Hälfte der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "1/2 Rückstoßschaden.", // NEEDS QC
	},
	lightscreen: {
		name: "Lichtschild",
		// Official flavor text: "Erzeugt eine Lichtwand und senkt den Schaden durch Spezial-Attacken für fünf Runden."
		desc: "5 Runden lang erleiden der Anwender und sein Team 0,5-fachen Schaden durch spezielle Angriffe, bzw. 0,66-fachen in Doppelkämpfen. Der Schaden wird durch Auroraschleier nicht weiter verringert. Volltreffer ignorieren diesen Effekt. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch, Psychobeißer oder Auflockern getroffen wird. Hält 8 Runden an, wenn der Anwender ein Lichtlehm trägt. Schlägt fehl, wenn der Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "5 Runden: halber spezieller Schaden fürs Team.", // NEEDS QC
		gen6: {
			desc: "5 Runden lang erleiden der Anwender und sein Team 0,5-fachen Schaden durch spezielle Angriffe, bzw. 0,66-fachen in Doppel- oder Dreierkämpfen. Volltreffer ignorieren diesen Effekt. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch oder Auflockern getroffen wird. Hält 8 Runden an, wenn der Anwender ein Lichtlehm trägt. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
		},
		gen4: {
			desc: "5 Runden lang erleiden der Anwender und sein Team 1/2 Schaden durch spezielle Angriffe, bzw. 2/3, wenn mehrere Pokémon auf der Seite des Anwenders im Kampf sind. Volltreffer ignorieren diesen Effekt. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch oder Auflockern getroffen wird. Hält 8 Runden an, wenn der Anwender ein Lichtlehm trägt. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
		},
		gen3: {
			desc: "5 Runden lang erleiden der Anwender und sein Team 1/2 Schaden durch spezielle Angriffe, bzw. 2/3, wenn mehrere Pokémon auf der Seite des Anwenders im Kampf sind. Volltreffer ignorieren diesen Effekt. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch getroffen wird. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
		},
		gen2: {
			desc: "5 Runden lang wird die Spezial-Verteidigung des Anwenders und seines Teams verdoppelt. Volltreffer ignorieren diesen Effekt. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
			shortDesc: "5 Runden: doppelte Sp.-Vert. im Team.", // NEEDS QC
		},
		gen1: {
			desc: "Solange der Anwender im Kampf bleibt, wird sein Spezial-Wert verdoppelt, wenn er Schaden erleidet. Volltreffer ignorieren diesen Effekt. Setzt ein Pokémon Dunkelnebel ein, endet der Effekt.", // NEEDS QC
			shortDesc: "Solange aktiv: 2x Spezial bei erlittenem Schaden.", // NEEDS QC
			start: "  {POKEMON} ist gegen SPEZIAL-ATTACKEN immun!",
		},

		start: "  Lichtschild stärkt {TEAM} gegen Spezial-Attacken!",
		end: "  {TEAM:capitalize} verlieren den Schutz von Lichtschild!",
	},
	lightthatburnsthesky: {
		name: "Licht des Erlöschens",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Diese Attacke wird zu einem physischen Angriff, wenn der Angriff des Anwenders höher ist als sein Spezial-Angriff, einschließlich Statusveränderungen. Diese Attacke und ihre Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		shortDesc: "Physisch bei Ang. > Sp.-Ang. Ignoriert Fähigkeiten.", // NEEDS QC
	},
	liquidation: {
		name: "Aquadurchstoß",
		// Official flavor text: "Der Anwender greift das Ziel mit der Kraft des Wassers an. Senkt eventuell die Verteidigung des Zieles."
		desc: "Hat eine Chance von 20 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "20 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
	},
	lockon: {
		name: "Zielschuss",
		// Official flavor text: "Visiert das Ziel an und trifft in der nächsten Runde garantiert."
		desc: "Bis zum Ende der nächsten Runde kann das Ziel den Attacken des Anwenders nicht ausweichen, selbst wenn es sich mitten in einer Zwei-Runden-Attacke befindet. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt. Schlägt fehl, wenn dieser Effekt für den Anwender bereits aktiv ist.", // NEEDS QC
		shortDesc: "Seine nächste Attacke verfehlt das Ziel nicht.", // NEEDS QC
		gen4: {
			desc: "Bis zum Ende der nächsten Runde kann das Ziel den Attacken des Anwenders nicht ausweichen, selbst mitten in einer Attacke mit Aufladung. Wird dieser Effekt gegen das Ziel gestartet, enden dieser und der Effekt von Willensleser für jedes andere Pokémon gegen dieses Ziel. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger unter diesem Effekt. Verlässt der Anwender das Feld mit Stafette, wird der Effekt für den Nachfolger gegen dasselbe Ziel neu gestartet. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		},
		gen2: {
			desc: "Die nächste Genauigkeitsprüfung gegen das Ziel gelingt. Das Ziel weicht Erdbeben, Geofissur und Intensität dennoch aus, wenn es Fliegen einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger unter diesem Effekt. Dieser Effekt endet, wenn das Ziel das Feld verlässt oder eine Genauigkeitsprüfung gegen es durchgeführt wird.", // NEEDS QC
			shortDesc: "Die nächste Attacke verfehlt das Ziel nicht.", // NEEDS QC
		},

		start: "  {SOURCE} zielt auf {POKEMON}!",
	},
	lovelykiss: {
		name: "Todeskuss",
		shortDesc: "Schläfert das Ziel ein.", // NEEDS QC
	},
	lowkick: {
		name: "Fußkick",
		// Official flavor text: "Ein Tritt, der das Ziel umwirft. Je schwerer das Ziel ist, desto mehr Schaden fügt ihm die Attacke zu."
		desc: "Die Stärke beträgt 20, wenn das Ziel weniger als 10 kg wiegt, 40 bei weniger als 25 kg, 60 bei weniger als 50 kg, 80 bei weniger als 100 kg, 100 bei weniger als 200 kg und 120 ab 200 kg.", // NEEDS QC
		shortDesc: "Je schwerer das Ziel, desto stärker.", // NEEDS QC
		gen2: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
			shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
		},
	},
	lowsweep: {
		name: "Fußtritt",
		// Official flavor text: "Anwender greift mit blitzschnellen Bewegungen die Beine des Zieles an und senkt dessen Initiative."
		desc: "Hat eine Chance von 100 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Init. des Ziels.", // NEEDS QC
	},
	luckychant: {
		name: "Beschwörung",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "5 Runden lang können der Anwender und sein Team keine Volltreffer erleiden. Schlägt fehl, wenn der Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "5 Runden: Team erleidet keine Volltreffer.", // NEEDS QC

		start: "  Beschwörung schützt {TEAM} vor Volltreffern!",
		end: "  {TEAM:capitalize} sind nicht länger durch Beschwörung geschützt!",
	},
	luminacrash: {
		name: "Lichteinschlag",
		desc: "Hat eine Chance von 100 %, die Spezial-Verteidigung des Ziels um 2 Stufen zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -2 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	lunarblessing: {
		name: "Lunargebet",
		desc: "Jedes Pokémon auf der Seite des Anwenders stellt 1/4 seiner maximalen KP wieder her, ab 0,5 aufgerundet, und wird von seinem Statusproblem geheilt.", // NEEDS QC
		shortDesc: "Team: +1/4 der max. KP und Status geheilt.", // NEEDS QC
	},
	lunardance: {
		name: "Lunartanz",
		// Official flavor text: "Anwender geht K.O. Das an seine Stelle tretende Pokémon hat dafür volle KP sowie AP und wird von Statusproblemen geheilt."
		desc: "Der Anwender wird kampfunfähig, und hat das Pokémon, das ihn ersetzt, nicht volle KP oder AP oder ein Statusproblem, werden seine KP und AP vollständig wiederhergestellt und sein Statusproblem geheilt. Der Ersatz wird am Ende der Runde eingewechselt, und die Heilung erfolgt vor dem Effekt von Fallen. Dieser Effekt hält an, bis ein Pokémon, das eine dieser Bedingungen erfüllt, an der Position des Anwenders eingewechselt oder mit Seitentausch dorthin getauscht wird. Schlägt fehl, wenn der Anwender das letzte kampffähige Pokémon seines Teams ist.", // NEEDS QC
		shortDesc: "Wird besiegt; heilt den Nachfolger ganz, auch AP.", // NEEDS QC
		gen7: {
			desc: "Der Anwender wird kampfunfähig, und das Pokémon, das ihn ersetzt, wird vollständig geheilt, auch seine AP, und von seinem Statusproblem befreit. Das neue Pokémon wird am Ende der Runde eingewechselt, und die Heilung erfolgt, bevor Fallen wirken. Schlägt fehl, wenn der Anwender das letzte nicht kampfunfähige Pokémon seines Teams ist.", // NEEDS QC
			shortDesc: "Anwender: K.O. Nachfolger voll geheilt, samt AP.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender wird kampfunfähig, und das Pokémon, das ihn ersetzt, wird vollständig geheilt, auch seine AP, und von seinem Statusproblem befreit. Das neue Pokémon wird sofort eingewechselt, und die Heilung erfolgt, nachdem Fallen gewirkt haben. Schlägt fehl, wenn der Anwender das letzte nicht kampfunfähige Pokémon seines Teams ist.", // NEEDS QC
		},

		heal: "  {POKEMON} wird in mysteriöses Mondlicht getaucht!",
	},
	lunge: {
		name: "Anfallen",
		// Official flavor text: "Der Anwender greift das Ziel mit ganzer Kraft an, wodurch auch der Angriffs-Wert des Zieles sinkt."
		desc: "Hat eine Chance von 100 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Ang. des Ziels.", // NEEDS QC
	},
	lusterpurge: {
		name: "Scheinwerfer",
		// Official flavor text: "Angriff mit einem grellem Licht, der die Spezial-Verteidigung des Zieles eventuell senkt."
		desc: "Hat eine Chance von 50 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "50 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	machpunch: {
		name: "Tempohieb",
		// Official flavor text: "Bei dieser Erstschlag-Attacke greift der Anwender mit einem extrem schnellen Hieb an."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
	},
	magicalleaf: {
		name: "Zauberblatt",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	magicaltorque: {
		name: "Zauberturbo",
		desc: "Hat eine Chance von 30 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "30 % Chance auf Verwirrung.", // NEEDS QC
	},
	magiccoat: {
		name: "Magiemantel",
		// Official flavor text: "Alle Status-Attacken wie Egelsamen werden reflektiert."
		desc: "Bis zum Ende der Runde ist der Anwender von bestimmten nicht schädigenden Attacken, die auf ihn zielen, nicht betroffen und lenkt sie stattdessen auf den ursprünglichen Anwender zurück. So zurückgeworfene Attacken können nicht erneut durch diesen Effekt oder die Fähigkeit Magiespiegel zurückgeworfen werden. Stachler, Tarnsteine, Klebenetz und Giftspitzen können nur einmal pro Seite zurückgeworfen werden, und zwar vom am weitesten links stehenden Pokémon unter diesem Effekt oder mit der Fähigkeit Magiespiegel. Die Fähigkeiten Blitzfänger und Sturmsog lenken ihre jeweiligen Attacken um, bevor diese Attacke wirkt.", // NEEDS QC
		shortDesc: "Wirft Status-Attacken auf den Anwender zurück.", // NEEDS QC
		gen5: {
			desc: "Bis zum Ende der Runde ist der Anwender von bestimmten auf ihn gerichteten Status-Attacken unbeeinflusst und setzt sie stattdessen gegen den ursprünglichen Anwender ein. So reflektierte Attacken können nicht erneut durch diesen Effekt oder die Fähigkeit Magiespiegel reflektiert werden. Stachler, Tarnsteine und Giftspitzen können nur einmal pro Seite reflektiert werden, und zwar vom Pokémon ganz links unter diesem Effekt oder dem der Fähigkeit Magiespiegel. Die Fähigkeiten Blitzfänger und Sturmsog lenken ihre jeweiligen Attacken um, bevor diese Attacke wirkt.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender ist von bestimmten auf ihn gerichteten Status-Attacken unbeeinflusst und setzt sie stattdessen gegen den ursprünglichen Anwender ein. Zielt die Attacke auf beide Gegner, reflektiert das Pokémon unter diesem Effekt die Attacke nur gegen den ursprünglichen Anwender. Der Effekt endet, sobald eine Attacke reflektiert wurde oder am Ende der Runde. Die Fähigkeiten Blitzfänger und Sturmsog lenken ihre jeweiligen Attacken um, bevor diese Attacke wirkt.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender ist von bestimmten auf ihn gerichteten Status-Attacken unbeeinflusst und setzt sie stattdessen gegen den ursprünglichen Anwender ein. Zielt die Attacke auf beide Gegner und steht das Pokémon unter diesem Effekt auf der linken Seite, reflektiert es die Attacke gegen beide Gegner und sein Mitstreiter wird von der ursprünglichen Attacke nicht beeinflusst; steht es auf der rechten Seite, wird sein Mitstreiter von der ursprünglichen Attacke beeinflusst und es reflektiert die Attacke nur gegen den ursprünglichen Anwender. Der Effekt endet, sobald eine Attacke reflektiert wurde oder am Ende der Runde. So reflektierte Attacken können von einem anderen Pokémon unter diesem Effekt erneut reflektiert werden. Hat der Anwender die Fähigkeit Lärmschutz, macht sie geräuschbasierte Attacken wirkungslos, bevor dieser Effekt eintritt. Die Fähigkeit Blitzfänger lenkt Elektro-Attacken um, bevor diese Attacke wirkt.", // NEEDS QC
		},

		start: "  {POKEMON} hüllt sich selbst in einen Magiemantel!",
		move: "{POKEMON} leitet {MOVE} zurück!",
	},
	magicpowder: {
		name: "Magiepuder",
		// Official flavor text: "Das Ziel wird mit magischem Puder bestreut und nimmt den Typ Psycho an."
		desc: "Das Ziel wird zum Typ Psycho. Schlägt fehl, wenn das Ziel ein Arceus oder Amigento ist, bereits ausschließlich vom Typ Psycho ist oder terakristallisiert ist.", // NEEDS QC
		shortDesc: "Das Ziel wird zum Psycho-Typ.", // NEEDS QC
		gen8: {
			desc: "Das Ziel wird zum Typ Psycho. Schlägt fehl, wenn das Ziel ein Arceus oder Amigento ist oder bereits ausschließlich vom Typ Psycho ist.", // NEEDS QC
		},
	},
	magicroom: {
		name: "Magieraum",
		// Official flavor text: "Anwender erzeugt einen bizarren Raum, in dem über fünf Runden die Wirkung aller von Pokémon getragenen Items aufgehoben ist."
		desc: "5 Runden lang haben die getragenen Items aller Pokémon im Kampf keine Wirkung. Formwechsel durch Items sind nicht betroffen, alle anderen Effekte solcher Items werden jedoch aufgehoben. Während des Effekts kann kein Pokémon im Kampf Schleuder oder Beerenkräfte einsetzen. Wird diese Attacke während des Effekts eingesetzt, endet er.", // NEEDS QC
		shortDesc: "5 Runden: Alle Items sind wirkungslos.", // NEEDS QC
	},
	magmastorm: {
		name: "Lavasturm",
		// Official flavor text: "Das Ziel wird in einen Feuersog gezogen, der vier bis fünf Runden aktiv ist."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen7: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP (1/8 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang (immer fünf mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
			shortDesc: "Fängt und schädigt das Ziel 2-5 Runden lang.", // NEEDS QC
		},

		start: "  {POKEMON} wurde in wirbelndem Magma eingeschlossen!",
	},
	magnetbomb: {
		name: "Magnetbombe",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	magneticflux: {
		name: "Magnetregler",
		// Official flavor text: "Das Magnetfeld wird so manipuliert, dass Spezial- Verteidigung und Verteidigung von Team-Pokémon mit der Fähigkeit Plus oder Minus steigen."
		desc: "Erhöht die Verteidigung und die Spezial-Verteidigung der Team-Pokémon des Anwenders mit der Fähigkeit Plus oder Minus um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Vert./Sp.-Vert. bei Partnern mit Plus/Minus.", // NEEDS QC
	},
	magnetrise: {
		name: "Magnetflug",
		// Official flavor text: "Anwender schwebt für fünf Runden durch elektrisch erzeugten Magnetismus."
		desc: "5 Runden lang ist der Anwender immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen, Klebenetz und der Fähigkeit Ausweglos, solange er im Kampf bleibt. Setzt der Anwender Stafette ein, erbt der Nachfolger den Effekt. Verwurzler, Katapult, Tausend Pfeile und der Eisenkugel haben Vorrang vor dieser Attacke, wenn der Anwender unter einem ihrer Effekte steht. Schlägt fehl, wenn der Anwender bereits unter diesem Effekt oder dem von Verwurzler, Katapult oder Tausend Pfeile steht.", // NEEDS QC
		shortDesc: "5 Runden: Anwender ist immun gegen Boden.", // NEEDS QC
		gen5: {
			desc: "5 Runden lang ist der Anwender immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen und der Fähigkeit Ausweglos, solange er im Kampf bleibt. Setzt der Anwender Stafette ein, erbt der Nachfolger den Effekt. Verwurzler, Katapult und die Eisenkugel haben Vorrang vor dieser Attacke, wenn der Anwender unter einem ihrer Effekte steht. Schlägt fehl, wenn der Anwender bereits unter diesem Effekt oder dem von Verwurzler oder Katapult steht.", // NEEDS QC
		},
		gen4: {
			desc: "5 Runden lang ist der Anwender immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen und der Fähigkeit Ausweglos, solange er im Kampf bleibt. Setzt der Anwender Stafette ein, erbt der Nachfolger den Effekt. Verwurzler und die Eisenkugel haben Vorrang vor dieser Attacke, wenn der Anwender unter einem ihrer Effekte steht. Schlägt fehl, wenn der Anwender bereits unter diesem Effekt oder dem von Verwurzler steht.", // NEEDS QC
		},

		start: "  {POKEMON} schwebt aufgrund von Elektromagnetismus!",
		end: "  Der Elektromagnetismus von {POKEMON} hört auf zu wirken!",
	},
	magnitude: {
		name: "Intensität",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke variiert: je 5 % Chance auf 10 und 150 Stärke, je 10 % auf 30 und 110, je 20 % auf 50 und 90 und 30 % auf 70. Der Schaden wird verdoppelt, wenn das Ziel gerade Schaufler einsetzt.", // NEEDS QC
		shortDesc: "Zufällige Stärke. Doppelt gegen Schaufler.", // NEEDS QC
		gen4: {
			desc: "Die Stärke variiert: je 5 % Chance auf 10 und 150 Stärke, je 10 % auf 30 und 110, je 20 % auf 50 und 90 und 30 % auf 70. Die Stärke wird verdoppelt, wenn das Ziel gerade Schaufler einsetzt.", // NEEDS QC
		},

		activate: "  Intensität {NUMBER}!",
	},
	makeitrain: {
		name: "Goldrausch",
		desc: "Senkt den Spezial-Angriff des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Sp.-Ang. des Anwenders. Trifft die Gegner.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		activate: "#payday",
	},
	maliciousmoonsault: {
		name: "Hyper Dark Crusher",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		shortDesc: "Doppelt nach Komprimator des Ziels.", // NEEDS QC
	},
	malignantchain: {
		name: "Giftkettung",
		desc: "Hat eine Chance von 50 %, das Ziel schwer zu vergiften.", // NEEDS QC
		shortDesc: "50 % Chance auf schwere Vergiftung.", // NEEDS QC
	},
	matblock: {
		name: "Tatami-Schild",
		// Official flavor text: "Der Anwender richtet eine Tatami-Matte auf, um sich und sein Team vor Schaden zu schützen. Kein Schutz vor Status-Attacken."
		desc: "Der Anwender und sein Team sind in dieser Runde vor schädigenden Attacken anderer Pokémon geschützt, auch von Mitstreitern. Schlägt fehl, wenn es nicht die erste Runde des Anwenders auf dem Feld ist, er in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "Schützt das Team vor Angriffen. Nur in Runde 1.", // NEEDS QC

		start: "  {POKEMON} bringt seinen Tatami-Schild in Position!",
		block: "  {MOVE} wurde durch den Tatami-Schild abgewehrt!",
	},
	matchagotcha: {
		name: "Quirlschuss",
		desc: "Hat eine Chance von 20 %, das Ziel zu verbrennen. Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet. Das Ziel wird aufgetaut, wenn es eingefroren war.", // NEEDS QC
		shortDesc: "20 % Verbrennung. Heilt 50 % des Schadens.", // NEEDS QC
	},
	maxairstream: {
		name: "Dyna-Düse",
		// Official flavor text: "Eine Flug-Attacke, die nur Dynamax-Pokémon einsetzen können. Erhöht die Initiative der Mitstreiterseite."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, steigt die Initiative jedes Pokémon auf der Seite des Anwenders um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Team: +1 Init.", // NEEDS QC
	},
	maxdarkness: {
		name: "Dyna-Dunkel",
		// Official flavor text: "Eine Unlicht-Attacke, die nur Dynamax-Pokémon einsetzen können. Senkt die Spezial-Verteidigung des Zieles."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, sinkt die Spezial-Verteidigung jedes Pokémon der gegnerischen Seite um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1 Sp.-Vert.", // NEEDS QC
	},
	maxflare: {
		name: "Dyna-Brand",
		// Official flavor text: "Eine Feuer-Attacke, die nur Dynamax-Pokémon einsetzen können. Die Sonne brennt unbarmherzig fünf Runden lang."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Sonne. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Erzeugt Sonne.", // NEEDS QC
	},
	maxflutterby: {
		name: "Dyna-Schwarm",
		// Official flavor text: "Eine Käfer-Attacke, die nur Dynamax-Pokémon einsetzen können. Senkt den Spezial-Angriff des Zieles."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, sinkt der Spezial-Angriff jedes Pokémon der gegnerischen Seite um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1 Sp.-Ang.", // NEEDS QC
	},
	maxgeyser: {
		name: "Dyna-Flut",
		// Official flavor text: "Eine Wasser-Attacke, die nur Dynamax-Pokémon einsetzen können. Löst fünf Runden lang strömenden Regen aus."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Regen. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Erzeugt Regen.", // NEEDS QC
	},
	maxguard: {
		name: "Dyna-Wall",
		// Official flavor text: "Anwender wehrt jede Attacke ab. Scheitert eventuell bei Wiederholung."
		desc: "Der Anwender ist in dieser Runde vor fast allen Attacken anderer Pokémon geschützt, einschließlich Dynamax- und Gigadynamax-Attacken. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Schützt diese Runde, auch vor Dynamax-Attacken.", // NEEDS QC

		activate: "  {POKEMON} schützt sich selbst!",
	},
	maxhailstorm: {
		name: "Dyna-Frost",
		// Official flavor text: "Eine Eis-Attacke, die nur Dynamax-Pokémon einsetzen können. Lässt fünf Runden lang einen Hagelsturm toben."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Hagelsturm. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Erzeugt Hagel.", // NEEDS QC
	},
	maxknuckle: {
		name: "Dyna-Faust",
		// Official flavor text: "Eine Kampf-Attacke, die nur Dynamax-Pokémon einsetzen können. Erhöht den Angriff der Mitstreiterseite."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, steigt der Angriff jedes Pokémon auf der Seite des Anwenders um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Team: +1 Angriff.", // NEEDS QC
	},
	maxlightning: {
		name: "Dyna-Gewitter",
		// Official flavor text: "Eine Elektro-Attacke, die nur Dynamax-Pokémon einsetzen können. Erzeugt fünf Runden lang ein Elektrofeld."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Elektrofeld. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Erzeugt Elektrofeld.", // NEEDS QC
	},
	maxmindstorm: {
		name: "Dyna-Kinese",
		// Official flavor text: "Eine Psycho-Attacke, die nur Dynamax-Pokémon einsetzen können. Erzeugt fünf Runden lang ein Psychofeld."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Psychofeld. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Erzeugt Psychofeld.", // NEEDS QC
	},
	maxooze: {
		name: "Dyna-Giftschwall",
		// Official flavor text: "Eine Gift-Attacke, die nur Dynamax-Pokémon einsetzen können. Erhöht den Spezial-Angriff der Mitstreiterseite."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, steigt der Spezial-Angriff jedes Pokémon auf der Seite des Anwenders um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Team: +1 Sp.-Ang.", // NEEDS QC
	},
	maxovergrowth: {
		name: "Dyna-Flora",
		// Official flavor text: "Eine Pflanzen-Attacke, die nur Dynamax-Pokémon einsetzen können. Erzeugt fünf Runden lang ein Grasfeld."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Grasfeld. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Erzeugt Grasfeld.", // NEEDS QC
	},
	maxphantasm: {
		name: "Dyna-Spuk",
		// Official flavor text: "Eine Geister-Attacke, die nur Dynamax-Pokémon einsetzen können. Senkt die Verteidigung des Zieles."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, sinkt die Verteidigung jedes Pokémon der gegnerischen Seite um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1 Vert.", // NEEDS QC
	},
	maxquake: {
		name: "Dyna-Erdstoß",
		// Official flavor text: "Eine Boden-Attacke, die nur Dynamax-Pokémon einsetzen können. Erhöht die Spezial-Verteidigung der Mitstreiterseite."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, steigt die Spezial-Verteidigung jedes Pokémon auf der Seite des Anwenders um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Team: +1 Sp.-Vert.", // NEEDS QC
	},
	maxrockfall: {
		name: "Dyna-Brocken",
		// Official flavor text: "Eine Gesteins-Attacke, die nur Dynamax-Pokémon einsetzen können. Lässt fünf Runden lang einen Sandsturm toben."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Sandsturm. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Erzeugt Sandsturm.", // NEEDS QC
	},
	maxstarfall: {
		name: "Dyna-Zauber",
		// Official flavor text: "Eine Feen-Attacke, die nur Dynamax-Pokémon einsetzen können. Erzeugt fünf Runden lang ein Nebelfeld."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, beginnt der Effekt von Nebelfeld. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Erzeugt Nebelfeld.", // NEEDS QC
	},
	maxsteelspike: {
		name: "Dyna-Stahlzacken",
		// Official flavor text: "Eine Stahl-Attacke, die nur Dynamax-Pokémon einsetzen können. Erhöht die Verteidigung der Mitstreiterseite."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, steigt die Verteidigung jedes Pokémon auf der Seite des Anwenders um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Team: +1 Vert.", // NEEDS QC
	},
	maxstrike: {
		name: "Dyna-Angriff",
		// Official flavor text: "Eine Normal-Attacke, die nur Dynamax-Pokémon einsetzen können. Senkt die Initiative des Zieles."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, sinkt die Initiative jedes Pokémon der gegnerischen Seite um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1 Init.", // NEEDS QC
	},
	maxwyrmwind: {
		name: "Dyna-Wyrm",
		// Official flavor text: "Eine Drachen-Attacke, die nur Dynamax-Pokémon einsetzen können. Senkt den Angriff des Zieles."
		desc: "Die Stärke entspricht der Dynamax-Attacke der Basis-Attacke. Gelingt diese Attacke, sinkt der Angriff jedes Pokémon der gegnerischen Seite um eine Stufe, selbst hinter einem Delegator. Dieser Effekt tritt nicht ein, wenn der Anwender nicht dynamaximiert ist. Wird diese Attacke als Basis-Attacke eingesetzt, verursacht sie Schaden mit 0 Stärke.", // NEEDS QC
		shortDesc: "Stärke je nach Basis-Attacke. Gegner: -1 Angriff.", // NEEDS QC
	},
	meanlook: {
		name: "Horrorblick",
		// Official flavor text: "Böser Blick, der die Flucht des Zieles vereitelt."
		desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		shortDesc: "Hindert das Ziel am Auswechseln.", // NEEDS QC
		gen7: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt, außer er setzt Stafette ein – dann bleibt das Ziel gefangen.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es Stafette einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt, außer er setzt Stafette ein – dann bleibt das Ziel gefangen.", // NEEDS QC
		},
	},
	meditate: {
		name: "Meditation",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Erhöht den Angriff des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "Erhöht Angriff des Anwenders um eine Stufe.", // NEEDS QC
	},
	mefirst: {
		name: "Egotrip",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Der Anwender setzt die vom Ziel für diese Runde gewählte Attacke möglichst gegen es ein, mit 1,5-facher Stärke. Die Attacke muss eine offensive Attacke außer Schnabelkanone, Rülpser, Hitzeturbo, Raufturbo, Vendetta, Konter, Bezirzer, Power-Punch, Zauberturbo, Egotrip, Metallstoß, Spiegelcape, Toxiturbo, Panzerfalle, Verzweifler, Raub oder Finsterturbo sein. Schlägt fehl, wenn das Ziel vor dem Anwender handelt. Ignoriert den Delegator des Ziels beim Kopieren der Attacke.", // NEEDS QC
		shortDesc: "Kopiert die gewählte Attacke des Ziels mit x1,5.", // NEEDS QC
		gen8: {
			desc: "Der Anwender setzt die vom Ziel für diese Runde gewählte Attacke möglichst gegen es ein, mit 1,5-facher Stärke. Die Attacke muss eine offensive Attacke außer Schnabelkanone, Rülpser, Geschwätz, Konter, Bezirzer, Power-Punch, Egotrip, Metallstoß, Spiegelcape, Panzerfalle, Verzweifler oder Raub sein. Schlägt fehl, wenn das Ziel vor dem Anwender handelt. Ignoriert den Delegator des Ziels beim Kopieren der Attacke.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender setzt die vom Ziel für diese Runde gewählte Attacke möglichst gegen es ein, mit 1,5-facher Stärke. Die Attacke muss eine offensive Attacke außer Schnabelkanone, Rülpser, Geschwätz, Konter, Bezirzer, Power-Punch, Egotrip, Metallstoß, Spiegelcape, Panzerfalle, Verzweifler, Raub oder einer Z-Attacke sein. Schlägt fehl, wenn das Ziel vor dem Anwender handelt. Ignoriert den Delegator des Ziels beim Kopieren der Attacke.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender setzt die vom Ziel für diese Runde gewählte Attacke möglichst gegen es ein, mit 1,5-facher Stärke. Die Attacke muss eine offensive Attacke außer Rülpser, Geschwätz, Konter, Bezirzer, Power-Punch, Egotrip, Metallstoß, Spiegelcape, Verzweifler oder Raub sein. Schlägt fehl, wenn das Ziel vor dem Anwender handelt. Ignoriert den Delegator des Ziels beim Kopieren der Attacke.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender setzt die vom Ziel für diese Runde gewählte Attacke möglichst gegen es ein, mit 1,5-facher Stärke. Die Attacke muss eine offensive Attacke außer Geschwätz, Konter, Bezirzer, Power-Punch, Egotrip, Metallstoß, Spiegelcape, Verzweifler oder Raub sein. Schlägt fehl, wenn das Ziel vor dem Anwender handelt. Ignoriert den Delegator des Ziels beim Kopieren der Attacke.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender setzt die vom Ziel für diese Runde gewählte Attacke möglichst gegen es ein, mit 1,5-facher Stärke. Die Attacke muss eine offensive Attacke außer Geschwätz, Konter, Bezirzer, Power-Punch, Egotrip, Spiegelcape, Verzweifler oder Raub sein. Schlägt fehl, wenn das Ziel vor dem Anwender handelt. Ignoriert den Delegator des Ziels beim Kopieren der Attacke.", // NEEDS QC
		},
	},
	megadrain: {
		name: "Megasauger",
		// Official flavor text: "Attacke, die die Hälfte des Schadens absorbiert."
		desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 50 % des Schadens.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, abgerundet.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, abgerundet.", // NEEDS QC
		},
	},
	megahorn: {
		name: "Vielender",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	megakick: {
		name: "Megakick",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	megapunch: {
		name: "Megahieb",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	memento: {
		name: "Memento-Mori",
		// Official flavor text: "Der Anwender wird besiegt. Gleichzeitig werden der Angriff und Spezial-Angriff des Zieles stark gesenkt."
		desc: "Senkt den Angriff und den Spezial-Angriff des Ziels um 2 Stufen. Der Anwender wird kampfunfähig, außer diese Attacke verfehlt oder es gibt kein Ziel. Schlägt vollständig fehl, wenn sie einen Delegator trifft, aber nicht, wenn die Statuswerte des Ziels nicht verändert werden können.", // NEEDS QC
		shortDesc: "-2 Ang./Sp.-Ang. des Ziels. Anwender wird besiegt.", // NEEDS QC
		gen4: {
			desc: "Senkt den Angriff und den Spezial-Angriff des Ziels um 2 Stufen. Der Anwender wird kampfunfähig, selbst wenn diese Attacke verfehlt. Diese Attacke kann Ziele mitten in einer Attacke mit Aufladung treffen. Schlägt vollständig fehl, wenn es kein Ziel gibt, aber nicht, wenn die Statuswerte des Ziels nicht verändert werden können.", // NEEDS QC
		},
		gen3: {
			desc: "Senkt den Angriff und den Spezial-Angriff des Ziels um 2 Stufen. Der Anwender wird kampfunfähig. Diese Attacke prüft keine Genauigkeit und kann Ziele mitten in einer Attacke mit Aufladung treffen. Schlägt vollständig fehl, wenn die Statuswertstufen von Angriff und Spezial-Angriff des Ziels beide -6 sind.", // NEEDS QC
		},

		heal: "  KP von {POKEMON} wurden durch Z-Kraft aufgefrischt!",
	},
	menacingmoonrazemaelstrom: {
		name: "Geballter Mondlaser",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Diese Attacke und ihre Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		shortDesc: "Ignoriert die Fähigkeiten anderer Pokémon.", // NEEDS QC
	},
	metalburst: {
		name: "Metallstoß",
		// Official flavor text: "Attacke mit großer Kraft gegen den Gegner, der dem Anwender in derselben Runde zuletzt Schaden zufügte."
		desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem physischen oder speziellen Angriff getroffen hat, Schaden in Höhe des 1,5-Fachen der dabei verlorenen KP zu, abgerundet. Hat der Anwender dabei keine KP verloren, verursacht diese Attacke 1 KP Schaden. Ist die Position dieses Gegners nicht mehr besetzt und ein anderer Gegner auf dem Feld, wird ihm der Schaden zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem physischen oder speziellen Angriff eines Gegners getroffen wurde.", // NEEDS QC
		shortDesc: "Wird er getroffen, zahlt er 1,5x zurück.", // NEEDS QC
		gen6: {
			desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem physischen oder speziellen Angriff getroffen hat, Schaden in Höhe des 1,5-Fachen der dabei verlorenen KP zu, abgerundet. Hat der Anwender dabei keine KP verloren, verursacht diese Attacke stattdessen Schaden mit einer Stärke von 1. Ist die Position dieses Gegners nicht mehr besetzt, wird der Schaden einem zufälligen Gegner in Reichweite zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem physischen oder speziellen Angriff eines Gegners getroffen wurde.", // NEEDS QC
		},
		gen4: {
			desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem physischen oder speziellen Angriff getroffen hat, Schaden in Höhe des 1,5-Fachen der dabei verlorenen KP zu, abgerundet. Ist die Position dieses Gegners nicht mehr besetzt und ein anderer Gegner auf dem Feld, wird ihm der Schaden zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem physischen oder speziellen Angriff eines Gegners getroffen wurde oder dabei keine KP verloren hat.", // NEEDS QC
		},
	},
	metalclaw: {
		name: "Metallklaue",
		// Official flavor text: "Klauen-Attacke, die eventuell den Angriffs-Wert des Anwenders erhöht."
		desc: "Hat eine Chance von 10 %, den Angriff des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "10 % Chance auf +1 Ang. des Anwenders.", // NEEDS QC
	},
	metalsound: {
		name: "Metallsound",
		// Official flavor text: "Stößt einen spitzen Schrei aus, der die Spezial-Verteidigung des Zieles stark senkt."
		desc: "Senkt die Spezial-Verteidigung des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Sp.-Vert. des Ziels um 2 Stufen.", // NEEDS QC
	},
	meteorassault: {
		name: "Sternensturm",
		// Official flavor text: "Der Anwender greift mit seiner Lauchstange an. Von der Wucht der Attacke wird ihm jedoch so schwindelig, dass er in der nächsten Runde nicht handeln kann."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
	},
	meteorbeam: {
		name: "Meteorstrahl",
		// Official flavor text: "Der Anwender sammelt in Runde 1 kosmische Kräfte und erhöht damit seinen Spezial-Angriff, bevor er in Runde 2 das Ziel angreift."
		desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Erhöht in der ersten Runde den Spezial-Angriff des Anwenders um eine Stufe. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "+1 Sp.-Ang. in Runde 1, trifft in Runde 2.", // NEEDS QC

		prepare: "Kosmische Kräfte strömen aus {POKEMON}!",
	},
	meteormash: {
		name: "Sternenhieb",
		// Official flavor text: "Angriff mit einem harten, schnellen Schlag. Erhöht eventuell Angriffs-Wert des Anwenders."
		desc: "Hat eine Chance von 20 %, den Angriff des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "20 % Chance auf +1 Ang. des Anwenders.", // NEEDS QC
	},
	metronome: {
		name: "Metronom",
		// Official flavor text: "Bewegt Finger, um das Gehirn zu stimulieren. Wählt zufällig eine Attacke aus."
		desc: "Setzt eine zufällig gewählte Attacke ein, außer Galanterie, Apfelsäure, Rüstungskanone, Zuschuss, Astralfragmente, Aura-Rad, Bunker, Schnabelkanone, Gigantenstoß, Gigantenhieb, Rülpser, Offerte, Hitzeturbo, Body Press, Zweigstoß, Breitseite, Ehrentag, Geschwätz, Kalte Dusche, Eisige Stimmung, Seelentanz, Kollisionskurs, Raufturbo, Vendetta, Imitator, Konter, Bezirzer, Trickschutz, Verzierung, Abgangsbund, Scanner, Diamantsturm, Abpausen, Panzerfäuste, Zweifachladung, Zenitstürmer, Drachenkräfte, Trommelschläge, Dynamax-Kanone, Blitztour, Ausdauer, Unendynastrahlen, Kniefalltrick, Offenlegung, Brennender Zorn, Abspaltung, Kanonenbouquet, Power-Punch, Spotlight, Frostvolt, Eisiger Blick, Blizzardlanze, Gravitation, Rechte Hand, Händchenhalten, Hyperbohrer, Dimensionswahn, Dimensionsloch, Frosthauch, Kommando, Düsenhieb, Dschungelheilung, Königsschild, Lebenstropfen, Lux Calamitatis, Zauberturbo, Goldrausch, Tatami-Schild, Egotrip, Sternensturm, Metronom, Mimikry, Knallkopf, Spiegelcape, Spiegeltrick, Schattenstrahl, Natur-Kraft, Naturzorn, Toxiturbo, Abblocker, Auftischen, Ursprungswoge, Overdrive, Photonen-Geysir, Plasmafäuste, Mäuseplage, Anspringen, Kraftwechsel, Abgrundsklinge, Schutzschild, Feuerball, Verzögerung, Rapidschutz, Zornesfaust, Wutpulver, Rasender Stier, Flammenwut, Urgesang, Vitalsegen, Verderben, Pökelsalz, Mystoschwert, Schwanzabwurf, Panzerfalle, Fadenfalle, Nachahmer, Schlafrede, Fangeisen, Standpauke, Übernahme, Schnarcher, Schnee, Diebesschatten, Chili-Essenz, Schutzstacheln, Seelenbruch, Rampenlicht, Frühlingsorkan, Dampfschwall, Stahlstrahl, Wunderdampf, Verzweifler, Stahlgestirn, Trefferschwall, Wechseldich, Techblaster, Tera-Sternhagel, Raub, Tausend Pfeile, Tausend Wellen, Blitzgefängnis, Donnernder Tritt, Aufräumen, Wegbereiter, Wandler, Trickbetrug, Doppelstrahl, V-Generator, Finstertreffer, Finsterturbo oder Rundumschutz.", // NEEDS QC
		shortDesc: "Setzt eine zufällige Attacke ein.", // NEEDS QC
		gen8: {
			desc: "Setzt eine zufällig gewählte Attacke ein, außer Galanterie, Apfelsäure, Zuschuss, Astralfragmente, Aura-Rad, Bunker, Schnabelkanone, Gigantenstoß, Gigantenhieb, Rülpser, Offerte, Body Press, Zweigstoß, Breitseite, Ehrentag, Geschwätz, Seelentanz, Imitator, Konter, Bezirzer, Trickschutz, Verzierung, Abgangsbund, Scanner, Diamantsturm, Panzerfäuste, Zenitstürmer, Drachenkräfte, Drachenhammer, Trommelschläge, Dynamax-Kanone, Ausdauer, Unendynastrahlen, Kniefalltrick, Offenlegung, Brennender Zorn, Kanonenbouquet, Power-Punch, Spotlight, Frostvolt, Eisiger Blick, Blizzardlanze, Gravitation, Rechte Hand, Händchenhalten, Dimensionswahn, Dimensionsloch, Frosthauch, Kommando, Dschungelheilung, Königsschild, Lebenstropfen, Lux Calamitatis, Tatami-Schild, Egotrip, Sternensturm, Metronom, Mimikry, Knallkopf, Spiegelcape, Spiegeltrick, Schattenstrahl, Natur-Kraft, Naturzorn, Abblocker, Ursprungswoge, Overdrive, Photonen-Geysir, Plasmafäuste, Abgrundsklinge, Schutzschild, Feuerball, Verzögerung, Rapidschutz, Wutpulver, Urgesang, Mystoschwert, Panzerfalle, Nachahmer, Schlafrede, Fangeisen, Standpauke, Übernahme, Schnarcher, Diebesschatten, Schutzstacheln, Seelenbruch, Rampenlicht, Dampfschwall, Stahlstrahl, Wunderdampf, Verzweifler, Stahlgestirn, Trefferschwall, Wechseldich, Techblaster, Raub, Tausend Pfeile, Tausend Wellen, Blitzgefängnis, Donnernder Tritt, Wandler, Trickbetrug, V-Generator, Finstertreffer oder Rundumschutz.", // NEEDS QC
		},
		gen7: {
			desc: "Setzt eine zufällig gewählte Attacke ein, außer Galanterie, Zuschuss, Bunker, Schnabelkanone, Rülpser, Offerte, Ehrentag, Geschwätz, Imitator, Konter, Bezirzer, Trickschutz, Abgangsbund, Scanner, Diamantsturm, Zenitstürmer, Ausdauer, Offenlegung, Kanonenbouquet, Power-Punch, Spotlight, Frostvolt, Rechte Hand, Händchenhalten, Dimensionswahn, Dimensionsloch, Frosthauch, Kommando, Königsschild, Lux Calamitatis, Tatami-Schild, Egotrip, Metronom, Mimikry, Knallkopf, Spiegelcape, Spiegeltrick, Natur-Kraft, Ursprungswoge, Photonen-Geysir, Plasmafäuste, Abgrundsklinge, Schutzschild, Verzögerung, Rapidschutz, Wutpulver, Urgesang, Mystoschwert, Panzerfalle, Nachahmer, Schlafrede, Standpauke, Übernahme, Schnarcher, Diebesschatten, Schutzstacheln, Rampenlicht, Dampfschwall, Verzweifler, Wechseldich, Techblaster, Raub, Tausend Pfeile, Tausend Wellen, Wandler, Trickbetrug, V-Generator oder Rundumschutz.", // NEEDS QC
		},
		gen6: {
			desc: "Setzt eine zufällig gewählte Attacke ein, außer Galanterie, Zuschuss, Rülpser, Offerte, Ehrentag, Geschwätz, Imitator, Konter, Bezirzer, Trickschutz, Abgangsbund, Scanner, Diamantsturm, Zenitstürmer, Ausdauer, Offenlegung, Power-Punch, Spotlight, Frostvolt, Rechte Hand, Händchenhalten, Dimensionswahn, Dimensionsloch, Frosthauch, Königsschild, Lux Calamitatis, Tatami-Schild, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Ursprungswoge, Abgrundsklinge, Schutzschild, Verzögerung, Rapidschutz, Wutpulver, Urgesang, Mystoschwert, Nachahmer, Schlafrede, Standpauke, Übernahme, Schnarcher, Schutzstacheln, Dampfschwall, Verzweifler, Wechseldich, Techblaster, Raub, Tausend Pfeile, Tausend Wellen, Wandler, Trickbetrug, V-Generator oder Rundumschutz.", // NEEDS QC
		},
		gen5: {
			desc: "Setzt eine zufällig gewählte Attacke ein, außer Galanterie, Zuschuss, Offerte, Geschwätz, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Ausdauer, Offenlegung, Power-Punch, Spotlight, Frostvolt, Rechte Hand, Frosthauch, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Natur-Kraft, Schutzschild, Verzögerung, Rapidschutz, Wutpulver, Urgesang, Mystoschwert, Nachahmer, Schlafrede, Standpauke, Übernahme, Schnarcher, Verzweifler, Wechseldich, Techblaster, Raub, Wandler, Trickbetrug, V-Generator oder Rundumschutz.", // NEEDS QC
		},
		gen4: {
			desc: "Setzt eine zufällig gewählte Attacke ein, außer Zuschuss, Geschwätz, Imitator, Konter, Bezirzer, Abgangsbund, Scanner, Ausdauer, Offenlegung, Power-Punch, Spotlight, Rechte Hand, Egotrip, Metronom, Mimikry, Spiegelcape, Spiegeltrick, Schutzschild, Nachahmer, Schlafrede, Übernahme, Verzweifler, Wechseldich, Raub, Trickbetrug oder Attacken, die der Anwender bereits kennt.", // NEEDS QC
		},
		gen3: {
			desc: "Setzt eine zufällig gewählte Attacke ein, außer Konter, Bezirzer, Abgangsbund, Scanner, Ausdauer, Power-Punch, Spotlight, Rechte Hand, Metronom, Mimikry, Spiegelcape, Schutzschild, Nachahmer, Schlafrede, Übernahme, Verzweifler, Raub oder Trickbetrug.", // NEEDS QC
		},
		gen2: {
			desc: "Setzt eine zufällig gewählte Attacke ein, außer Konter, Abgangsbund, Scanner, Ausdauer, Metronom, Mimikry, Spiegelcape, Schutzschild, Nachahmer, Schlafrede, Verzweifler, Raub oder Attacken, die der Anwender bereits kennt.", // NEEDS QC
		},
		gen1: {
			desc: "Setzt eine zufällig gewählte Attacke ein, außer Metronom oder Verzweifler.", // NEEDS QC
		},

		move: "Es schwingt den Finger und löst {MOVE} aus!",
	},
	mightycleave: {
		name: "Wuchtklinge",
		shortDesc: "Umgeht Schutz, ohne ihn zu brechen.", // NEEDS QC
	},
	milkdrink: {
		name: "Milchgetränk",
		// Official flavor text: "KP des Anwenders werden um 50 % der maximalen KP aufgefüllt."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um die Hälfte der max. KP.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, abgerundet.", // NEEDS QC
		},
	},
	mimic: {
		name: "Mimikry",
		// Official flavor text: "Kopiert die zuvor ausgeführte Attacke des Zieles. Diese kann im Kampf bis zur Auswechslung verwendet werden."
		desc: "Solange der Anwender im Kampf bleibt, wird diese Attacke durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat ihre maximalen AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender sich verwandelt hat, er die Attacke bereits kennt oder sie Zuschuss, Gigantenstoß, Gigantenhieb, Rülpser, Hitzeturbo, Ehrentag, Geschwätz, Raufturbo, Imitator, Dynamax-Kanone, Händchenhalten, Zauberturbo, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Toxiturbo, Nachahmer, Schlafrede, Verzweifler, Tera-Sternhagel, Wandler oder Finsterturbo ist.", // NEEDS QC
		shortDesc: "Ersetzt sich durch die letzte Attacke des Ziels.", // NEEDS QC
		gen8: {
			desc: "Solange der Anwender im Kampf bleibt, wird diese Attacke durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat ihre maximalen AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender sich verwandelt hat, er die Attacke bereits kennt oder sie Gigantenstoß, Gigantenhieb, Geschwätz, Dynamax-Kanone, Mimikry, Nachahmer, Verzweifler, Wandler oder eine Dynamax- oder Gigadynamax-Attacke ist.", // NEEDS QC
		},
		gen7: {
			desc: "Solange der Anwender im Kampf bleibt, wird diese Attacke durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat ihre maximalen AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender sich verwandelt hat, er die Attacke bereits kennt oder sie Geschwätz, Mimikry, Nachahmer, Verzweifler, Wandler oder eine Z-Attacke ist.", // NEEDS QC
		},
		gen6: {
			desc: "Solange der Anwender im Kampf bleibt, wird diese Attacke durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat ihre maximalen AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender sich verwandelt hat, er die Attacke bereits kennt oder sie Geschwätz, Mimikry, Nachahmer, Verzweifler oder Wandler ist.", // NEEDS QC
		},
		gen4: {
			desc: "Solange der Anwender im Kampf bleibt, wird diese Attacke durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat 5 AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender sich verwandelt hat, er die Attacke bereits kennt oder sie Geschwätz, Metronom, Mimikry, Nachahmer oder Verzweifler ist.", // NEEDS QC
		},
		gen3: {
			desc: "Solange der Anwender im Kampf bleibt, wird diese Attacke durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat 5 AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender sich verwandelt hat, er die Attacke bereits kennt oder sie Metronom, Mimikry, Nachahmer oder Verzweifler ist.", // NEEDS QC
		},
		gen2: {
			desc: "Solange der Anwender im Kampf bleibt, wird diese Attacke durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat 5 AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender die Attacke bereits kennt oder sie Verzweifler ist.", // NEEDS QC
		},
		gen1: {
			desc: "Solange der Anwender im Kampf bleibt, wird diese Attacke durch eine zufällige Attacke ersetzt, die das Ziel beherrscht, selbst wenn der Anwender sie bereits kennt. Die kopierte Attacke behält die verbleibenden AP dieser Attacke, unabhängig von ihren maximalen AP. Jedes Mal, wenn ein AP der kopierten Attacke verbraucht wird, wird auch ein AP dieser Attacke verbraucht.", // NEEDS QC
			shortDesc: "Wird durch zufällige Attacke des Ziels ersetzt.", // NEEDS QC
		},

		start: "  {POKEMON} erlernt {MOVE}!",
	},
	mindblown: {
		name: "Knallkopf",
		// Official flavor text: "Der Anwender greift alle Pokémon im Umkreis an, indem er seinen Kopf explodieren lässt. Dabei verletzt er sich auch selbst."
		desc: "Ob diese Attacke gelingt oder nicht – und selbst wenn er dadurch kampfunfähig wird –, verliert der Anwender die Hälfte seiner maximalen KP, aufgerundet, außer er hat die Fähigkeit Magieschild. Diese Attacke wird nicht ausgeführt und der Anwender verliert keine KP, wenn ein Pokémon im Kampf die Fähigkeit Feuchtigkeit hat oder diese Attacke vom Typ Feuer ist und der Anwender unter dem Effekt von Pulverschleuder steht oder das Wetter Strömender Regen ist.", // NEEDS QC
		shortDesc: "Kostet halbe max. KP. Trifft alle Nachbarn.", // NEEDS QC

		damage: "  ({POKEMON} opfert KP, um seine Attacke zu verstärken!)", // NEEDS QC
	},
	mindreader: {
		name: "Willensleser",
		// Official flavor text: "Ahnt Bewegungen des Zieles voraus, um zu gewährleisten, dass die nächste eigene Attacke trifft."
		desc: "Bis zum Ende der nächsten Runde kann das Ziel den Attacken des Anwenders nicht ausweichen, selbst wenn es sich mitten in einer Zwei-Runden-Attacke befindet. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt. Schlägt fehl, wenn dieser Effekt für den Anwender bereits aktiv ist.", // NEEDS QC
		shortDesc: "Seine nächste Attacke verfehlt das Ziel nicht.", // NEEDS QC
		gen4: {
			desc: "Bis zum Ende der nächsten Runde kann das Ziel den Attacken des Anwenders nicht ausweichen, selbst mitten in einer Attacke mit Aufladung. Wird dieser Effekt gegen das Ziel gestartet, enden dieser und der Effekt von Zielschuss für jedes andere Pokémon gegen dieses Ziel. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger unter diesem Effekt. Verlässt der Anwender das Feld mit Stafette, wird der Effekt für den Nachfolger gegen dasselbe Ziel neu gestartet. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		},
		gen2: {
			desc: "Die nächste Genauigkeitsprüfung gegen das Ziel gelingt. Das Ziel weicht Erdbeben, Geofissur und Intensität dennoch aus, wenn es Fliegen einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger unter diesem Effekt. Dieser Effekt endet, wenn das Ziel das Feld verlässt oder eine Genauigkeitsprüfung gegen es durchgeführt wird.", // NEEDS QC
			shortDesc: "Die nächste Attacke verfehlt das Ziel nicht.", // NEEDS QC
		},

		start: "#lockon",
	},
	minimize: {
		name: "Komprimator",
		// Official flavor text: "Anwender schrumpft, um seinen Ausweichwert stark zu erhöhen."
		desc: "Erhöht den Fluchtwert des Anwenders um 2 Stufen. Unabhängig davon, ob der Fluchtwert verändert wurde, prüfen Bodyslam, Drachenstoß, Flying Press, Brandstempel, Rammboss, Hyper Dark Crusher, Quetschwalze, Stampfer und Donnerstoß gegen den Anwender keine Genauigkeit und verursachen doppelten Schaden, solange er im Kampf bleibt.", // NEEDS QC
		shortDesc: "Erhöht Fluchtwert des Anwenders um 2 Stufen.", // NEEDS QC
		gen8: {
			desc: "Erhöht den Fluchtwert des Anwenders um 2 Stufen. Unabhängig davon, ob der Fluchtwert verändert wurde, prüfen Bodyslam, Drachenstoß, Flying Press, Brandstempel, Rammboss, Hyper Dark Crusher, Quetschwalze und Stampfer gegen den Anwender keine Genauigkeit und verursachen doppelten Schaden, solange er im Kampf bleibt.", // NEEDS QC
		},
		gen6: {
			desc: "Erhöht den Fluchtwert des Anwenders um 2 Stufen. Unabhängig davon, ob der Fluchtwert verändert wurde, prüfen Bodyslam, Drachenstoß, Flying Press, Brandstempel, Phantomkraft, Schemenkraft, Quetschwalze und Stampfer gegen den Anwender keine Genauigkeit und verursachen doppelten Schaden, solange er im Kampf bleibt.", // NEEDS QC
		},
		gen5: {
			desc: "Erhöht den Fluchtwert des Anwenders um 2 Stufen. Unabhängig davon, ob der Fluchtwert verändert wurde, verursachen Stampfer und Quetschwalze doppelten Schaden gegen den Anwender, solange er im Kampf bleibt.", // NEEDS QC
		},
		gen4: {
			desc: "Erhöht den Fluchtwert des Anwenders um eine Stufe. Unabhängig davon, ob der Fluchtwert verändert wurde, wird die Stärke von Stampfer gegen den Anwender verdoppelt, solange er im Kampf bleibt.", // NEEDS QC
			shortDesc: "Erhöht Fluchtwert des Anwenders um eine Stufe.", // NEEDS QC
		},
		gen3: {
			desc: "Erhöht den Fluchtwert des Anwenders um eine Stufe. Unabhängig davon, ob der Fluchtwert verändert wurde, verursachen Erstauner, Sondersensor, Nietenranke und Stampfer doppelten Schaden gegen den Anwender, solange er im Kampf bleibt.", // NEEDS QC
		},
		gen2: {
			desc: "Erhöht den Fluchtwert des Anwenders um eine Stufe. Unabhängig davon, ob der Fluchtwert verändert wurde, wird die Stärke von Stampfer gegen den Anwender verdoppelt, solange er im Kampf bleibt. Stafette kann diesen Effekt an einen Mitstreiter übertragen.", // NEEDS QC
		},
		gen1: {
			desc: "Erhöht den Fluchtwert des Anwenders um eine Stufe.", // NEEDS QC
		},
	},
	miracleeye: {
		name: "Wunderauge",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Solange das Ziel im Kampf bleibt, wird seine Fluchtwert-Stufe bei Genauigkeitsprüfungen gegen es ignoriert, sofern sie über 0 liegt, und Angriffe vom Typ Psycho können es treffen, wenn es vom Typ Unlicht ist. Schlägt fehl, wenn das Ziel bereits von diesem Effekt, Scharfblick oder Schnüffler betroffen ist.", // NEEDS QC
		shortDesc: "Psycho trifft Unlicht. Ignoriert Fluchtwert.", // NEEDS QC
		gen4: {
			desc: "Solange das Ziel im Kampf bleibt, wird seine Fluchtwert-Stufe bei Genauigkeitsprüfungen gegen es ignoriert, sofern sie über 0 liegt, und Angriffe vom Typ Psycho können es treffen, wenn es vom Typ Unlicht ist.", // NEEDS QC
		},

		start: "#foresight",
	},
	mirrorcoat: {
		name: "Spiegelcape",
		// Official flavor text: "Kontert die Spezial-Attacke des Gegners mit doppeltem Schaden."
		desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem speziellen Angriff getroffen hat, Schaden in Höhe des Doppelten der dabei verlorenen KP zu. Hat der Anwender dabei keine KP verloren, verursacht diese Attacke 1 KP Schaden. Ist die Position dieses Gegners nicht mehr besetzt und ein anderer Gegner auf dem Feld, wird ihm der Schaden zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem speziellen Angriff eines Gegners getroffen wurde.", // NEEDS QC
		shortDesc: "Zahlt speziellen Schaden doppelt zurück.", // NEEDS QC
		gen6: {
			desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem speziellen Angriff getroffen hat, Schaden in Höhe des Doppelten der dabei verlorenen KP zu. Hat der Anwender dabei keine KP verloren, verursacht diese Attacke stattdessen Schaden mit einer Stärke von 1. Ist die Position dieses Gegners nicht mehr besetzt, wird der Schaden einem zufälligen Gegner in Reichweite zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem speziellen Angriff eines Gegners getroffen wurde.", // NEEDS QC
		},
		gen4: {
			desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem speziellen Angriff getroffen hat, Schaden in Höhe des Doppelten der dabei verlorenen KP zu. Ist die Position dieses Gegners nicht mehr besetzt und ein anderer Gegner auf dem Feld, wird ihm der Schaden zugefügt. Nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem speziellen Angriff eines Gegners getroffen wurde oder dabei keine KP verloren hat.", // NEEDS QC
		},
		gen3: {
			desc: "Fügt dem letzten Gegner, der den Anwender in dieser Runde mit einem speziellen Angriff getroffen hat, Schaden in Höhe des Doppelten der dabei verlorenen KP zu. Ist die Position dieses Gegners nicht mehr besetzt und ein anderer Gegner auf dem Feld, wird ihm der Schaden zugefügt. Diese Attacke behandelt Kraftreserve als Attacke vom Typ Normal, und nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem speziellen Angriff eines Gegners getroffen wurde oder dabei keine KP verloren hat.", // NEEDS QC
		},
		gen2: {
			desc: "Fügt dem Gegner Schaden in Höhe des Doppelten der KP zu, die der Anwender in dieser Runde durch einen speziellen Angriff verloren hat. Diese Attacke behandelt Kraftreserve als Attacke vom Typ Normal, und nur der letzte Treffer einer mehrfach treffenden Attacke zählt. Schlägt fehl, wenn der Anwender zuerst handelt, in dieser Runde nicht von einem speziellen Angriff getroffen wurde oder dabei keine KP verloren hat.", // NEEDS QC
		},
	},
	mirrormove: {
		name: "Spiegeltrick",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Der Anwender setzt die zuletzt vom Ziel eingesetzte Attacke ein, möglichst gegen es. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat oder seine letzte Attacke nicht kopiert werden kann.", // NEEDS QC
		shortDesc: "Setzt die letzte Attacke des Ziels gegen es ein.", // NEEDS QC
		gen4: {
			desc: "Der Anwender setzt die letzte Attacke ein, die erfolgreich auf ihn gezielt hat. Die kopierte Attacke wird ohne bestimmtes Ziel eingesetzt. Schlägt fehl, wenn keine Attacke auf den Anwender gezielt hat, wenn die Attacke durch eine andere Attacke aufgerufen wurde, wenn die Attacke Zugabe ist oder wenn sie nicht von dieser Attacke kopiert werden kann.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender setzt die letzte Attacke ein, die erfolgreich auf ihn gezielt hat. Die kopierte Attacke wird ohne bestimmtes Ziel eingesetzt. Schlägt fehl, wenn keine Attacke auf den Anwender gezielt hat, wenn die Attacke verfehlte, fehlschlug oder keine Wirkung auf den Anwender hatte, oder wenn sie nicht von dieser Attacke kopiert werden kann.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender setzt die zuletzt vom Ziel eingesetzte Attacke ein. Schlägt fehl, wenn das Ziel seit dem Einwechseln des Anwenders keine Attacke eingesetzt hat oder wenn die zuletzt eingesetzte Attacke Metronom, Mimikry, Spiegeltrick, Nachahmer, Schlafrede oder Wandler oder eine Attacke ist, die der Anwender kennt.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender setzt die zuletzt vom Ziel eingesetzte Attacke ein. Schlägt fehl, wenn das Ziel seit dem Einwechseln des Anwenders keine Attacke eingesetzt hat oder wenn die zuletzt eingesetzte Attacke Spiegeltrick ist.", // NEEDS QC
		},
	},
	mirrorshot: {
		name: "Spiegelsalve",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 30 %, die Genauigkeit des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "30 % Chance auf -1 Gen. des Ziels.", // NEEDS QC
	},
	mist: {
		name: "Weißnebel",
		// Official flavor text: "Anwender schützt das Team mit einem Nebel. Verhindert Statussenkungen für fünf Runden."
		desc: "5 Runden lang können die Statuswerte des Anwenders und seines Teams nicht von anderen Pokémon gesenkt werden. Schlägt fehl, wenn der Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "5 Runden: Schützt das Team vor Wertsenkungen.", // NEEDS QC
		gen2: {
			desc: "Solange der Anwender im Kampf bleibt, können seine Statuswerte nicht von anderen Pokémon gesenkt werden. Schlägt fehl, wenn der Anwender den Effekt bereits hat. Stafette kann diesen Effekt an einen Mitstreiter übertragen.", // NEEDS QC
			shortDesc: "Solange aktiv: keine Statussenkungen.", // NEEDS QC
			start: "  {POKEMON} ist von WEISSNEBEL umgeben!",
			block: "  WEISSNEBEL schützt {POKEMON}.",
		},
		gen1: {
			desc: "Solange der Anwender im Kampf bleibt, können seine Statuswerte nicht von anderen Pokémon gesenkt werden, außer durch den Zusatzeffekt einer Attacke. Schlägt fehl, wenn der Anwender den Effekt bereits hat. Setzt ein Pokémon Dunkelnebel ein, endet dieser Effekt.", // NEEDS QC
			start: "  {POKEMON} ist von WEISSNEBEL umgeben!",
			block: "  Es ist fehlgeschlagen!",
		},

		start: "  {TEAM:capitalize} werden in Weißnebel gehüllt!",
		end: "  Der Weißnebel, der {TEAM} umgab, hat sich gelichtet!",
		block: "  {POKEMON} wird durch Weißnebel geschützt!",
	},
	mistball: {
		name: "Nebelball",
		// Official flavor text: "Angriff mit einer Nebelwolke aus Daunen. Senkt eventuell den Spezial-Angriff des Zieles."
		desc: "Hat eine Chance von 50 %, den Spezial-Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "50 % Chance auf -1 Sp.-Ang. des Ziels.", // NEEDS QC
	},
	mistyexplosion: {
		name: "Nebelexplosion",
		// Official flavor text: "Der Anwender greift alle Pokémon im Umkreis an und wird danach kampfunfähig. Die Stärke dieser Attacke steigt, wenn ein Nebelfeld aktiv ist."
		desc: "Liegt ein Nebelfeld vor und ist der Anwender am Boden, wird die Stärke mit 1,5 multipliziert. Der Anwender wird nach dem Einsatz kampfunfähig, selbst wenn diese Attacke mangels Ziel fehlschlägt. Diese Attacke kann nicht ausgeführt werden, wenn ein Pokémon im Kampf die Fähigkeit Feuchtigkeit hat.", // NEEDS QC
		shortDesc: "Wird besiegt. Im Nebelfeld: x1,5 Stärke.", // NEEDS QC
	},
	mistyterrain: {
		name: "Nebelfeld",
		// Official flavor text: "Schützt fünf Runden lang alle Pokémon, die den Boden berühren, vor Statusproblemen. Der erlittene Schaden durch Drachen-Attacken wird halbiert."
		desc: "5 Runden lang liegt ein Nebelfeld vor. Währenddessen wird die Stärke von Attacken vom Typ Drache gegen Pokémon am Boden mit 0,5 multipliziert, und Pokémon am Boden können weder Statusprobleme noch Verwirrung erleiden. Pokémon am Boden können von Gähner betroffen werden, aber nicht durch dessen Effekt einschlafen. Tarnung macht den Anwender zum Typ Fee, Natur-Kraft wird zu Mondgewalt und Geheimpower hat eine Chance von 30 %, den Spezial-Angriff um eine Stufe zu senken. Schlägt fehl, wenn bereits ein Nebelfeld vorliegt.", // NEEDS QC
		shortDesc: "5 Runden: kein Status, Drache schwächer am Boden.", // NEEDS QC
		gen6: {
			desc: "5 Runden lang liegt ein Nebelfeld vor. Währenddessen wird die Stärke von Attacken vom Typ Drache gegen Pokémon am Boden mit 0,5 multipliziert, und Pokémon am Boden können keine Statusprobleme erleiden. Pokémon am Boden können von Gähner betroffen werden, aber nicht durch dessen Effekt einschlafen. Tarnung macht den Anwender zum Typ Fee, Natur-Kraft wird zu Mondgewalt und Geheimpower hat eine Chance von 30 %, den Spezial-Angriff um eine Stufe zu senken. Schlägt fehl, wenn bereits ein Nebelfeld vorliegt.", // NEEDS QC
		},
	},
	moonblast: {
		name: "Mondgewalt",
		// Official flavor text: "Der Anwender macht sich die Kraft des Mondes zunutze, um anzugreifen. Gelegentlich wird dabei der Spezial-Angriff des Zieles gesenkt."
		desc: "Hat eine Chance von 30 %, den Spezial-Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "30 % Chance auf -1 Sp.-Ang. des Ziels.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	moongeistbeam: {
		name: "Schattenstrahl",
		// Official flavor text: "Der Anwender greift mit einem unheimlichen Lichtstrahl an. Diese Attacke ignoriert die Fähigkeit des Zieles."
		desc: "Diese Attacke und ihre Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		shortDesc: "Ignoriert die Fähigkeiten anderer Pokémon.", // NEEDS QC
	},
	moonlight: {
		name: "Mondschein",
		// Official flavor text: "Füllt KP des Anwenders auf. Die Menge hängt vom Wetter ab."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn Luftströmungen aktiv sind, kein Wetter herrscht oder er einen Allzweckschirm trägt; 2/3 seiner maximalen KP, wenn das Wetter Gleißende Sonne oder Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Strömender Regen, Regen, Sandsturm oder Schnee ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender je nach Wetter.", // NEEDS QC
		gen8: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn Luftströmungen aktiv sind, kein Wetter herrscht oder er einen Allzweckschirm trägt; 2/3 seiner maximalen KP, wenn das Wetter Gleißende Sonne oder Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Strömender Regen, Regen oder Sandsturm ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn Luftströmungen aktiv sind oder kein Wetter herrscht; 2/3 seiner maximalen KP, wenn das Wetter Gleißende Sonne oder Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Strömender Regen, Regen oder Sandsturm ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn kein Wetter herrscht; 2/3 seiner maximalen KP, wenn das Wetter Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Regen oder Sandsturm ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn kein Wetter herrscht; 2/3 seiner maximalen KP, wenn das Wetter Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Regen oder Sandsturm ist, jeweils abgerundet.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn kein Wetter herrscht; alle seine KP, wenn das Wetter Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Regen oder Sandsturm ist, jeweils abgerundet.", // NEEDS QC
		},
	},
	morningsun: {
		name: "Morgengrauen",
		// Official flavor text: "Füllt KP des Anwenders auf. Die Menge hängt vom Wetter ab."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn Luftströmungen aktiv sind, kein Wetter herrscht oder er einen Allzweckschirm trägt; 2/3 seiner maximalen KP, wenn das Wetter Gleißende Sonne oder Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Strömender Regen, Regen, Sandsturm oder Schnee ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender je nach Wetter.", // NEEDS QC
		gen8: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn Luftströmungen aktiv sind, kein Wetter herrscht oder er einen Allzweckschirm trägt; 2/3 seiner maximalen KP, wenn das Wetter Gleißende Sonne oder Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Strömender Regen, Regen oder Sandsturm ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn Luftströmungen aktiv sind oder kein Wetter herrscht; 2/3 seiner maximalen KP, wenn das Wetter Gleißende Sonne oder Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Strömender Regen, Regen oder Sandsturm ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn kein Wetter herrscht; 2/3 seiner maximalen KP, wenn das Wetter Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Regen oder Sandsturm ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn kein Wetter herrscht; 2/3 seiner maximalen KP, wenn das Wetter Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Regen oder Sandsturm ist, jeweils abgerundet.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn kein Wetter herrscht; alle seine KP, wenn das Wetter Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Regen oder Sandsturm ist, jeweils abgerundet.", // NEEDS QC
		},
	},
	mortalspin: {
		name: "Letalwirbler",
		desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, enden die Effekte von Egelsamen und Klammer-Attacken für den Anwender, und alle Fallen werden von seiner Seite entfernt. Hat eine Chance von 100 %, das Ziel zu vergiften.", // NEEDS QC
		shortDesc: "Vergiftet Gegner; entfernt Fallen und Fesseln.", // NEEDS QC
	},
	mountaingale: {
		name: "Frostfallwind",
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	mudbomb: {
		name: "Schlammbombe",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 30 %, die Genauigkeit des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "30 % Chance auf -1 Gen. des Ziels.", // NEEDS QC
	},
	muddywater: {
		name: "Lehmbrühe",
		// Official flavor text: "Greift mit Matsch an und senkt eventuell die Genauigkeit der gegnerischen Pokémon."
		desc: "Hat eine Chance von 30 %, die Genauigkeit des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "30 % Chance auf -1 Genauigkeit der Gegner.", // NEEDS QC
	},
	mudshot: {
		name: "Lehmschuss",
		// Official flavor text: "Angriff mit Lehm, der den Initiative-Wert des Zieles senkt."
		desc: "Hat eine Chance von 100 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Init. des Ziels.", // NEEDS QC
	},
	mudslap: {
		name: "Lehmschelle",
		// Official flavor text: "Schadet dem Ziel durch Matsch. Dessen Genauigkeit sinkt."
		desc: "Hat eine Chance von 100 %, die Genauigkeit des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Gen. des Ziels.", // NEEDS QC
	},
	mudsport: {
		name: "Lehmsuhler",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "5 Runden lang wird die Stärke aller Attacken vom Typ Elektro von Pokémon im Kampf mit 0,33 multipliziert. Schlägt fehl, wenn dieser Effekt bereits aktiv ist.", // NEEDS QC
		shortDesc: "5 Runden: Elektro-Attacken auf 1/3 geschwächt.", // NEEDS QC
		gen5: {
			desc: "Solange der Anwender im Kampf ist, wird die Stärke aller Attacken vom Typ Elektro von Pokémon im Kampf mit 0,33 multipliziert. Schlägt fehl, wenn dieser Effekt bereits für ein Pokémon aktiv ist.", // NEEDS QC
			shortDesc: "Schwächt Elektro-Attacken auf 1/3 ihrer Stärke.", // NEEDS QC
		},
		gen4: {
			desc: "Solange der Anwender im Kampf ist, wird die Stärke aller Attacken vom Typ Elektro von Pokémon im Kampf halbiert. Schlägt fehl, wenn dieser Effekt bereits für den Anwender aktiv ist. Stafette kann diesen Effekt an einen Mitstreiter übertragen.", // NEEDS QC
			shortDesc: "Schwächt Elektro-Attacken auf 1/2 ihrer Stärke.", // NEEDS QC
		},
	},
	multiattack: {
		name: "Multi-Angriff",
		// Official flavor text: "Der Anwender sammelt eine große Menge Energie und greift das Ziel damit an. Der Typ der Attacke hängt von dem der Disc ab."
		desc: "Der Typ dieser Attacke hängt von der getragenen Disc des Anwenders ab.", // NEEDS QC
		shortDesc: "Typ je nach getragener Disc.", // NEEDS QC
	},
	mysticalfire: {
		name: "Magieflamme",
		// Official flavor text: "Der Anwender greift das Ziel an, indem er ihm eine besondere, heiße Flamme entgegenbläst. Der Spezial-Angriff des Zieles sinkt."
		desc: "Hat eine Chance von 100 %, den Spezial-Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Sp.-Ang. des Ziels.", // NEEDS QC
	},
	mysticalpower: {
		name: "Mythenkraft",
		desc: "Hat eine Chance von 100 %, den Spezial-Angriff des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "100 % Chance auf +1 Sp.-Ang. des Anwenders.", // NEEDS QC
	},
	nastyplot: {
		name: "Ränkeschmied",
		// Official flavor text: "Anwender stimuliert sein Gehirn und hat finstere Gedanken. Erhöht Spezial-Angriff stark."
		desc: "Erhöht den Spezial-Angriff des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Sp.-Ang. des Anwenders um 2 Stufen.", // NEEDS QC
	},
	naturalgift: {
		name: "Beerenkräfte",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Typ und Stärke dieser Attacke hängen von der getragenen Beere des Anwenders ab, und die Beere geht verloren. Schlägt fehl, wenn der Anwender keine Beere trägt, die Fähigkeit Tollpatsch hat oder Itemsperre bzw. Magieraum für ihn wirkt.", // NEEDS QC
		shortDesc: "Stärke und Typ je nach getragener Beere.", // NEEDS QC
		gen4: {
			desc: "Typ und Stärke dieser Attacke hängen von der getragenen Beere des Anwenders ab, und die Beere geht verloren. Schlägt fehl, wenn der Anwender keine Beere trägt, die Fähigkeit Tollpatsch hat oder Itemsperre für ihn wirkt.", // NEEDS QC
		},
	},
	naturepower: {
		name: "Natur-Kraft",
		// Official flavor text: "Angriff mit der Kraft der Natur. Die Wirkung dieser Attacke ist ortsabhängig."
		desc: "Diese Attacke ruft je nach Untergrund eine andere Attacke auf: Triplette auf normalem Untergrund, Donnerblitz auf einem Elektrofeld, Mondgewalt auf einem Nebelfeld, Energieball auf einem Grasfeld und Psychokinese auf einem Psychofeld.", // NEEDS QC
		shortDesc: "Attacke je nach Feld (Standard: Triplette).", // NEEDS QC
		gen6: {
			desc: "Diese Attacke ruft je nach Untergrund eine andere Attacke auf: Triplette auf normalem Wi-Fi-Untergrund, Donnerblitz auf einem Elektrofeld, Mondgewalt auf einem Nebelfeld und Energieball auf einem Grasfeld.", // NEEDS QC
		},
		gen5: {
			desc: "Diese Attacke ruft je nach Untergrund eine andere Attacke auf: Erdbeben auf normalem Wi-Fi-Untergrund.", // NEEDS QC
			shortDesc: "Attacke hängt vom Untergrund ab. (Erdbeben)", // NEEDS QC
		},
		gen4: {
			desc: "Diese Attacke ruft je nach Untergrund eine andere Attacke auf: Triplette in Wi-Fi-Kämpfen.", // NEEDS QC
			shortDesc: "Attacke hängt vom Untergrund ab. (Triplette)", // NEEDS QC
		},
		gen3: {
			desc: "Diese Attacke ruft je nach Untergrund eine andere Attacke auf: Sternschauer in Wi-Fi-Kämpfen.", // NEEDS QC
			shortDesc: "Attacke hängt vom Untergrund ab. (Sternschauer)", // NEEDS QC
		},

		move: "Natur-Kraft löst {MOVE} aus!",
	},
	naturesmadness: {
		name: "Naturzorn",
		// Official flavor text: "Das Ziel wird vom Zorn der Natur getroffen und verliert dadurch die Hälfte seiner KP."
		desc: "Fügt dem Ziel Schaden in Höhe der Hälfte seiner aktuellen KP zu, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "Schaden in Höhe der halben aktuellen KP des Ziels.", // NEEDS QC
	},
	needlearm: {
		name: "Nietenranke",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
		gen3: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Der Schaden wird verdoppelt, wenn das Ziel Komprimator eingesetzt hat, seit es im Kampf ist.", // NEEDS QC
		},
	},
	neverendingnightmare: {
		name: "Ewige Nacht",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	nightdaze: {
		name: "Nachtflut",
		// Official flavor text: "Anwender greift das Ziel mit finsteren Schockwellen an. Senkt eventuell die Genauigkeit des Zieles."
		desc: "Hat eine Chance von 40 %, die Genauigkeit des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "40 % Chance auf -1 Gen. des Ziels.", // NEEDS QC
	},
	nightmare: {
		name: "Nachtmahr",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Das Ziel verliert am Ende jeder Runde 1/4 seiner maximalen KP, abgerundet, solange es schläft. Diese Attacke wirkt nur, wenn das Ziel schläft. Der Effekt endet, wenn das Ziel aufwacht, selbst wenn es in derselben Runde wieder einschläft.", // NEEDS QC
		shortDesc: "Schlafende Ziele verlieren 1/4 der KP pro Runde.", // NEEDS QC

		start: "  Nachtmahr sucht {POKEMON} heim!",
		damage: "  Nachtmahr schadet {POKEMON}!",
	},
	nightshade: {
		name: "Nachtnebel",
		// Official flavor text: "Das Ziel sieht eine Illusion. Richtet Schaden gemäß dem Level des Anwenders an."
		desc: "Fügt dem Ziel Schaden in Höhe des Levels des Anwenders zu.", // NEEDS QC
		shortDesc: "Schaden in Höhe des Levels des Anwenders.", // NEEDS QC
		gen1: {
			desc: "Fügt dem Ziel Schaden in Höhe des Levels des Anwenders zu. Diese Attacke ignoriert Typ-Immunität.", // NEEDS QC
			shortDesc: "Schaden = Level. Trifft auch Normal-Pokémon.", // NEEDS QC
		},
	},
	nightslash: {
		name: "Nachthieb",
		// Official flavor text: "Anwender greift bei der ersten Gelegenheit mit scharfen Klauen an. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	nobleroar: {
		name: "Kampfgebrüll",
		// Official flavor text: "Der Anwender stößt ein Kampfgebrüll aus, das das Ziel einschüchtert und zugleich seinen Angriffs- und Spezial-Angriffs-Wert senkt."
		desc: "Senkt den Angriff und den Spezial-Angriff des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Angriff und Sp.-Ang. des Ziels um eine Stufe.", // NEEDS QC
	},
	noretreat: {
		name: "Finalformation",
		// Official flavor text: "Alle Statuswerte des Anwenders werden erhöht, aber dafür kann er weder ausgewechselt werden noch fliehen."
		desc: "Erhöht Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung und Initiative des Anwenders um eine Stufe, aber er kann nicht mehr ausgewechselt werden. Der Anwender kann dennoch ausgewechselt werden, wenn er Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Schlägt fehl, wenn der Anwender bereits durch diesen Effekt gefangen ist.", // NEEDS QC
		shortDesc: "+1 auf alle Statuswerte; kein Auswechseln mehr.", // NEEDS QC

		start: "  {POKEMON} kann nicht mehr fliehen, weil es Finalformation eingesetzt hat!",
	},
	noxioustorque: {
		name: "Toxiturbo",
		desc: "Hat eine Chance von 30 %, das Ziel zu vergiften.", // NEEDS QC
		shortDesc: "30 % Chance auf Vergiftung.", // NEEDS QC
	},
	nuzzle: {
		name: "Wangenrubbler",
		// Official flavor text: "Der Anwender lädt seine Wangen elektrisch auf und greift an, indem er sich damit am Ziel reibt. Das Ziel wird paralysiert."
		desc: "Hat eine Chance von 100 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "100 % Chance auf Paralyse.", // NEEDS QC
	},
	oblivionwing: {
		name: "Unheilsschwingen",
		// Official flavor text: "Der Anwender raubt dem Ziel KP. Die Höhe der Heilung beträgt mehr als die Hälfte des beim Ziel angerichteten Schadens."
		desc: "Der Anwender stellt 3/4 der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 75 % des Schadens.", // NEEDS QC
	},
	obstruct: {
		name: "Abblocker",
		// Official flavor text: "Der Anwender wehrt jede Attacke ab. Berührt ihn währenddessen ein Pokémon, sinkt dessen Verteidigung stark. Scheitert eventuell bei Wiederholung."
		desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke zu treffen versuchen, verlieren 2 Verteidigungs-Stufen. Nicht schädigende Attacken durchdringen diesen Schutz. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Schützt vor Angriffen. Kontakt: -2 Verteidigung.", // NEEDS QC
		gen8: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke zu treffen versuchen, verlieren 2 Verteidigungs-Stufen. Nicht schädigende Attacken durchdringen diesen Schutz. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
	},
	oceanicoperetta: {
		name: "Grandiose Meeressymphonie",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	octazooka: {
		name: "Octazooka",
		// Official flavor text: "Schießt mit Tinte, um Schaden anzurichten und die Genauigkeit zu senken."
		desc: "Hat eine Chance von 50 %, die Genauigkeit des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "50 % Chance auf -1 Gen. des Ziels.", // NEEDS QC
	},
	octolock: {
		name: "Octoklammer",
		// Official flavor text: "Das Ziel wird an der Flucht gehindert und seine Verteidigung und Spezial-Verteidigung sinken jede Runde."
		desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Am Ende jeder Runde des Effekts sinken die Verteidigung und die Spezial-Verteidigung des Ziels um eine Stufe. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		shortDesc: "Hält das Ziel fest; pro Runde -1 Vert./Sp.-Vert.", // NEEDS QC

		start: "  {POKEMON} kann aufgrund von Octoklammer nicht fliehen.",
	},
	odorsleuth: {
		name: "Schnüffler",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Solange das Ziel im Kampf bleibt, wird seine Fluchtwert-Stufe bei Genauigkeitsprüfungen gegen es ignoriert, sofern sie über 0 liegt, und Angriffe der Typen Normal und Kampf können es treffen, wenn es vom Typ Geist ist. Schlägt fehl, wenn das Ziel bereits von diesem Effekt, Scharfblick oder Wunderauge betroffen ist.", // NEEDS QC
		shortDesc: "Kampf und Normal treffen Geist. Ignoriert Fluchtwert.", // NEEDS QC
		gen4: {
			desc: "Solange das Ziel im Kampf bleibt, wird sein Fluchtwert bei Genauigkeitsprüfungen gegen es ignoriert, sofern er über 0 liegt, und Attacken vom Typ Normal und Kampf können es treffen, selbst wenn es ein Geist-Pokémon ist.", // NEEDS QC
		},
		gen3: {
			desc: "Solange das Ziel im Kampf bleibt, wird sein Fluchtwert bei Genauigkeitsprüfungen gegen es ignoriert, und Attacken vom Typ Normal und Kampf können es treffen, selbst wenn es ein Geist-Pokémon ist.", // NEEDS QC
		},
	},
	ominouswind: {
		name: "Unheilböen",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 10 %, Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung und Initiative des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "10 % Chance, alle Statuswerte um 1 zu erhöhen.", // NEEDS QC
	},
	orderup: {
		name: "Auftischen",
		desc: "Hat ein verbündetes Nigiragi seine Fähigkeit Kommandant aktiviert, erhöht diese Attacke den Angriff des Anwenders um eine Stufe, wenn das Nigiragi die Gekrümmte Form hat, die Verteidigung bei der Hängenden Form oder die Initiative bei der Gestreckten Form. Der Effekt tritt auch ein, wenn das auslösende Nigiragi inzwischen kampfunfähig ist.", // NEEDS QC
		shortDesc: "Je gefressenem Sushelm-Stil: +1 Ang., Vert. o. Init.", // NEEDS QC
	},
	originpulse: {
		name: "Ursprungswoge",
		// Official flavor text: "Der Anwender greift gegnerische Pokémon mit unzähligen blau leuchtenden Strahlen an."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Gegner.", // NEEDS QC
	},
	outrage: {
		name: "Wutanfall",
		// Official flavor text: "Attacke über zwei bis drei Runden, die den Anwender danach verwirrt."
		desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff in der ersten Runde des Effekts oder der zweiten eines dreirundigen Effekts fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen und schläft der Anwender, wird sie nur eine Runde eingesetzt und verwirrt ihn nicht.", // NEEDS QC
		shortDesc: "Hält 2-3 Runden, verwirrt danach den Anwender.", // NEEDS QC
		gen6: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen angrenzenden Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff in der ersten Runde des Effekts oder der zweiten eines dreirundigen Effekts fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird am Ende der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff gegen das Ziel fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird am Ende der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er ein, wird er eingefroren oder schlägt der Angriff gegen das Ziel fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen2: {
			desc: "Unabhängig davon, ob diese Attacke gelingt, ist der Anwender zwei oder drei Runden lang an sie gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, selbst wenn er bereits verwirrt ist. Kann der Anwender nicht handeln, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
	},
	overdrive: {
		name: "Overdrive",
		// Official flavor text: "Der Anwender haut in die Saiten seiner Gitarre oder seines Basses und erzeugt dröhnende, kraftvolle Vibrationen, die gegnerischen Pokémon schaden."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Keine Zusatzeffekte. Trifft die Gegner.", // NEEDS QC
	},
	overheat: {
		name: "Hitzekoller",
		// Official flavor text: "Angriff mit voller Kraft, der den Spezial-Angriff des Anwenders durch den Rückstoß stark senkt."
		desc: "Senkt den Spezial-Angriff des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Sp.-Ang. des Anwenders um 2 Stufen.", // NEEDS QC
	},
	painsplit: {
		name: "Leidteiler",
		// Official flavor text: "Addiert KP von Anwender und Ziel. Teilt sie gerecht auf."
		desc: "Die KP von Anwender und Ziel werden zum Durchschnitt ihrer aktuellen KP, abgerundet, ohne die maximalen KP des jeweiligen Pokémon zu überschreiten.", // NEEDS QC
		shortDesc: "Teilt die KP von Anwender und Ziel gleichmäßig.", // NEEDS QC

		activate: "  Die Kontrahenten teilen sich ihre KP!",
	},
	paleowave: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Hat eine Chance von 20 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "20 % Chance auf -1 Ang. des Ziels.", // NEEDS QC
	},
	paraboliccharge: {
		name: "Parabolladung",
		// Official flavor text: "Fügt allen Pokémon im Umkreis Schaden zu. Der Anwender wird um die Hälfte des insgesamt angerichteten Schadens geheilt."
		desc: "Der Anwender stellt die Hälfte der vom Ziel verlorenen KP wieder her, ab 0,5 aufgerundet. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um 50 % des Schadens.", // NEEDS QC
	},
	partingshot: {
		name: "Abgangstirade",
		// Official flavor text: "Schüchtert das Ziel mit einer Abgangstirade ein, sodass dessen Angriffs- und Spezial-Angriffs-Wert sinken. Danach wird der Anwender ausgewechselt."
		desc: "Senkt den Angriff und den Spezial-Angriff des Ziels um eine Stufe. Gelingt diese Attacke, wird der Anwender ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn sich die Angriffs- und Spezial-Angriffs-Stufen des Ziels nicht geändert haben oder kein anderes Teammitglied kampffähig ist.", // NEEDS QC
		shortDesc: "-1 Ang./Sp.-Ang. des Ziels; wechselt dann aus.", // NEEDS QC
		gen6: {
			desc: "Senkt den Angriff und den Spezial-Angriff des Ziels um eine Stufe. Gelingt diese Attacke, wird der Anwender ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn kein anderes Teammitglied kampffähig ist.", // NEEDS QC
		},

		heal: "#memento",
		switchOut: "#uturn",
	},
	payback: {
		name: "Gegenstoß",
		// Official flavor text: "Der Anwender lädt die Attacke auf. Handelt das Ziel vor dem Anwender, verdoppelt sich die Stärke der Attacke."
		desc: "Die Stärke wird verdoppelt, wenn der Anwender in dieser Runde nach dem Ziel handelt, einschließlich Aktionen durch Kommando oder die Fähigkeit Tänzer. Einwechseln zählt nicht als Aktion.", // NEEDS QC
		shortDesc: "Doppelte Stärke, wenn das Ziel zuerst handelt.", // NEEDS QC
		gen6: {
			desc: "Die Stärke wird verdoppelt, wenn der Anwender in dieser Runde nach dem Ziel handelt. Einwechseln zählt nicht als Aktion.", // NEEDS QC
		},
		gen4: {
			desc: "Die Stärke wird verdoppelt, wenn der Anwender in dieser Runde nach dem Ziel handelt. Einwechseln zählt als Aktion.", // NEEDS QC
		},
	},
	payday: {
		name: "Zahltag",
		// Official flavor text: "Das Ziel wird mit Münzen beworfen. Das Geld wird nach dem Kampf aufgesammelt."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Wirft Münzen, die danach eingesammelt werden.", // NEEDS QC

		activate: "  Es sind überall Münzen verstreut!",
	},
	peck: {
		name: "Pikser",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	perishsong: {
		name: "Abgesang",
		// Official flavor text: "Wer diese Musik hört, wird nach drei Runden besiegt. Rettung ist durch den Eintausch eines neuen Pokémon möglich."
		desc: "Jedes Pokémon im Kampf erhält einen Countdown von 4, sofern es noch keinen hat. Am Ende jeder Runde, einschließlich der Einsatzrunde, sinkt der Countdown aller Pokémon im Kampf um 1, und Pokémon, bei denen er 0 erreicht, werden kampfunfähig. Der Countdown wird von Pokémon entfernt, die den Kampf verlassen. Setzt ein Pokémon mit Countdown Stafette ein, erbt der Nachfolger ihn und der Countdown läuft weiter.", // NEEDS QC
		shortDesc: "Alle aktiven Pokémon werden in 3 Runden besiegt.", // NEEDS QC

		start: "  Alle Pokémon, die Abgesang gehört haben, werden nach 3 Runden kampfunfähig!",
		activate: "  Abgesang von {POKEMON} steht bei {NUMBER}!",
	},
	petalblizzard: {
		name: "Blütenwirbel",
		// Official flavor text: "Der Anwender erzeugt einen turbulenten Blütenwirbel, der alle Pokémon im Umkreis erfasst und ihnen Schaden zufügt."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Pokémon.", // NEEDS QC
	},
	petaldance: {
		name: "Blättertanz",
		// Official flavor text: "Angriff mit Blütenblättern für zwei bis drei Runden. Danach wird der Angreifer verwirrt."
		desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff in der ersten Runde des Effekts oder der zweiten eines dreirundigen Effekts fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen und schläft der Anwender, wird sie nur eine Runde eingesetzt und verwirrt ihn nicht.", // NEEDS QC
		shortDesc: "Hält 2-3 Runden, verwirrt danach den Anwender.", // NEEDS QC
		gen6: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen angrenzenden Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff in der ersten Runde des Effekts oder der zweiten eines dreirundigen Effekts fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird am Ende der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff gegen das Ziel fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird am Ende der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er ein, wird er eingefroren oder schlägt der Angriff gegen das Ziel fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen2: {
			desc: "Unabhängig davon, ob diese Attacke gelingt, ist der Anwender zwei oder drei Runden lang an sie gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, selbst wenn er bereits verwirrt ist. Kann der Anwender nicht handeln, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen1: {
			desc: "Unabhängig davon, ob diese Attacke gelingt, ist der Anwender drei oder vier Runden lang an sie gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, selbst wenn er bereits verwirrt ist. Kann der Anwender nicht handeln, endet der Effekt ohne Verwirrung. Während des Effekts wird die Genauigkeit dieser Attacke jede Runde mit der aktuell berechneten Genauigkeit einschließlich Statusveränderungen überschrieben, jedoch nicht auf weniger als 1/256 oder mehr als 255/256.", // NEEDS QC
			shortDesc: "Dauert 3-4 Runden. Verwirrt danach den Anwender.", // NEEDS QC
		},
	},
	phantomforce: {
		name: "Phantomkraft",
		// Official flavor text: "Der Anwender verschwindet in Runde 1, um seine Kraft zu sammeln, und attackiert in Runde 2. Trifft auch, wenn sich das Ziel selbst schützt."
		desc: "Gelingt diese Attacke, durchbricht sie für diese Runde die Effekte von Bunker, Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Verschwindet, trifft in Runde 2. Bricht Schutz.", // NEEDS QC
		gen6: {
			desc: "Gelingt diese Attacke, durchbricht sie für diese Runde die Effekte von Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen und andere Pokémon können die Seite des Ziels normal angreifen. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel im Kampf Komprimator eingesetzt hat.", // NEEDS QC
		},

		prepare: "#shadowforce",
		activate: "#shadowforce",
	},
	photongeyser: {
		name: "Photonen-Geysir",
		// Official flavor text: "Ein Angriff mit einer Lichtsäule. Ist der Angriff höher als der Spezial-Angriff, wird die Höhe des Schadens durch den Angriff bestimmt und umgekehrt."
		desc: "Diese Attacke wird zu einem physischen Angriff, wenn der Angriff des Anwenders höher ist als sein Spezial-Angriff, einschließlich Statusveränderungen. Diese Attacke und ihre Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		shortDesc: "Physisch bei Ang. > Sp.-Ang. Ignoriert Fähigkeiten.", // NEEDS QC
	},
	pikapapow: {
		name: "Pika-Flash",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke beträgt (Freundschaft des Anwenders × 2/5), abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Max. Freundschaft: 102 Stärke. Verfehlt nie.", // NEEDS QC
	},
	pinmissile: {
		name: "Nadelrakete",
		// Official flavor text: "Spitze Nadeln treffen das Ziel zwei- bis fünfmal hintereinander."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Der Schaden wird nur für den ersten Treffer berechnet und für jeden weiteren übernommen. Zerbricht einer der Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	plasmafists: {
		name: "Plasmafäuste",
		// Official flavor text: "Ein Angriff mit elektrisch geladenen Fäusten, der bewirkt, dass Normal-Attacken den Typ Elektro annehmen."
		desc: "Gelingt diese Attacke, werden Attacken vom Typ Normal in dieser Runde zu Attacken vom Typ Elektro.", // NEEDS QC
		shortDesc: "Normal-Attacken werden diese Runde zu Elektro.", // NEEDS QC
	},
	playnice: {
		name: "Kameradschaft",
		// Official flavor text: "Der Anwender schließt mit dem Ziel Freundschaft und nimmt ihm seine Angriffslust. Der Angriffs-Wert des Zieles sinkt."
		desc: "Senkt den Angriff des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Angriff des Ziels um eine Stufe.", // NEEDS QC
	},
	playrough: {
		name: "Knuddler",
		// Official flavor text: "Der Anwender knuddelt das Ziel und greift es an. Senkt eventuell den Angriffs-Wert des Zieles."
		desc: "Hat eine Chance von 10 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Ang. des Ziels.", // NEEDS QC
	},
	pluck: {
		name: "Pflücker",
		// Official flavor text: "Anwender pickt das Ziel, nimmt die Beere, falls das Ziel eine trägt, und erhält ihren Effekt."
		desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, stiehlt er die getragene Beere des Ziels und isst sie sofort, wobei er ihre Effekte erhält, selbst wenn sein eigenes Item ignoriert wird. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		shortDesc: "Stiehlt und isst die Beere des Ziels.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stiehlt die getragene Beere des Ziels und isst sie sofort, wobei er ihre Effekte erhält, sofern sein eigenes Item nicht ignoriert wird. Durch diese Attacke verlorene Items können mit Aufbereitung zurückgeholt werden.", // NEEDS QC
		},

		removeItem: "#bugbite",
	},
	poisonfang: {
		name: "Giftzahn",
		// Official flavor text: "Angriff mit giftigen Reißzähnen. Das Ziel wird eventuell schwer vergiftet."
		desc: "Hat eine Chance von 50 %, das Ziel schwer zu vergiften.", // NEEDS QC
		shortDesc: "50 % Chance auf schwere Vergiftung.", // NEEDS QC
		gen5: {
			desc: "Hat eine Chance von 30 %, das Ziel schwer zu vergiften.", // NEEDS QC
			shortDesc: "30 % Chance, das Ziel schwer zu vergiften.", // NEEDS QC
		},
	},
	poisongas: {
		name: "Giftwolke",
		// Official flavor text: "Hüllt gegnerische Pokémon in ein Gas ein, das sie vergiftet."
		desc: "Vergiftet das Ziel.", // NEEDS QC
		shortDesc: "Vergiftet die Gegner.", // NEEDS QC
		gen2: {
			shortDesc: "Vergiftet das Ziel.", // NEEDS QC
		},
	},
	poisonjab: {
		name: "Gifthieb",
		// Official flavor text: "Der Anwender greift mit giftigen Gliedmaßen wie Tentakeln oder Armen an. Das Ziel wird dabei eventuell vergiftet."
		desc: "Hat eine Chance von 30 %, das Ziel zu vergiften.", // NEEDS QC
		shortDesc: "30 % Chance auf Vergiftung.", // NEEDS QC
	},
	poisonpowder: {
		name: "Giftpuder",
		// Official flavor text: "Verstreut giftigen Puder, der das Ziel eventuell vergiftet."
		desc: "Vergiftet das Ziel.", // NEEDS QC
		shortDesc: "Vergiftet das Ziel.", // NEEDS QC
	},
	poisonsting: {
		name: "Giftstachel",
		// Official flavor text: "Angriff mit Giftstachel. Das Ziel wird eventuell vergiftet."
		desc: "Hat eine Chance von 30 %, das Ziel zu vergiften.", // NEEDS QC
		shortDesc: "30 % Chance auf Vergiftung.", // NEEDS QC
		gen1: {
			desc: "Hat eine Chance von 20 %, das Ziel zu vergiften.", // NEEDS QC
			shortDesc: "20 % Chance, das Ziel zu vergiften.", // NEEDS QC
		},
	},
	poisontail: {
		name: "Giftschweif",
		// Official flavor text: "Angriff mit hoher Volltrefferquote. Diese Schweifattacke vergiftet das Ziel eventuell."
		desc: "Hat eine Chance von 10 %, das Ziel zu vergiften, und eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Hohe Volltrefferquote. 10 % Chance auf Gift.", // NEEDS QC
	},
	polarflare: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Hat eine Chance von 10 %, das Ziel einzufrieren. Diese Attacke kann ein eingefrorenes Ziel nicht auftauen. Gelingt sie gegen mindestens ein Ziel und ist der Anwender ein Ramnarok, nimmt es die Radiant Forme an, wenn es in der Dormant Forme ist, und umgekehrt. Dieser Formwechsel findet nicht statt, wenn das Ramnarok die Fähigkeit Rohe Gewalt hat. Die Radiant Forme kehrt zur Dormant Forme zurück, wenn Ramnarok das Feld verlässt.", // NEEDS QC
		shortDesc: "10 % Einfrieren. Verwandelt Ramnarok.", // NEEDS QC
	},
	pollenpuff: {
		name: "Pollenknödel",
		// Official flavor text: "Der Anwender greift mit einem Ball aus Pollen an, der beim Ziel explodiert. Mitstreiter werden von einem Ball getroffen, der ihre KP auffüllt."
		desc: "Ist das Ziel ein Mitstreiter, stellt diese Attacke die Hälfte seiner maximalen KP wieder her, abgerundet, statt Schaden zuzufügen.", // NEEDS QC
		shortDesc: "Heilt Mitstreiter stattdessen um halbe max. KP.", // NEEDS QC
	},
	poltergeist: {
		name: "Poltergeist",
		shortDesc: "Scheitert, wenn das Ziel kein Item trägt.", // NEEDS QC

		activate: "  {POKEMON} wird von seinem Item {ITEM} angegriffen!",
	},
	populationbomb: {
		name: "Mäuseplage",
		desc: "Trifft zehnmal. Diese Attacke prüft die Genauigkeit bei jedem Treffer, und der Angriff endet, wenn das Ziel einem ausweicht. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer zehnmal. Trägt der Anwender einen Gezinkter Würfel, trifft sie zufällig vier- bis zehnmal, ohne die Genauigkeit zwischen den Treffern zu prüfen.", // NEEDS QC
		shortDesc: "Trifft 10-mal. Jeder Treffer kann verfehlen.", // NEEDS QC
	},
	pounce: {
		name: "Anspringen",
		desc: "Hat eine Chance von 100 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Init. des Ziels.", // NEEDS QC
	},
	pound: {
		name: "Klaps",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	powder: {
		name: "Pulverschleuder",
		// Official flavor text: "Setzt das Ziel nach Einsatz von Pulverschleuder in derselben Runde eine Feuer-Attacke ein, kommt es zu einer Explosion, die ihm schadet."
		desc: "Setzt das Ziel in dieser Runde eine Attacke vom Typ Feuer ein, wird diese nicht ausgeführt und das Ziel verliert 1/4 seiner maximalen KP, ab 0,5 aufgerundet. Dieser Effekt tritt nicht ein, wenn die Attacke vom Typ Feuer durch Strömenden Regen verhindert wird.", // NEEDS QC
		shortDesc: "Feuer-Attacken schlagen fehl: -1/4 der max. KP.", // NEEDS QC
		gen6: {
			desc: "Setzt das Ziel in dieser Runde eine Attacke vom Typ Feuer ein, wird diese nicht ausgeführt und das Ziel verliert 1/4 seiner maximalen KP, ab 0,5 aufgerundet. Dieser Effekt tritt ein, bevor die Attacke vom Typ Feuer durch Strömenden Regen verhindert würde.", // NEEDS QC
		},

		start: "  Auf {POKEMON} wurde Pulver geschleudert!",
		activate: "  {MOVE} bringt das Pulver zum Explodieren!",
	},
	powdersnow: {
		name: "Pulverschnee",
		// Official flavor text: "Angriff mit Schnee, durch den gegnerische Pokémon eventuell eingefroren werden."
		desc: "Hat eine Chance von 10 %, das Ziel einzufrieren.", // NEEDS QC
		shortDesc: "10 % Chance auf Einfrieren.", // NEEDS QC
		gen2: {
			shortDesc: "10 % Chance auf Einfrieren.", // NEEDS QC
		},
	},
	powergem: {
		name: "Juwelenkraft",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	powersplit: {
		name: "Kraftteiler",
		// Official flavor text: "Durch Psycho-Kräfte werden Angriff und Spezial-Angriff des Anwenders und des Zieles addiert und in zwei gleiche Hälften geteilt."
		desc: "Angriff und Spezial-Angriff von Anwender und Ziel werden auf den Durchschnitt der jeweiligen Werte gesetzt, abgerundet. Statusveränderungen bleiben unberührt.", // NEEDS QC
		shortDesc: "Mittelt Ang. und Sp.-Ang. mit dem Ziel.", // NEEDS QC

		activate: "  {POKEMON} addiert seine Kräfte mit jenen des Ziels und teilt sie gerecht auf!",
	},
	powerswap: {
		name: "Krafttausch",
		// Official flavor text: "Psychische Kräfte tauschen Änderungen an Angriff und Spezial-Angriff mit denen des Zieles."
		desc: "Der Anwender tauscht seine Statusveränderungen von Angriff und Spezial-Angriff mit denen des Ziels.", // NEEDS QC
		shortDesc: "Tauscht Ang.-/Sp.-Ang.-Änderungen mit dem Ziel.", // NEEDS QC
	},
	powershift: {
		name: "Kraftwechsel",
		desc: "Der Anwender tauscht seine Angriffs- und Verteidigungswerte; Statusveränderungen bleiben bei den jeweiligen Werten. Diese Attacke kann erneut eingesetzt werden, um die Werte zurückzutauschen. Setzt der Anwender Stafette ein, hat der Nachfolger vertauschte Angriffs- und Verteidigungswerte, sofern der Effekt aktiv ist. Werden die Werte des Anwenders durch einen Formwechsel neu berechnet, während sie vertauscht sind, wird dieser Effekt ignoriert, bleibt aber für Stafette aktiv.", // NEEDS QC
		shortDesc: "Tauscht Angriff und Verteidigung des Anwenders.", // NEEDS QC

		start: "  {POKEMON} hat Offensivkraft und Defensivkraft getauscht!",
		end: "#.start",
	},
	powertrick: {
		name: "Krafttrick",
		// Official flavor text: "Anwender setzt Psycho-Kräfte ein, um eigenen Angriffs- mit Verteidigungs-Wert auszutauschen."
		desc: "Der Anwender tauscht seine Angriffs- und Verteidigungswerte; Statusveränderungen bleiben bei den jeweiligen Werten. Diese Attacke kann erneut eingesetzt werden, um die Werte zurückzutauschen. Setzt der Anwender Stafette ein, hat der Nachfolger vertauschte Angriffs- und Verteidigungswerte, sofern der Effekt aktiv ist. Werden die Werte des Anwenders durch einen Formwechsel neu berechnet, während sie vertauscht sind, wird dieser Effekt ignoriert, bleibt aber für Stafette aktiv.", // NEEDS QC
		shortDesc: "Tauscht Angriff und Verteidigung des Anwenders.", // NEEDS QC

		start: "  {POKEMON} tauscht den Wert seines Angriffs mit dem seiner Verteidigung!",
		end: "#.start",
	},
	powertrip: {
		name: "Überheblichkeit",
		// Official flavor text: "Der Anwender prahlt mit seiner Stärke und greift das Ziel an. Dieser Angriff ist umso stärker, je weiter die Statuswerte des Anwenders erhöht sind."
		desc: "Die Stärke beträgt 20 + (X × 20), wobei X die Summe der positiven Statusveränderungen des Anwenders ist.", // NEEDS QC
		shortDesc: "+20 Stärke pro Statuswert-Erhöhung des Anwenders.", // NEEDS QC
	},
	poweruppunch: {
		name: "Steigerungshieb",
		// Official flavor text: "Die Fäuste des Anwenders härten durch wiederholtes Zuschlagen ab. Mit jedem Treffer steigt sein Angriffs-Wert."
		desc: "Hat eine Chance von 100 %, den Angriff des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "100 % Chance auf +1 Ang. des Anwenders.", // NEEDS QC
	},
	powerwhip: {
		name: "Blattgeißel",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	precipiceblades: {
		name: "Abgrundsklinge",
		// Official flavor text: "Der Anwender wandelt die Kraft des Erdreichs in Klingen um, mit denen er gegnerische Pokémon angreift."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Kein Zusatzeffekt. Trifft benachbarte Gegner.", // NEEDS QC
	},
	present: {
		name: "Geschenk",
		// Official flavor text: "Eine Bombe als Geschenk. Kann auch KP des Zieles wiederherstellen."
		desc: "Gelingt diese Attacke, fügt sie Schaden zu oder heilt das Ziel: 40 % Chance auf 40 Stärke, 30 % auf 80, 10 % auf 120 und 20 % Chance, das Ziel um 1/4 seiner maximalen KP zu heilen, abgerundet.", // NEEDS QC
		shortDesc: "40, 80 oder 120 Stärke, oder heilt das Ziel.", // NEEDS QC
		gen2: {
			desc: "Gelingt diese Attacke, fügt sie Schaden zu oder heilt das Ziel: 102/256 Chance auf 40 Stärke, 76/256 auf 80, 26/256 auf 120 und 52/256 Chance, das Ziel um 1/4 seiner maximalen KP zu heilen, abgerundet. Fügt diese Attacke Schaden zu, verwendet sie eine abnormale Version der Schadensformel, bei der bestimmte Werte ersetzt werden: Der Angriffs-Wert des Anwenders wird durch das 10-Fache der Effektivität dieser Attacke gegen das Ziel ersetzt, der Verteidigungs-Wert des Ziels durch die Indexnummer des Zweittyps des Anwenders und das Level des Anwenders durch die Indexnummer des Zweittyps des Ziels. Hat ein Pokémon keinen Zweittyp, wird sein Ersttyp verwendet. Die Indexnummern der Typen sind Normal: 0, Kampf: 1, Flug: 2, Gift: 3, Boden: 4, Gestein: 5, Käfer: 7, Geist: 8, Stahl: 9, Feuer: 20, Wasser: 21, Pflanze: 22, Elektro: 23, Psycho: 24, Eis: 25, Drache: 26, Unlicht: 27. Käme es in der Schadensformel zu einer Division durch 0, wird stattdessen durch 1 geteilt.", // NEEDS QC
		},
	},
	prismaticlaser: {
		name: "Prisma-Laser",
		// Official flavor text: "Der Anwender feuert mithilfe von Prisma-Kraft mächtige Lichtstrahlen ab. In der nächsten Runde kann er nicht handeln."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
	},
	protect: {
		name: "Schutzschild",
		// Official flavor text: "Anwender wehrt jede Attacke ab. Scheitert eventuell bei Wiederholung."
		desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Schützt den Anwender in dieser Runde vor Attacken.", // NEEDS QC
		gen8: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdoppelt. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Schutzschild, Rapidschutz oder Rundumschutz ist. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdoppelt, bis maximal 8. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer oder Schutzschild ist. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt. Diese Attacke hat eine Erfolgschance von X/65536, wobei X bei 65535 beginnt und sich bei jedem Erfolg halbiert, abgerundet. Nach dem vierten Erfolg in Folge fällt X auf 118 und nimmt bei weiteren Erfolgen scheinbar zufällige Werte von 0–65535 an. X wird auf 65535 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer oder Schutzschild ist. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender ist in dieser Runde vor Attacken des Gegners geschützt. Diese Attacke hat eine Erfolgschance von X/255, wobei X bei 255 beginnt und sich bei jedem Erfolg halbiert, abgerundet. X wird auf 255 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer oder Schutzschild ist. Schlägt fehl, wenn der Anwender einen Delegator hat oder in dieser Runde als Letzter handelt.", // NEEDS QC
		},

		start: "  {POKEMON} schützt sich selbst!",
		block: "  {POKEMON} schützt sich selbst!",
	},
	psybeam: {
		name: "Psystrahl",
		// Official flavor text: "Feuert einen Strahl ab, der das Ziel verwirren kann."
		desc: "Hat eine Chance von 10 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "10 % Chance auf Verwirrung.", // NEEDS QC
	},
	psyblade: {
		name: "Psychoschneide",
		desc: "Liegt ein Elektrofeld vor, wird die Stärke dieser Attacke mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Im Elektrofeld: x1,5 Stärke.", // NEEDS QC
	},
	psychic: {
		name: "Psychokinese",
		// Official flavor text: "Starke Psycho-Attacke, die eventuell die Spezial-Verteidigung des Zieles senkt."
		desc: "Hat eine Chance von 10 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "10 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
		gen1: {
			desc: "Hat eine Chance von 33 %, den Spezial-Wert des Ziels um eine Stufe zu senken.", // NEEDS QC
			shortDesc: "33 % Chance auf -1 Spezial des Ziels.", // NEEDS QC
		},
	},
	psychicfangs: {
		name: "Psychobeißer",
		// Official flavor text: "Der Anwender beißt das Ziel mithilfe von Psycho-Kräften. Die Attacke durchbricht auch Barrieren wie Lichtschild und Reflektor."
		desc: "Verfehlt dieser Angriff nicht, enden die Effekte von Reflektor, Lichtschild und Auroraschleier auf der Seite des Ziels vor der Schadensberechnung.", // NEEDS QC
		shortDesc: "Zerstört Schilde, außer das Ziel ist immun.", // NEEDS QC
	},
	psychicnoise: {
		name: "Psycholärm",
		desc: "2 Runden lang kann das Ziel keine KP wiederherstellen, solange es im Kampf bleibt. Während des Effekts sind heilende und absorbierende Attacken unbrauchbar, und heilende Fähigkeiten und Items heilen nicht. Setzt ein betroffenes Pokémon Stafette ein, kann auch der Nachfolger keine KP wiederherstellen. Leidteiler und die Fähigkeit Belebekraft sind nicht betroffen.", // NEEDS QC
		shortDesc: "Das Ziel kann sich 2 Runden nicht heilen.", // NEEDS QC
	},
	psychicterrain: {
		name: "Psychofeld",
		// Official flavor text: "Verhindert für fünf Runden, dass Pokémon am Boden von Erstschlag-Attacken getroffen werden. Erhöht die Stärke von Psycho-Attacken."
		desc: "5 Runden lang liegt ein Psychofeld vor. Währenddessen wird die Stärke von Attacken vom Typ Psycho von Pokémon am Boden mit 1,3 multipliziert, und Pokémon am Boden können nicht von Attacken mit Priorität über 0 getroffen werden, außer das Ziel ist ein Mitstreiter. Tarnung macht den Anwender zum Typ Psycho, Natur-Kraft wird zu Psychokinese und Geheimpower hat eine Chance von 30 %, die Initiative des Ziels um eine Stufe zu senken. Schlägt fehl, wenn bereits ein Psychofeld vorliegt.", // NEEDS QC
		shortDesc: "5 Runden: Psycho stärker, Prioritätsschutz.", // NEEDS QC
		gen7: {
			desc: "5 Runden lang liegt ein Psychofeld vor. Währenddessen wird die Stärke von Attacken vom Typ Psycho von Pokémon am Boden mit 1,5 multipliziert, und Pokémon am Boden können nicht von Attacken mit Priorität über 0 getroffen werden, außer das Ziel ist ein Mitstreiter. Tarnung macht den Anwender zum Typ Psycho, Natur-Kraft wird zu Psychokinese und Geheimpower hat eine Chance von 30 %, die Initiative des Ziels um eine Stufe zu senken. Schlägt fehl, wenn bereits ein Psychofeld vorliegt.", // NEEDS QC
		},
	},
	psychoboost: {
		name: "Psyschub",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Senkt den Spezial-Angriff des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Sp.-Ang. des Anwenders um 2 Stufen.", // NEEDS QC
	},
	psychocut: {
		name: "Psychoklinge",
		// Official flavor text: "Das Ziel wird mit Klingen attackiert, die aus Psycho-Energie bestehen. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	psychoshift: {
		name: "Psybann",
		// Official flavor text: "Anwender nutzt seine Suggestivkräfte, um eigene Statusprobleme auf das Ziel zu transferieren."
		desc: "Das Statusproblem des Anwenders wird auf das Ziel übertragen und der Anwender geheilt. Schlägt fehl, wenn der Anwender kein Statusproblem hat oder das Ziel bereits eines hat.", // NEEDS QC
		shortDesc: "Überträgt sein Statusproblem auf das Ziel.", // NEEDS QC
	},
	psychup: {
		name: "Psycho-Plus",
		// Official flavor text: "Der Anwender hypnotisiert sich selbst, um die Statusveränderungen des Zieles zu kopieren."
		desc: "Der Anwender kopiert alle aktuellen Statusveränderungen des Ziels.", // NEEDS QC
		shortDesc: "Kopiert die Statusveränderungen des Ziels.", // NEEDS QC
		gen2: {
			desc: "Der Anwender kopiert alle aktuellen Statusveränderungen des Ziels. Schlägt fehl, wenn die Statuswertstufen des Ziels alle 0 sind.", // NEEDS QC
		},
	},
	psyshieldbash: {
		name: "Barrierenstoß",
		desc: "Hat eine Chance von 100 %, die Verteidigung des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "100 % Chance auf +1 Vert. des Anwenders.", // NEEDS QC
	},
	psyshock: {
		name: "Psychoschock",
		// Official flavor text: "Anwender erzeugt eine seltsame Energiewelle, die dem Ziel physischen Schaden zufügt."
		desc: "Fügt dem Ziel Schaden anhand seiner Verteidigung statt seiner Spezial-Verteidigung zu.", // NEEDS QC
		shortDesc: "Trifft die Verteidigung des Ziels statt der Sp.-Vert.", // NEEDS QC
	},
	psystrike: {
		name: "Psychostoß",
		// Official flavor text: "Anwender erzeugt eine seltsame Energiewelle, die dem Ziel physischen Schaden zufügt."
		desc: "Fügt dem Ziel Schaden anhand seiner Verteidigung statt seiner Spezial-Verteidigung zu.", // NEEDS QC
		shortDesc: "Trifft die Verteidigung des Ziels statt der Sp.-Vert.", // NEEDS QC
	},
	psywave: {
		name: "Psywelle",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Fügt dem Ziel Schaden in Höhe von (Level des Anwenders) × (X + 50) / 100 zu, wobei X eine Zufallszahl zwischen 0 und 100 ist, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "Zufälliger Schaden: 0,5- bis 1,5-faches Level.", // NEEDS QC
		gen4: {
			desc: "Fügt dem Ziel Schaden in Höhe von (Level des Anwenders) × (X × 10 + 50) / 100 zu, wobei X eine Zufallszahl zwischen 0 und 10 ist, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		},
		gen2: {
			desc: "Fügt dem Ziel Schaden in Höhe einer Zufallszahl zwischen 1 und (Level des Anwenders × 1,5 − 1) zu, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
			shortDesc: "Zufälliger Schaden von 1 bis (Level x 1,5 - 1).", // NEEDS QC
		},
	},
	pulverizingpancake: {
		name: "Schluss mit lustig",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	punishment: {
		name: "Strafattacke",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke beträgt 60 + (X × 20), wobei X die Summe der positiven Statusveränderungen des Ziels ist, höchstens jedoch 200.", // NEEDS QC
		shortDesc: "60 Stärke, +20 pro Werterhöhung des Ziels.", // NEEDS QC
	},
	purify: {
		name: "Läuterung",
		// Official flavor text: "Der Anwender heilt das Statusproblem des Zieles und füllt dadurch seine eigenen KP auf."
		desc: "Heilt das Statusproblem des Ziels. Wurde das Ziel geheilt, stellt der Anwender die Hälfte seiner maximalen KP wieder her, abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Status des Ziels; dann halbe KP zurück.", // NEEDS QC
	},
	pursuit: {
		name: "Verfolgung",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Verlässt ein Gegner in dieser Runde das Feld, trifft ihn diese Attacke vor dem Verlassen, selbst wenn er nicht das ursprüngliche Ziel war. Handelt der Anwender nach einem Gegner, der Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt, nicht aber Stafette, trifft er ihn vor dem Verlassen. Die Stärke wird verdoppelt und die Genauigkeit nicht geprüft, wenn der Anwender einen ausscheidenden Gegner trifft, und seine Runde ist damit beendet; wird ein Gegner dadurch kampfunfähig, wird der Ersatz erst am Ende der Runde eingewechselt.", // NEEDS QC
		shortDesc: "Doppelte Stärke gegen auswechselnde Gegner.", // NEEDS QC
		gen7: {
			desc: "Verlässt ein angrenzender Gegner in dieser Runde das Feld, trifft ihn diese Attacke vor dem Verlassen, selbst wenn er nicht das ursprüngliche Ziel war. Handelt der Anwender nach einem Gegner, der Abgangstirade, Kehrtwende oder Voltwechsel einsetzt, nicht aber Stafette, trifft er ihn vor dem Verlassen. Die Stärke wird verdoppelt und die Genauigkeit nicht geprüft, wenn der Anwender einen ausscheidenden Gegner trifft, und seine Runde ist damit beendet; wird ein Gegner dadurch kampfunfähig, wird der Ersatz erst am Ende der Runde eingewechselt.", // NEEDS QC
		},
		gen5: {
			desc: "Verlässt ein angrenzender Gegner in dieser Runde das Feld, trifft ihn diese Attacke vor dem Verlassen, selbst wenn er nicht das ursprüngliche Ziel war. Handelt der Anwender nach einem Gegner, der Kehrtwende oder Voltwechsel einsetzt, nicht aber Stafette, trifft er ihn vor dem Verlassen. Die Stärke wird verdoppelt und die Genauigkeit nicht geprüft, wenn der Anwender einen ausscheidenden Gegner trifft, und seine Runde ist damit beendet; wird ein Gegner dadurch kampfunfähig, wird der Ersatz erst am Ende der Runde eingewechselt.", // NEEDS QC
		},
		gen4: {
			desc: "Verlässt ein Gegner in dieser Runde das Feld, trifft ihn diese Attacke vor dem Verlassen, selbst wenn er nicht das ursprüngliche Ziel war. Handelt der Anwender nach einem Gegner, der Kehrtwende einsetzt, nicht aber Stafette, trifft er ihn vor dem Verlassen. Die Stärke wird verdoppelt und die Genauigkeit nicht geprüft, wenn der Anwender einen ausscheidenden Gegner trifft, und seine Runde ist damit beendet; wird ein Gegner dadurch kampfunfähig, wird der Ersatz sofort eingewechselt.", // NEEDS QC
		},
		gen3: {
			desc: "Ist das Ziel ein Gegner und verlässt es in dieser Runde das Feld, trifft ihn diese Attacke vor dem Verlassen. Die Stärke wird verdoppelt und die Genauigkeit nicht geprüft, wenn der Anwender einen ausscheidenden Gegner trifft, und seine Runde ist damit beendet; wird ein Gegner dadurch kampfunfähig, wird der Ersatz sofort eingewechselt.", // NEEDS QC
			shortDesc: "2x Stärke gegen das ausgewechselte Ziel.", // NEEDS QC
		},
		gen2: {
			desc: "Verlässt das Ziel in dieser Runde das Feld, trifft es diese Attacke mit verdoppelter Stärke, bevor es geht, und die Runde des Anwenders ist damit beendet.", // NEEDS QC
			shortDesc: "2x Stärke, wenn der Gegner auswechselt.", // NEEDS QC
		},

		activate: "  ({TARGET} wird zurückgezogen ...)", // NEEDS QC
	},
	pyroball: {
		name: "Feuerball",
		// Official flavor text: "Der Anwender greift mit einem Ball aus Feuer an, den er durch Anzünden eines kleinen Steins erzeugt. Fügt dem Ziel eventuell Verbrennungen zu."
		desc: "Hat eine Chance von 10 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "10 % Chance auf Verbrennung. Taut den Anwender auf.", // NEEDS QC
	},
	quash: {
		name: "Verzögerung",
		// Official flavor text: "Anwender stemmt sich gegen das Ziel und bewirkt, dass dieses erst als Letztes angreift."
		desc: "Das Ziel handelt in dieser Runde nach allen anderen Pokémon, unabhängig von der Priorität seiner gewählten Attacke. Schlägt fehl, wenn das Ziel in dieser Runde bereits gehandelt hat.", // NEEDS QC
		shortDesc: "Das Ziel handelt in dieser Runde als Letztes.", // NEEDS QC

		activate: "  {TARGET} muss sich hinten anstellen!",
	},
	quickattack: {
		name: "Ruckzuckhieb",
		// Official flavor text: "Bei dieser Erstschlag-Attacke stürzt sich der Anwender so schnell auf das Ziel, dass er quasi unsichtbar wird."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
	},
	quickguard: {
		name: "Rapidschutz",
		// Official flavor text: "Schützt Anwender und Mitstreiter vor Erstschlag-Attacken."
		desc: "Der Anwender und sein Team sind in dieser Runde vor Attacken mit (ursprünglicher oder veränderter) Priorität über 0 anderer Pokémon geschützt, auch von Mitstreitern. Diese Attacke verändert denselben 1-zu-X-Zähler wie die anderen Schutz-Attacken, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht, nutzt diese Chance aber nicht zur Fehlschlagsprüfung. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "Schützt das Team vor Prioritätsattacken.", // NEEDS QC
		gen8: {
			desc: "Der Anwender und sein Team sind in dieser Runde vor Attacken mit (ursprünglicher oder veränderter) Priorität über 0 anderer Pokémon geschützt, auch von Mitstreitern. Diese Attacke verändert denselben 1-zu-X-Zähler wie die anderen Schutz-Attacken, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht, nutzt diese Chance aber nicht zur Fehlschlagsprüfung. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender und sein Team sind in dieser Runde vor Attacken mit (ursprünglicher oder veränderter) Priorität über 0 anderer Pokémon geschützt, auch von Mitstreitern. Diese Attacke verändert denselben 1-zu-X-Zähler wie die anderen Schutz-Attacken, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht, nutzt diese Chance aber nicht zur Fehlschlagsprüfung. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender und sein Team sind in dieser Runde vor Attacken mit (ursprünglicher oder veränderter) Priorität über 0 anderer Pokémon geschützt, auch von Mitstreitern. Diese Attacke verändert denselben 1-zu-X-Zähler wie die anderen Schutz-Attacken, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht, nutzt diese Chance aber nicht zur Fehlschlagsprüfung. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender und sein Team sind in dieser Runde vor Attacken mit ursprünglicher Priorität über 0 anderer Pokémon geschützt, auch von Mitstreitern. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdoppelt. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Schutzschild, Rapidschutz oder Rundumschutz ist. Ist X 256 oder mehr, hat diese Attacke eine Erfolgschance von 1 zu 2^32. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		},

		start: "  {TEAM} wird durch Rapidschutz geschützt!",
		block: "  {POKEMON} wird durch Rapidschutz geschützt!",
	},
	quiverdance: {
		name: "Falterreigen",
		// Official flavor text: "Anwender legt behände einen mystischen, formvollendeten Tanz aufs Parkett. Spezial-Angriff, Spezial-Verteidigung und Initiative steigen."
		desc: "Erhöht Spezial-Angriff, Spezial-Verteidigung und Initiative des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Sp.-Ang., Sp.-Vert. und Init. des Anwenders.", // NEEDS QC
	},
	rage: {
		name: "Raserei",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Nach erfolgreichem Einsatz steigt der Angriff des Anwenders um eine Stufe, wann immer er vom Angriff eines anderen Pokémon getroffen wird, solange diese Attacke gewählt bleibt.", // NEEDS QC
		shortDesc: "+1 Angriff bei erlittenen Treffern währenddessen.", // NEEDS QC
		gen3: {
			desc: "Nach dem Einsatz dieser Attacke steigt der Angriff des Anwenders um eine Stufe, wann immer er vom Angriff eines anderen Pokémon getroffen wird, solange diese Attacke gewählt bleibt und sich das Ziel nicht geschützt hat.", // NEEDS QC
		},
		gen2: {
			desc: "Nach erfolgreichem Einsatz beginnt X bei 1. Der Schaden dieser Attacke wird mit X multipliziert, und X steigt um 1, wann immer der Anwender vom Gegner getroffen wird, bis maximal 255. X wird auf 1 zurückgesetzt, wenn der Anwender nicht mehr im Kampf ist oder diese Attacke nicht gewählt hat.", // NEEDS QC
			shortDesc: "Nächste Raserei stärker, wenn Anwender getroffen wird.", // NEEDS QC
		},
		gen1: {
			desc: "Nach erfolgreichem Einsatz setzt der Anwender diese Attacke automatisch jede Runde ein und kann nicht mehr ausgewechselt werden. Während des Effekts steigt sein Angriff um eine Stufe, wann immer er vom Gegner getroffen wird, und die Genauigkeit dieser Attacke wird jede Runde mit der aktuell berechneten Genauigkeit einschließlich Statusveränderungen überschrieben, jedoch nicht auf weniger als 1/256 oder mehr als 255/256.", // NEEDS QC
			shortDesc: "Endlos. +1 Angriff, wenn der Anwender getroffen wird.", // NEEDS QC
		},
	},
	ragefist: {
		name: "Zornesfaust",
		desc: "Die Stärke beträgt 50 + (X × 50), wobei X die Gesamtzahl der Treffer durch schädigende Angriffe ist, die der Anwender im Kampf erlitten hat, selbst ohne KP-Verlust. X kann höchstens 6 betragen und wird durch Auswechseln oder Kampfunfähigkeit nicht zurückgesetzt. Jeder Treffer einer mehrfach treffenden Attacke zählt, Verwirrungsschaden jedoch nicht.", // NEEDS QC
		shortDesc: "+50 Stärke pro erlittenem Treffer, max. 6.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	ragepowder: {
		name: "Wutpulver",
		// Official flavor text: "Anwender zieht gegnerische Aufmerksamkeit und Angriffe auf sich, indem er ein Wut erzeugendes Pulver über sich streut."
		desc: "Bis zum Ende der Runde werden alle Angriffe der gegnerischen Seite mit einzelnem Ziel auf den Anwender umgelenkt. Diese Angriffe werden umgelenkt, bevor sie von Magiemantel oder der Fähigkeit Magiespiegel zurückgeworfen oder von den Fähigkeiten Blitzfänger bzw. Sturmsog angezogen werden können. Schlägt fehl, wenn es kein Doppelkampf oder Battle Royale ist. Dieser Effekt wird ignoriert, solange der Anwender unter dem Effekt von Freier Fall steht.", // NEEDS QC
		shortDesc: "Gegnerische Attacken zielen diese Runde auf ihn.", // NEEDS QC
		gen6: {
			desc: "Bis zum Ende der Runde werden alle Einzelziel-Angriffe der gegnerischen Seite auf den Anwender umgelenkt, sofern er in Reichweite ist. Solche Angriffe werden umgelenkt, bevor sie von Magiemantel oder der Fähigkeit Magiespiegel reflektiert oder von den Fähigkeiten Blitzfänger oder Sturmsog angezogen werden können. Schlägt fehl, wenn es kein Doppel- oder Dreierkampf ist. Dieser Effekt wird ignoriert, während der Anwender unter dem Effekt von Freier Fall steht.", // NEEDS QC
		},

		start: "#followme",
		startFromZEffect: "#followme",
	},
	ragingbull: {
		name: "Rasender Stier",
		desc: "Verfehlt dieser Angriff nicht, enden die Effekte von Reflektor, Lichtschild und Auroraschleier auf der Seite des Ziels vor der Schadensberechnung. Ist die aktuelle Form des Anwenders ein Paldea-Tauros, ändert sich der Typ dieser Attacke entsprechend: Typ Kampf bei der Gefechtsvariante, Typ Feuer bei der Flammenvariante und Typ Wasser bei der Aquavariante.", // NEEDS QC
		shortDesc: "Zerstört Schilde. Typ je nach Form.", // NEEDS QC

		activate: "  {POKEMON} zerschmettert den Schutz von {TEAM}!", // NEEDS QC
	},
	ragingfury: {
		name: "Flammenwut",
		desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff in der ersten Runde des Effekts oder der zweiten eines dreirundigen Effekts fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen und schläft der Anwender, wird sie nur eine Runde eingesetzt und verwirrt ihn nicht.", // NEEDS QC
		shortDesc: "Hält 2-3 Runden, verwirrt danach den Anwender.", // NEEDS QC
	},
	raindance: {
		name: "Regentanz",
		// Official flavor text: "Anwender erzeugt starken Regen. Die Stärke von Wasser-Attacken erhöht sich fünf Runden lang, während die Stärke von Feuer-Attacken sinkt."
		desc: "5 Runden lang ist das Wetter Regen. Währenddessen wird der Schaden von Attacken vom Typ Wasser mit 1,5 und der von Attacken vom Typ Feuer mit 0,5 multipliziert. Hält 8 Runden an, wenn der Anwender einen Nassbrocken trägt. Schlägt fehl, wenn das Wetter bereits Regen ist.", // NEEDS QC
		shortDesc: "5 Runden Regen: Wasser-Attacken stärker.", // NEEDS QC
		gen3: {
			desc: "5 Runden lang ist das Wetter Regen. Währenddessen wird der Schaden von Attacken vom Typ Wasser mit 1,5 und der von Attacken vom Typ Feuer mit 0,5 multipliziert. Schlägt fehl, wenn das Wetter bereits Regen ist.", // NEEDS QC
		},
		gen2: {
			desc: "5 Runden lang ist das Wetter Regen, selbst wenn das Wetter bereits Regen ist. Währenddessen wird der Schaden von Attacken vom Typ Wasser mit 1,5 und der von Attacken vom Typ Feuer mit 0,5 multipliziert.", // NEEDS QC
		},
	},
	rapidspin: {
		name: "Turbodreher",
		// Official flavor text: "Trifft das Ziel mit einer Dreh-Attacke. Befreit den Anwender unter anderem von Wickel, Klammergriff und Egelsamen. Erhöht die Initiative des Anwenders."
		desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, enden die Effekte von Egelsamen und Klammer-Attacken für den Anwender, und alle Fallen werden von seiner Seite entfernt. Hat eine Chance von 100 %, die Initiative des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "Entfernt Fallen, Fesseln usw.; +1 Initiative.", // NEEDS QC
		gen7: {
			desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, enden die Effekte von Egelsamen und Klammer-Attacken für den Anwender, und alle Fallen werden von seiner Seite entfernt.", // NEEDS QC
			shortDesc: "Befreit von Fallen, Klammergriff und Egelsamen.", // NEEDS QC
		},
		gen4: {
			desc: "Gelingt diese Attacke, enden die Effekte von Egelsamen und Klammer-Attacken für den Anwender, und alle Fallen werden von seiner Seite entfernt.", // NEEDS QC
		},
		gen3: {
			desc: "Gelingt diese Attacke, enden die Effekte von Egelsamen und Klammer-Attacken für den Anwender, und Stachler werden von seiner Seite entfernt.", // NEEDS QC
		},
	},
	razorleaf: {
		name: "Rasierblatt",
		// Official flavor text: "Greift gegnerische Pokémon mithilfe von Blättern an. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Hohe Volltrefferquote. Trifft benachbarte Gegner.", // NEEDS QC
		gen2: {
			shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
		},
	},
	razorshell: {
		name: "Kalkklinge",
		// Official flavor text: "Schneideangriff mit einer scharfen Muschelschale. Senkt eventuell die Verteidigung des Zieles."
		desc: "Hat eine Chance von 50 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "50 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
	},
	razorwind: {
		name: "Klingensturm",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine erhöhte Volltrefferquote. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Lädt auf, trifft in Runde 2. Hohe Volltrefferquote.", // NEEDS QC
		gen4: {
			desc: "Hat eine erhöhte Volltrefferquote. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt.", // NEEDS QC
		},
		gen3: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt.", // NEEDS QC
			shortDesc: "Lädt auf und trifft die Gegner in Runde 2.", // NEEDS QC
		},
		gen2: {
			desc: "Hat eine erhöhte Volltrefferquote. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt.", // NEEDS QC
			shortDesc: "Lädt auf, trifft in Runde 2. Hohe Volltrefferquote.", // NEEDS QC
		},
		gen1: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt.", // NEEDS QC
			shortDesc: "Lädt in Runde 1 auf. Trifft in Runde 2.", // NEEDS QC
		},

		prepare: "  {POKEMON} erzeugt eine Windböe!",
	},
	recover: {
		name: "Genesung",
		// Official flavor text: "Eine Selbstheilung. KP des Anwenders werden um 50 % des maximalen Wertes aufgefüllt."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um die Hälfte der max. KP.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, abgerundet.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, abgerundet. Schlägt fehl, wenn (maximale KP des Anwenders − aktuelle KP + 1) durch 256 teilbar ist.", // NEEDS QC
		},
	},
	recycle: {
		name: "Aufbereitung",
		// Official flavor text: "Recycling eines getragenen Items, das zuvor im Kampf verwendet wurde."
		desc: "Der Anwender erhält das zuletzt verwendete Item zurück. Schlägt fehl, wenn der Anwender ein Item trägt, keines getragen hat, das Item ein geplatzter Luftballon war, es von einem Pokémon mit der Fähigkeit Mitnahme aufgesammelt wurde oder durch Käferbiss, Korrosionsgas, Bezirzer, Einäschern, Abschlag, Pflücker oder Raub verloren ging. Mit Schleuder geworfene Items können zurückgeholt werden.", // NEEDS QC
		shortDesc: "Holt das zuletzt benutzte Item zurück.", // NEEDS QC
		gen7: {
			desc: "Der Anwender erhält das zuletzt verwendete Item zurück. Schlägt fehl, wenn der Anwender ein Item trägt, keines getragen hat, das Item ein geplatzter Luftballon war, es von einem Pokémon mit der Fähigkeit Mitnahme aufgesammelt wurde oder durch Käferbiss, Bezirzer, Einäschern, Abschlag, Pflücker oder Raub verloren ging. Mit Schleuder geworfene Items können zurückgeholt werden.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender erhält das Item zurück, das zuletzt von einem Pokémon auf seiner aktuellen Position verwendet wurde, selbst wenn das nicht der Anwender war. Schlägt fehl, wenn der Anwender ein Item trägt, auf seiner Position keine Items verwendet wurden oder das Item durch Bezirzer, Abschlag oder Raub verloren ging. Mit Schleuder geworfene Items können zurückgeholt werden.", // NEEDS QC
		},

		addItem: "  {POKEMON} hat das Item {ITEM} recycelt!",
	},
	reflect: {
		name: "Reflektor",
		// Official flavor text: "Eine mysteriöse Wand, die für fünf Runden den Schaden von physischen gegnerischen Treffern reduziert."
		desc: "5 Runden lang erleiden der Anwender und sein Team 0,5-fachen Schaden durch physische Angriffe, bzw. 0,66-fachen in Doppelkämpfen. Der Schaden wird durch Auroraschleier nicht weiter verringert. Volltreffer ignorieren diesen Effekt. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch, Psychobeißer oder Auflockern getroffen wird. Hält 8 Runden an, wenn der Anwender ein Lichtlehm trägt. Schlägt fehl, wenn der Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "5 Runden: halber physischer Schaden fürs Team.", // NEEDS QC
		gen6: {
			desc: "5 Runden lang erleiden der Anwender und sein Team 0,5-fachen Schaden durch physische Angriffe, bzw. 0,66-fachen in Doppel- oder Dreierkämpfen. Volltreffer ignorieren diesen Effekt. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch oder Auflockern getroffen wird. Hält 8 Runden an, wenn der Anwender ein Lichtlehm trägt. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
		},
		gen4: {
			desc: "5 Runden lang erleiden der Anwender und sein Team 1/2 Schaden durch physische Angriffe, bzw. 2/3, wenn mehrere Pokémon auf der Seite des Anwenders im Kampf sind. Volltreffer ignorieren diesen Effekt. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch oder Auflockern getroffen wird. Hält 8 Runden an, wenn der Anwender ein Lichtlehm trägt. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
		},
		gen3: {
			desc: "5 Runden lang erleiden der Anwender und sein Team 1/2 Schaden durch physische Angriffe, bzw. 2/3, wenn mehrere Pokémon auf der Seite des Anwenders im Kampf sind. Volltreffer ignorieren diesen Effekt. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Durchbruch getroffen wird. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
		},
		gen2: {
			desc: "5 Runden lang wird die Verteidigung des Anwenders und seines Teams verdoppelt. Volltreffer ignorieren diesen Effekt. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
			shortDesc: "5 Runden: doppelte Verteidigung im Team.", // NEEDS QC
		},
		gen1: {
			desc: "Solange der Anwender im Kampf bleibt, wird seine Verteidigung verdoppelt, wenn er Schaden erleidet. Volltreffer ignorieren diesen Schutz. Dieser Effekt kann durch Dunkelnebel entfernt werden.", // NEEDS QC
			shortDesc: "Solange aktiv: doppelte Verteidigung.", // NEEDS QC
			start: "  {POKEMON} erhält Panzer!",
		},

		start: "  Reflektor stärkt {TEAM} gegen physische Attacken!",
		end: "  {TEAM:capitalize} verlieren den Schutz von Reflektor!",
	},
	reflecttype: {
		name: "Typenspiegel",
		// Official flavor text: "Anwender ahmt das Ziel nach und nimmt dabei dessen Typ an."
		desc: "Die Typen des Anwenders werden zu den aktuellen Typen des Ziels. Umfassen die aktuellen Typen des Ziels Typenlosigkeit und einen nicht hinzugefügten Typ, wird die Typenlosigkeit ignoriert. Umfassen sie Typenlosigkeit und einen durch Waldesfluch oder Halloween hinzugefügten Typ, wird die Typenlosigkeit als Typ Normal kopiert. Schlägt fehl, wenn der Anwender ein Arceus oder Amigento ist, wenn er terakristallisiert ist oder das Ziel ausschließlich typenlos ist.", // NEEDS QC
		shortDesc: "Nimmt die Typen des Ziels an.", // NEEDS QC
		gen8: {
			desc: "Die Typen des Anwenders werden zu den aktuellen Typen des Ziels. Umfassen die aktuellen Typen des Ziels Typenlosigkeit und einen nicht hinzugefügten Typ, wird die Typenlosigkeit ignoriert. Umfassen sie Typenlosigkeit und einen durch Waldesfluch oder Halloween hinzugefügten Typ, wird die Typenlosigkeit als Typ Normal kopiert. Schlägt fehl, wenn der Anwender ein Arceus oder Amigento ist oder das Ziel ausschließlich typenlos ist.", // NEEDS QC
		},
		gen6: {
			desc: "Die Typen des Anwenders werden zu den aktuellen Typen des Ziels. Schlägt fehl, wenn der Anwender ein Arceus ist.", // NEEDS QC
		},

		typeChange: "  {POKEMON} hat den Typ von {SOURCE} angenommen!",
	},
	refresh: {
		name: "Heilung",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Heilt die Verbrennung, Vergiftung oder Paralyse des Anwenders. Schlägt fehl, wenn der Anwender weder verbrannt noch vergiftet noch paralysiert ist.", // NEEDS QC
		shortDesc: "Heilt Verbrennung, Vergiftung oder Paralyse.", // NEEDS QC
	},
	relicsong: {
		name: "Urgesang",
		// Official flavor text: "Anwender greift mit Urgesang an, der gegnerische Pokémon im tiefsten Inneren anspricht. Diese schlafen eventuell ein."
		desc: "Hat eine Chance von 10 %, das Ziel einzuschläfern. Gelingt sie gegen mindestens ein Ziel und ist der Anwender ein Meloetta, nimmt es die Tanzform an, wenn es in der Gesangsform ist, oder die Gesangsform, wenn es in der Tanzform ist. Dieser Formwechsel findet nicht statt, wenn das Meloetta die Fähigkeit Rohe Gewalt hat. Die Tanzform kehrt zur Gesangsform zurück, wenn Meloetta das Feld verlässt.", // NEEDS QC
		shortDesc: "10 % Schlaf-Chance. Verwandelt Meloetta.", // NEEDS QC
	},
	rest: {
		name: "Erholung",
		// Official flavor text: "Anwender wird vollkommen geheilt, von allen Statusproblemen befreit und schläft die folgenden zwei Runden."
		desc: "Der Anwender schläft für die nächsten zwei Runden ein und stellt alle seine KP wieder her, wobei er von jedem Statusproblem geheilt wird. Schlägt fehl, wenn der Anwender volle KP hat, bereits schläft oder ein anderer Effekt Schlaf verhindert.", // NEEDS QC
		shortDesc: "Schläft 2 Runden; heilt KP und Status komplett.", // NEEDS QC
		gen2: {
			desc: "Der Anwender schläft für die nächsten zwei Runden ein und stellt alle seine KP wieder her, wobei er von jedem Statusproblem geheilt wird, selbst wenn er bereits schläft. Schlägt fehl, wenn der Anwender volle KP hat.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender schläft für die nächsten zwei Runden ein und stellt alle seine KP wieder her, wobei er von jedem Statusproblem geheilt wird. Die Statusabzüge durch Verbrennung oder Paralyse werden dadurch nicht entfernt. Schlägt fehl, wenn der Anwender volle KP hat.", // NEEDS QC
		},
	},
	retaliate: {
		name: "Heimzahlung",
		// Official flavor text: "Anwender nimmt Rache für einen besiegten Mitstreiter. Wurde in der vorigen Runde ein Mitstreiter besiegt, steigt die Stärke."
		desc: "Die Stärke wird verdoppelt, wenn ein Teammitglied des Anwenders in der letzten Runde kampfunfähig wurde.", // NEEDS QC
		shortDesc: "Doppelt, wenn zuletzt ein Partner besiegt wurde.", // NEEDS QC
	},
	return: {
		name: "Rückkehr",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke beträgt (Freundschaft des Anwenders × 2/5), abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Max. 102 Stärke bei maximaler Freundschaft.", // NEEDS QC
	},
	revelationdance: {
		name: "Wecktanz",
		// Official flavor text: "Der Anwender tanzt und greift dabei das Ziel mit voller Kraft an. Die Attacke hat denselben Typ wie das Pokémon, das sie einsetzt."
		desc: "Der Typ dieser Attacke hängt vom Erst-Typ des Anwenders ab. Ist der Erst-Typ Typenlosigkeit, nimmt diese Attacke seinen Zweit-Typ an, falls vorhanden, ansonsten den durch Waldesfluch oder Halloween hinzugefügten Typ. Diese Attacke ist typenlos, wenn der Anwender ausschließlich typenlos ist.", // NEEDS QC
		shortDesc: "Typ entspricht dem Erst-Typ des Anwenders.", // NEEDS QC
	},
	revenge: {
		name: "Vergeltung",
		// Official flavor text: "Schaden verdoppelt sich, wenn der Anwender in der Runde bereits Schaden durch das Ziel erlitten hat."
		desc: "Die Stärke wird verdoppelt, wenn der Anwender in dieser Runde vom Ziel getroffen wurde.", // NEEDS QC
		shortDesc: "Doppelte Stärke, wenn das Ziel den Anwender verletzte.", // NEEDS QC
		gen4: {
			desc: "Die Stärke wird verdoppelt, wenn der Anwender in dieser Runde von einem Pokémon auf der aktuellen Position des Ziels getroffen wurde.", // NEEDS QC
		},
		gen3: {
			desc: "Der Schaden wird verdoppelt, wenn der Anwender in dieser Runde von einem Pokémon auf der aktuellen Position des Ziels getroffen wurde und dieses Pokémon den Anwender zuletzt getroffen hat.", // NEEDS QC
			shortDesc: "2x Schaden, wenn der Anwender getroffen wurde.", // NEEDS QC
		},
	},
	reversal: {
		name: "Gegenschlag",
		// Official flavor text: "Richtet mehr Schaden an, wenn eigene KP niedrig sind."
		desc: "Die Stärke beträgt 20 bei X zwischen 33 und 48, 40 bei X zwischen 17 und 32, 80 bei X zwischen 10 und 16, 100 bei X zwischen 5 und 9, 150 bei X zwischen 2 und 4 und 200 bei X gleich 0 oder 1, wobei X = (aktuelle KP des Anwenders × 48 / maximale KP des Anwenders), abgerundet.", // NEEDS QC
		shortDesc: "Je weniger KP der Anwender hat, desto stärker.", // NEEDS QC
		gen4: {
			desc: "Die Stärke beträgt 20, wenn X 43–48 ist, 40 bei 22–42, 80 bei 13–21, 100 bei 6–12, 150 bei 2–5 und 200 bei 0 oder 1, wobei X (aktuelle KP des Anwenders × 64 ÷ maximale KP des Anwenders) ist, abgerundet.", // NEEDS QC
		},
		gen3: {
			desc: "Die Stärke beträgt 20 bei X zwischen 33 und 48, 40 bei X zwischen 17 und 32, 80 bei X zwischen 10 und 16, 100 bei X zwischen 5 und 9, 150 bei X zwischen 2 und 4 und 200 bei X gleich 0 oder 1, wobei X = (aktuelle KP des Anwenders × 48 / maximale KP des Anwenders), abgerundet.", // NEEDS QC
		},
		gen2: {
			desc: "Die Stärke beträgt 20, wenn X 33–48 ist, 40 bei 17–32, 80 bei 10–16, 100 bei 5–9, 150 bei 2–4 und 200 bei 0 oder 1, wobei X (aktuelle KP des Anwenders × 48 ÷ maximale KP des Anwenders) ist, abgerundet. Diese Attacke hat keine Schadensstreuung und kann kein Volltreffer sein.", // NEEDS QC
		},
	},
	revivalblessing: {
		name: "Vitalsegen",
		desc: "Ein kampfunfähiges Teammitglied wird gewählt und mit der Hälfte seiner maximalen KP wiederbelebt, abgerundet. Schlägt fehl, wenn kein Teammitglied kampfunfähig ist.", // NEEDS QC
		shortDesc: "Belebt ein Teammitglied mit halben KP wieder.", // NEEDS QC

		heal: "  {POKEMON} ist wieder fit und kampfbereit!",
	},
	risingvoltage: {
		name: "Hochspannung",
		// Official flavor text: "Der Anwender greift mit aus dem Boden aufsteigender Elektrizität an. Die Stärke der Attacke wird verdoppelt, wenn beim Gegner ein Elektrofeld aktiv ist."
		desc: "Liegt ein Elektrofeld vor und ist das Ziel am Boden, wird die Stärke dieser Attacke verdoppelt.", // NEEDS QC
		shortDesc: "Doppelt gegen Ziele am Boden im Elektrofeld.", // NEEDS QC
	},
	roar: {
		name: "Brüller",
		// Official flavor text: "Verjagt das Ziel und ersetzt es durch ein anderes Pokémon. Beendet den Kampf in der Wildnis."
		desc: "Das Ziel wird gezwungen, das Feld zu verlassen, und durch einen zufällig gewählten kampffähigen Mitstreiter ersetzt. Schlägt fehl, wenn das Ziel das letzte kampffähige Pokémon seines Teams ist, Verwurzler eingesetzt hat oder die Fähigkeit Saugnapf hat.", // NEEDS QC
		shortDesc: "Tauscht das Ziel gegen einen zufälligen Mitstreiter.", // NEEDS QC
		gen4: {
			desc: "Das Ziel wird gezwungen, das Feld zu verlassen, und durch einen zufällig gewählten kampffähigen Mitstreiter ersetzt. Schlägt fehl, wenn das Ziel das letzte kampffähige Pokémon seines Teams ist, Verwurzler eingesetzt hat oder die Fähigkeit Saugnapf hat, oder wenn das Level des Anwenders niedriger als das des Ziels ist und X × (Level des Anwenders + Level des Ziels) / 256 + 1 kleiner oder gleich (Level des Ziels / 4) ist, abgerundet, wobei X eine Zufallszahl zwischen 0 und 255 ist.", // NEEDS QC
		},
		gen2: {
			desc: "Das Ziel wird gezwungen, das Feld zu verlassen, und durch einen zufällig gewählten kampffähigen Mitstreiter ersetzt. Schlägt fehl, wenn das Ziel das letzte kampffähige Pokémon seines Teams ist oder der Anwender vor dem Ziel handelt.", // NEEDS QC
		},
		gen1: {
			desc: "Kein Nutzen im Kampf.", // NEEDS QC
			shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC
		},
	},
	roaroftime: {
		name: "Zeitenlärm",
		// Official flavor text: "Anwender attackiert mit einer Kraft, die selbst die Zeit verzerrt. In der nächsten Runde muss er ruhen."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
	},
	rockblast: {
		name: "Felswurf",
		// Official flavor text: "Wirft zwei- bis fünfmal in Folge Felsblöcke auf das Ziel."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
	},
	rockclimb: {
		name: "Kraxler",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 20 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "20 % Chance auf Verwirrung.", // NEEDS QC
	},
	rockpolish: {
		name: "Steinpolitur",
		// Official flavor text: "Anwender reduziert so gut wie möglich den Luftwiderstand. Erhöht den Initiative-Wert stark."
		desc: "Erhöht die Initiative des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Initiative des Anwenders um 2 Stufen.", // NEEDS QC
	},
	rockslide: {
		name: "Steinhagel",
		// Official flavor text: "Schleudert riesige Felsen auf gegnerische Pokémon, die eventuell zurückschrecken."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
		gen1: {
			desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
			shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		},
		gen2: {
			shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
		},
	},
	rocksmash: {
		name: "Zertrümmerer",
		// Official flavor text: "Diese steinbrechende Attacke kann den Verteidigungs-Wert des Zieles senken."
		desc: "Hat eine Chance von 50 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "50 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
	},
	rockthrow: {
		name: "Steinwurf",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	rocktomb: {
		name: "Felsgrab",
		// Official flavor text: "Angriff mit Felsen. Bei Erfolg wird der Initiative-Wert des Zieles gesenkt."
		desc: "Hat eine Chance von 100 %, die Initiative des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Init. des Ziels.", // NEEDS QC
	},
	rockwrecker: {
		name: "Felswerfer",
		// Official flavor text: "Anwender wirft einen riesigen Felsen auf das Ziel. In der nächsten Runde muss der Anwender ruhen."
		desc: "Gelingt diese Attacke, muss sich der Anwender in der nächsten Runde erholen und kann keine Attacke wählen.", // NEEDS QC
		shortDesc: "Der Anwender muss in der nächsten Runde aussetzen.", // NEEDS QC
	},
	roleplay: {
		name: "Rollenspiel",
		// Official flavor text: "Ahmt das Ziel nach und kopiert seine Fähigkeit."
		desc: "Die Fähigkeit des Anwenders wird zu der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Wandel, Trance-Modus oder Superwechsel ist oder bereits der des Ziels entspricht, oder wenn die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kommandant, Kostümspuk, Erinnerungskraft, Pflanzengabe, Prognose, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Giftpuppenspiel, Scharwandel, Chemiekraft, Paläosynthese, Quantenantrieb, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Panzer, Tera-Wandel, Teraforming Null, Erfassen, Wunderwache, Trance-Modus oder Superwechsel ist.", // NEEDS QC
		shortDesc: "Der Anwender kopiert die Fähigkeit des Ziels.", // NEEDS QC
		gen8: {
			desc: "Die Fähigkeit des Anwenders wird zu der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus ist oder bereits der des Ziels entspricht, oder wenn die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Würggeschoss, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen, Wunderwache oder Trance-Modus ist.", // NEEDS QC
		},
		gen7: {
			desc: "Die Fähigkeit des Anwenders wird zu der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders Freundschaftsakt, Dauerschlaf, Kostümspuk, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus ist oder bereits der des Ziels entspricht, oder wenn die Fähigkeit des Ziels Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen, Wunderwache oder Trance-Modus ist.", // NEEDS QC
		},
		gen6: {
			desc: "Die Fähigkeit des Anwenders wird zu der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders Variabilität oder Taktikwechsel ist oder bereits der des Ziels entspricht, oder wenn die Fähigkeit des Ziels Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Taktikwechsel, Erfassen, Wunderwache oder Trance-Modus ist.", // NEEDS QC
		},
		gen5: {
			desc: "Die Fähigkeit des Anwenders wird zu der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders Variabilität ist oder bereits der des Ziels entspricht, oder wenn die Fähigkeit des Ziels Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Erfassen, Wunderwache oder Trance-Modus ist.", // NEEDS QC
		},
		gen4: {
			desc: "Die Fähigkeit des Anwenders wird zu der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders Variabilität ist oder bereits der des Ziels entspricht, wenn die Fähigkeit des Ziels Variabilität oder Wunderwache ist oder wenn der Anwender einen Platinum-Orb trägt.", // NEEDS QC
		},
		gen3: {
			desc: "Die Fähigkeit des Anwenders wird zu der des Ziels. Schlägt fehl, wenn die Fähigkeit des Ziels Wunderwache ist.", // NEEDS QC
		},

		changeAbility: "  {POKEMON} kopiert {ABILITY} von {SOURCE}!",
	},
	rollingkick: {
		name: "Fegekick",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	rollout: {
		name: "Walzer",
		// Official flavor text: "Attacke, die fünf Runden dauert. Mit jedem Treffer steigt die Stärke."
		desc: "Gelingt diese Attacke, ist der Anwender an sie gebunden und kann keine andere Aktion ausführen, bis sie verfehlt, 5 Runden vergangen sind oder der Angriff nicht mehr eingesetzt werden kann. Die Stärke verdoppelt sich mit jedem Treffer und noch einmal, wenn der Anwender zuvor Einigler eingesetzt hat. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt.", // NEEDS QC
		shortDesc: "Stärke verdoppelt sich je Treffer. 5 Runden lang.", // NEEDS QC
		gen7: {
			desc: "Gelingt diese Attacke, ist der Anwender an sie gebunden und kann keine andere Attacke einsetzen, bis sie verfehlt, 5 Runden vergangen sind oder die Attacke nicht eingesetzt werden kann. Die Stärke verdoppelt sich mit jedem Treffer dieser Attacke und noch einmal, wenn der Anwender zuvor Einigler eingesetzt hat. Wird diese Attacke durch Schlafrede eingesetzt, wird sie eine Runde lang eingesetzt. Trifft diese Attacke während des Effekts einen aktiven Kostümspuk-Schutz, pausiert der Stärkemultiplikator, der Rundenzähler jedoch nicht, wodurch der Multiplikator nach Ende des Effekts auf die nächste Attacke des Anwenders angewendet werden kann.", // NEEDS QC
		},
		gen6: {
			desc: "Gelingt diese Attacke, ist der Anwender an sie gebunden und kann keine andere Aktion ausführen, bis sie verfehlt, 5 Runden vergangen sind oder der Angriff nicht mehr eingesetzt werden kann. Die Stärke verdoppelt sich mit jedem Treffer und noch einmal, wenn der Anwender zuvor Einigler eingesetzt hat. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt.", // NEEDS QC
		},
	},
	roost: {
		name: "Ruheort",
		// Official flavor text: "Anwender landet und ruht sich aus. KP des Anwenders werden um 50 % der maximalen KP aufgefüllt."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet. Ist der Anwender nicht terakristallisiert, verlieren Anwender vom Typ Flug bis zum Ende der Runde ihren Typ Flug, und Anwender mit reinem Typ Flug werden zum Typ Normal. Bewirkt nichts, wenn der Anwender volle KP hat.", // NEEDS QC
		shortDesc: "Heilt halbe KP; Flug-Typ entfällt diese Runde.", // NEEDS QC
		gen8: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet. Bis zum Ende der Runde verlieren Anwender vom Typ Flug ihren Typ Flug, und Anwender mit reinem Typ Flug werden zum Typ Normal. Bewirkt nichts, wenn der Anwender volle KP hat.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, abgerundet. Bis zum Ende der Runde verlieren Anwender vom Typ Flug ihren Typ Flug, und Anwender mit reinem Typ Flug werden typenlos. Bewirkt nichts, wenn der Anwender volle KP hat.", // NEEDS QC
		},

		start: "  ({POKEMON} verliert in dieser Runde den Typ Flug.)", // NEEDS QC
	},
	rototiller: {
		name: "Pflüger",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Erhöht den Angriff und den Spezial-Angriff aller Pokémon vom Typ Pflanze am Boden um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Ang./Sp.-Ang. für Pflanzen-Typen am Boden.", // NEEDS QC
	},
	round: {
		name: "Kanon",
		// Official flavor text: "Angriff mit Gesang. Singt der Anwender mit allen im Kanon, steigt die Stärke."
		desc: "Haben andere Pokémon im Kampf diese Attacke in dieser Runde gewählt, handeln sie direkt nach dem Anwender in Initiative-Reihenfolge, und die Stärke dieser Attacke beträgt für jeden von ihnen 120.", // NEEDS QC
		shortDesc: "Doppelt, wenn zuvor jemand Kanon einsetzte.", // NEEDS QC
	},
	ruination: {
		name: "Verderben",
		desc: "Fügt dem Ziel Schaden in Höhe der Hälfte seiner aktuellen KP zu, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "Schaden in Höhe der halben aktuellen KP des Ziels.", // NEEDS QC
	},
	sacredfire: {
		name: "Läuterfeuer",
		// Official flavor text: "Mystische Feuer-Attacke, durch die das Ziel eventuell Verbrennungen erleidet."
		desc: "Hat eine Chance von 50 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "50 % Chance auf Verbrennung. Taut den Anwender auf.", // NEEDS QC
	},
	sacredsword: {
		name: "Sanctoklinge",
		// Official flavor text: "Schneideangriff mit langem Horn. Richtet unabhängig von den Statusveränderungen des Zieles Schaden an."
		desc: "Ignoriert die Statusveränderungen des Ziels, einschließlich Fluchtwert.", // NEEDS QC
		shortDesc: "Ignoriert die Statusveränderungen des Ziels.", // NEEDS QC
	},
	safeguard: {
		name: "Bodyguard",
		// Official flavor text: "Team des Anwenders ist fünf Runden lang vor Statusproblemen geschützt."
		desc: "5 Runden lang können der Anwender und sein Team weder Statusprobleme noch Verwirrung durch andere Pokémon erleiden. Pokémon auf der Seite des Anwenders können von Gähner nicht betroffen werden, aber durch dessen Effekt einschlafen. Der Effekt endet für die Seite des Anwenders, wenn er oder ein Mitstreiter von Auflockern getroffen wird. Schlägt fehl, wenn der Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "5 Runden: Schützt das Team vor Statusproblemen.", // NEEDS QC
		gen3: {
			desc: "5 Runden lang können der Anwender und sein Team weder Statusprobleme noch Verwirrung durch andere Pokémon erleiden. Pokémon auf der Seite des Anwenders können von Gähner nicht betroffen werden, aber durch dessen Effekt einschlafen. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
		},
		gen2: {
			desc: "5 Runden lang können der Anwender und sein Team weder Statusprobleme noch Verwirrung durch andere Pokémon erleiden. Während des Effekts verwirren Wutanfall, Fuchtler und Blättertanz den Anwender nicht. Schlägt fehl, wenn der Effekt auf der Seite des Anwenders bereits aktiv ist.", // NEEDS QC
		},

		start: "  {TEAM:capitalize} werden von einem Schleier umhüllt!",
		end: "  Der mystische Schleier, der {TEAM} umgab, hat sich gelüftet!",
		block: "  {POKEMON} wird durch Bodyguard geschützt!",
	},
	saltcure: {
		name: "Pökelsalz",
		desc: "Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/4 bei Zielen vom Typ Stahl oder Wasser), abgerundet. Der Effekt endet, wenn das Ziel den Kampf verlässt.", // NEEDS QC
		shortDesc: "1/8 der max. KP pro Runde; 1/4 bei Stahl/Wasser.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},

		start: "  {POKEMON} wurde eingepökelt!",
		damage: "  {POKEMON} wurde durch Pökelsalz verletzt!",
	},
	sandattack: {
		name: "Sandwirbel",
		// Official flavor text: "Senkt Genauigkeit des Zieles, indem ihm Sand ins Gesicht geworfen wird."
		desc: "Senkt die Genauigkeit des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Genauigkeit des Ziels um eine Stufe.", // NEEDS QC
	},
	sandsearstorm: {
		name: "Wüstenorkan",
		desc: "Hat eine Chance von 20 %, das Ziel zu verbrennen. Ist das Wetter Strömender Regen oder Regen, prüft diese Attacke keine Genauigkeit. Gegen ein Pokémon mit Allzweckschirm bleibt die Genauigkeit bei 80 %.", // NEEDS QC
		shortDesc: "20 % Verbrennung. Trifft bei Regen immer.", // NEEDS QC
	},
	sandstorm: {
		name: "Sandsturm",
		// Official flavor text: "Sandsturm für fünf Runden. Schadet Pokémon aller Typen außer Gestein, Boden und Stahl. Erhöht die Spezial-Verteidigung von Gesteins-Pokémon."
		desc: "5 Runden lang tobt ein Sandsturm. Am Ende jeder Runde außer der letzten verlieren alle Pokémon im Kampf 1/16 ihrer maximalen KP, abgerundet, außer sie sind vom Typ Boden, Gestein oder Stahl oder haben die Fähigkeit Magieschild, Partikelschutz, Sandgewalt, Sandscharrer oder Sandschleier. Während des Effekts wird die Spezial-Verteidigung von Pokémon vom Typ Gestein mit 1,5 multipliziert, wenn sie einen speziellen Angriff erleiden. Hält 8 Runden an, wenn der Anwender einen Glattbrocken trägt. Schlägt fehl, wenn bereits ein Sandsturm tobt.", // NEEDS QC
		shortDesc: "5 Runden Sandsturm; Gestein: Sp.-Vert. x1,5.", // NEEDS QC
		gen4: {
			desc: "5 Runden lang tobt ein Sandsturm. Am Ende jeder Runde außer der letzten verlieren alle Pokémon im Kampf 1/16 ihrer maximalen KP, abgerundet, außer sie sind vom Typ Boden, Gestein oder Stahl oder haben die Fähigkeit Magieschild oder Sandschleier. Während des Effekts wird die Spezial-Verteidigung von Pokémon vom Typ Gestein mit 1,5 multipliziert, wenn sie einen speziellen Angriff erleiden. Hält 8 Runden an, wenn der Anwender einen Glattbrocken trägt. Schlägt fehl, wenn bereits ein Sandsturm tobt.", // NEEDS QC
		},
		gen3: {
			desc: "5 Runden lang tobt ein Sandsturm. Am Ende jeder Runde außer der letzten verlieren alle Pokémon im Kampf 1/16 ihrer maximalen KP, abgerundet, außer sie sind vom Typ Boden, Gestein oder Stahl oder haben die Fähigkeit Sandschleier. Schlägt fehl, wenn bereits ein Sandsturm tobt.", // NEEDS QC
			shortDesc: "5 Runden lang tobt ein Sandsturm.", // NEEDS QC
		},
		gen2: {
			desc: "5 Runden lang tobt ein Sandsturm. Am Ende jeder Runde außer der letzten verlieren alle Pokémon im Kampf 1/8 ihrer maximalen KP, abgerundet, außer sie sind vom Typ Boden, Gestein oder Stahl. Schlägt fehl, wenn bereits ein Sandsturm tobt.", // NEEDS QC
		},
	},
	sandtomb: {
		name: "Sandgrab",
		// Official flavor text: "Das Ziel leidet für vier bis fünf Runden in einer Sandhose."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen7: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP (1/8 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang (immer fünf mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
			shortDesc: "Fängt und schädigt das Ziel 2-5 Runden lang.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es Stafette einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},

		start: "  {POKEMON} wurde durch Sandgrab gefangen!",
	},
	sappyseed: {
		name: "Sprießbomben",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Diese Attacke ruft Egelsamen auf dem Ziel hervor.", // NEEDS QC
		shortDesc: "Wirkt wie Egelsamen.", // NEEDS QC
	},
	savagespinout: {
		name: "Wirbelnder Insektenhieb",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	scald: {
		name: "Siedewasser",
		// Official flavor text: "Heizt dem Ziel mit einem Schwall siedend heißen Kochwassers ein. Das Ziel erleidet dabei eventuell Verbrennungen."
		desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen. Das Ziel wird aufgetaut, wenn es eingefroren war.", // NEEDS QC
		shortDesc: "30 % Chance auf Verbrennung. Taut das Ziel auf.", // NEEDS QC
		gen5: {
			desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen.", // NEEDS QC
			shortDesc: "30 % Chance auf Verbrennung.", // NEEDS QC
		},
	},
	scaleshot: {
		name: "Schuppenschuss",
		// Official flavor text: "Der Anwender greift das Ziel zwei- bis fünfmal hintereinander mit Schuppen-Geschossen an. Erhöht die eigene Initiative, aber senkt die Verteidigung."
		desc: "Trifft zwei- bis fünfmal. Senkt nach dem letzten Treffer die Verteidigung des Anwenders um eine Stufe und erhöht seine Initiative um eine Stufe. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal. Danach -1 Vert., +1 Init.", // NEEDS QC
	},
	scaryface: {
		name: "Grimasse",
		// Official flavor text: "Jagt dem Ziel mit einer Grimasse Angst ein. Dessen Initiative-Wert sinkt stark."
		desc: "Senkt die Initiative des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Initiative des Ziels um 2 Stufen.", // NEEDS QC
	},
	scorchingsands: {
		name: "Brandsand",
		// Official flavor text: "Der Anwender greift das Ziel mit brennend heißem Sand an und fügt ihm eventuell Verbrennungen zu."
		desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen. Das Ziel wird aufgetaut, wenn es eingefroren war.", // NEEDS QC
		shortDesc: "30 % Chance auf Verbrennung. Taut das Ziel auf.", // NEEDS QC
	},
	scratch: {
		name: "Kratzer",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	screech: {
		name: "Kreideschrei",
		// Official flavor text: "Stößt einen Schrei aus, um die Verteidigung des Zieles stark zu senken."
		desc: "Senkt die Verteidigung des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Verteidigung des Ziels um 2 Stufen.", // NEEDS QC
	},
	searingshot: {
		name: "Flammenball",
		// Official flavor text: "Anwender greift alle Pokémon im Umkreis mit tiefroten Flammen an. Ziele erleiden eventuell Verbrennungen."
		desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "30 % Chance, Nachbarn zu verbrennen.", // NEEDS QC
	},
	searingsunrazesmash: {
		name: "Schmetternde Sonnenwalze",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Diese Attacke und ihre Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		shortDesc: "Ignoriert die Fähigkeiten anderer Pokémon.", // NEEDS QC
	},
	secretpower: {
		name: "Geheimpower",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 30 %, je nach Untergrund einen Sekundäreffekt auszulösen: Paralyse auf normalem Untergrund, Paralyse auf einem Elektrofeld, Senkung des Spezial-Angriffs um eine Stufe auf einem Nebelfeld, Schlaf auf einem Grasfeld und Senkung der Initiative um eine Stufe auf einem Psychofeld.", // NEEDS QC
		shortDesc: "Effekt je nach Feld (Standard: 30 % Paralyse).", // NEEDS QC
		gen6: {
			desc: "Hat eine Chance von 30 %, je nach Untergrund einen Sekundäreffekt auszulösen: Paralyse auf normalem Wi-Fi-Untergrund, Paralyse auf einem Elektrofeld, Senkung des Spezial-Angriffs um eine Stufe auf einem Nebelfeld und Schlaf auf einem Grasfeld.", // NEEDS QC
		},
		gen5: {
			desc: "Hat eine Chance von 30 %, je nach Untergrund einen Sekundäreffekt auszulösen: Senkung der Genauigkeit um eine Stufe auf normalem Wi-Fi-Untergrund. Die Chance auf den Sekundäreffekt wird nicht von der Fähigkeit Edelmut beeinflusst.", // NEEDS QC
			shortDesc: "Effekt je nach Untergrund. (30 %: Genauigkeit -1)", // NEEDS QC
		},
		gen4: {
			desc: "Hat eine Chance von 30 %, je nach Untergrund einen Sekundäreffekt auszulösen: Paralyse auf normalem Wi-Fi-Untergrund.", // NEEDS QC
			shortDesc: "Effekt je nach Feld (Standard: 30 % Paralyse).", // NEEDS QC
		},
	},
	secretsword: {
		name: "Mystoschwert",
		// Official flavor text: "Schneideangriff mit dem langen Horn des Anwenders. Die mysteriöse Kraft aus dem Horn erzeugt physischen Schaden."
		desc: "Fügt dem Ziel Schaden anhand seiner Verteidigung statt seiner Spezial-Verteidigung zu.", // NEEDS QC
		shortDesc: "Trifft die Verteidigung des Ziels statt der Sp.-Vert.", // NEEDS QC
	},
	seedbomb: {
		name: "Samenbomben",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	seedflare: {
		name: "Schocksamen",
		// Official flavor text: "Anwender erzeugt eine Schockwelle. Spezial-Verteidigung des Zieles wird eventuell stark gesenkt."
		desc: "Hat eine Chance von 40 %, die Spezial-Verteidigung des Ziels um 2 Stufen zu senken.", // NEEDS QC
		shortDesc: "40 % Chance auf -2 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	seismictoss: {
		name: "Geowurf",
		// Official flavor text: "Ziel wird mit der Kraft der Gravitation umgeworfen. Richtet Schaden gemäß dem Level des Anwenders an."
		desc: "Fügt dem Ziel Schaden in Höhe des Levels des Anwenders zu.", // NEEDS QC
		shortDesc: "Schaden in Höhe des Levels des Anwenders.", // NEEDS QC
		gen1: {
			desc: "Fügt dem Ziel Schaden in Höhe des Levels des Anwenders zu. Diese Attacke ignoriert Typ-Immunität.", // NEEDS QC
			shortDesc: "Schaden = Level. Trifft auch Geist-Pokémon.", // NEEDS QC
		},
	},
	selfdestruct: {
		name: "Finale",
		// Official flavor text: "Der Anwender verursacht eine Explosion, mit der er bei allen Pokémon im Umkreis Riesenschaden anrichtet und selbst kampfunfähig wird."
		desc: "Der Anwender wird nach dem Einsatz kampfunfähig, selbst wenn diese Attacke mangels Ziel fehlschlägt. Diese Attacke kann nicht ausgeführt werden, wenn ein Pokémon im Kampf die Fähigkeit Feuchtigkeit hat.", // NEEDS QC
		shortDesc: "Trifft Nachbarn. Der Anwender wird besiegt.", // NEEDS QC
		gen4: {
			desc: "Der Anwender wird nach dem Einsatz kampfunfähig, außer diese Attacke hat kein Ziel. Bei der Schadensberechnung wird die Verteidigung des Ziels halbiert. Diese Attacke wird nicht ausgeführt, wenn ein Pokémon mit der Fähigkeit Feuchtigkeit im Kampf ist.", // NEEDS QC
			shortDesc: "Halbiert Vert. des Ziels beim Rechnen. K.O. danach.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender wird nach dem Einsatz kampfunfähig. Bei der Schadensberechnung wird die Verteidigung des Ziels halbiert. Diese Attacke wird nicht ausgeführt, wenn ein Pokémon mit der Fähigkeit Feuchtigkeit im Kampf ist.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender wird nach dem Einsatz kampfunfähig. Bei der Schadensberechnung wird die Verteidigung des Ziels halbiert.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender wird nach dem Einsatz kampfunfähig, außer der Delegator des Ziels wurde durch den Schaden zerstört. Bei der Schadensberechnung wird die Verteidigung des Ziels halbiert.", // NEEDS QC
		},
	},
	shadowball: {
		name: "Spukball",
		// Official flavor text: "Bewirft das Ziel mit einem gruseligen Ball und senkt eventuell dessen Spezial-Verteidigung."
		desc: "Hat eine Chance von 20 %, die Spezial-Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "20 % Chance auf -1 Sp.-Vert. des Ziels.", // NEEDS QC
	},
	shadowbone: {
		name: "Schattenknochen",
		// Official flavor text: "Der Anwender greift das Ziel mit einem Knochen an, in dem eine Seele haust. Senkt eventuell die Verteidigung des Zieles."
		desc: "Hat eine Chance von 20 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "20 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
	},
	shadowclaw: {
		name: "Dunkelklaue",
		// Official flavor text: "Greift das Ziel mit einer scharfen Klaue aus Schatten an. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	shadowforce: {
		name: "Schemenkraft",
		// Official flavor text: "Anwender verschwindet in Runde 1 und attackiert in Runde 2. Trifft auch, wenn sich das Ziel selbst schützt."
		desc: "Gelingt diese Attacke, durchbricht sie für diese Runde die Effekte von Bunker, Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Verschwindet, trifft in Runde 2. Bricht Schutz.", // NEEDS QC
		gen6: {
			desc: "Gelingt diese Attacke, durchbricht sie für diese Runde die Effekte von Scanner, Königsschild, Schutzschild oder Schutzstacheln des Ziels, sodass andere Pokémon es normal angreifen können. Ist die Seite des Ziels durch Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen und andere Pokémon können die Seite des Ziels normal angreifen. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel im Kampf Komprimator eingesetzt hat.", // NEEDS QC
		},
		gen5: {
			desc: "Gelingt diese Attacke, durchbricht sie für diese Runde die Effekte von Scanner oder Schutzschild des Ziels, sodass andere Pokémon es normal angreifen können. Ist das Ziel ein Gegner und seine Seite durch Rapidschutz oder Rundumschutz geschützt, wird auch dieser Schutz für diese Runde durchbrochen und andere Pokémon können die gegnerische Seite normal angreifen. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde weicht der Anwender allen Attacken aus. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},

		activate: "  Es durchbrach den Schutz von {TARGET}!",
		prepare: "{POKEMON} verschwindet augenblicklich!",
	},
	shadowpunch: {
		name: "Finsterfaust",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	shadowsneak: {
		name: "Schattenstoß",
		// Official flavor text: "Bei dieser Erstschlag-Attacke erweitert der Anwender seinen Schatten und greift das Ziel von hinten an."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
	},
	shadowstrike: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Hat eine Chance von 50 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "50 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
	},
	sharpen: {
		name: "Schärfer",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Erhöht den Angriff des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "Erhöht Angriff des Anwenders um eine Stufe.", // NEEDS QC
	},
	shatteredpsyche: {
		name: "Psycho-Schmetterschlag",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	shedtail: {
		name: "Schwanzabwurf",
		desc: "Der Anwender opfert die Hälfte seiner maximalen KP, aufgerundet, um einen Delegator mit 1/4 seiner maximalen KP zu erschaffen, abgerundet. Der Anwender wird gegen ein anderes Teammitglied ausgewechselt, das den Delegator erbt. Schlägt fehl, wenn der Anwender kampfunfähig würde oder kein anderes Teammitglied kampffähig ist.", // NEEDS QC
		shortDesc: "Kostet halbe KP; wechselt aus, übergibt Delegator.", // NEEDS QC

		start: "  {POKEMON} wirft seinen Schwanz ab, um eine Ablenkung zu schaffen!",
		alreadyStarted: "#substitute",
		fail: "#substitute",
	},
	sheercold: {
		name: "Eiseskälte",
		// Official flavor text: "Diese Attacke führt beim Ziel sofort zum K.O. Wird sie von einem Pokémon eingesetzt, das nicht dem Typ Eis angehört, trifft sie seltener."
		desc: "Fügt dem Ziel Schaden in Höhe seiner maximalen KP zu. Ignoriert Genauigkeits- und Fluchtwert-Modifikatoren. Die Genauigkeit dieses Angriffs beträgt (Level des Anwenders - Level des Ziels + X) %, wobei X 30 beträgt, wenn der Anwender vom Typ Eis ist, sonst 20, und er schlägt fehl, wenn das Ziel ein höheres Level hat. Pokémon vom Typ Eis und solche mit der Fähigkeit Robustheit sind immun.", // NEEDS QC
		shortDesc: "K.O.-Attacke; wirkungslos gegen Eis-Typen.", // NEEDS QC
		gen6: {
			desc: "Fügt dem Ziel Schaden in Höhe seiner maximalen KP zu. Ignoriert Genauigkeits- und Fluchtwert-Modifikatoren. Die Genauigkeit dieses Angriffs beträgt (Level des Anwenders - Level des Ziels + 30) %, und er schlägt fehl, wenn das Ziel ein höheres Level hat. Pokémon mit der Fähigkeit Robustheit sind immun.", // NEEDS QC
			shortDesc: "K.O. mit einem Treffer. Nicht bei höherem Ziel-Level.", // NEEDS QC
		},
	},
	shellsidearm: {
		name: "Muschelwaffe",
		// Official flavor text: "Je nachdem, was höher ausfällt, richtet diese Attacke entweder physischen oder Spezial-Schaden an. Das Ziel wird eventuell vergiftet."
		desc: "Hat eine Chance von 20 %, das Ziel zu vergiften. Diese Attacke wird zu einem physischen Kontaktangriff, wenn der Wert ((((2 × Level des Anwenders / 5 + 2) × 90 × X) / Y) / 50), wobei X der Angriff des Anwenders und Y die Verteidigung des Ziels ist, höher ist als derselbe Wert mit X als Spezial-Angriff des Anwenders und Y als Spezial-Verteidigung des Ziels. Außer Statusveränderungen werden dabei keine Modifikatoren berücksichtigt. Sind beide Werte gleich, wird die Schadenskategorie zufällig gewählt.", // NEEDS QC
		shortDesc: "20 % Gift. Physisch, wenn dadurch stärker.", // NEEDS QC
	},
	shellsmash: {
		name: "Hausbruch",
		// Official flavor text: "Anwender zerbricht seine Schale und senkt seine Verteidigung und Spezial-Verteidigung, aber dafür steigen Angriff, Spezial-Angriff und Initiative stark."
		desc: "Senkt die Verteidigung und die Spezial-Verteidigung des Anwenders um eine Stufe. Erhöht seinen Angriff, seinen Spezial-Angriff und seine Initiative um 2 Stufen.", // NEEDS QC
		shortDesc: "-1 Vert./Sp.-Vert.; +2 Ang., Sp.-Ang. und Init.", // NEEDS QC
	},
	shelltrap: {
		name: "Panzerfalle",
		// Official flavor text: "Der Anwender legt eine Panzerfalle. Wird er von einer physischen Attacke getroffen, explodiert die Falle und fügt gegnerischen Pokémon Schaden zu."
		desc: "Schlägt fehl, wenn der Anwender in dieser Runde nicht von einem physischen Angriff eines Gegners getroffen wird, bevor er diese Attacke ausführen kann. Wurde der Anwender getroffen und ist nicht kampfunfähig, greift er direkt nach dem Treffer an, und der Effekt endet. Wurde der Sekundäreffekt des physischen Angriffs durch die Fähigkeit Rohe Gewalt entfernt, zählt er für diesen Effekt nicht.", // NEEDS QC
		shortDesc: "Wirkt nur nach vorherigem physischem Treffer.", // NEEDS QC

		start: "  {POKEMON} hat eine Panzerfalle gelegt!",
		prepare: "  {POKEMON} hat eine Panzerfalle gelegt!",
		cant: "Die Panzerfalle von {POKEMON} wurde nicht ausgelöst!",
	},
	shelter: {
		name: "Refugium",
		desc: "Erhöht die Verteidigung des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Verteidigung des Anwenders um 2 Stufen.", // NEEDS QC
	},
	shiftgear: {
		name: "Gangwechsel",
		// Official flavor text: "Durch Drehen der Zahnräder erhöht sich nicht nur der Angriffs-Wert, sondern auch die Initiative des Anwenders stark."
		desc: "Erhöht die Initiative des Anwenders um 2 Stufen und seinen Angriff um eine Stufe.", // NEEDS QC
		shortDesc: "+2 Initiative und +1 Angriff.", // NEEDS QC
	},
	shockwave: {
		name: "Schockwelle",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	shoreup: {
		name: "Sandsammler",
		// Official flavor text: "KP des Anwenders werden um 50 % der maximalen KP aufgefüllt. Tobt ein Sandsturm, werden noch mehr KP aufgefüllt."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 abgerundet. Tobt ein Sandsturm, stellt er stattdessen 2/3 seiner maximalen KP wieder her, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt halbe max. KP; 2/3 bei Sandsturm.", // NEEDS QC
	},
	signalbeam: {
		name: "Ampelleuchte",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 10 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "10 % Chance auf Verwirrung.", // NEEDS QC
	},
	silktrap: {
		name: "Fadenfalle",
		desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke zu treffen versuchen, verlieren eine Initiative-Stufe. Nicht schädigende Attacken durchdringen diesen Schutz. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Schützt vor Angriffen. Kontakt: -1 Initiative.", // NEEDS QC
	},
	silverwind: {
		name: "Silberhauch",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 10 %, Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung und Initiative des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "10 % Chance, alle Statuswerte um 1 zu erhöhen.", // NEEDS QC
	},
	simplebeam: {
		name: "Wankelstrahl",
		// Official flavor text: "Bestrahlt das Ziel mit mysteriösen Energiewellen. Bei einem Treffer wird dessen Fähigkeit zu Wankelmut."
		desc: "Die Fähigkeit des Ziels wird zu Wankelmut. Schlägt fehl, wenn die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Wankelmut, Taktikwechsel, Tera-Wandel, Schnarchnase, Trance-Modus oder Superwechsel ist.", // NEEDS QC
		shortDesc: "Das Ziel erhält die Fähigkeit Wankelmut.", // NEEDS QC
		gen8: {
			desc: "Die Fähigkeit des Ziels wird zu Wankelmut. Schlägt fehl, wenn die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Wankelmut, Taktikwechsel, Schnarchnase oder Trance-Modus ist.", // NEEDS QC
		},
		gen7: {
			desc: "Die Fähigkeit des Ziels wird zu Wankelmut. Schlägt fehl, wenn die Fähigkeit des Ziels Freundschaftsakt, Dauerschlaf, Kostümspuk, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Wankelmut, Taktikwechsel, Schnarchnase oder Trance-Modus ist.", // NEEDS QC
		},
		gen6: {
			desc: "Die Fähigkeit des Ziels wird zu Wankelmut. Schlägt fehl, wenn die Fähigkeit des Ziels Variabilität, Wankelmut, Taktikwechsel oder Schnarchnase ist.", // NEEDS QC
		},
		gen5: {
			desc: "Die Fähigkeit des Ziels wird zu Wankelmut. Schlägt fehl, wenn die Fähigkeit des Ziels Variabilität, Wankelmut oder Schnarchnase ist.", // NEEDS QC
		},
	},
	sing: {
		name: "Gesang",
		shortDesc: "Schläfert das Ziel ein.", // NEEDS QC
	},
	sinisterarrowraid: {
		name: "Schatten-Pfeilregen",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	sizzlyslide: {
		name: "Flackerbrand",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 100 %, das Ziel zu verbrennen.", // NEEDS QC
		shortDesc: "100 % Chance auf Verbrennung.", // NEEDS QC
	},
	sketch: {
		name: "Nachahmer",
		// Official flavor text: "Anwender erlernt die letzte Attacke des Zieles dauerhaft. Nachahmer verschwindet nach Gebrauch."
		desc: "Diese Attacke wird dauerhaft durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat ihre maximalen AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender sich verwandelt hat oder die Attacke Hitzeturbo, Raufturbo, Schlummerort, Dimensionswahn, Zauberturbo, Toxiturbo, Vitalsegen, Nachahmer, Verzweifler, Tera-Sternhagel oder Finsterturbo oder eine bereits bekannte Attacke ist.", // NEEDS QC
		shortDesc: "Kopiert die letzte Attacke des Ziels dauerhaft.", // NEEDS QC
		gen8: {
			desc: "Diese Attacke wird dauerhaft durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat ihre maximalen AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender sich verwandelt hat oder die Attacke Geschwätz, Nachahmer oder Verzweifler oder eine bereits bekannte Attacke ist.", // NEEDS QC
		},
		gen3: {
			desc: "Diese Attacke wird dauerhaft durch die zuletzt vom Ziel eingesetzte Attacke ersetzt. Die kopierte Attacke hat ihre maximalen AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, der Anwender sich verwandelt hat oder die Attacke Nachahmer oder Verzweifler oder eine bereits bekannte Attacke ist.", // NEEDS QC
		},
		gen2: {
			desc: "Schlägt fehl, wenn sie in Link-Kämpfen eingesetzt wird.", // NEEDS QC
			shortDesc: "Schlägt fehl, wenn sie in Link-Kämpfen genutzt wird.", // NEEDS QC
		},

		activate: "  {POKEMON} ahmt die Attacke {MOVE} nach!",
	},
	skillswap: {
		name: "Fähigkeitstausch",
		// Official flavor text: "Anwender tauscht seine Fähigkeit mit der des Zieles."
		desc: "Der Anwender tauscht seine Fähigkeit mit der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders oder des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kommandant, Kostümspuk, Erinnerungskraft, Heißhunger, Tiefkühlkopf, Trugbild, Variabilität, Reaktionsgas, Giftpuppenspiel, Scharwandel, Paläosynthese, Quantenantrieb, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Panzer, Tera-Wandel, Teraforming Null, Wunderwache, Trance-Modus oder Superwechsel ist.", // NEEDS QC
		shortDesc: "Anwender und Ziel tauschen ihre Fähigkeiten.", // NEEDS QC
		gen8: {
			desc: "Der Anwender tauscht seine Fähigkeit mit der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders oder des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Heißhunger, Tiefkühlkopf, Trugbild, Variabilität, Reaktionsgas, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Wunderwache oder Trance-Modus ist.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender tauscht seine Fähigkeit mit der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders oder des Ziels Freundschaftsakt, Dauerschlaf, Kostümspuk, Trugbild, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Wunderwache oder Trance-Modus ist.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender tauscht seine Fähigkeit mit der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders oder des Ziels Trugbild, Variabilität, Taktikwechsel oder Wunderwache ist.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender tauscht seine Fähigkeit mit der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders oder des Ziels Trugbild, Variabilität oder Wunderwache ist oder beide dieselbe Fähigkeit haben.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender tauscht seine Fähigkeit mit der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders oder des Ziels Variabilität oder Wunderwache ist, wenn beide dieselbe Fähigkeit haben oder wenn einer von beiden einen Platinum-Orb trägt.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender tauscht seine Fähigkeit mit der des Ziels. Schlägt fehl, wenn die Fähigkeit des Anwenders oder des Ziels Wunderwache ist.", // NEEDS QC
		},

		activate: "  {POKEMON} tauscht Fähigkeiten mit dem Ziel!",
	},
	skittersmack: {
		name: "Krabbelkracher",
		// Official flavor text: "Der Anwender kriecht hinter das Ziel, greift es an und senkt dabei dessen Spezial-Angriff."
		desc: "Hat eine Chance von 100 %, den Spezial-Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Sp.-Ang. des Ziels.", // NEEDS QC
	},
	skullbash: {
		name: "Schädelwumme",
		// Official flavor text: "Der Anwender erhöht in Runde 1 seine Verteidigung und greift in Runde 2 an."
		desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Erhöht in der ersten Runde die Verteidigung des Anwenders um eine Stufe. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "+1 Vert. in Runde 1, trifft in Runde 2.", // NEEDS QC
		gen3: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. In der ersten Runde steigt die Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		},
		gen1: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt.", // NEEDS QC
			shortDesc: "Lädt in Runde 1 auf. Trifft in Runde 2.", // NEEDS QC
		},

		prepare: "{POKEMON} zieht seinen Kopf ein!",
	},
	skyattack: {
		name: "Himmelsfeger",
		// Official flavor text: "Anwender greift in der zweiten Runde mit hoher Volltrefferquote an. Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen, und eine erhöhte Volltrefferquote. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Trägt der Anwender ein Energiekraut, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		shortDesc: "Trifft Runde 2. 30 % Zurückschrecken, oft Volltreffer.", // NEEDS QC
		gen3: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen, und eine erhöhte Volltrefferquote. Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt.", // NEEDS QC
		},
		gen2: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt.", // NEEDS QC
			shortDesc: "Lädt in Runde 1 auf. Trifft in Runde 2.", // NEEDS QC
		},

		prepare: "{POKEMON} leuchtet grell!",
	},
	skydrop: {
		name: "Freier Fall",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Dieser Angriff trägt das Ziel in der ersten Runde mit dem Anwender in die Luft und wird in der zweiten ausgeführt. Pokémon mit 200 kg oder mehr können nicht angehoben werden. In der ersten Runde weichen Anwender und Ziel allen Attacken aus außer Windstoß, Orkan, Himmelhieb, Katapult, Tausend Pfeile, Donner und Windhose. Anwender und Ziel können zwischen den Runden nicht handeln, das Ziel kann aber eine Attacke wählen. Diese Attacke kann Pokémon vom Typ Flug keinen Schaden zufügen. Schlägt in der ersten Runde fehl, wenn das Ziel ein Mitstreiter ist, einen Delegator hat oder gerade Sprungfeder, Schaufler, Taucher, Fliegen, Phantomkraft, Schemenkraft oder Freier Fall einsetzt.", // NEEDS QC
		shortDesc: "Entführt das Ziel in die Luft; trifft in Runde 2.", // NEEDS QC
		gen5: {
			desc: "Dieser Angriff trägt das Ziel in der ersten Runde mit dem Anwender in die Luft und wird in der zweiten ausgeführt. In der ersten Runde weichen Anwender und Ziel allen Attacken aus außer Windstoß, Orkan, Himmelhieb, Katapult, Donner und Windhose. Anwender und Ziel können zwischen den Runden nicht handeln, das Ziel kann aber eine Attacke wählen. Diese Attacke kann Pokémon vom Typ Flug keinen Schaden zufügen. Schlägt in der ersten Runde fehl, wenn das Ziel ein Mitstreiter ist, einen Delegator hat oder gerade Sprungfeder, Schaufler, Taucher, Fliegen, Schemenkraft oder Freier Fall einsetzt. Beendet der Effekt von Erdanziehung diesen Effekt vor der zweiten Runde, kehren Anwender und Ziel zum Boden zurück; andernfalls bleibt das Ziel unter diesem Effekt, bis der Anwender das Feld verlässt oder die zweite Runde einer beliebigen Zwei-Runden-Attacke erfolgreich ausführt.", // NEEDS QC
		},

		prepare: "{POKEMON} entführt {TARGET} in luftige Höhen!",
		end: "  {POKEMON} wurde aus dem Freien Fall befreit!",
		failSelect: "Aufgrund von Freier Fall kann {POKEMON} diese Aktion nicht ausführen!",
		failTooHeavy: "  {POKEMON} ist zu schwer und kann nicht in die Luft gehoben werden!",
	},
	skyuppercut: {
		name: "Himmelhieb",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Diese Attacke kann ein Ziel treffen, das gerade Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht.", // NEEDS QC
		shortDesc: "Trifft auch Fliegende (Fliegen usw.).", // NEEDS QC
		gen4: {
			desc: "Diese Attacke kann ein Ziel treffen, das gerade Sprungfeder oder Fliegen einsetzt.", // NEEDS QC
			shortDesc: "Trifft Ziele, die Sprungfeder oder Fliegen nutzen.", // NEEDS QC
		},
	},
	slackoff: {
		name: "Tagedieb",
		// Official flavor text: "Durch Müßiggang werden KP des Anwenders um 50 % der maximalen KP aufgefüllt."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um die Hälfte der max. KP.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, abgerundet.", // NEEDS QC
		},
	},
	slam: {
		name: "Slam",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	slash: {
		name: "Schlitzer",
		// Official flavor text: "Hieb mit Klauen oder Ähnlichem. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	sleeppowder: {
		name: "Schlafpuder",
		shortDesc: "Schläfert das Ziel ein.", // NEEDS QC
	},
	sleeptalk: {
		name: "Schlafrede",
		// Official flavor text: "Anwender setzt per Zufall eine ihm bekannte Attacke ein. Klappt nur, wenn der Anwender gerade schläft."
		desc: "Eine der vom Anwender gekannten Attacken außer dieser wird zufällig gewählt und eingesetzt. Schlägt fehl, wenn der Anwender nicht schläft. Die gewählte Attacke verbraucht keine AP und darf 0 AP haben. Diese Attacke kann weder Zuschuss, Schnabelkanone, Rülpser, Geduld, Hitzeturbo, Ehrentag, Geschwätz, Raufturbo, Imitator, Dynamax-Kanone, Power-Punch, Händchenhalten, Zauberturbo, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Toxiturbo, Panzerfalle, Nachahmer, Schlafrede, Verzweifler, Aufruhr oder Finsterturbo noch eine Zwei-Runden-Attacke wählen.", // NEEDS QC
		shortDesc: "Nur im Schlaf: Setzt eine andere Attacke ein.", // NEEDS QC
		gen8: {
			desc: "Eine der vom Anwender gekannten Attacken außer dieser wird zufällig gewählt und eingesetzt. Schlägt fehl, wenn der Anwender nicht schläft. Die gewählte Attacke verbraucht keine AP und darf 0 AP haben. Diese Attacke kann weder Zuschuss, Schnabelkanone, Rülpser, Geduld, Ehrentag, Geschwätz, Imitator, Dynamax-Kanone, Power-Punch, Händchenhalten, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Panzerfalle, Nachahmer, Schlafrede, Verzweifler, Aufruhr noch eine Zwei-Runden-Attacke oder eine Dynamax-Attacke wählen.", // NEEDS QC
		},
		gen7: {
			desc: "Eine der vom Anwender gekannten Attacken außer dieser wird zufällig gewählt und eingesetzt. Schlägt fehl, wenn der Anwender nicht schläft. Die gewählte Attacke verbraucht keine AP und darf 0 AP haben. Diese Attacke kann weder Zuschuss, Schnabelkanone, Rülpser, Geduld, Ehrentag, Geschwätz, Imitator, Power-Punch, Händchenhalten, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Panzerfalle, Nachahmer, Schlafrede, Verzweifler, Aufruhr noch eine Zwei-Runden-Attacke oder eine Z-Attacke wählen.", // NEEDS QC
		},
		gen6: {
			desc: "Eine der vom Anwender gekannten Attacken außer dieser wird zufällig gewählt und eingesetzt. Schlägt fehl, wenn der Anwender nicht schläft. Die gewählte Attacke verbraucht keine AP und darf 0 AP haben. Diese Attacke kann weder Zuschuss, Rülpser, Geduld, Ehrentag, Geschwätz, Imitator, Power-Punch, Händchenhalten, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Nachahmer, Schlafrede, Verzweifler, Aufruhr noch eine Zwei-Runden-Attacke wählen.", // NEEDS QC
		},
		gen5: {
			desc: "Eine der vom Anwender gekannten Attacken außer dieser wird zufällig gewählt und eingesetzt. Schlägt fehl, wenn der Anwender nicht schläft. Die gewählte Attacke verbraucht keine AP und darf 0 AP haben. Diese Attacke kann weder Zuschuss, Geduld, Geschwätz, Imitator, Power-Punch, Egotrip, Metronom, Mimikry, Spiegeltrick, Natur-Kraft, Nachahmer, Schlafrede, Verzweifler, Aufruhr noch eine Zwei-Runden-Attacke wählen.", // NEEDS QC
		},
		gen4: {
			desc: "Eine der vom Anwender gekannten Attacken außer dieser wird zufällig gewählt und eingesetzt. Schlägt fehl, wenn der Anwender nicht schläft. Die gewählte Attacke verbraucht keine AP und darf 0 AP haben. Diese Attacke kann weder Zuschuss, Geduld, Geschwätz, Imitator, Power-Punch, Egotrip, Metronom, Spiegeltrick, Schlafrede, Aufruhr noch eine Zwei-Runden-Attacke wählen.", // NEEDS QC
		},
		gen3: {
			desc: "Eine der vom Anwender gekannten Attacken außer dieser wird zufällig gewählt und eingesetzt. Schlägt fehl, wenn der Anwender nicht schläft. Die gewählte Attacke verbraucht keine AP, schlägt aber fehl, wenn sie aktuell 0 AP hat. Diese Attacke kann weder Zuschuss, Geduld, Power-Punch, Metronom, Spiegeltrick, Schlafrede, Aufruhr noch eine Zwei-Runden-Attacke wählen.", // NEEDS QC
		},
		gen2: {
			desc: "Eine der vom Anwender gekannten Attacken außer dieser wird zufällig gewählt und eingesetzt. Schlägt fehl, wenn der Anwender nicht schläft. Die gewählte Attacke verbraucht keine AP und darf 0 AP haben. Diese Attacke kann weder Geduld, Schlafrede noch eine Zwei-Runden-Attacke wählen.", // NEEDS QC
		},
	},
	sludge: {
		name: "Schlammbad",
		// Official flavor text: "Wirft Schlamm auf das Ziel. Dieses wird eventuell vergiftet."
		desc: "Hat eine Chance von 30 %, das Ziel zu vergiften.", // NEEDS QC
		shortDesc: "30 % Chance auf Vergiftung.", // NEEDS QC
		gen1: {
			desc: "Hat eine Chance von 40 %, das Ziel zu vergiften.", // NEEDS QC
			shortDesc: "40 % Chance auf Vergiftung.", // NEEDS QC
		},
	},
	sludgebomb: {
		name: "Matschbombe",
		// Official flavor text: "Wirft Schlamm auf das Ziel. Dieses wird eventuell vergiftet."
		desc: "Hat eine Chance von 30 %, das Ziel zu vergiften.", // NEEDS QC
		shortDesc: "30 % Chance auf Vergiftung.", // NEEDS QC
	},
	sludgewave: {
		name: "Schlammwoge",
		// Official flavor text: "Greift alle Pokémon im Umkreis mit einer Schlammwelle an. Diese werden eventuell auch vergiftet."
		desc: "Hat eine Chance von 10 %, das Ziel zu vergiften.", // NEEDS QC
		shortDesc: "10 % Chance, Nachbarn zu vergiften.", // NEEDS QC
	},
	smackdown: {
		name: "Katapult",
		// Official flavor text: "Greift das Ziel mit Steinen und Wurfgeschossen an. Fliegende Ziele fallen dabei vom Himmel und landen auf dem Boden."
		desc: "Diese Attacke kann ein Ziel treffen, das gerade Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht. Trifft sie ein Ziel unter dem Effekt von Sprungfeder, Fliegen, Magnetflug oder Telekinese, endet dieser Effekt. Ist das Ziel vom Typ Flug und hat in dieser Runde nicht Ruheort eingesetzt, oder hat es die Fähigkeit Schwebe, verliert es seine Immunität gegen Angriffe vom Typ Boden und die Fähigkeit Ausweglos, solange es im Kampf bleibt. Während des Effekts schlägt Magnetflug für das Ziel fehl und Telekinese schlägt gegen es fehl.", // NEEDS QC
		shortDesc: "Hebt die Boden-Immunität des Ziels auf.", // NEEDS QC

		start: "  {POKEMON} ist herabgestürzt!",
	},
	smartstrike: {
		name: "Schmalhorn",
		shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
	},
	smellingsalts: {
		name: "Riechsalz",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke wird verdoppelt, wenn das Ziel paralysiert ist. Ist der Anwender nicht kampfunfähig, wird das Ziel von der Paralyse geheilt.", // NEEDS QC
		shortDesc: "Doppelt gegen Paralysierte, heilt sie aber.", // NEEDS QC
		gen4: {
			desc: "Die Stärke wird verdoppelt, wenn das Ziel paralysiert ist. Gelingt diese Attacke, wird das Ziel von der Paralyse geheilt.", // NEEDS QC
		},
		gen3: {
			desc: "Der Schaden wird verdoppelt, wenn das Ziel paralysiert ist. Gelingt diese Attacke, wird das Ziel von der Paralyse geheilt.", // NEEDS QC
			shortDesc: "2x Schaden bei Paralyse; heilt sie.", // NEEDS QC
		},
	},
	smog: {
		name: "Smog",
		// Official flavor text: "Angriff mit Gas. Das Ziel kann eventuell vergiftet werden."
		desc: "Hat eine Chance von 40 %, das Ziel zu vergiften.", // NEEDS QC
		shortDesc: "40 % Chance auf Vergiftung.", // NEEDS QC
	},
	smokescreen: {
		name: "Rauchwolke",
		// Official flavor text: "Senkt Genauigkeit des Zieles mit Rauch, Tinte oder Ähnlichem."
		desc: "Senkt die Genauigkeit des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Genauigkeit des Ziels um eine Stufe.", // NEEDS QC
	},
	snaptrap: {
		name: "Fangeisen",
		// Official flavor text: "Das Ziel wird vier bis fünf Runden lang in einem Fangeisen festgehalten und angegriffen."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},

		start: "  {POKEMON} wird in einem Fangeisen festgehalten!",
	},
	snarl: {
		name: "Standpauke",
		// Official flavor text: "Wäscht gegnerischen Pokémon mit einer ausführlichen Standpauke den Kopf und senkt dabei deren Spezial-Angriff."
		desc: "Hat eine Chance von 100 %, den Spezial-Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Sp.-Ang. der Gegner.", // NEEDS QC
	},
	snatch: {
		name: "Übernahme",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Setzt ein anderes Pokémon in dieser Runde bestimmte nicht schädigende Attacken ein, stiehlt der Anwender sie und setzt sie selbst ein. Setzen mehrere Pokémon in dieser Runde eine solche Attacke ein, werden alle vom ersten Pokémon in der Zugreihenfolge gestohlen, das diese Attacke eingesetzt hat. Dieser Effekt wird ignoriert, solange der Anwender unter dem Effekt von Freier Fall steht.", // NEEDS QC
		shortDesc: "Stiehlt bestimmte Status-Attacken der anderen.", // NEEDS QC
		gen4: {
			desc: "Setzt ein anderes Pokémon in dieser Runde bestimmte nicht schädigende Attacken ein, stiehlt der Anwender sie und setzt sie selbst ein. Setzen mehrere Pokémon in dieser Runde diese Attacke ein, werden die betreffenden Attacken von jedem dieser Pokémon in der Zugreihenfolge gestohlen, und nur der letzte Anwender in der Zugreihenfolge erhält die Effekte.", // NEEDS QC
		},

		start: "  {POKEMON} wartet auf einen Angriff!",
		activate: "  {POKEMON} übernimmt die Wirkung der Attacke von {TARGET}!",
	},
	snipeshot: {
		name: "Präzisionsschuss",
		// Official flavor text: "Die Attacke richtet sich gegen das ausgewählte Ziel, unabhängig von Fähigkeiten oder Attacken, die Angriffe auf sich ziehen."
		desc: "Hat eine erhöhte Volltrefferquote. Diese Attacke kann durch keinen Effekt auf ein anderes Ziel umgelenkt werden.", // NEEDS QC
		shortDesc: "Hohe Volltrefferquote. Nicht umlenkbar.", // NEEDS QC
	},
	snore: {
		name: "Schnarcher",
		// Official flavor text: "Attacke nur im Schlaf möglich. Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Schlägt fehl, wenn der Anwender nicht schläft.", // NEEDS QC
		shortDesc: "Nur im Schlaf. 30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	snowscape: {
		name: "Schneelandschaft",
		desc: "5 Runden lang schneit es. Während des Effekts wird die Verteidigung von Pokémon vom Typ Eis mit 1,5 multipliziert, wenn sie einen physischen Angriff erleiden. Hält 8 Runden an, wenn der Anwender einen Eisbrocken trägt. Schlägt fehl, wenn es bereits schneit.", // NEEDS QC
		shortDesc: "5 Runden Schnee; Eis: Verteidigung x1,5.", // NEEDS QC
	},
	soak: {
		name: "Überflutung",
		// Official flavor text: "Überschüttet das Ziel mit Unmengen an Wasser und ändert den Typ damit in Wasser um."
		desc: "Das Ziel wird zum Typ Wasser. Schlägt fehl, wenn das Ziel ein Arceus oder Amigento ist, bereits ausschließlich vom Typ Wasser ist oder terakristallisiert ist.", // NEEDS QC
		shortDesc: "Das Ziel wird zum Wasser-Typ.", // NEEDS QC
		gen8: {
			desc: "Das Ziel wird zum Typ Wasser. Schlägt fehl, wenn das Ziel ein Arceus oder Amigento ist oder bereits ausschließlich vom Typ Wasser ist.", // NEEDS QC
		},
		gen6: {
			desc: "Das Ziel wird zum Typ Wasser. Schlägt fehl, wenn das Ziel ein Arceus ist oder bereits ausschließlich vom Typ Wasser ist.", // NEEDS QC
		},
		gen5: {
			desc: "Das Ziel wird zum Typ Wasser. Schlägt fehl, wenn das Ziel ein Arceus ist.", // NEEDS QC
		},
	},
	softboiled: {
		name: "Weichei",
		// Official flavor text: "KP des Anwenders werden um 50 % der maximalen KP aufgefüllt."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, ab 0,5 aufgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender um die Hälfte der max. KP.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, abgerundet.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, abgerundet. Schlägt fehl, wenn (maximale KP des Anwenders − aktuelle KP + 1) durch 256 teilbar ist.", // NEEDS QC
		},
	},
	solarbeam: {
		name: "Solarstrahl",
		// Official flavor text: "Absorbiert Licht in Runde 1. In Runde 2 erfolgt der Angriff."
		desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Die Stärke wird halbiert, wenn das Wetter Strömender Regen, Regen, Sandsturm oder Schnee ist und der Anwender keinen Allzweckschirm trägt. Trägt der Anwender ein Energiekraut oder ist das Wetter Gleißende Sonne oder Sonne, wird die Attacke in einer Runde ausgeführt. Trägt der Anwender einen Allzweckschirm und ist das Wetter Gleißende Sonne oder Sonne, benötigt die Attacke dennoch eine Runde zum Aufladen.", // NEEDS QC
		shortDesc: "Lädt auf, trifft in Runde 2. Sofort bei Sonne.", // NEEDS QC
		gen8: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Die Stärke wird halbiert, wenn das Wetter Hagel, Strömender Regen, Regen oder Sandsturm ist und der Anwender keinen Allzweckschirm trägt. Trägt der Anwender ein Energiekraut oder ist das Wetter Gleißende Sonne oder Sonne, wird die Attacke in einer Runde ausgeführt. Trägt der Anwender einen Allzweckschirm und ist das Wetter Gleißende Sonne oder Sonne, benötigt die Attacke dennoch eine Runde zum Aufladen.", // NEEDS QC
		},
		gen7: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Die Stärke wird halbiert, wenn das Wetter Hagelsturm, Strömender Regen, Regen oder Sandsturm ist. Trägt der Anwender ein Energiekraut oder ist das Wetter Gleißende Sonne oder Sonne, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen5: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Die Stärke wird halbiert, wenn das Wetter Hagelsturm, Regen oder Sandsturm ist. Trägt der Anwender ein Energiekraut oder ist das Wetter Sonne, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen4: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Der Schaden wird halbiert, wenn das Wetter Hagelsturm, Regen oder Sandsturm ist. Trägt der Anwender ein Energiekraut oder ist das Wetter Sonne, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen3: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Der Schaden wird halbiert, wenn das Wetter Hagelsturm, Regen oder Sandsturm ist. Ist das Wetter Sonne, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen2: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Der Schaden wird halbiert, wenn das Wetter Regen ist. Ist das Wetter Sonne, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},
		gen1: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt.", // NEEDS QC
			shortDesc: "Lädt in Runde 1 auf. Trifft in Runde 2.", // NEEDS QC
		},

		prepare: "  {POKEMON} absorbiert Sonnenlicht!",
	},
	solarblade: {
		name: "Solarklinge",
		// Official flavor text: "In Runde 1 absorbiert der Anwender Licht, das er in Runde 2 zu einem Schwert formt, mit dem er dann angreift."
		desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Die Stärke wird halbiert, wenn das Wetter Hagel, Strömender Regen, Regen oder Sandsturm ist und der Anwender keinen Allzweckschirm trägt. Trägt der Anwender ein Energiekraut oder ist das Wetter Gleißende Sonne oder Sonne, wird die Attacke in einer Runde ausgeführt. Trägt der Anwender einen Allzweckschirm und ist das Wetter Gleißende Sonne oder Sonne, benötigt die Attacke dennoch eine Runde zum Aufladen.", // NEEDS QC
		shortDesc: "Lädt auf, trifft in Runde 2. Sofort bei Sonne.", // NEEDS QC
		gen8: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Die Stärke wird halbiert, wenn das Wetter Strömender Regen, Regen, Sandsturm oder Schnee ist und der Anwender keinen Allzweckschirm trägt. Trägt der Anwender ein Energiekraut oder ist das Wetter Gleißende Sonne oder Sonne, wird die Attacke in einer Runde ausgeführt. Trägt der Anwender einen Allzweckschirm und ist das Wetter Gleißende Sonne oder Sonne, benötigt die Attacke dennoch eine Runde zum Aufladen.", // NEEDS QC
		},
		gen7: {
			desc: "Dieser Angriff lädt sich in der ersten Runde auf und wird in der zweiten ausgeführt. Die Stärke wird halbiert, wenn das Wetter Hagelsturm, Strömender Regen, Regen oder Sandsturm ist. Trägt der Anwender ein Energiekraut oder ist das Wetter Gleißende Sonne oder Sonne, wird die Attacke in einer Runde ausgeführt.", // NEEDS QC
		},

		prepare: "#solarbeam",
	},
	sonicboom: {
		name: "Ultraschall",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Fügt dem Ziel 20 KP Schaden zu.", // NEEDS QC
		shortDesc: "Fügt dem Ziel immer 20 KP Schaden zu.", // NEEDS QC
		gen1: {
			desc: "Fügt dem Ziel 20 KP Schaden zu. Diese Attacke ignoriert Typ-Immunität.", // NEEDS QC
		},
	},
	soulstealing7starstrike: {
		name: "Sternbild des Seelenraubes",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	spacialrend: {
		name: "Raumschlag",
		// Official flavor text: "Schwere, raumgreifende Attacke. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	spark: {
		name: "Funkensprung",
		// Official flavor text: "Eine Elektro-Attacke, die das Ziel paralysieren kann."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "30 % Chance auf Paralyse.", // NEEDS QC
	},
	sparklingaria: {
		name: "Schaumserenade",
		// Official flavor text: "Durch Gesang erzeugte Blasen werden auf das Ziel geschleudert. Alle Pokémon, die dadurch Schaden erleiden, werden auch von Verbrennungen geheilt."
		desc: "Ist der Anwender nicht kampfunfähig, wird die Verbrennung des Ziels geheilt.", // NEEDS QC
		shortDesc: "Heilt die Verbrennung des Ziels.", // NEEDS QC
	},
	sparklyswirl: {
		name: "Glitzersturm",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Alle Pokémon im Team des Anwenders werden von ihren Statusproblemen geheilt.", // NEEDS QC
		shortDesc: "Heilt die Statusprobleme des ganzen Teams.", // NEEDS QC
	},
	spectralthief: {
		name: "Diebesschatten",
		// Official flavor text: "Der Anwender schleicht sich in den Schatten des Zieles, stiehlt dessen erhöhte Statuswerte und fügt ihm Schaden zu."
		desc: "Die positiven Statusveränderungen des Ziels werden ihm gestohlen und vor der Schadensberechnung auf den Anwender übertragen.", // NEEDS QC
		shortDesc: "Stiehlt erst die Werterhöhungen des Ziels.", // NEEDS QC

		clearBoost: "  {SOURCE} hat erhöhte Statuswerte gestohlen!",
	},
	speedswap: {
		name: "Initiativetausch",
		// Official flavor text: "Der Anwender tauscht seinen Initiative-Wert mit dem des Zieles."
		desc: "Der Anwender tauscht seinen Initiative-Wert mit dem des Ziels. Statusveränderungen bleiben unberührt.", // NEEDS QC
		shortDesc: "Tauscht den Initiative-Wert mit dem Ziel.", // NEEDS QC

		activate: "  {POKEMON} tauscht seinen Initiative-Wert mit dem des Ziels!",
	},
	spicyextract: {
		name: "Chili-Essenz",
		desc: "Erhöht den Angriff des Ziels um 2 Stufen und senkt seine Verteidigung um 2 Stufen.", // NEEDS QC
		shortDesc: "+2 Angriff, aber -2 Verteidigung des Ziels.", // NEEDS QC
	},
	spiderweb: {
		name: "Spinnennetz",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		shortDesc: "Hindert das Ziel am Auswechseln.", // NEEDS QC
		gen7: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt, außer er setzt Stafette ein – dann bleibt das Ziel gefangen.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es Stafette einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt, außer er setzt Stafette ein – dann bleibt das Ziel gefangen.", // NEEDS QC
		},
	},
	spikecannon: {
		name: "Dornkanone",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen4: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Trefferzahl nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 3/8 zwei- oder dreimal und mit einer Chance von 1/8 vier- oder fünfmal. Der Schaden wird nur für den ersten Treffer berechnet und für jeden weiteren übernommen. Zerbricht einer der Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	spikes: {
		name: "Stachler",
		// Official flavor text: "Der Anwender legt Stacheln aus, die gegnerische Pokémon verletzen, die in den Kampf gerufen werden."
		desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Kann bis zu dreimal eingesetzt werden, bevor sie fehlschlägt. Gegner verlieren 1/8 ihrer maximalen KP bei einer Schicht, 1/6 bei zwei und 1/4 bei drei Schichten, abgerundet. Kann von der gegnerischen Seite entfernt werden, wenn ein Pokémon Aufräumen einsetzt oder ein Gegner Letalwirbler, Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		shortDesc: "Verletzt einwechselnde Gegner am Boden. Max. 3-mal.", // NEEDS QC
		gen8: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Kann bis zu dreimal eingesetzt werden, bevor sie fehlschlägt. Gegner verlieren 1/8 ihrer maximalen KP bei einer Schicht, 1/6 bei zwei und 1/4 bei drei Schichten, abgerundet. Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		},
		gen5: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Kann bis zu dreimal eingesetzt werden, bevor sie fehlschlägt. Gegner verlieren 1/8 ihrer maximalen KP bei einer Schicht, 1/6 bei zwei und 1/4 bei drei Schichten, abgerundet. Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		},
		gen3: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Kann bis zu dreimal eingesetzt werden, bevor sie fehlschlägt. Gegner verlieren 1/8 ihrer maximalen KP bei einer Schicht, 1/6 bei zwei und 1/4 bei drei Schichten, abgerundet. Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher erfolgreich einsetzt.", // NEEDS QC
		},
		gen2: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, durch die jeder einwechselnde Gegner 1/8 seiner maximalen KP verliert, abgerundet, außer er ist vom Typ Flug. Schlägt fehl, wenn der Effekt bereits auf der gegnerischen Seite aktiv ist. Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher erfolgreich einsetzt.", // NEEDS QC
			shortDesc: "Schadet einwechselnden Gegnern. Max. 1 Schicht.", // NEEDS QC
		},

		start: "  {TEAM:capitalize} sind von Stacheln umgeben!",
		end: "  Die Stacheln, die um {TEAM} herumlagen, sind verschwunden!",
		damage: "  {POKEMON} wurde durch Stachler verletzt!",
	},
	spikyshield: {
		name: "Schutzstacheln",
		// Official flavor text: "Der Anwender wird vor Angriffen geschützt. Gleichzeitig nehmen alle Pokémon, die mit ihm in Berührung kommen, Schaden."
		desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke treffen, verlieren 1/8 ihrer maximalen KP, abgerundet. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		shortDesc: "Schützt vor Attacken. Kontakt: -1/8 der max. KP.", // NEEDS QC
		gen8: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke treffen, verlieren 1/8 ihrer maximalen KP, abgerundet. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke treffen, verlieren 1/8 ihrer maximalen KP, abgerundet. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender ist in dieser Runde vor den meisten Attacken anderer Pokémon geschützt, und Pokémon, die ihn mit einer Kontaktattacke treffen, verlieren 1/8 ihrer maximalen KP, abgerundet. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt.", // NEEDS QC
		},

		damage: "  {POKEMON} wurde verletzt!",
	},
	spinout: {
		name: "Reifendrehung",
		desc: "Senkt die Initiative des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Senkt Initiative des Anwenders um 2 Stufen.", // NEEDS QC
	},
	spiritbreak: {
		name: "Seelenbruch",
		// Official flavor text: "Die Attacke trifft das Ziel mit so viel Wucht, dass es den Mut verliert. Dabei wird sein Spezial-Angriff gesenkt."
		desc: "Hat eine Chance von 100 %, den Spezial-Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Sp.-Ang. des Ziels.", // NEEDS QC
	},
	spiritshackle: {
		name: "Schattenfessel",
		// Official flavor text: "Der Anwender greift das Ziel an und näht zugleich dessen Schatten am Boden fest, sodass es nicht entkommen kann."
		desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		shortDesc: "Hindert das Ziel am Auswechseln.", // NEEDS QC
		gen7: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt.", // NEEDS QC
		},
	},
	spite: {
		name: "Groll",
		// Official flavor text: "AP der letzten Attacke des Zieles werden um 4 gesenkt."
		desc: "Die zuletzt vom Ziel eingesetzte Attacke verliert 4 AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, die Attacke 0 AP hat oder es sie nicht mehr kennt.", // NEEDS QC
		shortDesc: "Die letzte Attacke des Ziels verliert 4 AP.", // NEEDS QC
		gen3: {
			desc: "Die zuletzt vom Ziel eingesetzte Attacke verliert zufällig 2 bis 5 AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat, die Attacke 0 oder 1 AP hat oder es sie nicht mehr kennt.", // NEEDS QC
			shortDesc: "Letzte Attacke des Ziels verliert 2-5 AP.", // NEEDS QC
		},
		gen2: {
			desc: "Die zuletzt vom Ziel eingesetzte Attacke verliert zufällig 2 bis 5 AP. Schlägt fehl, wenn das Ziel noch nicht gehandelt hat oder die Attacke 0 AP hat.", // NEEDS QC
		},

		activate: "  {MOVE} von {TARGET} wird um {NUMBER} AP reduziert!",
	},
	spitup: {
		name: "Entfessler",
		// Official flavor text: "Entlädt die Kraft, die während des Einsatzes von Horter gesammelt wurde. Je mehr Energie gehortet wurde, desto stärker der Angriff."
		desc: "Die Stärke beträgt das 100-Fache des Horter-Zählers des Anwenders. Schlägt fehl, wenn der Zähler bei 0 liegt. Ob diese Attacke gelingt oder nicht, sinken Verteidigung und Spezial-Verteidigung des Anwenders um so viele Stufen, wie Horter sie erhöht hatte, und der Zähler wird auf 0 zurückgesetzt.", // NEEDS QC
		shortDesc: "Stärker je nach Horter-Ladungen.", // NEEDS QC
		gen4: {
			desc: "Die Stärke beträgt das 100-Fache des Horter-Zählers des Anwenders. Diese Attacke hat keine Schadensstreuung. Schlägt fehl, wenn der Zähler bei 0 liegt. Außer es gibt kein Ziel, sinken Verteidigung und Spezial-Verteidigung des Anwenders, ob diese Attacke gelingt oder nicht, um so viele Stufen, wie Horter sie erhöht hatte, und der Zähler wird auf 0 zurückgesetzt.", // NEEDS QC
		},
		gen3: {
			desc: "Der Schaden wird mit dem Horter-Zähler des Anwenders multipliziert. Diese Attacke hat keine Schadensstreuung und kann kein Volltreffer sein. Schlägt fehl, wenn der Zähler bei 0 liegt. Sofern diese Attacke nicht verfehlt, wird der Zähler auf 0 zurückgesetzt.", // NEEDS QC
		},
	},
	splash: {
		name: "Platscher",
		shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC

		activate: "  Aber nichts geschieht!",
	},
	splinteredstormshards: {
		name: "Fataler Steinregen",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Beendet die Effekte von Elektrofeld, Grasfeld, Nebelfeld und Psychofeld.", // NEEDS QC
		shortDesc: "Beendet die Effekte von Feldern.", // NEEDS QC
	},
	splishysplash: {
		name: "Plätschersurfer",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "30 % Chance auf Paralyse.", // NEEDS QC
	},
	spore: {
		name: "Pilzspore",
		shortDesc: "Schläfert das Ziel ein.", // NEEDS QC
	},
	spotlight: {
		name: "Rampenlicht",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Bis zum Ende der Runde werden alle Angriffe der Gegner des Ziels mit einzelnem Ziel auf das Ziel umgelenkt. Diese Angriffe werden umgelenkt, bevor sie von Magiemantel oder der Fähigkeit Magiespiegel zurückgeworfen oder von den Fähigkeiten Blitzfänger bzw. Sturmsog angezogen werden können. Schlägt fehl, wenn es kein Doppelkampf oder Battle Royale ist.", // NEEDS QC
		shortDesc: "Attacken der Gegner werden auf das Ziel umgelenkt.", // NEEDS QC

		start: "#followme",
		startFromZEffect: "#followme",
	},
	springtidestorm: {
		name: "Frühlingsorkan",
		desc: "Hat eine Chance von 30 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "30 % Chance auf -1 Angriff der Gegner.", // NEEDS QC
	},
	stealthrock: {
		name: "Tarnsteine",
		// Official flavor text: "Der Anwender legt eine Falle aus schwebenden Steinen aus, die gegnerische Pokémon verletzen, die in den Kampf gerufen werden."
		desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt. Schlägt fehl, wenn der Effekt bereits auf der gegnerischen Seite aktiv ist. Gegner verlieren 1/32, 1/16, 1/8, 1/4 oder 1/2 ihrer maximalen KP, abgerundet, je nach ihrer Schwäche gegen den Typ Gestein (0,25-fach, 0,5-fach, neutral, 2-fach bzw. 4-fach). Kann von der gegnerischen Seite entfernt werden, wenn ein Pokémon Aufräumen einsetzt oder ein Gegner Letalwirbler, Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		shortDesc: "Verletzt einwechselnde Gegner nach Gesteins-Schwäche.", // NEEDS QC
		gen8: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt. Schlägt fehl, wenn der Effekt bereits auf der gegnerischen Seite aktiv ist. Gegner verlieren 1/32, 1/16, 1/8, 1/4 oder 1/2 ihrer maximalen KP, abgerundet, je nach ihrer Schwäche gegen den Typ Gestein (0,25-fach, 0,5-fach, neutral, 2-fach bzw. 4-fach). Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		},
		gen5: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt. Schlägt fehl, wenn der Effekt bereits auf der gegnerischen Seite aktiv ist. Gegner verlieren 1/32, 1/16, 1/8, 1/4 oder 1/2 ihrer maximalen KP, abgerundet, je nach ihrer Schwäche gegen den Typ Gestein (0,25-fach, 0,5-fach, neutral, 2-fach bzw. 4-fach). Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		},

		start: "  Um {TEAM} schweben spitze Steine!",
		end: "  Die spitzen Steine um {TEAM} sind verschwunden!",
		damage: "  {POKEMON} wird von spitzen Steinen getroffen!",
	},
	steameruption: {
		name: "Dampfschwall",
		// Official flavor text: "Der Anwender feuert einen siedend heißen Dampfschwall auf das Ziel ab. Dieses kann dabei Verbrennungen erleiden."
		desc: "Hat eine Chance von 30 %, das Ziel zu verbrennen. Das Ziel wird aufgetaut, wenn es eingefroren war.", // NEEDS QC
		shortDesc: "30 % Chance auf Verbrennung. Taut das Ziel auf.", // NEEDS QC
	},
	steamroller: {
		name: "Quetschwalze",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
		gen5: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Der Schaden wird verdoppelt, wenn das Ziel Komprimator eingesetzt hat, seit es im Kampf ist.", // NEEDS QC
		},
	},
	steelbeam: {
		name: "Stahlstrahl",
		// Official flavor text: "Der Anwender schießt Stahl, den er in seinem ganzen Körper angesammelt hat, in Form eines mächtigen Strahls ab. Dabei verletzt er sich auch selbst."
		desc: "Ob diese Attacke gelingt oder nicht – und selbst wenn er dadurch kampfunfähig wird –, verliert der Anwender die Hälfte seiner maximalen KP, aufgerundet, außer er hat die Fähigkeit Magieschild.", // NEEDS QC
		shortDesc: "Der Anwender verliert die Hälfte seiner max. KP.", // NEEDS QC

		damage: "#mindblown",
	},
	steelroller: {
		name: "Eisenwalze",
		// Official flavor text: "Der Anwender greift an und zerstört dabei etwaige Felder. Ist kein Feld aktiv, schlägt die Attacke fehl."
		desc: "Schlägt fehl, wenn kein Feld aktiv ist. Beendet die Effekte von Elektrofeld, Grasfeld, Nebelfeld und Psychofeld.", // NEEDS QC
		shortDesc: "Beendet das aktive Feld; scheitert ohne Feld.", // NEEDS QC
	},
	steelwing: {
		name: "Stahlflügel",
		// Official flavor text: "Trifft das Ziel mit Stahlflügeln. Verteidigungs-Wert des Anwenders steigt eventuell."
		desc: "Hat eine Chance von 10 %, die Verteidigung des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "10 % Chance auf +1 Vert. des Anwenders.", // NEEDS QC
	},
	stickyweb: {
		name: "Klebenetz",
		// Official flavor text: "Der Anwender spinnt in der Umgebung des gegnerischen Teams ein klebriges Netz und senkt so die Initiative neu eingewechselter Pokémon."
		desc: "Legt auf der gegnerischen Seite eine Falle aus, die die Initiative jedes einwechselnden Gegners um eine Stufe senkt, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Schlägt fehl, wenn der Effekt bereits auf der gegnerischen Seite aktiv ist. Kann von der gegnerischen Seite entfernt werden, wenn ein Pokémon Aufräumen einsetzt oder ein Gegner Letalwirbler, Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		shortDesc: "-1 Init. für einwechselnde Gegner am Boden.", // NEEDS QC
		gen8: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, die die Initiative jedes einwechselnden Gegners um eine Stufe senkt, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Schlägt fehl, wenn der Effekt bereits auf der gegnerischen Seite aktiv ist. Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		},

		start: "  Am Boden um {TEAM} entspinnt sich ein Klebenetz!",
		end: "  Das Klebenetz um {TEAM} ist wieder verschwunden!",
		activate: "  {POKEMON} ist im Klebenetz gefangen!",
	},
	stockpile: {
		name: "Horter",
		// Official flavor text: "Lädt Kraft für später auf. Erhöht Verteidigung und Spezial-Verteidigung. Kann bis zu dreimal eingesetzt werden."
		desc: "Erhöht die Verteidigung und die Spezial-Verteidigung des Anwenders um eine Stufe. Der Horter-Zähler steigt um 1. Schlägt fehl, wenn der Zähler bei 3 liegt. Der Zähler wird auf 0 zurückgesetzt, wenn der Anwender das Feld verlässt.", // NEEDS QC
		shortDesc: "+1 Vert. und Sp.-Vert. Bis zu 3 Ladungen.", // NEEDS QC
		gen3: {
			desc: "Der Horter-Zähler des Anwenders steigt um 1. Schlägt fehl, wenn der Zähler bei 3 liegt. Der Zähler wird auf 0 zurückgesetzt, wenn der Anwender das Feld verlässt.", // NEEDS QC
			shortDesc: "Horter-Zähler +1. Maximal 3-mal.", // NEEDS QC
		},

		start: "  {POKEMON} hortet {NUMBER}!",
		end: "  Der gehortete Effekt von {POKEMON} hört auf zu wirken!",
	},
	stokedsparksurfer: {
		name: "Blitz-Wellenritt",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 100 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "100 % Chance auf Paralyse.", // NEEDS QC
	},
	stomp: {
		name: "Stampfer",
		// Official flavor text: "Stampfen mit dem Fuß. Das Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
		gen5: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Der Schaden wird verdoppelt, wenn das Ziel Komprimator eingesetzt hat, seit es im Kampf ist.", // NEEDS QC
		},
		gen4: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Die Stärke wird verdoppelt, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		},
		gen3: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Der Schaden wird verdoppelt, wenn das Ziel Komprimator eingesetzt hat, seit es im Kampf ist.", // NEEDS QC
		},
		gen2: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen. Die Stärke wird verdoppelt, wenn das Ziel unter dem Effekt von Komprimator steht.", // NEEDS QC
		},
		gen1: {
			desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		},
	},
	stompingtantrum: {
		name: "Fruststampfer",
		// Official flavor text: "Von Frust getrieben greift der Anwender an. Wenn seine vorige Attacke fehlgeschlagen ist, verdoppelt sich die Stärke der Attacke."
		desc: "Die Stärke wird verdoppelt, wenn die letzte Attacke des Anwenders in der Vorrunde – einschließlich durch andere Attacken aufgerufener oder über Kommando, Magiemantel, Übernahme oder die Fähigkeiten Tänzer bzw. Magiespiegel eingesetzter Attacken – keinen ihrer normalen Effekte erzielt hat (Schaden durch fehlgeschlagenes Turmkick, Sprungkick oder Knallkopf nicht mitgezählt), oder wenn der Anwender durch einen anderen Effekt als Erholung oder Freier Fall am Handeln gehindert wurde. Eine durch Bunker, Scanner, Königsschild, Schutzschild, Schutzstacheln, Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz blockierte Attacke verdoppelt die Stärke dieser Attacke nicht, ebenso wenig ein durch Erdanziehung, Katapult oder Tausend Pfeile vorzeitig beendetes Sprungfeder oder Fliegen.", // NEEDS QC
		shortDesc: "Doppelte Stärke nach fehlgeschlagener Attacke.", // NEEDS QC
	},
	stoneaxe: {
		name: "Felsaxt",
		desc: "Gelingt diese Attacke, legt sie auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner verletzt. Gegner verlieren 1/32, 1/16, 1/8, 1/4 oder 1/2 ihrer maximalen KP, abgerundet, je nach ihrer Schwäche gegen den Typ Gestein (0,25-fach, 0,5-fach, neutral, 2-fach bzw. 4-fach). Kann von der gegnerischen Seite entfernt werden, wenn ein Pokémon Aufräumen einsetzt oder ein Gegner Letalwirbler, Turbodreher oder Auflockern erfolgreich einsetzt oder von Auflockern getroffen wird.", // NEEDS QC
		shortDesc: "Legt Tarnsteine beim Gegner aus.", // NEEDS QC
	},
	stoneedge: {
		name: "Steinkante",
		// Official flavor text: "Anwender schleudert scharfe Steine auf das Ziel. Hohe Volltrefferquote."
		desc: "Hat eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Erhöhte Volltrefferquote.", // NEEDS QC
	},
	storedpower: {
		name: "Kraftvorrat",
		// Official flavor text: "Angriff mit angesparter Energie. Je stärker die Statuswerte des Anwenders erhöht wurden, desto mehr Schaden richtet diese Attacke an."
		desc: "Die Stärke beträgt 20 + (X × 20), wobei X die Summe der positiven Statusveränderungen des Anwenders ist.", // NEEDS QC
		shortDesc: "+20 Stärke pro Statuswert-Erhöhung des Anwenders.", // NEEDS QC
	},
	stormthrow: {
		name: "Bergsturm",
		// Official flavor text: "Ein Angriff mit voller Wucht und Volltreffergarantie."
		desc: "Diese Attacke ist immer ein Volltreffer, außer das Ziel steht unter dem Effekt von Beschwörung oder hat die Fähigkeit Kampfpanzer oder Panzerhaut.", // NEEDS QC
		shortDesc: "Ist immer ein Volltreffer.", // NEEDS QC
	},
	strangesteam: {
		name: "Wunderdampf",
		// Official flavor text: "Der Anwender stößt Dampf aus, mit dem er das Ziel angreift. Dieses wird eventuell verwirrt."
		desc: "Hat eine Chance von 20 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "20 % Chance auf Verwirrung.", // NEEDS QC
	},
	strength: {
		name: "Stärke",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	strengthsap: {
		name: "Kraftabsorber",
		// Official flavor text: "Ein Angriff, der die KP des Anwenders um die Höhe des Angriffs-Werts des Zieles heilt. Anschließend wird der Angriff des Zieles gesenkt."
		desc: "Senkt den Angriff des Ziels um eine Stufe. Der Anwender stellt KP in Höhe des Angriffswerts des Ziels wieder her, berechnet mit dessen Stufe vor dem Einsatz. Trägt der Anwender eine Großwurzel, werden die wiederhergestellten KP mit 1,3 multipliziert, ab 0,5 abgerundet. Schlägt fehl, wenn die Angriffs-Stufe des Ziels bei -6 liegt.", // NEEDS QC
		shortDesc: "Heilt um den Angriffs-Wert des Ziels; -1 Angriff.", // NEEDS QC
	},
	stringshot: {
		name: "Fadenschuss",
		// Official flavor text: "Umwickelt gegnerische Pokémon mit Fäden aus dem Mund und senkt ihren Initiative-Wert."
		desc: "Senkt die Initiative des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "-2 Initiative der Gegner.", // NEEDS QC
		gen5: {
			desc: "Senkt die Initiative des Ziels um eine Stufe.", // NEEDS QC
			shortDesc: "Senkt die Initiative der Gegner um 1.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Senkt die Initiative des Ziels um 1.", // NEEDS QC
		},
	},
	struggle: {
		name: "Verzweifler",
		// Official flavor text: "Angriff nur bei verbrauchten AP. Anwender verletzt sich selbst leicht."
		desc: "Fügt einem zufälligen Gegner typenlosen Schaden zu. Gelingt diese Attacke, verliert der Anwender 1/4 seiner maximalen KP, ab 0,5 aufgerundet, und die Fähigkeit Steinhaupt verhindert das nicht. Diese Attacke wird automatisch eingesetzt, wenn keine der bekannten Attacken gewählt werden kann.", // NEEDS QC
		shortDesc: "Der Anwender verliert 1/4 seiner max. KP.", // NEEDS QC
		gen6: {
			desc: "Fügt einem zufälligen angrenzenden Gegner typenlosen Schaden zu. Gelingt diese Attacke, verliert der Anwender 1/4 seiner maximalen KP, ab 0,5 aufgerundet, und die Fähigkeit Steinhaupt verhindert das nicht. Diese Attacke wird automatisch eingesetzt, wenn keine der bekannten Attacken gewählt werden kann.", // NEEDS QC
		},
		gen4: {
			desc: "Fügt einem zufälligen Gegner typenlosen Schaden zu. Gelingt diese Attacke, verliert der Anwender 1/4 seiner maximalen KP, abgerundet, und die Fähigkeit Steinhaupt verhindert das nicht. Diese Attacke wird automatisch eingesetzt, wenn keine der bekannten Attacken gewählt werden kann.", // NEEDS QC
		},
		gen3: {
			desc: "Fügt einem zufälligen Gegner typenlosen Schaden zu. Gelingt diese Attacke, erleidet der Anwender Schaden in Höhe von 1/4 der vom Ziel verlorenen KP, abgerundet, mindestens jedoch 1 KP, und die Fähigkeit Steinhaupt verhindert das nicht. Diese Attacke wird automatisch eingesetzt, wenn keine der bekannten Attacken gewählt werden kann.", // NEEDS QC
			shortDesc: "Anwender verliert 1/4 der KP, die das Ziel verlor.", // NEEDS QC
		},
		gen2: {
			desc: "Fügt typenlosen Schaden zu. Gelingt diese Attacke, erleidet der Anwender Schaden in Höhe von 1/4 der vom Ziel verlorenen KP, abgerundet, mindestens jedoch 1 KP. Diese Attacke wird automatisch eingesetzt, wenn keine der bekannten Attacken gewählt werden kann.", // NEEDS QC
		},
		gen1: {
			desc: "Fügt Schaden vom Typ Normal zu. Gelingt diese Attacke, erleidet der Anwender Schaden in Höhe von 1/2 der vom Ziel verlorenen KP, abgerundet, mindestens jedoch 1 KP. Diese Attacke wird automatisch eingesetzt, wenn keine der bekannten Attacken gewählt werden kann.", // NEEDS QC
			shortDesc: "Anwender verliert 1/2 der KP, die das Ziel verlor.", // NEEDS QC
		},
	},
	strugglebug: {
		name: "Käfertrutz",
		// Official flavor text: "Anwender leistet Widerstand und greift an. Der Spezial-Angriff der gegnerischen Pokémon sinkt."
		desc: "Hat eine Chance von 100 %, den Spezial-Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Sp.-Ang. der Gegner.", // NEEDS QC
	},
	stuffcheeks: {
		name: "Backenstopfer",
		// Official flavor text: "Der Anwender frisst die Beere, die er trägt, wodurch seine Verteidigung stark erhöht wird."
		desc: "Diese Attacke kann nur gewählt werden, wenn der Anwender eine Beere trägt. Der Anwender isst seine Beere und erhöht seine Verteidigung um 2 Stufen. Dieser Effekt wird weder durch die Fähigkeiten Tollpatsch oder Anspannung noch durch die Effekte von Itemsperre oder Magieraum verhindert. Schlägt fehl, wenn der Anwender keine Beere trägt.", // NEEDS QC
		shortDesc: "Isst die getragene Beere; +2 Verteidigung.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	stunspore: {
		name: "Stachelspore",
		// Official flavor text: "Verstreut lähmenden Puder, der das Ziel eventuell paralysiert."
		desc: "Paralysiert das Ziel.", // NEEDS QC
		shortDesc: "Paralysiert das Ziel.", // NEEDS QC
		gen3: {
			desc: "Paralysiert das Ziel. Diese Attacke ignoriert Typ-Immunität nicht.", // NEEDS QC
		},
		gen1: {
			desc: "Paralysiert das Ziel.", // NEEDS QC
		},
	},
	submission: {
		name: "Überroller",
		// Official flavor text: "Harte Körperattacke, bei der sich der Anwender selbst leicht verletzt."
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "1/4 Rückstoßschaden.", // NEEDS QC
		gen4: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der vom Ziel verlorenen KP, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		},
		gen2: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP. Trifft diese Attacke einen Delegator, beträgt der Rückstoßschaden immer 1 KP.", // NEEDS QC
		},
		gen1: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der verlorenen KP, abgerundet, aber mindestens 1 KP. Zerbricht diese Attacke den Delegator des Ziels, erleidet der Anwender keinen Rückstoßschaden.", // NEEDS QC
		},
	},
	substitute: {
		name: "Delegator",
		// Official flavor text: "Anwender setzt eine kleine Menge an KP ein, um einen Doppelgänger zu erzeugen, der für ihn Schläge einsteckt."
		desc: "Der Anwender opfert 1/4 seiner maximalen KP, abgerundet, um einen Delegator zu erschaffen, der ihn im Kampf vertritt. Der Delegator verschwindet, wenn er genug Schaden erlitten hat, der Anwender ausgewechselt oder kampfunfähig wird oder ein Pokémon Aufräumen einsetzt. Stafette kann den Delegator mit seinen verbleibenden KP an einen Mitstreiter weitergeben. Solange der Delegator nicht zerbricht, erleidet er den Schaden aller Attacken anderer Pokémon und schützt den Anwender vor Statuseffekten und Statusveränderungen durch andere Pokémon. Geräuschbasierte Attacken und Pokémon mit der Fähigkeit Schwebedurch ignorieren Delegatoren. Der Anwender erleidet hinter seinem Delegator weiterhin normalen Schaden durch Wetter und Statusprobleme. Zerbricht der Delegator während einer mehrfach treffenden Attacke, erleidet der Anwender den Schaden der restlichen Treffer. Wird ein Delegator erschaffen, während der Anwender von einer Klammer-Attacke festgehalten wird, endet dieser Effekt sofort. Schlägt fehl, wenn der Anwender nicht genug KP hat, um einen Delegator zu erschaffen, ohne kampfunfähig zu werden, oder er bereits einen Delegator hat.", // NEEDS QC
		shortDesc: "Erzeugt für 1/4 der max. KP einen Delegator.", // NEEDS QC
		gen8: {
			desc: "Der Anwender opfert 1/4 seiner maximalen KP, abgerundet, um einen Delegator zu erschaffen, der ihn im Kampf vertritt. Der Delegator verschwindet, wenn er genug Schaden erlitten hat oder der Anwender ausgewechselt oder kampfunfähig wird. Stafette kann den Delegator mit seinen verbleibenden KP an einen Mitstreiter weitergeben. Solange der Delegator nicht zerbricht, erleidet er den Schaden aller Attacken anderer Pokémon und schützt den Anwender vor Statuseffekten und Statusveränderungen durch andere Pokémon. Geräuschbasierte Attacken und Pokémon mit der Fähigkeit Schwebedurch ignorieren Delegatoren. Der Anwender erleidet hinter seinem Delegator weiterhin normalen Schaden durch Wetter und Statusprobleme. Zerbricht der Delegator während einer mehrfach treffenden Attacke, erleidet der Anwender den Schaden der restlichen Treffer. Wird ein Delegator erschaffen, während der Anwender von einer Klammer-Attacke festgehalten wird, endet dieser Effekt sofort. Schlägt fehl, wenn der Anwender nicht genug KP hat, um einen Delegator zu erschaffen, ohne kampfunfähig zu werden, oder er bereits einen Delegator hat.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender opfert 1/4 seiner maximalen KP, abgerundet, um einen Delegator zu erschaffen, der ihn im Kampf vertritt. Der Delegator verschwindet, wenn er genug Schaden erlitten hat oder der Anwender ausgewechselt oder kampfunfähig wird. Stafette kann den Delegator mit seinen verbleibenden KP an einen Mitstreiter weitergeben. Solange der Delegator nicht zerbricht, erleidet er den Schaden aller Attacken anderer Pokémon und schützt den Anwender vor Statuseffekten und Statusveränderungen durch andere Pokémon. Der Anwender erleidet hinter seinem Delegator weiterhin normalen Schaden durch Wetter und Statusprobleme. Zerbricht der Delegator während einer mehrfach treffenden Attacke, erleidet der Anwender den Schaden der restlichen Treffer. Wird ein Delegator erschaffen, während der Anwender von einer Klammer-Attacke festgehalten wird, endet dieser Effekt sofort. Schlägt fehl, wenn der Anwender nicht genug KP hat, um einen Delegator zu erschaffen, ohne kampfunfähig zu werden, oder er bereits einen Delegator hat.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender opfert 1/4 seiner maximalen KP, abgerundet, um einen Delegator zu erschaffen, der ihn im Kampf vertritt. Der Delegator hat 1 KP plus die zu seiner Erschaffung eingesetzten KP und verschwindet, wenn er genug Schaden oder 255 Schaden auf einmal erlitten hat oder der Anwender ausgewechselt oder kampfunfähig wird. Solange der Delegator nicht zerbricht, erleidet er den Schaden aller Attacken des Gegners und schützt den Anwender vor Statuseffekten und Statusveränderungen durch den Gegner, außer der Effekt ist Aussetzer, Egelsamen, Schlaf, primäre Paralyse oder sekundäre Verwirrung und der Delegator des Anwenders ist nicht zerbrochen. Der Anwender erleidet hinter seinem Delegator weiterhin normalen Schaden durch Statusprobleme; Verwirrungsschaden wird jedoch stattdessen dem Delegator des Gegners zugefügt. Zerbricht der Delegator während einer mehrfach treffenden Attacke, endet die Attacke. Schlägt fehl, wenn der Anwender nicht genug KP hat, um einen Delegator zu erschaffen, oder er bereits einen Delegator hat. Der Anwender erschafft einen Delegator und wird dann kampfunfähig, wenn seine aktuellen KP genau 1/4 seiner maximalen KP betragen.", // NEEDS QC
			shortDesc: "Opfert 1/4 der max. KP für einen Delegator.", // NEEDS QC
		},

		start: "  Ein Delegator von {POKEMON} ist erschienen!",
		alreadyStarted: "  {POKEMON} hat bereits einen Delegator!",
		end: "  Der Delegator von {POKEMON} hört auf zu wirken!",
		fail: "  Es ist zu schwach, um einen Delegator einzusetzen!",
		activate: "  Der Delegator steckt den Schlag für {POKEMON} ein!",
	},
	subzeroslammer: {
		name: "Tobender Geofrost",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	suckerpunch: {
		name: "Tiefschlag",
		// Official flavor text: "Erstschlag-Attacke, die aber nur gelingt, wenn das Ziel gerade eine Attacke vorbereitet, die KP-Schaden zufügen würde."
		desc: "Schlägt fehl, wenn das Ziel in dieser Runde keinen physischen Angriff, keinen speziellen Angriff und nicht Egotrip gewählt hat oder wenn es vor dem Anwender handelt.", // NEEDS QC
		shortDesc: "Meist zuerst. Nur wenn das Ziel angreift.", // NEEDS QC
		gen4: {
			desc: "Schlägt fehl, wenn das Ziel in dieser Runde keinen physischen oder speziellen Angriff gewählt hat oder wenn es vor dem Anwender handelt.", // NEEDS QC
		},
	},
	sunnyday: {
		name: "Sonnentag",
		// Official flavor text: "Die Sonne brennt unbarmherzig fünf Runden lang. Dadurch werden Attacken vom Typ Feuer verstärkt, während Wasser-Attacken abgeschwächt werden."
		desc: "5 Runden lang ist das Wetter Sonne. Währenddessen wird der Schaden von Attacken vom Typ Feuer mit 1,5 und der von Attacken vom Typ Wasser mit 0,5 multipliziert. Hält 8 Runden an, wenn der Anwender einen Heißbrocken trägt. Schlägt fehl, wenn das Wetter bereits Sonne ist.", // NEEDS QC
		shortDesc: "5 Runden Sonne: Feuer-Attacken stärker.", // NEEDS QC
		gen3: {
			desc: "5 Runden lang ist das Wetter Sonne. Währenddessen wird der Schaden von Attacken vom Typ Feuer mit 1,5 und der von Attacken vom Typ Wasser mit 0,5 multipliziert. Schlägt fehl, wenn das Wetter bereits Sonne ist.", // NEEDS QC
		},
		gen2: {
			desc: "5 Runden lang ist das Wetter Sonne, selbst wenn das Wetter bereits Sonne ist. Währenddessen wird der Schaden von Attacken vom Typ Feuer mit 1,5 und der von Attacken vom Typ Wasser mit 0,5 multipliziert.", // NEEDS QC
		},
	},
	sunsteelstrike: {
		name: "Stahlgestirn",
		// Official flavor text: "Der Anwender stürzt mit der Gewalt eines Meteors auf das Ziel. Die Fähigkeit des Zieles wird dabei ignoriert."
		desc: "Diese Attacke und ihre Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		shortDesc: "Ignoriert die Fähigkeiten anderer Pokémon.", // NEEDS QC
	},
	supercellslam: {
		name: "Donnerstoß",
		desc: "Schlägt dieser Angriff fehl, verliert der Anwender die Hälfte seiner maximalen KP, abgerundet, als Fehlschlagschaden. Pokémon mit der Fähigkeit Magieschild erleiden keinen Fehlschlagschaden. Der Schaden wird verdoppelt und die Genauigkeit nicht geprüft, wenn das Ziel seit dem Einwechseln Komprimator eingesetzt hat.", // NEEDS QC
		shortDesc: "Verfehlt sie, verliert der Anwender die halben max. KP.", // NEEDS QC

		damage: "#crash",
	},
	superfang: {
		name: "Superzahn",
		// Official flavor text: "Greift mit scharfen Reißzähnen an. KP des Zieles werden halbiert."
		desc: "Fügt dem Ziel Schaden in Höhe der Hälfte seiner aktuellen KP zu, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "Schaden in Höhe der halben aktuellen KP des Ziels.", // NEEDS QC
		gen1: {
			desc: "Fügt dem Ziel Schaden in Höhe der Hälfte seiner aktuellen KP zu, abgerundet, mindestens jedoch 1 KP. Diese Attacke ignoriert Typ-Immunität.", // NEEDS QC
			shortDesc: "Schaden = 1/2 der aktuellen KP. Trifft Geister.", // NEEDS QC
		},
	},
	superpower: {
		name: "Kraftkoloss",
		// Official flavor text: "Starke Attacke, die jedoch auch den Angriff und die Verteidigung des Anwenders senkt."
		desc: "Senkt den Angriff und die Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Ang. und Vert. des Anwenders.", // NEEDS QC
	},
	supersonic: {
		name: "Superschall",
		shortDesc: "Verwirrt das Ziel.", // NEEDS QC
	},
	supersonicskystrike: {
		name: "Finaler Steilflug",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	surf: {
		name: "Surfer",
		// Official flavor text: "Anwender greift mit einer gewaltigen Welle alle Pokémon im Umkreis an."
		desc: "Der Schaden wird verdoppelt, wenn das Ziel gerade Taucher einsetzt.", // NEEDS QC
		shortDesc: "Trifft Nachbarn. Doppelt gegen Taucher.", // NEEDS QC
		gen4: {
			desc: "Die Stärke wird verdoppelt, wenn das Ziel gerade Taucher einsetzt.", // NEEDS QC
			shortDesc: "Trifft alle Nachbarn. 2x Stärke gegen Taucher.", // NEEDS QC
		},
		gen2: {
			desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
			shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		},
		gen3: {
			shortDesc: "Trifft alle Gegner. 2x Stärke gegen Taucher.", // NEEDS QC
		},
	},
	surgingstrikes: {
		name: "Trefferschwall",
		// Official flavor text: "Der Anwender hat den Stil des Wassers gemeistert und führt mit fließenden Bewegungen drei Angriffe in Folge mit Volltreffergarantie aus."
		desc: "Trifft dreimal. Diese Attacke ist immer ein Volltreffer, außer das Ziel steht unter dem Effekt von Beschwörung oder hat die Fähigkeit Kampfpanzer oder Panzerhaut.", // NEEDS QC
		shortDesc: "Trifft 3-mal, immer als Volltreffer.", // NEEDS QC
	},
	swagger: {
		name: "Angeberei",
		// Official flavor text: "Verwirrt das Ziel und erhöht dessen Angriffs-Wert stark."
		desc: "Erhöht den Angriff des Ziels um 2 Stufen und verwirrt es.", // NEEDS QC
		shortDesc: "+2 Angriff für das Ziel, verwirrt es aber.", // NEEDS QC
		gen2: {
			desc: "Erhöht den Angriff des Ziels um 2 Stufen und verwirrt es. Diese Attacke verfehlt, wenn der Angriff des Ziels nicht erhöht werden kann.", // NEEDS QC
		},
	},
	swallow: {
		name: "Verzehrer",
		// Official flavor text: "Absorbiert die gehortete Kraft, um KP aufzufüllen. Je mehr Energie gehortet wurde, desto mehr KP werden aufgefüllt."
		desc: "Der Anwender stellt KP je nach seinem Horter-Zähler wieder her: 1/4 seiner maximalen KP bei 1, die Hälfte bei 2, ab 0,5 abgerundet, und alle KP bei 3. Schlägt fehl, wenn der Zähler bei 0 liegt. Verteidigung und Spezial-Verteidigung des Anwenders sinken um so viele Stufen, wie Horter sie erhöht hatte, und der Zähler wird auf 0 zurückgesetzt.", // NEEDS QC
		shortDesc: "Heilt je nach Horter-Ladungen.", // NEEDS QC
		gen4: {
			desc: "Der Anwender stellt KP je nach seinem Horter-Zähler wieder her: 1/4 seiner maximalen KP bei 1, die Hälfte bei 2, abgerundet, und alle KP bei 3. Schlägt fehl, wenn der Zähler bei 0 liegt. Verteidigung und Spezial-Verteidigung des Anwenders sinken um so viele Stufen, wie Horter sie erhöht hatte, und der Zähler wird auf 0 zurückgesetzt.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender stellt KP je nach seinem Horter-Zähler wieder her: 1/4 seiner maximalen KP bei 1, die Hälfte bei 2, ab 0,5 abgerundet, und alle KP bei 3. Schlägt fehl, wenn der Zähler bei 0 liegt. Der Zähler wird auf 0 zurückgesetzt.", // NEEDS QC
		},
	},
	sweetkiss: {
		name: "Bitterkuss",
		shortDesc: "Verwirrt das Ziel.", // NEEDS QC
	},
	sweetscent: {
		name: "Lockduft",
		// Official flavor text: "Senkt den Ausweichwert der gegnerischen Pokémon stark."
		desc: "Senkt den Fluchtwert des Ziels um 2 Stufen.", // NEEDS QC
		shortDesc: "-2 Fluchtwert der Gegner.", // NEEDS QC
		gen5: {
			desc: "Senkt den Fluchtwert des Ziels um eine Stufe.", // NEEDS QC
			shortDesc: "Senkt den Fluchtwert der Gegner um 1.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Senkt den Fluchtwert des Ziels um 1.", // NEEDS QC
		},
	},
	swift: {
		name: "Sternschauer",
		// Official flavor text: "Verschießt sternförmige Strahlen, die stets treffen, auf gegnerische Pokémon."
		desc: "Diese Attacke prüft keine Genauigkeit.", // NEEDS QC
		shortDesc: "Prüft keine Genauigkeit. Trifft die Gegner.", // NEEDS QC
		gen1: {
			desc: "Diese Attacke prüft keine Genauigkeit und trifft selbst, wenn das Ziel gerade Schaufler oder Fliegen einsetzt.", // NEEDS QC
			shortDesc: "Verfehlt nie, selbst gegen Schaufler und Fliegen.", // NEEDS QC
		},
		gen2: {
			shortDesc: "Prüft keine Genauigkeit.", // NEEDS QC
		},
	},
	switcheroo: {
		name: "Wechseldich",
		// Official flavor text: "Anwender tauscht in Windeseile sein getragenes Item mit dem des Zieles."
		desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen oder wenn der Anwender versucht, Blauer Edelstein, Roter Edelstein, Adamantkristall, Weißkristall, Platinumkristall, eine Tafel, ein Modul, eine Disc, Rostiges Schwert, Rostiger Schild, eine Energiekapsel oder eine Maske jeweils Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta, einem Paradox-Pokémon oder Ogerpon zu geben oder abzunehmen. In diesem Fall zählen zu den Paradox-Pokémon alle Arten mit den Fähigkeiten Paläosynthese und Quantenantrieb, außer Keilflamme, Furienblitz, Eisenfels und Eisenhaupt. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		shortDesc: "Tauscht sein Item mit dem des Ziels.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen oder wenn der Anwender versucht, Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul, eine Disc, Rostiges Schwert oder Rostiger Schild jeweils Kyogre, Groudon, Giratina, Arceus, Genesect, Amigento, Zacian oder Zamazenta zu geben oder abzunehmen. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen, wenn einer von beiden einen Z-Kristall trägt, wenn der Anwender versucht, einen Mega-Stein der Art zu geben oder abzunehmen, die sich damit mega-entwickeln kann, oder wenn er versucht, Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul oder eine Disc jeweils Kyogre, Groudon, Giratina, Arceus, Genesect oder Amigento zu geben oder abzunehmen. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen, wenn der Anwender versucht, einen Mega-Stein der Art zu geben oder abzunehmen, die sich damit mega-entwickeln kann, oder wenn er versucht, Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel oder ein Modul jeweils Kyogre, Groudon, Giratina, Arceus oder Genesect zu geben oder abzunehmen. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen, wenn einer von beiden einen Brief trägt oder wenn der Anwender versucht, Platinum-Orb, eine Tafel oder ein Modul jeweils Giratina, Arceus oder Genesect zu geben oder abzunehmen. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen, wenn einer von beiden einen Brief oder Platinum-Orb trägt, wenn einer von beiden die Fähigkeit Variabilität hat, wenn einer von beiden unter dem Effekt von Abschlag steht oder wenn das Ziel die Fähigkeit Klebekörper hat.", // NEEDS QC
		},

		activate: "#trick",
	},
	swordsdance: {
		name: "Schwerttanz",
		// Official flavor text: "Ein wilder Tanz, der den Kampfgeist wecken soll. Der Angriffs-Wert des Anwenders wird stark erhöht."
		desc: "Erhöht den Angriff des Anwenders um 2 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Angriff des Anwenders um 2 Stufen.", // NEEDS QC
	},
	synchronoise: {
		name: "Synchrolärm",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Das Ziel ist immun, wenn es keinen Typ mit dem Anwender teilt.", // NEEDS QC
		shortDesc: "Trifft Nachbarn mit gemeinsamem Typ.", // NEEDS QC
	},
	synthesis: {
		name: "Synthese",
		// Official flavor text: "Füllt KP des Anwenders auf. Die Menge hängt vom Wetter ab."
		desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn Luftströmungen aktiv sind, kein Wetter herrscht oder er einen Allzweckschirm trägt; 2/3 seiner maximalen KP, wenn das Wetter Gleißende Sonne oder Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Strömender Regen, Regen, Sandsturm oder Schnee ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Heilt den Anwender je nach Wetter.", // NEEDS QC
		gen8: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn Luftströmungen aktiv sind, kein Wetter herrscht oder er einen Allzweckschirm trägt; 2/3 seiner maximalen KP, wenn das Wetter Gleißende Sonne oder Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Strömender Regen, Regen oder Sandsturm ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn Luftströmungen aktiv sind oder kein Wetter herrscht; 2/3 seiner maximalen KP, wenn das Wetter Gleißende Sonne oder Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Strömender Regen, Regen oder Sandsturm ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn kein Wetter herrscht; 2/3 seiner maximalen KP, wenn das Wetter Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Regen oder Sandsturm ist, jeweils ab 0,5 abgerundet.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn kein Wetter herrscht; 2/3 seiner maximalen KP, wenn das Wetter Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Hagelsturm, Regen oder Sandsturm ist, jeweils abgerundet.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender stellt die Hälfte seiner maximalen KP wieder her, wenn kein Wetter herrscht; alle seine KP, wenn das Wetter Sonne ist; und 1/4 seiner maximalen KP, wenn das Wetter Regen oder Sandsturm ist, jeweils abgerundet.", // NEEDS QC
		},
	},
	syrupbomb: {
		name: "Sirupbombe",
		desc: "Gelingt diese Attacke, sinkt die Initiative des Ziels 3 Runden lang am Ende jeder Runde um eine Stufe.", // NEEDS QC
		shortDesc: "Das Ziel verliert 3 Runden lang je -1 Init.", // NEEDS QC

		start: "  {POKEMON} wurde in Sirup gehüllt!",
	},
	tackle: {
		name: "Tackle",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	tachyoncutter: {
		name: "Tachyon-Schnitt",
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers. Diese Attacke prüft keine Genauigkeit.", // NEEDS QC
		shortDesc: "Trifft 2-mal; trifft immer.", // NEEDS QC
	},
	tailglow: {
		name: "Schweifglanz",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Erhöht den Spezial-Angriff des Anwenders um 3 Stufen.", // NEEDS QC
		shortDesc: "Erhöht Sp.-Ang. des Anwenders um 3 Stufen.", // NEEDS QC
		gen4: {
			desc: "Erhöht den Spezial-Angriff des Anwenders um 2 Stufen.", // NEEDS QC
			shortDesc: "Erhöht Sp.-Ang. des Anwenders um 2 Stufen.", // NEEDS QC
		},
	},
	tailslap: {
		name: "Kehrschelle",
		// Official flavor text: "Anwender greift das Ziel mit seiner schlagfesten Rute zwei- bis fünfmal hintereinander an."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Trifft 2- bis 5-mal in einer Runde.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
	},
	tailwhip: {
		name: "Rutenschlag",
		// Official flavor text: "Der Anwender wedelt niedlich mit dem Schweif und veranlasst Gegner dadurch, nachlässig zu werden. Senkt die Verteidigung der gegnerischen Pokémon."
		desc: "Senkt die Verteidigung des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Verteidigung der Gegner.", // NEEDS QC
		gen2: {
			shortDesc: "Senkt die Verteidigung des Ziels um 1.", // NEEDS QC
		},
	},
	tailwind: {
		name: "Rückenwind",
		// Official flavor text: "Anwender erzeugt einen Wirbelwind, der die Initiative aller Pokémon im Team für vier Runden erhöht."
		desc: "4 Runden lang ist die Initiative des Anwenders und seines Teams verdoppelt. Schlägt fehl, wenn dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "4 Runden: doppelte Initiative im eigenen Team.", // NEEDS QC
		gen4: {
			desc: "3 Runden lang ist die Initiative des Anwenders und seines Teams verdoppelt. Schlägt fehl, wenn dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
			shortDesc: "3 Runden: doppelte Initiative im eigenen Team.", // NEEDS QC
		},

		start: "  {TEAM:capitalize} erhalten Rückenwind!",
		end: "  Der Rückenwind für {TEAM} hat sich gelegt!",
	},
	takedown: {
		name: "Bodycheck",
		// Official flavor text: "Rücksichtslose Attacke, bei der sich der Anwender selbst leicht verletzt."
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "1/4 Rückstoßschaden.", // NEEDS QC
		gen4: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der vom Ziel verlorenen KP, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		},
		gen2: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP. Trifft diese Attacke einen Delegator, beträgt der Rückstoßschaden immer 1 KP.", // NEEDS QC
		},
		gen1: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der verlorenen KP, abgerundet, aber mindestens 1 KP. Zerbricht diese Attacke den Delegator des Ziels, erleidet der Anwender keinen Rückstoßschaden.", // NEEDS QC
		},
	},
	takeheart: {
		name: "Mutschub",
		desc: "Heilt das Statusproblem des Anwenders. Erhöht seinen Spezial-Angriff und seine Spezial-Verteidigung um eine Stufe.", // NEEDS QC
		shortDesc: "Heilt eigenen Status; +1 Sp.-Ang. und Sp.-Vert.", // NEEDS QC
	},
	tarshot: {
		name: "Teerschuss",
		// Official flavor text: "Der Anwender übergießt das Ziel mit klebrigem Teer und senkt so dessen Initiative. Dadurch wird es schwach gegenüber Feuer-Attacken."
		desc: "Senkt die Initiative des Ziels um eine Stufe. Bis das Ziel den Kampf verlässt, wird die Effektivität von Attacken vom Typ Feuer gegen es verdoppelt.", // NEEDS QC
		shortDesc: "-1 Init.; das Ziel wird anfällig gegen Feuer.", // NEEDS QC

		start: "  {POKEMON} ist nun schwach gegenüber Feuer-Attacken!",
	},
	taunt: {
		name: "Verhöhner",
		// Official flavor text: "Bringt das Ziel in Rage. Dieses kann über drei Runden hinweg nur noch angreifen."
		desc: "Das Ziel kann in seinen nächsten drei Runden keine nicht schädigenden Attacken einsetzen. Pokémon mit der Fähigkeit Dösigkeit oder unter dem Schutz der Fähigkeit Dufthülle sind immun.", // NEEDS QC
		shortDesc: "Das Ziel kann 3 Runden keine Status-Attacken nutzen.", // NEEDS QC
		gen7: {
			desc: "Das Ziel kann in seinen nächsten drei Runden keine nicht schädigenden Attacken einsetzen. Pokémon mit der Fähigkeit Dösigkeit oder unter dem Schutz der Fähigkeit Dufthülle sind immun. Mit Z-Kraft verstärkte Attacken können während des Effekts weiterhin gewählt und eingesetzt werden.", // NEEDS QC
		},
		gen6: {
			desc: "Das Ziel kann in seinen nächsten drei Runden keine nicht schädigenden Attacken einsetzen. Pokémon mit der Fähigkeit Dösigkeit oder unter dem Schutz der Fähigkeit Dufthülle sind immun.", // NEEDS QC
		},
		gen5: {
			desc: "Das Ziel kann in seinen nächsten drei Runden keine nicht schädigenden Attacken einsetzen.", // NEEDS QC
		},
		gen4: {
			desc: "3 bis 5 Runden lang kann das Ziel keine nicht schädigenden Attacken einsetzen.", // NEEDS QC
			shortDesc: "Das Ziel kann 3-5 Runden keine Status-Attacken nutzen.", // NEEDS QC
		},
		gen3: {
			desc: "2 Runden lang kann das Ziel keine nicht schädigenden Attacken einsetzen.", // NEEDS QC
			shortDesc: "Das Ziel kann 2 Runden keine Status-Attacken nutzen.", // NEEDS QC
		},

		start: "  {POKEMON} fällt auf Verhöhner herein!",
		end: "  Verhöhner wirkt nicht mehr auf {POKEMON}!",
		cant: "{POKEMON} kann {MOVE} nach Verhöhner nicht einsetzen!",
	},
	tearfullook: {
		name: "Tränendrüse",
		// Official flavor text: "Dem Anwender stehen Tränen in den Augen, wodurch das Ziel seinen Kampfeswillen verliert. Angriff und Spezial-Angriff des Zieles sinken."
		desc: "Senkt den Angriff und den Spezial-Angriff des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Angriff und Sp.-Ang. des Ziels um eine Stufe.", // NEEDS QC
	},
	teatime: {
		name: "Teatime",
		// Official flavor text: "Der Anwender lädt alle am Kampf beteiligten Pokémon zu einem Teekränzchen ein, woraufhin diese die Beeren essen, die sie bei sich tragen."
		desc: "Alle Pokémon im Kampf verzehren ihre getragene Beere. Dieser Effekt wird weder durch Delegatoren, noch durch die Fähigkeiten Tollpatsch oder Anspannung, noch durch die Effekte von Itemsperre oder Magieraum verhindert. Schlägt fehl, wenn kein Pokémon im Kampf eine Beere trägt.", // NEEDS QC
		shortDesc: "Alle aktiven Pokémon essen ihre Beeren.", // NEEDS QC

		activate: "  Alle Pokémon auf dem Kampffeld beschließen, sich ein Tässchen Tee und eine Beere zu gönnen!",
		fail: "  Aber nichts geschieht!",
	},
	technoblast: {
		name: "Techblaster",
		// Official flavor text: "Anwender feuert ein Lichtgeschoss auf das Ziel ab. Der Typ der Attacke hängt von dem des Moduls ab."
		desc: "Der Typ dieser Attacke hängt vom getragenen Modul des Anwenders ab.", // NEEDS QC
		shortDesc: "Typ je nach getragenem Modul.", // NEEDS QC
	},
	tectonicrage: {
		name: "Seismische Eruption",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	teeterdance: {
		name: "Taumeltanz",
		// Official flavor text: "Ein Wackeltanz, der alle Pokémon im Umkreis verwirrt."
		desc: "Verwirrt das Ziel.", // NEEDS QC
		shortDesc: "Verwirrt alle Nachbarn.", // NEEDS QC
	},
	telekinesis: {
		name: "Telekinese",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "3 Runden lang kann das Ziel keinem Angriff ausweichen außer K.O.-Attacken, solange es im Kampf bleibt. Während des Effekts ist das Ziel immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen, Klebenetz und der Fähigkeit Ausweglos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, erbt der Nachfolger den Effekt. Verwurzler, Katapult, Tausend Pfeile und der Eisenkugel haben Vorrang vor dieser Attacke, wenn das Ziel unter einem ihrer Effekte steht. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt oder dem von Verwurzler, Katapult oder Tausend Pfeile steht. Das Ziel ist gegen den Einsatz dieser Attacke immun, wenn seine Art Digda, Digdri, Alola Digda, Alola Digdri, Sankabuh, Colossand oder mega-entwickeltes Gengar ist. Mega-Gengar kann auf keine Weise unter diesem Effekt stehen.", // NEEDS QC
		shortDesc: "3 Runden: Ziel schwebt, wird aber immer getroffen.", // NEEDS QC
		gen6: {
			desc: "3 Runden lang kann das Ziel keinem Angriff ausweichen außer K.O.-Attacken, solange es im Kampf bleibt. Während des Effekts ist das Ziel immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen, Klebenetz und der Fähigkeit Ausweglos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, erbt der Nachfolger den Effekt. Verwurzler, Katapult, Tausend Pfeile und die Eisenkugel haben Vorrang vor dieser Attacke, wenn das Ziel unter einem ihrer Effekte steht. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt oder dem von Verwurzler, Katapult oder Tausend Pfeile steht. Das Ziel ist gegen den Einsatz dieser Attacke immun, wenn seine Art Digda, Digdri oder mega-entwickeltes Gengar ist. Mega-Gengar kann auf keine Weise unter diesem Effekt stehen.", // NEEDS QC
		},
		gen5: {
			desc: "3 Runden lang kann das Ziel keinem Angriff ausweichen außer K.O.-Attacken, solange es im Kampf bleibt. Während des Effekts ist das Ziel immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen und der Fähigkeit Ausweglos, solange es im Kampf bleibt. Setzt das Ziel Stafette ein, erbt der Nachfolger den Effekt. Verwurzler, Katapult und die Eisenkugel haben Vorrang vor dieser Attacke, wenn das Ziel unter einem ihrer Effekte steht. Schlägt fehl, wenn das Ziel bereits unter diesem Effekt oder dem von Verwurzler oder Katapult steht. Das Ziel ist gegen diese Attacke immun, wenn seine Art Digda oder Digdri ist.", // NEEDS QC
		},

		start: "  {POKEMON} wurde zum Schweben gebracht!",
		end: "  {POKEMON} wurde von der Wirkung von Telekinese befreit!",
	},
	teleport: {
		name: "Teleport",
		// Official flavor text: "Der Anwender tauscht den Platz mit einem anderen Team-Mitglied, sofern vorhanden. Setzen wilde Pokémon die Attacke ein, ergreifen diese die Flucht."
		desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, wird er ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn kein anderes Teammitglied kampffähig ist.", // NEEDS QC
		shortDesc: "Der Anwender wechselt aus.", // NEEDS QC
		gen7: {
			desc: "Schlägt beim Einsatz fehl.", // NEEDS QC
			shortDesc: "Schlägt beim Einsatz fehl.", // NEEDS QC
		},
	},
	temperflare: {
		name: "Frustflamme",
		desc: "Die Stärke wird verdoppelt, wenn die letzte Attacke des Anwenders in der Vorrunde – einschließlich durch andere Attacken aufgerufener oder über Kommando, Magiemantel, Übernahme oder die Fähigkeiten Tänzer bzw. Magiespiegel eingesetzter Attacken – keinen ihrer normalen Effekte erzielt hat (Schaden durch fehlgeschlagenes Turmkick, Sprungkick oder Knallkopf nicht mitgezählt), oder wenn der Anwender durch einen anderen Effekt als Erholung oder Freier Fall am Handeln gehindert wurde. Eine durch Bunker, Scanner, Königsschild, Schutzschild, Schutzstacheln, Trickschutz, Tatami-Schild, Rapidschutz oder Rundumschutz blockierte Attacke verdoppelt die Stärke dieser Attacke nicht, ebenso wenig ein durch Erdanziehung, Katapult oder Tausend Pfeile vorzeitig beendetes Sprungfeder oder Fliegen.", // NEEDS QC
		shortDesc: "Doppelte Stärke nach fehlgeschlagener Attacke.", // NEEDS QC
	},
	terablast: {
		name: "Tera-Ausbruch",
		desc: "Ist der Anwender terakristallisiert, wird diese Attacke zu einem physischen Angriff, wenn sein Angriff höher ist als sein Spezial-Angriff, einschließlich Statusveränderungen, und ihr Typ wird zum Tera-Typ des Anwenders. Ist der Tera-Typ zudem Stellar, hat diese Attacke 100 Stärke, ist sehr effektiv gegen terakristallisierte Ziele und neutral gegen andere, und senkt den Angriff und den Spezial-Angriff des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "Terakristallisiert: Tera-Typ; physisch bei mehr Ang.", // NEEDS QC
	},
	terastarstorm: {
		name: "Tera-Sternhagel",
		desc: "Ist der Anwender ein Terapagos in der Stellarform, wird der Typ dieser Attacke zu Stellar, sie trifft alle Gegner und wird zu einem physischen Angriff, wenn der Angriff des Anwenders höher ist als sein Spezial-Angriff, einschließlich Statusveränderungen.", // NEEDS QC
		shortDesc: "Terapagos (Stellarform): Stellar-Typ, trifft beide.", // NEEDS QC
	},
	terrainpulse: {
		name: "Feldimpuls",
		// Official flavor text: "Der Anwender nutzt die Kraft des aktiven Feldes für seinen Angriff. Der Typ und die Stärke der Attacke ändern sich je nach Art des aktiven Feldes."
		desc: "Die Stärke wird verdoppelt, wenn der Anwender am Boden ist und ein Feld vorliegt, und der Typ dieser Attacke ändert sich entsprechend: Typ Elektro auf einem Elektrofeld, Typ Pflanze auf einem Grasfeld, Typ Fee auf einem Nebelfeld und Typ Psycho auf einem Psychofeld.", // NEEDS QC
		shortDesc: "In Feldern: doppelte Stärke, Typ variiert.", // NEEDS QC
	},
	thief: {
		name: "Raub",
		// Official flavor text: "Ermöglicht es, das Item des Zieles zu stehlen, solang der Anwender selbst keins bei sich trägt."
		desc: "Gelingt dieser Angriff und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es Blauer Edelstein, Roter Edelstein, Adamantkristall, Weißkristall, Platinumkristall, eine Tafel, ein Modul, eine Disc, Rostiges Schwert, Rostiger Schild, eine Energiekapsel oder eine Maske ist, getragen jeweils von Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta, einem Paradox-Pokémon oder Ogerpon, oder wenn der Anwender eine dieser Arten ist und das Ziel das entsprechende Item trägt. In diesem Fall zählen zu den Paradox-Pokémon alle Arten mit den Fähigkeiten Paläosynthese und Quantenantrieb, außer Keilflamme, Furienblitz, Eisenfels und Eisenhaupt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		shortDesc: "Ohne eigenes Item stiehlt er das des Ziels.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "War dieser Angriff erfolgreich und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul, eine Disc, Rostiges Schwert oder Rostiger Schild ist und jeweils von Kyogre, Groudon, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta getragen wird, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen7: {
			desc: "War dieser Angriff erfolgreich und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es ein Z-Kristall ist, ein Mega-Stein, der von der Art getragen wird, die sich damit mega-entwickeln kann, oder Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul oder eine Disc, jeweils getragen von Kyogre, Groudon, Giratina, Arceus, Genesect, Amigento, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen6: {
			desc: "War dieser Angriff erfolgreich und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es ein Mega-Stein ist, der von der Art getragen wird, die sich damit mega-entwickeln kann, oder Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel oder ein Modul, jeweils getragen von Kyogre, Groudon, Giratina, Arceus, Genesect, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen5: {
			desc: "War dieser Angriff erfolgreich und ist der Anwender nicht kampfunfähig, stiehlt er das getragene Item des Ziels, sofern er selbst keines trägt. Ein Ziel mit der Fähigkeit Klebekörper verliert sein Item nicht, solange es nicht kampfunfähig ist. Das Item wird nicht gestohlen, wenn es ein Brief ist oder Platinum-Orb, eine Tafel oder ein Modul, jeweils getragen von Giratina, Arceus oder Genesect, oder wenn der Anwender eine dieser Arten ist und das Ziel das jeweilige Item trägt. Durch diese Attacke verlorene Items können nicht mit Aufbereitung oder der Fähigkeit Reiche Ernte zurückgeholt werden.", // NEEDS QC
		},
		gen4: {
			desc: "War dieser Angriff erfolgreich und trägt der Anwender kein Item, stiehlt er das getragene Item des Ziels. Das Item wird nicht gestohlen, wenn es ein Brief oder Platinum-Orb ist oder das Ziel die Fähigkeit Variabilität oder Klebekörper hat. Durch diese Attacke verlorene Items können nicht mit Aufbereitung zurückgeholt werden.", // NEEDS QC
		},
		gen3: {
			desc: "War dieser Angriff erfolgreich und trägt der Anwender kein Item, stiehlt er das getragene Item des Ziels. Das Item wird nicht gestohlen, wenn es ein Brief oder eine Enigmabeere ist oder das Ziel die Fähigkeit Klebekörper hat. Durch diese Attacke verlorene Items können nicht mit Aufbereitung zurückgeholt werden.", // NEEDS QC
		},
		gen2: {
			desc: "Hat eine Chance von 100 %, das getragene Item des Ziels zu stehlen, sofern der Anwender selbst keines trägt. Das Item wird nicht gestohlen, wenn es ein Brief ist.", // NEEDS QC
		},
	},
	thousandarrows: {
		name: "Tausend Pfeile",
		// Official flavor text: "Die Attacke erfasst auch fliegende und schwebende Pokémon. Werden sie getroffen, fallen sie zu Boden."
		desc: "Diese Attacke kann Pokémon in der Luft treffen, also Pokémon vom Typ Flug, solche mit der Fähigkeit Schwebe, solche mit einem Luftballon und solche unter dem Effekt von Magnetflug oder Telekinese. Ist das Ziel vom Typ Flug und noch nicht am Boden, verursacht diese Attacke neutralen Schaden, unabhängig von seinen anderen Typen. Diese Attacke kann ein Ziel treffen, das gerade Sprungfeder, Fliegen oder Freier Fall einsetzt. Trifft sie ein Ziel unter dem Effekt von Sprungfeder, Fliegen, Magnetflug oder Telekinese, endet dieser Effekt. Ist das Ziel vom Typ Flug und hat in dieser Runde nicht Ruheort eingesetzt, oder hat es die Fähigkeit Schwebe, verliert es seine Immunität gegen Angriffe vom Typ Boden und die Fähigkeit Ausweglos, solange es im Kampf bleibt. Während des Effekts schlägt Magnetflug für das Ziel fehl und Telekinese schlägt gegen es fehl.", // NEEDS QC
		shortDesc: "Erdet die Gegner. Erster Treffer neutral gegen Flug.", // NEEDS QC
	},
	thousandwaves: {
		name: "Tausend Wellen",
		// Official flavor text: "Der Anwender greift mit einer Welle an, die dicht über dem Boden verläuft und alle Pokémon, die sie erfasst, an der Flucht hindert."
		desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt.", // NEEDS QC
		shortDesc: "Getroffene Gegner können nicht mehr auswechseln.", // NEEDS QC
		gen7: {
			desc: "Hindert das Ziel daran, sich auswechseln zu lassen. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Verlässt das Ziel das Feld mit Stafette, bleibt der Nachfolger gefangen. Der Effekt endet, wenn der Anwender das Feld verlässt.", // NEEDS QC
		},
	},
	thrash: {
		name: "Fuchtler",
		// Official flavor text: "Attacke über zwei bis drei Runden, die den Anwender danach verwirrt."
		desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff in der ersten Runde des Effekts oder der zweiten eines dreirundigen Effekts fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen und schläft der Anwender, wird sie nur eine Runde eingesetzt und verwirrt ihn nicht.", // NEEDS QC
		shortDesc: "Hält 2-3 Runden, verwirrt danach den Anwender.", // NEEDS QC
		gen6: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen angrenzenden Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff in der ersten Runde des Effekts oder der zweiten eines dreirundigen Effekts fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird am Ende der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er zu Rundenbeginn oder schlägt der Angriff gegen das Ziel fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender ist zwei oder drei Runden lang an diese Attacke gebunden und wird am Ende der letzten Runde des Effekts verwirrt, sofern er es nicht bereits ist. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Kann der Anwender nicht handeln, schläft er ein, wird er eingefroren oder schlägt der Angriff gegen das Ziel fehl, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen2: {
			desc: "Unabhängig davon, ob diese Attacke gelingt, ist der Anwender zwei oder drei Runden lang an sie gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, selbst wenn er bereits verwirrt ist. Kann der Anwender nicht handeln, endet der Effekt ohne Verwirrung. Wird diese Attacke durch Schlafrede aufgerufen, wird sie nur eine Runde eingesetzt und verwirrt den Anwender nicht.", // NEEDS QC
		},
		gen1: {
			desc: "Unabhängig davon, ob diese Attacke gelingt, ist der Anwender drei oder vier Runden lang an sie gebunden und wird direkt nach seiner Aktion in der letzten Runde des Effekts verwirrt, selbst wenn er bereits verwirrt ist. Kann der Anwender nicht handeln, endet der Effekt ohne Verwirrung. Während des Effekts wird die Genauigkeit dieser Attacke jede Runde mit der aktuell berechneten Genauigkeit einschließlich Statusveränderungen überschrieben, jedoch nicht auf weniger als 1/256 oder mehr als 255/256.", // NEEDS QC
			shortDesc: "Dauert 3-4 Runden. Verwirrt danach den Anwender.", // NEEDS QC
		},
	},
	throatchop: {
		name: "Neck Strike",
		// Official flavor text: "Das Pokémon, das von dieser Attacke getroffen wird, erleidet starke Schmerzen und kann deswegen zwei Runden lang keine Lärm-Attacken mehr einsetzen."
		desc: "2 Runden lang kann das Ziel keine geräuschbasierten Attacken einsetzen.", // NEEDS QC
		shortDesc: "Das Ziel kann 2 Runden keine Geräusch-Attacken nutzen.", // NEEDS QC
		gen7: {
			desc: "2 Runden lang kann das Ziel keine geräuschbasierten Attacken einsetzen. Mit Z-Kraft verstärkte geräuschbasierte Attacken können während des Effekts weiterhin gewählt und eingesetzt werden.", // NEEDS QC
		},

		cant: "{POKEMON} kann die Attacke durch die Wirkung von Neck Strike nicht einsetzen!",
	},
	thunder: {
		name: "Donner",
		// Official flavor text: "Eine verheerende Elektro-Attacke, die das Ziel eventuell paralysiert."
		desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Diese Attacke kann ein Ziel treffen, das gerade Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht. Ist das Wetter Strömender Regen oder Regen, prüft diese Attacke keine Genauigkeit. Ist das Wetter Gleißende Sonne oder Sonne, beträgt ihre Genauigkeit 50 %. Gegen ein Pokémon mit Allzweckschirm bleibt die Genauigkeit bei 70 %.", // NEEDS QC
		shortDesc: "30 % Paralyse. Trifft bei Regen immer.", // NEEDS QC
		gen7: {
			desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Diese Attacke kann ein Ziel treffen, das gerade Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht. Ist das Wetter Strömender Regen oder Regen, prüft diese Attacke keine Genauigkeit. Ist das Wetter Gleißende Sonne oder Sonne, beträgt ihre Genauigkeit 50 %.", // NEEDS QC
		},
		gen5: {
			desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Diese Attacke kann ein Ziel treffen, das gerade Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht. Ist das Wetter Regen, prüft diese Attacke keine Genauigkeit. Ist das Wetter Sonne, beträgt ihre Genauigkeit 50 %.", // NEEDS QC
		},
		gen4: {
			desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Diese Attacke kann ein Ziel treffen, das gerade Sprungfeder oder Fliegen einsetzt. Ist das Wetter Regen, prüft diese Attacke keine Genauigkeit. Ist das Wetter Sonne, beträgt ihre Genauigkeit 50 %.", // NEEDS QC
		},
		gen2: {
			desc: "Hat eine Chance von 30 %, das Ziel zu paralysieren. Diese Attacke kann ein Ziel treffen, das gerade Fliegen einsetzt. Ist das Wetter Regen, prüft diese Attacke keine Genauigkeit. Ist das Wetter Sonne, beträgt ihre Genauigkeit 50 %.", // NEEDS QC
		},
		gen1: {
			desc: "Hat eine Chance von 10 %, das Ziel zu paralysieren.", // NEEDS QC
			shortDesc: "10 % Chance auf Paralyse.", // NEEDS QC
		},
	},
	thunderbolt: {
		name: "Donnerblitz",
		// Official flavor text: "Eine starke Elektro-Attacke, die das Ziel eventuell paralysiert."
		desc: "Hat eine Chance von 10 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "10 % Chance auf Paralyse.", // NEEDS QC
	},
	thundercage: {
		name: "Blitzgefängnis",
		// Official flavor text: "Das Ziel wird für vier bis fünf Runden in einem elektrischen Käfig gefangen."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},

		start: "  {SOURCE} hat {POKEMON} eingesperrt!",
	},
	thunderclap: {
		name: "Sturmblitz",
		desc: "Schlägt fehl, wenn das Ziel in dieser Runde keinen physischen Angriff, keinen speziellen Angriff und nicht Egotrip gewählt hat oder wenn es vor dem Anwender handelt.", // NEEDS QC
		shortDesc: "Meist zuerst. Nur wenn das Ziel angreift.", // NEEDS QC
	},
	thunderfang: {
		name: "Donnerzahn",
		// Official flavor text: "Anwender beißt mit elektrifizierten Reißzähnen zu. Ziel schreckt eventuell zurück oder wird paralysiert."
		desc: "Hat eine Chance von 10 %, das Ziel zu paralysieren, und eine Chance von 10 %, es zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "Je 10 % Paralyse- und Zurückschreck-Chance.", // NEEDS QC
	},
	thunderouskick: {
		name: "Donnernder Tritt",
		// Official flavor text: "Der Anwender bringt das Ziel mit blitzschnellen Bewegungen durcheinander und tritt dann zu. Senkt die Verteidigung des Zieles."
		desc: "Hat eine Chance von 100 %, die Verteidigung des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Vert. des Ziels.", // NEEDS QC
	},
	thunderpunch: {
		name: "Donnerschlag",
		// Official flavor text: "Ein elektrischer Schlag, der das Ziel eventuell paralysiert."
		desc: "Hat eine Chance von 10 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "10 % Chance auf Paralyse.", // NEEDS QC
	},
	thundershock: {
		name: "Donnerschock",
		// Official flavor text: "Eine Elektro-Attacke, die das Ziel eventuell paralysiert."
		desc: "Hat eine Chance von 10 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "10 % Chance auf Paralyse.", // NEEDS QC
	},
	thunderwave: {
		name: "Donnerwelle",
		// Official flavor text: "Ein schwacher Stromstoß, der das Ziel paralysiert."
		desc: "Paralysiert das Ziel. Diese Attacke ignoriert Typ-Immunität nicht.", // NEEDS QC
		shortDesc: "Paralysiert das Ziel.", // NEEDS QC
	},
	tickle: {
		name: "Spaßkanone",
		// Official flavor text: "Bringt das Ziel zum Lachen und senkt dadurch dessen Angriff und Verteidigung."
		desc: "Senkt den Angriff und die Verteidigung des Ziels um eine Stufe.", // NEEDS QC
		shortDesc: "Senkt Angriff und Verteidigung des Ziels um eine Stufe.", // NEEDS QC
	},
	tidyup: {
		name: "Aufräumen",
		desc: "Erhöht den Angriff und die Initiative des Anwenders um eine Stufe. Entfernt die Delegatoren aller Pokémon im Kampf und beendet die Effekte von Stachler, Tarnsteine, Klebenetz und Giftspitzen auf beiden Seiten.", // NEEDS QC
		shortDesc: "+1 Ang. und Init.; entfernt Delegatoren und Fallen.", // NEEDS QC

		activate: "  Fertig aufgeräumt!",
	},
	topsyturvy: {
		name: "Invertigo",
		// Official flavor text: "Invertiert alle Statusveränderungen des Zieles."
		desc: "Die positiven Statusveränderungen des Ziels werden negativ und umgekehrt. Schlägt fehl, wenn alle Statusveränderungen des Ziels bei 0 liegen.", // NEEDS QC
		shortDesc: "Kehrt die Statusveränderungen des Ziels um.", // NEEDS QC
	},
	torchsong: {
		name: "Loderlied",
		desc: "Hat eine Chance von 100 %, den Spezial-Angriff des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "100 % Chance auf +1 Sp.-Ang. des Anwenders.", // NEEDS QC
	},
	torment: {
		name: "Folterknecht",
		// Official flavor text: "Erzürnt das Ziel, um wiederholten Einsatz derselben Attacke zu verhindern."
		desc: "Das Ziel kann nicht zweimal hintereinander dieselbe Attacke wählen. Dieser Effekt endet, wenn das Ziel den Kampf verlässt.", // NEEDS QC
		shortDesc: "Das Ziel kann keine Attacke zweimal in Folge wählen.", // NEEDS QC

		start: "  {POKEMON} wird der Attacke Folterknecht unterworfen!",
		end: "  Folterknecht wirkt nicht mehr auf {POKEMON}!",
	},
	toxic: {
		name: "Toxin",
		// Official flavor text: "Vergiftet das Ziel mit einem potenten Toxin schwer. Die Vergiftung wird von Runde zu Runde stärker."
		desc: "Vergiftet das Ziel schwer. Setzt ein Pokémon vom Typ Gift diese Attacke ein, kann das Ziel ihr nicht ausweichen, selbst wenn es sich mitten in einer Zwei-Runden-Attacke befindet.", // NEEDS QC
		shortDesc: "Vergiftet das Ziel schwer. Trifft von Gift-Typen immer.", // NEEDS QC
		gen5: {
			desc: "Vergiftet das Ziel schwer.", // NEEDS QC
			shortDesc: "Vergiftet das Ziel schwer.", // NEEDS QC
		},
	},
	toxicspikes: {
		name: "Giftspitzen",
		// Official flavor text: "Anwender legt eine Falle mit Giftdornen aus. In den Kampf eingewechselte gegnerische Pokémon werden vergiftet."
		desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner vergiftet, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Kann bis zu zweimal eingesetzt werden, bevor sie fehlschlägt. Gegner werden bei einer Schicht vergiftet und bei zwei Schichten schwer vergiftet. Kann von der gegnerischen Seite entfernt werden, wenn ein Pokémon Aufräumen einsetzt, ein Gegner Letalwirbler, Turbodreher oder Auflockern erfolgreich einsetzt, von Auflockern getroffen wird oder ein Pokémon vom Typ Gift am Boden eingewechselt wird. Bodyguard verhindert die Vergiftung der gegnerischen Seite beim Einwechseln, ein Delegator jedoch nicht.", // NEEDS QC
		shortDesc: "Vergiftet einwechselnde Gegner am Boden. Max. 2-mal.", // NEEDS QC
		gen8: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner vergiftet, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Kann bis zu zweimal eingesetzt werden, bevor sie fehlschlägt. Gegner werden bei einer Schicht vergiftet und bei zwei Schichten schwer vergiftet. Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher oder Auflockern erfolgreich einsetzt, von Auflockern getroffen wird oder ein Pokémon vom Typ Gift am Boden eingewechselt wird. Bodyguard verhindert die Vergiftung der gegnerischen Seite beim Einwechseln, ein Delegator jedoch nicht.", // NEEDS QC
		},
		gen5: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner vergiftet, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Kann bis zu zweimal eingesetzt werden, bevor sie fehlschlägt. Gegner werden bei einer Schicht vergiftet und bei zwei Schichten schwer vergiftet. Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher erfolgreich einsetzt, von Auflockern getroffen wird oder ein Pokémon vom Typ Gift am Boden eingewechselt wird. Bodyguard verhindert die Vergiftung der gegnerischen Seite beim Einwechseln, ein Delegator jedoch nicht.", // NEEDS QC
		},
		gen4: {
			desc: "Legt auf der gegnerischen Seite eine Falle aus, die jeden einwechselnden Gegner vergiftet, außer er ist vom Typ Flug oder hat die Fähigkeit Schwebe. Kann bis zu zweimal eingesetzt werden, bevor sie fehlschlägt. Gegner werden bei einer Schicht vergiftet und bei zwei Schichten schwer vergiftet. Kann von der gegnerischen Seite entfernt werden, wenn ein Gegner Turbodreher erfolgreich einsetzt, von Auflockern getroffen wird oder ein Pokémon vom Typ Gift am Boden eingewechselt wird. Bodyguard verhindert die Vergiftung beim Einwechseln, ebenso das Einwechseln mit einem Delegator.", // NEEDS QC
		},

		start: "  {TEAM:capitalize} sind überall von giftigen Stacheln umgeben!",
		end: "  Die giftigen Stacheln, die um {TEAM} herumlagen, sind verschwunden!",
	},
	toxicthread: {
		name: "Giftfaden",
		// Official flavor text: "Der Anwender schießt giftige Fäden auf das Ziel, das dadurch vergiftet wird. Außerdem sinkt seine Initiative."
		desc: "Senkt die Initiative des Ziels um eine Stufe und vergiftet es.", // NEEDS QC
		shortDesc: "-1 Initiative des Ziels und vergiftet es.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	trailblaze: {
		name: "Wegbereiter",
		desc: "Hat eine Chance von 100 %, die Initiative des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "100 % Chance auf +1 Init. des Anwenders.", // NEEDS QC
	},
	transform: {
		name: "Wandler",
		// Official flavor text: "Anwender verwandelt sich in ein Abbild des Zieles und kann so auf die gleichen Attacken zugreifen."
		desc: "Der Anwender verwandelt sich in das Ziel. Kopiert werden die aktuellen Statuswerte, Statusveränderungen, Typen, Attacken, die Fähigkeit, das Gewicht, das Geschlecht und das Aussehen des Ziels. Level und KP des Anwenders bleiben gleich, und jede kopierte Attacke erhält nur 5 AP, mit einem Maximum von je 5 AP. Der Anwender kann seine Form nicht mehr wechseln, falls er dazu in der Lage wäre. Diese Attacke schlägt fehl, wenn sie einen Delegator trifft, wenn Anwender oder Ziel bereits verwandelt sind oder einer von beiden hinter einer Illusion steht.", // NEEDS QC
		shortDesc: "Kopiert Werte, Attacken, Typen und Fähigkeit des Ziels.", // NEEDS QC
		gen4: {
			desc: "Der Anwender verwandelt sich in das Ziel. Kopiert werden die aktuellen Statuswerte, Statusveränderungen, Typen, Attacken, die Fähigkeit, das Gewicht, die IVs, die Art und das Aussehen des Ziels. Level und KP des Anwenders bleiben gleich, und jede kopierte Attacke erhält nur 5 AP. Diese Attacke schlägt fehl, wenn das Ziel verwandelt ist.", // NEEDS QC
		},
		gen2: {
			desc: "Der Anwender verwandelt sich in das Ziel. Kopiert werden die aktuellen Statuswerte, Statusveränderungen, Typen, Attacken, die DVs, die Art und das Aussehen des Ziels. Level und KP des Anwenders bleiben gleich, und jede kopierte Attacke erhält nur 5 AP. Diese Attacke schlägt fehl, wenn das Ziel verwandelt ist.", // NEEDS QC
			shortDesc: "Kopiert Werte, Attacken, Typen und Art des Ziels.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender verwandelt sich in das Ziel. Kopiert werden die aktuellen Statuswerte, Statusveränderungen, Typen, Attacken, die DVs, die Art und das Aussehen des Ziels. Level und KP des Anwenders bleiben gleich, und jede kopierte Attacke erhält nur 5 AP. Diese Attacke kann ein Ziel treffen, das gerade Schaufler oder Fliegen einsetzt.", // NEEDS QC
		},

		transform: "{POKEMON} verwandelt sich in {SPECIES}!",
	},
	triattack: {
		name: "Triplette",
		// Official flavor text: "Feuert drei Strahlen ab. Verursacht eventuell Paralyse, Verbrennung oder Einfrieren."
		desc: "Hat eine Chance von 20 %, das Ziel zu verbrennen, einzufrieren oder zu paralysieren.", // NEEDS QC
		shortDesc: "20 % Chance auf Paralyse, Verbrennung oder Einfrieren.", // NEEDS QC
		gen2: {
			desc: "Diese Attacke wählt zufällig Verbrennung, Einfrieren oder Paralyse und hat eine Chance von 20 %, dem Ziel diesen Status zuzufügen. Ist das Ziel eingefroren und wurde Verbrennung gewählt, taut es auf.", // NEEDS QC
		},
		gen1: {
			desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
			shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		},
	},
	trick: {
		name: "Trickbetrug",
		// Official flavor text: "Der Anwender überrumpelt das Ziel und tauscht mit ihm die getragenen Items."
		desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen oder wenn der Anwender versucht, Blauer Edelstein, Roter Edelstein, Adamantkristall, Weißkristall, Platinumkristall, eine Tafel, ein Modul, eine Disc, Rostiges Schwert, Rostiger Schild, eine Energiekapsel oder eine Maske jeweils Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Amigento, Zacian, Zamazenta, einem Paradox-Pokémon oder Ogerpon zu geben oder abzunehmen. In diesem Fall zählen zu den Paradox-Pokémon alle Arten mit den Fähigkeiten Paläosynthese und Quantenantrieb, außer Keilflamme, Furienblitz, Eisenfels und Eisenhaupt. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		shortDesc: "Tauscht sein Item mit dem des Ziels.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen8: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen oder wenn der Anwender versucht, Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul, eine Disc, Rostiges Schwert oder Rostiger Schild jeweils Kyogre, Groudon, Giratina, Arceus, Genesect, Amigento, Zacian oder Zamazenta zu geben oder abzunehmen. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen, wenn einer von beiden einen Z-Kristall trägt, wenn der Anwender versucht, einen Mega-Stein der Art zu geben oder abzunehmen, die sich damit mega-entwickeln kann, oder wenn er versucht, Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel, ein Modul oder eine Disc jeweils Kyogre, Groudon, Giratina, Arceus, Genesect oder Amigento zu geben oder abzunehmen. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen, wenn der Anwender versucht, einen Mega-Stein der Art zu geben oder abzunehmen, die sich damit mega-entwickeln kann, oder wenn er versucht, Blauer Edelstein, Roter Edelstein, Platinum-Orb, eine Tafel oder ein Modul jeweils Kyogre, Groudon, Giratina, Arceus oder Genesect zu geben oder abzunehmen. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen, wenn einer von beiden einen Brief trägt oder wenn der Anwender versucht, Platinum-Orb, eine Tafel oder ein Modul jeweils Giratina, Arceus oder Genesect zu geben oder abzunehmen. Das Ziel ist gegen diese Attacke immun, wenn es die Fähigkeit Klebekörper hat.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen, wenn einer von beiden einen Brief oder Platinum-Orb trägt, wenn einer von beiden die Fähigkeit Variabilität hat, wenn einer von beiden unter dem Effekt von Abschlag steht oder wenn das Ziel die Fähigkeit Klebekörper hat.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender tauscht sein getragenes Item mit dem des Ziels. Schlägt fehl, wenn weder Anwender noch Ziel ein Item tragen, wenn einer von beiden einen Brief trägt, wenn einer von beiden unter dem Effekt von Abschlag steht oder wenn das Ziel die Fähigkeit Klebekörper hat.", // NEEDS QC
		},

		activate: "  {POKEMON} tauscht Items mit dem Ziel!",
	},
	trickortreat: {
		name: "Halloween",
		// Official flavor text: "Der Anwender lehrt das Ziel das Fürchten. Dieses nimmt dadurch zusätzlich den Typ Geist an."
		desc: "Fügt dem Ziel den Typ Geist hinzu, sodass es zwei oder drei Typen hat. Schlägt fehl, wenn das Ziel bereits vom Typ Geist ist. Fügt Waldesfluch dem Ziel einen Typ hinzu, ersetzt dieser den durch diese Attacke hinzugefügten und umgekehrt.", // NEEDS QC
		shortDesc: "Das Ziel erhält zusätzlich den Geist-Typ.", // NEEDS QC
	},
	trickroom: {
		name: "Bizarroraum",
		// Official flavor text: "Anwender erzeugt einen bizarren Raum, in dem langsame Pokémon fünf Runden lang zuerst agieren."
		desc: "5 Runden lang wird die Initiative jedes Pokémon zur Bestimmung der Zugreihenfolge neu berechnet. Während des Effekts gilt die Initiative jedes Pokémon als (10000 - seine normale Initiative); übersteigt dieser Wert 8191, werden 8192 abgezogen. Wird diese Attacke während des Effekts eingesetzt, endet er.", // NEEDS QC
		shortDesc: "Handelt zuletzt. 5 Runden: Zugreihenfolge umgekehrt.", // NEEDS QC
		gen4: {
			desc: "5 Runden lang handeln alle Pokémon mit niedrigerer Initiative vor denen mit höherer, innerhalb ihrer Prioritätsstufen. Wird diese Attacke während des Effekts eingesetzt, endet er.", // NEEDS QC
		},
	},
	triplearrows: {
		name: "Drillingspfeile",
		desc: "Hat eine Chance von 50 %, die Verteidigung des Ziels um eine Stufe zu senken, eine Chance von 30 %, es zurückschrecken zu lassen, und eine erhöhte Volltrefferquote.", // NEEDS QC
		shortDesc: "Oft Volltreffer. 50 % -1 Vert., 30 % Zurückschrecken.", // NEEDS QC
	},
	tripleaxel: {
		name: "Dreifach-Axel",
		// Official flavor text: "Tritt das Ziel ein- bis dreimal nacheinander. Die Härte der Tritte nimmt von Treffer zu Treffer zu."
		desc: "Trifft dreimal. Die Stärke steigt beim zweiten Treffer auf 40 und beim dritten auf 60. Diese Attacke prüft die Genauigkeit bei jedem Treffer, und der Angriff endet, wenn das Ziel einem ausweicht. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer dreimal.", // NEEDS QC
		shortDesc: "Trifft 3-mal. Jeder kann verfehlen, wird aber stärker.", // NEEDS QC
	},
	tripledive: {
		name: "Tauchtriade",
		desc: "Trifft dreimal.", // NEEDS QC
		shortDesc: "Trifft 3-mal.", // NEEDS QC
	},
	triplekick: {
		name: "Dreifachkick",
		// Official flavor text: "Tritt das Ziel ein- bis dreimal nacheinander. Die Härte der Tritte nimmt von Treffer zu Treffer zu."
		desc: "Trifft dreimal. Die Stärke steigt beim zweiten Treffer auf 20 und beim dritten auf 30. Diese Attacke prüft die Genauigkeit bei jedem Treffer, und der Angriff endet, wenn das Ziel einem ausweicht. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer dreimal.", // NEEDS QC
		shortDesc: "Trifft 3-mal. Jeder kann verfehlen, wird aber stärker.", // NEEDS QC
		gen4: {
			desc: "Trifft dreimal. Die Stärke steigt beim zweiten Treffer auf 20 und beim dritten auf 30. Diese Attacke prüft die Genauigkeit bei jedem Treffer, und der Angriff endet, wenn das Ziel einem ausweicht. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Zahl der Treffer nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft dreimal. Die Stärke steigt beim zweiten Treffer auf 20 und beim dritten auf 30. Diese Attacke prüft die Genauigkeit bei jedem Treffer, und der Angriff endet, wenn das Ziel einem ausweicht. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer.", // NEEDS QC
		},
		gen2: {
			desc: "Trifft zufällig ein- bis dreimal. Die Stärke steigt beim zweiten Treffer auf 20 und beim dritten auf 30.", // NEEDS QC
			shortDesc: "Trifft 1-3-mal. Stärke steigt pro Treffer.", // NEEDS QC
		},
	},
	tropkick: {
		name: "Tropenkick",
		// Official flavor text: "Der Anwender greift das Ziel mit einem heftigen Tritt tropischer Herkunft an. Dabei sinkt auch der Angriffs-Wert des Zieles."
		desc: "Hat eine Chance von 100 %, den Angriff des Ziels um eine Stufe zu senken.", // NEEDS QC
		shortDesc: "100 % Chance auf -1 Ang. des Ziels.", // NEEDS QC
	},
	trumpcard: {
		name: "Trumpfkarte",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke hängt von den verbleibenden AP nach normalem AP-Verbrauch und dem Effekt der Fähigkeit Erzwinger ab: 200 Stärke bei 0 AP, 80 bei 1 AP, 60 bei 2 AP, 50 bei 3 AP und 40 bei 4 oder mehr AP.", // NEEDS QC
		shortDesc: "Je weniger AP übrig, desto stärker.", // NEEDS QC
	},
	twinbeam: {
		name: "Doppelstrahl",
		desc: "Trifft zweimal. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		shortDesc: "Trifft 2-mal in einer Runde.", // NEEDS QC
	},
	twineedle: {
		name: "Duonadel",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Trifft zweimal, wobei jeder Treffer eine Chance von 20 % hat, das Ziel zu vergiften. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		shortDesc: "Trifft 2-mal. Je 20 % Chance auf Vergiftung.", // NEEDS QC
		gen4: {
			desc: "Trifft zweimal, wobei jeder Treffer eine Chance von 20 % hat, das Ziel zu vergiften. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers. Trägt das Ziel einen Fokusgurt und hatte es volle KP, als diese Attacke begann, wird es unabhängig von der Zahl der Treffer nicht kampfunfähig.", // NEEDS QC
		},
		gen3: {
			desc: "Trifft zweimal, wobei jeder Treffer eine Chance von 20 % hat, das Ziel zu vergiften. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers.", // NEEDS QC
		},
		gen2: {
			desc: "Trifft zweimal, wobei der zweite Treffer eine Chance von 20 % hat, das Ziel zu vergiften. Zerbricht der erste Treffer den Delegator des Ziels, erleidet es den Schaden des zweiten Treffers, kann durch ihn aber nicht vergiftet werden.", // NEEDS QC
			shortDesc: "Trifft 2-mal. Letzter Treffer: 20 % Gift-Chance.", // NEEDS QC
		},
		gen1: {
			desc: "Trifft zweimal, wobei der zweite Treffer eine Chance von 20 % hat, das Ziel zu vergiften. Zerbricht der erste Treffer den Delegator des Ziels, endet die Attacke.", // NEEDS QC
		},
	},
	twinkletackle: {
		name: "Entzückender Sternenstoß",
		shortDesc: "Stärke je nach Z-Kraft der Basis-Attacke.", // NEEDS QC
	},
	twister: {
		name: "Windhose",
		// Official flavor text: "Trifft gegnerische Pokémon mit einem heftigen Wirbelsturm, was diese eventuell zurückschrecken lässt."
		desc: "Hat eine Chance von 20 %, das Ziel zurückschrecken zu lassen. Die Stärke wird verdoppelt, wenn das Ziel gerade Sprungfeder, Fliegen oder Freier Fall einsetzt oder unter dem Effekt von Freier Fall steht.", // NEEDS QC
		shortDesc: "20 % Chance auf Zurückschrecken.", // NEEDS QC
		gen4: {
			desc: "Hat eine Chance von 20 %, das Ziel zurückschrecken zu lassen. Die Stärke wird verdoppelt, wenn das Ziel gerade Sprungfeder oder Fliegen einsetzt.", // NEEDS QC
		},
		gen2: {
			desc: "Hat eine Chance von 20 %, das Ziel zurückschrecken zu lassen. Die Stärke wird verdoppelt, wenn das Ziel gerade Fliegen einsetzt.", // NEEDS QC
			shortDesc: "20 % Chance auf Zurückschrecken.", // NEEDS QC
		},
	},
	upperhand: {
		name: "Schnellkonter",
		desc: "Hat eine Chance von 100 %, das Ziel zurückschrecken zu lassen. Schlägt fehl, wenn das Ziel in dieser Runde keinen physischen oder speziellen Angriff mit veränderter Priorität über 0 gewählt hat oder wenn es vor dem Anwender handelt.", // NEEDS QC
		shortDesc: "100 % Zurückschrecken; nur gegen Prioritätsangriffe.", // NEEDS QC
	},
	uproar: {
		name: "Aufruhr",
		// Official flavor text: "Anwender greift an, indem er über drei Runden hinweg einen Aufruhr erzeugt. Verhindert Schlaf."
		desc: "Der Anwender ist drei Runden lang an diese Attacke gebunden. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. In der ersten der drei Runden wachen alle schlafenden Pokémon im Kampf auf. Während der drei Runden kann kein Pokémon im Kampf auf irgendeine Weise einschlafen, und während des Effekts eingewechselte Pokémon wachen nicht auf. Kann der Anwender nicht handeln oder schlägt der Angriff in einer der Runden gegen das Ziel fehl, endet der Effekt.", // NEEDS QC
		shortDesc: "3 Runden Lärm: kein Pokémon kann einschlafen.", // NEEDS QC
		gen6: {
			desc: "Der Anwender ist drei Runden lang an diese Attacke gebunden. Diese Attacke zielt jede Runde auf einen zufälligen angrenzenden Gegner. In der ersten der drei Runden wachen alle schlafenden Pokémon im Kampf auf. Während der drei Runden kann kein Pokémon im Kampf auf irgendeine Weise einschlafen, und während des Effekts eingewechselte Pokémon wachen nicht auf. Kann der Anwender nicht handeln oder schlägt der Angriff in einer der Runden gegen das Ziel fehl, endet der Effekt.", // NEEDS QC
		},
		gen4: {
			desc: "Der Anwender ist drei bis sechs Runden lang an diese Attacke gebunden. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Während des Effekts kann kein Pokémon im Kampf auf irgendeine Weise einschlafen, und bereits schlafende Pokémon wachen zu Beginn ihres Zuges oder am Ende jeder Runde auf, einschließlich der letzten. Kann der Anwender nicht handeln oder schlägt der Angriff in einer der Runden gegen das Ziel fehl, endet der Effekt.", // NEEDS QC
			shortDesc: "Dauert 3-6 Runden. Niemand kann einschlafen.", // NEEDS QC
		},
		gen3: {
			desc: "Der Anwender ist zwei bis fünf Runden lang an diese Attacke gebunden. Diese Attacke zielt jede Runde auf einen zufälligen Gegner. Während des Effekts kann kein Pokémon im Kampf auf irgendeine Weise einschlafen, und bereits schlafende Pokémon wachen zu Beginn ihres Zuges oder am Ende jeder Runde auf, einschließlich der letzten. Kann der Anwender nicht handeln oder schlägt der Angriff in einer der Runden gegen das Ziel fehl, endet der Effekt.", // NEEDS QC
			shortDesc: "Dauert 2-5 Runden. Niemand kann einschlafen.", // NEEDS QC
		},

		start: "  {POKEMON} verursacht Aufruhr!",
		end: "  {POKEMON} beruhigt sich!",
		upkeep: "  {POKEMON} ist in Aufruhr!",
		block: "  Aber der Aufruhr hält {POKEMON} wach!",
		blockSelf: "  {POKEMON} kann bei dem Aufruhr nicht schlafen!",
	},
	uturn: {
		name: "Kehrtwende",
		// Official flavor text: "Nach der Attacke eilt der Anwender zurück und tauscht den Platz mit einem anderen Pokémon."
		desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, wird er ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn kein anderes Teammitglied kampffähig ist oder das Ziel durch einen Fluchtknopf oder die Fähigkeiten Rückzug bzw. Reißaus ausgewechselt wurde.", // NEEDS QC
		shortDesc: "Der Anwender wechselt nach dem Angriff aus.", // NEEDS QC
		gen6: {
			desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, wird er ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn kein anderes Teammitglied kampffähig ist oder das Ziel durch einen Fluchtknopf ausgewechselt wurde.", // NEEDS QC
		},
		gen4: {
			desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, wird er ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn kein anderes Teammitglied kampffähig ist.", // NEEDS QC
		},

		switchOut: "{POKEMON} kommt zu {TRAINER} zurück!",
	},
	vacuumwave: {
		name: "Vakuumwelle",
		// Official flavor text: "Erstschlag-Attacke, bei der ein Faustwirbel eine Vakuumwelle auf das Ziel sendet."
		desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		shortDesc: "Handelt meist zuerst (Priorität +1).", // NEEDS QC
	},
	vcreate: {
		name: "V-Generator",
		// Official flavor text: "Eine Verzweiflungsattacke. Anwender entfacht glühend heißes Feuer. Senkt dessen Verteidigung, Spezial-Verteidigung und Initiative."
		desc: "Senkt die Initiative, die Verteidigung und die Spezial-Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "-1 Vert., Sp.-Vert. und Init. des Anwenders.", // NEEDS QC
	},
	veeveevolley: {
		name: "Evo-Crash",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke beträgt (Freundschaft des Anwenders × 2/5), abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Max. Freundschaft: 102 Stärke. Verfehlt nie.", // NEEDS QC
	},
	venomdrench: {
		name: "Giftfalle",
		// Official flavor text: "Anwender bespritzt das Ziel mit einer speziellen Giftflüssigkeit. Senkt den Angriff, den Spezial-Angriff und die Initiative von vergifteten Zielen."
		desc: "Senkt Angriff, Spezial-Angriff und Initiative des Ziels um eine Stufe, wenn es vergiftet ist. Schlägt fehl, wenn das Ziel nicht vergiftet ist.", // NEEDS QC
		shortDesc: "-1 Ang., Sp.-Ang. und Init. vergifteter Gegner.", // NEEDS QC
	},
	venoshock: {
		name: "Giftschock",
		// Official flavor text: "Überschüttet das Ziel mit einer speziellen toxischen Flüssigkeit. Doppelt so stark gegen vergiftete Ziele."
		desc: "Die Stärke wird verdoppelt, wenn das Ziel vergiftet ist.", // NEEDS QC
		shortDesc: "Doppelte Stärke gegen vergiftete Ziele.", // NEEDS QC
	},
	victorydance: {
		name: "Siegestanz",
		desc: "Erhöht den Angriff, die Verteidigung und die Initiative des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Ang., Vert. und Init. des Anwenders.", // NEEDS QC
	},
	vinewhip: {
		name: "Rankenhieb",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	visegrip: {
		name: "Klammer",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	vitalthrow: {
		name: "Überwurf",
		// Official flavor text: "Anwender greift als Letzter an, hat dafür aber eine Treffergarantie beim eigenen Angriff."
		desc: "Diese Attacke prüft keine Genauigkeit.", // NEEDS QC
		shortDesc: "Handelt zuletzt, trifft aber immer.", // NEEDS QC
	},
	voltswitch: {
		name: "Voltwechsel",
		// Official flavor text: "Nach der Attacke eilt der Anwender zurück und tauscht den Platz mit einem anderen Pokémon."
		desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, wird er ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn kein anderes Teammitglied kampffähig ist oder das Ziel durch einen Fluchtknopf oder die Fähigkeiten Rückzug bzw. Reißaus ausgewechselt wurde.", // NEEDS QC
		shortDesc: "Der Anwender wechselt nach dem Angriff aus.", // NEEDS QC
		gen6: {
			desc: "Gelingt diese Attacke und ist der Anwender nicht kampfunfähig, wird er ausgewechselt, selbst wenn er festgehalten wird, und sofort durch ein gewähltes Teammitglied ersetzt. Der Anwender wird nicht ausgewechselt, wenn kein anderes Teammitglied kampffähig ist oder das Ziel durch einen Fluchtknopf ausgewechselt wurde.", // NEEDS QC
		},

		switchOut: "#uturn",
	},
	volttackle: {
		name: "Volttackle",
		// Official flavor text: "Angriff mit Elektro-Tackle. Der Anwender nimmt dabei selbst großen Schaden. Das Ziel wird eventuell paralysiert."
		desc: "Hat eine Chance von 10 %, das Ziel zu paralysieren. Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 33 % der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "33 % Rückstoß. 10 % Chance auf Paralyse.", // NEEDS QC
		gen4: {
			desc: "Hat eine Chance von 10 %, das Ziel zu paralysieren. Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/3 der vom Ziel verlorenen KP, abgerundet, mindestens jedoch 1 KP.", // NEEDS QC
			shortDesc: "1/3 Rückstoß. 10 % Chance auf Paralyse.", // NEEDS QC
		},
		gen3: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/3 der verlorenen KP, abgerundet, aber mindestens 1 KP.", // NEEDS QC
			shortDesc: "Hat 1/3 Rückstoß.", // NEEDS QC
		},
	},
	wakeupslap: {
		name: "Weckruf",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke wird verdoppelt, wenn das Ziel schläft. Ist der Anwender nicht kampfunfähig, wacht das Ziel auf.", // NEEDS QC
		shortDesc: "Doppelt gegen Schlafende, weckt sie aber auf.", // NEEDS QC
		gen4: {
			desc: "Die Stärke wird verdoppelt, wenn das Ziel schläft. Gelingt diese Attacke, wacht das Ziel auf.", // NEEDS QC
		},
	},
	waterfall: {
		name: "Kaskade",
		// Official flavor text: "Eine mächtige Attacke, durch die das Ziel eventuell zurückschreckt."
		desc: "Hat eine Chance von 20 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "20 % Chance auf Zurückschrecken.", // NEEDS QC
		gen3: {
			desc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
			shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
		},
	},
	watergun: {
		name: "Aquaknarre",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	waterpledge: {
		name: "Wassersäulen",
		// Official flavor text: "Ein Angriff mit Wassersäulen. Mit Feuersäulen kombiniert steigt die Wirkung und ein Regenbogen erscheint."
		desc: "Hat ein Mitstreiter des Anwenders in dieser Runde Feuersäulen oder Pflanzensäulen gewählt und noch nicht gehandelt, handelt er direkt nach dem Anwender und dessen Attacke bewirkt nichts. In Kombination mit Feuersäulen setzt der Mitstreiter Wassersäulen mit 150 Stärke ein und ein Regenbogen erscheint 4 Runden lang auf der Seite des Anwenders, der die Sekundäreffekt-Chancen verdoppelt und mit der Fähigkeit Edelmut kumulierbar ist – Effekte, die zurückschrecken lassen, können ihre Chance jedoch nur einmal verdoppeln. In Kombination mit Pflanzensäulen setzt der Mitstreiter Pflanzensäulen mit 150 Stärke ein und ein Sumpf erscheint 4 Runden lang auf der Seite des Ziels, der die Initiative jedes Pokémon dieser Seite viertelt. Als Kombi-Attacke erhält diese Attacke den Typenbonus unabhängig vom Typ des Anwenders. Diese Attacke verbraucht das Wasserjuwel des Anwenders nicht und kann nicht durch die Fähigkeit Sturmsog umgelenkt werden.", // NEEDS QC
		shortDesc: "Mit Pflanzen-/Feuersäulen: Zusatzeffekt.", // NEEDS QC

		activate: "  {POKEMON} wartet auf {TARGET}...",
		start: "  Für {TEAM} erscheint ein Regenbogen am Himmel!",
		end: "  Der Regenbogen für {TEAM} ist verschwunden!",
	},
	waterpulse: {
		name: "Aquawelle",
		// Official flavor text: "Angriff mit Wasserwelle, die das Ziel eventuell verwirren kann."
		desc: "Hat eine Chance von 20 %, das Ziel zu verwirren.", // NEEDS QC
		shortDesc: "20 % Chance auf Verwirrung.", // NEEDS QC
	},
	watershuriken: {
		name: "Wasser-Shuriken",
		// Official flavor text: "Der Anwender schleudert dem Ziel Wurfsterne aus einem verdickten Sekret entgegen. Diese Erstschlag-Attacke trifft zwei- bis fünfmal."
		desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal. Ist der Anwender ein Ash-Quajutsu mit der Fähigkeit Freundschaftsakt, hat diese Attacke 20 Stärke und trifft immer dreimal. Trägt der Anwender einen Gezinkter Würfel, trifft diese Attacke 4- oder 5-mal.", // NEEDS QC
		shortDesc: "Meist zuerst. Trifft 2- bis 5-mal.", // NEEDS QC
		gen8: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
		gen6: {
			desc: "Trifft zwei- bis fünfmal. Trifft mit einer Chance von 35 % zwei- oder dreimal und mit einer Chance von 15 % vier- oder fünfmal. Zerbricht einer der Treffer den Delegator des Ziels, erleidet es den Schaden der restlichen Treffer. Hat der Anwender die Fähigkeit Wertelink, trifft diese Attacke immer fünfmal.", // NEEDS QC
		},
	},
	watersport: {
		name: "Nassmacher",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "5 Runden lang wird die Stärke aller Attacken vom Typ Feuer von Pokémon im Kampf mit 0,33 multipliziert. Schlägt fehl, wenn dieser Effekt bereits aktiv ist.", // NEEDS QC
		shortDesc: "5 Runden: Feuer-Attacken auf 1/3 geschwächt.", // NEEDS QC
		gen5: {
			desc: "Solange der Anwender im Kampf ist, wird die Stärke aller Attacken vom Typ Feuer von Pokémon im Kampf mit 0,33 multipliziert. Schlägt fehl, wenn dieser Effekt bereits für ein Pokémon aktiv ist.", // NEEDS QC
			shortDesc: "Schwächt Feuer-Attacken auf 1/3 ihrer Stärke.", // NEEDS QC
		},
		gen4: {
			desc: "Solange der Anwender im Kampf ist, wird die Stärke aller Attacken vom Typ Feuer von Pokémon im Kampf halbiert. Schlägt fehl, wenn dieser Effekt bereits für den Anwender aktiv ist. Stafette kann diesen Effekt an einen Mitstreiter übertragen.", // NEEDS QC
			shortDesc: "Schwächt Feuer-Attacken auf 1/2 ihrer Stärke.", // NEEDS QC
		},
	},
	waterspout: {
		name: "Fontränen",
		// Official flavor text: "Eine Wasser-Attacke gegen gegnerische Pokémon. Je höher die KP des Anwenders sind, desto mehr Schaden richtet sie an."
		desc: "Die Stärke beträgt (aktuelle KP des Anwenders × 150 / maximale KP des Anwenders), abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Schwächer bei weniger KP. Trifft die Gegner.", // NEEDS QC
	},
	wavecrash: {
		name: "Wellentackle",
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 33 % der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "33 % Rückstoßschaden.", // NEEDS QC
	},
	weatherball: {
		name: "Meteorologe",
		// Official flavor text: "Typ und Stärke der Attacke sind vom Wetter zum Zeitpunkt der Anwendung abhängig."
		desc: "Die Stärke wird verdoppelt, wenn ein anderes Wetter als Luftströmungen aktiv sind, und der Typ dieser Attacke ändert sich entsprechend: Typ Eis bei Schnee, Typ Wasser bei Strömendem Regen oder Regen, Typ Gestein bei Sandsturm und Typ Feuer bei Gleißender Sonne oder Sonne. Trägt der Anwender einen Allzweckschirm und setzt diese Attacke bei Strömendem Regen, Regen, Gleißende Sonne oder Sonne ein, bleibt sie vom Typ Normal und ihre Stärke wird nicht verdoppelt.", // NEEDS QC
		shortDesc: "Bei Wetter: doppelte Stärke, Typ variiert.", // NEEDS QC
		gen8: {
			desc: "Die Stärke wird verdoppelt, wenn ein anderes Wetter als Luftströmungen aktiv sind, und der Typ dieser Attacke ändert sich entsprechend: Typ Eis bei Hagelsturm, Typ Wasser bei Strömendem Regen oder Regen, Typ Gestein bei Sandsturm und Typ Feuer bei Gleißender Sonne oder Sonne. Trägt der Anwender einen Allzweckschirm und setzt diese Attacke bei Strömendem Regen, Regen, Gleißende Sonne oder Sonne ein, bleibt sie vom Typ Normal und ihre Stärke wird nicht verdoppelt.", // NEEDS QC
		},
		gen5: {
			desc: "Die Stärke wird verdoppelt, wenn ein Wetter aktiv ist, und der Typ dieser Attacke ändert sich entsprechend: Typ Eis bei Hagelsturm, Typ Wasser bei Regen, Typ Gestein bei Sandsturm und Typ Feuer bei Sonne.", // NEEDS QC
		},
		gen3: {
			desc: "Der Schaden wird verdoppelt, wenn ein Wetter aktiv ist, und der Typ dieser Attacke ändert sich entsprechend: Typ Eis bei Hagelsturm, Typ Wasser bei Regen, Typ Gestein bei Sandsturm und Typ Feuer bei Sonne.", // NEEDS QC
			shortDesc: "Bei Wetter: 2x Schaden und passender Typ.", // NEEDS QC
		},

		move: "Hyper-Sprintangriff wurde durch das Wetter zu {MOVE}!",
	},
	whirlpool: {
		name: "Whirlpool",
		// Official flavor text: "Das Ziel wird für vier bis fünf Runden in einer Wasserhose gefangen."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen7: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP (1/8 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang (immer fünf mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
			shortDesc: "Fängt und schädigt das Ziel 2-5 Runden lang.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es Stafette einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},

		start: "  {POKEMON} wird in dem Strudel gefangen!",
	},
	whirlwind: {
		name: "Wirbelwind",
		// Official flavor text: "Weht das Ziel weg und ersetzt es durch ein anderes Pokémon. In der Wildnis endet der Kampf."
		desc: "Das Ziel wird gezwungen, das Feld zu verlassen, und durch einen zufällig gewählten kampffähigen Mitstreiter ersetzt. Schlägt fehl, wenn das Ziel das letzte kampffähige Pokémon seines Teams ist, Verwurzler eingesetzt hat oder die Fähigkeit Saugnapf hat.", // NEEDS QC
		shortDesc: "Tauscht das Ziel gegen einen zufälligen Mitstreiter.", // NEEDS QC
		gen4: {
			desc: "Das Ziel wird gezwungen, das Feld zu verlassen, und durch einen zufällig gewählten kampffähigen Mitstreiter ersetzt. Schlägt fehl, wenn das Ziel das letzte kampffähige Pokémon seines Teams ist, Verwurzler eingesetzt hat oder die Fähigkeit Saugnapf hat, oder wenn das Level des Anwenders niedriger als das des Ziels ist und X × (Level des Anwenders + Level des Ziels) / 256 + 1 kleiner oder gleich (Level des Ziels / 4) ist, abgerundet, wobei X eine Zufallszahl zwischen 0 und 255 ist.", // NEEDS QC
		},
		gen2: {
			desc: "Das Ziel wird gezwungen, das Feld zu verlassen, und durch einen zufällig gewählten kampffähigen Mitstreiter ersetzt. Schlägt fehl, wenn das Ziel das letzte kampffähige Pokémon seines Teams ist oder der Anwender vor dem Ziel handelt.", // NEEDS QC
		},
		gen1: {
			desc: "Kein Nutzen im Kampf.", // NEEDS QC
			shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC
		},
	},
	wickedblow: {
		name: "Finstertreffer",
		// Official flavor text: "Der Anwender hat den Stil des Unlichts gemeistert und führt einen fokussierten, harten Schlag mit Volltreffergarantie aus."
		desc: "Diese Attacke ist immer ein Volltreffer, außer das Ziel steht unter dem Effekt von Beschwörung oder hat die Fähigkeit Kampfpanzer oder Panzerhaut.", // NEEDS QC
		shortDesc: "Ist immer ein Volltreffer.", // NEEDS QC
	},
	wickedtorque: {
		name: "Finsterturbo",
		desc: "Hat eine Chance von 10 %, das Ziel einzuschläfern.", // NEEDS QC
		shortDesc: "10 % Chance auf Schlaf.", // NEEDS QC
	},
	wideguard: {
		name: "Rundumschutz",
		// Official flavor text: "Schützt eine Runde lang vor Angriffen, die alle Pokémon auf der Seite des Anwenders treffen."
		desc: "Der Anwender und sein Team sind in dieser Runde vor Attacken anderer Pokémon geschützt, auch von Mitstreitern, die alle benachbarten Gegner oder alle benachbarten Pokémon treffen. Diese Attacke verändert denselben 1-zu-X-Zähler wie die anderen Schutz-Attacken, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht, nutzt diese Chance aber nicht zur Fehlschlagsprüfung. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Flammenschild, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Fadenfalle, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		shortDesc: "Schützt das Team diese Runde vor Mehrfach-Zielen.", // NEEDS QC
		gen8: {
			desc: "Der Anwender und sein Team sind in dieser Runde vor Attacken anderer Pokémon geschützt, auch von Mitstreitern, die alle benachbarten Gegner oder alle benachbarten Pokémon treffen. Diese Attacke verändert denselben 1-zu-X-Zähler wie die anderen Schutz-Attacken, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht, nutzt diese Chance aber nicht zur Fehlschlagsprüfung. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Dyna-Wall, Abblocker, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		},
		gen7: {
			desc: "Der Anwender und sein Team sind in dieser Runde vor Attacken anderer Pokémon geschützt, auch von Mitstreitern, die alle benachbarten Gegner oder alle benachbarten Pokémon treffen. Diese Attacke verändert denselben 1-zu-X-Zähler wie die anderen Schutz-Attacken, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht, nutzt diese Chance aber nicht zur Fehlschlagsprüfung. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Bunker, Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		},
		gen6: {
			desc: "Der Anwender und sein Team sind in dieser Runde vor schädigenden Angriffen anderer Pokémon geschützt, auch von Mitstreitern, die alle benachbarten Gegner oder alle benachbarten Pokémon treffen. Diese Attacke verändert denselben 1-zu-X-Zähler wie die anderen Schutz-Attacken, wobei X bei 1 beginnt und sich bei jedem Erfolg verdreifacht, nutzt diese Chance aber nicht zur Fehlschlagsprüfung. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt, wenn die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Königsschild, Schutzschild, Rapidschutz, Schutzstacheln oder Rundumschutz ist, oder wenn sie eine dieser Attacken war und der Schutz durchbrochen wurde. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
			shortDesc: "Schützt das Team vor Mehrfachziel-Angriffen.", // NEEDS QC
		},
		gen5: {
			desc: "Der Anwender und sein Team sind in dieser Runde vor schädigenden Angriffen anderer Pokémon geschützt, auch von Mitstreitern, die alle benachbarten Gegner oder alle benachbarten Pokémon treffen. Diese Attacke hat eine Erfolgschance von 1 zu X, wobei X bei 1 beginnt und sich bei jedem Erfolg verdoppelt. X wird auf 1 zurückgesetzt, wenn diese Attacke fehlschlägt oder die zuletzt eingesetzte Attacke nicht Scanner, Ausdauer, Schutzschild, Rapidschutz oder Rundumschutz ist. Ist X 256 oder mehr, hat diese Attacke eine Erfolgschance von 1 zu 2^32. Schlägt fehl, wenn der Anwender in dieser Runde als Letzter handelt oder dieser Effekt bereits auf seiner Seite aktiv ist.", // NEEDS QC
		},

		start: "  {TEAM} wird durch Rundumschutz geschützt!",
		block: "  {POKEMON} wird durch Rundumschutz geschützt!",
	},
	wildboltstorm: {
		name: "Donnerorkan",
		desc: "Hat eine Chance von 20 %, das Ziel zu paralysieren. Ist das Wetter Strömender Regen oder Regen, prüft diese Attacke keine Genauigkeit. Gegen ein Pokémon mit Allzweckschirm bleibt die Genauigkeit bei 80 %.", // NEEDS QC
		shortDesc: "20 % Chance auf Paralyse. Trifft bei Regen immer.", // NEEDS QC
	},
	wildcharge: {
		name: "Stromstoß",
		// Official flavor text: "Anwender erzeugt Spannung und greift an, indem er auf Kollisionskurs geht. Er erleidet selbst leichten Schaden."
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/4 der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "1/4 Rückstoßschaden.", // NEEDS QC
	},
	willowisp: {
		name: "Irrlicht",
		// Official flavor text: "Anwender feuert unheimliche Flammen ab, die beim Ziel Verbrennungen verursachen."
		desc: "Verbrennt das Ziel.", // NEEDS QC
		shortDesc: "Verbrennt das Ziel.", // NEEDS QC
	},
	wingattack: {
		name: "Flügelschlag",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	wish: {
		name: "Wunschtraum",
		// Official flavor text: "Ein Wunsch füllt in der nächsten Runde 50 % der KP des Anwenders bei diesem oder einem eingewechselten Pokémon auf."
		desc: "Am Ende der nächsten Runde stellt das Pokémon an der Position des Anwenders die Hälfte der maximalen KP des Anwenders wieder her, abgerundet. Schlägt fehl, wenn dieser Effekt bereits für die Position des Anwenders aktiv ist.", // NEEDS QC
		shortDesc: "Heilt nächste Runde halbe max. KP des Anwenders.", // NEEDS QC
		gen4: {
			desc: "Am Ende der nächsten Runde stellt das Pokémon an der Position des Anwenders die Hälfte seiner eigenen maximalen KP wieder her, abgerundet. Schlägt fehl, wenn dieser Effekt bereits für die Position des Anwenders aktiv ist.", // NEEDS QC
			shortDesc: "Heilt nächste Runde 50 % der max. KP des Empfängers.", // NEEDS QC
		},

		heal: "  Der Wunschtraum von {NICKNAME} erfüllt sich!",
	},
	withdraw: {
		name: "Panzerschutz",
		// Official flavor text: "Rückzug in den harten Panzer. Erhöht den Verteidigungs-Wert."
		desc: "Erhöht die Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "Erhöht Verteidigung des Anwenders um eine Stufe.", // NEEDS QC
	},
	wonderroom: {
		name: "Wunderraum",
		// Official flavor text: "Anwender erzeugt einen bizarren Raum, in dem über fünf Runden die Verteidigung aller Pokémon mit ihrer Spezial-Verteidigung getauscht wird."
		desc: "5 Runden lang sind Verteidigung und Spezial-Verteidigung aller Pokémon im Kampf vertauscht. Statusveränderungen bleiben unberührt. Wird diese Attacke während des Effekts eingesetzt, endet er.", // NEEDS QC
		shortDesc: "5 Runden: Vert. und Sp.-Vert. aller vertauscht.", // NEEDS QC
	},
	woodhammer: {
		name: "Holzhammer",
		// Official flavor text: "Anwender attackiert mit seinem robusten Körper. Er erleidet dabei auch selbst großen Schaden."
		desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 33 % der vom Ziel verlorenen KP, ab 0,5 aufgerundet, mindestens jedoch 1 KP.", // NEEDS QC
		shortDesc: "33 % Rückstoßschaden.", // NEEDS QC
		gen4: {
			desc: "Hat das Ziel KP verloren, erleidet der Anwender Rückstoßschaden in Höhe von 1/3 der verlorenen KP, abgerundet, aber mindestens 1 KP.", // NEEDS QC
			shortDesc: "Hat 1/3 Rückstoß.", // NEEDS QC
		},
	},
	workup: {
		name: "Kraftschub",
		// Official flavor text: "Anwender erhält einen Kraftschub, der seinen Angriff und Spezial-Angriff erhöht."
		desc: "Erhöht den Angriff und den Spezial-Angriff des Anwenders um eine Stufe.", // NEEDS QC
		shortDesc: "+1 Ang. und Sp.-Ang. des Anwenders.", // NEEDS QC
	},
	worryseed: {
		name: "Sorgensamen",
		// Official flavor text: "Ziel wird bepflanzt. Seine Fähigkeit wandelt sich zu Insomnia und hindert es daran, einzuschlafen."
		desc: "Die Fähigkeit des Ziels wird zu Insomnia. Schlägt fehl, wenn die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Insomnia, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Wandel, Schnarchnase, Trance-Modus oder Superwechsel ist.", // NEEDS QC
		shortDesc: "Das Ziel erhält die Fähigkeit Insomnia.", // NEEDS QC
		gen8: {
			desc: "Die Fähigkeit des Ziels wird zu Insomnia. Schlägt fehl, wenn die Fähigkeit des Ziels Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Insomnia, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Schnarchnase oder Trance-Modus ist.", // NEEDS QC
		},
		gen7: {
			desc: "Die Fähigkeit des Ziels wird zu Insomnia. Schlägt fehl, wenn die Fähigkeit des Ziels Freundschaftsakt, Dauerschlaf, Kostümspuk, Insomnia, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Schnarchnase oder Trance-Modus ist.", // NEEDS QC
		},
		gen6: {
			desc: "Die Fähigkeit des Ziels wird zu Insomnia. Schlägt fehl, wenn die Fähigkeit des Ziels Insomnia, Variabilität, Taktikwechsel oder Schnarchnase ist.", // NEEDS QC
		},
		gen5: {
			desc: "Die Fähigkeit des Ziels wird zu Insomnia. Schlägt fehl, wenn die Fähigkeit des Ziels Insomnia, Variabilität oder Schnarchnase ist.", // NEEDS QC
		},
		gen4: {
			desc: "Die Fähigkeit des Ziels wird zu Insomnia. Schlägt fehl, wenn die Fähigkeit des Ziels Variabilität oder Schnarchnase ist oder das Ziel einen Platinum-Orb trägt.", // NEEDS QC
		},
	},
	wrap: {
		name: "Wickel",
		// Official flavor text: "Umwickelt das Ziel über vier bis fünf Runden mit Ranken oder Ähnlichem und fügt ihm Schaden zu."
		desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP zu (1/6 mit Klammerband), abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Schwanzabwurf, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Letalwirbler, Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		shortDesc: "Hält und schädigt das Ziel 4-5 Runden lang.", // NEEDS QC
		gen8: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Rollwende, Abgangstirade, Teleport, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen7: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/8 seiner maximalen KP (1/6 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Abgangstirade, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert das Ziel vier oder fünf Runden lang (sieben mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP (1/8 mit Klammerband) zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette, Kehrtwende oder Voltwechsel einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang (immer fünf mit Griffklaue) daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es eine Wechselhülle trägt oder Stafette oder Kehrtwende einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
			shortDesc: "Fängt und schädigt das Ziel 2-5 Runden lang.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert das Ziel zwei bis fünf Runden lang daran, sich auswechseln zu lassen. Fügt dem Ziel am Ende jeder Runde des Effekts Schaden in Höhe von 1/16 seiner maximalen KP zu, abgerundet. Das Ziel kann dennoch ausgewechselt werden, wenn es Stafette einsetzt. Der Effekt endet, wenn der Anwender oder das Ziel das Feld verlässt oder das Ziel Turbodreher oder Delegator erfolgreich einsetzt. Dieser Effekt ist weder kumulierbar noch durch erneuten Einsatz zurücksetzbar.", // NEEDS QC
		},
		gen1: {
			desc: "Der Anwender setzt diese Attacke zwei bis fünf Runden lang ein. Hält mit einer Chance von 3/8 zwei oder drei Runden und mit einer Chance von 1/8 vier oder fünf Runden an. Der für die erste Runde berechnete Schaden wird für jede weitere Runde übernommen. Der Anwender kann keine Attacke wählen und das Ziel kann während des Effekts keine Attacke ausführen, aber beide können ausgewechselt werden. Wird der Anwender ausgewechselt, kann das Ziel in dieser Runde weiterhin keine Attacke ausführen. Wird das Ziel ausgewechselt, setzt der Anwender diese Attacke automatisch erneut ein; hatte sie dabei 0 AP, werden es 63. Wird der Anwender oder das Ziel ausgewechselt oder der Anwender am Handeln gehindert, endet der Effekt. Diese Attacke kann das Ziel auch bei Typ-Immunität am Handeln hindern, fügt dann aber keinen Schaden zu.", // NEEDS QC
			shortDesc: "Das Ziel kann 2-5 Runden nicht handeln.", // NEEDS QC
		},

		start: "  {POKEMON} wurde von {SOURCE} umwickelt!",
		move: "{POKEMON} greift weiter an!",
	},
	wringout: {
		name: "Auswringen",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Die Stärke beträgt 120 × (aktuelle KP des Ziels / maximale KP des Ziels), ab 0,5 abgerundet, mindestens jedoch 1.", // NEEDS QC
		shortDesc: "Je mehr KP das Ziel hat, desto stärker.", // NEEDS QC
		gen4: {
			desc: "Die Stärke beträgt 120 × (aktuelle KP des Ziels ÷ maximale KP des Ziels) + 1, abgerundet.", // NEEDS QC
		},
	},
	xscissor: {
		name: "Kreuzschere",
		shortDesc: "Hat keinen zusätzlichen Effekt.", // NEEDS QC
	},
	yawn: {
		name: "Gähner",
		// Official flavor text: "Anwender gähnt und das Ziel schläft in der nächsten Runde ein."
		desc: "Schläfert das Ziel am Ende der nächsten Runde ein. Schlägt beim Einsatz fehl, wenn das Ziel nicht einschlafen kann oder bereits ein Statusproblem hat. Ist das Ziel am Ende der nächsten Runde noch im Kampf, hat kein Statusproblem und kann einschlafen, schläft es ein. Ist das Ziel einmal betroffen, kann dieser Effekt weder durch Bodyguard noch durch einen Delegator verhindert werden, auch nicht durch Einschlafen und Aufwachen während des Effekts.", // NEEDS QC
		shortDesc: "Schläfert das Ziel nach einer Runde ein.", // NEEDS QC

		start: "  {POKEMON} wurde schläfrig gemacht!",
	},
	zapcannon: {
		name: "Blitzkanone",
		// Official flavor text: "Kanonenähnlicher Elektro-Schuss, der schadet und paralysiert."
		desc: "Hat eine Chance von 100 %, das Ziel zu paralysieren.", // NEEDS QC
		shortDesc: "100 % Chance auf Paralyse.", // NEEDS QC
	},
	zenheadbutt: {
		name: "Zen-Kopfstoß",
		// Official flavor text: "Anwender konzentriert seinen Willen und rammt das Ziel. Dieses schreckt eventuell zurück."
		desc: "Hat eine Chance von 20 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "20 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	zingzap: {
		name: "Elektropikser",
		// Official flavor text: "Der Anwender rammt das Ziel und schockt es mit starkem Strom. Das Ziel schreckt eventuell zurück."
		desc: "Hat eine Chance von 30 %, das Ziel zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "30 % Chance auf Zurückschrecken.", // NEEDS QC
	},
	zippyzap: {
		name: "Britzelturbo",
		// Official flavor text: "Diese Attacke kann nicht eingesetzt werden. Du solltest dein Pokémon sie vergessen lassen. Beachte aber, dass es sich danach nicht wieder an sie erinnern kann."
		desc: "Hat eine Chance von 100 %, den Fluchtwert des Anwenders um eine Stufe zu erhöhen.", // NEEDS QC
		shortDesc: "Handelt zuerst. +1 Fluchtwert.", // NEEDS QC
		gen7: {
			desc: "Diese Attacke ist immer ein Volltreffer.", // NEEDS QC
			shortDesc: "Handelt fast immer zuerst. Immer Volltreffer.", // NEEDS QC
		},
	},
};
