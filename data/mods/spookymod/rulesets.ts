export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	spokymod: {
		effectType: 'Rule',
		name: 'Spokymod',
		desc: 'spookymod jumpscare',
		onBegin() {
			const intro = [
				"Welcome mortals to my Magic Kingdom!...which is unaffiliated with any other Magic Kingdom that may or may not exist.",
				"Step right up and get your spells from me! For I am the Spell Master!...again, not a term Merasmus officially owns.",
				"Greetings mortals and こんにちは! Yes Merasmus is learning Japanese, in the likely event he will have to beg for his life!",
				"Why? Well, therein lies a tale of horror! Short version: Merasmus owes $12,000 to the Japanese Mafia!",
				"It is Halloween! The time of year when the doorways between our world and the next swing wide!",
				// "That...and President's Day. That's still only two times! So you've got to pick your battles if you're Merasmus!",
				"A harvest moon hangs pendulously in the sky, mortals!",
				/* "That's right, */ "The moon's giving us the green light for harvesting! Apropos of nothing,",
				"I hope you all brought your souls! (laughter) And money. Because Merasmus has sunk a lot into this metagame.",
				"It is I, mortals, Merasmus the wizard! Welcome to my dark carnival of the macabre! Admit One...to MADNESS!",
				"(laughter) Step right up and test your measly minds on my Metagame of the Danged!",
			];
			this.add('-message', `${this.sample(intro)}`);
		},

		onResidual(pokemon) {
			// make sure it only rolls once
			let temp = false;
			for (const p of this.sides[0].pokemon) {
				if (p.isActive && p === pokemon) temp = true;
			}
			if (!temp) return;
			const spinSet = [
				"The wheel spins!",
				"The wheel spins!",
				"I spin the Wheel of Fate!",
				"The Wheel of Fate spins!",
				"You cannot escape the Wheel of Fate!",
				"Spin, wheel! Spin!",
				"Spin the wheel, and seal your fate!",
				"Yes, spin the wheel, you fools. See what horrors are in store for you.",
				"Prepare to feel the wrath of the Wheel of Fate!",
				"Yes, spin the Wheel of Fate!",
				"Your fate... is at hand!",
				"The Wheel of Fate is a fickle mistress.",
				"The wheel spins!",
				"(laughter) Your fate is at hand.",
				"The wheel will be your undoing.",
				"Yes... Yes! The wheel!",
				"Yes... Yes! Fate!",
				"The wheel! Come on wheel, Merasmus needs this.",
				"The wheel! Come on wheel, you owe me.",
				"The wheel! Come on... Set them all on fire.",
				"The wheel! Come on... Big. Head. Come on, big head.",
			];
			const bighead = [
				"Big heads!",
				"(laughter) Big head fate! Big head fate!",
				"I curse your heads... with bigness!",
				"You cannot escape the terror... of your own giant head!",
				"Super big heads!",
				"Plague of head-biggening!",
				"Big heads! The horror! The horror!",
			];
			const smallhead = [
				"Shrunken heads!",
				"Tiny heads!",
				"Teeny, tiny heads! As foretold in prophecy.",
				"Feel the tiny eldritch terror of an itty... bitty... head!",
				"Like your tiny heads? THANK MAGIC!",
				"Teeny, tiny heads!",
			];
			const superspeed = ["Super Speed!"];
			const dance = [
				"Dance fools!",
				"Darkness falls across the land! The dancing hour is close at hand!",
				"And though you fight to stay alive, your body starts to spasmus. For no mere mortal can resist the magic of Merasmus!",
				"Dance. Dance! DANCE!",
				"Plague of dancing!",
			];
			const bleed = [
				"The bloodening!",
				"Blood-letting!",
				"Let the blood flow!",
				"Blood fate!",
				"Plague of blood!",
			];
			const fire = [
				"Firestorm!",
				"Fire!",
				"Fire, yes! Now you're all on fire!",
				"Fire! Oh, that's a good one!",
				"Burn fools, burn!",
				"BURN!",
				"Burn fools!",
				"Hellfire!",
			];
			const jarate = [
				"Jarate!",
				"Jarate! No magic is beneath Merasmus!",
				"Jarate! That is what you think it is!",
				"Rain of waste!",
				"Jarate! Merasmus is...sorry about this one.",
				"Jarate! Merasmus is...not proud...of this one.",
				"Rain of Jarate!",
				"Rain of Jarate! *sotto voce* I'm sorry about this.",
				"Jarate!",
				"Jarate! Jarate for everyone!",
				"Jarate for everyone! I'm so, so sorry!",
			];
			const ghosts = [
				"Ghosts!",
				"Let the haunting... begin!",
				"Rise, rise from your graves!",
				"Plague of ghosts!",
			];
			const lowgravity = [
				"Low gravity!",
				"Gravity displeases me, so I have removed it!",
				"Gravity displeases me, so I have removed it! ...Most of it!",
				"Gravity! I banish thee!",
				"Bid farewell to your precious gravity!",
			];
			const superjump = ["Super jumping!", "High jump!"];
			const crithit = ["It is the crit boostening!"];
			const ubercharge = [
				"You are GODS! *sotto voce* ...I don't know why I put that on the wheel...",
				"You are GODS! Magic! It is not an exact science.",
				"Invincible! INVINCIBL- Wait, wait, what?",
				"Everybody's invincible! Muhahahaha! Fools! Ahahaha... eheh... Hold on...",
				"You are GODS! Nahahaha... Enjoy your false confidence. It will be your doom!",
				"You are GODS! Aha, that may seem good, but it will be bad. In the fullness of time.",
				"You are GODS! I... meant to do that. It will go badly for you. You watch.",
				"You are GODS! Wait, no no no no no!",
				"ÜBERCHARGE!",
			];
			if (this.turn % 3 !== 0) return;
			this.add('-message', `${this.sample(spinSet)}`);
			const result = this.random(9);
			// result = 0;
			switch (result) {
			case 0:
				this.add('-message', `${this.sample(bighead)}`);
				for (const pokemons of this.getAllActive()) {
					pokemons.removeVolatile('shrunken');
					pokemons.addVolatile('fakedynamax', pokemons);
				}
				break;
			case 1:
				this.add('-message', `${this.sample(smallhead)}`);
				for (const pokemons of this.getAllActive()) {
					pokemons.removeVolatile('fakedynamax');
					pokemons.addVolatile('shrunken', pokemons);
				}
				break;
			case 2:
				this.add('-message', `${this.sample(superspeed)}`);
				for (const pokemons of this.getAllActive()) {
					this.boost({ spe: 2 }, pokemons, pokemons, null, true);
				}
				break;
			case 3:
				this.add('-message', `${this.sample(dance)}`);
				for (const pokemons of this.getAllActive()) {
					this.add('-anim', pokemons, "Teeter Dance", pokemons);
					this.add('-anim', pokemons, "Revelation Dance", pokemons);
					this.add('-anim', pokemons, "Quiver Dance", pokemons);
					this.add('-anim', pokemons, "Victory Dance", pokemons);
					this.add('-anim', pokemons, "Dragon Dance", pokemons);
					this.add('-anim', pokemons, "Swords Dance", pokemons);
					this.add('-anim', pokemons, "Petal Dance", pokemons);
					this.add('-anim', pokemons, "Lunar Dance", pokemons);
					this.add('-anim', pokemons, "Feather Dance", pokemons);
					this.add('-anim', pokemons, "Rain Dance", pokemons);
				}
				break;
			case 4:
				const temps = this.random(4);
				// const temps = 3;
				switch (temps) {
				case 0:
					this.add('-message', `${this.sample(bleed)}`);
					for (const pokemons of this.getAllActive()) {
						pokemons.trySetStatus('psn', pokemons);
					}
					break;
				case 1:
					this.add('-message', `${this.sample(fire)}`);
					for (const pokemons of this.getAllActive()) {
						pokemons.trySetStatus('brn', pokemons);
					}
					break;
				case 2:
					this.add('-message', `${this.sample(jarate)}`);
					for (const pokemons of this.getAllActive()) {
						pokemons.addVolatile('jarate', pokemons);
						this.hint('pokemons covered in Jarate take 1.35x damage from opponent\'s attacks.');
					}
					break;
				case 3:
					this.add('-message', `${this.sample(ghosts)}`);
					for (const pokemons of this.getAllActive()) {
						pokemons.addVolatile('jumpscare', pokemons);
					}
					break;
				}
				break;
			case 5:
				this.add('-message', `${this.sample(lowgravity)}`);
				for (const pokemons of this.getAllActive()) {
					pokemons.addVolatile('telekinesis', pokemons);
				}
				break;
			case 6:
				this.add('-message', `${this.sample(superjump)}`);
				this.field.setWeather('superjump');
				break;
			case 7:
				this.add('-message', `${this.sample(crithit)}`);
				for (const pokemons of this.getAllActive()) {
					pokemons.addVolatile('laserfocus', pokemons);
				}
				break;
			default:
				this.add('-message', `${this.sample(ubercharge)}`);
				for (const pokemons of this.getAllActive()) {
					pokemons.addVolatile('ubercharge', pokemons);
				}
				this.hint('Ubercharged Pokemon take no damage from attacks.');
			}
		},
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if ((attacker.hasType('Retaw') && move.type === 'Water') ||
				(attacker.hasType('Critcele') && move.type === 'Electric') ||
				(attacker.hasType('Pdark') && move.type === 'Dark') ||
				(attacker.hasType('Prock') && move.type === 'Rock') ||
				(attacker.hasType('ark') && move.type === 'Dark')) {
				return this.chainModify(1.5);
			}
		},
	},
	spriteviewer: {
		effectType: 'ValidatorRule',
		name: 'Sprite Viewer',
		desc: "Displays a fakemon's sprite in chat when it is switched in for the first time",
		onBegin() {
			this.add('rule', 'Sprite Viewer: Displays sprites in chat');
		},
		onSwitchIn(pokemon) {
			if (!this.effectState[pokemon.species.id]) {
				this.add('-message', `${pokemon.species.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/spookymod/sprites/front/${pokemon.species.id}.png" height="96" width="96">`);
				this.effectState[pokemon.species.id] = true;
			}
		},
	},
};
