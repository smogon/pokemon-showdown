/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /config/formats.js
 * The team making scripts go into /data/scripts.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.Formats = [
	// Polar Opposites, January - February 2016
	// https://github.com/Zarel/Pokemon-Showdown/tree/5047fda6fc6e8ee7b7bab364b9f9a6c201ed5838

	{
		name: "[Seasonal] Polar Opposites",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],
		mod: 'gen6',

		team: 'randomSeasonalPolar',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('-message', "NOTE: This is an Inverse Battle! Type effectivenesses are reversed!");
		},
		onNegateImmunity: false,
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		},
	},

	// Dimension Doom, March 2016
	// https://github.com/Zarel/Pokemon-Showdown/tree/10bdcfdd338028ccb89da2d0c5290d9344f74e38

	{
		name: "[Seasonal] Dimension Doom",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],
		mod: 'gen6',

		team: 'randomSeasonalDimensional',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('-message', "The world is about to end!");
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let i = 0, len = allPokemon.length; i < len; i++) {
				let pokemon = allPokemon[i];
				if (pokemon.set.signatureMove) {
					let last = pokemon.moves.length - 1;
					if (pokemon.moves[last]) {
						pokemon.moveSlots[last].move = pokemon.set.signatureMove;
						pokemon.baseMoveSlots[last].move = pokemon.set.signatureMove;
					}
				}
			}
		},
		onSwitchIn: function (pokemon) {
			let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			if (name === 'rick') {
				this.add('-message', 'WUBBA LUBBA DUB DUB!!');
			}
			if (name === 'morty') {
				this.add('-message', "I-I'm not sure t-this is a good idea, Rick!");
			}
			if (name === 'mrmeeseks') {
				this.add('-message', "Hi! I'm Mr. Meeseks! Look at me!");
			}
			if (name === 'birdperson') {
				this.add('-message', "It's been a tough mating season for birdperson.");
			}
			if (name === 'squanch') {
				this.add('-message', "You're getting squanched, squanch!");
			}
			if (name === 'mortyjr') {
				this.add('-message', 'The government is lame!');
			}
			if (name === 'dipper') {
				this.add('-message', 'A mystery to solve!');
			}
			if (name === 'mabel') {
				this.add('-message', 'Yay! Splinters!');
			}
			if (name === 'stanley') {
				this.add('-message', 'Discount punches! No refunds!');
			}
			if (name === 'stanford') {
				this.add('-message', 'Being a hero means fighting back even when it seems impossible.');
			}
			if (name === 'snowball') {
				this.add('-message', 'You may call me snowball, because my fur is white and pretty.');
			}
			if (name === 'billcipher') {
				this.add('-message', 'Let the weirdmaggedon start! HAHAHA!');
			}
			if (name === 'lilgideon') {
				this.add('-message', 'I can buy and sell you, old man!');
			}
		},
		onModifyMove: function (move, pokemon) {
			let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			if (move.id === 'watergun' && name in {'rick':1, 'evilrick':1}) {
				move.name = 'Portal Gun';
				move.type = 'Psychic';
				move.basePower = 66;
				move.accuracy = true;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Hyper Beam", target);
				};
				switch (this.random(6)) {
				case 0:
					move.volatileStatus = 'confusion';
					move.onHit = function () {
						this.add('-message', "This weird dimension confuses you!");
					};
					break;
				case 1:
					move.category = 'embargo';
					move.onHit = function () {
						this.add('-message', "Your item got sucked by the dimension hole!");
					};
					break;
				case 2:
					move.forceSwitch = true;
					move.onHit = function () {
						this.add('-message', "You got sucked into the portal!");
					};
					break;
				case 3:
					move.basePower = 150;
					move.type = 'Fire';
					move.onHit = function () {
						this.add('-message', "Flames came out of the portal gun!");
					};
					break;
				case 4:
					move.basePower = 130;
					move.type = 'Poison';
					move.status = 'tox';
					move.onHit = function () {
						this.add('-message', "Toxic air came out of the portal gun!");
					};
					break;
				case 5:
					move.basePower = 45;
					move.multihit = 3;
					move.type = 'Bug';
					move.onHit = function () {
						this.add('-message', "Tentacles came out of the portal gun!");
					};
					break;
				}
			}
			if (move.id === 'outrage' && name === 'morty') {
				move.name = 'Morty Rage';
				move.type = 'Fighting';
				move.basePower = 200;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Outrage", target);
					this.add('-message', 'Morty grew tired of your shennanigans!');
				};
			}
			if (move.id === 'kinesis' && name === 'evilmorty') {
				move.name = 'Mind Control';
				move.volatileStatus = 'confusion';
				move.category = 'Special';
				move.type = 'Fire';
				move.basePower = 50;
				move.boosts = {accuracy: -1};
			}
			if (move.id === 'dreameater' && name === 'scaryterry') {
				move.name = 'Super Dream Eater';
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Hyper Beam", target);
				};
				move.onBasePower = function (basePower, attacker, defender) {
					if (defender.status && defender.status === 'slp') {
						return this.chainModify(2);
					}
				};
			}
			if (move.id === 'bulkup' && name === 'squanchy') {
				move.name = 'Squanch Up';
				move.boosts = {atk: 2, def: 2};
			}
			if (move.id === 'recycle') {
				move.name = 'Pines Recycle';
				move.heal = [2, 3];
			}
			if (move.id === 'psychic' && name === 'mabel') {
				move.name = 'Grappling Hook';
				move.basePower = 110;
				move.drain = [2, 3];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Hyper Beam", target);
					this.add('-message', 'GRAPPLING HOOK!');
				};
			}
			if (move.id === 'thunder' && name === 'billcipher') {
				move.name = 'Bill Thunder';
				move.basePower = 200;
			}
			if (move.id === 'tackle' && name === 'stanley') {
				move.name = 'Baseball Bat';
				move.basePower = 135;
				move.volatileStatus = 'confusion';
			}
			if (move.id === 'hyperbeam' && name === 'stanford') {
				move.name = 'Dimensional Sniper';
				move.category = 'Physical';
				move.basePower = 300;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Origin Pulse", target);
				};
			}
			if (move.id === 'chatter' && name === 'summer') {
				move.name = 'Teen Problems';
				move.basePower = 90;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Meteor Mash", target);
					this.add('-message', 'This is so embarrasing!');
				};
			}
		},
	},

	// Super Staff Bros. Melee, April - May 2016
	// https://github.com/Zarel/Pokemon-Showdown/tree/129d35d5eefb295b1ec24f3e1985a586da3f049c

	{
		name: "[Seasonal] Super Staff Bros. Melee",
		desc: [`&bullet; <a href="https://www.smogon.com/forums/threads/3491902/">Seasonal Ladder</a>`],

		mod: 'super-staff-bros-melee',
		team: 'randomSeasonalMelee',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin() {
			this.add('raw', `Super Staff Bros. <strong>MELEEEEEEEEEEEEEE</strong>!!`);
			this.add('message', `SURVIVAL! GET READY FOR THE NEXT BATTLE!`);

			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				const lastIndex = pokemon.moves.length - 1;
				if (pokemon.moves[lastIndex]) {
					pokemon.moveSlots[lastIndex].move = pokemon.set.signatureMove;
					pokemon.baseMoveSlots[lastIndex].move = pokemon.set.signatureMove;
				}
			}
		},
		// Here we add some flavour or design immunities.
		onImmunity(type, pokemon) {
			if (toId(pokemon.name) === 'juanma' && type === 'Fire') {
				this.add('-message', `Did you think fire would stop __him__? You **fool**!`);
				return false;
			}
		},
		onNegateImmunity(pokemon, type) {
			if (pokemon.volatiles['flipside']) return false;
			const foes = pokemon.side.foe.active;
			if (foes.length && foes[0].volatiles['samuraijack'] && pokemon.hasType('Dark') && type === 'Psychic') return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target.volatiles['flipside']) return;
			if (move && move.id === 'retreat') return;
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		},
		// Hacks for megas changed abilities. This allow for their changed abilities.
		onUpdate(pokemon) {
			let name = toId(pokemon.name);
			if (pokemon.template.isMega) {
				if (name === 'andy' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Adaptability');
				}
				if (name === 'reisen' && pokemon.getAbility().id === 'hugepower') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Tough Claws');
				}
				if (name === 'crestfall' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('simple');
					this.add('-ability', pokemon, 'Simple');
				}
				if (name === 'dreameatergengar' && pokemon.getAbility().id === 'shadowtag') {
					pokemon.setAbility('infiltrator');
					this.add('-ability', pokemon, 'Infiltrator');
				}
				if (name === 'overneat' && pokemon.getAbility().id === 'speedboost') {
					pokemon.setAbility('noguard');
					this.add('-ability', pokemon, 'No Guard');
				}
				if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, 'Shed Skin');
				}
				if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
					pokemon.setAbility('cloudnine');
				}
			}
			if (!this.shownTip) {
				this.add('raw',
					`<div class="broadcast-green">Huh? But what do all these weird moves do??<br>` +
					`<strong>Protip: Refer to the <a href="https://github.com/Zarel/Pokemon-Showdown/blob/129d35d5eefb295b1ec24f3e1985a586da3f049c/mods/seasonal/README.md">PLAYER'S MANUAL</a>!</strong></div`
				);
				this.shownTip = true;
			}
		},
		// Here we treat many things, read comments inside for information.
		onSwitchInPriority: 1,
		onSwitchIn(pokemon) {
			let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			// Wonder Guard is available, but it curses you.
			if (pokemon.getAbility().id === 'wonderguard' && pokemon.baseTemplate.baseSpecies !== 'Shedinja' && pokemon.baseTemplate.baseSpecies !== 'Kakuna') {
				pokemon.addVolatile('curse', pokemon);
				this.add('-message', `${pokemon.name}'s Wonder Guard has cursed it!`);
			}

			// Add here more hacky stuff for mega abilities.
			// This happens when the mega switches in, as opposed to mega-evolving on the turn.
			if (pokemon.template.isMega) {
				if (name === 'andy' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Adaptability');
				}
				if (name === 'reisen' && pokemon.getAbility().id === 'hugepower') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, 'Tough Claws');
				}
				if (name === 'crestfall' && pokemon.getAbility().id === 'magicbounce') {
					pokemon.setAbility('simple');
					this.add('-ability', pokemon, 'Simple');
				}
				if (name === 'dreameatergengar' && pokemon.getAbility().id === 'shadowtag') {
					pokemon.setAbility('infiltrator');
					this.add('-ability', pokemon, 'Infiltrator');
				}
				if (name === 'overneat' && pokemon.getAbility().id === 'speedboost') {
					pokemon.setAbility('noguard');
					this.add('-ability', pokemon, 'No Guard');
				}
				if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, 'Shed Skin');
				}
				if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
					pokemon.setAbility('cloudnine');
				}
			} else {
				// Bypass one mega limit.
				pokemon.canMegaEvo = this.canMegaEvo(pokemon);
			}

			// Innate effects.
			if (name === 'ascriptmaster') {
				pokemon.addVolatile('ascriptinnate', pokemon);
			}
			if (name === 'atomicllamas') {
				pokemon.addVolatile('baddreamsinnate', pokemon);
			}
			if (name === 'blastchance') {
				pokemon.addVolatile('flipside', pokemon);
			}
			if (name === 'bondie') {
				pokemon.addVolatile('crabstance', pokemon);
			}
			if (name === 'clefairy') {
				pokemon.addVolatile('coldsteel', pokemon);
			}
			if (name === 'duck') {
				pokemon.addVolatile('firstblood', pokemon);
			}
			if (name === 'eeveegeneral') {
				this.add('detailschange', pokemon, pokemon.details); //run mega evo animation
				this.add('-mega', pokemon, 'Eevee', null);
				for (let i = 0; i < pokemon.stats.length; i++) {
					pokemon.stats[i] += 50;
				}
			}
			if (name === 'formerhope') {
				pokemon.addVolatile('cursedbodyinnate', pokemon);
			}
			if (name === 'galbia' || name === 'aurora') {
				this.setWeather('sandstorm');
			}
			if (name === 'rodan') {
				pokemon.addVolatile('gonnamakeyousweat', pokemon);
			}
			if (name === 'giagantic') {
				pokemon.addVolatile('deltastreaminnate', pokemon);
			}
			if (name === 'hashtag') {
				this.boost({spe:1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'haund') {
				pokemon.addVolatile('prodigy', pokemon);
			}
			if (name === 'innovamania' && !pokemon.illusion) {
				this.boost({atk:6, def:6, spa:6, spd:6, spe:6, accuracy:6}, pokemon, pokemon, 'divinegrace');
			}
			if (name === 'jackhiggins') {
				this.setWeather('sunnyday');
			}
			if (name === 'lemonade') {
				pokemon.addVolatile('adaptabilityinnate', pokemon);
			}
			if (name === 'manu11') {
				pokemon.addVolatile('arachnophobia', pokemon);
			}
			if (name === 'marshmallon') {
				this.boost({def: 1}, pokemon, pokemon, 'fur coat innate');
			}
			if (name === 'mizuhime' || name === 'kalalokki' || name === 'sweep') {
				this.setWeather('raindance');
			}
			if (name === 'nv') {
				pokemon.addVolatile('cuteness', pokemon);
			}
			if (name === 'pikachuun') {
				this.boost({spe: 1}, pokemon, pokemon, 'Reisen Cosplay');
			}
			if (name === 'qtrx') {
				pokemon.addVolatile('qtrxinnate', pokemon);
			}
			if (name === 'raseri') {
				this.useMove('hypnosis', pokemon);
			}
			if (name === 'rssp1') {
				pokemon.addVolatile('speedboostinnate', pokemon);
			}
			if (name === 'scythernoswiping') {
				pokemon.addVolatile('mountaineerinnate', pokemon);
			}
			if (name === 'sigilyph') {
				pokemon.addVolatile('samuraijack', pokemon);
			}
			if (name === 'sonired') {
				this.boost({def: -1, spd: -1, atk: 1, spe: 1}, pokemon, pokemon, 'Weak Skin');
			}
			if (name === 'snobalt') {
				pokemon.addVolatile('amityabsorb', pokemon);
			}
			if (name === 'spacebass') {
				pokemon.addVolatile('badtrip', pokemon);
			}
			if (name === 'sparktrain') {
				pokemon.addVolatile('refrigerateinnate', pokemon);
			}
			if (name === 'specsmegabeedrill') {
				pokemon.addVolatile('weed', pokemon);
			}
			if (name === 'starmei') {
				this.useMove('cosmicpower', pokemon);
			}
			if (name === 'talkingtree') {
				this.useMove('synthesis', pokemon);
				this.useMove('bulkup', pokemon);
			}
			if (name === 'teremiare') {
				pokemon.addVolatile('coinflip', pokemon);
			}
			if (name === 'trickster' || name === 'blitzamirin') {
				let target = pokemon.battle[pokemon.side.id === 'p1' ? 'p2' : 'p1'].active[0];
				let targetBoosts = {};
				let sourceBoosts = {};
				for (let i in target.boosts) {
					targetBoosts[i] = target.boosts[i];
					sourceBoosts[i] = pokemon.boosts[i];
				}
				target.setBoost(sourceBoosts);
				pokemon.setBoost(targetBoosts);
				this.add('-swapboost', pokemon, target);
			}
			if (name === 'unfixable') {
				pokemon.addVolatile('ironbarbsinnate', pokemon);
			}
			if (name === 'urkerab') {
				pokemon.addVolatile('focusenergy', pokemon);
				this.useMove('magnetrise', pokemon);
			}
			if (name === 'uselesstrainer') {
				pokemon.addVolatile('ninja', pokemon);
			}
			if (name === 'winry') {
				pokemon.addVolatile('hellacute', pokemon);
			}

			// Edgy switch-in sentences go here.
			// Sentences vary in style and how they are presented, so each Pokémon has its own way of sending them.
			let sentences = [];
			let sentence = '';

			if (name === 'acast') {
				pokemon.say(`__A wild Castform appeared!__`);
			}
			if (name === 'ace') {
				pokemon.say(`Lmaonade`);
			}
			if (name === 'aelita') {
				pokemon.say(`Transfer, Aelita. Scanner, Aelita. Virtualization!`);
			}
			if (name === 'ajhockeystar') {
				pokemon.say(`Here comes the greatest hockey player alive!`);
			}
			if (name === 'albacore') {
				pokemon.say(`do I have to?`);
			}
			if (name === 'albert') {
				pokemon.say(`Art is risk.`);
			}
			if (name === 'always') {
				sentence = (pokemon.side.foe.active.length && pokemon.side.foe.active[0].hp ? pokemon.side.foe.active[0].name : `... ohh nobody's there...`);
				pokemon.say(`Oh it's ${sentence}`);
			}
			if (name === 'am') {
				pokemon.say(`Lucky and Bad`);
			}
			if (name === 'andy') {
				pokemon.say(`:I`);
			}
			if (name === 'antemortem') {
				pokemon.say(`I Am Here To Oppress Users`);
			}
			if (name === 'anttya') {
				pokemon.say(`Those crits didn't even matter`);
			}
			if (name === 'anty') {
				pokemon.say(`mhm`);
			}
			if (name === 'articuno') {
				pokemon.say(`Abolish the patriarchy!`);
			}
			if (name === 'ascriptmaster') {
				pokemon.say(`It's time for a hero to take the stage!`);
			}
			if (name === 'astara') {
				pokemon.say(`I'd rather take a nap, I hope you won't be a petilil shit, Eat some rare candies and get on my level.`);
			}
			if (name === 'asty') {
				pokemon.say(`Top kek :^)`);
			}
			if (name === 'atomicllamas') {
				pokemon.say(`(celebrate)(dog)(celebrate)`);
			}
			if (name === 'aurora') {
				pokemon.say(`Best of luck to all competitors!`);
			}
			if (name === 'reisen') {
				pokemon.say(`Fite me irl bruh.`);
			}
			if (name === 'beowulf') {
				pokemon.say(`Grovel peasant, you are in the presence of the RNGesus`);
			}
			if (name === 'biggie') {
				sentences = ["Now I'm in the limelight cause I rhyme tight", "HAPPY FEET! WOMBO COMBO!", "You finna mess around and get dunked on"];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'blastchance') {
				pokemon.say(`MAN BALAMAR`);
			}
			if (name === 'blitzamirin') {
				pokemon.say(`How Can Mirrors Be Real If Our Eyes Aren't Real? ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ`);
			}
			if (name === 'bludz') {
				pokemon.say(`420 blaze it`);
			}
			if (name === 'bondie') {
				pokemon.say(`__(\\/) snip snip (\\/)__`);
			}
			if (name === 'bottt') {
				pokemon.say(`Beep, boop`);
			}
			if (name === 'brandon') {
				pokemon.say(`Life's too short to take it seriously ALL the time.`);
			}
			if (name === 'bumbadadabum') {
				pokemon.say(`Time for card games on motorcycles!`);
				if (pokemon.side.foe.active.length && pokemon.side.foe.active[0].name === 'Scotteh') pokemon.say(`Also, fuck you Scotteh`);
			}
			if (name === 'bummer') {
				pokemon.say(`Oh hi.`);
			}
			if (name === 'chaos') {
				pokemon.say(`I always win`);
			}
			if (name === 'ciran') {
				pokemon.say(`You called?`);
			}
			if (name === 'clefairy') {
				pokemon.say(`google "dj clefairyfreak" now`);
			}
			if (name === 'coolstorybrobat') {
				sentence = this.sample([
					"Time to GET SLAYED", "BRUH!", "Ahem! Gentlemen...", "I spent 6 months training in the mountains for this day!",
					"Shoutout to all the pear...",
				]);
				pokemon.say(`${sentence}`);
			}
			if (name === 'crestfall') {
				pokemon.say(`To say that we're in love is dangerous`);
			}
			if (name === 'deathonwings') {
				pokemon.say(`rof`);
			}
			if (name === 'dirpz') {
				pokemon.say(`IT'S A WATER/FAIRY TYPE!!11!`);
			}
			if (name === 'dmt') {
				pokemon.say(`DMT`);
			}
			if (name === 'dreameatergengar') {
				pokemon.say(`Goodnight sweet prince.`);
			}
			if (name === 'duck') {
				pokemon.say(`Don't duck with me!`);
			}
			if (name === 'e4flint') {
				pokemon.say(`hf lul`);
			}
			if (name === 'eeveegeneral') {
				sentences = ['yo', 'anyone seen goku?'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'eyan') {
				pokemon.say(`░░░░░░░░▄▄▄▀▀▀▄▄███▄░░░░░░░░░░░░░░░░░`);
				pokemon.say(`░░░░░▄▀▀░░░░░░░▐░▀██▌░░░░░░░░░░░░░░░░`);
				pokemon.say(`░░░▄▀░░░░▄▄███░▌▀▀░▀█░░░░░░░░░░░░░░░░`);
				pokemon.say(`░░▄█░░▄▀▀▒▒▒▒▒▄▐░░░░█▌░░░░░░░░░░░░░░░ `);
				pokemon.say(`░▐█▀▄▀▄▄▄▄▀▀▀▀▌░░░░░▐█▄░░░░░░░░░░░░░░`);
				pokemon.say(`░▌▄▄▀▀░░░░░░░░▌░░░░▄███████▄░░░░░░░░░`);
				pokemon.say(`░░░░░░░░░░░░░▐░░░░▐███████████▄░░░░░░`);
				pokemon.say(`░░░░░le░░░░░░░▐░░░░▐█████████████▄░░░`);
				pokemon.say(`░░░░toucan░░░░░░▀▄░░░▐██████████████▄`);
				pokemon.say(`░░░░░░has░░░░░░░░▀▄▄████████████████▄`);
				pokemon.say(`░░░░░arrived░░░░░░░░░░░░█▀██████░░░░░`);
				pokemon.say(`WELCOME TO COMPETITIVE TOUCANNING`);
			}
			if (name === 'feliburn') {
				pokemon.say(`you don't go hand to hand with a fighter noob`);
			}
			if (name === 'fireburn') {
				pokemon.say(`:V`);
			}
			if (name === 'flyingkebab') {
				pokemon.say(`Kebab > Pizza`);
			}
			if (name === 'formerhope') {
				pokemon.say(`I have Hope`);
			}
			if (name === 'freeroamer') {
				pokemon.say(`lol this is a wrap`);
			}
			if (name === 'frysinger') {
				pokemon.say(`Nice boosts kid.`);
			}
			if (name === 'fx') {
				pokemon.say(`love is 4 wawawawawawawalls`);
			}
			if (name === 'galbia') {
				pokemon.say(`(dog)`);
			}
			if (name === 'galom') {
				pokemon.say(`To the end.`);
			}
			if (name === 'rodan') { // don't delete
				pokemon.say(`Here I Come, Rougher Than The Rest of 'Em.`);
			}
			if (name === 'geoffbruedly') {
				pokemon.say(`FOR WINRY`);
			}
			if (name === 'giagantic') {
				pokemon.say(`e.e`);
			}
			if (name === 'golui') {
				pokemon.say(`Golly gee`);
			}
			if (name === 'goodmorningespeon') {
				pokemon.say(`type /part to continue participating in this battle :)`);
			}
			if (name === 'grimauxiliatrix') {
				pokemon.say(`ᕕ( ᐛ )ᕗ`);
			}
			if (name === 'halite') {
				pokemon.say(`You’re gonna get haxxed kid :^)`);
			}
			if (name === 'hannah') {
				pokemon.say(`♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥`);
			}
			if (name === 'hashtag') {
				pokemon.say(`hey opponent, you get 5 hashtag points if you forfeit right now ;}`);
			}
			if (name === 'haund') {
				pokemon.say(`le balanced normal flying bird has arrived`);
			}
			if (name === 'healndeal') {
				pokemon.say(`screw clerics`);
			}
			if (name === 'himynamesl') {
				pokemon.say(`There’s no such thing as winning or losing. There is won and there is lost, there is victory and defeat. There are absolutes. Everything in between is still left to fight for.`);
				pokemon.say(`${pokemon.side.foe.name} will have won only when there is no one left to stand against them. Until then, there is only the struggle, because tides do what tides do – they turn.`);
			}
			if (name === 'hippopotas') {
				this.add('-message', '@Hippopotas\'s Sand Stream whipped up a sandstorm!');
			}
			if (name === 'hollywood') {
				pokemon.say(`Kappa`);
			}
			if (name === 'ih8ih8sn0w') {
				pokemon.say(`*sips tea*`);
			}
			if (name === 'imanalt') {
				pokemon.say(`muh bulk`);
			}
			if (name === 'imas234') {
				pokemon.say(`hlo`);
			}
			if (name === 'innovamania') {
				sentences = ['Don\'t take this seriously', 'These Black Glasses sure look cool', 'Ready for some fun?( ͡° ͜ʖ ͡°)', '( ͡° ͜ʖ ͡°'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'iplaytennislol') {
				pokemon.say(`KACAW`);
			}
			if (name === 'iyarito') {
				pokemon.say(`Welp`);
			}
			if (name === 'jackhiggins') {
				pokemon.say(`Ciran was right, fun deserved to be banned`);
			}
			if (name === 'jasmine') {
				pokemon.say(`I'm still relevant!`);
			}
			if (name === 'jdarden') {
				pokemon.say(`Did someone call for some BALK?`);
			}
			if (name === 'jetpack') {
				pokemon.say(`You've met with a terrible fate, haven't you?`);
			}
			if (name === 'joim') {
				let dice = this.random(8);
				if (dice === 1) {
					pokemon.say(`░░░░░░░░░░░░▄▐`);
					pokemon.say(`░░░░░░▄▄▄░░▄██▄`);
					pokemon.say(`░░░░░▐▀█▀▌░░░░▀█▄`);
					pokemon.say(`░░░░░▐█▄█▌░░░░░░▀█▄`);
					pokemon.say(`░░░░░░▀▄▀░░░▄▄▄▄▄▀▀`);
					pokemon.say(`░░░░▄▄▄██▀▀▀▀`);
					pokemon.say(`░░░█▀▄▄▄█░▀▀`);
					pokemon.say(`░░░▌░▄▄▄▐▌▀▀▀`);
					pokemon.say(`▄░▐░░░▄▄░█░▀▀ U HAVE BEEN SPOOKED`);
					pokemon.say(`▀█▌░░░▄░▀█▀░▀`);
					pokemon.say(`░░░░░░░▄▄▐▌▄▄ BY THE`);
					pokemon.say(`░░░░░░░▀███▀█░▄`);
					pokemon.say(`░░░░░░▐▌▀▄▀▄▀▐▄ SPOOKY SKILENTON`);
					pokemon.say(`░░░░░░▐▀░░░░░░▐▌`);
					pokemon.say(`░░░░░░█░░░░░░░░█`);
					pokemon.say(`░░░░░▐▌░░░░░░░░░█`);
					pokemon.say(`░░░░░█░░░░░░░░░░▐▌ SEND THIS TO 7 PPL OR SKELINTONS WILL EAT YOU`);
				} else {
					sentences = [
						"Finally a good reason to punch a teenager in the face!", "WUBBA LUBBA DUB DUB",
						"``So here we are again, it's always such a pleasure.``", "My ex-wife still misses me, BUT HER AIM IS GETTING BETTER!",
						"A man chooses, a slave obeys.", "You're gonna have a bad time.", "Would you kindly let me win?",
						"I'm sorry, but I only enjoy vintage memes from the early 00's.",
					];
					pokemon.say(this.sample(sentences));
				}
			}
			if (name === 'juanma') {
				pokemon.say(`Okay, well, sometimes, science is more art than science, ${pokemon.side.name}. A lot of people don't get that.`);
			}
			if (name === 'kalalokki') {
				pokemon.say(`(•_•)`);
				pokemon.say(`( •_•)>⌐■-■`);
				pokemon.say(`(⌐■_■)`);
			}
			if (name === 'kidwizard') {
				pokemon.say(`Eevee General room mod me.`);
			}
			if (name === 'layell') {
				pokemon.say(`Enter stage left`);
			}
			if (name === 'legitimateusername') {
				const CODE_MARKER = '``';
				sentence = this.sample(["This isn't my fault.", "I'm not sorry."]);
				pokemon.say(`${CODE_MARKER}${sentence}${CODE_MARKER}`);
			}
			if (name === 'lemonade') {
				pokemon.say(`Pasta`);
			}
			if (name === 'level51') {
				pokemon.say(`n_n!`);
			}
			if (name === 'lj') {
				pokemon.say(`Powerfulll`);
			}
			if (name === 'lyto') {
				sentences = ["This is divine retribution!", "I will handle this myself!", "Let battle commence!"];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'macle') {
				pokemon.say(`Follow the Frog Blog`);
			}
			if (name === 'manu11') {
				pokemon.say(`/me is pet by ihateyourpancreas`);
			}
			if (name === 'marshmallon') {
				pokemon.say(`Marshtomb be like`);
				pokemon.say(`- He sees you when you're sleeping -`);
				pokemon.say(`- He knows when you're awake -`);
				pokemon.say(`- He knows if you've been bad or good -`);
				pokemon.say(`- So be good for goodness sake -`);
			}
			if (name === 'mattl') {
				pokemon.say(`If you strike me down, I shall become more powerful than you can possibly imagine.`);
			}
			if (name === 'mcmeghan') {
				pokemon.say(`A Game of Odds`);
			}
			if (name === 'megazard') {
				pokemon.say(`New tricks`);
			}
			if (name === 'mizuhime') {
				pokemon.say(`Thou Shalt Double Laser From The Edge`);
			}
			if (name === 'nv') {
				pokemon.say(`Who tf is nv?`);
			}
			if (name === 'omegaxis') {
				pokemon.say(`lol this isn’t even my final form`);
			}
			if (name === 'orday') {
				pokemon.say(`❄`);
			}
			if (name === 'overneat') {
				pokemon.say(`tsk, tsk, is going to be funny`);
			}
			if (name === 'paradise') {
				pokemon.say(`I sexually identify as a hazard setter`);
			}
			if (name === 'pikachuun') {
				sentences = ['Reisen is best waifu', 'Hey look I coded myself into the game', 'sup (\'.w.\')'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'pluviometer') {
				pokemon.say(`p^2laceholder`);
			}
			if (name === 'qtrx') {
				sentences = ["cutie are ex", "q-trix", "quarters", "cute T-rex", "Qatari", "random letters", "spammy letters", "asgdf"];
				pokemon.say(`omg DONT call me '${this.sample(sentences)}' pls respect my name its very special!!1!`);
			}
			if (name === 'quitequiet') {
				pokemon.say(`I'll give it a shot.`);
			}
			if (name === 'raseri') {
				pokemon.say(`gg`);
			}
			if (name === 'raven') {
				pokemon.say(`Are you ready? Then let the challenge... Begin!`);
			}
			if (name === 'rekeri') {
				pokemon.say(`Get Rekeri'd :]`);
			}
			if (name === 'rosiethevenusaur') {
				sentences = ['!dt party', 'Are you Wifi whitelisted?', 'Read the roomintro!'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'rssp1') {
				pokemon.say(`Witness the power of the almighty Rufflet!`);
			}
			if (name === 'sailorcosmos') {
				pokemon.say(`Cosmos Prism Power Make Up!`);
			}
			if (name === 'scotteh') {
				pokemon.say(`─────▄▄████▀█▄`);
				pokemon.say(`───▄██████████████████▄`);
				if (pokemon.side.foe.active.length && pokemon.side.foe.active[0].name === 'bumbadadabum') {
					pokemon.side.foe.active[0].say(`Fuck you Scotteh`);
				}
				pokemon.say(`─▄█████.▼.▼.▼.▼.▼.▼.▼`);
			}
			if (name === 'scpinion') {
				pokemon.say(`/me welcomes funbro`);
			}
			if (name === 'scythernoswiping') {
				pokemon.say(`/me prepares to swipe victory`);
			}
			if (name === 'shrang') {
				this.add('raw', `[15:30] @<strong>Scrappie</strong>: It is I, the great and powerful shrang, who is superior to you proles in every conceivable way.`);
			}
			if (name === 'sigilyph') {
				pokemon.say(`Prepare to feel the mighty power of an exploding star!`);
			}
			if (name === 'sirdonovan') {
				pokemon.say(`Oh, a battle? Let me finish my tea and crumpets`);
			}
			if (name === 'skitty') {
				pokemon.say(`\\_$-_-$_/`);
			}
			if (name === 'snobalt') {
				pokemon.say(`By the power vested in me from the great Lord Tomohawk...`);
			}
			if (name === 'snowy') {
				pokemon.say(`Why do a lot of black people call each other monica?`);
			}
			if (name === 'solarisfox') {
				pokemon.say(`/html <em><marquee behavior="alternate" scrollamount=3 scrolldelay="60" width="108">[Intense vibrating]</marquee></em>`);
			}
			if (name === 'sonired') {
				pokemon.say(`~`);
			}
			if (name === 'spacebass') {
				pokemon.say(`He aims his good ear best he can towards conversation and sometimes leans in awkward toward your seat`);
				pokemon.say(`And if by chance one feels their space too invaded, then try your best to calmly be discreet`);
				pokemon.say(`Because this septic breathed man that stands before you is a champion from days gone by`);
			}
			if (name === 'sparktrain') {
				pokemon.say(`hi`);
			}
			if (name === 'specsmegabeedrill') {
				pokemon.say(`(◕‿◕✿)`);
			}
			if (name === 'spy') {
				sentences = ['curry consumer', 'try to keep up', 'fucking try to knock me down', 'Sometimes I slather myself in vasoline and pretend I\'m a slug', 'I\'m really feeling it!'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'starmei') {
				pokemon.say(`Starmei wins again`);
			}
			if (name === 'starry') {
				pokemon.say(`oh`);
			}
			if (name === 'steamroll') {
				pokemon.say(`Banhammer ready!`);
			}
			if (name === 'sunfished') {
				pokemon.say(`*raptor screeches*`);
			}
			if (name === 'sweep') {
				pokemon.say(`(ninjacat)(beer)`);
			}
			if (name === 'talkingtree') {
				pokemon.say(`I am Groot n_n`);
			}
			if (name === 'teg') {
				pokemon.say(`It's __The__ Eevee General`);
			}
			if (name === 'temporaryanonymous') {
				sentences = ['Hey, hey, can I gently scramble your insides (just for laughs)? ``hahahaha``', 'check em', 'If you strike me down, I shall become more powerful than you can possibly imagine! I have a strong deathrattle effect and I cannot be silenced!'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'teremiare') {
				pokemon.say(`I like to call it skill`);
			}
			if (name === 'theimmortal') {
				pokemon.say(`Give me my robe, put on my crown!`);
			}
			if (name === 'tone114') {
				pokemon.say(`Haven't you heard the new sensation sweeping the nation?`);
			}
			if (name === 'trickster') {
				sentences = ["heh….watch out before you get cut on my edge", "AaAaAaAAaAaAAa"];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'unfixable') {
				pokemon.say(`eevee general sucks lol`);
			}
			if (name === 'urkerab') {
				this.add('j|urkerab');
			}
			if (name === 'uselesstrainer') {
				sentences = ['huehuehuehue', 'PIZA', 'SPAGUETI', 'RAVIOLI RAVIOLI GIVE ME THE FORMUOLI', 'get ready for PUN-ishment', 'PIU\' RUSPE PER TUTTI, E I MARO\'???'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'vapo') {
				pokemon.say(`/me vapes`);
			}
			if (name === 'vexeniv') {
				pokemon.say(`The Arcana is the means by which all is revealed.`);
			}
			if (name === 'winry') {
				pokemon.say(`fight me irl`);
			}
			if (name === 'xfix') {
				if (this.randomChance(1, 2)) {
					// The classic one
					const hazards = {stealthrock: 1, spikes: 1, toxicspikes: 1, burnspikes: 1, stickyweb: 1};
					let hasHazards = false;
					for (const hazard in hazards) {
						if (pokemon.side.getSideCondition(hazard)) {
							hasHazards = true;
							break;
						}
					}
					if (hasHazards) {
						pokemon.say(`(no haz... too late)`);
					} else {
						pokemon.say(`(no hazards, attacks only, final destination)`);
					}
				} else {
					pokemon.say(`/starthunt 1 + 1 | 2 | 2 + 2 | 4 | Opponent's status soon (answer with three letters) | FNT :)`);
				}
			}
			if (name === 'xjoelituh') {
				pokemon.say(`I won't be haxed again, you will be the next one. UUUUUU`);
			}
			if (name === 'xshiba') { // dd
				pokemon.say(`LINDA IS INDA`);
			}
			if (name === 'zarel') {
				pokemon.say(`Your mom`);
			}
			if (name === 'zebraiken') {
				pokemon.phraseIndex = this.random(3);
				//  Zeb's faint and entry phrases correspond to each other.
				if (pokemon.phraseIndex === 2) {
					pokemon.say(`bzzt n_n`);
				} else if (pokemon.phraseIndex === 1) {
					pokemon.say(`bzzt *_*`);
				} else {
					pokemon.say(`bzzt o_o`);
				}
			}
			if (name === 'zeroluxgiven') {
				pokemon.say(`This should be an electrifying battle!`);
			}
			if (name === 'zodiax') {
				pokemon.say(`Introducing 7 time Grand Champion to the battle!`);
			}
		},
		onFaint(pokemon, source, effect) {
			let name = toId(pokemon.name);

			if (name === 'innovamania') {
				pokemon.side.addSideCondition('healingwish', pokemon, this);
			}
			// Add here salty tears, that is, custom faint phrases.
			let sentences = [];
			// This message is different from others, as it triggers when
			// opponent faints
			if (source && source.name === 'galbia') {
				pokemon.say(`literally 2HKOged`);
			}
			// Actual faint phrases
			if (name === 'acast') {
				pokemon.say(`If only I had more screens...`);
			}
			if (name === 'ace') {
				pokemon.say(`inhale all of this`);
			}
			if (name === 'aelita') {
				pokemon.say(`CODE: LYOKO. Tower deactivated...`);
			}
			if (name === 'ajhockeystar') {
				pokemon.say(`You may have beaten me in battle, but never in hockey.`);
			}
			if (name === 'albacore') {
				pokemon.say(`Joke's on you, I was just testing!`);
			}
			if (name === 'albert') {
				pokemon.say(`You may be good looking, but you're not a piece of art.`);
			}
			if (name === 'always') {
				pokemon.say(`i swear to fucking god how can a single person be this lucky after getting played all the fucking way. you are a mere slave you glorified heap of trash.`);
			}
			if (name === 'am') {
				pokemon.say(`RIP`);
			}
			if (name === 'andy') {
				pokemon.say(`wow r00d! :c`);
			}
			if (name === 'antemortem') {
				pokemon.say(`FUCKING CAMPAIGNERS`);
			}
			if (name === 'anttya') {
				pokemon.say(`Can't beat hax ¯\\_(ツ)_/¯`);
			}
			if (name === 'anty') {
				pokemon.say(`k`);
			}
			if (name === 'articuno') {
				pokemon.say(`This is why you don't get any girls.`);
			}
			if (name === 'ascriptmaster') {
				pokemon.say(`Farewell, my friends. May we meet another day...`);
			}
			if (name === 'astara') {
				sentences = ['/me twerks into oblivion', 'good night ♥', 'Astara Vista Baby'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'asty') {
				pokemon.say(`Bottom kek :^(`);
			}
			if (name === 'atomicllamas') {
				pokemon.say(`(puke)`);
			}
			if (name === 'aurora') {
				pokemon.say(`are you serious you're so bad oh my god haxed ughhhhh`);
			}
			if (name === 'reisen') {
				pokemon.say(`No need for goodbye. I'll see you on the flip side.`);
			}
			if (name === 'beowulf') {
				pokemon.say(`There is no need to be mad`);
			}
			if (name === 'biggie') {
				sentences = ['It was all a dream', 'It\'s gotta be the shoes', 'ヽ༼ຈل͜ຈ༽ﾉ RIOT ヽ༼ຈل͜ຈ༽ﾉ'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'blastchance') {
				pokemon.say(`**oh no!**`);
			}
			if (name === 'blitzamirin') {
				pokemon.say(`The Mirror Can Lie It Doesn't Show What's Inside ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ`);
			}
			if (name === 'bludz') {
				pokemon.say(`zzz`);
			}
			if (name === 'bondie') {
				pokemon.say(`Sigh...`);
			}
			if (name === 'bottt') {
				pokemon.say(`No longer being maintained...`);
			}
			if (name === 'brandon') {
				pokemon.say(`Always leave the crowd wanting more~`);
			}
			if (name === 'bumbadadabum') {
				pokemon.say(`Find another planet make the same mistakes.`);
			}
			if (name === 'bummer') {
				pokemon.say(`Thanks for considering me!`);
			}
			if (name === 'chaos') {
				pokemon.say(`/forcewin chaos`);
				if (this.randomChance(1, 1000)) {
					// Shouldn't happen much, but if this happens it's hilarious.
					pokemon.say(`actually`);
					pokemon.say(`/forcewin ${pokemon.side.name}`);
					this.win(pokemon.side);
				}
			}
			if (name === 'ciran') {
				pokemon.say(`Fun is still banned in the Wi-Fi room!`);
			}
			if (name === 'clefairy') {
				pokemon.say(`flex&no flex zone nightcore remix dj clefairyfreak 2015`);
			}
			if (name === 'coolstorybrobat') {
				let sentence = this.sample([
					"Lol I got slayed", "BRUH!", "I tried", "Going back to those mountains to train brb", "I forgot what fruit had... tasted like...",
				]);
				pokemon.say(`${sentence}`);
			}
			if (name === 'crestfall') {
				pokemon.say(`Her pistol go (bang bang, boom boom, pop pop)`);
			}
			if (name === 'deathonwings') {
				pokemon.say(`DEG's a nub`);
			}
			if (name === 'dirpz') {
				pokemon.say(`sylveon is an eeeveeeeeeelutioooooon....`);
			}
			if (name === 'dmt') {
				pokemon.say(`DMT`);
			}
			if (name === 'dreameatergengar') {
				pokemon.say(`In the darkness I fade. Remember ghosts don't die!`);
			}
			if (name === 'duck') {
				pokemon.say(`Duck you!`);
			}
			if (name === 'e4flint') {
				this.add('chat', `#E4 Flint`, `+n1`);
				this.add('chat', `+sparkyboTTT`, `nice 1`);
			}
			if (name === 'eeveegeneral') {
				sentences = ["bye room, Electrolyte is in charge", "/me secretly cries", "inap!"];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'eyan') {
				pokemon.say(`;-;7`);
			}
			if (name === 'feliburn') {
				pokemon.say(`gg la verga de tu madre`);
			}
			if (name === 'fireburn') {
				pokemon.say(`>:Y`);
			}
			if (name === 'flyingkebab') {
				pokemon.say(`${this.sample(["I\'ll see you in hell!", "/me vanishes to the depths of hell"])}`);
			}
			if (name === 'formerhope') {
				pokemon.say(`Now I have Former Hope.`);
			}
			if (name === 'freeroamer') {
				pokemon.say(`how do people get these matchups...`);
			}
			if (name === 'frysinger') {
				pokemon.say(`/me teleports away from the battle and eats a senzu bean`);
			}
			if (name === 'fx') {
				pokemon.say(`mirror, mirror`);
			}
			if (name === 'galbia') {
				pokemon.say(`(dog)`);
			}
			if (name === 'galom') {
				pokemon.say(`GAME OVER.`);
			}
			if (name === 'rodan') {
				pokemon.say(`The Great Emeralds power allows me to feel... `);
			}
			if (name === 'geoffbruedly') {
				pokemon.say(`IM SORRY WINRY`);
			}
			if (name === 'giagantic') {
				pokemon.say(`x.x`);
			}
			if (name === 'golui') {
				pokemon.say(`Freeze in hell`);
			}
			if (name === 'goodmorningespeon') {
				pokemon.say(`gg wp good hunt would scavenge again`);
			}
			if (name === 'grimauxiliatrix') {
				pokemon.say(`∠( ᐛ 」∠)_`);
			}
			if (name === 'halite') {
				pokemon.say(`Today was your lucky day...`);
			}
			if (name === 'hannah') {
				pokemon.say(`Nooo! ;~;`);
			}
			if (name === 'hashtag') {
				pokemon.say(`fukn immigrants,,, slash me spits`);
			}
			if (name === 'haund') {
				pokemon.say(`omg noob team report`);
			}
			if (name === 'healndeal') {
				pokemon.say(`sadface I should have been a Sylveon`);
			}
			if (name === 'himynamesl') {
				pokemon.say(`hey ${pokemon.side.name}, get good`);
			}
			if (name === 'hippopotas') {
				this.add('-message', 'The sandstorm subsided.');
			}
			if (name === 'hollywood') {
				pokemon.say(`BibleThump`);
			}
			if (name === 'ih8ih8sn0w') {
				pokemon.say(`nice hax :(`);
			}
			if (name === 'imanalt') {
				pokemon.say(`bshax imo`);
			}
			if (name === 'imas234') {
				pokemon.say(`bg no re`);
			}
			if (name === 'innovamania') {
				sentences = ['Did you rage quit?', 'How\'d you lose with this set?'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'iplaytennislol') {
				pokemon.say(`/me des`);
			}
			if (name === 'iyarito') {
				pokemon.say(`Owwnn ;_;`);
			}
			if (name === 'jackhiggins') {
				pokemon.say(`I blame HiMyNamesL`);
			}
			if (name === 'jasmine') {
				this.add('raw',
					`<div class="broadcast-red"><b>The server is restarting soon.</b><br />` +
					`Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>`
				);
			}
			if (name === 'jdarden') {
				pokemon.say(`;-;7`);
			}
			if (name === 'jetpack') {
				pokemon.say(`You shouldn't of done that. ;_;`);
			}
			if (name === 'joim') {
				sentences = ['AVENGE ME, KIDS! AVEEEENGEEE MEEEEEE!!', 'OBEY!', '``This was a triumph, I\'m making a note here: HUGE SUCCESS.``', '``Remember when you tried to kill me twice? Oh how we laughed and laughed! Except I wasn\'t laughing.``', '``I\'m not even angry, I\'m being so sincere right now, even though you broke my heart and killed me. And tore me to pieces. And threw every piece into a fire.``'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'juanma') {
				pokemon.say(`I guess you were right, now you must be the happiest person in the world, ${pokemon.side.name}! You get to be major of 'I-told-you-so' town!`);
			}
			if (name === 'kalalokki') {
				pokemon.say(`(⌐■_■)`);
				pokemon.say(`( •_•)>⌐■-■`);
				pokemon.say(`(x_x)`);
			}
			if (name === 'kidwizard') {
				pokemon.say(`Go to hell.`);
			}
			if (name === 'layell') {
				pokemon.say(`${this.sample(['Alas poor me', 'Goodnight sweet prince'])}`);
			}
			if (name === 'legitimateusername') {
				const CODE_MARKER = '``';
				pokemon.say(`${CODE_MARKER}This isn't brave. It's murder. What did I ever do to you?${CODE_MARKER}`);
			}
			if (name === 'lemonade') {
				pokemon.say(`Pasta`);
			}
			if (name === 'level51') {
				pokemon.say(`u_u!`);
			}
			if (name === 'lj') {
				pokemon.say(`.Blast`);
			}
			if (name === 'lyto') {
				pokemon.say(`${this.sample(['Unacceptable!', 'Mrgrgrgrgr...'])}`);
			}
			if (name === 'macle') {
				pokemon.say(`Follow the Frog Blog - https://gonefroggin.wordpress.com/`);
			}
			if (name === 'manu11') {
				pokemon.say(`so much hax, why do I even try`);
			}
			if (name === 'marshmallon') {
				pokemon.say(`Shoutouts to sombolo and Rory Mercury ... for this trash set -_-`);
			}
			if (name === 'mattl') {
				pokemon.say(`Forgive me. I feel it again... the call from the light.`);
			}
			if (name === 'mcmeghan') {
				pokemon.say(`Out-odded`);
			}
			if (name === 'megazard') {
				pokemon.say(`Old dog`);
			}
			if (name === 'mizuhime') {
				pokemon.say(`I got Gimped.`);
			}
			if (name === 'nv') {
				pokemon.say(`Too cute for this game ;~;`);
			}
			if (name === 'omegaxis') {
				pokemon.say(`bull shit bull sHit thats ✖️ some bullshit rightth ere right✖️there ✖️✖️if i do ƽaү so my selｆ ‼️ i say so ‼️ thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ‼️ HO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ ‼️ Bull shit`);
			}
			if (name === 'orday') {
				pokemon.say(`❄_❄`);
			}
			if (name === 'overneat') {
				pokemon.say(`Ugh! I failed you Iya-sama`);
			}
			if (name === 'paradise') {
				pokemon.say(`RIP THE DREAM`);
			}
			if (name === 'pikachuun') {
				sentences = ['press f to pay respects ;_;7', 'this wouldn\'t have happened in my version', 'wait we were battling?'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'pluviometer') {
				pokemon.say(`GP 2/2`);
			}
			if (name === 'qtrx') {
				sentences = ['Keyboard not found; press **Ctrl + W** to continue...', 'hfowurfbiEU;DHBRFEr92he', 'At least my name ain\'t asgdf...'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'quitequiet') {
				pokemon.say(`Well, I tried at least.`);
			}
			if (name === 'raseri') {
				pokemon.say(`you killed a mush :(`);
			}
			if (name === 'raven') {
				pokemon.say(`I failed the challenge, and for that, I must lose a life. At least I had one to lose in the first place, nerd.`);
			}
			if (name === 'rekeri') {
				pokemon.say(`lucky af :[`);
			}
			if (name === 'rssp1') {
				pokemon.say(`Witness the power of the almighty Rufflet!`);
			}
			if (name === 'rosiethevenusaur') {
				pokemon.say(`${this.sample(['SD SKARM SHALL LIVE AGAIN!!!', 'Not my WiFi!'])}`);
			}
			if (name === 'sailorcosmos') {
				pokemon.say(`Cosmos Gorgeous Retreat!`);
			}
			if (name === 'scotteh') {
				pokemon.say(`▄███████▄.▲.▲.▲.▲.▲.▲`);
				pokemon.say(`█████████████████████▀▀`);
			}
			if (name === 'scpinion') {
				pokemon.say(`guys, I don't even know how to pronounce scpinion`);
			}
			if (name === 'scythernoswiping') {
				pokemon.say(`Aww man!`);
			}
			if (name === 'shrang') {
				pokemon.say(`FUCKING 2 YO KID`);
			}
			if (name === 'sigilyph') {
				pokemon.say(`FROM THE BACK FROM THE BACK FROM THE BACK FROM THE BACK **ANDD**`);
			}
			if (name === 'sirdonovan') {
				this.add('-message', 'RIP sirDonovan');
			}
			if (name === 'skitty') {
				pokemon.say(`!learn skitty, roleplay`);
				this.add('raw',
					`<div class="games light">In Gen 6, Skitty <span class="message-learn-cannotlearn">can't</span> learn Role Play</div>`
				);
			}
			if (name === 'solarisfox') {
				pokemon.say(`So long, and thanks for all the fish.`);
			}
			if (name === 'sonired') {
				pokemon.say(`sigh lucky players.`);
			}
			if (name === 'sparktrain') {
				pokemon.say(`nice`);
			}
			if (name === 'spy') {
				sentences = ['lolhax', 'crit mattered', 'bruh cum @ meh', '>thinking Pokemon takes any skill'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'snobalt') {
				pokemon.say(`Blasphemy!`);
			}
			if (name === 'snowy') {
				pokemon.say(`i never understood this i always hear them be like "yo whats up monica" "u tryna blaze monica"`);
			}
			if (name === 'spacebass') {
				pokemon.say(`And the tales of whales and woe off his liquored toungue will flow, the light will soft white twinkle off the cataracts in his eye`);
				pokemon.say(`So if by chance you're cornered near the bathroom, or he blocks you sprawled in his aisle seat`);
				pokemon.say(`Embrace the chance to hear some tales of greatness, 'cause he's the most interesting ball of toxins you're ever apt to meet`);
			}
			if (name === 'specsmegabeedrill') {
				pokemon.say(`Tryhard.`);
			}
			if (name === 'starmei') {
				pokemon.say(`//message AM, must be nice being this lucky`);
			}
			if (name === 'starry') {
				pokemon.say(`o-oh`);
			}
			if (name === 'steamroll') {
				pokemon.say(`Not my problem anymore!`);
			}
			if (name === 'sunfished') {
				pokemon.say(`*raptor screeches*`);
			}
			if (name === 'sweep') {
				pokemon.say(`You offended :C`);
			}
			if (name === 'talkingtree') {
				pokemon.say(`I am Groot u_u`);
			}
			if (name === 'teg') {
				sentences = ['Save me, Joim!', 'Arcticblast is the worst OM leader in history'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'temporaryanonymous') {
				sentences = [';_;7', 'This kills the tempo', 'I\'m kill. rip.', 'S-senpai! Y-you\'re being too rough! >.<;;;;;;;;;;;;;;;;;', 'A-at least you checked my dubs right?', 'B-but that\'s impossible! This can\'t be! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHGH'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'teremiare') {
				pokemon.say(`sigh...`);
			}
			if (name === 'theimmortal') {
				pokemon.say(`Oh how wrong we were to think immortality meant never dying.`);
			}
			if (name === 'tone114') {
				pokemon.say(`I don't have to take this. I'm going for a walk.`);
			}
			if (name === 'trickster') {
				pokemon.say(`UPLOADING VIRUS.EXE \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 99% COMPLETE`);
			}
			if (name === 'unfixable') {
				pokemon.say(`i may be dead but my eyebrows are better than yours will ever be`);
			}
			if (name === 'urkerab') {
				this.add('l', 'urkerab');
			}
			if (name === 'uselesstrainer') {
				sentences = ['TIME TO SET UP', 'One day I\'ll become a beautiful butterfly'];
				pokemon.say(this.sample(sentences));
			}
			if (name === 'vapo') {
				pokemon.say(`( ; _> ;)`);
			}
			if (name === 'vexeniv') {
				pokemon.say(`brb burning my dread`);
			}
			if (name === 'winry') {
				pokemon.say(`I AM NOT A WEEB`);
			}
			if (name === 'xfix') {
				const foe = pokemon.side.foe.active[0];
				if (foe.name === 'xfix') {
					pokemon.say(`(I won. I lost. I... huh... ~~can somebody tell me what actually happened?~~)`);
				} else if (foe.ability === 'magicbounce') {
					pokemon.say(`(How do mirrors work... oh right, when you use a mirror, your opponent has a mirror as well... or something, ~~that's how you "balance" this game~~)`);
				} else {
					pokemon.say(`~~That must have been a glitch. Hackers.~~`);
				}
			}
			if (name === 'xjoelituh') {
				pokemon.say(`THAT FOR SURE MATTERED. Blame Nayuki. I'm going to play CSGO then.`);
			}
			if (name === 'xshiba') {
				pokemon.say(`Lol that feeling when you just win but get haxed..`);
			}
			if (name === 'zarel') {
				pokemon.say(`your mom`);
				// Followed by the usual '~Zarel fainted'.
				this.add('-message', `~Zarel used your mom!`);
			}
			if (name === 'zebraiken') {
				if (pokemon.phraseIndex === 2) {
					pokemon.say(`bzzt u_u`);
				} else if (pokemon.phraseIndex === 1) {
					pokemon.say(`bzzt ._.`);
				} else {
					// Default faint.
					pokemon.say(`bzzt x_x`);
				}
			}
			if (name === 'zeroluxgiven') {
				pokemon.say(`I've been beaten, what a shock!`);
			}
			if (name === 'zodiax') {
				pokemon.say(`We need to go full out again soon...`);
			}
		},
		// Special switch-out events for some mons.
		onSwitchOut(pokemon) {
			let name = toId(pokemon.name);

			if (!pokemon.illusion) {
				if (name === 'hippopotas') {
					this.add('-message', 'The sandstorm subsided.');
				}
			}

			// Transform
			if (pokemon.originalName) pokemon.name = pokemon.originalName;
		},
		onDisableMove(pokemon) {
			let name = toId(pokemon.name);
			// Enforce choice item locking on custom moves.
			// qtrx only has one move anyway.
			if (name !== 'qtrx') {
				let moves = pokemon.moveSlots;
				if (pokemon.getItem().isChoice && pokemon.lastMove && pokemon.lastMove.id === moves[3].id) {
					for (let i = 0; i < 3; i++) {
						if (!moves[i].disabled) {
							pokemon.disableMove(moves[i].id, false);
						}
					}
				}
			}
		},
		// Specific residual events for custom moves.
		// This allows the format to have kind of custom side effects and volatiles.
		onResidual(battle) {
			// Deal with swapping from qtrx's mega signature move.
			let swapmon1;

			let swapmon2;
			let swapped = false;
			for (let i = 1; i < 6 && !swapped; i++) {
				swapmon1 = battle.sides[0].pokemon[i];
				if (swapmon1.swapping && swapmon1.hp > 0) {
					swapmon1.swapping = false;
					for (let j = 1; j < 6; j++) {
						swapmon2 = battle.sides[1].pokemon[j];
						if (swapmon2.swapping && swapmon2.hp > 0) {
							swapmon2.swapping = false;

							this.add('message', `Link standby... Please wait.`);
							swapmon1.side = battle.sides[1];
							swapmon1.fullname = `${swapmon1.side.id}: ${swapmon1.name}`;
							swapmon1.id = swapmon1.fullname;
							swapmon2.side = battle.sides[0];
							swapmon2.fullname = `${swapmon2.side.id}: ${swapmon2.name}`;
							swapmon2.id = swapmon2.fullname;
							let oldpos = swapmon1.position;
							swapmon1.position = swapmon2.position;
							swapmon2.position = oldpos;
							battle.sides[0].pokemon[i] = swapmon2;
							battle.sides[1].pokemon[j] = swapmon1;

							this.add('chat', `\u2605${swapmon1.side.name}`, `Bye-bye, ${swapmon2.name}!`);
							this.add('chat', `\u2605${swapmon2.side.name}`, `Bye-bye, ${swapmon1.name}!`);
							if (swapmon1.side.active[0].hp && swapmon2.side.active[0].hp) {
								this.add('-anim', swapmon1.side.active, "Healing Wish", swapmon1.side.active);
								this.add('-anim', swapmon2.side.active, "Aura Sphere", swapmon2.side.active);
								this.add('message', `${swapmon2.side.name} received ${swapmon2.name}! Take good care of ${swapmon2.name}!`);
								this.add('-anim', swapmon2.side.active, "Healing Wish", swapmon2.side.active);
								this.add('-anim', swapmon1.side.active, "Aura Sphere", swapmon1.side.active);
								this.add('message', `${swapmon1.side.name} received ${swapmon1.name}! Take good care of ${swapmon1.name}!`);
							} else {
								this.add('message', `${swapmon2.side.name} received ${swapmon2.name}! Take good care of ${swapmon2.name}!`);
								this.add('message', `${swapmon1.side.name} received ${swapmon1.name}! Take good care of ${swapmon1.name}!`);
							}
							swapped = true;
							break;
						}
					}
				}
			}
		},
	},

	// June Jubilee: Revenge, June 2016
	// https://github.com/Zarel/Pokemon-Showdown/tree/b54a1ac9163771f200f13d271624a519120baa49

	{
		name: "[Seasonal] June Jubilee: Revenge",
		mod: 'gen6',

		team: 'randomSeasonalJubilee',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add(
				'message', "You are traveling with your fellow Delibird around the world, " +
				"when your mortal enemy attacks you, seeking revenge since you defeated them on June 2013. " +
				"Palkia inverted space, so you need to help it reach the south pole before summer starts!"
			);
			this.add("raw|<font color='red'><b>Don't let your Delibird faint, or you will automatically lose the battle!</b></font>");
			this.setWeather('Sunny Day');
			delete this.weatherData.duration;

			this.seasonal = {'none':false, 'drizzle':false, 'hail':false};
		},
		onBeforeMove: function (pokemon, target, move) {
			// Reshiram changes weather with its tail until you reach the arctic
			if (pokemon.template.speciesid === 'reshiram' && this.turn < 15) {
				let weatherMsg = '';
				let dice = this.random(100);
				if (dice < 25) {
					this.setWeather('Rain Dance');
					weatherMsg = 'a rainstorm';
				} else if (dice < 50) {
					this.setWeather('Sunny Day');
					weatherMsg = 'a heat wave';
				} else if (dice < 75) {
					this.setWeather('Hail');
					weatherMsg = 'a snowstorm';
				} else {
					this.setWeather('Sandstorm');
					weatherMsg = 'a sandstorm';
				}
				this.add('-message', "Reshiram caused " + weatherMsg + " with its tail!");
				delete this.weatherData.duration;
			}

			if (this.turn >= 4 && this.seasonal.none === false) {
				this.add('-message', "You are travelling south and you have arrived in Sao Paulo! There's a clear sky and the temperature is lower here.");
				this.clearWeather();
				this.seasonal.none = true;
			}
			if (this.turn >= 8 && this.seasonal.drizzle === false) {
				this.add('-message', "You are travelling further south and you have arrived at Tierra del Fuego! It started raining a lot... and it's getting quite cold.");
				this.setWeather('Rain Dance');
				delete this.weatherData.duration;
				this.seasonal.drizzle = true;
			}
			if (this.turn >= 12 && this.seasonal.hail === false) {
				this.add('-message', "You have arrived at the Antarctic! Defeat the other trainer so Delibird can be free!");
				this.setWeather('Hail');
				delete this.weatherData.duration;
				this.seasonal.hail = true;
			}
		},
		onFaint: function (pokemon) {
			if (pokemon.template.id === 'delibird') {
				let name = pokemon.side.name;
				let winner = pokemon.side.id === 'p1' ? 'p2' : 'p1';
				this.add(
					'-message', "No!! You let Delibird down. It trusted you. You lost the battle, " + name +
					". But you lost something else: your Pokémon's trust."
				);
				pokemon.battle.win(winner);
			}
		},
	},

	// Fireworks Frenzy (July - September 2016)
	// https://github.com/Zarel/Pokemon-Showdown/tree/c4719698de756f629b0f5f3a72beaccd44d8535f
	{
		name: "[Seasonal] Fireworks Frenzy",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],
		mod: 'gen6',

		team: 'randomSeasonalFireworks',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('message', "A fireworks show is starting!");
			// this.add('-weather', 'Fireworks'); // un-comment when the client supports custom named weathers
		},
		onResidual: function () {
			if (this.isWeather('')) this.eachEvent('Weather');
		},
		onWeather: function (target) {
			if (!target.hasType('Fire')) this.damage(target.maxhp / 16, target, null, 'exploding fireworks');
		},
	},
];
