'use strict';

/**@type {{[k: string]: ModdedEffectData}} */
let BattleStatuses = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Username|Switch In Message`);
		},
		onSwitchOut: function () {
			this.add(`c|+Username|Switch Out Message`);
		},
		onFaint: function () {
			this.add(`c|+Username|Faint Message`);
		},
		// Innate effects go here
	},
	*/
	// Please keep statuses organized alphabetically based on staff member name!
	'2xthetap': { // No single quotes causes issues
		noCopy: true,
		onStart: function () {
			this.add(`c|%2xTheTap|Time for a heckin' battle.`);
		},
		onSwitchOut: function () {
			this.add(`c|%2xTheTap|Doin' me a heckin' concern.`);
		},
		onFaint: function () {
			this.add(`c|%2xTheTap|Doin' me the final bamboozle.`);
		},
	},
	'5gen': {
		noCopy: true,
		onStart: function () {
			this.add(`c|+5gen|Someone asked for extra sauce?`);
		},
		onSwitchOut: function () {
			this.add(`c|+5gen|Need to get some from the back.`);
		},
		onFaint: function () {
			this.add(`c|+5gen|I'm not dead yet, just changing formes.`);
		},
	},
	acakewearingahat: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+ACakeWearingAHat|h`);
		},
		onSwitchOut: function (source) {
			this.add(`c|+ACakeWearingAHat|${source.side.name} is a nerd`);
		},
		onFaint: function () {
			this.add(`c|+ACakeWearingAHat|According to all known laws of aviation, there is no way that Dunsparce should be able to fly. Its wings are too small to get its fat little body off the ground. Dunsparce, of course, does not learn Fly for this reason. It does learn Roost, though. Cute li'l winged snake thing.`);
		},
		// Fat Snake Innate
		onModifyDefPriority: 6,
		onModifyDef: function (def, pokemon) {
			if (!pokemon.transformed && !pokemon.illusion) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD: function (spd, pokemon) {
			if (!pokemon.transformed && !pokemon.illusion) {
				return this.chainModify(1.5);
			}
		},
	},
	aelita: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Aelita|Transfer, Aelita! Scanner, Aelita! Virtualization!`);
		},
		onSwitchOut: function () {
			this.add(`c|@Aelita|I have a tower to deactivate. See ya!`);
		},
		onFaint: function () {
			this.add(`c|@Aelita|CODE: LYOKO . Tower deactivated... Return to the past, now!`);
		},
	},
	akir: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Akir|hey whats up`);
		},
		onSwitchOut: function () {
			this.add(`c|%Akir|sorry need to build more`);
		},
		onFaint: function () {
			this.add(`c|%Akir|too sleepy, c ya`);
		},
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0 && !target.illusion) {
				this.debug('Solid Rock neutralize');
				return this.chainModify(0.75);
			}
		},
	},
	amaluna: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Amaluna|Please no casual chatting here`);
		},
		onSwitchOut: function () {
			this.add(`c|+Amaluna|It's not too late, it's never too late`);
		},
		onFaint: function () {
			this.add(`c|+Amaluna|Don't talk to me unless you're famous`);
		},
	},
	andy: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Andy >_>|**>_>**`);
		},
		onSwitchOut: function () {
			this.add(`c|@Andy >_>|**<_<**`);
		},
		onFaint: function () {
			this.add(`c|@Andy >_>|u sux >_>`);
		},
	},
	ant: {
		noCopy: true,
		onStart: function () {
			this.add(`c|&ant|the superior ant is here`);
		},
		onSwitchOut: function () {
			this.add(`c|&ant|hasta la vista baby`);
		},
		onFaint: function () {
			this.add(`c|&ant|I'M NOT ANTEMORTEM`);
		},
	},
	aquagtothepast: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+A Quag to The Past|You mess with one Goon, you mess with them all... And they're all here!`);
		},
		onSwitchOut: function () {
			this.add(`c|+A Quag to The Past|Um, no.`);
		},
		onFaint: function () {
			this.add(`c|+A Quag to The Past|...Wait, this isn't the groupchat, is it...`);
		},
	},
	arcticblast: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Arcticblast|My trash friend can do no wrong`);
		},
		onModifyMove: function (move) {
			if (move.id === 'knockoff') {
				move.onAfterHit = function (target, source) {
					if (source.hp) {
						let item = target.takeItem();
						if (item) {
							this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
							this.add(`c|%Arcticblast|+20 ;)`);
						}
					}
				};
			}
		},
		onFaint: function (pokemon) {
			let activeMon = pokemon.side.foe.active[0].template.speciesid;
			if (activeMon === 'greninja') {
				this.add(`c|%Arcticblast|FRIENDS DON’T LET FRIENDS PLAY FROGS`);
			} else if (activeMon === 'pumpkaboosuper') {
				this.add(`c|%Arcticblast|WHY IS MY KAREN PRIZED`);
			} else {
				this.add(`c|%Arcticblast|FREE SKYMIN`);
			}
		},
		onSourceFaint: function (target) {
			if (target.template.speciesid === 'greninja') {
				this.add(`c|%Arcticblast|FRIENDS DON’T LET FRIENDS PLAY FROGS`);
			}
		},
	},
	arrested: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Arrested|Let's get this party started.`);
		},
		onSwitchOut: function () {
			this.add(`c|%Arrested|I need a break, this is getting boring.`);
		},
		onFaint: function () {
			this.add(`c|%Arrested|It's cool, I didn't wanna battle anyway.`);
		},
	},
	arsenal: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Arsenal|Wenger In`);
		},
		onSwitchOut: function () {
			this.add(`c|+Arsenal|Time to watch anime`);
		},
		onFaint: function () {
			this.add(`c|+Arsenal|Wenger Out`);
		},
	},
	beowulf: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Beowulf|/me BUZZES LOUDLY`);
		},
		onSwitchOut: function () {
			this.add(`c|@Beowulf|/me BUZZES LOUDLY`);
		},
		onFaint: function () {
			this.add(`c|@Beowulf|BUZZ BUZZ BUZZ BUZZ`);
		},
	},
	bhrisbrown: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Bhris Brown|Never send a boy to do a mans job`);
		},
		onSwitchOut: function () {
			this.add(`c|+Bhris Brown|Goddamit Nappa...`);
		},
		onFaint: function () {
			this.add(`c|+Bhris Brown|There is one thing I'd like to know...tell me. Will I meet that clown Kakarot in the other world?`);
		},
	},
	biggie: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@biggie|Gamin' on ya`);
		},
		onSwitchOut: function () {
			this.add(`c|@biggie|Mission complete!`);
		},
		onFaint: function () {
			this.add(`c|@biggie|It was all a dream`);
		},
	},
	bimp: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Bimp|Ew it's Bimp -_-`);
		},
		onSwitchOut: function () {
			this.add(`c|+Bimp|Brb getting Chick-Fil-A.`);
		},
		onFaint: function () {
			this.add(`c|+Bimp|Well that was uneventful -_-`);
		},
	},
	bobochan: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@bobochan|Pika Pika! Just kidding, it's just a knock off clone.`);
		},
		onSwitchOut: function () {
			this.add(`c|@bobochan|Time to skedaddle!`);
		},
		onFaint: function () {
			this.add(`c|@bobochan|You cruel trainer for killing an innocent pokemon!`);
		},
	},
	brandon: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Brandon|Let's set some mood music: ${['https://www.youtube.com/watch?time_continue=2&v=xFrGuyw1V8s', 'https://www.youtube.com/watch?v=m3-hY-hlhBg', 'https://www.youtube.com/watch?v=IyYnnUcgeMc', 'https://www.youtube.com/watch?v=na7lIb09898', 'https://www.youtube.com/watch?v=FrLequ6dUdM'][this.random(5)]}`);
		},
		onSwitchOut: function () {
			this.add(`c|%Brandon|I gotta charge my phone brb`);
		},
		onFaint: function () {
			this.add(`c|%Brandon|I need a nap`);
		},
	},
	bumbadadabum: {
		noCopy: true,
		onStart: function () {
			this.add(`c|~bumbadadabum|The Light shall bring victory!`);
		},
		onSwitchOut: function () {
			this.add(`c|~bumbadadabum|Regenerator is very fair and balanced`);
		},
		onFaint: function () {
			this.add(`c|~bumbadadabum|Who will lead my kingdom now?`);
		},
	},
	cantsay: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@cant say|(´・ω・\`)`);
		},
		onSwitchOut: function () {
			this.add(`c|@cant say|wow CTed lol`);
		},
		onFaint: function () {
			this.add(`c|@cant say|bg haxor :(`);
		},
	},
	cc: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%cc|Yo guys! :]`);
		},
		onSwitchOut: function () {
			this.add(`c|%cc|Gotta go brb`);
		},
		onFaint: function () {
			this.add(`c|%cc|Unfort`);
		},
	},
	cerberax: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Cerberax|(╯°□°)╯︵ ┻━┻`);
		},
		onSwitchOut: function () {
			this.add(`c|+Cerberax|┬─┬ ノ( ゜-゜ノ)`);
		},
		onFaint: function () {
			this.add(`c|+Cerberax|┬─┬ ︵ /(.□. \\）`);
		},
	},
	ceteris: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Ceteris|Your loss is inevitable, you best forfeit the battle if you know what's good for you. ╰(⇀︿⇀)つ-]═───`);
		},
		onSwitchOut: function (source) {
			this.add(`c|@Ceteris|Saving the best for last, ${source.side.name}, a wise choice my friend.`);
		},
		onFaint: function () {
			this.add(`c|@Ceteris|IMPOSSIBLE!! THIS IS AN OUTRAGE!! I WILL EXACT MY REVENGE ON YOU ONE DAY (◣_◢)`);
		},
	},
	chaos: {
		noCopy: true,
		// No phrases provided
	},
	chloe: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Chloe|hlelo`);
		},
		onSwitchOut: function () {
			this.add(`c|@Chloe|bubye`);
		},
		onFaint: function () {
			this.add(`c|@Chloe|aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`);
		},
	},
	cleo: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Cleo|Cleo! Cleo! Your friendly neighborhood Sea Leo!`);
		},
		onSwitchOut: function () {
			this.add(`c|%Cleo|bbl~`);
		},
		onFaint: function () {
			this.add(`c|%Cleo|n.n`);
		},
	},
	deg: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%deg|rof`);
		},
		onSwitchOut: function () {
			this.add(`c|%deg|rof`);
		},
		onFaint: function () {
			this.add(`c|%deg|Dream Eater Gengar is an unset.`);
		},
	},
	dragonwhale: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@DragonWhale|i would switch to chomper here`);
		},
	},
	duck: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@duck|Yes, I'm actually a duck. I know.`);
		},
		onSwitchOut: function () {
			this.add(`c|@duck|/me waddles away`);
		},
		onFaint: function () {
			this.add(`c|@duck|Duck you! That move was too op anyway.`);
		},
	},
	e4flint: {
		// Fire type when mega evolving implemented in scripts.js
		noCopy: true,
		onStart: function (target, source) {
			this.add(`c|@E4 Flint|How many Fire-Types do I have now`);
			if (source.template.speciesid !== 'steelixmega' || source.illusion) return;
			this.add('-start', source, 'typeadd', 'Fire');
		},
		onFaint: function () {
			this.add(`c|@E4 Flint|lul ok`);
		},
	},
	explodingdaisies: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%explodingdaisies|For today's weather: DOOOOOM!`);
		},
		onSwitchOut: function () {
			this.add(`c|%explodingdaisies|I WILL DESTROY YOU.......BUT LATER!`);
		},
		onFaint: function () {
			this.add(`c|%explodingdaisies|MY PEOPLE NEED ME!`);
		},
	},
	eien: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Eien|umu!`);
		},
		onFaint: function () {
			this.add(`c|@Eien|This game is Bad Civilization...`);
		},
	},
	eternally: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@eternally|quack`);
		},
		onFaint: function () {
			this.add(`c|@eternally|quack`);
		},
	},
	ev: {
		noCopy: true,
		onStart: function (target) {
			this.add(`c|~EV|Behold! The power of EVOLUTION!`);
			if (target.illusion) return;

			/** @type {{[forme: string]: string[]}} */
			let formes = {
				'flareon': ['Icicle Crash', 'Earthquake', 'Baton Pass', 'Evoblast'],
				'jolteon': ['Ice Beam', 'Flamethrower', 'Baton Pass', 'Evoblast'],
				'vaporeon': ['Recover', 'Heal Bell', 'Baton Pass', 'Evoblast'],
				'espeon': ['Aura Sphere', 'Lovely Kiss', 'Baton Pass', 'Evoblast'],
				'umbreon': ['Knock Off', 'Toxic', 'Baton Pass', 'Evoblast'],
				'leafeon': ['Synthesis', 'High Jump Kick', 'Baton Pass', 'Evoblast'],
				'glaceon': ['Blue Flare', 'Agility', 'Baton Pass', 'Evoblast'],
				'sylveon': ['Earth Power', 'Calm Mind', 'Baton Pass', 'Evoblast'],
			};
			let forme = Object.keys(formes)[this.random(8)];
			this.add(`-anim`, target, 'Geomancy', target);
			target.formeChange(forme);
			target.setAbility('Adaptability');
			// Update movepool
			target.moveSlots = [];
			if (!formes[forme]) throw new Error(`SSB: Can't find moveset for EV's forme: "${forme}".`); // should never happen
			for (const [i, moveid] of formes[forme].entries()) {
				let move = this.getMove(moveid);
				if (!move.id) continue;
				target.moveSlots.push({
					move: move.name,
					id: move.id,
					// @ts-ignore hacky change for EV's set
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
			// @ts-ignore hacky change for EV's set
			pokemon.ppPercentages = pokemon.moveSlots.slice().map(m => {
				return m.pp / m.maxpp;
			});
		},
		onSwitchOut: function () {
			this.add(`c|~EV|We'll be back.`);
		},
		onFaint: function () {
			this.add(`c|~EV|If you __say__ EV it sounds like Eevee. It's actually quite simple.`);
		},
	},
	'false': {
		noCopy: true,
		onStart: function () {
			this.add(`c|&false|٩(•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ`);
		},
		onSwitchOut: function () {
			this.add(`c|&false|٩(๑•◡-๑)۶ⒽⓤⒼ❤`);
		},
		onFaint: function () {
			this.add(`c|&false|ɢ∞פ⋆ᖙᵒᵝ ٩꒰”̮*ू꒱`);
		},
	},
	fomg: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+FOMG|You got this, my friend!`);
		},
		onSwitchOut: function () {
			this.add(`c|+FOMG|/me rolls out`);
		},
		onFaint: function () {
			this.add(`c|+FOMG|Rock in peace...`);
		},
	},
	kalalokki: {
		noCopy: true,
		onStart: function (target) {
			this.add(`c|@Kalalokki|(•_•)`);
			this.add(`c|@Kalalokki|( •_•)>⌐■-■`);
			this.add(`c|@Kalalokki|(⌐■_■)`);
			if (target.illusion) return;
			this.setWeather('raindance');
		},
		onFaint: function () {
			this.add(`c|@Kalalokki|(⌐■_■)`);
			this.add(`c|@Kalalokki|( •_•)>⌐■-■`);
			this.add(`c|@Kalalokki|(x_x)`);
		},
	},
	grimauxiliatrix: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@grimAuxiliatrix|${['A BRAWL IS SURELY BREWING!', 'GOOD DAY FOR A SWELL BATTLE!', 'THIS MATCH WILL GET RED HOT!'][this.random(3)]}`);
		},
		onFaint: function () {
			this.add(`c|@grimAuxiliatrix|**KNOCKOUT!**`);
		},
	},
	// Cant use the exact name because its a pokemon's name
	hippopotasuser: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Hippopotas|Something broke. If you're seeing this message, please PM a staff member about it.`);
			this.add(`c|&HoeenHero|No, its not a bug Hippopotas, stop telling people to PM staff, its annoying.`);
		},
		onSwitchOut: function () {
			this.add(`c|@Hippopotas|Something broke. If you're seeing this message, please PM a staff member about it.`);
			this.add(`c|&HoeenHero|There's still no bug!`);
		},
		onFaint: function () {
			this.add(`c|@Hippopotas|Something broke. If you're seeing this message, please PM a staff member about it.`);
			this.add(`c|&HoeenHero|My PMs are flooded with bug reports :(`);
		},
	},
	hipstersigilyph: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Hipster Sigilyph|You got some issues.`);
		},
		onSwitchOut: function () {
			this.add(`c|+Hipster Sigilyph|Gurl, bye.`);
		},
		onFaint: function () {
			this.add(`c|+Hipster Sigilyph|Back to my cave.`);
		},
	},
	hoeenhero: {
		noCopy: true,
		onStart: function () {
			this.add(`c|&HoeenHero|My scripts will lead me to victory!`);
		},
		onSwitchOut: function () {
			this.add(`c|&HoeenHero|I need to look something up, hold on...`);
		},
		onFaint: function () {
			this.add(`c|&HoeenHero|There must have been a bug in my script ;-;`);
		},
	},
	hubriz: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Hubriz|Just a harmless flower...`);
		},
		onSwitchOut: function () {
			this.add(`c|+Hubriz|I'll bloom once more soon enough!`);
		},
		onFaint: function () {
			this.add(`c|+Hubriz|I burn, I pine, I perish.`);
		},
	},
	hurl: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Hurl|underoos`);
		},
		onSwitchOut: function () {
			this.add(`c|%Hurl|/me hurls out`);
		},
		onFaint: function () {
			this.add(`c|%Hurl|i disappoint people a lot`);
		},
	},
	imagi: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+imagi|/me is eating tiramisu!`);
		},
		onSwitchOut: function () {
			this.add(`c|+imagi|/me is eating more tiramisu!`);
		},
		onFaint: function () {
			this.add(`c|+imagi|/me descends into food coma. x_x`);
		},
	},
	imas: {
		noCopy: true,
		onStart: function (pokemon) {
			let foe = pokemon.side.foe.active[0];
			this.add(`c|%imas|${foe.name} more like suck`);
		},
		onSwitchOut: function () {
			this.add(`c|%imas|oops`);
		},
		onFaint: function () {
			this.add(`c|%imas|oh no`);
		},
	},
	iyarito: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Iyarito|Iyarito is always right`);
		},
		onSwitchOut: function () {
			this.add(`c|@Iyarito|It's all Iyarito's fault`);
		},
		onFaint: function () {
			this.add(`c|@Iyarito|RIP Patrona`);
		},
	},
	jdarden: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%jdarden|I've cultivated some mass during my hibernation`);
		},
		onFaint: function () {
			this.add(`c|%jdarden|Back to my natural state`);
		},
	},
	kaijubunny: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Kaiju Bunny|Hey there! Good luck!`);
		},
		onSwitchOut: function () {
			this.add(`c|%Kaiju Bunny|Don't keep her from battling for too long!`);
		},
		onFaint: function () {
			this.add(`c|%Kaiju Bunny|She tried her best... ;;`);
		},
		// Kaiju Rage Innate
		// onUpdate so toxic orb can activate after. Code mainly copied from Power Construct.
		onUpdate: function (pokemon) {
			if (pokemon.template.speciesid !== 'gligar' || pokemon.transformed || pokemon.illusion || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-activate', pokemon, 'ability: Kaiju Rage');
			pokemon.formeChange('Gliscor', this.effect, true);
			let newHP = Math.floor(Math.floor(2 * pokemon.template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			pokemon.heal(pokemon.maxhp / 4);
			this.add('-heal', pokemon, pokemon.getHealth);
			pokemon.takeItem();
			pokemon.setItem('toxicorb');
			this.add('-message', pokemon.name + '\'s item is now a Toxic Orb!');
			this.add('-message', pokemon.name + '\'s ability is now Poison Heal!');
			this.boost({atk: 2, spe: 1}, pokemon);
		},
	},
	kay: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@kay|Every kiss begins with Kay`);
		},
		onSwitchOut: function () {
			this.add(`c|@kay|くコ:彡`);
		},
		onFaint: function () {
			this.add(`c|@kay|'kay bye!くコ:彡`);
		},
		// Simple Innate
		onBoost: function (boost, target, source, effect) {
			if (source.illusion) return;
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				// @ts-ignore
				boost[i] *= 2;
			}
		},
	},
	kingswordyt: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@KingSwordYT|You're the master of your destiny, take destiny by the horns and have fun!`);
		},
		onSwitchOut: function () {
			this.add(`c|@KingSwordYT|I eat when im upset, and i gotta eat`);
		},
		onFaint: function () {
			this.add(`c|@KingSwordYT|BUAAAAAA IYA AYÚDAME :(`);
		},
	},
	level51: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Level 51|Calculating chance of victory!`);
		},
		onSwitchOut: function () {
			this.add(`c|@Level 51|chance_victory < 1. Recalibrating...`);
		},
		onFaint: function () {
			this.add(`c|@Level 51|**IndexError**: list index out of range`);
		},
	},
	lifeisdank: {
		noCopy: true,
		onStart: function (target) {
			this.add(`c|~LifeisDANK|!!!ლ(⁰⊖⁰ლ) Peent Peent.`);
			if (target.illusion) return;
			this.boost({spe: 2}, target);
		},
		onSwitchOut: function () {
			this.add(`c|~LifeisDANK|!(•⌔• ) Peent Peent.`);
		},
		onFaint: function () {
			this.add(`c|~LifeisDANK|(•⌔•. ) Peent.`);
		},
		// Aerilate innate
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (pokemon.illusion) return;
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Flying';
				move.aerilateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.aerilateBoosted) return this.chainModify([0x1333, 0x1000]);
		},
	},
	lionyx: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Lionyx|Let the storm rage on... for Arendelle!`);
		},
		onSwitchOut: function () {
			this.add(`c|+Lionyx|/me turns away and slams the door`);
		},
		onFaint: function () {
			this.add(`c|+Lionyx|Can't hold it back anymore...`);
		},
	},
	lostseso: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Lost Seso|<3 ( ͡° ͜ʖ ͡°) DANCE WITH ME ( ͡° ͜ʖ ͡°) <3`);
			this.effectData.danceMultiplier = 0;
		},
		onAfterMove: function (pokemon, target, move) {
			if (move.flags.dance) this.effectData.danceMultiplier++;
		},
		onSwitchOut: function () {
			this.add(`c|+Lost Seso|Ran out of ramen, brb`);
		},
		onFaint: function () {
			this.add(`c|+Lost Seso|└[ ─ ಎ ─ ]┘ 0% Battery, feed me ramen please`);
		},
	},
	lycaniumz: {
		noCopy: true,
		onStart: function (pokemon) {
			this.add(`c|+Lycanium Z|It's either I win or you lose, 'cause I won't accept defeat.`);
			if (pokemon.illusion) return;
			let i = 0;
			for (const moveSlot of pokemon.moveSlots) {
				let move = this.getMove(moveSlot.id);
				// @ts-ignore hacky way to reduce purple pill's PP
				moveSlot.pp = Math.floor(((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5) * (pokemon.ppPercentages ? pokemon.ppPercentages[i] : 1));
				i++;
			}
		},
		onBeforeSwitchOut: function (pokemon) {
			if (pokemon.illusion) return;
			// @ts-ignore track percentages to keep purple pills from resetting pp
			pokemon.ppPercentages = pokemon.moveSlots.slice().map(m => {
				return m.pp / m.maxpp;
			});
		},
		onSwitchOut: function () {
			this.add(`c|+Lycanium Z|What I gotta do to get it through to you? I'm superhuman.`);
		},
		onFaint: function () {
			this.add(`c|+Lycanium Z|How can I find you?`);
			this.add(`c|+Lycanium Z|Who do you turn to?`);
			this.add(`c|+Lycanium Z|How do I bind you?`);
		},
	},
	macchaeger: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@MacChaeger|What are you gonna do with that big bat? Gonna hit me? Better make it count. Better make it hurt. Better kill me in one shot.`);
		},
		onFaint: function () {
			this.add(`c|@MacChaeger|im gonna pyuk`);
		},
	},
	majorbowman: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@MajorBowman|I'm MajorBowman and I'm here to make it clear.`);
		},
		onSwitchOut: function () {
			this.add(`c|@MajorBowman|Witty catch phrase, you know what I mean?`);
		},
		onFaint: function () {
			this.add(`c|@MajorBowman|THEY GOT ME, GAL`);
		},
	},
	martha: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%martha|in to lose r1`);
		},
		onSwitchOut: function () {
			this.add(`c|%martha|bad`);
		},
	},
	marty: {
		noCopy: true,
		// No phrases provided
	},
	meicoo: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Meicoo|/joinhunt`);
		},
		onSwitchOut: function () {
			this.add(`c|%Meicoo|/leavehunt`);
		},
		onFaint: function () {
			this.add(`c|%Meicoo|"That is not the answer - try again!"`);
		},
	},
	megazard: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Megazard|Almond top of the world!`);
		},
		onSwitchOut: function () {
			this.add(`c|@Megazard|Change of plants`);
		},
		onFaint: function () {
			this.add(`c|@Megazard|Better luck next thyme`);
		},
	},
	mickthespud: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%MicktheSpud|Woah!`);
		},
		onSwitchOut: function () {
			this.add(`c|%MicktheSpud|Woah!`);
		},
		onFaint: function () {
			this.add(`c|%MicktheSpud|Woah!`);
		},
	},
	mitsuki: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Mitsuki|SSSSSSSSSSSSS`);
		},
		onSwitchOut: function () {
			this.add(`c|%Mitsuki|sssssssssssss`);
		},
		onFaint: function () {
			this.add(`c|%Mitsuki|sss`);
		},
	},
	moo: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@moo|/me moo`);
		},
		onSwitchOut: function () {
			this.add(`c|@moo|/me moo`);
		},
		onFaint: function () {
			this.add(`c|@moo|/me moo`);
		},
	},
	morfent: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Morfent ( _̀> ̀)|──────▀█████▄──────▲`);
			this.add(`c|@Morfent ( _̀> ̀)|───▄███████████▄──◀█▶`);
			this.add(`c|@Morfent ( _̀> ̀)|─────▄████▀█▄──────█`);
			this.add(`c|@Morfent ( _̀> ̀)|───▄█████████████████▄ -I`);
			this.add(`c|@Morfent ( _̀> ̀)|─▄█████.▼.▼.▼.▼.▼.▼.▼  -cast`);
			this.add(`c|@Morfent ( _̀> ̀)|▄███████▄.▲.▲.▲.▲.▲.▲  -magic`);
			this.add(`c|@Morfent ( _̀> ̀)|█████████████████████▀▀-shitpost`);
		},
		onFaint: function () {
			// Morfent returns something so im doing it this way
			let endquote = this.random(3);
			if (endquote === 1) {
				this.add(`c|@Morfent ( _̀> ̀)|Hacking claims the lives of over 2,000 registered laddering alts every day.`);
			} else if (endquote === 2) {
				this.add(`c|@Morfent ( _̀> ̀)|Every 60 seconds in Africa, a minute passes. Together we can stop this. Please spread the word.`);
			} else {
				this.add(`c|@Morfent ( _̀> ̀)|!dt morfent's husbando`);
				this.add(`raw|<ul class="utilichart"><li class="result"><span class="col numcol">UU</span> <span class="col iconcol"><span class="picon" style="background: transparent url(&quot;//play.pokemonshowdown.com/sprites/smicons-sheet.png?a4&quot;) no-repeat scroll -400px -210px"></span></span> <span class="col pokemonnamecol" style="white-space: nowrap"><a href="https://pokemonshowdown.com/dex/pokemon/gengar" target="_blank" rel="noopener">Gengar</a></span> <span class="col typecol"><img src="https://play.pokemonshowdown.com/sprites/types/Ghost.png" alt="Ghost" height="14" width="32"><img src="https://play.pokemonshowdown.com/sprites/types/Poison.png" alt="Poison" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">Cursed Body</span><span class="col abilitycol"></span></span><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>60</span> <span class="col statcol"><em>Atk</em><br>65</span> <span class="col statcol"><em>Def</em><br>60</span> <span class="col statcol"><em>SpA</em><br>130</span> <span class="col statcol"><em>SpD</em><br>75</span> <span class="col statcol"><em>Spe</em><br>110</span> <span class="col bstcol"><em>BST<br>500</em></span> </span></li><li style="clear: both"></li></ul>`);
				this.add(`raw|<font size="1"><font color="#686868">Dex#:</font> 94&nbsp;|  <font color="#686868">Gen:</font> 1&nbsp;|  <font color="#686868">Height:</font> 1.5 m&nbsp;|  <font color="#686868">Weight:</font> 40.5 kg <em>(60 BP)</em>&nbsp;|  <font color="#686868">Dex Colour:</font> Purple&nbsp;|  <font color="#686868">Egg Group(s):</font> Amorphous&nbsp;|  <font color="#686868">Does Not Evolve</font></font>`);
			}
		},
	},
	nui: {
		noCopy: true,
		onStart: function () {
			this.add(`c|&nui|（*＾3＾）`);
		},
		onSwitchOut: function () {
			this.add(`c|&nui|(´◔‸◔\`) **??+ !`);
		},
		onFaint: function () {
			this.add(`c|&nui|(◕︿◕✿)`);
		},
	},
	om: {
		noCopy: true,
		onStart: function (target, source) {
			source.types = ["Fire", "Fairy"];
			this.add(`c|@OM|use shift gear`);
			this.add('-start', source, 'typeadd', 'Fairy');
		},
		onSwitchOut: function () {
			this.add(`c|@OM|Ok brb I'm gonna ${["ladder Mix and Mega", "roll battle some surv regs real quick", "sweep y'all in mafia let's get it"][this.random(3)]}`);
		},
		onFaint: function () {
			this.add(`c|@OM|${["Oh god I rolled a 1", "Killed Night 1, seriously?"][this.random(2)]}`);
		},
	},
	osiris: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Osiris|THE SECRET INGREDIENT IS`);
		},
		onSwitchOut: function () {
			this.add(`c|+Osiris|god's plan`);
		},
		onFaint: function () {
			this.add(`c|+Osiris|I'm getting too old for this x_x`);
		},
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0 && !target.illusion) {
				this.debug('Solid Rock neutralize');
				return this.chainModify(0.75);
			}
		},
	},
	overneat: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Overneat|[muffled eurobeat playing in the distance]`);
		},
		onSwitchOut: function () {
			this.add(`c|+Overneat|Time to take a rest`);
		},
		onFaint: function () {
			this.add(`c|+Overneat|It’s over for me?`);
		},
	},
	paradise: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Paradise|⠠⠺⠓⠁⠞⠀⠞⠓⠑⠀⠋⠥⠉⠅⠀⠙⠊⠙⠀⠽⠕⠥⠀⠚⠥⠎⠞⠀⠋⠥⠉⠅⠊⠝⠛⠀⠎⠁⠽⠀⠁⠃⠕⠥⠞⠀⠍⠑,⠀⠽⠕⠥⠀⠇⠊⠞⠞⠇⠑⠀⠃⠊⠞⠉⠓?`);
		},
		onSwitchOut: function () {
			this.add(`c|@Paradise|Braille is the only language you need.`);
		},
		onFaint: function () {
			this.add(`c|@Paradise|⠠⠽⠕⠥’⠗⠑⠀⠋⠥⠉⠅⠊⠝⠛⠀⠙⠑⠁⠙,⠀⠅⠊⠙⠙⠕.`);
		},
	},
	pluviometer: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@pluviometer|${["Need a GP check?", "I'm a switch-in and I'm switching in #hyphenation"][this.random(2)]}`);
		},
		onSwitchOut: function () {
			this.add(`c|@pluviometer|${["I wish this were a better matchup #subjunctive", "GP 1/2", "GP 2/2"][this.random(3)]}`);
		},
		onFaint: function () {
			this.add(`c|@pluviometer|${["Follow SmogonU on Facebook! https://www.facebook.com/SmogonU", "Follow SmogonU on Twitter! https://twitter.com/SmogonU"][this.random(2)]}`);
		},
	},
	ptoad: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+ptoad⚬|Make it rain!`);
		},
		onSwitchOut: function () {
			this.add(`c|+ptoad⚬|Oh. You're switching me out. No, it's fine, I "toad"ally get it.`);
		},
		onFaint: function () {
			this.add(`c|+ptoad⚬|Wow. Way to rain on my parade.`);
		},
	},
	psynergy: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Psynergy|oh`);
		},
		onSwitchOut: function () {
			this.add(`c|+Psynergy|Joe doesn't pay me enough for this`);
		},
		onFaint: function () {
			this.add(`c|+Psynergy|I'm going to be late...`);
		},
	},
	quitequiet: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Quite Quiet|spooky :d`);
		},
		onFaint: function () {
			this.add(`c|@Quite Quiet|:'(`);
		},
		onModifyDefPriority: 6,
		onModifyDef: function (def, pokemon) {
			if (pokemon.illusion) return;
			if (!pokemon.transformed) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.illusion) return;
			if (!pokemon.transformed) {
				return this.chainModify(1.5);
			}
		},
	},
	rorymercury: {
		noCopy: true,
		onStart: function (pokemon) {
			this.add(`c|+Rory Mercury|guess I'm in charge now`);
			if (pokemon.illusion) return;
			this.boost({atk: 1}, pokemon);
		},
		onSwitchOut: function () {
			this.add(`c|+Rory Mercury|brb`);
		},
		onFaint: function () {
			this.add(`c|+Rory Mercury|/me shook af`);
		},
	},
	saburo: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Saburo|Look beyond what you see`);
		},
		onSwitchOut: function () {
			this.add(`c|+Saburo|Gotta go teleport somewhere brb`);
		},
		onFaint: function () {
			this.add(`c|+Saburo|...you see too much`);
		},
	},
	samjo: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+SamJo|Heyo/ Hope your day's been fantasthicc! Woo!`);
		},
		onSwitchOut: function () {
			this.add(`c|+SamJo|Catch ya later, stay thicc my friends o/`);
		},
		onFaint: function () {
			this.add(`c|+SamJo|Oof, gotta get thiccer……. ;(`);
		},
	},
	scotteh: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Scotteh|─────▄▄████▀█▄`);
			this.add(`c|@Scotteh|───▄██████████████████▄`);
			this.add(`c|@Scotteh|─▄█████.▼.▼.▼.▼.▼.▼.▼`);
		},
		onSwitchOut: function () {
			this.add(`c|@Scotteh|▄███████▄.▲.▲.▲.▲.▲.▲`);
			this.add(`c|@Scotteh|█████████████████████▀▀`);
		},
		onFaint: function () {
			this.add(`c|@Scotteh|▄███████▄.▲.▲.▲.▲.▲.▲`);
			this.add(`c|@Scotteh|█████████████████████▀▀`);
		},
	},
	shiba: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Shiba|LINDA IS INDA`);
		},
		onSwitchOut: function () {
			this.add(`c|%Shiba|gotta buy an alt rq brb`);
		},
	},
	slowbroth: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Slowbroth|DETECTING FOREIGN SPECIES...`);
		},
		onSwitchOut: function () {
			this.add(`c|+Slowbroth|TELEPORTING TO ALTERNATE DIMENSION...`);
		},
		onFaint: function () {
			this.add(`c|+Slowbroth|HARDWARE DAMAGE PERMANENT...`);
		},
	},
	snaquaza: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Snaquaza|Snaq is baq... with a vengeance!`);
		},
		onSwitchOut: function (pokemon) {
			this.add(`c|%Snaquaza|Lynch Hoeen while I'm away...`);
			// @ts-ignore Hack for Snaquaza's Z move
			if (pokemon.claimHP) delete pokemon.claimHP;
		},
		onFaint: function () {
			this.add(`c|%Snaquaza|How did you know I was scum?`);
		},
		onDamage: function (damage, pokemon) {
			// @ts-ignore Hack for Snaquaza's Z move
			if (!pokemon.claimHP) return;
			// Prevent Snaquaza from fainting while using a fake claim to prevent visual bug
			if (pokemon.hp - damage <= 0) return (pokemon.hp - 1);
		},
		onAfterDamage: function (damage, pokemon) {
			// @ts-ignore Hack for Snaquaza's Z move
			if (!pokemon.claimHP || pokemon.hp > 1) return;
			// Now we handle the fake claim "fainting"
			// @ts-ignore Hack for Snaquaza's Z move
			pokemon.hp = pokemon.claimHP;
			pokemon.formeChange(pokemon.baseTemplate.id);
			pokemon.moveSlots = pokemon.moveSlots.slice(0, 4);
			this.add('message', `${pokemon.name}'s fake claim was uncovered!`);
			// @ts-ignore Hack for Snaquaza's Z move
			delete pokemon.claimHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
	},
	spacebass: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@SpaceBass|ಠ_ಠﾉ(_̅_̅_̅_̅_̲̅м̲̅a̲̅я̲̅i̲̅j̲̅u̲̅a̲̅n̲̅a̲̅_̅_̅_̅()ڪے~ `);
		},
		onSwitchOut: function (pokemon) {
			this.add(`c|@SpaceBass|**ಠ_ಠ** `);
			if (pokemon.illusion) return;
			// Innate - heals 40% on switch out
			pokemon.heal(pokemon.maxhp * 0.4);
		},
		onFaint: function () {
			this.add(`c|@SpaceBass|bg`);
		},
	},
	sungodvolcarona: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+SunGodVolcarona|Praise the Sun and live a happy life.`);
		},
		onSwitchOut: function () {
			this.add(`c|+SunGodVolcarona|You dare switch out a god?`);
		},
		onFaint: function () {
			this.add(`c|+SunGodVolcarona|All Suns have to set at one point.`);
		},
	},
	teclis: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%Teclis|Sometimes you have to fight to get your point across.`);
		},
		onSwitchOut: function () {
			this.add(`c|%Teclis|You deserve a break.`);
		},
		onFaint: function () {
			this.add(`c|%Teclis|I'm convinced !`);
		},
	},
	tennisace: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@tennisace|VIVA LOS TIGRES`);
		},
		onSwitchOut: function () {
			this.add(`c|@tennisace|wtf is this shit even`);
		},
		onFaint: function () {
			this.add(`c|@tennisace|maybe next season n_n`);
		},
	},
	teremiare: {
		noCopy: true,
		onStart: function (source) {
			this.add(`c|%Teremiare|<('o'<)`);
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
			this.add(`c|%Teremiare|(>'o')>`);
		},
	},
	theimmortal: {
		noCopy: true,
		onStart: function () {
			this.add(`c|~The Immortal|h-hi`);
		},
		onSwitchOut: function () {
			this.add(`c|~The Immortal|ok`);
		},
		onFaint: function () {
			this.add(`c|~The Immortal|zzz`);
		},
	},
	theleprechaun: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+The Leprechaun|Let's get this bread`);
		},
		onSwitchOut: function () {
			this.add(`c|+The Leprechaun|I'm out this mutherfucker`);
		},
		onFaint: function () {
			this.add(`c|+The Leprechaun|This ain't it chief`);
		},
	},
	tiksi: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Tiksi|Hakkaa päälle! For the King of the Woodland!`);
		},
		onSwitchOut: function () {
			this.add(`c|@Tiksi|TI rigged this ok`);
		},
		onFaint: function (pokemon) {
			this.add(`c|@Tiksi|You rotten ${pokemon.side.foe.name}! I'll send you to the Tiksi branch!`);
		},
	},
	torkool: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%torkool|:peepodetective:`);
		},
		onSwitchOut: function () {
			this.add(`c|%torkool|i cba`);
		},
		onFaint: function () {
			this.add(`c|%torkool|I don't deserve this...`);
		},
	},
	trickster: {
		noCopy: true,
		onStart: function () {
			this.add(`c|@Trickster|(◕‿◕✿)`);
		},
		onSwitchOut: function () {
			this.add(`c|@Trickster|(◠﹏◠✿)`);
		},
		onFaint: function () {
			this.add(`c|@Trickster|(✖﹏✖✿)`);
		},
	},
	unleashourpassion: {
		noCopy: true,
		onStart: function () {
			this.add(`c|%UnleashOurPassion|1v1 me if real`);
		},
		onSwitchOut: function () {
			this.add(`c|%UnleashOurPassion|Tfw you remember switching exists`);
		},
		onFaint: function () {
			this.add(`c|%UnleashOurPassion|That's hax! You were supposed to miss`);
		},
	},
	urkerab: {
		noCopy: true,
		onStart: function () {
			this.add(`j|%urkerab`);
		},
		onSwitchOut: function () {
			this.add(`l|%urkerab`);
		},
		onFaint: function () {
			this.add(`l|%urkerab`);
		},
	},
	uselesscrab: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Uselesscrab|/me !`);
		},
		onSwitchOut: function () {
			this.add(`c|+Uselesscrab|hilarious`);
		},
		onFaint: function () {
			this.add(`c|+Uselesscrab|i love pokemon`);
		},
	},
	volco: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Volco|Get Ready, I'm going to take you down!`);
		},
		onSwitchOut: function () {
			this.add(`c|+Volco|I've decided to spare you, lucky you.`);
		},
		onFaint: function () {
			this.add(`c|+Volco|Well, seems I was got taken down instead.`);
		},
	},
	xayahh: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Xayahh|Let's dance!`);
		},
		onSwitchOut: function () {
			this.add(`c|+Xayahh|Fine, I'll go.`);
		},
		onFaint: function () {
			this.add(`c|+Xayahh|All out of second dances...`);
		},
	},
	xprienzo: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+XpRienzo ☑◡☑|Bleh`);
		},
		onSwitchOut: function () {
			this.add(`c|+XpRienzo ☑◡☑|>.>`);
		},
		onFaint: function () {
			this.add(`c|+XpRienzo ☑◡☑|Wait what?`);
		},
	},
	yuki: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Yuki|My ice may be a little __cold__, but your plan has been put completely on __hold__!`);
		},
		onSwitchOut: function () {
			this.add(`c|+Yuki|I-It's too hot in here!`);
		},
		onFaint: function () {
			this.add(`c|+Yuki|I'm melting...`);
		},
	},
	zarel: {
		noCopy: true,
		onStart: function () {
			this.add(`c|~Zarel|Your mom`);
		},
		onFaint: function () {
			this.add(`c|~Zarel|Your mom`);
			// message is shown after the "Zarel Fainted!" message
			this.add('message', 'Zarel used your mom!');
		},
	},
	zyguser: {
		noCopy: true,
		onStart: function () {
			this.add(`c|+Zyg|/me sighs`);
		},
		onSwitchOut: function () {
			this.add(`c|+Zyg|/me sighs`);
		},
		onFaint: function () {
			this.add(`c|+Zyg|Brexit means Brexit`);
		},
	},
	// Custom effect for Yuki
	cutietrap: {
		duration: 5,
		noCopy: true,
		onStart: function (pokemon, source) {
			if (!this.runEvent('Attract', pokemon, source)) {
				this.debug('Attract event failed');
				return false;
			}
			this.add('-start', pokemon, 'Attract', '[from] move: Cutie Trap', '[of] ' + source);
			this.add('-message', `${pokemon.name} was trapped by love!`);
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon) {
			this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectData.source);
			if (this.randomChance(1, 2)) {
				this.add('cant', pokemon, 'Attract');
				return false;
			}
		},
		onTrapPokemon: function (pokemon) {
			pokemon.tryTrap();
		},
		onEnd: function (pokemon) {
			this.add('-end', pokemon, 'Attract', '[silent]');
			this.add('-message', `${pokemon.name} is no longer trapped by love.`);
		},
	},
	// Modified hail for Yuki
	hail: {
		inherit: true,
		onStart: function (battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (this.gen <= 5 || effect.id === 'snowstorm') this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
	},
	// boostreplacement condition for nui's zmove
	boostreplacement: {
		// this is a side condition
		name: 'boostreplacement',
		id: 'boostreplacement',
		onStart: function (side, source) {
			this.effectData.position = source.position;
		},
		onSwitchInPriority: 1,
		onSwitchIn: function (target) {
			if (!target.fainted && target.position === this.effectData.position) {
				this.boost({def: 1, spd: 1});
				target.side.removeSideCondition('boostreplacement');
			}
		},
	},
	// Prevents glitch out from running more than once per turn per pokemon & boosts base power
	glitchout: {
		duration: 1,
		onTryHit: function (target, source, move) {
			if (move.basePower) {
				move.basePower += 20;
				this.debug('glitch out base power boost');
			}
		},
	},
	// Modified type setup for arceus
	arceus: {
		inherit: true,
		onType: function (types, pokemon) {
			if (pokemon.transformed) return types;
			/** @type {string | undefined} */
			let type = 'Normal';
			if (pokemon.ability === 'multitype' || pokemon.ability === 'logia') {
				type = pokemon.getItem().onPlate;
				if (!type) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
};

exports.BattleStatuses = BattleStatuses;
