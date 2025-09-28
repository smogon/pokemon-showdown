export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	spriteviewer: {
		effectType: 'ValidatorRule',
		name: 'Sprite Viewer',
		desc: "Displays a fakemon's sprite in chat when it is switched in for the first time",
		onBegin() {
			this.add('rule', 'Sprite Viewer: Displays sprites in chat');
		},
		onSwitchIn(pokemon) {
			switch (pokemon.species.name) {
			case 'Arachnode':
				if (this.effectState.arachnode) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://github.com/scoopapa/DH2/blob/main/data/mods/blankcanvas/sprites/front/arachnode.png" height="96" width="96">`);
				this.effectState.arachnode = true;
				break;
			case 'Arsenstorm':
				if (this.effectState.arsenstorm) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/arsenstorm.png" height="96" width="96">`);
				this.effectState.arsenstorm = true;
				break;
			case 'Badjur':
				if (this.effectState.badjur) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/badjur.png" height="96" width="96">`);
				this.effectState.badjur = true;
				break;
			case 'Blobbiam':
				if (this.effectState.blobbiam) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/blobbiam.png" height="96" width="96">`);
				this.effectState.blobbiam = true;
				break;
			case 'Brasspecter':
				if (this.effectState.brasspecter) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/brasspecter.png" height="96" width="96">`);
				this.effectState.brasspecter = true;
				break;
			case 'Bugswarm':
				if (this.effectState.bugswarm) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/bugswarm.png" height="96" width="96">`);
				this.effectState.bugswarm = true;
				break;
			case 'Bulionage':
				if (this.effectState.bulionage) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/bulionage.png" height="96" width="96">`);
				this.effectState.bulionage = true;
				break;
			case 'Capricorrie':
				if (this.effectState.capricorrie) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/capricorrie.png" height="96" width="96">`);
				this.effectState.capricorrie = true;
				break;
			case 'Copperhead':
				if (this.effectState.copperhead) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/copperhead.png" height="96" width="96">`);
				this.effectState.copperhead = true;
				break;
			case 'Craggon':
				if (this.effectState.craggon) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/craggon.png" height="96" width="96">`);
				this.effectState.craggon = true;
				break;
			case 'Crystuit':
				if (this.effectState.crystuit) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/crystuit.png" height="96" width="96">`);
				this.effectState.crystuit = true;
				break;
			case 'Drakkannon':
				if (this.effectState.drakkannon) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/drakkannon.png" height="96" width="96">`);
				this.effectState.drakkannon = true;
				break;
			case 'Iron Crest':
				if (this.effectState.ironcrest) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/ironcrest.png" height="96" width="96">`);
				this.effectState.ironcrest = true;
				break;
			case 'Eolikopter':
				if (this.effectState.eolikopter) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/eolikopter.png" height="96" width="96">`);
				this.effectState.eolikopter = true;
				break;
			case 'Faeruin':
				if (this.effectState.faeruin) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/faeruin.png" height="96" width="96">`);
				this.effectState.faeruin = true;
				break;
			case 'Fettogre':
				if (this.effectState.fettogre) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/fettogre.png" height="96" width="96">`);
				this.effectState.fettogre = true;
				break;
			case 'Flarenheit':
				if (this.effectState.flarenheit) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/flarenheit.png" height="96" width="96">`);
				this.effectState.flarenheit = true;
				break;
			case 'Florustitia':
				if (this.effectState.florustitia) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/florustitia.png" height="96" width="96">`);
				this.effectState.florustitia = true;
				break;
			case 'Freightmare':
				if (this.effectState.freightmare) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/freightmare.png" height="96" width="96">`);
				this.effectState.freightmare = true;
				break;
			case 'Frostengu':
				if (this.effectState.frostengu) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/frostengu.png" height="96" width="96">`);
				this.effectState.frostengu = true;
				break;
			case 'Goblantern':
				if (this.effectState.goblantern) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/goblantern.png" height="96" width="96">`);
				this.effectState.goblantern = true;
				break;
			case 'Hippaint':
				if (this.effectState.hippaint) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/hippaint.png" height="96" width="96">`);
				this.effectState.hippaint = true;
				break;
			case 'Jack-o-swarm':
				if (this.effectState.jackoswarm) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/jackoswarm.png" height="96" width="96">`);
				this.effectState.jackoswarm = true;
				break;
			case 'Jokerpent':
				if (this.effectState.jokerpent) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/jokerpent.png" height="96" width="96">`);
				this.effectState.jokerpent = true;
				break;
			case 'Kadraoke':
				if (this.effectState.kadraoke) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/kadraoke.png" height="96" width="96">`);
				this.effectState.kadraoke = true;
				break;
			case 'Karmalice':
				if (this.effectState.karmalice) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/karmalice.png" height="96" width="96">`);
				this.effectState.karmalice = true;
				break;
			case 'Lavalisk':
				if (this.effectState.lavalisk) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/lavalisk.png" height="96" width="96">`);
				this.effectState.lavalisk = true;
				break;
			case 'Llanfairwyrm':
				if (this.effectState.llanfairwyrm) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/llanfairwyrm.png" height="96" width="96">`);
				this.effectState.llanfairwyrm = true;
				break;
			case 'Martorse':
				if (this.effectState.martorse) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/martorse.png" height="96" width="96">`);
				this.effectState.martorse = true;
				break;
			case 'Massassin':
				if (this.effectState.massassin) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/massassin.png" height="96" width="96">`);
				this.effectState.massassin = true;
				break;
			case 'Mohawtter':
				if (this.effectState.mohawtter) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/mohawtter.png" height="96" width="96">`);
				this.effectState.mohawtter = true;
				break;
			case 'Mon Mothra':
				if (this.effectState.monmothra) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/monmothra.png" height="96" width="96">`);
				this.effectState.monmothra = true;
				break;
			case 'Parasike':
				if (this.effectState.parasike) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/parasike.png" height="96" width="96">`);
				this.effectState.parasike = true;
				break;
			case 'Pinaturbo':
				if (this.effectState.pinaturbo) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/pinaturbo.png" height="96" width="96">`);
				this.effectState.pinaturbo = true;
				break;
			case 'Piss':
				if (this.effectState.piss) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/piss.png" height="96" width="96">`);
				this.effectState.piss = true;
				break;
			case 'Primordialith':
				if (this.effectState.primordialith) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/primordialith.png" height="96" width="96">`);
				this.effectState.primordialith = true;
				break;
			case 'Sascratch':
				if (this.effectState.sascratch) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/sascratch.png" height="96" width="96">`);
				this.effectState.sascratch = true;
				break;
			case 'Reversadusa':
				if (this.effectState.reversadusa) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/reversadusa.png" height="96" width="96">`);
				this.effectState.reversadusa = true;
				break;
			case 'Searytch':
				if (this.effectState.searytch) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/searytch.png" height="96" width="96">`);
				this.effectState.searytch = true;
				break;
			case 'Sculptera':
				if (this.effectState.sculptera) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/sculptera.png" height="96" width="96">`);
				this.effectState.sculptera = true;
				break;
			case 'Sleet Shell':
				if (this.effectState.sleetshell) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/sleetshell.png" height="96" width="96">`);
				this.effectState.sleetshell = true;
				break;
			case 'Snabterra':
				if (this.effectState.snabterra) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/snabterra.png" height="96" width="96">`);
				this.effectState.snabterra = true;
				break;
			case 'Socknbusk\u2019n':
				if (this.effectState.socknbuskn) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/socknbuskn.png" height="96" width="96">`);
				this.effectState.socknbuskn = true;
				break;
			case 'Thaumaton':
				if (this.effectState.thaumaton) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/thaumaton.png" height="96" width="96">`);
				this.effectState.thaumaton = true;
				break;
			case 'Versalyre':
				if (this.effectState.versalyre) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/versalyre.png" height="96" width="96">`);
				this.effectState.versalyre = true;
				break;
			case 'Vipult':
				if (this.effectState.vipult) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/vipult.png" height="96" width="96">`);
				this.effectState.vipult = true;
				break;
			case 'Wizhazard':
				if (this.effectState.wizhazard) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/wizhazard.png" height="96" width="96">`);
				this.effectState.wizhazard = true;
				break;
			case 'Yamateraph':
				if (this.effectState.yamateraph) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/yamateraph.png" height="96" width="96">`);
				this.effectState.yamateraph = true;
				break;
			}
		},
	},
};
