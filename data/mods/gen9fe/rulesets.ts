export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	megadatamod: {
		effectType: 'Rule',
		name: 'Mega Data Mod',
		desc: 'Gives data on stats, Ability and types when a Pokémon Mega Evolves or undergoes Ultra Burst.',
		onSwitchIn(pokemon) {
			if (pokemon.species.forme.startsWith('Mega') || pokemon.species.forme.startsWith('Ultra')) {
				this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			}
		},
		onAfterMega(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			const species = pokemon.species;
			let buf = `<span class="col pokemonnamecol" style="white-space: nowrap">${species.name}</span> `;
			buf += `<span class="col typecol">`;
			buf += `<img src="https://${Config.routes.client}/sprites/types/${species.types[0]}.png" alt="${species.types[0]}" height="14" width="32">`;
			if (species.types[1]) {
				buf += `<img src="https://${Config.routes.client}/sprites/types/${species.types[1]}.png" alt="${species.types[1]}" height="14" width="32">`;
			}
			buf += `</span> `;
			buf += `<span style="float: left ; min-height: 26px"><span class="col abilitycol">${species.abilities[0]}</span><span class="col abilitycol"></span></span>`;
			const stats = [];
			let stat: StatID;
			for (stat in species.baseStats) {
				const statNames: { [k in StatID]: string } = { hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe" };
				stats.push(`<span class="col statcol"><em>${statNames[stat]}</em><br>${species.baseStats[stat]}</span>`);
			}
			buf += `<span style="float: left ; min-height: 26px">${stats.join(' ')}</span>`;
			buf += `</span>`;
			this.add(`raw|<ul class="utilichart"><li class="result">${buf}</li><li style="clear: both"></li></ul>`);
		},
	},
	terastalclause: {
		effectType: 'Rule',
		name: 'Terastal Clause',
		desc: "Prevents Pok&eacute;mon without Terastal forms from Terastallizing",
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.species.baseSpecies !== 'Hattepon') {
					pokemon.canTerastallize = null;
				}
			}
			this.add('rule', 'Terastal Clause: Only Pok\u00E9mon with Tera forms can Terastallize');
		},
	},
	evasionabilitiesclause: {
		effectType: 'ValidatorRule',
		name: 'Evasion Abilities Clause',
		desc: "Bans abilities that boost Evasion under certain weather conditions",
		banlist: ['Sand Veil', 'Snow Cloak', 'Sand Sword'],
		onBegin() {
			this.add('rule', 'Evasion Abilities Clause: Evasion abilities are banned');
		},
	},
	fusionspriteviewer: {
		effectType: 'ValidatorRule',
		name: 'Fusion Sprite Viewer',
		desc: "Displays a fusion's sprite in chat when it is switched in for the first time",
		onBegin() {
			this.add('rule', 'Fusion Sprite Viewer: Displays fusion sprites in chat');
		},
		onSwitchIn(pokemon) {
			switch (pokemon.species.name) {
			case 'Varantis':
				if (this.effectState.varantis) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/varantis.png" height="96" width="96">`);
				this.effectState.varantis = true;
				break;
			case 'Revarantis':
				if (this.effectState.revarantis) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/revarantis.png" height="96" width="96">`);
				this.effectState.revarantis = true;
				break;
			case 'Rotoghold':
				if (this.effectState.rotoghold) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/rotoghold.png" height="96" width="96">`);
				this.effectState.rotoghold = true;
				break;
			case 'Toedieleki':
				if (this.effectState.toedieleki) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/toedieleki.png" height="96" width="96">`);
				this.effectState.toedieleki = true;
				break;
			case 'Arbolosion-Hisui':
				if (this.effectState.arbolosion) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/arbolosionhisui.png" height="96" width="96">`);
				this.effectState.arbolosion = true;
				break;
			case 'Iron Meta':
				if (this.effectState.ironmeta) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/ironmeta.png" height="96" width="96">`);
				this.effectState.ironmeta = true;
				break;
			case 'Deciperior-Hisui':
				if (this.effectState.deciperior) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/deciperiorhisui.png" height="96" width="96">`);
				this.effectState.deciperior = true;
				break;
			case 'Slither King':
				if (this.effectState.slitherking) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/slitherking.png" height="96" width="96">`);
				this.effectState.slitherking = true;
				break;
			case 'Gargamise':
				if (this.effectState.gargamise) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/gargamise.png" height="96" width="96">`);
				this.effectState.gargamise = true;
				break;
			case 'Drampiclus':
				if (this.effectState.drampiclus) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/drampiclus.png" height="96" width="96">`);
				this.effectState.drampiclus = true;
				break;
			case 'Muktaria-Alola':
				if (this.effectState.muktaria) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/muktariaalola.png" height="96" width="96">`);
				this.effectState.muktaria = true;
				break;
			case 'Whimsy Sands':
				if (this.effectState.whimsysands) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/whimsysands.png" height="96" width="96">`);
				this.effectState.whimsysands = true;
				break;
			case 'Roaring Sal':
				if (this.effectState.roaringsal) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/roaringsal.png" height="96" width="96">`);
				this.effectState.roaringsal = true;
				break;
			case 'Sol Valiant':
				if (this.effectState.solvaliant) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/solvaliant.png" height="96" width="96">`);
				this.effectState.solvaliant = true;
				break;
			case 'Meowscorio-Sensu':
				if (this.effectState.meowscorio) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/meowscoriosensu.png" height="96" width="96">`);
				this.effectState.meowscorio = true;
				break;
			case 'Brambleswine':
				if (this.effectState.brambleswine) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/brambleswine.png" height="96" width="96">`);
				this.effectState.brambleswine = true;
				break;
			case 'Relishadow':
				if (this.effectState.relishadow) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/relishadowzenith.png" height="96" width="96">`);
				this.effectState.relishadow = true;
				break;
			case 'Garpyuku':
				if (this.effectState.garpyuku) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/garpyuku.png" height="96" width="96">`);
				this.effectState.garpyuku = true;
				break;
			case 'Yveltox':
				if (this.effectState.yveltox) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/yveltox.png" height="96" width="96">`);
				this.effectState.yveltox = true;
				break;
			case 'Iron Mimic':
				if (this.effectState.ironmimic) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/ironmimic.png" height="96" width="96">`);
				this.effectState.ironmimic = true;
				break;
			case 'Iron Dirge':
				if (this.effectState.irondirge) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/irondirge.png" height="96" width="96">`);
				this.effectState.irondirge = true;
				break;
			case 'Iron Tornado':
				if (this.effectState.irontornado) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/irontornado.png" height="96" width="96">`);
				this.effectState.irontornado = true;
				break;
			case 'Deliraidon':
				if (this.effectState.deliraidon) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/deliraidon.png" height="96" width="96">`);
				this.effectState.deliraidon = true;
				break;
			case 'Stargrowth':
				if (this.effectState.stargrowth) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/stargrowth.png" height="96" width="96">`);
				this.effectState.stargrowth = true;
				break;
			case 'Floatzera':
				if (this.effectState.floatzera) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/floatzera.png" height="96" width="96">`);
				this.effectState.floatzera = true;
				break;
			case 'Crygargonal':
				if (this.effectState.crygargonal) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/crygargonal.png" height="96" width="96">`);
				this.effectState.crygargonal = true;
				break;
			case 'Wopple':
				if (this.effectState.wopple) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/wopple.png" height="96" width="96">`);
				this.effectState.wopple = true;
				break;
			case 'Amphamence':
				if (this.effectState.amphamence) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/amphamence.png" height="96" width="96">`);
				this.effectState.amphamence = true;
				break;
			case 'Iron Legion':
				if (this.effectState.ironlegion) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/ironlegion.png" height="96" width="96">`);
				this.effectState.ironlegion = true;
				break;
			case 'Celedos':
				if (this.effectState.celedos) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/celedos.png" height="96" width="96">`);
				this.effectState.celedos = true;
				break;
			case 'Primeleo':
				if (this.effectState.primeleo) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/primeleo.png" height="96" width="96">`);
				this.effectState.primeleo = true;
				break;
			case 'Bellikiss':
				if (this.effectState.bellikiss) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/bellikiss.png" height="96" width="96">`);
				this.effectState.bellikiss = true;
				break;
			case 'Samuraiai-Hisui':
				if (this.effectState.samuraiai) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/samuraiaihisui.png" height="96" width="96">`);
				this.effectState.samuraiai = true;
				break;
			case 'Florgerouge':
				if (this.effectState.florgerouge) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/florgerouge.png" height="96" width="96">`);
				this.effectState.florgerouge = true;
				break;
			case 'Urshiluxe-Rapid-Strike':
				if (this.effectState.urshiluxe) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/urshiluxerapidstrike.png" height="96" width="96">`);
				this.effectState.urshiluxe = true;
				break;
			case 'Tinkovish':
				if (this.effectState.tinkovish) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/tinkovish.png" height="96" width="96">`);
				this.effectState.tinkovish = true;
				break;
			case 'Goopert-Hisui':
				if (this.effectState.goopert) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/gooperthisui.png" height="96" width="96">`);
				this.effectState.goopert = true;
				break;
			case 'Baxgeist-Large':
				if (this.effectState.baxgeist) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/baxgeistlarge.png" height="96" width="96">`);
				this.effectState.baxgeist = true;
				break;
			case 'Cresserace':
				if (this.effectState.cresserace) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/cresserace.png" height="96" width="96">`);
				this.effectState.cresserace = true;
				break;
			case 'Tapu Titan':
				if (this.effectState.taputitan) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/taputitan.png" height="96" width="96">`);
				this.effectState.taputitan = true;
				break;
			case 'Necrotrik-Dawn-Wings':
				if (this.effectState.necrotrikdawnwings) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/necrotrikdawnwings.png" height="96" width="96">`);
				this.effectState.necrotrikdawnwings = true;
				break;
			case 'Druddizor':
				if (this.effectState.druddizor) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/druddizor.png" height="96" width="96">`);
				this.effectState.druddizor = true;
				break;
			case 'Great Kleav':
				if (this.effectState.greatkleav) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/greatkleav.png" height="96" width="96">`);
				this.effectState.greatkleav = true;
				break;
			case 'Scream Cormorant':
				if (this.effectState.screamcormorant) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/screamcormorant.png" height="96" width="96">`);
				this.effectState.screamcormorant = true;
				break;
			case 'Yu-Clod':
				if (this.effectState.yuclod) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/yuclod.png" height="96" width="96">`);
				this.effectState.yuclod = true;
				break;
			case 'Mawlakazam':
				if (this.effectState.mawlakazam) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/mawlakazam.png" height="96" width="96">`);
				this.effectState.mawlakazam = true;
				break;
			case 'Bouffa-Lu':
				if (this.effectState.bouffalu) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/bouffalu.png" height="96" width="96">`);
				this.effectState.bouffalu = true;
				break;
			case 'Vikadrago':
				if (this.effectState.vikadrago) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/vikadrago.png" height="96" width="96">`);
				this.effectState.vikadrago = true;
				break;
			case 'Icekrai':
				if (this.effectState.icekrai) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/icekrai.png" height="96" width="96">`);
				this.effectState.icekrai = true;
				break;
			case 'Weezaluna-Bloodmoon':
				if (this.effectState.weezaluna) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/weezalunabloodmoon.png" height="96" width="96">`);
				this.effectState.weezaluna = true;
				break;
			case 'Amigotrio-Alola':
				if (this.effectState.amigotrio) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/amigotrioalola.png" height="96" width="96">`);
				this.effectState.amigotrio = true;
				break;
			case 'Iron Matcha':
				if (this.effectState.ironmatcha) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/ironmatcha.png" height="96" width="96">`);
				this.effectState.ironmatcha = true;
				break;
			case 'Aero Wake':
				if (this.effectState.aerowake) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/aerowake.png" height="96" width="96">`);
				this.effectState.aerowake = true;
				break;
			case 'Anoraidon':
				if (this.effectState.anoraidon) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/anoraidon.png" height="96" width="96">`);
				this.effectState.anoraidon = true;
				break;
			case 'Deoxyslash-Speed':
				if (this.effectState.deoxyslashspeed) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/deoxyslashspeed.png" height="96" width="96">`);
				this.effectState.deoxyslashspeed = true;
				break;
			case 'Lelecuno-Galar':
				if (this.effectState.lelecuno) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/lelecunogalar.png" height="96" width="96">`);
				this.effectState.lelecuno = true;
				break;
			case 'Guguzzparce':
				if (this.effectState.guguzzparce) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/guguzzparce.png" height="96" width="96">`);
				this.effectState.guguzzparce = true;
				break;
			case 'Golisoros-Paldea-Blaze':
				if (this.effectState.golisoros) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/golisorospaldeablaze.png" height="96" width="96">`);
				this.effectState.golisoros = true;
				break;
			case 'Aggram':
				if (this.effectState.aggram) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/aggram.png" height="96" width="96">`);
				this.effectState.aggram = true;
				break;
			case 'Tyranix':
				if (this.effectState.tyranix) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/tyranix.png" height="96" width="96">`);
				this.effectState.tyranix = true;
				break;
			case 'Conkelbun':
				if (this.effectState.conkelbun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/conkelbun.png" height="96" width="96">`);
				this.effectState.conkelbun = true;
				break;
			case 'Chomptry':
				if (this.effectState.chomptry) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/chomptry.png" height="96" width="96">`);
				this.effectState.chomptry = true;
				break;
			case 'Overgyara':
				if (this.effectState.overgyara) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/overgyara.png" height="96" width="96">`);
				this.effectState.overgyara = true;
				break;
			case 'Sneasel-Prime':
				if (this.effectState.sneaselprime) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/sneaselprime.png" height="96" width="96">`);
				this.effectState.sneaselprime = true;
				break;
			case 'Brambleshao':
				if (this.effectState.brambleshao) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/brambleshao.png" height="96" width="96">`);
				this.effectState.brambleshao = true;
				break;
			case 'Eisephalon':
				if (this.effectState.eisephalon) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/eisephalon.png" height="96" width="96">`);
				this.effectState.eisephalon = true;
				break;
			case 'Frosgambit':
				if (this.effectState.frosgambit) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/frosgambit.png" height="96" width="96">`);
				this.effectState.frosgambit = true;
				break;
			case 'Kabupult':
				if (this.effectState.kabupult) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/kabupult.png" height="96" width="96">`);
				this.effectState.kabupult = true;
				break;
			case 'Magnegiri':
				if (this.effectState.magnegiri) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/magnegiri.png" height="96" width="96">`);
				this.effectState.magnegiri = true;
				break;
			case 'Celeblim':
				if (this.effectState.celeblim) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/celeblim.png" height="96" width="96">`);
				this.effectState.celeblim = true;
				break;
			case 'Tentazor':
				if (this.effectState.tentazor) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/tentazor.png" height="96" width="96">`);
				this.effectState.tentazor = true;
				break;
			case 'Golegon-Alola':
				if (this.effectState.golegon) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/golegonalola.png" height="96" width="96">`);
				this.effectState.golegon = true;
				break;
			case 'Maractorus-Therian':
				if (this.effectState.maractorus) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/maractorustherian.png" height="96" width="96">`);
				this.effectState.maractorus = true;
				break;
			case 'Necroqueen':
				if (this.effectState.necroqueen) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/necroqueen.png" height="96" width="96">`);
				this.effectState.necroqueen = true;
				break;
			case 'Mr. Heat':
				if (this.effectState.mrheat) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/mrheat.png" height="96" width="96">`);
				this.effectState.mrheat = true;
				break;
			case 'Aerodirge':
				if (this.effectState.aerodirge) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/aerodirge.png" height="96" width="96">`);
				this.effectState.aerodirge = true;
				break;
			case 'Hydra-Pao':
				if (this.effectState.hydrapao) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/hydrapao.png" height="96" width="96">`);
				this.effectState.hydrapao = true;
				break;
			case 'Sir Bundle':
				if (this.effectState.sirbundle) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/sirbundle.png" height="96" width="96">`);
				this.effectState.sirbundle = true;
				break;
			case 'Buzzscor':
				if (this.effectState.buzzscor) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/buzzscor.png" height="96" width="96">`);
				this.effectState.buzzscor = true;
				break;
			case 'Hattepon':
				if (this.effectState.hattepon) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/hattepon.png" height="96" width="96">`);
				this.effectState.hattepon = true;
				break;
			case 'Hattepon-Hearthflame':
				if (this.effectState.hatteponh) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/hatteponhearthflame.png" height="96" width="96">`);
				this.effectState.hatteponh = true;
				break;
			case 'Hattepon-Wellspring':
				if (this.effectState.hatteponw) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/hatteponwellspring.png" height="96" width="96">`);
				this.effectState.hatteponw = true;
				break;
			case 'Hattepon-Cornerstone':
				if (this.effectState.hatteponc) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/hatteponcornerstone.png" height="96" width="96">`);
				this.effectState.hatteponc = true;
				break;
			case 'Kilommo-o-Totem':
				if (this.effectState.kilommoo) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/kilommoototem.png" height="96" width="96">`);
				this.effectState.kilommoo = true;
				break;
			case 'Lunarunt':
				if (this.effectState.lunarunt) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/lunarunt.png" height="96" width="96">`);
				this.effectState.lunarunt = true;
				break;
			case 'Zoroshark-Hisui':
				if (this.effectState.zoroshark) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/zorosharkhisui.png" height="96" width="96">`);
				this.effectState.zoroshark = true;
				break;
			case 'Bombirdus':
				if (this.effectState.bombirdus) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/bombirdus.png" height="96" width="96">`);
				this.effectState.bombirdus = true;
				break;
			case 'Scoliraptor':
				if (this.effectState.scoliraptor) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/scoliraptor.png" height="96" width="96">`);
				this.effectState.scoliraptor = true;
				break;
			case 'Zarubok':
				if (this.effectState.zarubok) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/zarubok.png" height="96" width="96">`);
				this.effectState.zarubok = true;
				break;
			case 'Iron Pins':
				if (this.effectState.ironpins) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/ironpins.png" height="96" width="96">`);
				this.effectState.ironpins = true;
				break;
			case 'Bronze Bonnet':
				if (this.effectState.bronzebonnet) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/bronzebonnet.png" height="96" width="96">`);
				this.effectState.bronzebonnet = true;
				break;
			case 'Zoinkazenta':
				if (this.effectState.zoinkazenta) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/zoinkazenta.png" height="96" width="96">`);
				this.effectState.zoinkazenta = true;
				break;
			case 'Decidulax':
				if (this.effectState.decidulax) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/decidulax.png" height="96" width="96">`);
				this.effectState.decidulax = true;
				break;
			case 'Okiferro':
				if (this.effectState.okiferro) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/okiferro.png" height="96" width="96">`);
				this.effectState.okiferro = true;
				break;
			case 'Dragocoal':
				if (this.effectState.dragocoal) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/dragocoal.png" height="96" width="96">`);
				this.effectState.dragocoal = true;
				break;
			case 'Empoliary-Hisui':
				if (this.effectState.empoliaryhisui) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/empoliaryhisui.png" height="96" width="96">`);
				this.effectState.empoliaryhisui = true;
				break;
			case 'Farinape':
				if (this.effectState.farinape) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/farinape.png" height="96" width="96">`);
				this.effectState.farinape = true;
				break;
			case 'Wo-Rupt':
				if (this.effectState.worupt) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/worupt.png" height="96" width="96">`);
				this.effectState.worupt = true;
				break;
			case 'Aromalge':
				if (this.effectState.aromalge) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/aromalge.png" height="96" width="96">`);
				this.effectState.aromalge = true;
				break;
			case 'Crawnacl':
				if (this.effectState.crawnacl) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/crawnacl.png" height="96" width="96">`);
				this.effectState.crawnacl = true;
				break;
			case 'Corvizolt':
				if (this.effectState.corvizolt) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/corvizolt.png" height="96" width="96">`);
				this.effectState.corvizolt = true;
				break;
			case 'Tapu Sala':
				if (this.effectState.tapusala) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/tapusala.png" height="96" width="96">`);
				this.effectState.tapusala = true;
				break;
			case 'Jirabsca':
				if (this.effectState.jirabsca) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/jirabsca.png" height="96" width="96">`);
				this.effectState.jirabsca = true;
				break;
			case 'Donphurott-Hisui':
				if (this.effectState.donphurott) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/donphurotthisui.png" height="96" width="96">`);
				this.effectState.donphurott = true;
				break;
			case 'Regithorn':
				if (this.effectState.regithorn) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/regithorn.png" height="96" width="96">`);
				this.effectState.regithorn = true;
				break;
			case 'Lanpass':
				if (this.effectState.lanpass) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/lanpass.png" height="96" width="96">`);
				this.effectState.lanpass = true;
				break;
			case 'Swoltres':
				if (this.effectState.swoltres) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/swoltres.png" height="96" width="96">`);
				this.effectState.swoltres = true;
				break;
			case 'Appleking-Galar':
				if (this.effectState.applekinggalar) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/applekinggalar.png" height="96" width="96">`);
				this.effectState.applekinggalar = true;
				break;
			case 'Orthaconda':
				if (this.effectState.orthaconda) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/orthaconda.png" height="96" width="96">`);
				this.effectState.orthaconda = true;
				break;
			case 'Giracham-Origin':
				if (this.effectState.girachamorigin) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/girachamorigin.png" height="96" width="96">`);
				this.effectState.girachamorigin = true;
				break;
			case 'Eldetini':
				if (this.effectState.eldetini) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/eldetini.png" height="96" width="96">`);
				this.effectState.eldetini = true;
				break;
			case 'Tinkophlosion-Hisui':
				if (this.effectState.tinkophlosionhisui) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/tinkophlosionhisui.png" height="96" width="96">`);
				this.effectState.tinkophlosionhisui = true;
				break;
			case 'Glimmocruel':
				if (this.effectState.glimmocruel) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/glimmocruel.png" height="96" width="96">`);
				this.effectState.glimmocruel = true;
				break;
			case 'Diafetch\'d':
				if (this.effectState.diafetchd) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/diafetchd.png" height="96" width="96">`);
				this.effectState.diafetchd = true;
				break;
			case 'Rhytrix':
				if (this.effectState.rhytrix) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/rhytrix.png" height="96" width="96">`);
				this.effectState.rhytrix = true;
				break;
			case 'Fishkarp-Hisui':
				if (this.effectState.fishkarp) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/gen9fe/sprites/front/fishkarphisui.png" height="96" width="96">`);
				this.effectState.fishkarp = true;
				break;
			}
		},
	},
};
