'use strict';

/**@type {{[k: string]: ModdedEffectData}} */
let BattleStatuses = {
	static: { // No single quotes causes issues
		noCopy: true,
		onStart: function () {
			this.add(`c|Static|Static's the name, power's my game!`);
		},
		onSwitchOut: function () {
			this.add(`c|Static|What a switchout!`);
		},
		onFaint: function () {
			this.add(`c|Static|See ya!`);
		},
	},
	erika: { // No single quotes causes issues
		noCopy: true,
		onStart: function () {
			this.add(`c|Erika|I wanted to know who you are!`);
		},
		onSwitchOut: function () {
			this.add(`c|Erika|I'm just a little Eevee, sir or madam.`);
		},
		onFaint: function () {
			this.add(`c|Erika|I'm very serious that you've offended me.`);
		},
	},
	aqua: {
		noCopy: true,
		onStart: function (target, source) {
			this.add(`c|Aqua|Remember me, ladies and gentlemen?`);
		    this.add('-start', source, 'typechange', 'Water');
		},
		onSwitchOut: function () {
			this.add(`c|Aqua|I'll let my friend to take over me.`);
		},
		onFaint: function () {
			this.add(`c|Aqua|Have a nice day.`);
		},
	},
	mizzy: {
		noCopy: true,
		onStart: function (target, source) {
			this.add(`c|Mizzy|What's up, frosty flakes?`);
		    this.add('-start', source, 'typechange', 'Fairy/Psychic');
		},
		onSwitchOut: function () {
			this.add(`c|Mizzy|Never send Mizzy to that dimension again!`);
		},
		onFaint: function () {
			this.add(`c|Mizzy|I'll go to the Walmart store now. See ya!`);
		},
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0 && !target.illusion) {
				this.debug('Prism Armor neutralize');
				return this.chainModify(0.75);
     			this.add(`c|Mizzy|Nothing can stand my Prism Armor power though.`);
			}
		},
	},
	zena: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Zena|Did you call me out?`);
		},
		onSwitchOut: function () {
			this.add(`c|Zena|I'm made of 60 percent of cells!`);
		},
		onFaint: function (pokemon) {
			let activeMon = pokemon.side.foe.active[0].template.speciesid;
			if (activeMon === 'mew') {
				this.add(`c|Zena|You're going to miss me Aqua, cuz I QUIT!`);
			} else if (activeMon === 'pikachu') {
				this.add(`c|Zena|When I see that guy, I think of Static!`);
			} else {
				this.add(`c|Zena|Bye!`);
			}
		},
	},
	kyle: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Kyle|I'll show you!`);
		},
		onSwitchOut: function () {
			this.add(`c|Kyle|Too hard for me to stop!`);
		},
		onFaint: function () {
			this.add(`c|Kyle|We should play that again sometime!`);
		},
	},
	serenestar: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Serene Star|The world's famous admin of the Nasties is here!`);
		},
		onSwitchOut: function () {
			this.add(`c|Serene Star|I have to go to the bathroom.`);
		},
		onFaint: function () {
			this.add(`c|Serene Star|Not your average porn star.`);
		},
	},
	goby: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Goby|My underwear is made of bologna!`);
		},
		onSwitchOut: function () {
			this.add(`c|Goby|Time to go loco!`);
		},
		onFaint: function () {
			this.add(`c|Goby|I'm happy and I'm proud!`);
		},
	},
	thehound: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Mr. Burns|Smithers, release this hound!`);
			this.add(`c|Smithers|Yes, Mr. Burns.`);
		},
		onSwitchOut: function () {
			this.add(`c|The Hound|/me prepared to switch herself.`);
		},
		onFaint: function () {
			this.add(`c|The Hound|/me falls over.`);
		},
	},
	felix: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Felix|Felix the Meowth! The Wondeful Wonderful Meowth!`);
		},
		onSwitchOut: function () {
			this.add(`c|Felix|Come to think of it, I don't even know if I could get back there myself.`);
		},
		onFaint: function () {
			this.add(`c|Felix|Righty-O!`);
		},
	},
	chuck: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Chuck|I didn't do much fight in here anyway...`);
		},
		onSwitchOut: function () {
			this.add(`c|Chuck|I'll check out my pals.`);
		},
		onFaint: function () {
			this.add(`c|Chuck|How is this possible?`);
		},
	},
	abby: {
		noCopy: true,
		onStart: function (target, source) {
			this.add(`c|Abby|Bangin' on a trash can, drummin' on a street light...`);
      			if (source.template.speciesid !== 'altariamega' || source.illusion) return;
			     this.add('-start', source, 'typeadd', 'Water');
		},
		onSwitchOut: function () {
			this.add(`c|Abby|To avoid music damage, I have to switch my banjo to a keyboard!`);
		},
		onFaint: function () {
			this.add(`c|Abby|OK, I'll stop playing music!`);
		},
	},
	nappa: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Nappa|I, for one, welcome our new Fighting-type overlords!`);
		},
		onSwitchOut: function () {
			this.add(`c|Nappa|We'll be back in a moment, so stay tuned!`);
		},
		onFaint: function () {
			this.add(`c|Nappa|And that's for today's news.`);
		},
	},
	gidget: {
		noCopy: true,
		onStart: function (target) {
			this.add(`c|Gidget|Go-Go Gidget Transform!`);
			if (target.illusion) return;

			/** @type {{[forme: string]: string[]}} */
			let formes = {
				'blastoise': ['Hydro Cannon', 'Ice Beam', 'Earthquake', 'Gidget Blast'],
				'charizard': ['Blast Burn', 'Wing Attack', 'Earthquake', 'Gidget Blast'],
				'venusaur': ['Frenzy Plant', 'Sludge Bomb', 'Moonblast', 'Gidget Blast'],
				'feraligatr': ['Hydro Cannon', 'Crunch', 'Meteor Mash', 'Gidget Blast'],
				'typhlosion': ['Blast Burn', 'Solar Beam', 'Sunny Day', 'Gidget Blast'],
				'meganium': ['Frenzy Plant', 'Ancient Power', 'Earthquake', 'Gidget Blast'],
				'swampert': ['Hydro Cannon', 'Hammer Arm', 'Ice Punch', 'Gidget Blast'],
				'blaziken': ['Blast Burn', 'Close Combat', 'Thunder Punch', 'Gidget Blast'],
				'sceptile': ['Frenzy Plant', 'Dragon Pulse', 'Ancient Power', 'Gidget Blast'],
				'empoleon': ['Hydro Cannon', 'Flash Cannon', 'Aura Sphere', 'Gidget Blast'],
				'infernape': ['Blast Burn', 'Cross Chop', 'Dark Pulse', 'Gidget Blast'],
				'torterra': ['Frenzy Plant', 'Earthquake', 'Volt Switch', 'Gidget Blast'],
				'samurott': ['Hydro Cannon', 'Sacred Sword', 'Swords Dance', 'Gidget Blast'],
				'emboar': ['Blast Burn', 'Close Combat', 'Thunder Punch', 'Gidget Blast'],
				'serperior': ['Frenzy Plant', 'Ancient Power', 'Psyshock', 'Gidget Blast'],
				'greninja': ['Hydro Cannon', 'Dark Pulse', 'Gunk Shot', 'Gidget Blast'],
				'delphox': ['Blast Burn', 'Psychic', 'Moonblast', 'Gidget Blast'],
				'chesnaught': ['Frenzy Plant', 'Close Combat', 'Dark Pulse', 'Gidget Blast'],
				'primarina': ['Hydro Cannon', 'Moonblast', 'Earthquake', 'Gidget Blast'],
				'incineroar': ['Blast Burn', 'Foul Play', 'Grass Knot', 'Gidget Blast'],
				'decidueye': ['Frenzy Plant', 'Phantom Force', 'Rock Slide', 'Gidget Blast'],
			};
			let forme = Object.keys(formes)[this.random(21)];
			this.add(`-anim`, target, 'Geomancy', target);
			target.formeChange(forme);
			target.setAbility('Limber');
			// Update movepool
			target.moveSlots = [];
			if (!formes[forme]) throw new Error(`Can't find moveset for Gidget's forme: "${forme}".`); // should never happen
			for (const [i, moveid] of formes[forme].entries()) {
				let move = this.getMove(moveid);
				if (!move.id) continue;
				target.moveSlots.push({
					move: move.name,
					id: move.id,
					// @ts-ignore hacky change for Gidget's set
					pp: Math.floor(((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5) * (target.ppPercentages ? target.ppPercentages[i] : 1)),
					maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
					target: move.target,
					disabled: false,
					used: false,
					virtual: true,
				});
				target.moves.push(move.id);
			}
		},
		onBeforeSwitchOut: function (pokemon) {
			if (pokemon.illusion) return;
			// @ts-ignore hacky change for Gidget's set
			pokemon.ppPercentages = pokemon.moveSlots.slice().map(m => {
				return m.pp / m.maxpp;
			});
		},
		onSwitchOut: function () {
			this.add(`c|Gidget|I'll be here in a moment! Don't worry!`);
		},
		onFaint: function () {
			this.add(`c|Gidget|It's simple if my name isn't Gadget!`);
		},
	},
	sedna: {
		noCopy: true,
		onStart: function (source) {
			this.add(`c|Sedna|Today's logic: Gravity!`);
			if (source.illusion) return;
			this.addPseudoWeather('gravity', source);
		},
		onSwitchOut: function () {
			this.add(`c|Sedna|I'm gonna work on a Sky Dance accademy.`);
		},
		onFaint: function () {
			this.add(`c|Sedna|And now I'm going home. :(`);
		},
	},
	skyla: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Skyla|Good luck and have fun!`);
		},
		onSwitchOut: function () {
			this.add(`c|Skyla|Have a nice day, darling!`);
		},
		onFaint: function () {
			this.add(`c|Skyla|I'll do my best!`);
		},
	},
	kris: {
		noCopy: true,
		onStart: function (pokemon) {
			let foe = pokemon.side.foe.active[0];
			this.add(`c|Kris|Think you're going to challenge me, ${foe.name}?`);
		},
		onSwitchOut: function () {
			this.add(`c|Kris|Good luck if you need me!`);
		},
		onFaint: function (pokemon) {
			let foe = pokemon.side.foe.active[0];
			this.add(`c|Kris|Great job, ${foe.name}!`);
		},
	},
	sheka: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Sheka|It's Sheka's time to shine!`);
		},
		onSwitchOut: function () {
			this.add(`c|Sheka|I had enough time for this!`);
		},
		onFaint: function () {
			this.add(`c|Sheka|But I've tried my best!`);
		},
		onUpdate: function (pokemon) {
			if (pokemon.template.speciesid !== 'silvally' || pokemon.transformed || pokemon.illusion || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-activate', pokemon, 'ability: Deity Force');
			pokemon.formeChange('Arceus', this.effect, true);
			let newHP = Math.floor(Math.floor(2 * pokemon.template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			pokemon.heal(pokemon.maxhp);
			this.add('-heal', pokemon, pokemon.getHealth);
			this.add('-message', pokemon.name + ' transformed!');
			this.boost({atk: 2, def: 2, spa: 2, spd: 2, spe: 2}, pokemon);
		},
	},
	leonas: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Leonas|No matter how hard I've tried!`);
		},
		onSwitchOut: function () {
			this.add(`c|Leonas|Send me a card if you have time!`);
		},
		onFaint: function () {
			this.add(`c|Leonas|I have to go! Bye!`);
		},
		// Effortless Innate
		onBoost: function (boost, target, source, effect) {
			if (source.illusion) return;
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				// @ts-ignore
				boost[i] *= 3;
			}
		},
	},
	anabelle: {
		noCopy: true,
		onStart: function (target, source) {
			this.add(`c|Anabelle|I have a one-off start!`);
			if (source.illusion) return;
			this.boost({spa: 3}, source);
			this.add('-start', source, 'typeadd', 'Fairy');
		},
		onSwitchOut: function () {
			this.add(`c|Annabelle|/me summons an another friend of hers.`);
		},
		onFaint: function () {
			this.add(`c|Anabelle|I'm seriously missing the point!`);
		},
	},
	crystal: {
		noCopy: true,
		onStart: function (target, source) {
			this.add(`c|Crystal|/me used Quiver Dance!`);
      this.add('-anim', source, "Quiver Dance", source);
			this.add('-start', source, 'typeadd', 'Ice');
		},
		onSwitchOut: function () {
			this.add(`c|Crystal|Seriously!?`);
		},
		onFaint: function () {
			this.add(`c|Crystal|I decided to come back for more!`);
		},
	},
	speedy: {
		noCopy: true,
		onStart: function (pokemon) {
			this.add(`c|Speedy|Cowabunga, man!`);
			if (pokemon.illusion) return;
			this.boost({spe: 3}, pokemon);
		},
		onSwitchOut: function () {
			this.add(`c|Speedy|Have fun and safe at PK Land!`);
		},
		onFaint: function () {
			this.add(`c|Speedy|/Great game!`);
		},
		// Galvanize innate
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (pokemon.illusion) return;
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Electric';
				move.galvanizeBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.galvanizeBoosted) return this.chainModify([0x1333, 0x1000]);
		},
	},
	goldhooh: {
		noCopy: true,
		onStart: function () {
			this.add(`c|Gold Ho-Oh|Welcome, ladies and gentlemen.`);
		},
		onSwitchOut: function (pokemon) {
			this.add(`c|Gold Ho-Oh|Dare to switch out of me? `);
			if (pokemon.illusion) return;
			// Innate - heals 40% on switch out
			pokemon.heal(pokemon.maxhp * 0.3);
		},
		onFaint: function () {
			this.add(`c|Gold Ho-Oh|I've own you a happy life.`);
		},
	},
	ajthekeldeo: {
		noCopy: true,
		onStart: function (source) {
			this.add(`c|AJ the Keldeo|No fun here! =^u^=`);
			if (source.illusion) return;
			let target = source.side.foe.active[0];

			let removeAll = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			let silentRemove = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist'];
			for (const sideCondition of removeAll) {
				if (target.side.removeSideCondition(sideCondition)) {
					if (!(silentRemove.includes(sideCondition))) this.add('-sideend', target.side, this.getEffect(sideCondition).name, '[from] move: No Fun Zone', '[of] ' + source);
				}
				if (source.side.removeSideCondition(sideCondition)) {
					if (!(silentRemove.includes(sideCondition))) this.add('-sideend', source.side, this.getEffect(sideCondition).name, '[from] move: No Fun Zone', '[of] ' + source);
				}
			}
			this.add('-clearallboost');
			for (const side of this.sides) {
				for (const pokemon of side.active) {
					if (pokemon && pokemon.isActive) pokemon.clearBoosts();
				}
			}
			for (const clear in this.pseudoWeather) {
				if (clear.endsWith('mod') || clear.endsWith('clause')) continue;
				this.removePseudoWeather(clear);
			}
			this.clearWeather();
			this.clearTerrain();
		},
		onFaint: function () {
			this.add(`c|AJ the Keldeo|Tell Ginara the Pixie to say hi!`);
		},
	},
	zatch: {
		noCopy: true,
		onStart: function (target, source) {
			this.add(`c|Zatch|Even if I die in a way, I will make you bad again!`);
      this.add('message', 'Zatch appeared! Try to hit him!');
      this.boost({atk: 2, spa: 2, def: 2, spd: 2, spe: 2}, source);
      source.heal(source.maxhp);
      source.cureStatus();
					for (const moveSlot of target.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
		},
		onSwitchOut: function (target, pokemon) {
			this.add(`c|Zatch|Let's see how you do against the Photon Zatch Man!`);
			// message is shown after something
			this.add('message', 'Zatch used Photon Zatch Man!');
		},
		onFaint: function (source) {
			this.add(`c|Zatch|I can't believe it! Aqua was right! You've changed into a good Pokémon!`);
			// message is shown after the "Zatch Fainted!" message
      this.add('-anim', source, "Explosion", source);
			this.add('message', 'Zatch exploded!');
		},
		onFoeTrapPokemon: function (pokemon) {
			if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon: function (pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, source)) {
				pokemon.maybeTrapped = true;
			}
		},
	},
	// Modified type setup for arceus and silvally
	arceus: {
		inherit: true,
		onType: function (types, pokemon) {
			if (pokemon.transformed) return types;
			/** @type {string | undefined} */
			let type = 'Normal';
			if (pokemon.ability === 'multitype') {
				type = pokemon.getItem().onMemory;
				if (!type) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
	silvally: {
		inherit: true,
		onType: function (types, pokemon) {
			if (pokemon.transformed) return types;
			/** @type {string | undefined} */
			let type = 'Normal';
			if (pokemon.ability === 'rkssystem') {
				type = pokemon.getItem().onMemory;
				if (!type) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
};

exports.BattleStatuses = BattleStatuses;
