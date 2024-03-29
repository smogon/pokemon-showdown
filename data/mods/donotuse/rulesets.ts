export const Rulesets: {[k: string]: ModdedFormatData} = {
	donotusemod: {
		effectType: 'Rule',
		name: 'Do Not Use Mod',
		desc: 'At the start of a battle, gives each player a link to the Do Not Use thread so they can use it to get information about new additions to the metagame.',
		onBegin() {
			this.add('-message', `Welcome to Do Not Use!`);
			this.add('-message', `This is a metagame where only Pokemon with less than 280 BST are allowed!`);
			this.add('-message', `You can find our thread and metagame resources here:`);
			this.add('-message', `https://www.smogon.com/forums/threads/3734326/`);
		},
	},
	donotusepokedex: {
		effectType: 'ValidatorRule',
		name: 'Do Not Use Pokedex',
		desc: "Only allows Pok&eacute;mon with less than 280 BST, with a select few exceptions",
		onValidateSet(set, format) {
			const dnuDex = [
        "Applin", "Arrokuda", "Azurill", "Bidoof", "Blipbug", "Bounsweet", "Bramblin", "Budew", "Bunnelby", "Burmy", "Cascoon", "Caterpie", "Charcadet", "Cherubi", "Cleffa", "Combee", "Cosmog", "Cottonee", "Diglett", "Diglett-Alola", "Dreepy", "Feebas", "Fletchling", "Fomantis", "Gossifleur", "Happiny", "Hatenna", "Hoothoot", "Hoppip", "Igglybuff", "Impidimp", "Jigglypuff", "Kakuna", "Kirlia", "Kricketot", "Lechonk", "Ledyba", "Lillipup", "Litwick", "Lotad", "Magikarp", "Makuhita", "Mareep", "Marill", "Meditite", "Metapod", "Milcery", "Nacli", "Nickit", "Nidoran-F", "Nincada", "Noibat", "Nymble", "Patrat", "Pawmi", "Petilil", "Pichu", "Pidgey", "Pidove", "Pikipek", "Poochyena", "Ralts", "Rattata", "Rattata-Alola", "Rellor", "Rockruff", "Roggenrola", "Rolycoly", "Rookidee", "Scatterbug", "Seedot", "Sentret", "Shedinja", "Shinx", "Silcoon", "Skitty", "Skwovet", "Slakoth", "Slugma", "Smoliv", "Snom", "Spearow", "Spewpa", "Spinarak", "Starly", "Sunkern", "Surskit", "Swinub", "Tadbulb", "Taillow", "Tarountula", "Togepi", "Toxel", "Tynamo", "Tyrogue", "Venipede", "Wattrel", "Weedle", "Whismur", "Wiglett", "Wimpod", "Wooloo", "Wooper", "Wooper-Paldea", "Wurmple", "Wynaut", "Yamper", "Yungoos", "Zigzagoon-Galar", "Zubat", "Luvdisc", "Unown",
      ];
			const species = this.dex.species.get(set.species || set.name);
			if (!dnuDex.includes(species.baseSpecies) && !this.ruleTable.has('+' + species.id)) {
				return [species.baseSpecies + " is not in the DNU Pokédex."];
			}
		},
	},
};
