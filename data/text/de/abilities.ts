export const AbilitiesText: { [id: IDEntry]: AbilityText } = {
	noability: {
		name: "Keine Fähigkeit", // NEEDS QC
		shortDesc: "Bewirkt nichts.", // NEEDS QC
	},
	adaptability: {
		name: "Anpassung",
		// Official flavor text: "Erhöht die Stärke von Attacken, die dem Typ des Pokémon entsprechen."
		desc: "Der Typenbonus (STAB) dieses Pokémon beträgt 2 statt 1,5.", // NEEDS QC
		shortDesc: "Der Typenbonus (STAB) dieses Pokémon beträgt 2 statt 1,5.", // NEEDS QC
	},
	aerilate: {
		name: "Zenithaut",
		// Official flavor text: "Attacken vom Typ Normal nehmen den Typ Flug an und ihre Stärke erhöht sich ein wenig."
		desc: "Attacken dieses Pokémon vom Typ Normal werden zu Attacken vom Typ Flug und ihre Stärke wird mit 1,2 multipliziert. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, aber vor den Effekten von Plasmaschauer und Elektrifizierung.", // NEEDS QC
		shortDesc: "Seine Normal-Attacken werden zu Flug-Attacken mit 1,2-facher Stärke.", // NEEDS QC
		gen6: {
			desc: "Attacken dieses Pokémon vom Typ Normal werden zu Attacken vom Typ Flug und ihre Stärke wird mit 1,3 multipliziert. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, aber vor den Effekten von Plasmaschauer und Elektrifizierung.", // NEEDS QC
			shortDesc: "Normal-Attacken dieses Pokémon werden zum Typ Flug mit 1,3x Stärke.", // NEEDS QC
		},
	},
	aftermath: {
		name: "Finalschlag",
		// Official flavor text: "Wird das Pokémon durch eine direkte Attacke besiegt, fügt es dem Angreifer Schaden zu."
		desc: "Wird dieses Pokémon durch eine Kontaktattacke kampfunfähig, verliert der Angreifer 1/4 seiner maximalen KP, abgerundet. Dieser Effekt wird verhindert, wenn der Angreifer die Fähigkeit Magieschild hat oder ein Pokémon im Kampf die Fähigkeit Feuchtigkeit hat.", // NEEDS QC
		shortDesc: "Wird es durch Kontakt besiegt, verliert der Angreifer 1/4 seiner max. KP.", // NEEDS QC

		damage: "  {POKEMON} wurde Schaden zugefügt!",
	},
	airlock: {
		name: "Klimaschutz",
		shortDesc: "Solange dieses Pokémon im Kampf ist, sind Wettereffekte aufgehoben.", // NEEDS QC

		start: "  Jegliche wetterbedingten Effekte wurden aufgehoben!",
	},
	analytic: {
		name: "Analyse",
		// Official flavor text: "Greift das Pokémon zuletzt an, erhöht sich die Stärke der Attacke, die es einsetzt."
		desc: "Die Stärke der Attacken dieses Pokémon wird mit 1,3 multipliziert, wenn es in der Runde als Letztes handelt. Betrifft nicht Kismetwunsch und Seher.", // NEEDS QC
		shortDesc: "Seine Angriffe haben 1,3-fache Stärke, wenn es als Letztes handelt.", // NEEDS QC
	},
	angerpoint: {
		name: "Kurzschluss",
		// Official flavor text: "Wird nach Einstecken eines Volltreffers wütend und maximiert dabei seinen Angriffs-Wert."
		desc: "Wird dieses Pokémon, aber nicht sein Delegator, von einem Volltreffer getroffen, steigt sein Angriff um 12 Stufen.", // NEEDS QC
		shortDesc: "Erleidet es (nicht sein Delegator) einen Volltreffer: Angriff +12 Stufen.", // NEEDS QC
		gen4: {
			desc: "Wird dieses Pokémon oder sein Delegator von einem Volltreffer getroffen, steigt sein Angriff um 12 Stufen.", // NEEDS QC
			shortDesc: "Erhält dieses Pokémon oder sein Delegator einen Volltreffer: +12 Angriff.", // NEEDS QC
		},

		boost: "  Der Angriffs-Wert von {POKEMON} erreicht das Maximum!",
	},
	angershell: {
		name: "Wutpanzer",
		desc: "Hat dieses Pokémon mehr als die Hälfte seiner maximalen KP und fällt durch einen Angriff auf die Hälfte oder weniger, steigen sein Angriff, sein Spezial-Angriff und seine Initiative um eine Stufe, und seine Verteidigung und seine Spezial-Verteidigung sinken um eine Stufe. Dieser Effekt tritt nach allen Treffern einer mehrfach treffenden Attacke ein. Dieser Effekt wird verhindert, wenn der Sekundäreffekt der Attacke durch die Fähigkeit Rohe Gewalt entfernt wurde.", // NEEDS QC
		shortDesc: "Bei halben KP oder weniger: +1 Ang., Sp.-Ang., Init.; -1 Vert., Sp.-Vert.", // NEEDS QC
	},
	anticipation: {
		name: "Vorahnung",
		// Official flavor text: "Kann gefährliche gegnerische Attacken erahnen."
		desc: "Beim Einwechseln erschaudert dieses Pokémon, wenn ein Gegner eine offensive Attacke eines sehr effektiven Typs oder eine K.O.-Attacke kennt. Dieser Effekt betrachtet Kraftreserve mit seinem bestimmten Typ und alle anderen Attacken mit ihrem ursprünglichen Typ.", // NEEDS QC
		shortDesc: "Erschaudert beim Einwechseln, hat ein Gegner eine sehr effektive oder K.O.-Attacke.", // NEEDS QC
		gen5: {
			desc: "Beim Einwechseln wird dieses Pokémon gewarnt, wenn ein Gegner eine Angriffsattacke eines Typs kennt, der sehr effektiv gegen dieses Pokémon ist, oder eine K.O.-Attacke. Dieser Effekt betrachtet Attacken mit ihrem ursprünglichen Typ.", // NEEDS QC
		},
		gen4: {
			desc: "Beim Einwechseln wird dieses Pokémon gewarnt, wenn ein Gegner eine Angriffsattacke eines Typs kennt, der sehr effektiv gegen dieses Pokémon ist, oder eine K.O.-Attacke, sofern dieses Pokémon nicht immun gegen deren Typ ist und der Gegner kein niedrigeres Level hat. Dieser Effekt betrachtet Attacken mit ihrem ursprünglichen Typ. Konter, Drachenwut, Metallstoß, Spiegelcape, Nachtnebel, Psywelle und Geowurf lösen diesen Effekt nicht aus. Vor der Prüfung wird berücksichtigt, ob dieses Pokémon eine Eisenkugel trägt, ob es unter den Effekten von Scharfblick, Erdanziehung, Verwurzler, Wunderauge oder Ruheort steht und ob Gegner die Fähigkeiten Regulierung oder Rauflust haben.", // NEEDS QC
		},

		activate: "  {POKEMON} erschaudert!",
	},
	arenatrap: {
		name: "Ausweglos",
		// Official flavor text: "Hindert Gegner im Kampf an der Flucht."
		desc: "Hindert Gegner daran, sich auswechseln zu lassen, außer sie schweben, tragen eine Wechselhülle oder sind vom Typ Geist.", // NEEDS QC
		shortDesc: "Hindert Gegner am Auswechseln, außer sie schweben.", // NEEDS QC
		gen6: {
			desc: "Hindert benachbarte Gegner daran, sich auswechseln zu lassen, außer sie schweben, tragen eine Wechselhülle oder sind vom Typ Geist.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert benachbarte Gegner daran, sich auswechseln zu lassen, außer sie schweben oder tragen eine Wechselhülle.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert Gegner daran, sich auswechseln zu lassen, außer sie schweben oder tragen eine Wechselhülle.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert Gegner daran, sich auswechseln zu lassen, außer sie schweben.", // NEEDS QC
		},
	},
	armortail: {
		name: "Schweifrüstung",
		desc: "Attacken mit erhöhter Priorität, die Gegner gegen dieses Pokémon oder seine Mitstreiter einsetzen, schlagen fehl.", // NEEDS QC
		shortDesc: "Schützt dieses Pokémon und Mitstreiter vor gegnerischen Prioritätsattacken.", // NEEDS QC

		block: "#damp",
	},
	aromaveil: {
		name: "Dufthülle",
		// Official flavor text: "Kann alle Team-Pokémon vor mentalen Angriffen schützen."
		desc: "Dieses Pokémon und seine Mitstreiter können nicht von Anziehung, Aussetzer, Zugabe, Heilblockade, Verhöhner und Folterknecht betroffen werden.", // NEEDS QC
		shortDesc: "Schützt das Team vor Anziehung, Aussetzer, Zugabe, Verhöhner usw.", // NEEDS QC

		block: "  {POKEMON} wird von Dufthülle geschützt!",
	},
	asone: {
		name: "Reitgespann",
		shortDesc: "Siehe „Reitgespann (Polaross)“ und „Reitgespann (Phantoross)“.", // NEEDS QC

		start: "  {POKEMON} verfügt über zwei Fähigkeiten!",
	},
	asoneglastrier: {
		name: "Reitgespann (Polaross)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Kombiniert die Fähigkeiten Anspannung und Helles Wiehern.", // NEEDS QC
	},
	asonespectrier: {
		name: "Reitgespann (Phantoross)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Kombiniert die Fähigkeiten Anspannung und Dunkles Wiehern.", // NEEDS QC
	},
	aurabreak: {
		name: "Aura-Umkehr",
		// Official flavor text: "Kehrt die Wirkung von Auren um und senkt so die Stärke bestimmter Attacken, anstatt sie zu erhöhen."
		desc: "Solange dieses Pokémon im Kampf ist, werden die Effekte der Fähigkeiten Dunkelaura und Feenaura umgekehrt: Die Stärke von Attacken der Typen Unlicht und Fee wird mit 3/4 statt 1,33 multipliziert.", // NEEDS QC
		shortDesc: "Solange es im Kampf ist, wirken Dunkelaura und Feenaura mit 0,75x.", // NEEDS QC

		start: "  {POKEMON} kehrt die Wirkung aller Aura-Fähigkeiten um!",
	},
	baddreams: {
		name: "Alptraum",
		// Official flavor text: "Fügt schlafenden Gegnern Schaden zu."
		desc: "Schlafende Gegner verlieren am Ende jeder Runde 1/8 ihrer maximalen KP, abgerundet.", // NEEDS QC
		shortDesc: "Schlafende Gegner verlieren am Ende jeder Runde 1/8 ihrer max. KP.", // NEEDS QC
		gen6: {
			desc: "Benachbarte schlafende Gegner verlieren am Ende jeder Runde 1/8 ihrer maximalen KP, abgerundet.", // NEEDS QC
			shortDesc: "Schlafende benachbarte Gegner verlieren am Rundenende 1/8 ihrer max. KP.", // NEEDS QC
		},
		gen4: {
			desc: "Schlafende Gegner verlieren am Ende jeder Runde 1/8 ihrer maximalen KP, abgerundet.", // NEEDS QC
			shortDesc: "Schlafende Gegner verlieren am Ende jeder Runde 1/8 ihrer max. KP.", // NEEDS QC
		},

		damage: "  {POKEMON} ist in einem Alptraum gefangen!",
	},
	ballfetch: {
		name: "Apport",
		shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC
	},
	battery: {
		name: "Batterie",
		shortDesc: "Spezielle Angriffe der Mitstreiter haben 1,3-fache Stärke.", // NEEDS QC
	},
	battlearmor: {
		name: "Kampfpanzer",
		shortDesc: "Dieses Pokémon kann keine Volltreffer erleiden.", // NEEDS QC
	},
	battlebond: {
		name: "Freundschaftsakt",
		// Official flavor text: "Besiegt es ein Ziel, vertieft dies die Freundschaft zu seinem Trainer, wodurch es die Ash-Form annimmt und sein Wasser-Shuriken stärker wird."
		desc: "Wenn dieses Pokémon ein Quajutsu ist, steigen sein Angriff, sein Spezial-Angriff und seine Initiative um eine Stufe, wenn es ein anderes Pokémon mit einem Angriff kampfunfähig macht. Dieser Effekt kann nur einmal pro Kampf eintreten.", // NEEDS QC
		shortDesc: "Nach einem K.O.: +1 Angriff, Sp.-Ang. und Initiative. Einmal pro Kampf.", // NEEDS QC
		gen8: {
			desc: "Ist dieses Pokémon ein Quajutsu, verwandelt es sich in Ash-Quajutsu, wenn es ein anderes Pokémon durch einen Angriff besiegt. Ist dieses Pokémon Ash-Quajutsu, hat sein Wasser-Shuriken 20 Stärke und trifft immer dreimal.", // NEEDS QC
			shortDesc: "Nach einem K.O.: wird zu Ash-Quajutsu, Wasser-Shuriken: 20 Stärke, trifft 3x.", // NEEDS QC
		},
		activate: "  {POKEMON} ist von der Macht der Freundschaft erfüllt!",
		transform: "{POKEMON} hat die Ash-Form angenommen!",
	},
	beadsofruin: {
		name: "Unheilsjuwelen",
		shortDesc: "Die Sp.-Vert. aller Pokémon ohne diese Fähigkeit wird mit 0,75 multipliziert.", // NEEDS QC

		start: "  Unheilsjuwelen von {POKEMON} schwächt die Spezial-Verteidigung aller Pokémon im Umkreis!",
	},
	beastboost: {
		name: "Bestien-Boost",
		// Official flavor text: "Erhöht in jeder Runde, in der es ein anderes Pokémon besiegt, seinen höchsten Statuswert."
		desc: "Der höchste Statuswert dieses Pokémon steigt um eine Stufe, wenn es ein anderes Pokémon mit einem Angriff kampfunfähig macht. Statusveränderungen werden nicht berücksichtigt. Bei Gleichstand gilt die Reihenfolge: Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung, Initiative.", // NEEDS QC
		shortDesc: "Sein höchster Statuswert steigt um 1, wenn es ein Pokémon besiegt.", // NEEDS QC
	},
	berserk: {
		name: "Wutausbruch",
		// Official flavor text: "Fallen seine KP nach einem Angriff auf die Hälfte des Maximalwerts oder weniger, steigt sein Spezial-Angriff."
		desc: "Hat dieses Pokémon mehr als die Hälfte seiner maximalen KP und fällt durch einen Angriff auf die Hälfte oder weniger, steigt sein Spezial-Angriff um eine Stufe. Dieser Effekt tritt nach allen Treffern einer mehrfach treffenden Attacke ein. Dieser Effekt wird verhindert, wenn der Sekundäreffekt der Attacke durch die Fähigkeit Rohe Gewalt entfernt wurde.", // NEEDS QC
		shortDesc: "+1 Sp.-Ang., wenn es auf die Hälfte seiner max. KP oder weniger fällt.", // NEEDS QC
	},
	bigpecks: {
		name: "Brustbieter",
		shortDesc: "Hindert andere Pokémon daran, seine Verteidigung zu senken.", // NEEDS QC
	},
	blaze: {
		name: "Großbrand",
		// Official flavor text: "Erhöht die Stärke von Feuer-Attacken, wenn die KP auf einen gewissen Wert fallen."
		desc: "Hat dieses Pokémon 1/3 oder weniger seiner maximalen KP, abgerundet, wird sein Offensivwert beim Einsatz einer Attacke vom Typ Feuer mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Bei 1/3 der max. KP oder weniger: Feuer-Angriffe mit 1,5-facher Offensive.", // NEEDS QC
		gen4: {
			desc: "Hat dieses Pokémon 1/3 oder weniger seiner maximalen KP, abgerundet, wird die Stärke seiner Attacken vom Typ Feuer mit 1,5 multipliziert.", // NEEDS QC
			shortDesc: "Bei 1/3 oder weniger der max. KP: 1,5x Stärke für Feuer-Attacken.", // NEEDS QC
		},
	},
	bulletproof: {
		name: "Kugelsicher",
		shortDesc: "Dieses Pokémon ist immun gegen Kugel- und Bombenattacken.", // NEEDS QC
	},
	cheekpouch: {
		name: "Backentaschen",
		// Official flavor text: "Regeneriert beim Konsum von Beeren ungeachtet der Beerensorte KP."
		desc: "Isst dieses Pokémon eine getragene Beere, stellt es zusätzlich zum Beereneffekt 1/3 seiner maximalen KP wieder her, abgerundet. Dieser Effekt kann auch nach den Effekten von Käferbiss, Schleuder, Pflücker, Backenstopfer und Teatime eintreten, wenn die gegessene Beere eine Wirkung auf dieses Pokémon hatte.", // NEEDS QC
		shortDesc: "Isst es eine Beere, heilt es zusätzlich 1/3 seiner max. KP.", // NEEDS QC
		gen7: {
			desc: "Isst dieses Pokémon eine getragene Beere, stellt es zusätzlich zum Beereneffekt 1/3 seiner maximalen KP wieder her, abgerundet. Dieser Effekt kann auch nach Käferbiss, Schleuder und Pflücker eintreten, wenn die gegessene Beere eine Wirkung auf dieses Pokémon hat.", // NEEDS QC
		},
	},
	chillingneigh: {
		name: "Helles Wiehern",
		// Official flavor text: "Besiegt es ein Pokémon, stößt es ein frostiges Wiehern aus und erhöht damit seinen Angriff."
		desc: "Der Angriff dieses Pokémon steigt um eine Stufe, wenn es ein anderes Pokémon mit einem Angriff kampfunfähig macht.", // NEEDS QC
		shortDesc: "Sein Angriff steigt um eine Stufe, wenn es ein Pokémon besiegt.", // NEEDS QC
	},
	chlorophyll: {
		name: "Chlorophyll",
		// Official flavor text: "Erhöht bei Sonnenschein die Initiative."
		desc: "Wenn Sonne aktiv ist, wird die Initiative dieses Pokémon verdoppelt. Dieser Effekt wird verhindert, wenn dieses Pokémon einen Allzweckschirm trägt.", // NEEDS QC
		shortDesc: "Ist Sonne aktiv, wird seine Initiative verdoppelt.", // NEEDS QC
		gen7: {
			desc: "Ist Sonne aktiv, wird die Initiative dieses Pokémon verdoppelt.", // NEEDS QC
		},
	},
	clearbody: {
		name: "Neutraltorso",
		shortDesc: "Hindert andere Pokémon daran, seine Statuswerte zu senken.", // NEEDS QC
	},
	cloudnine: {
		name: "Wolke Sieben",
		shortDesc: "Solange dieses Pokémon im Kampf ist, sind Wettereffekte aufgehoben.", // NEEDS QC

		start: "#airlock",
	},
	colorchange: {
		name: "Farbwechsel",
		// Official flavor text: "Ändert seinen Typ zu dem der Attacke des Angreifers."
		desc: "Der Typ dieses Pokémon wird zu dem der letzten Attacke, die es getroffen hat, außer es hat diesen Typ bereits. Dieser Effekt tritt nach allen Treffern einer mehrfach treffenden Attacke ein. Dieser Effekt wird verhindert, wenn der Sekundäreffekt der Attacke durch die Fähigkeit Rohe Gewalt entfernt wurde.", // NEEDS QC
		shortDesc: "Sein Typ wird zu dem der Attacke, die es trifft, falls noch nicht vorhanden.", // NEEDS QC
		gen4: {
			desc: "Der Typ dieses Pokémon ändert sich zum Typ der letzten Attacke, die es getroffen hat, außer es hat diesen Typ bereits. Dieser Effekt tritt nach jedem Treffer einer mehrfach treffenden Attacke ein. Er tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
		},
	},
	comatose: {
		name: "Dauerschlaf",
		// Official flavor text: "Das Pokémon befindet sich ununterbrochen im Halbschlaf und wacht nie vollständig auf. Es kann jedoch im Schlaf angreifen."
		desc: "Dieses Pokémon gilt als schlafend und kann weder von Statusproblemen noch von Gähner betroffen werden.", // NEEDS QC
		shortDesc: "Kann keine Statusprobleme erleiden, gilt aber als schlafend.", // NEEDS QC

		start: "  {POKEMON} befindet sich im Halbschlaf!",
	},
	commander: {
		name: "Kommandant",
		desc: "Wenn dieses Pokémon ein Nigiragi ist und ein verbündetes Heerashai im Kampf ist, springt es in dessen Maul. Angriff, Spezial-Angriff, Initiative, Verteidigung und Spezial-Verteidigung des Heerashai steigen um 2 Stufen. Während des Effekts kann das Heerashai nicht ausgewechselt werden, dieses Pokémon kann keine Aktionen wählen, und Angriffe auf dieses Pokémon schlagen fehl, es erleidet aber weiterhin indirekten Schaden. Wird dieses Pokémon während des Effekts kampfunfähig, kann ein Ersatz eingewechselt werden, aber das Heerashai bleibt nicht auswechselbar. Wird das Heerashai während des Effekts kampfunfähig, kann dieses Pokémon wieder Aktionen wählen.", // NEEDS QC
		shortDesc: "Ist Heerashai aktiv: kann nicht handeln oder getroffen werden; Heerashai +2 überall.", // NEEDS QC

		activate: "  {POKEMON} wurde von {TARGET} verschluckt und übernimmt das Kommando!",
	},
	competitive: {
		name: "Unbeugsamkeit",
		// Official flavor text: "Erhöht den Spezial-Angriff stark, wenn ein Statuswert gesenkt wurde."
		desc: "Der Spezial-Angriff dieses Pokémon steigt um 2 Stufen für jeden Statuswert, den ein Gegner gesenkt hat.", // NEEDS QC
		shortDesc: "+2 Sp.-Ang. für jeden von einem Gegner gesenkten Statuswert.", // NEEDS QC
	},
	compoundeyes: {
		name: "Facettenauge",
		shortDesc: "Die Genauigkeit seiner Attacken wird mit 1,3 multipliziert.", // NEEDS QC
	},
	contrary: {
		name: "Umkehrung",
		shortDesc: "Statuswert-Erhöhungen werden zu Senkungen und umgekehrt.", // NEEDS QC
		gen7: {
			desc: "Statuswerte dieses Pokémon werden gesenkt statt erhöht und umgekehrt. Diese Fähigkeit wirkt nicht auf Statuserhöhungen durch Z-Kraft-Effekte vor dem Einsatz einer Z-Attacke.", // NEEDS QC
		},
		gen6: {
			desc: "Statuswerte dieses Pokémon werden gesenkt statt erhöht und umgekehrt.", // NEEDS QC
		},
	},
	corrosion: {
		name: "Korrosion",
		shortDesc: "Kann jedes Pokémon vergiften, unabhängig von dessen Typen.", // NEEDS QC
	},
	costar: {
		name: "Synchronauftritt",
		shortDesc: "Kopiert beim Einwechseln alle Statusveränderungen seines Mitstreiters.", // NEEDS QC
	},
	cottondown: {
		name: "Wollflaum",
		// Official flavor text: "Wird es von einem Angriff getroffen, verstreut es Teile seines Wollflaums, wodurch die Initiative aller anderen Pokémon sinkt."
		desc: "Wird dieses Pokémon von einem Angriff getroffen, sinkt die Initiative aller anderen Pokémon auf dem Feld um eine Stufe.", // NEEDS QC
		shortDesc: "Wird es getroffen, sinkt die Initiative aller anderen Pokémon um 1.", // NEEDS QC
	},
	cudchew: {
		name: "Wiederkäuer",
		shortDesc: "Isst es eine Beere, isst es sie am Ende der nächsten Runde erneut.", // NEEDS QC
	},
	curiousmedicine: {
		name: "Kuriose Arznei",
		shortDesc: "Beim Einwechseln werden die Statusveränderungen der Mitstreiter auf 0 gesetzt.", // NEEDS QC
	},
	cursedbody: {
		name: "Tastfluch",
		// Official flavor text: "Blockiert eventuell die Attacke, mit welcher der Angreifer es getroffen hat."
		desc: "Wird dieses Pokémon von einem Angriff getroffen, besteht eine Chance von 30 %, dass die Attacke blockiert wird, außer eine Attacke des Angreifers ist bereits blockiert.", // NEEDS QC
		shortDesc: "Wird es von einem Angriff getroffen: 30 % Chance, ihn zu blockieren.", // NEEDS QC
	},
	cutecharm: {
		name: "Charmebolzen",
		// Official flavor text: "Wird dieses Pokémon durch eine direkte Attacke angegriffen, verliebt sich der Gegner eventuell in es."
		desc: "Es besteht eine Chance von 30 %, dass sich ein Pokémon des anderen Geschlechts verliebt, wenn es dieses Pokémon mit einer Kontaktattacke trifft.", // NEEDS QC
		shortDesc: "30 % Chance, Angreifer des anderen Geschlechts bei Kontakt zu verlieben.", // NEEDS QC
		gen4: {
			desc: "Es besteht eine Chance von 30 %, dass ein Pokémon des anderen Geschlechts, das dieses Pokémon berührt, verliebt wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
		},
		gen3: {
			desc: "Es besteht eine Chance von 1/3, dass ein Pokémon des anderen Geschlechts, das dieses Pokémon berührt, verliebt wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
			shortDesc: "1/3 Chance, Pokémon des anderen Geschlechts bei Kontakt zu verlieben.", // NEEDS QC
		},
	},
	damp: {
		name: "Feuchtigkeit",
		// Official flavor text: "Befeuchtet die Umgebung und verhindert so den Einsatz von Attacken wie Finale, die Explosionen auslösen."
		desc: "Solange dieses Pokémon im Kampf ist, bleiben Explosion, Knallkopf, Nebelexplosion, Finale und die Fähigkeit Finalschlag wirkungslos.", // NEEDS QC
		shortDesc: "Verhindert Explosion, Knallkopf, Finale und Finalschlag.", // NEEDS QC
		gen7: {
			desc: "Solange dieses Pokémon im Kampf ist, haben Explosion, Knallkopf, Finale und die Fähigkeit Finalschlag keine Wirkung.", // NEEDS QC
			shortDesc: "Verhindert Explosion/Knallkopf/Finale/Finalschlag, solange es aktiv ist.", // NEEDS QC
		},
		gen6: {
			desc: "Solange dieses Pokémon im Kampf ist, haben Explosion, Finale und die Fähigkeit Finalschlag keine Wirkung.", // NEEDS QC
			shortDesc: "Verhindert Explosion/Finale/Finalschlag, solange es aktiv ist.", // NEEDS QC
		},
		gen3: {
			desc: "Solange dieses Pokémon im Kampf ist, haben Explosion und Finale keine Wirkung.", // NEEDS QC
			shortDesc: "Verhindert Explosion und Finale, solange es aktiv ist.", // NEEDS QC
		},

		block: "  {SOURCE} kann {MOVE} nicht einsetzen!",
	},
	dancer: {
		name: "Tänzer",
		// Official flavor text: "Kann direkt im Anschluss an die Tanz-Attacke eines anderen Pokémon ebenfalls eine solche einsetzen."
		desc: "Setzt ein anderes Pokémon eine Tanz-Attacke ein, setzt dieses Pokémon dieselbe Attacke ein. Die kopierte Attacke unterliegt allen Effekten, die die Ausführung einer Attacke verhindern können. Eine durch diese Fähigkeit eingesetzte Attacke kann nicht erneut von anderen Pokémon mit dieser Fähigkeit kopiert werden.", // NEEDS QC
		shortDesc: "Setzt ein anderes Pokémon eine Tanz-Attacke ein, tanzt es sie nach.", // NEEDS QC
	},
	darkaura: {
		name: "Dunkelaura",
		// Official flavor text: "Erhöht die Stärke aller Attacken des Typs Unlicht."
		desc: "Solange dieses Pokémon im Kampf ist, wird die Stärke von Attacken vom Typ Unlicht aller Pokémon im Kampf mit 1,33 multipliziert.", // NEEDS QC
		shortDesc: "Solange es im Kampf ist, haben Unlicht-Attacken 1,33-fache Stärke.", // NEEDS QC

		start: "  {POKEMON} strahlt eine dunkle Aura aus!",
	},
	dauntlessshield: {
		name: "Wackerer Schild",
		shortDesc: "Beim Einwechseln steigt seine Verteidigung um eine Stufe. Einmal pro Kampf.", // NEEDS QC
		gen8: {
			shortDesc: "Beim Einwechseln steigt seine Verteidigung um eine Stufe.", // NEEDS QC
		},
	},
	dazzling: {
		name: "Buntkörper",
		// Official flavor text: "Überrascht Gegner und hindert sie so daran, Erstschlag-Attacken gegen es einzusetzen."
		desc: "Attacken mit erhöhter Priorität, die Gegner gegen dieses Pokémon oder seine Mitstreiter einsetzen, schlagen fehl.", // NEEDS QC
		shortDesc: "Schützt dieses Pokémon und Mitstreiter vor gegnerischen Prioritätsattacken.", // NEEDS QC

		block: "#damp",
	},
	defeatist: {
		name: "Schwächling",
		// Official flavor text: "Fallen seine KP auf die Hälfte des Maximalwerts oder weniger, bekommt es Angst. Dadurch wird die Stärke seines Angriffs und Spezial-Angriffs halbiert."
		desc: "Hat dieses Pokémon die Hälfte oder weniger seiner maximalen KP, werden sein Angriff und sein Spezial-Angriff halbiert.", // NEEDS QC
		shortDesc: "Bei halben KP oder weniger sind Angriff und Sp.-Ang. halbiert.", // NEEDS QC
	},
	defiant: {
		name: "Siegeswille",
		// Official flavor text: "Erhöht den Angriff stark, wenn ein Statuswert gesenkt wurde."
		desc: "Der Angriff dieses Pokémon steigt um 2 Stufen für jeden Statuswert, den ein Gegner gesenkt hat.", // NEEDS QC
		shortDesc: "+2 Angriff für jeden von einem Gegner gesenkten Statuswert.", // NEEDS QC
	},
	deltastream: {
		name: "Delta-Wind",
		// Official flavor text: "Ändert das Wetter, um die Schwächen des Typs Flug zu beseitigen."
		desc: "Beim Einwechseln wird das Wetter zu Luftströmungen, wodurch die Schwächen des Typs Flug von Pokémon des Typs Flug entfernt werden. Dieses Wetter hält an, bis diese Fähigkeit für kein Pokémon mehr aktiv ist oder das Wetter durch die Fähigkeiten Endland oder Urmeer geändert wird.", // NEEDS QC
		shortDesc: "Beim Einwechseln wehen starke Winde, solange diese Fähigkeit aktiv ist.", // NEEDS QC
	},
	desolateland: {
		name: "Endland",
		// Official flavor text: "Ändert das Wetter, um Wasser-Attacken wirkungslos zu machen."
		desc: "Beim Einwechseln wird das Wetter zu Gleißender Sonne, das alle Effekte von Sonne umfasst und die Ausführung offensiver Attacken vom Typ Wasser verhindert. Dieses Wetter hält an, bis diese Fähigkeit für kein Pokémon mehr aktiv ist oder das Wetter durch die Fähigkeiten Delta-Wind oder Urmeer geändert wird.", // NEEDS QC
		shortDesc: "Beim Einwechseln brennt extremes Sonnenlicht, solange diese Fähigkeit aktiv ist.", // NEEDS QC
	},
	disguise: {
		name: "Kostümspuk",
		// Official flavor text: "Kann ein Mal pro Kampf mit seinem gruseligen Kostüm einen Angriff abwehren."
		desc: "Wenn dieses Pokémon ein Mimigma ist, verursacht der erste Treffer im Kampf 0 (neutralen) Schaden. Danach bricht sein Kostüm, es nimmt seine Entlarvte Form an und verliert 1/8 seiner maximalen KP. Auch Verwirrungsschaden lässt das Kostüm brechen.", // NEEDS QC
		shortDesc: "(Mimigma) Der erste Treffer wird abgeblockt: Es verliert stattdessen 1/8 der KP.", // NEEDS QC
		gen7: {
			desc: "Wenn dieses Pokémon ein Mimigma ist, verursacht der erste Treffer im Kampf 0 (neutralen) Schaden. Danach bricht sein Kostüm und es nimmt seine Entlarvte Form an. Auch Verwirrungsschaden lässt das Kostüm brechen.", // NEEDS QC
			shortDesc: "(Nur Mimigma) Erster Treffer: 0 Schaden, Kostüm bricht.", // NEEDS QC
		},

		block: "  Sein Kostüm hat die Attacke absorbiert!",
		transform: "Die Tarnung von {POKEMON} ist aufgeflogen!",
	},
	download: {
		name: "Download",
		// Official flavor text: "Ist die Spezial-Verteidigung des Gegners höher als seine Verteidigung, wird der eigene Spezial-Angriff erhöht. Ist die Verteidigung höher, steigt der Angriff."
		desc: "Beim Einwechseln steigt der Angriff oder der Spezial-Angriff dieses Pokémon um eine Stufe, je nach dem schwächeren kombinierten Defensivwert der Gegner: Der Angriff steigt, wenn ihre Verteidigung niedriger ist, der Spezial-Angriff, wenn ihre Spezial-Verteidigung gleich hoch oder niedriger ist.", // NEEDS QC
		shortDesc: "Beim Einwechseln +1 Angriff oder Sp.-Ang., je nach schwächerer Abwehr der Gegner.", // NEEDS QC
	},
	dragonize: {
		name: "Drachenschicht",
		desc: "Attacken dieses Pokémon vom Typ Normal werden zu Attacken vom Typ Drache und ihre Stärke wird mit 1,2 multipliziert. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, aber vor den Effekten von Plasmaschauer und Elektrifizierung.", // NEEDS QC
		shortDesc: "Seine Normal-Attacken werden zu Drachen-Attacken mit 1,2-facher Stärke.", // NEEDS QC
	},
	dragonsmaw: {
		name: "Drachenkiefer",
		shortDesc: "Drachen-Angriffe mit 1,5-facher Offensive.", // NEEDS QC
	},
	drizzle: {
		name: "Niesel",
		shortDesc: "Beim Einwechseln erzeugt dieses Pokémon Regen.", // NEEDS QC
	},
	drought: {
		name: "Dürre",
		shortDesc: "Beim Einwechseln erzeugt dieses Pokémon Sonne.", // NEEDS QC
	},
	dryskin: {
		name: "Trockenheit",
		// Official flavor text: "Bei Sonnenschein verliert das Pokémon KP und der Schaden durch Feuer-Attacken steigt. Bei Regen und Treffern durch Wasser-Attacken regeneriert es KP."
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Wasser und stellt 1/4 seiner maximalen KP wieder her, abgerundet, wenn es von einer Attacke vom Typ Wasser getroffen wird. Die Stärke von Attacken vom Typ Feuer gegen dieses Pokémon wird mit 1,25 multipliziert. Am Ende jeder Runde stellt dieses Pokémon 1/8 seiner maximalen KP wieder her, abgerundet, wenn Regen aktiv ist, und verliert 1/8 seiner maximalen KP, abgerundet, wenn Sonne aktiv ist. Die Wettereffekte werden verhindert, wenn dieses Pokémon einen Allzweckschirm trägt.", // NEEDS QC
		shortDesc: "Wasser heilt 1/4, Regen 1/8; Feuer trifft mit 1,25x, Sonne kostet 1/8 KP.", // NEEDS QC
		gen7: {
			desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Wasser und stellt 1/4 seiner maximalen KP wieder her, abgerundet, wenn es von einer getroffen wird. Die Stärke von Attacken vom Typ Feuer gegen dieses Pokémon wird mit 1,25 multipliziert. Am Ende jeder Runde stellt dieses Pokémon 1/8 seiner maximalen KP wieder her, abgerundet, wenn das Wetter Regen ist, und verliert 1/8 seiner maximalen KP, abgerundet, wenn das Wetter Sonne ist.", // NEEDS QC
		},

		damage: "#aftermath",
	},
	earlybird: {
		name: "Frühwecker",
		shortDesc: "Sein Schlafzähler sinkt um 2 statt um 1.", // NEEDS QC
	},
	eartheater: {
		name: "Bodenschmaus",
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Boden und stellt 1/4 seiner maximalen KP wieder her, abgerundet, wenn es von einer Attacke vom Typ Boden getroffen wird.", // NEEDS QC
		shortDesc: "Heilt 1/4 der max. KP bei Boden-Attacken; immun gegen Boden.", // NEEDS QC
	},
	eelevate: {
		name: "Emporwindung",
		desc: "Dieses Pokémon ist immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen, Klebenetz und der Fähigkeit Ausweglos. Die Effekte von Erdanziehung, Verwurzler, Katapult, Tausend Pfeile und der Eisenkugel heben die Immunität auf. Tausend Pfeile kann dieses Pokémon treffen, als hätte es diese Fähigkeit nicht. Der höchste Statuswert dieses Pokémon steigt um eine Stufe, wenn es ein anderes Pokémon mit einem Angriff kampfunfähig macht. Statusveränderungen werden nicht berücksichtigt. Bei Gleichstand gilt die Reihenfolge: Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung, Initiative.", // NEEDS QC
		shortDesc: "Immun gegen Boden; +1 auf den höchsten Statuswert nach einem K.O.", // NEEDS QC
	},
	effectspore: {
		name: "Sporenwirt",
		// Official flavor text: "Wird dieses Pokémon durch eine direkte Attacke angegriffen, kann das beim Gegner Paralyse, Vergiftung oder Schlaf auslösen."
		desc: "Es besteht eine Chance von 30 %, dass ein Pokémon, das dieses Pokémon mit einer Kontaktattacke trifft, vergiftet, paralysiert oder eingeschläfert wird.", // NEEDS QC
		shortDesc: "30 % Chance auf Gift, Paralyse oder Schlaf bei Kontakt.", // NEEDS QC
		gen4: {
			desc: "30 % Chance, dass ein Pokémon, das dieses Pokémon berührt, vergiftet, paralysiert oder eingeschläfert wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
		},
		gen3: {
			desc: "10 % Chance, dass ein Pokémon, das dieses Pokémon berührt, vergiftet, paralysiert oder eingeschläfert wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
			shortDesc: "10 % Chance auf Gift/Paralyse/Schlaf bei Kontakt mit diesem Pokémon.", // NEEDS QC
		},
	},
	electricsurge: {
		name: "Elektro-Erzeuger",
		shortDesc: "Beim Einwechseln erzeugt dieses Pokémon ein Elektrofeld.", // NEEDS QC
	},
	electromorphosis: {
		name: "Dynamo",
		shortDesc: "Erhält den Effekt von Ladevorgang, wenn es von einem Angriff getroffen wird.", // NEEDS QC

		start: "  {POKEMON} wurde von {MOVE} getroffen und lädt sich auf!",
	},
	embodyaspectcornerstone: {
		name: "Erinnerungskraft (Fundament)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Beim Einwechseln steigt seine Verteidigung um eine Stufe.", // NEEDS QC

		boost: "  Die Fundamentmaske von {POKEMON} funkelt und erhöht seine Verteidigung!",
	},
	embodyaspecthearthflame: {
		name: "Erinnerungskraft (Ofen)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Beim Einwechseln steigt sein Angriff um eine Stufe.", // NEEDS QC

		boost: "  Die Ofenmaske von {POKEMON} funkelt und erhöht seinen Angriff!",
	},
	embodyaspectteal: {
		name: "Erinnerungskraft (Türkis)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Beim Einwechseln steigt seine Initiative um eine Stufe.", // NEEDS QC

		boost: "  Die Türkisgrüne Maske von {POKEMON} funkelt und erhöht seine Initiative!",
	},
	embodyaspectwellspring: {
		name: "Erinnerungskraft (Brunnen)", // PS-style disambiguator (not part of the official name)
		shortDesc: "Beim Einwechseln steigt seine Sp.-Vert. um eine Stufe.", // NEEDS QC

		boost: "  Die Brunnenmaske von {POKEMON} funkelt und erhöht seine Spezial-Verteidigung!",
	},
	emergencyexit: {
		name: "Rückzug",
		// Official flavor text: "Fallen seine KP auf die Hälfte des Maximalwerts oder weniger, bringt es sich in Sicherheit."
		desc: "Hat dieses Pokémon mehr als die Hälfte seiner maximalen KP und fällt durch Schaden auf die Hälfte oder weniger, wird es sofort gegen einen gewählten Mitstreiter ausgewechselt. Dieser Effekt tritt nach allen Treffern einer mehrfach treffenden Attacke ein. Dieser Effekt wird verhindert, wenn der Sekundäreffekt der Attacke durch die Fähigkeit Rohe Gewalt entfernt wurde. Dieser Effekt gilt für direkten wie indirekten Schaden, außer dem von selbst eingesetzten Fluch und Delegator, von Bauchtrommel, von Leidteiler und von Verwirrung.", // NEEDS QC
		shortDesc: "Es verlässt das Feld, wenn es auf halbe KP oder weniger fällt.", // NEEDS QC
	},
	fairyaura: {
		name: "Feenaura",
		// Official flavor text: "Erhöht die Stärke aller Attacken des Typs Fee."
		desc: "Solange dieses Pokémon im Kampf ist, wird die Stärke von Attacken vom Typ Fee aller Pokémon im Kampf mit 1,33 multipliziert.", // NEEDS QC
		shortDesc: "Solange es im Kampf ist, haben Fee-Attacken 1,33-fache Stärke.", // NEEDS QC

		start: "  {POKEMON} strahlt eine Feenaura aus!",
	},
	filter: {
		name: "Filter",
		shortDesc: "Erleidet 3/4 des Schadens durch sehr effektive Angriffe.", // NEEDS QC
	},
	firemane: {
		name: "Flammenmähne",
		shortDesc: "Feuer-Angriffe mit 1,5-facher Offensive.", // NEEDS QC
	},
	flamebody: {
		name: "Flammkörper",
		shortDesc: "30 % Chance, Angreifer bei Kontakt zu verbrennen.", // NEEDS QC
		gen4: {
			desc: "30 % Chance, dass ein Pokémon, das dieses Pokémon berührt, verbrannt wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
		},
		gen3: {
			desc: "1/3 Chance, dass ein Pokémon, das dieses Pokémon berührt, verbrannt wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
			shortDesc: "1/3 Chance, dass Pokémon bei Kontakt verbrannt werden.", // NEEDS QC
		},
	},
	flareboost: {
		name: "Hitzewahn",
		// Official flavor text: "Erhöht bei Verbrennungen die Stärke von Spezial-Attacken."
		desc: "Solange dieses Pokémon verbrannt ist, wird die Stärke seiner Spezial-Angriffe mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Ist es verbrannt, haben seine speziellen Angriffe 1,5-fache Stärke.", // NEEDS QC
	},
	flashfire: {
		name: "Feuerfänger",
		// Official flavor text: "Verstärkt Feuer-Attacken, wenn es von Feuer-Attacken getroffen wird."
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Feuer. Wird es zum ersten Mal von einer Attacke vom Typ Feuer getroffen, wird sein Offensivwert beim Einsatz einer Attacke vom Typ Feuer mit 1,5 multipliziert, solange es im Kampf bleibt und diese Fähigkeit behält. Ist dieses Pokémon eingefroren, kann es nicht durch Attacken vom Typ Feuer aufgetaut werden.", // NEEDS QC
		shortDesc: "Feuer-Angriffe x1,5 nach Treffer durch Feuer-Attacke; immun gegen Feuer.", // NEEDS QC
		gen4: {
			desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Feuer, solange es nicht eingefroren ist. Wird es zum ersten Mal von einer getroffen, wird der Schaden seiner Attacken vom Typ Feuer mit 1,5 multipliziert, solange es im Kampf bleibt und diese Fähigkeit behält.", // NEEDS QC
		},
		gen3: {
			desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Feuer, solange es nicht eingefroren ist. Wird es zum ersten Mal von einer getroffen, wird der Schaden seiner Attacken vom Typ Feuer mit 1,5 multipliziert, solange es im Kampf bleibt und diese Fähigkeit behält. Hat dieses Pokémon ein Statusproblem, ist es vom Typ Feuer oder hat es einen Delegator, löst Irrlicht diese Fähigkeit nicht aus.", // NEEDS QC
		},

		start: "  Die Stärke der Feuer-Attacken von {POKEMON} wurde erhöht!",
	},
	flowergift: {
		name: "Pflanzengabe",
		// Official flavor text: "Erhöht bei Sonnenschein den Angriff und die Spezial-Verteidigung aller Team-Pokémon."
		desc: "Wenn dieses Pokémon ein Kinoso ist und Sonne aktiv ist, nimmt es seine Sonnenform an, und sein Angriff und seine Spezial-Verteidigung sowie die seiner Mitstreiter werden mit 1,5 multipliziert. Diese Effekte werden verhindert, wenn das Pokémon einen Allzweckschirm trägt.", // NEEDS QC
		shortDesc: "Kinoso bei Sonne: Angriff und Sp.-Vert. x1,5 für es und Mitstreiter.", // NEEDS QC
		gen7: {
			desc: "Ist dieses Pokémon ein Kinoso und Sonne aktiv, nimmt es die Sonnenform an, und Angriff und Spezial-Verteidigung von ihm und seinen Mitstreitern werden mit 1,5 multipliziert.", // NEEDS QC
		},
		gen4: {
			desc: "Ist Sonne aktiv, werden Angriff und Spezial-Verteidigung dieses Pokémon und seiner Mitstreiter mit 1,5 multipliziert.", // NEEDS QC
			shortDesc: "Bei Sonne: 1,5x Angriff und Sp.-Vert. für dieses Pokémon und Mitstreiter.", // NEEDS QC
		},
	},
	flowerveil: {
		name: "Blütenhülle",
		// Official flavor text: "Schützt Mitstreiter vom Typ Pflanze vor dem Senken ihrer Statuswerte sowie vor Statusproblemen."
		desc: "Pokémon vom Typ Pflanze im Team dieses Pokémon können weder Statuswertsenkungen noch Statusprobleme durch andere Pokémon erleiden.", // NEEDS QC
		shortDesc: "Pflanzen-Pokémon des Teams erleiden keine Wertsenkungen oder Statusprobleme.", // NEEDS QC

		block: "  {POKEMON} wird von Blütenhülle geschützt!",
	},
	fluffy: {
		name: "Flauschigkeit",
		// Official flavor text: "Halbiert den Schaden, den es durch direkte Attacken nimmt, aber verdoppelt dafür den durch Feuer-Attacken erlittenen Schaden."
		desc: "Dieses Pokémon erleidet halben Schaden durch Kontaktattacken, aber doppelten Schaden durch Attacken vom Typ Feuer.", // NEEDS QC
		shortDesc: "Erleidet halben Schaden durch Kontakt, aber doppelten durch Feuer.", // NEEDS QC
	},
	forecast: {
		name: "Prognose",
		// Official flavor text: "Nimmt je nach Wetter entweder den Typ Wasser, Feuer oder Eis an."
		desc: "Wenn dieses Pokémon ein Formeo ist, ändert sich sein Typ je nach aktuellem Wetter, außer bei Sandsturm. Dieser Effekt wird verhindert, wenn dieses Pokémon einen Allzweckschirm trägt und Regen oder Sonne aktiv ist.", // NEEDS QC
		shortDesc: "Der Typ von Formeo ändert sich mit dem Wetter, außer bei Sandsturm.", // NEEDS QC
		gen7: {
			desc: "Ist dieses Pokémon ein Formeo, ändert sich sein Typ je nach Wetter, außer bei Sandsturm.", // NEEDS QC
		},
	},
	forewarn: {
		name: "Vorwarnung",
		// Official flavor text: "Gibt bei Kampfantritt Auskunft über eine Attacke aus dem gegnerischen Repertoire."
		desc: "Beim Einwechseln wird dieses Pokémon auf die stärkste Attacke aufmerksam gemacht, die ein Gegner kennt (bei Gleichstand zufällig gewählt). Dieser Effekt betrachtet K.O.-Attacken mit 150 Stärke; Konter, Spiegelcape und Metallstoß mit 120 Stärke; alle anderen offensiven Attacken ohne feste Stärke mit 80 Stärke; und Attacken ohne Schaden mit 1 Stärke.", // NEEDS QC
		shortDesc: "Erkennt beim Einwechseln die stärkste Attacke der Gegner.", // NEEDS QC
		gen4: {
			desc: "Beim Einwechseln erfährt dieses Pokémon zufällig die Attacke mit der höchsten Stärke, die ein Gegner kennt. Dieser Effekt betrachtet K.O.-Attacken mit 150 Stärke, Konter, Spiegelcape und Metallstoß mit 120 Stärke und alle anderen Angriffsattacken ohne feste Stärke mit 80 Stärke.", // NEEDS QC
		},

		activate: "  {MOVE} von {TARGET} wurde enthüllt!",
		activateNoTarget: "  Vorwarnung von {POKEMON}: Konzentration auf {MOVE}!",
	},
	friendguard: {
		name: "Freundeshut",
		shortDesc: "Seine Mitstreiter erleiden nur 3/4 des Schadens durch Angriffe anderer.", // NEEDS QC
	},
	frisk: {
		name: "Schnüffler",
		shortDesc: "Erkennt beim Einwechseln die getragenen Items aller Gegner.", // NEEDS QC
		gen5: {
			shortDesc: "Beim Einwechseln erfährt es das Item eines zufälligen Gegners.", // NEEDS QC
		},

		activate: "  {POKEMON} hat das Item {ITEM} von {TARGET} erschnüffelt!",
		activateNoTarget: "  {POKEMON} hat {ITEM} erschnüffelt!",
	},
	fullmetalbody: {
		name: "Metallprotektor",
		shortDesc: "Hindert andere Pokémon daran, seine Statuswerte zu senken.", // NEEDS QC
	},
	furcoat: {
		name: "Fellkleid",
		shortDesc: "Die Verteidigung dieses Pokémon wird verdoppelt.", // NEEDS QC
	},
	galewings: {
		name: "Orkanschwingen",
		shortDesc: "Bei vollen KP haben seine Flug-Attacken Priorität +1.", // NEEDS QC
		gen6: {
			shortDesc: "Flug-Attacken dieses Pokémon erhalten +1 Priorität.", // NEEDS QC
		},
	},
	galvanize: {
		name: "Elektrohaut",
		// Official flavor text: "Attacken vom Typ Normal nehmen den Typ Elektro an und ihre Stärke erhöht sich ein wenig."
		desc: "Attacken dieses Pokémon vom Typ Normal werden zu Attacken vom Typ Elektro und ihre Stärke wird mit 1,2 multipliziert. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, aber vor den Effekten von Plasmaschauer und Elektrifizierung.", // NEEDS QC
		shortDesc: "Seine Normal-Attacken werden zu Elektro-Attacken mit 1,2-facher Stärke.", // NEEDS QC
	},
	gluttony: {
		name: "Völlerei",
		// Official flavor text: "Setzt bestimmte Beeren nicht erst in einer Notlage ein, sondern bereits dann, wenn seine KP auf die Hälfte des Maximalwerts fallen."
		desc: "Trägt dieses Pokémon eine Beere, die normalerweise bei 1/4 oder weniger der maximalen KP wirkt, isst es sie bereits bei der Hälfte oder weniger der maximalen KP.", // NEEDS QC
		shortDesc: "Isst Beeren schon bei halben KP statt bei 1/4 der max. KP.", // NEEDS QC
	},
	goodasgold: {
		name: "Goldkörper",
		shortDesc: "Dieses Pokémon ist immun gegen Status-Attacken.", // NEEDS QC
	},
	gooey: {
		name: "Viskosität",
		shortDesc: "Angreifer verlieren bei Kontakt eine Initiative-Stufe.", // NEEDS QC
	},
	gorillatactics: {
		name: "Affenfokus",
		// Official flavor text: "Erhöht den Angriff, aber nur die zuerst gewählte Attacke kann eingesetzt werden."
		desc: "Der Angriff dieses Pokémon wird mit 1,5 multipliziert, aber es kann nur seine zuerst eingesetzte Attacke wählen. Diese Effekte werden verhindert, solange dieses Pokémon dynamaximiert ist.", // NEEDS QC
		shortDesc: "Angriff x1,5, aber es kann nur seine erste Attacke wählen.", // NEEDS QC
	},
	grasspelt: {
		name: "Pflanzenpelz",
		shortDesc: "Ist ein Grasfeld aktiv, wird seine Verteidigung mit 1,5 multipliziert.", // NEEDS QC
	},
	grassysurge: {
		name: "Gras-Erzeuger",
		shortDesc: "Beim Einwechseln erzeugt dieses Pokémon ein Grasfeld.", // NEEDS QC
	},
	grimneigh: {
		name: "Dunkles Wiehern",
		// Official flavor text: "Besiegt es ein Pokémon, stößt es ein furchteinflößendes Wiehern aus und erhöht damit seinen Spezial-Angriff."
		desc: "Der Spezial-Angriff dieses Pokémon steigt um eine Stufe, wenn es ein anderes Pokémon mit einem Angriff kampfunfähig macht.", // NEEDS QC
		shortDesc: "Sein Sp.-Ang. steigt um eine Stufe, wenn es ein Pokémon besiegt.", // NEEDS QC
	},
	guarddog: {
		name: "Wachhund",
		desc: "Dieses Pokémon ist immun gegen den Effekt der Fähigkeit Bedroher: Stattdessen steigt sein Angriff um eine Stufe. Dieses Pokémon kann nicht durch Attacken oder Items anderer Pokémon zum Auswechseln gezwungen werden.", // NEEDS QC
		shortDesc: "Immun gegen Bedroher: stattdessen +1 Angriff. Kann nicht verdrängt werden.", // NEEDS QC
	},
	gulpmissile: {
		name: "Würggeschoss",
		// Official flavor text: "Wenn das Pokémon Surfer oder Taucher einsetzt, fängt es sich dabei Beute. Erleidet es anschließend Schaden, greift es an, indem es die Beute wieder ausspuckt."
		desc: "Wenn dieses Pokémon ein Urgl ist, ändert es seine Form, wenn es ein Ziel mit Surfer trifft oder die erste Runde von Taucher abschließt. Es nimmt die Schlingform mit einem Pikuda im Maul an, wenn es mehr als die Hälfte seiner maximalen KP hat, oder die Stopfform mit einem Pikachu im Maul, wenn es die Hälfte oder weniger hat. Wird Urgl in einer dieser Formen getroffen, spuckt es das Pikuda oder Pikachu auf den Angreifer, selbst wenn es keine KP mehr hat. Das Geschoss verursacht Schaden in Höhe von 1/4 der maximalen KP des Ziels, abgerundet; dieser Schaden wird durch die Fähigkeit Magieschild verhindert, nicht aber durch einen Delegator. Ein Pikuda senkt zudem die Verteidigung des Ziels um eine Stufe, und ein Pikachu paralysiert das Ziel. Urgl kehrt zur Normalform zurück, wenn es ein Geschoss spuckt, ausgewechselt wird oder dynamaximiert.", // NEEDS QC; form names Schlingform/Stopfform via PokéWiki
		shortDesc: "Nach Surfer/Taucher getroffen: Angreifer verliert 1/4 KP und -1 Vert. oder Paralyse.", // NEEDS QC
	},
	guts: {
		name: "Adrenalin",
		// Official flavor text: "Bei Statusproblemen setzt es Adrenalin frei und erhöht so seinen Angriffs-Wert."
		desc: "Hat dieses Pokémon ein Statusproblem, wird sein Angriff mit 1,5 multipliziert. Physische Angriffe dieses Pokémon ignorieren die Schadenshalbierung durch Verbrennung.", // NEEDS QC
		shortDesc: "Mit Statusproblem: Angriff x1,5; ignoriert die Verbrennungs-Schwächung.", // NEEDS QC
	},
	hadronengine: {
		name: "Hadronen-Motor",
		shortDesc: "Erzeugt beim Einwechseln ein Elektrofeld; darauf Sp.-Ang. x1,3333.", // NEEDS QC

		start: "  {POKEMON} erzeugt ein Elektrofeld und setzt dadurch einen futuristischen Motor in Gang!",
		activate: "  {POKEMON} setzt durch das Elektrofeld einen futuristischen Motor in Gang!",
	},
	harvest: {
		name: "Reiche Ernte",
		// Official flavor text: "Dieselbe Beere kann mehrmals verwendet werden."
		desc: "Ist das zuletzt verwendete Item dieses Pokémon eine Beere, besteht am Ende jeder Runde eine Chance von 50 %, dass sie wiederhergestellt wird. Wenn Sonne aktiv ist, beträgt die Chance 100 %.", // NEEDS QC
		shortDesc: "Letztes Item eine Beere: 50 % Chance pro Runde auf Rückgewinn, 100 % bei Sonne.", // NEEDS QC

		addItem: "  {POKEMON} hat {ITEM} geerntet!",
	},
	healer: {
		name: "Heilherz",
		// Official flavor text: "Befreit Mitstreiter gelegentlich von Statusproblemen."
		desc: "Es besteht eine Chance von 30 %, dass das Statusproblem des Mitstreiters dieses Pokémon am Ende jeder Runde geheilt wird.", // NEEDS QC
		shortDesc: "30 % Chance, das Statusproblem des Mitstreiters pro Runde zu heilen.", // NEEDS QC
		champions: {
			desc: null, // NEEDS TRANSLATION: not in PokeAPI
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
		gen6: {
			desc: "30 % Chance je benachbartem Mitstreiter, dass sein Statusproblem am Ende jeder Runde geheilt wird.", // NEEDS QC
			shortDesc: "30 % Chance je benachbartem Mitstreiter auf Statusheilung am Rundenende.", // NEEDS QC
		},
	},
	heatproof: {
		name: "Hitzeschutz",
		// Official flavor text: "Sein Hitze abweisender Körper halbiert den durch Feuer-Attacken erlittenen Schaden."
		desc: "Setzt ein Pokémon einen Angriff vom Typ Feuer gegen dieses Pokémon ein, wird sein Offensivwert bei der Schadensberechnung halbiert. Dieses Pokémon erleidet die Hälfte des üblichen Verbrennungsschadens, abgerundet.", // NEEDS QC
		shortDesc: "Feuer-Angriffe treffen mit halbierter Offensive. Halber Verbrennungsschaden.", // NEEDS QC
		gen8: {
			desc: "Die Stärke von Attacken vom Typ Feuer gegen dieses Pokémon wird halbiert. Dieses Pokémon erleidet nur den halben üblichen Verbrennungsschaden, abgerundet.", // NEEDS QC
			shortDesc: "Halbiert die Stärke von Feuer-Attacken gegen dieses Pokémon; halber Brandschaden.", // NEEDS QC
		},
	},
	heavymetal: {
		name: "Schwermetall",
		// Official flavor text: "Verdoppelt das eigene Gewicht."
		desc: "Das Gewicht dieses Pokémon wird verdoppelt. Dieser Effekt wird nach dem Effekt von Autotomie und vor dem des Leichtsteins berechnet.", // NEEDS QC
		shortDesc: "Das Gewicht dieses Pokémon wird verdoppelt.", // NEEDS QC
	},
	honeygather: {
		name: "Honigmaul",
		shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC
	},
	hospitality: {
		name: "Gastlichkeit",
		shortDesc: "Beim Einwechseln heilt es 1/4 der max. KP seines Mitstreiters.", // NEEDS QC

		heal: "  {POKEMON} trinkt den von {SOURCE} zubereiteten Tee!",
	},
	hugepower: {
		name: "Kraftkoloss",
		shortDesc: "Der Angriff dieses Pokémon wird verdoppelt.", // NEEDS QC
	},
	hungerswitch: {
		name: "Heißhunger",
		// Official flavor text: "Das Pokémon ändert zum Ende jeder Runde seine Form und wechselt somit zwischen dem Pappsatt- und dem Kohldampfmuster."
		desc: "Wenn dieses Pokémon ein Morpeko ist, wechselt es am Ende jeder Runde zwischen dem Pappsattmuster und dem Kohldampfmuster.", // NEEDS QC
		shortDesc: "Morpeko wechselt am Rundenende zwischen Pappsatt- und Kohldampfmuster.", // NEEDS QC
	},
	hustle: {
		name: "Übereifer",
		// Official flavor text: "Erhöht den Angriffs-Wert, aber senkt die Genauigkeit."
		desc: "Der Angriff dieses Pokémon wird mit 1,5 und die Genauigkeit seiner physischen Angriffe mit 0,8 multipliziert.", // NEEDS QC
		shortDesc: "Sein Angriff ist x1,5, die Genauigkeit physischer Angriffe aber x0,8.", // NEEDS QC
	},
	hydration: {
		name: "Hydration",
		// Official flavor text: "Heilt bei Regen Statusprobleme."
		desc: "Das Statusproblem dieses Pokémon wird am Ende jeder Runde geheilt, wenn Regen aktiv ist. Dieser Effekt wird verhindert, wenn dieses Pokémon einen Allzweckschirm trägt.", // NEEDS QC
		shortDesc: "Sein Statusproblem wird am Rundenende geheilt, wenn Regen aktiv ist.", // NEEDS QC
		gen7: {
			desc: "Ist Regen aktiv, wird das Statusproblem dieses Pokémon am Ende jeder Runde geheilt.", // NEEDS QC
		},
	},
	hypercutter: {
		name: "Scherenmacht",
		shortDesc: "Hindert andere Pokémon daran, seinen Angriff zu senken.", // NEEDS QC
	},
	icebody: {
		name: "Eishaut",
		// Official flavor text: "Regeneriert bei Hagel nach und nach KP."
		desc: "Bei Schnee stellt dieses Pokémon am Ende jeder Runde 1/16 seiner maximalen KP wieder her, abgerundet.", // NEEDS QC
		shortDesc: "Bei Schnee heilt es pro Runde 1/16 seiner max. KP.", // NEEDS QC
		gen8: {
			desc: "Ist Hagelsturm aktiv, stellt dieses Pokémon am Ende jeder Runde 1/16 seiner maximalen KP wieder her, abgerundet. Dieses Pokémon erleidet keinen Schaden durch Hagelsturm.", // NEEDS QC
			shortDesc: "Bei Hagel: heilt 1/16 der max. KP pro Runde; immun gegen Hagel.", // NEEDS QC
		},
	},
	iceface: {
		name: "Tiefkühlkopf",
		// Official flavor text: "Der Eisblock um seinen Kopf blockt eine physische Attacke ab. Dies bewirkt jedoch einen Formwechsel. Durch Hagel wird der Eisblock wiederhergestellt."
		desc: "Wenn dieses Pokémon ein Kubuin ist, verursacht der erste physische Treffer im Kampf 0 (neutralen) Schaden. Danach bricht sein Eiskopf und es nimmt die Wohlfühlkopf-Form an. Kubuin nimmt seine Tiefkühlkopf-Form wieder an, wenn es zu schneien beginnt oder wenn es bei Schnee eingewechselt wird. Auch Verwirrungsschaden lässt den Eiskopf brechen.", // NEEDS QC; form names Wohlfühlkopf/Tiefkühlkopf via PokéWiki
		shortDesc: "(Kubuin) Der erste physische Treffer schadet nicht. Kehrt bei Schnee zurück.", // NEEDS QC
		gen8: {
			desc: "Wenn dieses Pokémon ein Kubuin ist, verursacht der erste physische Treffer im Kampf 0 (neutralen) Schaden. Danach bricht sein Eisgesicht und es nimmt die Wohlfühlkopf-Form an. Es nimmt seine Tiefkühlkopf-Form wieder an, wenn Hagelsturm beginnt oder es bei Hagelsturm eingewechselt wird. Auch Verwirrungsschaden lässt das Eisgesicht brechen.", // NEEDS QC; form name Wohlfühlkopf via PokéWiki
			shortDesc: "Als Kubuin: erster physischer Treffer macht 0 Schaden. Bei Hagel erneuert.", // NEEDS QC
		},
	},
	icescales: {
		name: "Eisflügelstaub",
		shortDesc: "Erleidet nur halben Schaden durch spezielle Angriffe.", // NEEDS QC
	},
	illuminate: {
		name: "Erleuchtung",
		// Official flavor text: "Erhellt die Umgebung und erhöht dadurch die Wahrscheinlichkeit, wilden Pokémon zu begegnen."
		desc: "Hindert andere Pokémon daran, die Genauigkeit dieses Pokémon zu senken. Dieses Pokémon ignoriert die Fluchtwert-Stufe des Ziels.", // NEEDS QC
		shortDesc: "Seine Genauigkeit kann nicht gesenkt werden; ignoriert den Fluchtwert.", // NEEDS QC
		gen8: {
			desc: "Kein Nutzen im Kampf.", // NEEDS QC
			shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC
		},
	},
	illusion: {
		name: "Trugbild",
		// Official flavor text: "Führt den Gegner hinters Licht, indem es bei Kampfantritt die Gestalt des Pokémon an der letzten Stelle im Team annimmt."
		desc: "Beim Einwechseln nimmt dieses Pokémon die Gestalt des letzten nicht kampfunfähigen Pokémon seines Teams an, bis es direkten Schaden durch einen Angriff erleidet. Angezeigt werden Level und KP dieses Pokémon, nicht die des imitierten Pokémon.", // NEEDS QC
		shortDesc: "Erscheint als letztes Team-Pokémon, bis es direkten Schaden erleidet.", // NEEDS QC

		end: "  Das Trugbild von {POKEMON} verschwindet!",
	},
	immunity: {
		name: "Immunität",
		shortDesc: "Kann nicht vergiftet werden. Erhalt der Fähigkeit heilt Vergiftung.", // NEEDS QC
	},
	imposter: {
		name: "Doppelgänger",
		// Official flavor text: "Kämpft als Kopie seines Gegenübers."
		desc: "Beim Einwechseln verwandelt sich dieses Pokémon in den ihm gegenüberstehenden Gegner. Steht dort kein Pokémon, verwandelt es sich nicht.", // NEEDS QC
		shortDesc: "Verwandelt sich beim Einwechseln in den gegenüberstehenden Gegner.", // NEEDS QC
	},
	infiltrator: {
		name: "Schwebedurch",
		// Official flavor text: "Überwindet gegnerische Schilde sowie Delegatoren und greift an."
		desc: "Attacken dieses Pokémon ignorieren Delegatoren sowie Reflektor, Lichtschild, Bodyguard, Weißnebel und Auroraschleier der gegnerischen Seite.", // NEEDS QC
		shortDesc: "Seine Attacken ignorieren Delegatoren, Schilde, Bodyguard und Weißnebel.", // NEEDS QC
		gen6: {
			desc: "Attacken dieses Pokémon ignorieren Delegatoren sowie Reflektor, Lichtschild, Bodyguard und Weißnebel der gegnerischen Seite.", // NEEDS QC
			shortDesc: "Attacken ignorieren Delegatoren sowie Reflektor, Lichtschild, Bodyguard, Weißnebel.", // NEEDS QC
		},
		gen5: {
			desc: "Attacken dieses Pokémon ignorieren Reflektor, Lichtschild, Bodyguard und Weißnebel der gegnerischen Seite.", // NEEDS QC
			shortDesc: "Attacken ignorieren Reflektor, Lichtschild, Bodyguard und Weißnebel des Gegners.", // NEEDS QC
		},
	},
	innardsout: {
		name: "Magenkrempler",
		// Official flavor text: "Wird es durch eine Attacke besiegt, fügt es dem Angreifer Schaden in Höhe des KP-Werts zu, den es besaß, bevor es kampfunfähig wurde."
		desc: "Wird dieses Pokémon durch eine Attacke kampfunfähig, verliert der Angreifer so viele KP, wie diesem Pokémon an Schaden zugefügt wurden.", // NEEDS QC
		shortDesc: "Wird es besiegt, verliert der Angreifer ebenso viele KP.", // NEEDS QC

		damage: "#aftermath",
	},
	innerfocus: {
		name: "Konzentrator",
		// Official flavor text: "Verhindert durch erhöhte Konzentrationsfähigkeit Zurückschrecken."
		desc: "Dieses Pokémon kann nicht zurückschrecken. Es ist immun gegen den Effekt der Fähigkeit Bedroher.", // NEEDS QC
		shortDesc: "Kann nicht zurückschrecken. Immun gegen Bedroher.", // NEEDS QC
		gen7: {
			desc: "Dieses Pokémon kann nicht zurückschrecken.", // NEEDS QC
			shortDesc: "Dieses Pokémon kann nicht zurückschrecken.", // NEEDS QC
		},
	},
	insomnia: {
		name: "Insomnia",
		shortDesc: "Kann nicht einschlafen. Erhalt der Fähigkeit weckt es auf.", // NEEDS QC
	},
	intimidate: {
		name: "Bedroher",
		// Official flavor text: "Senkt den Angriff der Gegner, indem es sie gleich zu Kampfantritt bedroht und einschüchtert."
		desc: "Beim Einwechseln senkt dieses Pokémon den Angriff der Gegner um eine Stufe. Pokémon mit den Fähigkeiten Konzentrator, Dösigkeit, Tempomacher oder Rauflust sowie Pokémon hinter einem Delegator sind immun.", // NEEDS QC
		shortDesc: "Senkt beim Einwechseln den Angriff der Gegner um eine Stufe.", // NEEDS QC
		gen7: {
			desc: "Beim Einwechseln senkt dieses Pokémon den Angriff der Gegner um eine Stufe. Pokémon hinter einem Delegator sind immun.", // NEEDS QC
		},
		gen6: {
			desc: "Beim Einwechseln senkt dieses Pokémon den Angriff benachbarter Gegner um eine Stufe. Pokémon hinter einem Delegator sind immun.", // NEEDS QC
			shortDesc: "Beim Einwechseln: -1 Angriff für benachbarte Gegner.", // NEEDS QC
		},
		gen4: {
			desc: "Beim Einwechseln senkt dieses Pokémon den Angriff der Gegner um eine Stufe. Pokémon hinter einem Delegator sind immun. Zerbricht Kehrtwende einen gegnerischen Delegator und wird dieses Pokémon als Ersatz eingewechselt, bleibt das Pokémon, das den Delegator hatte, dennoch immun gegen diese Fähigkeit.", // NEEDS QC
			shortDesc: "Senkt beim Einwechseln den Angriff der Gegner um eine Stufe.", // NEEDS QC
		},
		gen3: {
			desc: "Beim Einwechseln senkt dieses Pokémon den Angriff der Gegner um eine Stufe. Pokémon hinter einem Delegator sind immun.", // NEEDS QC
		},
	},
	intrepidsword: {
		name: "Kühnes Schwert",
		shortDesc: "Beim Einwechseln steigt sein Angriff um eine Stufe. Einmal pro Kampf.", // NEEDS QC
		gen8: {
			shortDesc: "Beim Einwechseln steigt sein Angriff um eine Stufe.", // NEEDS QC
		},
	},
	ironbarbs: {
		name: "Eisenstachel",
		// Official flavor text: "Fügt dem Angreifer bei Berührung mit eisernen Stacheln Schaden zu."
		desc: "Pokémon, die dieses Pokémon mit einer Kontaktattacke treffen, verlieren 1/8 ihrer maximalen KP, abgerundet.", // NEEDS QC
		shortDesc: "Angreifer verlieren bei Kontakt 1/8 ihrer max. KP.", // NEEDS QC

		damage: "#roughskin",
	},
	ironfist: {
		name: "Eisenfaust",
		// Official flavor text: "Erhöht die Stärke von Hieb-, Punch-, Faust- und Schlag-Attacken."
		desc: "Die Stärke von Hieb-Attacken dieses Pokémon wird mit 1,2 multipliziert.", // NEEDS QC
		shortDesc: "Hieb-Attacken mit 1,2-facher Stärke. Tiefschlag ausgenommen.", // NEEDS QC
	},
	justified: {
		name: "Redlichkeit",
		shortDesc: "+1 Angriff, wenn es Schaden durch eine Unlicht-Attacke erleidet.", // NEEDS QC
	},
	keeneye: {
		name: "Adlerauge",
		// Official flavor text: "Sein scharfer Blick hindert Angreifer daran, seine Genauigkeit zu senken."
		desc: "Hindert andere Pokémon daran, die Genauigkeit dieses Pokémon zu senken. Dieses Pokémon ignoriert die Fluchtwert-Stufe des Ziels.", // NEEDS QC
		shortDesc: "Seine Genauigkeit kann nicht gesenkt werden; ignoriert den Fluchtwert.", // NEEDS QC
		gen5: {
			desc: "Verhindert, dass andere Pokémon die Genauigkeits-Stufe dieses Pokémon senken.", // NEEDS QC
			shortDesc: "Andere Pokémon können die Genauigkeit dieses Pokémon nicht senken.", // NEEDS QC
		},
	},
	klutz: {
		name: "Tollpatsch",
		// Official flavor text: "Das Pokémon kann keine getragenen Items verwenden."
		desc: "Das getragene Item dieses Pokémon hat keine Wirkung. Dieses Pokémon kann Schleuder nicht erfolgreich einsetzen. Machoband, Machtkette, Machtband, Machtgurt, Machtreif, Machtlinse und Machtgewicht behalten ihre Wirkung.", // NEEDS QC
		shortDesc: "Sein Item ist wirkungslos (außer Machoband). Schleuder unbrauchbar.", // NEEDS QC
	},
	leafguard: {
		name: "Floraschild",
		// Official flavor text: "Verhindert bei Sonnenschein Statusprobleme."
		desc: "Wenn Sonne aktiv ist, kann dieses Pokémon weder von Statusproblemen noch von Gähner betroffen werden, und Erholung schlägt bei ihm fehl. Dieser Effekt wird verhindert, wenn dieses Pokémon einen Allzweckschirm trägt.", // NEEDS QC
		shortDesc: "Bei Sonne: keine Statusprobleme, und Erholung schlägt fehl.", // NEEDS QC
		gen7: {
			desc: "Ist Sonne aktiv, kann dieses Pokémon weder Statusprobleme noch den Effekt von Gähner erleiden, und Erholung schlägt für dieses Pokémon fehl.", // NEEDS QC
		},
		gen4: {
			desc: "Ist Sonne aktiv, kann dieses Pokémon weder Statusprobleme noch den Effekt von Gähner erleiden, kann Erholung aber normal einsetzen.", // NEEDS QC
			shortDesc: "Bei Sonne: keine Statusprobleme, aber Erholung funktioniert normal.", // NEEDS QC
		},
	},
	levitate: {
		name: "Schwebe",
		// Official flavor text: "Verleiht volle Immunität gegen alle Boden-Attacken durch Schwebezustand."
		desc: "Dieses Pokémon ist immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen, Klebenetz und der Fähigkeit Ausweglos. Die Effekte von Erdanziehung, Verwurzler, Katapult, Tausend Pfeile und der Eisenkugel heben die Immunität auf. Tausend Pfeile kann dieses Pokémon treffen, als hätte es diese Fähigkeit nicht.", // NEEDS QC
		shortDesc: "Immun gegen Boden; Erdanziehung/Verwurzler/Katapult/Eisenkugel heben es auf.", // NEEDS QC
		gen5: {
			desc: "Dieses Pokémon ist immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen und der Fähigkeit Ausweglos. Die Effekte von Erdanziehung, Verwurzler, Katapult und Eisenkugel heben die Immunität auf.", // NEEDS QC
		},
		gen4: {
			desc: "Dieses Pokémon ist immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler, Giftspitzen und der Fähigkeit Ausweglos. Die Effekte von Erdanziehung, Verwurzler und Eisenkugel heben die Immunität auf.", // NEEDS QC
			shortDesc: "Immun gegen Boden; Erdanziehung/Verwurzler/Eisenkugel heben es auf.", // NEEDS QC
		},
		gen3: {
			desc: "Dieses Pokémon ist immun gegen Angriffe vom Typ Boden sowie gegen die Effekte von Stachler und der Fähigkeit Ausweglos.", // NEEDS QC
			shortDesc: "Dieses Pokémon ist immun gegen Boden.", // NEEDS QC
		},
	},
	libero: {
		name: "Libero",
		// Official flavor text: "Das Pokémon nimmt bei Einsatz einer Attacke deren Typ an."
		desc: "Der Typ dieses Pokémon wird zu dem der Attacke, die es gleich einsetzt. Dieser Effekt tritt nach allen Effekten ein, die den Typ einer Attacke ändern. Er kann nur einmal pro Einwechseln eintreten und nur, wenn dieses Pokémon nicht terakristallisiert ist.", // NEEDS QC
		shortDesc: "Sein Typ wird zu dem seiner Attacke. Einmal pro Einwechseln.", // NEEDS QC
		gen8: {
			desc: "Der Typ dieses Pokémon ändert sich zum Typ der Attacke, die es einsetzen will. Dieser Effekt tritt nach allen Effekten ein, die den Typ einer Attacke ändern.", // NEEDS QC
			shortDesc: "Der Typ dieses Pokémon wird zum Typ der Attacke, die es einsetzen will.", // NEEDS QC
		},
	},
	lightmetal: {
		name: "Leichtmetall",
		// Official flavor text: "Halbiert das eigene Gewicht."
		desc: "Das Gewicht dieses Pokémon wird halbiert, abgerundet auf ein Zehntelkilogramm. Dieser Effekt wird nach dem Effekt von Autotomie und vor dem des Leichtsteins berechnet. Das Gewicht eines Pokémon kann nicht unter 0,1 kg fallen.", // NEEDS QC
		shortDesc: "Das Gewicht dieses Pokémon wird halbiert.", // NEEDS QC
	},
	lightningrod: {
		name: "Blitzfänger",
		// Official flavor text: "Zieht Elektro-Attacken an. Statt durch diese Schaden zu nehmen, erhöht es den eigenen Spezial-Angriff."
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Elektro und sein Spezial-Angriff steigt um eine Stufe, wenn es von einer Attacke vom Typ Elektro getroffen wird. Ist dieses Pokémon nicht das Ziel einer Attacke vom Typ Elektro mit einzelnem Ziel eines anderen Pokémon, lenkt es diese auf sich um, sofern es in ihrer Reichweite ist. Können mehrere Pokémon mit dieser Fähigkeit umlenken, tut es das mit der höchsten Initiative oder bei Gleichstand das, dessen Fähigkeit länger aktiv ist.", // NEEDS QC
		shortDesc: "Zieht Elektro-Attacken an und erhält +1 Sp.-Ang.; immun gegen Elektro.", // NEEDS QC
		gen4: {
			desc: "Ist dieses Pokémon nicht das Ziel einer Elektro-Attacke eines anderen Pokémon mit nur einem Ziel, lenkt es diese Attacke auf sich um.", // NEEDS QC
			shortDesc: "Zieht Elektro-Attacken mit nur einem Ziel auf sich.", // NEEDS QC
		},
		gen3: {
			desc: "Ist dieses Pokémon nicht das Ziel einer Elektro-Attacke eines Gegners mit nur einem Ziel, lenkt es diese Attacke auf sich um. Dieser Effekt behandelt Kraftreserve als Attacke vom Typ Normal.", // NEEDS QC
			shortDesc: "Zieht gegnerische Elektro-Attacken mit nur einem Ziel auf sich.", // NEEDS QC
		},

		activate: "  {POKEMON} zieht den Angriff auf sich!",
	},
	limber: {
		name: "Flexibilität",
		shortDesc: "Kann nicht paralysiert werden. Erhalt der Fähigkeit heilt Paralyse.", // NEEDS QC
	},
	lingeringaroma: {
		name: "Duftschwade",
		desc: "Pokémon, die dieses Pokémon mit einer Kontaktattacke treffen, erhalten die Fähigkeit Duftschwade. Betrifft nicht Pokémon mit den Fähigkeiten Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Duftschwade, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Wandel, Trance-Modus und Superwechsel.", // NEEDS QC
		shortDesc: "Angreifer erhalten bei Kontakt die Fähigkeit Duftschwade.", // NEEDS QC
		gen8: {
			desc: "Pokémon, die dieses Pokémon berühren, erhalten die Fähigkeit Duftschwade. Wirkt nicht auf Pokémon mit den Fähigkeiten Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Duftschwade, Variabilität, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus.", // NEEDS QC
		},

		changeAbility: "  {TARGET} haftet ein penetranter Geruch an!",
	},
	liquidooze: {
		name: "Kloakensoße",
		shortDesc: "Wer ihm KP absaugt, erleidet ebenso viel Schaden statt Heilung.", // NEEDS QC
		gen4: {
			desc: "Dieses Pokémon fügt Pokémon, die KP von ihm absaugen, so viel Schaden zu, wie sie heilen würden. Dieser Effekt berücksichtigt Traumfresser nicht.", // NEEDS QC
		},

		damage: "  {POKEMON} saugt Kloakensoße auf!",
	},
	liquidvoice: {
		name: "Plätscherstimme",
		// Official flavor text: "Bewirkt, dass alle Lärm-Attacken des Pokémon den Typ Wasser annehmen."
		desc: "Geräuschbasierte Attacken dieses Pokémon werden zu Attacken vom Typ Wasser. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, aber vor den Effekten von Plasmaschauer und Elektrifizierung.", // NEEDS QC
		shortDesc: "Seine geräuschbasierten Attacken werden zu Wasser-Attacken.", // NEEDS QC
	},
	longreach: {
		name: "Langstrecke",
		shortDesc: "Seine Angriffe stellen keinen Körperkontakt her.", // NEEDS QC
	},
	magicbounce: {
		name: "Magiespiegel",
		// Official flavor text: "Lenkt Status-Attacken auf den Angreifer um, ohne selbst von ihnen getroffen zu werden."
		desc: "Dieses Pokémon ist von bestimmten nicht schädigenden Attacken, die auf es zielen, nicht betroffen und lenkt sie stattdessen auf den ursprünglichen Anwender zurück. So zurückgeworfene Attacken können nicht erneut durch diese Fähigkeit oder den Effekt von Magiemantel zurückgeworfen werden. Stachler, Tarnsteine, Klebenetz und Giftspitzen können nur einmal pro Seite zurückgeworfen werden, und zwar vom am weitesten links stehenden Pokémon mit dieser Fähigkeit oder unter dem Effekt von Magiemantel. Die Fähigkeiten Blitzfänger und Sturmsog lenken ihre jeweiligen Attacken um, bevor diese Fähigkeit wirkt.", // NEEDS QC
		shortDesc: "Wirft bestimmte Status-Attacken auf den Anwender zurück.", // NEEDS QC
		gen5: {
			desc: "Dieses Pokémon ist von bestimmten auf es gerichteten Status-Attacken unbeeinflusst und setzt sie stattdessen gegen den ursprünglichen Anwender ein. So reflektierte Attacken können nicht erneut durch diese Fähigkeit oder Magiemantel reflektiert werden. Stachler, Tarnsteine und Giftspitzen können nur einmal pro Seite reflektiert werden, und zwar vom Pokémon ganz links unter dieser Fähigkeit oder dem Effekt von Magiemantel. Die Fähigkeiten Blitzfänger und Sturmsog lenken ihre jeweiligen Attacken um, bevor diese Fähigkeit wirkt.", // NEEDS QC
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "Magieschild",
		// Official flavor text: "Das Pokémon nimmt nur durch Offensiv-Attacken Schaden."
		desc: "Dieses Pokémon kann nur durch direkte Angriffe Schaden erleiden. Der Schaden von selbst eingesetzten Fluch und Delegator, von Bauchtrommel, von Leidteiler, vom Rückstoß von Verzweifler und von Verwirrung gilt als direkt.", // NEEDS QC
		shortDesc: "Kann nur durch direkte Angriffe Schaden erleiden.", // NEEDS QC
		gen4: {
			desc: "Dieses Pokémon kann nur durch direkte Angriffe Schaden erleiden. Fluch und Delegator beim Einsatz, Bauchtrommel, Leidteiler, der Rückstoß von Verzweifler und Verwirrungsschaden gelten als direkter Schaden. Dieses Pokémon kann nicht durch Paralyse am Handeln gehindert werden und ist beim Einwechseln immun gegen Giftspitzen.", // NEEDS QC
			shortDesc: "Nur direkte Angriffe schaden ihm; Paralyse verhindert nie das Handeln.", // NEEDS QC
		},
	},
	magician: {
		name: "Zauberer",
		// Official flavor text: "Trifft das Pokémon ein Ziel mit einer Attacke, kann es ihm dabei sein Item stehlen."
		desc: "Hat dieses Pokémon kein Item, stiehlt es das Item eines Pokémon, das es mit einem Angriff trifft. Betrifft nicht Kismetwunsch und Seher. Trifft ein Angriff mehrere Ziele, wird das Item dem schnellsten Pokémon gestohlen, unter Berücksichtigung von Bizarroraum und mit Vorrang für Gegner vor Mitstreitern.", // NEEDS QC
		shortDesc: "Ohne eigenes Item stiehlt es das Item getroffener Pokémon.", // NEEDS QC
	},
	magmaarmor: {
		name: "Magmapanzer",
		shortDesc: "Kann nicht eingefroren werden. Erhalt der Fähigkeit taut es auf.", // NEEDS QC
	},
	magnetpull: {
		name: "Magnetfalle",
		// Official flavor text: "Hindert Stahl-Pokémon durch Magnetismus an der Flucht."
		desc: "Hindert Gegner vom Typ Stahl daran, sich auswechseln zu lassen, außer sie tragen eine Wechselhülle oder sind vom Typ Geist.", // NEEDS QC
		shortDesc: "Hindert Gegner vom Typ Stahl am Auswechseln.", // NEEDS QC
		gen6: {
			desc: "Hindert benachbarte Gegner vom Typ Stahl daran, sich auswechseln zu lassen, außer sie tragen eine Wechselhülle oder sind vom Typ Geist.", // NEEDS QC
			shortDesc: "Benachbarte Stahl-Gegner können nicht auswechseln.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert benachbarte Gegner vom Typ Stahl daran, sich auswechseln zu lassen, außer sie tragen eine Wechselhülle.", // NEEDS QC
			shortDesc: "Benachbarte Stahl-Gegner können nicht auswechseln.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert Gegner vom Typ Stahl daran, sich auswechseln zu lassen, außer sie tragen eine Wechselhülle.", // NEEDS QC
			shortDesc: "Hindert Gegner vom Typ Stahl am Auswechseln.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert Pokémon vom Typ Stahl daran, sich auswechseln zu lassen, mit Ausnahme dieses Pokémon.", // NEEDS QC
			shortDesc: "Stahl-Pokémon außer diesem können nicht auswechseln.", // NEEDS QC
		},
	},
	marvelscale: {
		name: "Notschutz",
		shortDesc: "Mit Statusproblem wird seine Verteidigung mit 1,5 multipliziert.", // NEEDS QC
	},
	megalauncher: {
		name: "Megawumme",
		// Official flavor text: "Erhöht die Stärke einiger Wellen-, Aura- und Puls-Attacken."
		desc: "Die Stärke von Wellen-Attacken dieses Pokémon wird mit 1,5 multipliziert. Heilwoge stellt 3/4 der maximalen KP des Ziels wieder her, ab 0,5 abgerundet.", // NEEDS QC
		shortDesc: "Wellen-Attacken mit 1,5-facher Stärke. Heilwoge heilt 3/4 der KP.", // NEEDS QC
	},
	megasol: {
		name: "Mega-Solarladung",
		shortDesc: "Seine Attacken wirken, als wäre Sonne aktiv.", // NEEDS QC
	},
	merciless: {
		name: "Quälerei",
		shortDesc: "Seine Angriffe sind gegen vergiftete Ziele immer Volltreffer.", // NEEDS QC
	},
	mimicry: {
		name: "Mimese",
		// Official flavor text: "Der Typ des Pokémon ändert sich in Abhängigkeit vom Zustand des Feldes."
		desc: "Die Typen dieses Pokémon ändern sich je nach aktivem Feld, wenn es diese Fähigkeit erhält oder ein Feld beginnt: Typ Elektro auf einem Elektrofeld, Typ Pflanze auf einem Grasfeld, Typ Fee auf einem Nebelfeld und Typ Psycho auf einem Psychofeld. Wird diese Fähigkeit ohne aktives Feld erhalten oder endet ein Feld, nimmt dieses Pokémon die ursprünglichen Typen seiner Art an.", // NEEDS QC
		shortDesc: "Seine Typen passen sich dem aktiven Feld an und kehren danach zurück.", // NEEDS QC

		activate: "  {POKEMON} nimmt wieder seinen ursprünglichen Typ an!",
	},
	mindseye: {
		name: "Geistiges Auge",
		desc: "Dieses Pokémon kann Pokémon vom Typ Geist mit Attacken der Typen Normal und Kampf treffen. Hindert andere Pokémon daran, seine Genauigkeit zu senken. Dieses Pokémon ignoriert die Fluchtwert-Stufe des Ziels.", // NEEDS QC
		shortDesc: "Normal und Kampf treffen Geist. Genauigkeit nicht senkbar, ignoriert Fluchtwert.", // NEEDS QC
	},
	minus: {
		name: "Minus",
		// Official flavor text: "Erhöht den Spezial-Angriff, wenn das Pokémon einen Mitstreiter mit der Fähigkeit Plus oder Minus hat."
		desc: "Hat ein Mitstreiter im Kampf diese Fähigkeit oder die Fähigkeit Plus, wird der Spezial-Angriff dieses Pokémon mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Hat ein Mitstreiter diese Fähigkeit oder Plus: Sp.-Ang. x1,5.", // NEEDS QC
		gen4: {
			desc: "Hat ein Mitstreiter im Kampf die Fähigkeit Plus, wird der Spezial-Angriff dieses Pokémon mit 1,5 multipliziert.", // NEEDS QC
			shortDesc: "Hat ein Mitstreiter Plus, wird der Sp.-Ang. mit 1,5 multipliziert.", // NEEDS QC
		},
		gen3: {
			desc: "Hat ein Pokémon im Kampf die Fähigkeit Plus, wird der Spezial-Angriff dieses Pokémon mit 1,5 multipliziert.", // NEEDS QC
			shortDesc: "Hat ein aktives Pokémon Plus, wird der Sp.-Ang. mit 1,5 multipliziert.", // NEEDS QC
		},
	},
	mirrorarmor: {
		name: "Spiegelrüstung",
		// Official flavor text: "Lenkt ausschließlich Effekte, welche die Statuswerte des Pokémon senken würden, auf den Angreifer um."
		desc: "Würde ein Statuswert dieses Pokémon durch ein anderes Pokémon gesenkt, sinkt stattdessen dessen Statuswert. Dieser Effekt tritt nicht ein, wenn der Statuswert dieses Pokémon bereits bei -6 liegt. Hat das andere Pokémon einen Delegator, sinken bei keinem der beiden die Werte.", // NEEDS QC
		shortDesc: "Würden seine Werte gesenkt, sinken stattdessen die des Angreifers.", // NEEDS QC
	},
	mistysurge: {
		name: "Nebel-Erzeuger",
		shortDesc: "Beim Einwechseln erzeugt dieses Pokémon ein Nebelfeld.", // NEEDS QC
	},
	moldbreaker: {
		name: "Überbrückung",
		// Official flavor text: "Attacken können ungeachtet der Fähigkeiten des Zieles verwendet werden."
		desc: "Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Schweifrüstung, Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Buntkörper, Kostümspuk, Trockenheit, Bodenschmaus, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Flauschigkeit, Freundeshut, Fellkleid, Goldkörper, Pflanzenpelz, Wachhund, Hitzeschutz, Schwermetall, Scherenmacht, Tiefkühlkopf, Eisflügelstaub, Erleuchtung, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Geistiges Auge, Spiegelrüstung, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Pastellhülle, Punk Rock, Läutersalz, Majestät, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Tera-Panzer, Thermowandel, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Wasserblase, Aquahülle, Knusperkruste, Pulverrauch, Windreiter, Wunderwache und Wunderhaut. Dieser Effekt betrifft alle anderen Pokémon auf dem Feld, unabhängig davon, ob sie Ziel der Attacke dieses Pokémon sind und ob ihre Fähigkeit für dieses Pokémon vorteilhaft ist.", // NEEDS QC
		shortDesc: "Seine Attacken und deren Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		gen8: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Buntkörper, Kostümspuk, Trockenheit, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Flauschigkeit, Freundeshut, Fellkleid, Pflanzenpelz, Hitzeschutz, Schwermetall, Scherenmacht, Tiefkühlkopf, Eisflügelstaub, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Spiegelrüstung, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Pastellhülle, Punk Rock, Majestät, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Wasserblase, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen7: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Dunkelaura, Buntkörper, Kostümspuk, Trockenheit, Feenaura, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Flauschigkeit, Freundeshut, Fellkleid, Pflanzenpelz, Hitzeschutz, Schwermetall, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Majestät, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Wasserblase, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen6: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Dunkelaura, Trockenheit, Feenaura, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Freundeshut, Fellkleid, Pflanzenpelz, Hitzeschutz, Schwermetall, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen5: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Kampfpanzer, Brustbieter, Neutraltorso, Umkehrung, Feuchtigkeit, Trockenheit, Filter, Feuerfänger, Pflanzengabe, Freundeshut, Hitzeschutz, Schwermetall, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Starthilfe, Multischuppe, Dösigkeit, Tempomacher, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen4: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Kampfpanzer, Neutraltorso, Feuchtigkeit, Trockenheit, Filter, Feuerfänger, Pflanzengabe, Hitzeschutz, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Blitzfänger, Flexibilität, Magmapanzer, Notschutz, Starthilfe, Dösigkeit, Tempomacher, Sandschleier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Fußangel, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Aquahülle, Pulverrauch und Wunderwache. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht. Der Angriffsbonus durch die Fähigkeit Pflanzengabe eines Mitstreiters wird nicht ignoriert.", // NEEDS QC
		},

		start: "  {POKEMON} gelingt es, gegnerische Fähigkeiten zu überbrücken!",
	},
	moody: {
		name: "Gefühlswippe",
		// Official flavor text: "Erhöht in jeder Runde aufs Neue einen Statuswert stark und senkt einen anderen."
		desc: "Am Ende jeder Runde steigt ein zufälliger Statuswert dieses Pokémon außer Genauigkeit und Fluchtwert um 2 Stufen, und ein anderer sinkt um eine Stufe.", // NEEDS QC
		shortDesc: "Pro Runde: +2 auf einen zufälligen Wert, -1 auf einen anderen.", // NEEDS QC
		gen7: {
			desc: "Am Ende jeder Runde wird ein zufälliger Statuswert dieses Pokémon um 2 Stufen erhöht und ein anderer um eine Stufe gesenkt.", // NEEDS QC
			shortDesc: "Am Rundenende: zufälliger Statuswert +2, ein anderer -1.", // NEEDS QC
		},
	},
	motordrive: {
		name: "Starthilfe",
		// Official flavor text: "Treffer durch Elektro-Attacken verursachen keinen Schaden, sondern geben dem Pokémon eine Starthilfe und erhöhen so seine Initiative."
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Elektro und seine Initiative steigt um eine Stufe, wenn es von einer Attacke vom Typ Elektro getroffen wird.", // NEEDS QC
		shortDesc: "+1 Initiative bei Treffern durch Elektro-Attacken; immun gegen Elektro.", // NEEDS QC
	},
	moxie: {
		name: "Hochmut",
		// Official flavor text: "Besiegt es ein Pokémon, steigt sein Selbstvertrauen und somit auch sein Angriff."
		desc: "Der Angriff dieses Pokémon steigt um eine Stufe, wenn es ein anderes Pokémon mit einem Angriff kampfunfähig macht.", // NEEDS QC
		shortDesc: "Sein Angriff steigt um eine Stufe, wenn es ein Pokémon besiegt.", // NEEDS QC
	},
	multiscale: {
		name: "Multischuppe",
		shortDesc: "Bei vollen KP wird erlittener Angriffsschaden halbiert.", // NEEDS QC
	},
	multitype: {
		name: "Variabilität",
		shortDesc: "Ist es Arceus, wird sein Typ zu dem seiner getragenen Tafel.", // NEEDS QC
		gen7: {
			shortDesc: "Als Arceus: Typ passt sich der Tafel oder dem Z-Kristall an.", // NEEDS QC
		},
		gen6: {
			shortDesc: "Ist es Arceus, wird sein Typ zu dem seiner getragenen Tafel.", // NEEDS QC
		},
		gen4: {
			desc: "Wenn dieses Pokémon ein Arceus ist, wird sein Typ zu dem seiner getragenen Tafel. Dieses Pokémon kann sein getragenes Item nicht durch den Angriff eines anderen Pokémon verlieren.", // NEEDS QC
		},
	},
	mummy: {
		name: "Mumie",
		// Official flavor text: "Überträgt bei Berührung die Fähigkeit Mumie auf den Angreifer."
		desc: "Pokémon, die dieses Pokémon mit einer Kontaktattacke treffen, erhalten die Fähigkeit Mumie. Betrifft nicht Pokémon mit den Fähigkeiten Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Mumie, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Wandel, Trance-Modus und Superwechsel.", // NEEDS QC
		shortDesc: "Angreifer erhalten bei Kontakt die Fähigkeit Mumie.", // NEEDS QC
		gen8: {
			desc: "Pokémon, die dieses Pokémon berühren, erhalten die Fähigkeit Mumie. Wirkt nicht auf Pokémon mit den Fähigkeiten Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Mumie, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus.", // NEEDS QC
		},
		gen7: {
			desc: "Pokémon, die dieses Pokémon berühren, erhalten die Fähigkeit Mumie. Wirkt nicht auf Pokémon mit den Fähigkeiten Freundschaftsakt, Dauerschlaf, Kostümspuk, Variabilität, Mumie, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus.", // NEEDS QC
		},
		gen6: {
			desc: "Pokémon, die dieses Pokémon berühren, erhalten die Fähigkeit Mumie. Wirkt nicht auf Pokémon mit den Fähigkeiten Variabilität, Mumie oder Taktikwechsel.", // NEEDS QC
		},
		gen5: {
			desc: "Pokémon, die dieses Pokémon berühren, erhalten die Fähigkeit Mumie. Wirkt nicht auf Pokémon mit den Fähigkeiten Variabilität oder Mumie.", // NEEDS QC
		},

		changeAbility: "  {TARGET} hat die Fähigkeit Mumie angenommen!",
	},
	myceliummight: {
		name: "Myzelienkraft",
		desc: "Status-Attacken dieses Pokémon ignorieren bestimmte Fähigkeiten anderer Pokémon und werden unter Pokémon mit Attacken gleicher oder höherer Priorität als Letztes ausgeführt.", // NEEDS QC
		shortDesc: "Seine Status-Attacken kommen in ihrer Priorität zuletzt, ignorieren Fähigkeiten.", // NEEDS QC
	},
	naturalcure: {
		name: "Innere Kraft",
		shortDesc: "Sein Statusproblem wird beim Auswechseln geheilt.", // NEEDS QC

		activate: "  ({POKEMON} wurde durch Innere Kraft geheilt!)", // NEEDS QC
	},
	neuroforce: {
		name: "Zerebralmacht",
		// Official flavor text: "Erhöht die Stärke von sehr effektiven Attacken."
		desc: "Der Schaden von Angriffen dieses Pokémon, die sehr effektiv gegen das Ziel sind, wird mit 1,25 multipliziert.", // NEEDS QC
		shortDesc: "Sehr effektive Angriffe verursachen 1,25-fachen Schaden.", // NEEDS QC
	},
	neutralizinggas: {
		name: "Reaktionsgas",
		// Official flavor text: "Solange ein Pokémon mit der Fähigkeit Reaktionsgas am Kampf beteiligt ist, werden die Fähigkeiten aller anderen Pokémon unterdrückt oder aufgehoben."
		desc: "Solange dieses Pokémon im Kampf ist, haben Fähigkeiten keine Wirkung. Diese Fähigkeit wird vor Fallen und anderen Fähigkeiten aktiv. Betrifft nicht die Fähigkeiten Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Reaktionsgas, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Wandel, Trance-Modus und Superwechsel.", // NEEDS QC
		shortDesc: "Solange dieses Pokémon im Kampf ist, wirken keine Fähigkeiten.", // NEEDS QC
		gen8: {
			desc: "Solange dieses Pokémon im Kampf ist, haben Fähigkeiten keine Wirkung. Diese Fähigkeit wird aktiv, bevor Fallen und andere Fähigkeiten wirken. Wirkt nicht auf die Fähigkeiten Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Tiefkühlkopf, Variabilität, Reaktionsgas, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel oder Trance-Modus.", // NEEDS QC
		},

		start: "  Reaktionsgas hat sich in der Umgebung ausgebreitet!",
		end: "  Das Reaktionsgas hört auf zu wirken!",
	},
	noguard: {
		name: "Schildlos",
		shortDesc: "Attacken von und gegen dieses Pokémon treffen immer.", // NEEDS QC
	},
	normalize: {
		name: "Regulierung",
		// Official flavor text: "Alle Attacken des Pokémon nehmen den Typ Normal an und ihre Stärke erhöht sich ein wenig."
		desc: "Attacken dieses Pokémon werden zu Attacken vom Typ Normal und ihre Stärke wird mit 1,2 multipliziert. Dieser Effekt tritt vor anderen Effekten ein, die den Typ einer Attacke ändern.", // NEEDS QC
		shortDesc: "Seine Attacken werden zu Normal-Attacken mit 1,2-facher Stärke.", // NEEDS QC
		gen6: {
			desc: "Die Attacken dieses Pokémon werden zu Attacken vom Typ Normal. Dieser Effekt tritt vor anderen Effekten ein, die den Typ einer Attacke ändern.", // NEEDS QC
			shortDesc: "Die Attacken dieses Pokémon werden zum Typ Normal.", // NEEDS QC
		},
		gen4: {
			desc: "Die Attacken dieses Pokémon werden zu Attacken vom Typ Normal. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, außer bei Verzweifler.", // NEEDS QC
		},
	},
	oblivious: {
		name: "Dösigkeit",
		// Official flavor text: "Das Pokémon ist so apathisch, dass es nicht betört oder provoziert werden kann."
		desc: "Dieses Pokémon kann sich weder verlieben noch provoziert werden. Erhält es diese Fähigkeit verliebt oder provoziert, wird es davon geheilt. Es ist immun gegen den Effekt der Fähigkeit Bedroher.", // NEEDS QC
		shortDesc: "Kann sich nicht verlieben, nicht provoziert werden. Immun gegen Bedroher.", // NEEDS QC
		gen7: {
			desc: "Dieses Pokémon kann weder verliebt noch von Verhöhner betroffen werden. Erhält es diese Fähigkeit, während es verliebt oder von Verhöhner betroffen ist, wird das geheilt.", // NEEDS QC
			shortDesc: "Kann weder verliebt noch von Verhöhner betroffen werden.", // NEEDS QC
		},
		gen5: {
			desc: "Dieses Pokémon kann nicht verliebt werden. Erhält es diese Fähigkeit, während es verliebt ist, wird das geheilt.", // NEEDS QC
			shortDesc: "Kann nicht verliebt werden. Erhalt der Fähigkeit heilt Verliebtheit.", // NEEDS QC
		},
	},
	opportunist: {
		name: "Profiteur",
		shortDesc: "Erhöht ein Gegner einen Statuswert, kopiert es die Erhöhung.", // NEEDS QC
	},
	orichalcumpulse: {
		name: "Orichalkum-Puls",
		shortDesc: "Erzeugt beim Einwechseln Sonne; bei Sonne Angriff x1,3333.", // NEEDS QC

		start: "  {POKEMON} verstärkt das Sonnenlicht und entfesselt dadurch einen urzeitlichen Puls!",
		activate: "  {POKEMON} badet im Sonnenlicht und entfesselt dadurch einen urzeitlichen Puls!",
	},
	overcoat: {
		name: "Partikelschutz",
		// Official flavor text: "Nimmt weder durch Wetterlagen wie Sandsturm oder Hagel noch durch Pulver oder Puder Schaden."
		desc: "Dieses Pokémon ist immun gegen Pulver-Attacken, Schaden durch Sandsturm sowie die Effekte von Wutpulver und der Fähigkeit Sporenwirt.", // NEEDS QC
		shortDesc: "Immun gegen Pulver-Attacken, Sandsturm und Sporenwirt.", // NEEDS QC
		gen8: {
			desc: "Dieses Pokémon ist immun gegen Pulver-Attacken, Schaden durch Sandsturm oder Hagelsturm sowie die Effekte von Wutpulver und der Fähigkeit Sporenwirt.", // NEEDS QC
			shortDesc: "Immun gegen Pulver-Attacken, Sandsturm-/Hagelschaden und Sporenwirt.", // NEEDS QC
		},
		gen5: {
			desc: "Dieses Pokémon ist immun gegen Schaden durch Sandsturm oder Hagelsturm.", // NEEDS QC
			shortDesc: "Immun gegen Schaden durch Sandsturm oder Hagel.", // NEEDS QC
		},
	},
	overgrow: {
		name: "Notdünger",
		// Official flavor text: "Erhöht die Stärke von Pflanzen-Attacken, wenn die KP auf einen gewissen Wert fallen."
		desc: "Hat dieses Pokémon 1/3 oder weniger seiner maximalen KP, abgerundet, wird sein Offensivwert beim Einsatz einer Attacke vom Typ Pflanze mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Bei 1/3 der max. KP oder weniger: Pflanzen-Angriffe mit 1,5-facher Offensive.", // NEEDS QC
		gen4: {
			desc: "Hat dieses Pokémon 1/3 oder weniger seiner maximalen KP, abgerundet, wird die Stärke seiner Attacken vom Typ Pflanze mit 1,5 multipliziert.", // NEEDS QC
			shortDesc: "Bei 1/3 oder weniger der max. KP: 1,5x Stärke für Pflanzen-Attacken.", // NEEDS QC
		},
	},
	owntempo: {
		name: "Tempomacher",
		// Official flavor text: "Das Pokémon lässt sich nicht aus der Ruhe bringen und verhindert so Verwirrung."
		desc: "Dieses Pokémon kann nicht verwirrt werden. Erhält es diese Fähigkeit verwirrt, wird es davon geheilt. Es ist immun gegen den Effekt der Fähigkeit Bedroher.", // NEEDS QC
		shortDesc: "Kann nicht verwirrt werden. Immun gegen Bedroher.", // NEEDS QC
		gen7: {
			desc: "Dieses Pokémon kann nicht verwirrt werden. Erhält es diese Fähigkeit, während es verwirrt ist, wird das geheilt.", // NEEDS QC
			shortDesc: "Dieses Pokémon kann nicht verwirrt werden.", // NEEDS QC
		},
	},
	parentalbond: {
		name: "Familienbande",
		// Official flavor text: "Zwei Generationen setzen jeweils ein Mal zum Angriff an."
		desc: "Offensive Attacken dieses Pokémon treffen zweimal. Der Schaden des zweiten Treffers wird geviertelt. Betrifft nicht Kismetwunsch, Drachenpfeile, Dynamax-Kanone, Notsituation, Explosion, Wagemut, Schleuder, Seher, Frostbeule, Walzer und Finale, mehrfach treffende Attacken, Attacken mit mehreren Zielen oder Attacken, die in zwei Runden ausgeführt werden.", // NEEDS QC
		shortDesc: "Seine Angriffe treffen zweimal; der zweite Treffer mit 1/4 des Schadens.", // NEEDS QC
		gen8: {
			desc: "Die schädigenden Attacken dieses Pokémon treffen zweimal. Der Schaden des zweiten Treffers wird geviertelt. Wirkt nicht auf Kismetwunsch, Drachenpfeile, Dynamax-Kanone, Notsituation, Explosion, Wagemut, Schleuder, Seher, Frostbeule, Walzer und Finale, mehrfach treffende Attacken, Attacken mit mehreren Zielen, Zwei-Runden-Attacken oder Dynamax-Attacken.", // NEEDS QC
		},
		gen7: {
			desc: "Die schädigenden Attacken dieses Pokémon treffen zweimal. Der Schaden des zweiten Treffers wird geviertelt. Wirkt nicht auf Kismetwunsch, Notsituation, Explosion, Wagemut, Schleuder, Seher, Frostbeule, Walzer und Finale, mehrfach treffende Attacken, Attacken mit mehreren Zielen, Zwei-Runden-Attacken oder Z-Attacken.", // NEEDS QC
		},
		gen6: {
			desc: "Die schädigenden Attacken dieses Pokémon treffen zweimal. Der Schaden des zweiten Treffers wird halbiert. Wirkt nicht auf Kismetwunsch, Notsituation, Explosion, Wagemut, Schleuder, Seher, Frostbeule, Walzer und Finale, mehrfach treffende Attacken, Attacken mit mehreren Zielen, Zwei-Runden-Attacken.", // NEEDS QC
			shortDesc: "Schädigende Attacken treffen zweimal. Zweiter Treffer: halber Schaden.", // NEEDS QC
		},
	},
	pastelveil: {
		name: "Pastellhülle",
		// Official flavor text: "Schützt das Pokémon und seine Mitstreiter vor Vergiftung."
		desc: "Dieses Pokémon und seine Mitstreiter können nicht vergiftet werden. Erhält es diese Fähigkeit, während es oder sein Mitstreiter vergiftet ist, werden sie geheilt. Wird diese Fähigkeit während eines vergiftenden Effekts ignoriert, wird dieses Pokémon sofort geheilt, sein Mitstreiter jedoch nicht.", // NEEDS QC
		shortDesc: "Es und Mitstreiter können nicht vergiftet werden. Heilt sie beim Einwechseln.", // NEEDS QC
	},
	perishbody: {
		name: "Unheilskörper",
		// Official flavor text: "Erleidet es einen Treffer von einer direkten Attacke, wird es zusammen mit dem Angreifer nach drei Runden besiegt. Rettung ist durch Austausch möglich."
		desc: "Wird dieses Pokémon mit einer Kontaktattacke getroffen, beginnt der Effekt von Abgesang für es und den Angreifer. Dieser Effekt tritt für dieses Pokémon nicht ein, wenn der Angreifer bereits einen Countdown hat.", // NEEDS QC
		shortDesc: "Kontakt löst Abgesang für es und den Angreifer aus.", // NEEDS QC

		start: "  Beide Pokémon gehen nach drei Runden K.O.!",
	},
	pickpocket: {
		name: "Langfinger",
		// Official flavor text: "Stiehlt das Item des Angreifers bei Berührung."
		desc: "Hat dieses Pokémon kein Item und wird von einer Kontaktattacke getroffen, stiehlt es das Item des Angreifers. Dieser Effekt tritt nach allen Treffern einer mehrfach treffenden Attacke ein. Er wird verhindert, wenn der Sekundäreffekt der Attacke durch die Fähigkeit Rohe Gewalt entfernt wurde.", // NEEDS QC
		shortDesc: "Ohne Item stiehlt es bei erlittenem Kontakt das Item des Angreifers.", // NEEDS QC
	},
	pickup: {
		name: "Mitnahme",
		// Official flavor text: "Hebt gelegentlich von Gegnern benutzte Items auf. Dies geschieht nicht nur während Kämpfen, sondern auch unterwegs."
		desc: "Hat dieses Pokémon am Ende einer Runde kein Item und hat mindestens ein benachbartes Pokémon in dieser Runde ein Item verwendet, wird eines dieser Pokémon zufällig gewählt und dieses Pokémon erhält dessen zuletzt verwendetes Item. Ein Item gilt nicht als zuletzt verwendet, wenn es ein geplatzter Luftballon war, von einem anderen Pokémon mit dieser Fähigkeit aufgesammelt wurde oder durch Käferbiss, Korrosionsgas, Bezirzer, Einäschern, Abschlag, Pflücker oder Raub verloren ging. Mit Schleuder geworfene Items können aufgesammelt werden.", // NEEDS QC
		shortDesc: "Ohne Item sammelt es das in dieser Runde benutzte Item eines Nachbarn auf.", // NEEDS QC
		gen7: {
			desc: "Trägt dieses Pokémon am Ende einer Runde kein Item und hat mindestens ein benachbartes Pokémon in dieser Runde ein Item verwendet, wird eines davon zufällig gewählt und dieses Pokémon erhält dessen zuletzt verwendetes Item. Ein Item gilt nicht als zuletzt verwendet, wenn es ein geplatzter Luftballon war, von einem anderen Pokémon mit dieser Fähigkeit aufgesammelt wurde oder durch Käferbiss, Bezirzer, Einäschern, Abschlag, Pflücker oder Raub verloren ging. Mit Schleuder geworfene Items können aufgesammelt werden.", // NEEDS QC
		},
		gen4: {
			desc: "Kein Nutzen im Kampf.", // NEEDS QC
			shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC
		},

		addItem: "#recycle",
	},
	piercingdrill: {
		name: "Stichbohrer",
		shortDesc: "Seine Kontaktattacken ignorieren Schutz und verursachen 1/4 des Schadens.", // NEEDS QC
	},
	pixilate: {
		name: "Feenschicht",
		// Official flavor text: "Attacken vom Typ Normal nehmen den Typ Fee an und ihre Stärke erhöht sich ein wenig."
		desc: "Attacken dieses Pokémon vom Typ Normal werden zu Attacken vom Typ Fee und ihre Stärke wird mit 1,2 multipliziert. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, aber vor den Effekten von Plasmaschauer und Elektrifizierung.", // NEEDS QC
		shortDesc: "Seine Normal-Attacken werden zu Fee-Attacken mit 1,2-facher Stärke.", // NEEDS QC
		gen6: {
			desc: "Attacken dieses Pokémon vom Typ Normal werden zu Attacken vom Typ Fee und ihre Stärke wird mit 1,3 multipliziert. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, aber vor den Effekten von Plasmaschauer und Elektrifizierung.", // NEEDS QC
			shortDesc: "Normal-Attacken dieses Pokémon werden zum Typ Fee mit 1,3x Stärke.", // NEEDS QC
		},
	},
	plus: {
		name: "Plus",
		// Official flavor text: "Erhöht den Spezial-Angriff, wenn das Pokémon einen Mitstreiter mit der Fähigkeit Plus oder Minus hat."
		desc: "Hat ein Mitstreiter im Kampf diese Fähigkeit oder die Fähigkeit Minus, wird der Spezial-Angriff dieses Pokémon mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Hat ein Mitstreiter diese Fähigkeit oder Minus: Sp.-Ang. x1,5.", // NEEDS QC
		gen4: {
			desc: "Hat ein Mitstreiter im Kampf die Fähigkeit Minus, wird der Spezial-Angriff dieses Pokémon mit 1,5 multipliziert.", // NEEDS QC
			shortDesc: "Hat ein Mitstreiter Minus, wird der Sp.-Ang. mit 1,5 multipliziert.", // NEEDS QC
		},
		gen3: {
			desc: "Hat ein Pokémon im Kampf die Fähigkeit Minus, wird der Spezial-Angriff dieses Pokémon mit 1,5 multipliziert.", // NEEDS QC
			shortDesc: "Hat ein aktives Pokémon Minus, wird der Sp.-Ang. mit 1,5 multipliziert.", // NEEDS QC
		},
	},
	poisonheal: {
		name: "Aufheber",
		// Official flavor text: "Das Pokémon erleidet keinen Schaden durch Vergiftung, sondern regeneriert KP."
		desc: "Ist dieses Pokémon vergiftet, stellt es am Ende jeder Runde 1/8 seiner maximalen KP wieder her, abgerundet, statt KP zu verlieren.", // NEEDS QC
		shortDesc: "Ist es vergiftet, heilt es pro Runde 1/8 der max. KP statt Schaden.", // NEEDS QC
	},
	poisonpoint: {
		name: "Giftdorn",
		shortDesc: "30 % Chance, Angreifer bei Kontakt zu vergiften.", // NEEDS QC
		gen4: {
			desc: "30 % Chance, dass ein Pokémon, das dieses Pokémon berührt, vergiftet wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
		},
		gen3: {
			desc: "1/3 Chance, dass ein Pokémon, das dieses Pokémon berührt, vergiftet wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
			shortDesc: "1/3 Chance, dass Pokémon bei Kontakt vergiftet werden.", // NEEDS QC
		},
	},
	poisonpuppeteer: {
		name: "Giftpuppenspiel",
		desc: "Wenn dieses Pokémon ein Infamomo ist und ein Ziel vergiftet oder schwer vergiftet, wird dieses zusätzlich verwirrt.", // NEEDS QC
		shortDesc: "Infamomo: Vergiftet es ein Ziel, wird dieses auch verwirrt.", // NEEDS QC
	},
	poisontouch: {
		name: "Giftgriff",
		// Official flavor text: "Kann das Ziel durch bloßes Berühren vergiften."
		desc: "Kontaktattacken dieses Pokémon haben eine Chance von 30 %, zu vergiften. Dieser Effekt tritt nach der attackeneigenen Sekundäreffekt-Chance ein.", // NEEDS QC
		shortDesc: "Seine Kontaktattacken haben 30 % Chance, zu vergiften.", // NEEDS QC
	},
	powerconstruct: {
		name: "Scharwandel",
		// Official flavor text: "Fallen seine KP auf die Hälfte des Maximalwerts oder weniger, eilen ihm weitere Zellen zu Hilfe und es nimmt die Optimumform an."
		desc: "Wenn dieses Pokémon ein Zygarde in der 10-%- oder 50-%-Form ist, nimmt es die Optimum-Form an, wenn es am Ende der Runde die Hälfte oder weniger seiner maximalen KP hat.", // NEEDS QC
		shortDesc: "Zygarde 10 %/50 % nimmt bei halben KP oder weniger die Optimum-Form an.", // NEEDS QC

		activate: "  Du spürst die Präsenz vieler Zellen...!",
		transform: "{POKEMON} hat die Optimumform angenommen!",
	},
	powerofalchemy: {
		name: "Chemiekraft",
		// Official flavor text: "Wechselt seine Fähigkeit zu der eines kampfunfähig gewordenen Mitstreiters."
		desc: "Dieses Pokémon kopiert die Fähigkeit eines kampfunfähig gewordenen Mitstreiters. Nicht kopiert werden können Reitgespann, Freundschaftsakt, Dauerschlaf, Kommandant, Kostümspuk, Erinnerungskraft, Pflanzengabe, Prognose, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Giftpuppenspiel, Scharwandel, Chemiekraft, Paläosynthese, Quantenantrieb, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Panzer, Tera-Wandel, Teraforming Null, Erfassen, Wunderwache, Trance-Modus und Superwechsel.", // NEEDS QC
		shortDesc: "Kopiert die Fähigkeit eines besiegten Mitstreiters.", // NEEDS QC
		gen8: {
			desc: "Dieses Pokémon kopiert die Fähigkeit eines kampfunfähig gewordenen Mitstreiters. Nicht kopiert werden können Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Würggeschoss, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen, Wunderwache und Trance-Modus.", // NEEDS QC
		},
		gen7: {
			desc: "Dieses Pokémon kopiert die Fähigkeit eines kampfunfähig gewordenen Mitstreiters. Nicht kopiert werden können Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen, Wunderwache und Trance-Modus.", // NEEDS QC
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "Kraftquelle",
		// Official flavor text: "Erhöht bei direkt benachbarten Pokémon die Stärke von Attacken."
		desc: "Die Stärke der Attacken der Mitstreiter dieses Pokémon wird mit 1,3 multipliziert. Betrifft Kismetwunsch und Seher, selbst wenn der Anwender nicht mehr auf dem Feld ist.", // NEEDS QC
		shortDesc: "Die Attacken seiner Mitstreiter haben 1,3-fache Stärke.", // NEEDS QC
	},
	prankster: {
		name: "Strolch",
		// Official flavor text: "Ermöglicht einen Erstschlag mit Status-Attacken."
		desc: "Nicht schädigende Attacken dieses Pokémon haben eine um 1 erhöhte Priorität. Gegner vom Typ Unlicht sind gegen diese Attacken immun, ebenso gegen alle von ihnen aufgerufenen Attacken, sofern der letztliche Anwender diese Fähigkeit hat.", // NEEDS QC
		shortDesc: "Status-Attacken mit Priorität +1; Unlicht-Pokémon sind immun.", // NEEDS QC
		gen6: {
			desc: "Die nicht schädigenden Attacken dieses Pokémon erhalten +1 Priorität.", // NEEDS QC
			shortDesc: "Nicht schädigende Attacken dieses Pokémon erhalten +1 Priorität.", // NEEDS QC
		},
	},
	pressure: {
		name: "Erzwinger",
		// Official flavor text: "Zwingt Gegner dazu, beim Einsatz von Attacken mehr AP zu verbrauchen."
		desc: "Ist dieses Pokémon das Ziel einer gegnerischen Attacke, verliert diese einen zusätzlichen AP. Auch Begrenzer, Übernahme und Tera-Ausbruch verlieren einen zusätzlichen AP, wenn ein Gegner sie einsetzt, Klebenetz jedoch nicht.", // NEEDS QC
		shortDesc: "Gegnerische Attacken auf dieses Pokémon verlieren einen zusätzlichen AP.", // NEEDS QC
		gen8: {
			desc: "Ist dieses Pokémon das Ziel einer gegnerischen Attacke, verliert diese einen zusätzlichen AP. Auch Begrenzer und Übernahme verlieren einen zusätzlichen AP, wenn ein Gegner sie einsetzt, Klebenetz jedoch nicht.", // NEEDS QC
		},
		gen5: {
			desc: "Ist dieses Pokémon das Ziel einer gegnerischen Attacke, verliert diese einen zusätzlichen AP. Auch Begrenzer und Übernahme verlieren einen zusätzlichen AP, wenn ein Gegner sie einsetzt.", // NEEDS QC
		},
		gen4: {
			desc: "Ist dieses Pokémon das Ziel der Attacke eines anderen Pokémon, verliert diese einen zusätzlichen AP.", // NEEDS QC
			shortDesc: "Attacken, die dieses Pokémon zum Ziel haben, verlieren einen zusätzlichen AP.", // NEEDS QC
		},

		start: "  {POKEMON} setzt Gegner mit Erzwinger unter Druck!",
	},
	primordialsea: {
		name: "Urmeer",
		// Official flavor text: "Ändert das Wetter, um Feuer-Attacken wirkungslos zu machen."
		desc: "Beim Einwechseln wird das Wetter zu Strömendem Regen, das alle Effekte von Regen umfasst und die Ausführung offensiver Attacken vom Typ Feuer verhindert. Dieses Wetter hält an, bis diese Fähigkeit für kein Pokémon mehr aktiv ist oder das Wetter durch die Fähigkeiten Delta-Wind oder Endland geändert wird.", // NEEDS QC
		shortDesc: "Beim Einwechseln fällt starker Regen, solange diese Fähigkeit aktiv ist.", // NEEDS QC
	},
	prismarmor: {
		name: "Prismarüstung",
		shortDesc: "Erleidet 3/4 des Schadens durch sehr effektive Angriffe.", // NEEDS QC
	},
	propellertail: {
		name: "Schraubflosse",
		shortDesc: "Seine Attacken können nicht umgelenkt werden.", // NEEDS QC
	},
	protean: {
		name: "Wandlungskunst",
		// Official flavor text: "Das Pokémon nimmt bei Einsatz einer Attacke deren Typ an."
		desc: "Der Typ dieses Pokémon wird zu dem der Attacke, die es gleich einsetzt. Dieser Effekt tritt nach allen Effekten ein, die den Typ einer Attacke ändern. Er kann nur einmal pro Einwechseln eintreten und nur, wenn dieses Pokémon nicht terakristallisiert ist.", // NEEDS QC
		shortDesc: "Sein Typ wird zu dem seiner Attacke. Einmal pro Einwechseln.", // NEEDS QC
		gen8: {
			desc: "Der Typ dieses Pokémon ändert sich zum Typ der Attacke, die es einsetzen will. Dieser Effekt tritt nach allen Effekten ein, die den Typ einer Attacke ändern.", // NEEDS QC
			shortDesc: "Der Typ dieses Pokémon wird zum Typ der Attacke, die es einsetzen will.", // NEEDS QC
		},
	},
	protosynthesis: {
		name: "Paläosynthese",
		desc: "Wenn Sonne aktiv ist oder dieses Pokémon eine getragene Energiekapsel einsetzt, wird sein höchster Statuswert mit 1,3 multipliziert, oder mit 1,5, wenn es die Initiative ist. Statusveränderungen werden zum Zeitpunkt der Aktivierung berücksichtigt. Bei Gleichstand gilt die Reihenfolge: Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung, Initiative. Wurde der Effekt durch das Sonnenlicht ausgelöst, wird eine getragene Energiekapsel nicht aktiviert und der Effekt endet, wenn das Sonnenlicht nicht mehr aktiv ist. Wurde der Effekt durch eine getragene Energiekapsel ausgelöst, endet er, wenn dieses Pokémon das Feld verlässt.", // NEEDS QC
		shortDesc: "Bei Sonne oder mit Energiekapsel: höchster Wert x1,3 (x1,5 bei Init.).", // NEEDS QC

		activate: "  {POKEMON} leitet dank des Sonnenscheins die Paläosynthese ein!",
		activateFromItem: "  {POKEMON} nutzt das Item Energiekapsel, um die Paläosynthese einzuleiten.",
		start: "  {STAT} von {POKEMON} wird verstärkt!",
		end: "  Der Effekt der Paläosynthese von {POKEMON} lässt nach!",
	},
	psychicsurge: {
		name: "Psycho-Erzeuger",
		shortDesc: "Beim Einwechseln erzeugt dieses Pokémon ein Psychofeld.", // NEEDS QC
	},
	punkrock: {
		name: "Punk Rock",
		// Official flavor text: "Erhöht die Stärke von eigenen Lärm-Attacken und halbiert den Schaden, den das Pokémon selbst durch Lärm-Attacken erleidet."
		desc: "Die Stärke geräuschbasierter Attacken dieses Pokémon wird mit 1,3 multipliziert. Dieses Pokémon erleidet nur halben Schaden durch geräuschbasierte Attacken.", // NEEDS QC
		shortDesc: "Halber Schaden durch Geräusch-Attacken; eigene mit 1,3-facher Stärke.", // NEEDS QC
	},
	purepower: {
		name: "Mentalkraft",
		shortDesc: "Der Angriff dieses Pokémon wird verdoppelt.", // NEEDS QC
	},
	purifyingsalt: {
		name: "Läutersalz",
		desc: "Dieses Pokémon kann weder von Statusproblemen noch von Gähner betroffen werden. Setzt ein Pokémon einen Angriff vom Typ Geist gegen dieses Pokémon ein, wird sein Offensivwert bei der Schadensberechnung halbiert.", // NEEDS QC
		shortDesc: "Geist-Angriffe treffen mit halbierter Offensive; keine Statusprobleme.", // NEEDS QC
	},
	quarkdrive: {
		name: "Quantenantrieb",
		desc: "Wenn Elektrofeld aktiv ist oder dieses Pokémon eine getragene Energiekapsel einsetzt, wird sein höchster Statuswert mit 1,3 multipliziert, oder mit 1,5, wenn es die Initiative ist. Statusveränderungen werden zum Zeitpunkt der Aktivierung berücksichtigt. Bei Gleichstand gilt die Reihenfolge: Angriff, Verteidigung, Spezial-Angriff, Spezial-Verteidigung, Initiative. Wurde der Effekt durch das Elektrofeld ausgelöst, wird eine getragene Energiekapsel nicht aktiviert und der Effekt endet, wenn das Elektrofeld nicht mehr aktiv ist. Wurde der Effekt durch eine getragene Energiekapsel ausgelöst, endet er, wenn dieses Pokémon das Feld verlässt.", // NEEDS QC
		shortDesc: "Bei Elektrofeld oder mit Energiekapsel: höchster Wert x1,3 (x1,5 bei Init.).", // NEEDS QC

		activate: "  {POKEMON} aktiviert dank des Elektrofelds den Quantenantrieb!",
		activateFromItem: "  {POKEMON} nutzt das Item Energiekapsel, um den Quantenantrieb zu aktivieren.",
		start: "  {STAT} von {POKEMON} wird verstärkt!",
		end: "  Der Effekt des Quantenantriebs von {POKEMON} lässt nach!",
	},
	queenlymajesty: {
		name: "Majestät",
		// Official flavor text: "Schüchtert Gegner ein und hindert sie so daran, Erstschlag-Attacken gegen es einzusetzen."
		desc: "Attacken mit erhöhter Priorität, die Gegner gegen dieses Pokémon oder seine Mitstreiter einsetzen, schlagen fehl.", // NEEDS QC
		shortDesc: "Schützt dieses Pokémon und Mitstreiter vor gegnerischen Prioritätsattacken.", // NEEDS QC

		block: "#damp",
	},
	quickdraw: {
		name: "Schnellschuss",
		shortDesc: "30 % Chance, mit Angriffen in seiner Priorität zuerst zu handeln.", // NEEDS QC

		activate: "  Durch Schnellschuss kann {POKEMON} schneller handeln als sonst!",
	},
	quickfeet: {
		name: "Rasanz",
		// Official flavor text: "Erhöht bei Statusproblemen die Initiative."
		desc: "Hat dieses Pokémon ein Statusproblem, wird seine Initiative mit 1,5 multipliziert. Dieses Pokémon ignoriert die Initiative-Halbierung durch Paralyse.", // NEEDS QC
		shortDesc: "Mit Statusproblem: Initiative x1,5; ignoriert die Paralyse-Halbierung.", // NEEDS QC
		gen6: {
			desc: "Hat dieses Pokémon ein Statusproblem, wird seine Initiative mit 1,5 multipliziert. Dieses Pokémon ignoriert die Initiative-Senkung durch Paralyse.", // NEEDS QC
		},
	},
	raindish: {
		name: "Regengenuss",
		// Official flavor text: "Regeneriert bei Regen nach und nach KP."
		desc: "Wenn Regen aktiv ist, stellt dieses Pokémon am Ende jeder Runde 1/16 seiner maximalen KP wieder her, abgerundet. Dieser Effekt wird verhindert, wenn dieses Pokémon einen Allzweckschirm trägt.", // NEEDS QC
		shortDesc: "Ist Regen aktiv, heilt es pro Runde 1/16 der max. KP.", // NEEDS QC
		gen7: {
			desc: "Ist Regen aktiv, stellt dieses Pokémon am Ende jeder Runde 1/16 seiner maximalen KP wieder her, abgerundet.", // NEEDS QC
		},
	},
	rattled: {
		name: "Hasenfuß",
		// Official flavor text: "Wird es von einer Unlicht-, Geister- oder Käfer-Attacke getroffen, bekommt es Angst und seine Initiative steigt."
		desc: "Die Initiative dieses Pokémon steigt um eine Stufe, wenn es von einem Angriff der Typen Käfer, Unlicht oder Geist getroffen wird oder ein Gegner es mit der Fähigkeit Bedroher trifft.", // NEEDS QC
		shortDesc: "+1 Initiative bei Käfer-, Unlicht- oder Geist-Treffern oder Bedroher.", // NEEDS QC
		gen7: {
			desc: "Die Initiative dieses Pokémon steigt um eine Stufe, wenn es von einem Angriff vom Typ Käfer, Unlicht oder Geist getroffen wird.", // NEEDS QC
			shortDesc: "+1 Initiative, wenn es von Käfer-, Unlicht- oder Geist-Attacken getroffen wird.", // NEEDS QC
		},
	},
	receiver: {
		name: "Receiver",
		// Official flavor text: "Wird einer seiner Mitstreiter besiegt, erhält es dessen Fähigkeit."
		desc: "Dieses Pokémon kopiert die Fähigkeit eines kampfunfähig gewordenen Mitstreiters. Nicht kopiert werden können Reitgespann, Freundschaftsakt, Dauerschlaf, Kommandant, Kostümspuk, Erinnerungskraft, Pflanzengabe, Prognose, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Giftpuppenspiel, Scharwandel, Chemiekraft, Paläosynthese, Quantenantrieb, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Panzer, Tera-Wandel, Teraforming Null, Erfassen, Wunderwache, Trance-Modus und Superwechsel.", // NEEDS QC
		shortDesc: "Kopiert die Fähigkeit eines besiegten Mitstreiters.", // NEEDS QC
		gen8: {
			desc: "Dieses Pokémon kopiert die Fähigkeit eines kampfunfähig gewordenen Mitstreiters. Nicht kopiert werden können Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Würggeschoss, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen, Wunderwache und Trance-Modus.", // NEEDS QC
		},
		gen7: {
			desc: "Dieses Pokémon kopiert die Fähigkeit eines kampfunfähig gewordenen Mitstreiters. Nicht kopiert werden können Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen, Wunderwache und Trance-Modus.", // NEEDS QC
		},

		changeAbility: "  Die Fähigkeit {ABILITY} von {SOURCE} wurde übernommen!",
	},
	reckless: {
		name: "Achtlos",
		// Official flavor text: "Erhöht die Stärke von Attacken mit Rückstoßschaden."
		desc: "Die Stärke von Angriffen dieses Pokémon mit Rückstoß- oder Fehlschlagschaden wird mit 1,2 multipliziert. Betrifft nicht Verzweifler.", // NEEDS QC
		shortDesc: "Angriffe mit Rückstoß oder Fehlschlagschaden: 1,2-fach; nicht Verzweifler.", // NEEDS QC
	},
	refrigerate: {
		name: "Frostschicht",
		// Official flavor text: "Attacken vom Typ Normal nehmen den Typ Eis an und ihre Stärke erhöht sich ein wenig."
		desc: "Attacken dieses Pokémon vom Typ Normal werden zu Attacken vom Typ Eis und ihre Stärke wird mit 1,2 multipliziert. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, aber vor den Effekten von Plasmaschauer und Elektrifizierung.", // NEEDS QC
		shortDesc: "Seine Normal-Attacken werden zu Eis-Attacken mit 1,2-facher Stärke.", // NEEDS QC
		gen6: {
			desc: "Attacken dieses Pokémon vom Typ Normal werden zu Attacken vom Typ Eis und ihre Stärke wird mit 1,3 multipliziert. Dieser Effekt tritt nach anderen Effekten ein, die den Typ einer Attacke ändern, aber vor den Effekten von Plasmaschauer und Elektrifizierung.", // NEEDS QC
			shortDesc: "Normal-Attacken dieses Pokémon werden zum Typ Eis mit 1,3x Stärke.", // NEEDS QC
		},
	},
	regenerator: {
		name: "Belebekraft",
		shortDesc: "Stellt beim Auswechseln 1/3 seiner max. KP wieder her.", // NEEDS QC
	},
	ripen: {
		name: "Heranreifen",
		// Official flavor text: "Verdoppelt den Effekt von Beeren, indem es sie heranreifen lässt."
		desc: "Isst dieses Pokémon bestimmte Beeren, werden ihre Effekte verdoppelt. Beeren, die KP oder AP wiederherstellen, stellen das Doppelte wieder her, Beeren, die Statuswerte erhöhen, erhöhen sie doppelt, Beeren, die erlittenen Schaden halbieren, vierteln ihn stattdessen, und eine Jabocabeere oder Roselbeere lässt den Angreifer 1/4 seiner maximalen KP verlieren, abgerundet.", // NEEDS QC
		shortDesc: "Isst es bestimmte Beeren, verdoppeln sich deren Effekte.", // NEEDS QC
	},
	rivalry: {
		name: "Rivalität",
		// Official flavor text: "Greift es einen Rivalen desselben Geschlechts an, wird es stärker. Greift es ein Ziel des anderen Geschlechts an, wird es schwächer."
		desc: "Die Stärke von Angriffen dieses Pokémon wird gegen Ziele gleichen Geschlechts mit 1,25 und gegen Ziele des anderen Geschlechts mit 0,75 multipliziert. Es gibt keinen Modifikator, wenn dieses Pokémon oder das Ziel geschlechtslos ist.", // NEEDS QC
		shortDesc: "Angriffe: 1,25-fach gegen gleiches, 0,75-fach gegen anderes Geschlecht.", // NEEDS QC
	},
	rkssystem: {
		name: "Alpha-System",
		shortDesc: "Ist es Amigento, wird sein Typ zu dem seiner getragenen Disc.", // NEEDS QC
	},
	rockhead: {
		name: "Steinhaupt",
		// Official flavor text: "Verhindert Schaden, der durch Rückstoß entstehen würde."
		desc: "Dieses Pokémon erleidet keinen Rückstoßschaden, außer durch Verzweifler. Betrifft weder den Schaden des Leben-Orb noch Fehlschlagschaden.", // NEEDS QC
		shortDesc: "Kein Rückstoßschaden, außer durch Verzweifler, Leben-Orb und Fehlschläge.", // NEEDS QC
		gen3: {
			desc: "Dieses Pokémon erleidet keinen Rückstoßschaden, außer durch Verzweifler. Wirkt nicht auf Schaden durch Verfehlen.", // NEEDS QC
			shortDesc: "Kein Rückstoßschaden außer durch Verzweifler und Schaden durch Verfehlen.", // NEEDS QC
		},
	},
	rockypayload: {
		name: "Steinträger",
		shortDesc: "Gesteins-Angriffe mit 1,5-facher Offensive.", // NEEDS QC
	},
	roughskin: {
		name: "Rauhaut",
		// Official flavor text: "Angreifer werden durch die raue Haut des Pokémon bei direkten Attacken verletzt."
		desc: "Pokémon, die dieses Pokémon mit einer Kontaktattacke treffen, verlieren 1/8 ihrer maximalen KP, abgerundet.", // NEEDS QC
		shortDesc: "Angreifer verlieren bei Kontakt 1/8 ihrer max. KP.", // NEEDS QC
		gen4: {
			desc: "Pokémon, die dieses Pokémon berühren, verlieren 1/8 ihrer maximalen KP, abgerundet. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
		},
		gen3: {
			desc: "Pokémon, die dieses Pokémon berühren, verlieren 1/16 ihrer maximalen KP, abgerundet. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
			shortDesc: "Pokémon verlieren bei Kontakt 1/16 ihrer maximalen KP.", // NEEDS QC
		},

		damage: "  {POKEMON} wurde Schaden zugefügt!",
	},
	runaway: {
		name: "Angsthase",
		shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC
	},
	sandforce: {
		name: "Sandgewalt",
		// Official flavor text: "Erhöht in Sandstürmen die Stärke von Gesteins-, Boden- und Stahl-Attacken."
		desc: "Bei aktivem Sandsturm wird die Stärke von Angriffen dieses Pokémon der Typen Boden, Gestein und Stahl mit 1,3 multipliziert. Dieses Pokémon erleidet keinen Schaden durch Sandsturm.", // NEEDS QC
		shortDesc: "Boden-/Gesteins-/Stahl-Angriffe x1,3 bei Sandsturm; immun gegen ihn.", // NEEDS QC
	},
	sandrush: {
		name: "Sandscharrer",
		// Official flavor text: "Erhöht in Sandstürmen die Initiative."
		desc: "Bei aktivem Sandsturm wird die Initiative dieses Pokémon verdoppelt. Dieses Pokémon erleidet keinen Schaden durch Sandsturm.", // NEEDS QC
		shortDesc: "Bei Sandsturm wird seine Initiative verdoppelt; immun gegen ihn.", // NEEDS QC
	},
	sandspit: {
		name: "Sandspeier",
		shortDesc: "Wird es von einem Angriff getroffen, bricht ein Sandsturm los.", // NEEDS QC
		gen8: {
			desc: "Wird dieses Pokémon von einem Angriff getroffen, beginnt der Effekt von Sandsturm. Dieser Effekt tritt nach den Effekten von Dynamax- und Gigadynamax-Attacken ein.", // NEEDS QC
		},
	},
	sandstream: {
		name: "Sandsturm",
		shortDesc: "Beim Einwechseln erzeugt dieses Pokémon einen Sandsturm.", // NEEDS QC
	},
	sandveil: {
		name: "Sandschleier",
		// Official flavor text: "Erhöht in Sandstürmen den Ausweichwert."
		desc: "Bei aktivem Sandsturm wird die Genauigkeit von Attacken gegen dieses Pokémon mit 0,8 multipliziert. Dieses Pokémon erleidet keinen Schaden durch Sandsturm.", // NEEDS QC
		shortDesc: "Bei Sandsturm ist sein Fluchtwert x1,25; immun gegen ihn.", // NEEDS QC
	},
	sapsipper: {
		name: "Vegetarier",
		// Official flavor text: "Wird es von einer Pflanzen-Attacke getroffen, erleidet es keinerlei Schaden und sein Angriff steigt."
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Pflanze und sein Angriff steigt um eine Stufe, wenn es von einer Attacke vom Typ Pflanze getroffen wird.", // NEEDS QC
		shortDesc: "+1 Angriff bei Treffern durch Pflanzen-Attacken; immun gegen Pflanze.", // NEEDS QC
	},
	schooling: {
		name: "Fischschwarm",
		// Official flavor text: "Verfügt es über einen hohen KP-Wert, wird es zu einem Schwarm und gewinnt an Stärke. Ist der KP-Wert niedrig, löst sich der Schwarm wieder auf."
		desc: "Beim Einwechseln nimmt dieses Pokémon, wenn es ein Lusardin ab Level 20 mit mehr als 1/4 seiner maximalen KP ist, die Schwarmform an. Fallen seine KP in der Schwarmform auf 1/4 der maximalen KP oder weniger, nimmt es am Ende der Runde die Einzelform an. Hat es in der Einzelform am Ende der Runde mehr als 1/4 seiner maximalen KP, nimmt es die Schwarmform an.", // NEEDS QC
		shortDesc: "Lusardin nimmt über 1/4 der KP die Schwarmform an, sonst die Einzelform.", // NEEDS QC

		transform: "{POKEMON} hat einen Schwarm gebildet!",
		transformEnd: "Der Schwarm von {POKEMON} hat sich zerstreut!",
	},
	scrappy: {
		name: "Rauflust",
		// Official flavor text: "Bewirkt, dass Normal- und Kampf-Attacken auch Pokémon vom Typ Geist treffen können."
		desc: "Dieses Pokémon kann Pokémon vom Typ Geist mit Attacken der Typen Normal und Kampf treffen. Es ist immun gegen den Effekt der Fähigkeit Bedroher.", // NEEDS QC
		shortDesc: "Normal und Kampf treffen Geist. Immun gegen Bedroher.", // NEEDS QC
		gen7: {
			desc: "Dieses Pokémon kann Geist-Pokémon mit Attacken vom Typ Normal und Kampf treffen.", // NEEDS QC
			shortDesc: "Kann Geister mit Normal- und Kampf-Attacken treffen.", // NEEDS QC
		},
	},
	screencleaner: {
		name: "Hemmungslos",
		shortDesc: "Beendet beim Einwechseln Auroraschleier, Lichtschild und Reflektor beidseitig.", // NEEDS QC
	},
	seedsower: {
		name: "Streusaat",
		shortDesc: "Wird es von einem Angriff getroffen, entsteht ein Grasfeld.", // NEEDS QC
	},
	serenegrace: {
		name: "Edelmut",
		// Official flavor text: "Erhöht die Wahrscheinlichkeit, dass Zusatzeffekte von Attacken auftreten."
		desc: "Die Sekundäreffekt-Chance der Attacken dieses Pokémon wird verdoppelt. Dieser Effekt ist mit dem Regenbogen-Effekt kumulierbar, außer bei Sekundäreffekten, die zurückschrecken lassen.", // NEEDS QC
		shortDesc: "Die Sekundäreffekt-Chancen seiner Attacken werden verdoppelt.", // NEEDS QC
		gen4: {
			desc: "Die Chance auf Zusatzeffekte der Attacken dieses Pokémon wird verdoppelt.", // NEEDS QC
		},
	},
	shadowshield: {
		name: "Phantomschutz",
		shortDesc: "Bei vollen KP wird erlittener Angriffsschaden halbiert.", // NEEDS QC
	},
	shadowtag: {
		name: "Wegsperre",
		// Official flavor text: "Hindert Gegner an der Flucht beziehungsweise am Auswechseln, indem es ihnen den Weg versperrt."
		desc: "Hindert Gegner daran, sich auswechseln zu lassen, außer sie tragen eine Wechselhülle, sind vom Typ Geist oder haben ebenfalls diese Fähigkeit.", // NEEDS QC
		shortDesc: "Hindert Gegner am Auswechseln, außer sie haben diese Fähigkeit auch.", // NEEDS QC
		gen6: {
			desc: "Hindert benachbarte Gegner daran, sich auswechseln zu lassen, außer sie tragen eine Wechselhülle, sind vom Typ Geist oder haben ebenfalls diese Fähigkeit.", // NEEDS QC
			shortDesc: "Benachbarte Gegner können nur auswechseln, wenn sie diese Fähigkeit haben.", // NEEDS QC
		},
		gen5: {
			desc: "Hindert benachbarte Gegner daran, sich auswechseln zu lassen, außer sie tragen eine Wechselhülle oder haben ebenfalls diese Fähigkeit.", // NEEDS QC
		},
		gen4: {
			desc: "Hindert Gegner daran, sich auswechseln zu lassen, außer sie tragen eine Wechselhülle oder haben ebenfalls diese Fähigkeit.", // NEEDS QC
			shortDesc: "Hindert Gegner am Auswechseln, außer sie haben diese Fähigkeit auch.", // NEEDS QC
		},
		gen3: {
			desc: "Hindert Gegner daran, sich auswechseln zu lassen.", // NEEDS QC
			shortDesc: "Gegner können nicht auswechseln.", // NEEDS QC
		},
	},
	sharpness: {
		name: "Scharfkantig",
		shortDesc: "Schneide-Attacken dieses Pokémon haben 1,5-fache Stärke.", // NEEDS QC
	},
	shedskin: {
		name: "Expidermis",
		// Official flavor text: "Das Pokémon befreit sich eventuell von Statusproblemen, indem es seine Haut abstreift."
		desc: "Es besteht eine Chance von 33 %, dass das Statusproblem dieses Pokémon am Ende jeder Runde geheilt wird.", // NEEDS QC
		shortDesc: "33 % Chance, sein Statusproblem am Ende jeder Runde zu heilen.", // NEEDS QC
	},
	sheerforce: {
		name: "Rohe Gewalt",
		// Official flavor text: "Erhöht die Stärke von Attacken, aber hebt dafür ihre Zusatzeffekte auf."
		desc: "Die Stärke von Angriffen dieses Pokémon mit Sekundäreffekten wird mit 1,3 multipliziert, aber die Sekundäreffekte entfallen. Wurde ein Sekundäreffekt entfernt, entfallen auch der Rückstoß des Leben-Orb und die Heilung der Muschelglocke des Anwenders, und die Fähigkeiten Wutpanzer, Wutausbruch, Farbwechsel, Rückzug, Langfinger und Reißaus des Ziels sowie dessen Rote Karte, Fluchtknopf, Akibeere und Tarabeere werden nicht aktiviert.", // NEEDS QC
		shortDesc: "Angriffe mit Sekundäreffekten: 1,3-fache Stärke, aber ohne die Effekte.", // NEEDS QC
		gen8: {
			desc: "Die Angriffe dieses Pokémon mit Zusatzeffekten haben 1,3-fache Stärke, verlieren aber ihre Zusatzeffekte. Wurde ein Zusatzeffekt entfernt, entfallen auch der Leben-Orb-Rückstoß und die Muschelglocke-Heilung des Anwenders, und Wutausbruch, Farbwechsel, Rückzug, Langfinger, Reißaus, Rote Karte, Fluchtknopf, Akibeere und Tarabeere des Ziels werden nicht ausgelöst.", // NEEDS QC
		},
		gen6: {
			desc: "Die Angriffe dieses Pokémon mit Zusatzeffekten haben 1,3-fache Stärke, verlieren aber ihre Zusatzeffekte. Wurde ein Zusatzeffekt entfernt, entfallen auch der Leben-Orb-Rückstoß und die Muschelglocke-Heilung des Anwenders, und Farbwechsel, Langfinger, Rote Karte, Fluchtknopf, Akibeere und Tarabeere des Ziels werden nicht ausgelöst.", // NEEDS QC
		},
		gen5: {
			desc: "Die Angriffe dieses Pokémon mit Zusatzeffekten haben 1,3-fache Stärke, verlieren aber ihre Zusatzeffekte. Wurde ein Zusatzeffekt entfernt, entfallen auch der Leben-Orb-Rückstoß und die Muschelglocke-Heilung des Anwenders, und Farbwechsel, Langfinger, Rote Karte und Fluchtknopf des Ziels werden nicht ausgelöst.", // NEEDS QC
		},
	},
	shellarmor: {
		name: "Panzerhaut",
		shortDesc: "Dieses Pokémon kann keine Volltreffer erleiden.", // NEEDS QC
	},
	shielddust: {
		name: "Puderabwehr",
		// Official flavor text: "Blockiert durch Puder die Zusatzeffekte gegnerischer Angriffe."
		desc: "Dieses Pokémon ist von den Sekundäreffekten der Attacken anderer Pokémon nicht betroffen. Verhindert werden Effekte mit einer Chance (selbst 100 %), zu paralysieren, einzuschläfern, einzufrieren, zu verbrennen, zu vergiften, zu verwirren, dieses Pokémon zurückschrecken zu lassen oder seine Statuswerte zu senken, sowie Ankerschuss, Schauderspruch, Schleuder, Psycholärm, Pökelsalz, Schattenfessel, Sirupbombe und Neck Strike. Der Effekt von Schaumserenade wird verhindert, wenn dieses Pokémon das einzige Ziel ist. Auch Sekundäreffekte durch King-Stein, Scharfzahn sowie die Fähigkeiten Giftgriff, Duftnote und Giftkette werden gegen dieses Pokémon verhindert.", // NEEDS QC
		shortDesc: "Ignoriert die Sekundäreffekte der Attacken anderer Pokémon.", // NEEDS QC
		gen8: {
			desc: "Dieses Pokémon ist von Zusatzeffekten der Angriffe anderer Pokémon unbeeinflusst. Verhindert werden Angriffe mit einer Chance (selbst 100 %) auf Paralyse, Schlaf, Einfrieren, Verbrennung, Vergiftung, Verwirrung, Zurückschrecken oder Statussenkungen dieses Pokémon sowie Ankerschuss, Schauderspruch, Schleuder, Schattenfessel und Neck Strike. Der Effekt von Schaumserenade wird verhindert, wenn dieses Pokémon das einzige Ziel ist. Auch Zusatzeffekte durch King-Stein, Scharfzahn und die Fähigkeiten Giftgriff und Duftnote werden gegen dieses Pokémon verhindert.", // NEEDS QC
		},
		gen7: {
			desc: "Dieses Pokémon ist von Zusatzeffekten der Angriffe anderer Pokémon unbeeinflusst. Verhindert werden Angriffe mit einer Chance (selbst 100 %) auf Paralyse, Schlaf, Einfrieren, Verbrennung, Vergiftung, Verwirrung, Zurückschrecken oder Statussenkungen dieses Pokémon sowie Ankerschuss, Schleuder, Schattenfessel und Neck Strike. Der Effekt von Schaumserenade wird verhindert, wenn dieses Pokémon das einzige Ziel ist. Auch Zusatzeffekte durch King-Stein, Scharfzahn und die Fähigkeiten Giftgriff und Duftnote werden gegen dieses Pokémon verhindert.", // NEEDS QC
		},
		gen6: {
			desc: "Dieses Pokémon ist von Zusatzeffekten der Angriffe anderer Pokémon unbeeinflusst. Verhindert werden Angriffe mit einer Chance (selbst 100 %) auf Paralyse, Schlaf, Einfrieren, Verbrennung, Vergiftung, Verwirrung, Zurückschrecken oder Statussenkungen dieses Pokémon sowie Schleuder. Auch Zusatzeffekte durch King-Stein, Scharfzahn und die Fähigkeiten Giftgriff und Duftnote werden gegen dieses Pokémon verhindert.", // NEEDS QC
		},
		gen4: {
			desc: "Dieses Pokémon ist von Zusatzeffekten der Angriffe anderer Pokémon unbeeinflusst. Verhindert werden Angriffe mit einer Chance (selbst 100 %) auf Paralyse, Schlaf, Einfrieren, Verbrennung, Vergiftung, Verwirrung, Zurückschrecken oder Statussenkungen dieses Pokémon sowie Schleuder. Auch Zusatzeffekte durch King-Stein und Scharfzahn werden gegen dieses Pokémon verhindert.", // NEEDS QC
		},
		gen3: {
			desc: "Dieses Pokémon ist von Zusatzeffekten der Angriffe anderer Pokémon unbeeinflusst. Verhindert werden Angriffe mit einer Chance (selbst 100 %) auf Paralyse, Schlaf, Einfrieren, Verbrennung, Vergiftung, Verwirrung, Zurückschrecken oder Statussenkungen dieses Pokémon. Auch der Zusatzeffekt durch King-Stein wird gegen dieses Pokémon verhindert.", // NEEDS QC
		},
	},
	shieldsdown: {
		name: "Limitschild",
		// Official flavor text: "Fallen seine KP auf die Hälfte des Maximalwerts oder weniger, zerbricht die Panzerung des Pokémon und es wird aggressiver."
		desc: "Wenn dieses Pokémon ein Meteno ist, nimmt es die Kernform an, wenn es die Hälfte oder weniger seiner maximalen KP hat, und die Meteorform, wenn es mehr als die Hälfte hat. Dies wird beim Einwechseln und am Ende jeder Runde geprüft. In der Meteorform kann es weder von Statusproblemen noch von Gähner betroffen werden.", // NEEDS QC
		shortDesc: "Meteno nimmt bei halben KP oder weniger die Kernform an, sonst die Meteorform.", // NEEDS QC

		transform: "Limitschild wird aktiviert!",
		transformEnd: "Limitschild wird aufgehoben!",
	},
	simple: {
		name: "Wankelmut",
		shortDesc: "Seine Statuswert-Änderungen werden verdoppelt.", // NEEDS QC
		gen7: {
			desc: "Wird ein Statuswert dieses Pokémon erhöht oder gesenkt, wird die Änderung verdoppelt. Diese Fähigkeit wirkt nicht auf Statuserhöhungen durch Z-Kraft-Effekte vor dem Einsatz einer Status-Z-Attacke.", // NEEDS QC
		},
		gen6: {
			desc: "Wird ein Statuswert dieses Pokémon erhöht oder gesenkt, wird die Änderung verdoppelt.", // NEEDS QC
		},
		gen4: {
			desc: "Die Statusveränderungen dieses Pokémon gelten bei der Berechnung der Statuswerte als verdoppelt. Eine Stufe kann nicht als mehr als 6 oder weniger als -6 gelten.", // NEEDS QC
			shortDesc: "Statusveränderungen gelten bei Berechnungen als verdoppelt.", // NEEDS QC
		},
	},
	skilllink: {
		name: "Wertelink",
		// Official flavor text: "Landet mit Serien-Attacken immer die maximale Anzahl an Treffern."
		desc: "Mehrfach treffende Angriffe dieses Pokémon treffen immer die maximale Anzahl. Dreifachkick und Dreifach-Axel prüfen die Genauigkeit des zweiten und dritten Treffers nicht.", // NEEDS QC
		shortDesc: "Mehrfach treffende Angriffe treffen immer die maximale Anzahl.", // NEEDS QC
		gen7: {
			desc: "Die mehrfach treffenden Attacken dieses Pokémon treffen immer mit der maximalen Anzahl. Dreifachkick prüft beim zweiten und dritten Treffer keine Genauigkeit.", // NEEDS QC
		},
		gen4: {
			desc: "Die mehrfach treffenden Attacken dieses Pokémon treffen immer mit der maximalen Anzahl. Wirkt nicht auf Dreifachkick.", // NEEDS QC
		},
	},
	slowstart: {
		name: "Saumselig",
		shortDesc: "Beim Einwechseln sind Angriff und Initiative 5 Runden lang halbiert.", // NEEDS QC
		gen7: {
			desc: "Beim Einwechseln werden Angriff und Initiative dieses Pokémon 5 Runden lang halbiert. Setzt es während des Effekts eine generische Z-Attacke auf Basis einer speziellen Attacke ein, wird sein Spezial-Angriff bei der Schadensberechnung halbiert.", // NEEDS QC
		},
		gen6: {
			desc: "Beim Einwechseln werden Angriff und Initiative dieses Pokémon 5 Runden lang halbiert.", // NEEDS QC
		},

		start: "  {POKEMON} kommt nicht in Fahrt!",
		end: "  {POKEMON} kriegt schließlich doch noch die Kurve!",
	},
	slushrush: {
		name: "Schneescharrer",
		shortDesc: "Bei Schnee wird seine Initiative verdoppelt.", // NEEDS QC
		gen8: {
			shortDesc: "Bei Hagel: doppelte Initiative für dieses Pokémon.", // NEEDS QC
		},
	},
	sniper: {
		name: "Superschütze",
		shortDesc: "Landet es einen Volltreffer, wird der Schaden mit 1,5 multipliziert.", // NEEDS QC
	},
	snowcloak: {
		name: "Schneemantel",
		// Official flavor text: "Erhöht bei Hagel den Ausweichwert."
		desc: "Bei Schnee wird die Genauigkeit von Attacken gegen dieses Pokémon mit 0,8 multipliziert.", // NEEDS QC
		shortDesc: "Bei Schnee wird sein Fluchtwert mit 1,25 multipliziert.", // NEEDS QC
		gen8: {
			desc: "Ist Hagelsturm aktiv, wird die Genauigkeit von Attacken gegen dieses Pokémon mit 0,8 multipliziert. Dieses Pokémon erleidet keinen Schaden durch Hagelsturm.", // NEEDS QC
			shortDesc: "Bei Hagel: 1,25x Fluchtwert; immun gegen Hagel.", // NEEDS QC
		},
	},
	snowwarning: {
		name: "Hagelalarm",
		shortDesc: "Beim Einwechseln erzeugt dieses Pokémon Schnee.", // NEEDS QC
		gen8: {
			shortDesc: "Beim Einwechseln erzeugt dieses Pokémon Hagelsturm.", // NEEDS QC
		},
	},
	solarpower: {
		name: "Solarkraft",
		// Official flavor text: "Führt bei Sonnenschein in jeder Runde zu KP-Verlusten, erhöht aber den Spezial-Angriff."
		desc: "Wenn Sonne aktiv ist, wird der Spezial-Angriff dieses Pokémon mit 1,5 multipliziert und es verliert am Ende jeder Runde 1/8 seiner maximalen KP, abgerundet. Diese Effekte werden verhindert, wenn das Pokémon einen Allzweckschirm trägt.", // NEEDS QC
		shortDesc: "Bei Sonne: Sp.-Ang. x1,5, verliert aber 1/8 der max. KP pro Runde.", // NEEDS QC
		gen7: {
			desc: "Ist Sonne aktiv, wird der Spezial-Angriff dieses Pokémon mit 1,5 multipliziert und es verliert am Ende jeder Runde 1/8 seiner maximalen KP, abgerundet.", // NEEDS QC
		},
	},
	solidrock: {
		name: "Felskern",
		shortDesc: "Erleidet 3/4 des Schadens durch sehr effektive Angriffe.", // NEEDS QC
	},
	soulheart: {
		name: "Seelenherz",
		shortDesc: "Sein Sp.-Ang. steigt um 1, wenn ein anderes Pokémon besiegt wird.", // NEEDS QC
	},
	soundproof: {
		name: "Lärmschutz",
		shortDesc: "Immun gegen Geräusch-Attacken, außer den eigenen.", // NEEDS QC
		gen7: {
			shortDesc: "Immun gegen geräuschbasierte Attacken, einschließlich Vitalglocke.", // NEEDS QC
		},
		gen5: {
			shortDesc: "Immun gegen geräuschbasierte Attacken, außer Vitalglocke.", // NEEDS QC
		},
		gen4: {
			shortDesc: "Immun gegen geräuschbasierte Attacken, einschließlich Vitalglocke.", // NEEDS QC
		},
	},
	speedboost: {
		name: "Temposchub",
		// Official flavor text: "Erhöht in jeder Runde die Initiative."
		desc: "Die Initiative dieses Pokémon steigt am Ende jeder vollständigen Runde auf dem Feld um eine Stufe.", // NEEDS QC
		shortDesc: "Seine Initiative steigt am Ende jeder vollen Runde um eine Stufe.", // NEEDS QC
	},
	spicyspray: {
		name: "Chilispritzer",
		shortDesc: "Wird dieses Pokémon von einem Angriff getroffen, wird der Angreifer verbrannt.", // NEEDS QC
	},
	stakeout: {
		name: "Beschattung",
		shortDesc: "Doppelte Offensive gegen Ziele, die in dieser Runde eingewechselt wurden.", // NEEDS QC
	},
	stall: {
		name: "Zeitspiel",
		shortDesc: "Handelt unter Attacken gleicher oder höherer Priorität als Letztes.", // NEEDS QC
	},
	stalwart: {
		name: "Stahlrückgrat",
		shortDesc: "Seine Attacken können nicht umgelenkt werden.", // NEEDS QC
	},
	stamina: {
		name: "Zähigkeit",
		shortDesc: "Seine Verteidigung steigt um 1, wenn eine Attacke es verletzt.", // NEEDS QC
	},
	stancechange: {
		name: "Taktikwechsel",
		// Official flavor text: "Setzt das Pokémon eine Offensiv-Attacke ein, nimmt es die Klingenform an. Setzt es danach die Attacke Königsschild ein, nimmt es die Schildform an."
		desc: "Wenn dieses Pokémon ein Durengard ist, nimmt es vor dem Einsatz einer offensiven Attacke die Klingenform und vor dem Einsatz von Königsschild die Schildform an.", // NEEDS QC
		shortDesc: "Durengard: Klingenform vor Angriffen, Schildform vor Königsschild.", // NEEDS QC
		gen6: {
			desc: "Ist dieses Pokémon ein Durengard, nimmt es vor dem Einsatz einer Angriffsattacke die Klingenform an und vor dem Einsatz von Königsschild die Schildform.", // NEEDS QC
		},

		transform: "Formwechsel zur Klingenform!",
		transformEnd: "Formwechsel zur Schildform!",
	},
	static: {
		name: "Statik",
		shortDesc: "30 % Chance, Angreifer bei Kontakt zu paralysieren.", // NEEDS QC
		gen4: {
			desc: "30 % Chance, dass ein Pokémon, das dieses Pokémon berührt, paralysiert wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
		},
		gen3: {
			desc: "1/3 Chance, dass ein Pokémon, das dieses Pokémon berührt, paralysiert wird. Dieser Effekt tritt nicht ein, wenn dieses Pokémon durch den Angriff keine KP verloren hat.", // NEEDS QC
			shortDesc: "1/3 Chance, dass Pokémon bei Kontakt paralysiert werden.", // NEEDS QC
		},
	},
	steadfast: {
		name: "Felsenfest",
		shortDesc: "Schreckt es zurück, steigt seine Initiative um eine Stufe.", // NEEDS QC
	},
	steamengine: {
		name: "Dampfantrieb",
		// Official flavor text: "Wird es von einer Wasser- oder Feuer-Attacke getroffen, steigt seine Initiative drastisch."
		desc: "Die Initiative dieses Pokémon steigt um 6 Stufen, wenn es Schaden durch eine Attacke vom Typ Feuer oder Wasser erleidet.", // NEEDS QC
		shortDesc: "+6 Initiative, wenn es Schaden durch Feuer- oder Wasser-Attacken erleidet.", // NEEDS QC
	},
	steelworker: {
		name: "Stahlprofi",
		shortDesc: "Stahl-Angriffe mit 1,5-facher Offensive.", // NEEDS QC
	},
	steelyspirit: {
		name: "Stählerner Wille",
		// Official flavor text: "Erhöht die Stärke von Stahl-Attacken auf Mitstreiterseite."
		desc: "Die Stärke von Attacken vom Typ Stahl dieses Pokémon und seiner Mitstreiter wird mit 1,5 multipliziert. Betrifft Kismetwunsch, selbst wenn der Anwender nicht mehr auf dem Feld ist.", // NEEDS QC
		shortDesc: "Stahl-Attacken von ihm und Mitstreitern mit 1,5-facher Stärke.", // NEEDS QC
	},
	stench: {
		name: "Duftnote",
		// Official flavor text: "Lässt das Ziel beim Angriff eventuell durch Gestank zurückschrecken."
		desc: "Attacken dieses Pokémon, die das Ziel normalerweise nicht zurückschrecken lassen können, erhalten eine Chance von 10 %, es zurückschrecken zu lassen.", // NEEDS QC
		shortDesc: "Attacken ohne Zurückschreck-Chance erhalten eine von 10 %.", // NEEDS QC
		gen4: {
			desc: "Kein Nutzen im Kampf.", // NEEDS QC
			shortDesc: "Kein Nutzen im Kampf.", // NEEDS QC
		},
	},
	stickyhold: {
		name: "Klebekörper",
		// Official flavor text: "Trägt es ein Item, bleibt dieses an seinem klebrigen Körper haften, wodurch Item-Diebstahl verhindert wird."
		desc: "Dieses Pokémon kann sein getragenes Item nicht durch die Fähigkeit oder einen Angriff eines anderen Pokémon verlieren, außer der Angriff macht es kampfunfähig. Ein Klettdorn wird trotz dieser Fähigkeit auf andere Pokémon übertragen.", // NEEDS QC
		shortDesc: "Kann sein Item nicht durch andere Pokémon verlieren.", // NEEDS QC
		gen4: {
			desc: "Dieses Pokémon kann sein getragenes Item nicht durch den Angriff eines anderen Pokémon verlieren, selbst wenn der Angriff es kampfunfähig macht. Ein Klettdorn wird unabhängig von dieser Fähigkeit auf andere Pokémon übertragen.", // NEEDS QC
		},

		block: "  {POKEMON} konnte kein Item abgenommen werden!",
	},
	stormdrain: {
		name: "Sturmsog",
		// Official flavor text: "Zieht Wasser-Attacken an. Statt durch diese Schaden zu nehmen, erhöht es den eigenen Spezial-Angriff."
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Wasser und sein Spezial-Angriff steigt um eine Stufe, wenn es von einer Attacke vom Typ Wasser getroffen wird. Ist dieses Pokémon nicht das Ziel einer Attacke vom Typ Wasser mit einzelnem Ziel eines anderen Pokémon, lenkt es diese auf sich um, sofern es in ihrer Reichweite ist. Können mehrere Pokémon mit dieser Fähigkeit umlenken, tut es das mit der höchsten Initiative oder bei Gleichstand das, dessen Fähigkeit länger aktiv ist.", // NEEDS QC
		shortDesc: "Zieht Wasser-Attacken an und erhält +1 Sp.-Ang.; immun gegen Wasser.", // NEEDS QC
		gen4: {
			desc: "Ist dieses Pokémon nicht das Ziel einer Wasser-Attacke eines anderen Pokémon mit nur einem Ziel, lenkt es diese Attacke auf sich um.", // NEEDS QC
			shortDesc: "Zieht Wasser-Attacken mit nur einem Ziel auf sich.", // NEEDS QC
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "Titankiefer",
		// Official flavor text: "Der kräftige Kiefer des Pokémon erhöht die Stärke von Biss-Attacken."
		desc: "Die Stärke von Biss-Attacken dieses Pokémon wird mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Biss-Attacken mit 1,5-facher Stärke. Käferbiss ausgenommen.", // NEEDS QC
	},
	sturdy: {
		name: "Robustheit",
		// Official flavor text: "Bietet Schutz gegen K.O.-Attacken. Bei vollen KP übersteht das Pokémon auch K.O.-Treffer."
		desc: "Hat dieses Pokémon volle KP, übersteht es einen Treffer mit mindestens 1 KP. K.O.-Attacken schlagen gegen dieses Pokémon fehl.", // NEEDS QC
		shortDesc: "Übersteht mit vollen KP einen Treffer mit 1 KP. Immun gegen K.O.-Attacken.", // NEEDS QC
		gen4: {
			desc: "K.O.-Attacken schlagen gegen dieses Pokémon fehl.", // NEEDS QC
			shortDesc: "K.O.-Attacken schlagen gegen dieses Pokémon fehl.", // NEEDS QC
		},

		activate: "  {POKEMON} übersteht die Attacke!",
	},
	suctioncups: {
		name: "Saugnapf",
		shortDesc: "Kann nicht durch Attacken oder Items zum Auswechseln gezwungen werden.", // NEEDS QC

		block: "  {POKEMON} verankert sich mithilfe von Saugnapf!",
	},
	superluck: {
		name: "Glückspilz",
		shortDesc: "Die Volltrefferquote dieses Pokémon steigt um eine Stufe.", // NEEDS QC
	},
	supersweetsyrup: {
		name: "Süßer Nektar",
		shortDesc: "Senkt beim Einwechseln den Fluchtwert der Gegner um 1. Einmal pro Kampf.", // NEEDS QC

		start: "  Der Nektar von {POKEMON} verströmt einen süßen Geruch!",
	},
	supremeoverlord: {
		name: "Feldherr",
		desc: "Die Stärke der Attacken dieses Pokémon wird mit 1 + (X × 0,1) multipliziert, wobei X angibt, wie oft Pokémon auf der Seite des Anwenders bereits kampfunfähig geworden sind, wenn diese Fähigkeit aktiv wird. X kann höchstens 5 betragen.", // NEEDS QC
		shortDesc: "Attacken erhalten 10 % mehr Stärke pro besiegtem Mitstreiter, bis zu 5.", // NEEDS QC

		activate: "  {POKEMON} gewinnt durch gefallene Mitstreiter an Kraft!",
	},
	surgesurfer: {
		name: "Surf-Schweif",
		shortDesc: "Ist ein Elektrofeld aktiv, wird seine Initiative verdoppelt.", // NEEDS QC
	},
	swarm: {
		name: "Hexaplaga",
		// Official flavor text: "Erhöht die Stärke von Käfer-Attacken, wenn die KP auf einen gewissen Wert fallen."
		desc: "Hat dieses Pokémon 1/3 oder weniger seiner maximalen KP, abgerundet, wird sein Offensivwert beim Einsatz einer Attacke vom Typ Käfer mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Bei 1/3 der max. KP oder weniger: Käfer-Angriffe mit 1,5-facher Offensive.", // NEEDS QC
		gen4: {
			desc: "Hat dieses Pokémon 1/3 oder weniger seiner maximalen KP, abgerundet, wird die Stärke seiner Attacken vom Typ Käfer mit 1,5 multipliziert.", // NEEDS QC
			shortDesc: "Bei 1/3 oder weniger der max. KP: 1,5x Stärke für Käfer-Attacken.", // NEEDS QC
		},
	},
	sweetveil: {
		name: "Zuckerhülle",
		// Official flavor text: "Alle Team-Pokémon können nicht einschlafen."
		desc: "Dieses Pokémon und seine Mitstreiter können nicht einschlafen, bereits schlafende wachen jedoch nicht sofort auf. Dieses Pokémon und seine Mitstreiter können Erholung nicht erfolgreich einsetzen und nicht von Gähner betroffen werden; bereits betroffene schlafen nicht ein.", // NEEDS QC
		shortDesc: "Es und Mitstreiter können nicht einschlafen; Schlafende wachen nicht auf.", // NEEDS QC

		block: "  {POKEMON} schläft aufgrund von Zuckerhülle nicht ein!",
	},
	swiftswim: {
		name: "Wassertempo",
		// Official flavor text: "Erhöht bei Regen die Initiative."
		desc: "Wenn Regen aktiv ist, wird die Initiative dieses Pokémon verdoppelt. Dieser Effekt wird verhindert, wenn dieses Pokémon einen Allzweckschirm trägt.", // NEEDS QC
		shortDesc: "Ist Regen aktiv, wird seine Initiative verdoppelt.", // NEEDS QC
		gen7: {
			desc: "Ist Regen aktiv, wird die Initiative dieses Pokémon verdoppelt.", // NEEDS QC
		},
	},
	swordofruin: {
		name: "Unheilsschwert",
		shortDesc: "Die Verteidigung aller Pokémon ohne diese Fähigkeit wird mit 0,75 multipliziert.", // NEEDS QC

		start: "  Unheilsschwert von {POKEMON} schwächt die Verteidigung aller Pokémon im Umkreis!",
	},
	symbiosis: {
		name: "Nutznießer",
		// Official flavor text: "Gibt Mitstreitern, die ihr Item aufgebraucht haben, sein eigenes Item."
		desc: "Verwendet ein Mitstreiter sein Item, gibt dieses Pokémon ihm sofort sein eigenes. Wird nicht aktiviert, wenn das Item des Mitstreiters gestohlen oder entfernt wurde oder wenn er einen Fluchtknopf oder eine Fluchttasche verwendet hat.", // NEEDS QC
		shortDesc: "Nutzt ein Mitstreiter sein Item, gibt es ihm sofort sein eigenes.", // NEEDS QC
		gen7: {
			desc: "Verwendet ein Mitstreiter sein Item, gibt dieses Pokémon ihm sofort sein eigenes Item. Wird nicht aktiv, wenn das Item des Mitstreiters gestohlen oder abgeschlagen wurde oder der Mitstreiter einen Fluchtknopf verwendet hat.", // NEEDS QC
		},
		gen6: {
			desc: "Verwendet ein Mitstreiter sein Item, gibt dieses Pokémon ihm sofort sein eigenes Item. Wird nicht aktiv, wenn das Item des Mitstreiters gestohlen oder abgeschlagen wurde.", // NEEDS QC
		},

		activate: "  {POKEMON} gibt {TARGET} das Item {ITEM} zum Tragen!",
	},
	synchronize: {
		name: "Synchro",
		// Official flavor text: "Erleidet das Pokémon Verbrennungen, Vergiftungen oder Paralyse, ereilt das jeweilige Statusproblem auch den Verursacher."
		desc: "Wird dieses Pokémon von einem anderen Pokémon verbrannt, paralysiert, vergiftet oder schwer vergiftet, erleidet der Verursacher dasselbe Statusproblem.", // NEEDS QC
		shortDesc: "Wer es verbrennt, vergiftet oder paralysiert, erleidet dasselbe.", // NEEDS QC
		gen4: {
			desc: "Verbrennt, paralysiert oder vergiftet ein anderes Pokémon dieses Pokémon, erhält es dasselbe Statusproblem. Vergiftet ein anderes Pokémon dieses Pokémon schwer, wird es normal vergiftet.", // NEEDS QC
		},
	},
	tabletsofruin: {
		name: "Unheilstafeln",
		shortDesc: "Der Angriff aller Pokémon ohne diese Fähigkeit wird mit 0,75 multipliziert.", // NEEDS QC

		start: "  Unheilstafeln von {POKEMON} schwächt den Angriff aller Pokémon im Umkreis!",
	},
	tangledfeet: {
		name: "Fußangel",
		shortDesc: "Sein Fluchtwert wird verdoppelt, solange es verwirrt ist.", // NEEDS QC
	},
	tanglinghair: {
		name: "Lockenkopf",
		shortDesc: "Angreifer verlieren bei Kontakt eine Initiative-Stufe.", // NEEDS QC
	},
	technician: {
		name: "Techniker",
		// Official flavor text: "Erhöht die Stärke von schwächeren Attacken."
		desc: "Die Stärke von Attacken dieses Pokémon mit 60 Stärke oder weniger wird mit 1,5 multipliziert, einschließlich Verzweifler. Dieser Effekt tritt ein, nachdem ein Effekt der Attacke ihre eigene Stärke verändert hat.", // NEEDS QC
		shortDesc: "Attacken mit 60 Stärke oder weniger: x1,5, auch Verzweifler.", // NEEDS QC
		gen4: {
			desc: "Attacken dieses Pokémon mit 60 oder weniger Stärke werden mit 1,5 multipliziert, außer Verzweifler. Dieser Effekt tritt ein, nachdem der Effekt einer Attacke ihre eigene Stärke ändert, sowie nach den Effekten von Ladevorgang und Rechte Hand.", // NEEDS QC
			shortDesc: "Attacken mit 60 oder weniger Stärke: 1,5x Stärke, außer Verzweifler.", // NEEDS QC
		},
	},
	telepathy: {
		name: "Telepathie",
		shortDesc: "Erleidet keinen Schaden durch Angriffe seiner Mitstreiter.", // NEEDS QC

		block: "  {POKEMON} nimmt keinen Schaden durch Angriffe von Mitstreitern!",
	},
	teraformzero: {
		name: "Teraforming Null",
		shortDesc: "Terapagos: Terakristallisieren hebt Wetter und Felder auf. Einmal pro Kampf.", // NEEDS QC
	},
	terashell: {
		name: "Tera-Panzer",
		desc: "Wenn dieses Pokémon ein Terapagos mit vollen KP ist, wird die Effektivität von Angriffen gegen es zu 0,5, außer es ist gegen die Attacke immun. Mehrfach treffende Attacken behalten dieselbe Effektivität während des gesamten Angriffs.", // NEEDS QC
		shortDesc: "Terapagos: Bei vollen KP treffen Angriffe mit 0,5-facher Effektivität.", // NEEDS QC

		activate: "  Der Panzer von {POKEMON} funkelt und verzerrt die Wechselwirkungen zwischen den Typen!",
	},
	terashift: {
		name: "Tera-Wandel",
		shortDesc: "Ist es Terapagos, nimmt es beim Einwechseln die Terakristall-Form an.", // NEEDS QC

		transform: "{POKEMON} verwandelt sich!",
	},
	teravolt: {
		name: "Teravolt",
		// Official flavor text: "Attacken können ungeachtet der Fähigkeit des Zieles eingesetzt werden."
		desc: "Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Schweifrüstung, Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Buntkörper, Kostümspuk, Trockenheit, Bodenschmaus, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Flauschigkeit, Freundeshut, Fellkleid, Goldkörper, Pflanzenpelz, Wachhund, Hitzeschutz, Schwermetall, Scherenmacht, Tiefkühlkopf, Eisflügelstaub, Erleuchtung, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Geistiges Auge, Spiegelrüstung, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Pastellhülle, Punk Rock, Läutersalz, Majestät, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Tera-Panzer, Thermowandel, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Wasserblase, Aquahülle, Knusperkruste, Pulverrauch, Windreiter, Wunderwache und Wunderhaut. Dieser Effekt betrifft alle anderen Pokémon auf dem Feld, unabhängig davon, ob sie Ziel der Attacke dieses Pokémon sind und ob ihre Fähigkeit für dieses Pokémon vorteilhaft ist.", // NEEDS QC
		shortDesc: "Seine Attacken und deren Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		gen8: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Buntkörper, Kostümspuk, Trockenheit, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Flauschigkeit, Freundeshut, Fellkleid, Pflanzenpelz, Hitzeschutz, Schwermetall, Scherenmacht, Tiefkühlkopf, Eisflügelstaub, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Spiegelrüstung, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Pastellhülle, Punk Rock, Majestät, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Wasserblase, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen7: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Dunkelaura, Buntkörper, Kostümspuk, Trockenheit, Feenaura, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Flauschigkeit, Freundeshut, Fellkleid, Pflanzenpelz, Hitzeschutz, Schwermetall, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Majestät, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Wasserblase, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen6: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Dunkelaura, Trockenheit, Feenaura, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Freundeshut, Fellkleid, Pflanzenpelz, Hitzeschutz, Schwermetall, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen5: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Kampfpanzer, Brustbieter, Neutraltorso, Umkehrung, Feuchtigkeit, Trockenheit, Filter, Feuerfänger, Pflanzengabe, Freundeshut, Hitzeschutz, Schwermetall, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Starthilfe, Multischuppe, Dösigkeit, Tempomacher, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen4: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Kampfpanzer, Neutraltorso, Feuchtigkeit, Trockenheit, Filter, Feuerfänger, Pflanzengabe, Hitzeschutz, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Blitzfänger, Flexibilität, Magmapanzer, Notschutz, Starthilfe, Dösigkeit, Tempomacher, Sandschleier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Fußangel, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Aquahülle, Pulverrauch und Wunderwache. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht. Der Angriffsbonus durch die Fähigkeit Pflanzengabe eines Mitstreiters wird nicht ignoriert.", // NEEDS QC
		},

		start: "  {POKEMON} strahlt eine knisternde Aura aus!",
	},
	thermalexchange: {
		name: "Thermowandel",
		desc: "Der Angriff dieses Pokémon steigt um eine Stufe, wenn es Schaden durch eine Attacke vom Typ Feuer erleidet. Dieses Pokémon kann nicht verbrannt werden. Erhält es diese Fähigkeit verbrannt, wird es geheilt.", // NEEDS QC
		shortDesc: "+1 Angriff bei Schaden durch Feuer; kann nicht verbrannt werden.", // NEEDS QC
	},
	thickfat: {
		name: "Speckschicht",
		// Official flavor text: "Das Pokémon wird von einer dicken Fettschicht geschützt, was den durch Feuer- und Eis-Attacken erlittenen Schaden halbiert."
		desc: "Setzt ein Pokémon einen Angriff vom Typ Feuer oder Eis gegen dieses Pokémon ein, wird sein Offensivwert bei der Schadensberechnung halbiert.", // NEEDS QC
		shortDesc: "Feuer- und Eis-Attacken treffen mit halbierter Offensive.", // NEEDS QC
		gen4: {
			desc: "Die Stärke von Angriffen vom Typ Feuer und Eis gegen dieses Pokémon wird halbiert.", // NEEDS QC
			shortDesc: "Halbiert die Stärke von Feuer- und Eis-Attacken gegen dieses Pokémon.", // NEEDS QC
		},
		gen3: {
			desc: "Setzt ein Pokémon einen Angriff vom Typ Feuer oder Eis gegen dieses Pokémon ein, wird sein Spezial-Angriff bei der Berechnung des Schadens gegen dieses Pokémon halbiert.", // NEEDS QC
			shortDesc: "Feuer-/Eis-Attacken gegen dieses Pokémon rechnen mit halbiertem Sp.-Ang.", // NEEDS QC
		},
	},
	tintedlens: {
		name: "Aufwertung",
		shortDesc: "Seine nicht sehr effektiven Angriffe verursachen doppelten Schaden.", // NEEDS QC
	},
	torrent: {
		name: "Sturzbach",
		// Official flavor text: "Erhöht die Stärke von Wasser-Attacken, wenn die KP auf einen gewissen Wert fallen."
		desc: "Hat dieses Pokémon 1/3 oder weniger seiner maximalen KP, abgerundet, wird sein Offensivwert beim Einsatz einer Attacke vom Typ Wasser mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Bei 1/3 der max. KP oder weniger: Wasser-Angriffe mit 1,5-facher Offensive.", // NEEDS QC
		gen4: {
			desc: "Hat dieses Pokémon 1/3 oder weniger seiner maximalen KP, abgerundet, wird die Stärke seiner Attacken vom Typ Wasser mit 1,5 multipliziert.", // NEEDS QC
			shortDesc: "Bei 1/3 oder weniger der max. KP: 1,5x Stärke für Wasser-Attacken.", // NEEDS QC
		},
	},
	toughclaws: {
		name: "Krallenwucht",
		shortDesc: "Seine Kontaktattacken haben 1,3-fache Stärke.", // NEEDS QC
	},
	toxicboost: {
		name: "Giftwahn",
		// Official flavor text: "Erhöht bei Vergiftungen die Stärke von physischen Attacken."
		desc: "Solange dieses Pokémon vergiftet ist, wird die Stärke seiner physischen Angriffe mit 1,5 multipliziert.", // NEEDS QC
		shortDesc: "Ist es vergiftet, haben seine physischen Angriffe 1,5-fache Stärke.", // NEEDS QC
	},
	toxicchain: {
		name: "Giftkette",
		desc: "Angriffe dieses Pokémon haben eine Chance von 30 %, schwer zu vergiften. Dieser Effekt tritt vor der attackeneigenen Sekundäreffekt-Chance ein.", // NEEDS QC
		shortDesc: "Seine Angriffe haben 30 % Chance, schwer zu vergiften.", // NEEDS QC
	},
	toxicdebris: {
		name: "Giftbelag",
		shortDesc: "Erleidet es physischen Schaden, werden Giftspitzen beim Gegner ausgelegt.", // NEEDS QC
	},
	trace: {
		name: "Erfassen",
		// Official flavor text: "Kopiert bei Kampfantritt die Fähigkeit eines Gegners."
		desc: "Beim Einwechseln kopiert dieses Pokémon die Fähigkeit eines zufällig gewählten Gegners. Nicht kopiert werden können Reitgespann, Freundschaftsakt, Dauerschlaf, Kommandant, Kostümspuk, Erinnerungskraft, Pflanzengabe, Prognose, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Giftpuppenspiel, Scharwandel, Chemiekraft, Paläosynthese, Quantenantrieb, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Teraforming Null, Tera-Panzer, Tera-Wandel, Erfassen, Trance-Modus und Superwechsel. Hat kein Gegner eine kopierbare Fähigkeit, wird diese Fähigkeit aktiviert, sobald dies möglich ist.", // NEEDS QC
		shortDesc: "Kopiert beim Einwechseln die Fähigkeit eines zufälligen Gegners.", // NEEDS QC
		gen8: {
			desc: "Beim Einwechseln kopiert dieses Pokémon die Fähigkeit eines zufälligen Gegners. Nicht kopiert werden können Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Würggeschoss, Heißhunger, Tiefkühlkopf, Trugbild, Doppelgänger, Variabilität, Reaktionsgas, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen und Trance-Modus. Hat kein Gegner eine kopierbare Fähigkeit, wird diese Fähigkeit aktiv, sobald einer eine hat.", // NEEDS QC
		},
		gen7: {
			desc: "Beim Einwechseln kopiert dieses Pokémon die Fähigkeit eines zufälligen Gegners. Nicht kopiert werden können Freundschaftsakt, Dauerschlaf, Kostümspuk, Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Scharwandel, Chemiekraft, Receiver, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Erfassen und Trance-Modus. Hat kein Gegner eine kopierbare Fähigkeit, wird diese Fähigkeit aktiv, sobald einer eine hat.", // NEEDS QC
		},
		gen6: {
			desc: "Beim Einwechseln kopiert dieses Pokémon die Fähigkeit eines zufälligen benachbarten Gegners. Nicht kopiert werden können Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Taktikwechsel, Erfassen und Trance-Modus. Hat kein Gegner eine kopierbare Fähigkeit, wird diese Fähigkeit aktiv, sobald einer eine hat.", // NEEDS QC
		},
		gen5: {
			desc: "Beim Einwechseln kopiert dieses Pokémon die Fähigkeit eines zufälligen benachbarten Gegners. Nicht kopiert werden können Pflanzengabe, Prognose, Trugbild, Doppelgänger, Variabilität, Erfassen und Trance-Modus. Hat kein Gegner eine kopierbare Fähigkeit, wird diese Fähigkeit aktiv, sobald einer eine hat.", // NEEDS QC
		},
		gen4: {
			desc: "Beim Einwechseln kopiert dieses Pokémon die Fähigkeit eines zufälligen Gegners. Nicht kopiert werden können Prognose, Variabilität und Erfassen. Hat kein Gegner eine kopierbare Fähigkeit, wird diese Fähigkeit aktiv, sobald einer eine hat.", // NEEDS QC
		},
		gen3: {
			desc: "Beim Einwechseln kopiert dieses Pokémon die Fähigkeit eines zufälligen Gegners.", // NEEDS QC
		},

		changeAbility: "  {ABILITY} von {SOURCE} wurde erfasst und kopiert!", // SV de_common:6723; ability renamed Fährte → Erfassen in gen 8
	},
	transistor: {
		name: "Transistor",
		shortDesc: "Elektro-Angriffe mit 1,3-facher Offensive.", // NEEDS QC
		gen8: {
			shortDesc: "1,5x Offensivwert beim Einsatz von Elektro-Attacken.", // NEEDS QC
		},
	},
	triage: {
		name: "Heilwandel",
		shortDesc: "Seine Heil-Attacken haben Priorität +3.", // NEEDS QC
	},
	truant: {
		name: "Schnarchnase",
		shortDesc: "Dieses Pokémon handelt nur jede zweite Runde.", // NEEDS QC
		gen3: {
			desc: "Dieses Pokémon setzt nur jede zweite Runde eine Attacke ein und faulenzt sonst. Ersetzt es ein Pokémon, das durch Effekte am Rundenende kampfunfähig wurde, faulenzt es in seiner ersten Runde.", // NEEDS QC
		},

		cant: "{POKEMON} faulenzt!",
	},
	turboblaze: {
		name: "Turbobrand",
		// Official flavor text: "Attacken können ungeachtet der Fähigkeit des Zieles eingesetzt werden."
		desc: "Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Schweifrüstung, Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Buntkörper, Kostümspuk, Trockenheit, Bodenschmaus, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Flauschigkeit, Freundeshut, Fellkleid, Goldkörper, Pflanzenpelz, Wachhund, Hitzeschutz, Schwermetall, Scherenmacht, Tiefkühlkopf, Eisflügelstaub, Erleuchtung, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Geistiges Auge, Spiegelrüstung, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Pastellhülle, Punk Rock, Läutersalz, Majestät, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Tera-Panzer, Thermowandel, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Wasserblase, Aquahülle, Knusperkruste, Pulverrauch, Windreiter, Wunderwache und Wunderhaut. Dieser Effekt betrifft alle anderen Pokémon auf dem Feld, unabhängig davon, ob sie Ziel der Attacke dieses Pokémon sind und ob ihre Fähigkeit für dieses Pokémon vorteilhaft ist.", // NEEDS QC
		shortDesc: "Seine Attacken und deren Effekte ignorieren die Fähigkeiten anderer Pokémon.", // NEEDS QC
		gen8: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Buntkörper, Kostümspuk, Trockenheit, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Flauschigkeit, Freundeshut, Fellkleid, Pflanzenpelz, Hitzeschutz, Schwermetall, Scherenmacht, Tiefkühlkopf, Eisflügelstaub, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Spiegelrüstung, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Pastellhülle, Punk Rock, Majestät, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Wasserblase, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen7: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Dunkelaura, Buntkörper, Kostümspuk, Trockenheit, Feenaura, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Flauschigkeit, Freundeshut, Fellkleid, Pflanzenpelz, Hitzeschutz, Schwermetall, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Majestät, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Wasserblase, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen6: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Dufthülle, Aura-Umkehr, Kampfpanzer, Brustbieter, Kugelsicher, Neutraltorso, Umkehrung, Feuchtigkeit, Dunkelaura, Trockenheit, Feenaura, Filter, Feuerfänger, Pflanzengabe, Blütenhülle, Freundeshut, Fellkleid, Pflanzenpelz, Hitzeschutz, Schwermetall, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Starthilfe, Multischuppe, Dösigkeit, Partikelschutz, Tempomacher, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Zuckerhülle, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen5: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Kampfpanzer, Brustbieter, Neutraltorso, Umkehrung, Feuchtigkeit, Trockenheit, Filter, Feuerfänger, Pflanzengabe, Freundeshut, Hitzeschutz, Schwermetall, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Leichtmetall, Blitzfänger, Flexibilität, Magiespiegel, Magmapanzer, Notschutz, Starthilfe, Multischuppe, Dösigkeit, Tempomacher, Sandschleier, Vegetarier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Fußangel, Telepathie, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Aquahülle, Pulverrauch, Wunderwache und Wunderhaut. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht und ob seine Fähigkeit diesem Pokémon nützt oder nicht.", // NEEDS QC
		},
		gen4: {
			desc: "Die Attacken dieses Pokémon und ihre Effekte ignorieren bestimmte Fähigkeiten anderer Pokémon. Ignoriert werden können Kampfpanzer, Neutraltorso, Feuchtigkeit, Trockenheit, Filter, Feuerfänger, Pflanzengabe, Hitzeschutz, Scherenmacht, Immunität, Konzentrator, Insomnia, Adlerauge, Floraschild, Schwebe, Blitzfänger, Flexibilität, Magmapanzer, Notschutz, Starthilfe, Dösigkeit, Tempomacher, Sandschleier, Panzerhaut, Puderabwehr, Wankelmut, Schneemantel, Felskern, Lärmschutz, Klebekörper, Sturmsog, Robustheit, Saugnapf, Fußangel, Speckschicht, Unkenntnis, Munterkeit, Voltabsorber, H2O-Absorber, Aquahülle, Pulverrauch und Wunderwache. Dies betrifft jedes andere Pokémon auf dem Feld, ob es Ziel der Attacke dieses Pokémon ist oder nicht. Der Angriffsbonus durch die Fähigkeit Pflanzengabe eines Mitstreiters wird nicht ignoriert.", // NEEDS QC
		},

		start: "  {POKEMON} strahlt eine lodernde Aura aus!",
	},
	unaware: {
		name: "Unkenntnis",
		// Official flavor text: "Greift das Pokémon an, ignoriert es sämtliche Statusveränderungen des Zieles."
		desc: "Dieses Pokémon ignoriert beim Erleiden von Schaden die Stufen von Angriff, Spezial-Angriff und Genauigkeit anderer Pokémon und beim Zufügen von Schaden deren Stufen von Verteidigung, Spezial-Verteidigung und Fluchtwert.", // NEEDS QC
		shortDesc: "Ignoriert die Statusveränderungen anderer Pokémon bei der Schadensberechnung.", // NEEDS QC
	},
	unburden: {
		name: "Entlastung",
		// Official flavor text: "Wenn das von ihm getragene Item verwendet wird oder verloren geht, erhöht dies seine Initiative."
		desc: "Verliert dieses Pokémon sein getragenes Item aus irgendeinem Grund, wird seine Initiative verdoppelt, solange es im Kampf bleibt, diese Fähigkeit behält und kein Item trägt.", // NEEDS QC
		shortDesc: "Initiative verdoppelt nach Item-Verlust; endet bei Wechsel, neuem Item/Fähigkeit.", // NEEDS QC
	},
	unnerve: {
		name: "Anspannung",
		// Official flavor text: "Erzeugt bei Gegnern Stress und hindert sie so daran, Beeren zu konsumieren."
		desc: "Solange dieses Pokémon im Kampf ist, können Gegner ihre Beeren nicht essen. Diese Fähigkeit wird vor Fallen und anderen Fähigkeiten aktiv.", // NEEDS QC
		shortDesc: "Solange es im Kampf ist, können Gegner ihre Beeren nicht essen.", // NEEDS QC

		start: "  {TEAM:capitalize} kriegen vor Anspannung keine Beeren mehr runter!",
	},
	unseenfist: {
		name: "Verborgene Faust",
		shortDesc: "Seine Kontaktattacken ignorieren Schutz, außer Dyna-Wall.", // NEEDS QC
		champions: {
			shortDesc: null, // NEEDS TRANSLATION: not in PokeAPI
		},
	},
	vesselofruin: {
		name: "Unheilsgefäß",
		shortDesc: "Der Sp.-Ang. aller Pokémon ohne diese Fähigkeit wird mit 0,75 multipliziert.", // NEEDS QC

		start: "  Unheilsgefäß von {POKEMON} schwächt den Spezial-Angriff aller Pokémon im Umkreis!",
	},
	victorystar: {
		name: "Triumphstern",
		shortDesc: "Attacken von ihm und Mitstreitern mit 1,1-facher Genauigkeit.", // NEEDS QC
	},
	vitalspirit: {
		name: "Munterkeit",
		shortDesc: "Kann nicht einschlafen. Erhalt der Fähigkeit weckt es auf.", // NEEDS QC
	},
	voltabsorb: {
		name: "Voltabsorber",
		// Official flavor text: "Treffer durch Elektro-Attacken verursachen keinen Schaden, sondern regenerieren stattdessen KP."
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Elektro und stellt 1/4 seiner maximalen KP wieder her, abgerundet, wenn es von einer Attacke vom Typ Elektro getroffen wird.", // NEEDS QC
		shortDesc: "Heilt 1/4 der max. KP bei Elektro-Treffern; immun gegen Elektro.", // NEEDS QC
		gen3: {
			desc: "Dieses Pokémon ist immun gegen schädigende Attacken vom Typ Elektro und stellt 1/4 seiner maximalen KP wieder her, abgerundet, wenn es von einer getroffen wird.", // NEEDS QC
			shortDesc: "Heilt 1/4 der max. KP bei Elektro-Angriffen; immun dagegen.", // NEEDS QC
		},
	},
	wanderingspirit: {
		name: "Rastlose Seele",
		// Official flavor text: "Wird das Pokémon von einer direkten Attacke getroffen, tauscht es seine Fähigkeit mit der des Angreifers."
		desc: "Pokémon, die dieses Pokémon mit einer Kontaktattacke treffen, tauschen ihre Fähigkeit mit seiner. Betrifft nicht Pokémon mit den Fähigkeiten Reitgespann, Freundschaftsakt, Dauerschlaf, Kommandant, Kostümspuk, Erinnerungskraft, Heißhunger, Tiefkühlkopf, Trugbild, Variabilität, Reaktionsgas, Giftpuppenspiel, Scharwandel, Paläosynthese, Quantenantrieb, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Tera-Panzer, Tera-Wandel, Teraforming Null, Wunderwache, Trance-Modus und Superwechsel.", // NEEDS QC
		shortDesc: "Angreifer tauschen bei Kontakt ihre Fähigkeit mit seiner.", // NEEDS QC
		gen8: {
			desc: "Pokémon, die dieses Pokémon berühren, tauschen ihre Fähigkeit mit dieser. Wirkt nicht auf Pokémon mit den Fähigkeiten Reitgespann, Freundschaftsakt, Dauerschlaf, Kostümspuk, Würggeschoss, Heißhunger, Tiefkühlkopf, Trugbild, Variabilität, Reaktionsgas, Scharwandel, Alpha-System, Fischschwarm, Limitschild, Taktikwechsel, Wunderwache oder Trance-Modus.", // NEEDS QC
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "H2O-Absorber",
		// Official flavor text: "Treffer durch Wasser-Attacken verursachen keinen Schaden, sondern regenerieren stattdessen KP."
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Wasser und stellt 1/4 seiner maximalen KP wieder her, abgerundet, wenn es von einer Attacke vom Typ Wasser getroffen wird.", // NEEDS QC
		shortDesc: "Heilt 1/4 der max. KP bei Wasser-Treffern; immun gegen Wasser.", // NEEDS QC
	},
	waterbubble: {
		name: "Wasserblase",
		// Official flavor text: "Feuer-Attacken fügen dem Pokémon weniger Schaden zu. Verhindert Verbrennungen."
		desc: "Der Offensivwert dieses Pokémon wird beim Einsatz einer Attacke vom Typ Wasser verdoppelt. Setzt ein Pokémon einen Angriff vom Typ Feuer gegen dieses Pokémon ein, wird sein Offensivwert bei der Schadensberechnung halbiert. Dieses Pokémon kann nicht verbrannt werden. Erhält es diese Fähigkeit verbrannt, wird es geheilt.", // NEEDS QC
		shortDesc: "Wasser-Stärke verdoppelt; nie verbrannt; Feuer gegen es halbiert.", // NEEDS QC
	},
	watercompaction: {
		name: "Verklumpen",
		shortDesc: "+2 Verteidigung, wenn eine Wasser-Attacke es verletzt.", // NEEDS QC
	},
	waterveil: {
		name: "Aquahülle",
		shortDesc: "Kann nicht verbrannt werden. Erhalt der Fähigkeit heilt Verbrennung.", // NEEDS QC
	},
	weakarmor: {
		name: "Bruchrüstung",
		// Official flavor text: "Senkt bei erlittenem Treffer durch eine physische Attacke die Verteidigung des Pokémon, aber erhöht dafür seine Initiative stark."
		desc: "Trifft ein physischer Angriff dieses Pokémon, sinkt seine Verteidigung um eine Stufe und seine Initiative steigt um 2 Stufen.", // NEEDS QC
		shortDesc: "Bei physischen Treffern: -1 Verteidigung und +2 Initiative.", // NEEDS QC
		gen6: {
			desc: "Wird dieses Pokémon von einem physischen Angriff getroffen, sinkt seine Verteidigung um eine Stufe und seine Initiative steigt um eine Stufe.", // NEEDS QC
			shortDesc: "Bei physischen Treffern: -1 Verteidigung, +1 Initiative.", // NEEDS QC
		},
	},
	wellbakedbody: {
		name: "Knusperkruste",
		desc: "Dieses Pokémon ist immun gegen Attacken vom Typ Feuer und seine Verteidigung steigt um 2 Stufen, wenn es von einer Attacke vom Typ Feuer getroffen wird.", // NEEDS QC
		shortDesc: "+2 Verteidigung bei Feuer-Treffern; immun gegen Feuer.", // NEEDS QC
	},
	whitesmoke: {
		name: "Pulverrauch",
		shortDesc: "Hindert andere Pokémon daran, seine Statuswerte zu senken.", // NEEDS QC
	},
	wimpout: {
		name: "Reißaus",
		// Official flavor text: "Fallen seine KP auf die Hälfte des Maximalwerts oder weniger, zieht es sich ängstlich zurück."
		desc: "Hat dieses Pokémon mehr als die Hälfte seiner maximalen KP und fällt durch Schaden auf die Hälfte oder weniger, wird es sofort gegen einen gewählten Mitstreiter ausgewechselt. Dieser Effekt tritt nach allen Treffern einer mehrfach treffenden Attacke ein. Er wird verhindert, wenn der Sekundäreffekt der Attacke durch die Fähigkeit Rohe Gewalt entfernt wurde. Er gilt für direkten wie indirekten Schaden, außer dem von selbst eingesetzten Fluch und Delegator, von Bauchtrommel, von Leidteiler und von Verwirrung.", // NEEDS QC
		shortDesc: "Es verlässt das Feld, wenn es auf halbe KP oder weniger fällt.", // NEEDS QC
	},
	windpower: {
		name: "Windkraft",
		desc: "Dieses Pokémon erhält den Effekt von Ladevorgang, wenn es von einer Wind-Attacke getroffen wird oder Rückenwind in seinem Team beginnt.", // NEEDS QC
		shortDesc: "Erhält den Effekt von Ladevorgang bei Wind-Treffern oder Rückenwind.", // NEEDS QC

		start: "#electromorphosis",
	},
	windrider: {
		name: "Windreiter",
		desc: "Dieses Pokémon ist immun gegen Wind-Attacken und sein Angriff steigt um eine Stufe, wenn es von einer Wind-Attacke getroffen wird oder Rückenwind in seinem Team beginnt.", // NEEDS QC
		shortDesc: "+1 Angriff bei Wind-Treffern oder Rückenwind; immun gegen Wind.", // NEEDS QC
	},
	wonderguard: {
		name: "Wunderwache",
		shortDesc: "Nur sehr effektive Attacken und indirekter Schaden verletzen es.", // NEEDS QC
		gen4: {
			shortDesc: "Nur Feuerzahn, sehr effektive Attacken und indirekter Schaden schaden ihm.", // NEEDS QC
		},
		gen3: {
			shortDesc: "Nur sehr effektive Attacken und indirekter Schaden schaden ihm.", // NEEDS QC
		},
	},
	wonderskin: {
		name: "Wunderhaut",
		// Official flavor text: "Wehrt mit robustem Körper viele Status-Attacken ab."
		desc: "Nicht schädigende Attacken mit Genauigkeitsprüfung haben gegen dieses Pokémon nur 50 % Genauigkeit. Dieser Effekt tritt vor anderen Effekten ein, die die Genauigkeit verändern.", // NEEDS QC
		shortDesc: "Status-Attacken mit Genauigkeit treffen es nur zu 50 %.", // NEEDS QC
	},
	zenmode: {
		name: "Trance-Modus",
		// Official flavor text: "Fallen seine KP auf die Hälfte des Maximalwerts oder weniger, wechselt es seine Gestalt."
		desc: "Wenn dieses Pokémon ein Flampivian oder Galar-Flampivian ist, wechselt es in den Trance-Modus, wenn es am Ende einer Runde die Hälfte oder weniger seiner maximalen KP hat. Liegen seine KP am Ende einer Runde über der Hälfte, wechselt es in den Normal-Modus zurück.", // NEEDS QC; species name Galar-Flampivian via PokéWiki
		shortDesc: "Flampivian wechselt bei halben KP oder weniger in den Trance-Modus.", // NEEDS QC
		gen7: {
			desc: "Ist dieses Pokémon ein Flampivian, wechselt es in den Trance-Modus, wenn es am Ende einer Runde 1/2 oder weniger seiner maximalen KP hat. Hat es am Ende einer Runde mehr als 1/2 seiner maximalen KP, wechselt es zurück in den Normal-Modus.", // NEEDS QC
		},
		gen6: {
			desc: "Ist dieses Pokémon ein Flampivian, wechselt es in den Trance-Modus, wenn es am Ende einer Runde 1/2 oder weniger seiner maximalen KP hat. Hat es am Ende einer Runde mehr als 1/2 seiner maximalen KP, wechselt es zurück in den Normal-Modus. Verliert es diese Fähigkeit im Trance-Modus, kehrt es sofort in den Normal-Modus zurück.", // NEEDS QC
		},

		transform: "Es verfällt in den Trance-Modus!",
		transformEnd: "Es verlässt den Trance-Modus!",
	},
	zerotohero: {
		name: "Superwechsel",
		shortDesc: "Delfinator in der Schlichtform wird beim Auswechseln zur Heldenform.", // NEEDS QC

		activate: "  {POKEMON} hat sich verwandelt und ist zurückgekehrt!",
	},

	// CAP
	mountaineer: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		shortDesc: "Weicht beim Einwechseln allen Gesteins-Attacken und Tarnsteinen aus.", // NEEDS QC
	},
	rebound: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Beim Einwechseln blockiert dieses Pokémon bestimmte Status-Attacken und lenkt sie auf den Anwender zurück.", // NEEDS QC
		shortDesc: "Wirft beim Einwechseln bestimmte Status-Attacken auf den Anwender zurück.", // NEEDS QC

		move: "#magiccoat",
	},
	persistent: {
		name: null, // NEEDS TRANSLATION: not in PokeAPI
		desc: "Die Dauer von Erdanziehung, Heilblockade, Magieraum, Bodyguard, Rückenwind, Bizarroraum und Wunderraum wird um 2 Runden verlängert, wenn dieses Pokémon den Effekt auslöst.", // NEEDS QC
		shortDesc: "Seine Erdanziehung, Heilblockade, Rückenwind, Räume usw. halten 2 Runden länger.", // NEEDS QC

		activate: "  {POKEMON} verlängert {MOVE} um 2 Runden!", // NEEDS QC
	},
};
