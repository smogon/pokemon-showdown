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
			// all of the guns that are real firearms are commented out for now since i'm not sure if those should be displayed
			/* case '57rock':
				if (this.effectState.fiftysevenrock) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/57rock.png" height="96" width="96">`);
				this.effectState.fiftysevenrock = true;
				break; */
			case '8ball':
				if (this.effectState.eightball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/8ball.png" height="96" width="96">`);
				this.effectState.eightball = true;
				break;
			/* case 'Airgun':
				if (this.effectState.airgun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/airgun.png" height="96" width="96">`);
				this.effectState.Airgun = true;
				break; */
			case 'Basketball':
				if (this.effectState.basketball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/basketball.png" height="96" width="96">`);
				this.effectState.basketball = true;
				break;
			case 'Blowgun':
				if (this.effectState.blowgun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/blowgun.png" height="96" width="96">`);
				this.effectState.blowgun = true;
				break;
			case 'Cabbage':
				if (this.effectState.cabbage) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/cabbage.png" height="96" width="96">`);
				this.effectState.cabbage = true;
				break;
			case 'Cricketball':
				if (this.effectState.cricketball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/cricketball.png" height="96" width="96">`);
				this.effectState.cricketball = true;
				break;
			case 'Crossbow':
				if (this.effectState.crossbow) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/crossbow.png" height="96" width="96">`);
				this.effectState.crossbow = true;
				break;
			case 'Crystalball':
				if (this.effectState.crystalball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/crystalball.png" height="96" width="96">`);
				this.effectState.crystalball = true;
				break;
			case 'Discoball':
				if (this.effectState.discoball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/discoball.png" height="96" width="96">`);
				this.effectState.discoball = true;
				break;
			/* case 'Dracogun':
				if (this.effectState.dracogun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/dracogun.png" height="96" width="96">`);
				this.effectState.dracogun = true;
				break; */
			case 'Dragonball':
				if (this.effectState.dragonball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/dragonball.png" height="96" width="96">`);
				this.effectState.dragonball = true;
				break;
			/* case 'Flamethrower':
				if (this.effectState.flamethrower) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/flamethrower.png" height="96" width="96">`);
				this.effectState.flamethrower = true;
				break; */
			case 'Football':
				if (this.effectState.football) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/football.png" height="96" width="96">`);
				this.effectState.football = true;
				break;
			/* case 'Grenade Launcher':
				if (this.effectState.grenade) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/grenadelauncher.png" height="96" width="96">`);
				this.effectState.grenade = true;
				break; */
			case 'Gumball':
				if (this.effectState.gumball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/gumball.png" height="96" width="96">`);
				this.effectState.gumball = true;
				break;
			/* case 'Handgun':
				if (this.effectState.handgun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/handgun.png" height="96" width="96">`);
				this.effectState.handgun = true;
				break; */
			case 'Lasergun':
				if (this.effectState.lasergun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/lasergun.png" height="96" width="96">`);
				this.effectState.lasergun = true;
				break;
			case 'Nailgun':
				if (this.effectState.nailgun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/nailgun.png" height="96" width="96">`);
				this.effectState.nailgun = true;
				break;
			case 'Plasmaball':
				if (this.effectState.plasmaball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/plasmaball.png" height="96" width="96">`);
				this.effectState.plasmaball = true;
				break;
			case 'Proton Pack':
				if (this.effectState.ghostbusters) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/protonpack.png" height="96" width="96">`);
				this.effectState.ghostbusters = true;
				break;
			/* case 'Railgun':
				if (this.effectState.railgun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/railgun.png" height="96" width="96">`);
				this.effectState.railgun = true;
				break; */
			case 'Rock':
				if (this.effectState.rock) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/rock.png" height="96" width="96">`);
				this.effectState.rock = true;
				break;
			/* case 'Scorpiongun':
				if (this.effectState.scorpiongun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/scorpiongun.png" height="96" width="96">`);
				this.effectState.scorpiongun = true;
				break;
			case 'Shotgun':
				if (this.effectState.shotgun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/shotgun.png" height="96" width="96">`);
				this.effectState.shotgun = true;
				break; */
			case 'Snowball':
				if (this.effectState.snowball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/snowball.png" height="96" width="96">`);
				this.effectState.snowball = true;
				break;
			case 'Soccerball':
				if (this.effectState.associationfootball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/soccerball.png" height="96" width="96">`);
				this.effectState.associationfootball = true;
				break;
			case 'Tennisball':
				if (this.effectState.tennisball) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/tennisball.png" height="96" width="96">`);
				this.effectState.tennisball = true;
				break;
			case 'The Moon':
				if (this.effectState.themoon) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/themoon.png" height="96" width="96">`);
				this.effectState.themoon = true;
				break;
			/* case 'Tommygun':
				if (this.effectState.tommygun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/tommygun.png" height="96" width="96">`);
				this.effectState.tommygun = true;
				break; */
			case 'Toygun':
				if (this.effectState.toygun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/toygun.png" height="96" width="96">`);
				this.effectState.toygun = true;
				break;
			/* case 'Virus':
				if (this.effectState.virus) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/virus.png" height="96" width="96">`);
				this.effectState.virus = true;
				break; */
			case 'Watergun':
				if (this.effectState.watergun) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/watergun.png" height="96" width="96">`);
				this.effectState.watergun = true;
				break;
			case 'Watermelon':
				if (this.effectState.watermelon) return;
				this.add('-message', `${pokemon.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/balls/sprites/front/watermelon.png" height="96" width="96">`);
				this.effectState.watermelon = true;
				break;
			case 'Baseball':
				if (this.effectState.baseball) return;
				this.add('-message', `☝️ baseball this guy`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/iforgor/sprites/front/baseball.png" height="96" width="96">`);
				this.effectState.baseball = true;
				break;
			}
		},
	},
};
