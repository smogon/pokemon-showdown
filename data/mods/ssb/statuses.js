'use strict';

/**@type {{[k: string]: ModdedPureEffectData}} */
let BattleStatuses = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart() {
			this.add(`c|+Username|Switch In Message`);
		},
		onSwitchOut() {
			this.add(`c|+Username|Switch Out Message`);
		},
		onFaint() {
			this.add(`c|+Username|Faint Message`);
		},
		// Innate effects go here
	},
	*/
	// Please keep statuses organized alphabetically based on staff member name!
	'2xthetap': { // No single quotes causes issues
		noCopy: true,
		onStart() {
			this.add(`c|+2xTheTap|Time for a heckin' battle.`);
		},
		onSwitchOut() {
			this.add(`c|+2xTheTap|Doin' me a heckin' concern.`);
		},
		onFaint() {
			this.add(`c|+2xTheTap|Doin' me the final bamboozle.`);
		},
	},
	'5gen': {
		noCopy: true,
		onStart(source) {
			this.add(`c|+5gen|Someone asked for extra sauce?`);
			if (source.illusion) return;
			this.field.setWeather('sunnyday', source);
		},
		onSwitchOut() {
			this.add(`c|+5gen|Need to get some from the back.`);
		},
		onFaint() {
			this.add(`c|+5gen|I'm not dead yet, just changing formes.`);
		},
	},
	aelita: {
		noCopy: true,
		onStart() {
			this.add(`c|@Aelita|Transfer, Aelita! Scanner, Aelita! Virtualization!`);
		},
		onSwitchOut() {
			this.add(`c|@Aelita|I have a tower to deactivate. See ya!`);
		},
		onFaint() {
			this.add(`c|@Aelita|CODE: LYOKO . Tower deactivated... Return to the past, now!`);
		},
	},
	aeonic: {
		noCopy: true,
		onStart() {
			this.add(`c|%Aeonic|Guys the emoji movie wasn't __that__ bad`);
		},
		onSwitchOut() {
			this.add(`c|%Aeonic|Still better than kie btw`);
		},
		onFaint() {
			this.add(`c|%Aeonic|Don't forget me`);
		},
	},
	aethernum: {
		noCopy: true,
		onStart() {
			this.add(`c|@Aethernum|I am __Eterno__, fear me! ...or not...but you should! ...or not...`);
		},
		onSwitchOut() {
			this.add(`c|@Aethernum|I'm not defeated, i'm just afk :^)`);
		},
		onFaint() {
			this.add(`c|@Aethernum| Has been fun! But i'm too lazy to keep fighting ^_^'`);
		},
	},
	akiamara: {
		noCopy: true,
		onStart() {
			this.add(`c|+Akiamara|alguem br?`);
		},
		onSwitchOut() {
			this.add(`c|+Akiamara|Pode me multar que já volto`);
		},
		onFaint() {
			this.add(`c|+Akiamara|I'm going to report you to my big fren Mitsuki`);
		},
	},
	akir: {
		noCopy: true,
		onStart() {
			this.add(`c|%Akir|hey whats up`);
		},
		onSwitchOut(pokemon) {
			this.add(`c|%Akir|sorry need to build more`);
			if (pokemon.illusion) return;
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		onFaint() {
			this.add(`c|%Akir|too sleepy, c ya`);
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move) && !target.illusion) {
				this.debug('Mushroom Guard halves damage.');
				return this.chainModify(0.5);
			}
		},
	},
	alpha: {
		noCopy: true,
		onStart() {
			this.add(`c|@Alpha|MAMMA MIA! It's me, ALPHA!`);
		},
		onSwitchOut() {
			this.add(`c|@Alpha|brb gonna eat some pizza`);
		},
		onFaint() {
			this.add(`c|@Alpha|PER LA PATRIA!`);
		},
	},
	andrew: {
		noCopy: true,
		onStart() {
			this.add(`c|%Andrew|Hah! You better have BURN HEAL!`);
		},
		onSwitchOut() {
			this.add(`c|%Andrew|brb kuncing`);
		},
		onFaint() {
			this.add(`c|%Andrew|<_<`);
		},
	},
	anubis: {
		noCopy: true,
		onStart() {
			this.add(`c|&Anubis|hi ur qt`);
			// In loving memory of the SSB programming team's sanity.
			if (this.random(300) === 272) this.add(`c|~HoeenHero|Anubis's set is OP against programmer sanity.`);
		},
		onSwitchOut() {
			this.add(`c|&Anubis|brb making coffee`);
		},
		onFaint() {
			this.add(`c|&Anubis|worthless evildoer :(`);
		},
	},
	aquagtothepast: {
		noCopy: true,
		onStart() {
			this.add(`c|+A Quag to The Past|The Goons are all here`);
		},
		onSwitchOut() {
			this.add(`c|+A Quag to The Past|um no`);
		},
		onFaint() {
			this.add(`c|+A Quag to The Past|Wait, this isn't the groupchat...`);
		},
	},
	arandomduck: {
		noCopy: true,
		onStart() {
			this.add(`c|+a random duck|SWANNA LOSE???`);
		},
		onSwitchOut() {
			this.add(`c|+a random duck|YEET`);
		},
		onFaint() {
			this.add(`c|+a random duck|I guess that was my swan song`);
		},
	},
	arcticblast: {
		noCopy: true,
		onStart() {
			this.add(`c|%Arcticblast|My trash friend can do no wrong`);
		},
		onModifyMove(move) {
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
		onFaint(pokemon) {
			let activeMon = pokemon.side.foe.active[0].template.speciesid;
			if (activeMon === 'greninja') {
				this.add(`c|%Arcticblast|FRIENDS DON’T LET FRIENDS PLAY FROGS`);
			} else if (activeMon === 'pumpkaboosuper') {
				this.add(`c|%Arcticblast|WHY IS MY KAREN PRIZED`);
			} else {
				this.add(`c|%Arcticblast|FREE SKYMIN`);
			}
		},
		onSourceFaint(target) {
			if (target.template.speciesid === 'greninja') {
				this.add(`c|%Arcticblast|FRIENDS DON’T LET FRIENDS PLAY FROGS`);
			}
		},
	},
	arsenal: {
		noCopy: true,
		onStart() {
			this.add(`c|+Arsenal|Wenger In`);
		},
		onSwitchOut() {
			this.add(`c|+Arsenal|Time to watch anime`);
		},
		onFaint() {
			this.add(`c|+Arsenal|Wenger Out`);
		},
	},
	asheviere: {
		noCopy: true,
		onStart() {
			this.add(`c|~Asheviere|The Light shall bring victory!`);
		},
		onSwitchOut() {
			this.add(`c|~Asheviere|Regenerator is very fair and balanced`);
		},
		onFaint() {
			this.add(`c|~Asheviere|Who will lead my kingdom now?`);
		},
	},
	averardo: {
		noCopy: true,
		onStart() {
			this.add(`c|+Averardo|ECCOMI`);
		},
		onSwitchOut() {
			this.add(`c|+Averardo|Scillato (PA)`);
		},
		onFaint() {
			this.add(`c|+Averardo|Non mi sporcare più i MP`);
		},
	},
	beowulf: {
		noCopy: true,
		onStart() {
			this.add(`c|@Beowulf|/me BUZZES LOUDLY`);
		},
		onSwitchOut() {
			this.add(`c|@Beowulf|/me BUZZES LOUDLY`);
		},
		onFaint() {
			this.add(`c|@Beowulf|BUZZ BUZZ BUZZ BUZZ`);
		},
	},
	biggie: {
		noCopy: true,
		onStart() {
			this.add(`c|@biggie|Gamin' on ya`);
		},
		onSwitchOut() {
			this.add(`c|@biggie|Mission complete!`);
		},
		onFaint() {
			this.add(`c|@biggie|It was all a dream`);
		},
	},
	birdy: {
		noCopy: true,
		onStart() {
			this.add(`c|+Birdy~!|And I oop- uh, I mean, hi!`);
		},
		onSwitchOut() {
			this.add(`c|+Birdy~!|Be like that, then. Don't blame ME if you lose.`);
		},
		onFaint() {
			this.add(`c|+Birdy~!|My last words will always be that I don't spam.`);
		},
		// Feather Tuft Innate
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (!pokemon.transformed && !pokemon.illusion) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (!pokemon.transformed && !pokemon.illusion) {
				return this.chainModify(1.5);
			}
		},
	},
	bobochan: {
		noCopy: true,
		onStart() {
			this.add(`c|@bobochan|Pika Pika! Just kidding, it's just a knock off clone.`);
		},
		onSwitchOut() {
			this.add(`c|@bobochan|Time to skedaddle!`);
		},
		onFaint() {
			this.add(`c|@bobochan|You cruel trainer for killing an innocent pokemon!`);
		},
	},
	brandon: {
		noCopy: true,
		onStart() {
			this.add(`c|%Brandon|Let's put the petal to the medal!`);
		},
		onSwitchOut() {
			this.add(`c|%Brandon|I gotta charge my phone brb`);
		},
		onFaint() {
			this.add(`c|%Brandon|I need a nap`);
		},
	},
	cake: {
		noCopy: true,
		onStart(source) {
			this.add(`c|+Cake|h`);
			if (source.illusion) return;
			this.add('-start', source, 'typeadd', 'Ghost');
		},
		onSwitchOut(source) {
			this.add(`c|+Cake|${source.side.name} is a nerd`);
		},
		onFaint() {
			this.add(`c|+Cake|According to all known laws of aviation, there is no way that Dunsparce should be able to fly. Its wings are too small to get its fat little body off the ground. Dunsparce, of course, does not learn Fly for this reason. It does learn Roost, though. Cute li'l winged snake thing.`);
		},
		// Fat Snake Innate
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (!pokemon.transformed && !pokemon.illusion) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (!pokemon.transformed && !pokemon.illusion) {
				return this.chainModify(1.5);
			}
		},
	},
	ckilgannon: {
		noCopy: true,
		onStart() {
			this.add(`c|+c.kilgannon|Hope you're not afraid of the dark!`);
		},
		onSwitchOut() {
			this.add(`c|+c.kilgannon|/me growls`);
		},
		onFaint() {
			this.add(`c|+c.kilgannon|Your time will come.`);
		},
	},
	cantsay: {
		noCopy: true,
		onStart() {
			this.add(`c|@cant say|(´・ω・\`)`);
		},
		onSwitchOut() {
			this.add(`c|@cant say|wow CTed lol`);
		},
		onFaint() {
			this.add(`c|@cant say|bg haxor :(`);
		},
	},
	catalystic: {
		noCopy: true,
		onStart() {
			this.add(`c|+Catalystic|The Birb is here!`);
		},
		onSwitchOut() {
			this.add(`c|+Catalystic|The Birb will be back!`);
		},
		onFaint() {
			this.add(`c|+Catalystic|The Birb is never lucky.`);
		},
	},
	ceteris: {
		noCopy: true,
		onStart() {
			this.add(`c|@Ceteris|Your loss is inevitable, you best forfeit the battle if you know what's good for you. ╰(⇀︿⇀)つ-]═───`);
		},
		onSwitchOut(source) {
			this.add(`c|@Ceteris|Saving the best for last, ${source.side.name}, a wise choice my friend.`);
		},
		onFaint() {
			this.add(`c|@Ceteris|IMPOSSIBLE!! THIS IS AN OUTRAGE!! I WILL EXACT MY REVENGE ON YOU ONE DAY (◣_◢)`);
		},
	},
	chaos: {
		noCopy: true,
		// No phrases provided
	},
	chloe: {
		noCopy: true,
		onStart() {
			this.add(`c|@Chloe|hlelo`);
		},
		onSwitchOut() {
			this.add(`c|@Chloe|bubye`);
		},
		onFaint() {
			this.add(`c|@Chloe|aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`);
		},
	},
	darth: {
		noCopy: true,
		onStart() {
			this.add(`c|+Darth|The angel of stall descends upon the battlefield.`);
		},
		onSwitchOut() {
			this.add(`c|+Darth|The angel of stall has decided upon a tactical retreat.`);
		},
		onFaint() {
			this.add(`c|+Darth|Regenerator is a perfectly balanced ability.`);
		},
	},
	dawoblefet: {
		noCopy: true,
		onStart() {
			this.add(`c|@DaWoblefet|What's going on guys? This is DaWoblefet, and welcome to Mechanics Monday.`);
		},
		onSwitchOut() {
			this.add(`c|@DaWoblefet|Until next time, have a good one.`);
		},
		onFaint() {
			this.add(`c|@DaWoblefet|mished`);
		},
	},
	decem: {
		noCopy: true,
		onStart() {
			this.add(`c|+Decem|:D`);
		},
		onSwitchOut() {
			this.add(`c|+Decem|bye`);
		},
		onFaint() {
			this.add(`c|+Decem|>:(`);
		},
	},
	deetah: {
		noCopy: true,
		onStart() {
			this.add(`c|+deetah|I can see right through you.`);
		},
		onSwitchOut() {
			this.add(`c|+deetah|Meow :3`);
		},
		onFaint() {
			this.add(`c|+deetah|I have 8 lives left, you can't get rid of me that easily.`);
		},
	},
	dragontite: {
		noCopy: true,
		onStart() {
			this.add(`c|+Dragontite|**Time to electrify you**`);
		},
		onSwitchOut() {
			this.add(`c|+Dragontite|__I'll be coming back for you!__`);
		},
		onFaint() {
			this.add(`c|+Dragontite|I'm shocked that you mere mortal actually defeated __me__`);
		},
	},
	dragonwhale: {
		noCopy: true,
		onStart() {
			this.add(`c|@DragonWhale|i would switch to chomper here`);
		},
	},
	e4flint: {
		// Fire type when mega evolving implemented in scripts.js
		noCopy: true,
		onStart(target, source) {
			this.add(`c|@E4 Flint|How many Fire-Types do I have now`);
			if (source.template.speciesid !== 'steelixmega' || source.illusion) return;
			this.add('-start', source, 'typeadd', 'Fire');
		},
		onFaint() {
			this.add(`c|@E4 Flint|lul ok`);
		},
	},
	eien: {
		noCopy: true,
		onStart() {
			this.add(`c|&Eien|umu!`);
		},
		onFaint() {
			this.add(`c|&Eien|This game is Bad Civilization...`);
		},
	},
	elgino: {
		noCopy: true,
		onStart() {
			this.add(`c|+Elgino|I'm about to solve this puzzle.`);
		},
		onSwitchOut() {
			this.add(`c|+Elgino|uh I need some hints for this one, I'll try again later`);
		},
		onFaint() {
			this.add(`c|+Elgino|Frankly, I'm... ashamed.`);
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && ['mimikyu', 'mimikyutotem'].includes(target.template.speciesid) && !target.transformed) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectData.busted = true;
				return 0;
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.template.speciesid) || target.transformed || (target.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates))) return;
			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.template.speciesid) && this.effectData.busted) {
				let templateid = pokemon.template.speciesid === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(templateid, this.effect, true);
			}
		},
	},
	eternally: {
		noCopy: true,
		onStart() {
			this.add(`c|@eternally|quack`);
		},
		onFaint() {
			this.add(`c|@eternally|quack`);
		},
		onTryHit(target, source, move) {
			if (target.illusion) return;
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Water Absorb');
				}
				return null;
			}
		},
	},
	explodingdaisies: {
		noCopy: true,
		onStart() {
			this.add(`c|%explodingdaisies|For today's weather: DOOOOOM!`);
		},
		onSwitchOut() {
			this.add(`c|%explodingdaisies|I WILL DESTROY YOU.......BUT LATER!`);
		},
		onFaint() {
			this.add(`c|%explodingdaisies|MY PEOPLE NEED ME!`);
		},
	},
	'false': {
		noCopy: true,
		onStart() {
			this.add(`c|&false|٩(•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ`);
		},
		onSwitchOut() {
			this.add(`c|&false|٩(๑•◡-๑)۶ⒽⓤⒼ❤`);
		},
		onFaint() {
			this.add(`c|&false|ɢ∞פ⋆ᖙᵒᵝ ٩꒰”̮*ू꒱`);
		},
	},
	fart: {
		noCopy: true,
		onStart(target, source) {
			this.add('-start', source, 'typechange', `Fairy/Steel`);
			let activeMon = toID(source.side.foe.active[0].illusion ? source.side.foe.active[0].illusion.name : source.side.foe.active[0].name);
			let family = ['aethernum', 'ceteris', 'flare', 'ransei', 'trickster', 'gimm1ck', 'zalm', 'aelita', 'biggie', 'deetah', 'birdy', 'sundar', 'dragontite'];
			if (activeMon === 'hoeenhero' || activeMon === 'salamander') {
				 this.add(`c|%fart|what song should I sing?`);
			} else if (activeMon === 'lifeisdank' || activeMon === 'nui' || activeMon === 'grimauxiliatrix') {
				this.add(`c|%fart|the gang's all here!`);
			} else if (family.includes(activeMon)) {
				this.add(`c|%fart|what's cookin', good lookin'?`);
			} else {
				this.add(`c|%fart|it's fukken raw`);
			}
		},
		onSwitchOut() {
			this.add(`c|%fart|this boy is not correct. he is **flawed.**`);
		},
		onFaint(pokemon) {
			let activeMon = toID(pokemon.side.foe.active[0].illusion ? pokemon.side.foe.active[0].illusion.name : pokemon.side.foe.active[0].name);
			if (activeMon === 'felucia') {
				this.add(`c|%fart|Felucia I'm deleting your mon`);
			} else {
				this.add(`c|%fart|the things I do for love...`);
			}
		},
	},
	felucia: {
		noCopy: true,
		onStart() {
			this.add(`c|%Felucia|Hi I'm here to participate in a totally serious conversation`);
		},
		onSwitchOut() {
			this.add(`c|%Felucia|Okay that's enough shitposting for now`);
		},
		onFaint() {
			this.add(`c|%Felucia|Fine I'll go back to work...`);
		},
	},
	flare: {
		noCopy: true,
		onStart() {
			this.add('c|@Flare|(9°^°)9');
		},
		onSwitchIn() {
			this.add('c|@Flare|ᕕ( ᐛ )ᕗ');
		},
		onFaint() {
			this.add('c|@Flare|X_X');
		},
	},
	fomg: {
		noCopy: true,
		onStart() {
			this.add(`c|@FOMG|You got this, my friend!`);
		},
		onSwitchOut() {
			this.add(`c|@FOMG|/me rolls out`);
		},
		onFaint() {
			this.add(`c|@FOMG|Rock in peace...`);
		},
	},
	gallantspear: {
		noCopy: true,
		onStart() {
			this.add(`c|+Gallant Spear|*Trombe! override intensifies*`);
		},
		onSwitchOut() {
			this.add(`c|+Gallant Spear|*neigh* *snort*`);
		},
		onFaint() {
			this.add(`c|+Gallant Spear|UNIVAAAAAAAAAAAAAAASE!!`);
		},
	},
	gimm1ck: {
		noCopy: true,
		onStart() {
			this.add(`c|+Gimm1ck|Давай!`);
		},
		onSwitchOut() {
			this.add(`c|+Gimm1ck|Must get more semechki`);
		},
		onFaint() {
			this.add(`c|+Gimm1ck|Ran out of vodka`);
		},
	},
	gmars: {
		noCopy: true,
		onStart(target) {
			this.add(`c|%GMars|It's ya boy GEEEEEEEEMARS`);
			if (target.illusion || !target.m.miniorColor) return;
			this.add('-formechange', target, `Minior${target.m.miniorColor}`);
		},
		onSwitchOut() {
			this.add(`c|%GMars|I like 'em crisp`);
		},
		onFaint() {
			this.add(`c|%GMars|Don't forget to check out my bandcamp`);
		},
	},
	grimauxiliatrix: {
		noCopy: true,
		onStart() {
			this.add(`c|@grimAuxiliatrix|${['A BRAWL IS SURELY BREWING!', 'GOOD DAY FOR A SWELL BATTLE!', 'THIS MATCH WILL GET RED HOT!'][this.random(3)]}`);
		},
		onFaint() {
			this.add(`c|@grimAuxiliatrix|**KNOCKOUT!**`);
		},
	},
	guishark: {
		noCopy: true,
		onStart() {
			this.add(`c|+guishark|Let's go hunt doodoodoodoodoodoo!`);
		},
		onSwitchOut() {
			this.add(`c|+guishark|Run away doodoodoodoodoodoo!`);
		},
		onFaint() {
			this.add(`c|+guishark|It's the end doodoodoodoodoodoo!`);
		},
	},
	// Cant use the exact name because its a pokemon's name
	hippopotasuser: {
		noCopy: true,
		onStart() {
			this.add(`c|@Hippopotas|Something broke. If you're seeing this message, please PM a staff member about it.`);
			this.add(`c|~HoeenHero|No, its not a bug Hippopotas, stop telling people to PM staff, its annoying.`);
		},
		onSwitchOut() {
			this.add(`c|@Hippopotas|Something broke. If you're seeing this message, please PM a staff member about it.`);
			this.add(`c|~HoeenHero|There's still no bug!`);
		},
		onFaint() {
			this.add(`c|@Hippopotas|Something broke. If you're seeing this message, please PM a staff member about it.`);
			this.add(`c|~HoeenHero|My PMs are flooded with bug reports :(`);
		},
	},
	hoeenhero: {
		noCopy: true,
		onStart() {
			this.add(`c|~HoeenHero|My scripts will lead me to victory!`);
		},
		onSwitchOut() {
			this.add(`c|~HoeenHero|I need to look something up, hold on...`);
		},
		onFaint() {
			this.add(`c|~HoeenHero|There must have been a bug in my script ;-;`);
		},
	},
	hubriz: {
		noCopy: true,
		onStart() {
			this.add(`c|%Hubriz|Just a harmless flower...`);
		},
		onSwitchOut() {
			this.add(`c|%Hubriz|I'll bloom once more soon enough!`);
		},
		onFaint() {
			this.add(`c|%Hubriz|I burn, I pine, I perish.`);
		},
	},
	inactive: {
		noCopy: true,
		onStart() {
			this.add(`c|+inactive|I just can't wait to face you.`);
		},
		onSwitchOut() {
			this.add(`c|+inactive|I'll keep an eye out for you next time...`);
		},
		onFaint() {
			this.add(`c|+inactive|/me turns to stone and crumbles`);
		},
	},
	irritated: {
		noCopy: true,
		onStart() {
			this.add(`c|+irritated|Glhf`);
		},
		onFaint() {
			this.add(`c|+irritated|wtf hax`);
		},
	},
	iyarito: {
		noCopy: true,
		onStart() {
			this.add(`c|&Iyarito|Iyarito is always right`);
		},
		onSwitchOut() {
			this.add(`c|&Iyarito|It's all Iyarito's fault`);
		},
		onFaint() {
			this.add(`c|&Iyarito|RIP Patrona`);
		},
	},
	kaijubunny: {
		noCopy: true,
		onStart() {
			this.add(`c|@Kaiju Bunny|￣( ÒㅅÓ)￣ Thump Thump Motherfucker`);
		},
		onSwitchOut() {
			this.add(`c|@Kaiju Bunny|￣( >ㅅ>)￣ Holding me back, I see how it is`);
		},
		onFaint() {
			this.add(`c|@Kaiju Bunny|￣( ‘xㅅx)￣Time to take a 10 hour power nap`);
		},
		// Kaiju Rage Innate
		// onUpdate so toxic orb can activate after. Code mainly copied from Power Construct.
		onUpdate(pokemon) {
			if (pokemon.template.speciesid !== 'gligar' || pokemon.transformed || pokemon.illusion || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-activate', pokemon, 'ability: Kaiju Rage');
			pokemon.formeChange('Gliscor', this.effect, true);
			let newHP = Math.floor(Math.floor(2 * pokemon.template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			pokemon.heal(pokemon.baseMaxhp / 4);
			this.add('-heal', pokemon, pokemon.getHealth);
			pokemon.takeItem();
			pokemon.setItem('toxicorb');
			this.add('-message', pokemon.name + '\'s item is now a Toxic Orb!');
			this.add('-message', pokemon.name + '\'s ability is now Poison Heal!');
			this.boost({atk: 2, spe: 1}, pokemon);
		},
	},
	kalalokki: {
		noCopy: true,
		onStart(target) {
			this.add(`c|@Kalalokki|(•_•)`);
			this.add(`c|@Kalalokki|( •_•)>⌐■-■`);
			this.add(`c|@Kalalokki|(⌐■_■)`);
			if (target.illusion) return;
			this.field.setWeather('raindance');
		},
		onFaint() {
			this.add(`c|@Kalalokki|(⌐■_■)`);
			this.add(`c|@Kalalokki|( •_•)>⌐■-■`);
			this.add(`c|@Kalalokki|(x_x)`);
		},
	},
	kaori: {
		noCopy: true,
		onStart(pokemon) {
			this.add(`c|+kaori|(~￣³￣)~`);
			if (pokemon.illusion) return;
			this.boost({spd: 2}, pokemon);
		},
		onSwitchOut() {
			this.add(`c|+kaori|ಠ_ಠ`);
		},
		onFaint() {
			this.add(`c|+kaori|(◕ ᥥ ◕✿)`);
		},
	},
	kay: {
		noCopy: true,
		onStart() {
			this.add(`c|+kay|Every kiss begins with Kay`);
		},
		onSwitchOut() {
			this.add(`c|+kay|くコ:彡`);
		},
		onFaint() {
			this.add(`c|+kay|'kay bye!くコ:彡`);
		},
		// Simple Innate
		onBoost(boost, target, source, effect) {
			if (target && target.illusion) return;
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				// @ts-ignore
				boost[i] *= 2;
			}
		},
	},
	kie: {
		noCopy: true,
		onStart() {
			this.add(`c|%Kie|Wherever there is hope, there is most definitely despair.`);
		},
		onSwitchOut() {
			this.add(`c|%Kie|Still better than Aeonic, btw.`);
		},
		onFaint() {
			this.add(`c|%Kie|https://www.youtube.com/watch?v=Hyw6kKMjp5A`);
		},
	},
	kingswordyt: {
		noCopy: true,
		onStart() {
			this.add(`c|@KingSwordYT|You're the master of your destiny, take destiny by the horns and have fun!`);
		},
		onSwitchOut() {
			this.add(`c|@KingSwordYT|I eat when im upset, and i gotta eat`);
		},
		onFaint() {
			this.add(`c|@KingSwordYT|BUAAAAAA IYA AYÚDAME :(`);
		},
	},
	kipkluif: {
		noCopy: true,
		onStart() {
			this.add(`c|+Kipkluif|I like bacon.`);
		},
		onSwitchOut() {
			this.add(`c|+Kipkluif|Run away da, run run away da`);
		},
		onFaint() {
			this.add(`c|+Kipkluif|Aah! Well, at least I have chicken.`);
		},
		// Footballer innate
		onBasePowerPriority: 8,
		onBasePower(basePower, pokemon, target, move) {
			if (move.name.includes('Kick') && !pokemon.transformed && !pokemon.illusion) {
				this.chainModify(1.75);
			}
		},
	},
	kris: {
		noCopy: true,
		onStart(pokemon) {
			this.add(`c|+Kris|wjat poppin ;)))))`);
			if (pokemon.illusion) return;
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (move.category !== 'Status' && (this.dex.getImmunity(moveType, pokemon) && this.dex.getEffectiveness(moveType, pokemon) > 0 || move.ohko)) {
						this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
		onSwitchOut() {
			this.add(`c|+Kris|vbye`);
		},
		onFaint() {
			this.add(`c|+Kris|thats weird but ok`);
		},
	},
	level51: {
		noCopy: true,
		onStart() {
			this.add(`c|+Level 51|Calculating chance of victory!`);
		},
		onSwitchOut() {
			this.add(`c|+Level 51|chance_victory < 1. Recalibrating...`);
		},
		onFaint() {
			this.add(`c|+Level 51|**IndexError**: list index out of range`);
		},
	},
	lifeisdank: {
		noCopy: true,
		onStart(target) {
			this.add(`c|+LifeisDANK|!!!ლ(⁰⊖⁰ლ) Peent Peent.`);
			if (target.illusion) return;
			this.boost({spe: 2}, target);
		},
		onSwitchOut() {
			this.add(`c|+LifeisDANK|!(•⌔• ) Peent Peent.`);
		},
		onFaint() {
			this.add(`c|+LifeisDANK|(•⌔•. ) Peent.`);
		},
		// Mountaineer innate
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
	},
	lostseso: {
		noCopy: true,
		onStart(pokemon) {
			this.add(`c|+Lost Seso|<3 ( ͡° ͜ʖ ͡°) DANCE WITH ME ( ͡° ͜ʖ ͡°) <3`);
			if (pokemon.illusion) return;
			this.effectData.danceMultiplier = 0;
		},
		onAfterMove(pokemon, target, move) {
			if (pokemon.illusion) return;
			if (move.flags.dance) this.effectData.danceMultiplier++;
		},
		onSwitchOut() {
			this.add(`c|+Lost Seso|Ran out of ramen, brb`);
		},
		onFaint() {
			this.add(`c|+Lost Seso|└[ ─ ಎ ─ ]┘ 0% Battery, feed me ramen please`);
		},
	},
	macchaeger: {
		noCopy: true,
		onStart() {
			this.add(`c|+MacChaeger|What are you gonna do with that big bat? Gonna hit me? Better make it count. Better make it hurt. Better kill me in one shot.`);
		},
		onFaint() {
			this.add(`c|+MacChaeger|im gonna pyuk`);
		},
	},
	madmonty: {
		noCopy: true,
		onStart(pokemon) {
			this.add(`c|+Mad Monty ¾°|/me puts on a coat, to protect himself from the cold.`);
			this.add(`c|+Mad Monty ¾°|Don't get eaten by llamas!`);
		},
		onSwitchOut() {
			this.add(`c|+Mad Monty ¾°|Oh, I see how it is. Ok, fine. Be that way. I'll just be over here, then.`);
		},
		onFaint() {
			this.add(`c|+Mad Monty ¾°|I take it back- I hope you DO get eaten by llamas. Toodles!`);
		},
	},
	majorbowman: {
		noCopy: true,
		onStart() {
			this.add(`c|@MajorBowman|I'm MajorBowman and I'm here to make it clear.`);
		},
		onSwitchOut() {
			this.add(`c|@MajorBowman|Witty catch phrase, you know what I mean?`);
		},
		onFaint() {
			this.add(`c|@MajorBowman|THEY GOT ME, GAL`);
		},
	},
	marshmallon: {
		noCopy: true,
		onStart() {
			this.add(`c|@Marshmallon|What a wonderful day at the beach!`);
		},
		onSwitchOut() {
			this.add(`c|@Marshmallon|__C..c...cooold >w<__`);
		},
		onFaint() {
			this.add(`c|@Marshmallon|I got hit by a thunderbolt!`);
		},
	},
	martha: {
		noCopy: true,
		onStart() {
			this.add(`c|@martha|in to lose r1`);
		},
		onSwitchOut() {
			this.add(`c|@martha|bad`);
		},
	},
	marty: {
		noCopy: true,
		// No phrases provided
	},
	meicoo: {
		noCopy: true,
		onStart() {
			this.add(`c|%Meicoo|/joinhunt`);
		},
		onSwitchOut() {
			this.add(`c|%Meicoo|/leavehunt`);
		},
		onFaint() {
			this.add(`c|%Meicoo|"That is not the answer - try again!"`);
		},
	},
	megazard: {
		noCopy: true,
		onStart() {
			this.add(`c|@Megazard|Almond top of the world!`);
		},
		onSwitchOut() {
			this.add(`c|@Megazard|Change of plants`);
		},
		onFaint() {
			this.add(`c|@Megazard|Better luck next thyme`);
		},
	},
	mitsuki: {
		noCopy: true,
		onStart() {
			this.add(`c|@Mitsuki|SSSSSSSSSSSSS`);
		},
		onSwitchOut() {
			this.add(`c|@Mitsuki|sssssssssssss`);
		},
		onFaint() {
			this.add(`c|@Mitsuki|sss`);
		},
	},
	morfent: {
		noCopy: true,
		onStart() {
			this.add(`c|@Morfent ( _̀> ̀)|──────▀█████▄──────▲`);
			this.add(`c|@Morfent ( _̀> ̀)|───▄███████████▄──◀█▶`);
			this.add(`c|@Morfent ( _̀> ̀)|─────▄████▀█▄──────█`);
			this.add(`c|@Morfent ( _̀> ̀)|───▄█████████████████▄ -I`);
			this.add(`c|@Morfent ( _̀> ̀)|─▄█████.▼.▼.▼.▼.▼.▼.▼  -cast`);
			this.add(`c|@Morfent ( _̀> ̀)|▄███████▄.▲.▲.▲.▲.▲.▲  -magic`);
			this.add(`c|@Morfent ( _̀> ̀)|█████████████████████▀▀-shitpost`);
		},
		onFaint() {
			// Morfent returns something so im doing it this way
			let endquote = this.random(3);
			if (endquote === 1) {
				this.add(`c|@Morfent ( _̀> ̀)|Hacking claims the lives of over 2,000 registered laddering alts every day.`);
			} else if (endquote === 2) {
				this.add(`c|@Morfent ( _̀> ̀)|Every 60 seconds in Africa, a minute passes. Together we can stop this. Please spread the word.`);
			} else {
				this.add(`c|@Morfent ( _̀> ̀)|!dt morfent's husbando`);
				this.add(`raw|<ul class="utilichart"><li class="result"><span class="col numcol">UU</span> <span class="col iconcol"><span class="picon" style="background: transparent url(&quot;//${Config.routes.client}/sprites/smicons-sheet.png?a4&quot;) no-repeat scroll -400px -210px"></span></span> <span class="col pokemonnamecol" style="white-space: nowrap"><a href="https://${Config.routes.dex}/pokemon/gengar" target="_blank" rel="noopener">Gengar</a></span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/Ghost.png" alt="Ghost" height="14" width="32"><img src="https://${Config.routes.client}/sprites/types/Poison.png" alt="Poison" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">Cursed Body</span><span class="col abilitycol"></span></span><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>60</span> <span class="col statcol"><em>Atk</em><br>65</span> <span class="col statcol"><em>Def</em><br>60</span> <span class="col statcol"><em>SpA</em><br>130</span> <span class="col statcol"><em>SpD</em><br>75</span> <span class="col statcol"><em>Spe</em><br>110</span> <span class="col bstcol"><em>BST<br>500</em></span> </span></li><li style="clear: both"></li></ul>`);
				this.add(`raw|<font size="1"><font color="#686868">Dex#:</font> 94&nbsp;|  <font color="#686868">Gen:</font> 1&nbsp;|  <font color="#686868">Height:</font> 1.5 m&nbsp;|  <font color="#686868">Weight:</font> 40.5 kg <em>(60 BP)</em>&nbsp;|  <font color="#686868">Dex Colour:</font> Purple&nbsp;|  <font color="#686868">Egg Group(s):</font> Amorphous&nbsp;|  <font color="#686868">Does Not Evolve</font></font>`);
			}
		},
	},
	nui: {
		noCopy: true,
		onStart() {
			this.add(`c|@nui|（*＾3＾）`);
		},
		onSwitchOut() {
			this.add(`c|@nui|(´◔‸◔\`) **??+ !`);
		},
		onFaint() {
			this.add(`c|@nui|(◕︿◕✿)`);
		},
	},
	om: {
		noCopy: true,
		onStart(target, source) {
			this.add(`c|@OM|use shift gear`);
			if (source.illusion) return;
			this.add('-start', source, 'typeadd', 'Fairy');
		},
		onSwitchOut() {
			this.add(`c|@OM|Ok brb I'm gonna ${["ladder Mix and Mega", "roll battle some surv regs real quick", "sweep y'all in mafia let's get it"][this.random(3)]}`);
		},
		onFaint() {
			this.add(`c|@OM|${["Oh god I rolled a 1", "Killed Night 1, seriously?"][this.random(2)]}`);
		},
	},
	overneat: {
		noCopy: true,
		onStart(source) {
			this.add(`c|+Overneat|[muffled eurobeat playing in the distance]`);
			if (source.template.speciesid !== 'absolmega' || source.illusion) return;
			this.add('-start', source, 'typeadd', 'Fairy');
		},
		onSwitchOut() {
			this.add(`c|+Overneat|Time to take a siesta.`);
		},
		onFaint() {
			this.add(`c|+Overneat|I gotta go, but friendly reminder to drink water after this battle.`);
		},
	},
	pablo: {
		noCopy: true,
		onStart() {
			this.add(`c|+Pablo|Let's get this party started.`);
		},
		onSwitchOut() {
			this.add(`c|+Pablo|I need a break, this is getting boring.`);
		},
		onFaint() {
			this.add(`c|+Pablo|It's cool, I didn't wanna battle anyway.`);
		},
	},
	paradise: {
		noCopy: true,
		onStart() {
			this.add(`c|@Paradise|⠠⠺⠓⠁⠞⠀⠞⠓⠑⠀⠋⠥⠉⠅⠀⠙⠊⠙⠀⠽⠕⠥⠀⠚⠥⠎⠞⠀⠋⠥⠉⠅⠊⠝⠛⠀⠎⠁⠽⠀⠁⠃⠕⠥⠞⠀⠍⠑,⠀⠽⠕⠥⠀⠇⠊⠞⠞⠇⠑⠀⠃⠊⠞⠉⠓?`);
		},
		onSwitchOut() {
			this.add(`c|@Paradise|Braille is the only language you need.`);
		},
		onFaint() {
			this.add(`c|@Paradise|⠠⠽⠕⠥’⠗⠑⠀⠋⠥⠉⠅⠊⠝⠛⠀⠙⠑⠁⠙,⠀⠅⠊⠙⠙⠕.`);
		},
	},
	pirateprincess: {
		noCopy: true,
		onStart() {
			this.add(`c|%Pirate Princess|Ahoy!`);
		},
		onSwitchOut() {
			this.add(`c|%Pirate Princess|You will always remember this as the day that you almost caught Captain Ja- Pirate Princess!`);
		},
		onFaint() {
			this.add(`c|%Pirate Princess|Erm… Parley?`);
		},
	},
	pluviometer: {
		noCopy: true,
		onStart() {
			this.add(`c|@pluviometer|${["Need a GP check?", "I'm a switch-in and I'm switching in #hyphenation"][this.random(2)]}`);
		},
		onSwitchOut() {
			this.add(`c|@pluviometer|${["I wish this were a better matchup #subjunctive", "GP 1/2", "GP 2/2"][this.random(3)]}`);
		},
		onFaint() {
			this.add(`c|@pluviometer|${["Follow SmogonU on Facebook! https://www.facebook.com/SmogonU", "Follow SmogonU on Twitter! https://twitter.com/SmogonU"][this.random(2)]}`);
		},
	},
	pohjis: {
		noCopy: true,
		onStart() {
			this.add(`c|+Pohjis|thats pohjis`);
		},
		onSwitchOut() {
			this.add(`c|+Pohjis|ÖPÖOLÖL`);
		},
		onFaint() {
			this.add(`c|+Pohjis|rly enjoyed that`);
		},
	},
	pre: {
		noCopy: true,
		onStart(source) {
			this.add(`c|~pre|let's go, in and out, 20 minute adventure`);
			// Easter Egg
			let activeMon = toID(source.side.foe.active[0].illusion ? source.side.foe.active[0].illusion.name : source.side.foe.active[0].name);
			if (activeMon === 'anubis') {
				this.add(`c|&Anubis|ohey it's pre`);
				this.add(`c|&Anubis|!showimage https://pokemonshowdown.com/images/ssbkitten.jpg`);
				this.add(`raw|<img src="https://pokemonshowdown.com/images/ssbkitten.jpg" style="width: 300px; height: 400px" />`);
				this.add(`c|~pre|<3`);
			}
		},
		onSwitchOut() {
			this.add(`c|~pre|sometimes science is more art than science`);
		},
		onFaint() {
			this.add(`c|~pre|LAMBS TO THE COSMIC SLAUGHTER!!`);
		},
	},
	ptoad: {
		noCopy: true,
		onStart() {
			this.add(`c|%ptoad⚬|Make it rain!`);
		},
		onSwitchOut() {
			this.add(`c|%ptoad⚬|Oh. You're switching me out. No, it's fine, I "toad"ally get it.`);
		},
		onFaint() {
			this.add(`c|%ptoad⚬|Wow. Way to rain on my parade.`);
		},
	},
	psynergy: {
		noCopy: true,
		onStart() {
			this.add(`c|+Psynergy|oh`);
		},
		onSwitchOut() {
			this.add(`c|+Psynergy|Joe doesn't pay me enough for this`);
		},
		onFaint() {
			this.add(`c|+Psynergy|I'm going to be late...`);
		},
	},
	quitequiet: {
		noCopy: true,
		onStart() {
			this.add(`c|@Quite Quiet|spooky :d`);
		},
		onFaint() {
			this.add(`c|@Quite Quiet|:'(`);
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.illusion) return;
			if (!pokemon.transformed) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (pokemon.illusion) return;
			if (!pokemon.transformed) {
				return this.chainModify(1.5);
			}
		},
	},
	rach: {
		noCopy: true,
		onStart(target, source) {
			this.add(`c|%Rach|BURN IT DOWN!`);
			if (source.illusion) return;
			this.add('-start', source, 'typeadd', 'Fighting');
			this.boost({spe: 1}, source);
		},
		onSwitchOut() {
			this.add(`c|%Rach|Tag!`);
		},
		onFaint() {
			this.add(`c|%Rach|I oversold your move`);
		},
	},
	rageuser: {
		noCopy: true,
		onStart(pokemon) {
			this.add(`c|%Rage|I'm about to ruin this mans whole career`);
		},
		onSwitchOut() {
			this.add(`c|%Rage|Ain't supposed to be like that chief, we out`);
		},
		onFaint() {
			this.add(`c|%Rage|/me quits`);
		},
	},
	raid: {
		noCopy: true,
		// No messages provided
	},
	ransei: {
		noCopy: true,
		onStart() {
			this.add(`c|@Ransei| Sup! I have been brought from the world of Hackmons to give you a preview of our characteristics. I’ve been genetically engineered to beat you at all costs. Expect to lose this fight!`);
		},
		onFaint() {
			this.add(`c|@Ransei|ripsei`);
		},
	},
	rorymercury: {
		noCopy: true,
		onStart(pokemon) {
			this.add(`c|+Rory Mercury|guess I'm in charge now`);
			if (pokemon.illusion) return;
			this.boost({atk: 1}, pokemon);
		},
		onSwitchOut() {
			this.add(`c|+Rory Mercury|brb running low on battery`);
		},
		onFaint() {
			this.add(`c|+Rory Mercury|pressing charges for battery`);
		},
	},
	samjo: {
		noCopy: true,
		onStart() {
			this.add(`c|+SamJo|Heyo/ Hope your day's been fantasthicc! Woo!`);
		},
		onSwitchOut() {
			this.add(`c|+SamJo|Catch ya later, stay thicc my friends o/`);
		},
		onFaint() {
			this.add(`c|+SamJo|Oof, gotta get thiccer……. ;(`);
		},
	},
	salamander: {
		noCopy: true,
		onStart() {
			this.add(`c|+Salamander|I am here to bully Aroma Electra`);
		},
		onSwitchOut() {
			this.add(`c|+Salamander|Remember these two things: Lucario•1582 will always be cute, and Swagn will never be able to dab`);
		},
		onFaint() {
			this.add(`c|+Salamander|Noctrine help this isn't working as well as we planned`);
		},
	},
	schiavetto: {
		noCopy: true,
		onStart() {
			this.add(`c|+Schiavetto|Aight, sis, guess I'm parking.`);
		},
		onSwitchOut() {
			this.add(`c|+Schiavetto|Someone help me press this.`);
		},
		onFaint() {
			this.add(`c|+Schiavetto|Read my ISOs when I'm dead`);
		},
	},
	scotteh: {
		noCopy: true,
		onStart() {
			this.add(`c|@Scotteh|─────▄▄████▀█▄`);
			this.add(`c|@Scotteh|───▄██████████████████▄`);
			this.add(`c|@Scotteh|─▄█████.▼.▼.▼.▼.▼.▼.▼`);
		},
		onSwitchOut() {
			this.add(`c|@Scotteh|▄███████▄.▲.▲.▲.▲.▲.▲`);
			this.add(`c|@Scotteh|█████████████████████▀▀`);
		},
		onFaint() {
			this.add(`c|@Scotteh|▄███████▄.▲.▲.▲.▲.▲.▲`);
			this.add(`c|@Scotteh|█████████████████████▀▀`);
		},
	},
	shiba: {
		noCopy: true,
		onStart() {
			this.add(`c|%Shiba|LINDA IS INDA`);
		},
		onSwitchOut() {
			this.add(`c|%Shiba|gotta buy an alt rq brb`);
		},
	},
	slowbroth: {
		noCopy: true,
		onStart() {
			this.add(`c|+Slowbroth|DETECTING FOREIGN SPECIES...`);
		},
		onSwitchOut() {
			this.add(`c|+Slowbroth|TELEPORTING TO ALTERNATE DIMENSION...`);
		},
		onFaint() {
			this.add(`c|+Slowbroth|HARDWARE DAMAGE PERMANENT...`);
		},
	},
	snaquaza: {
		noCopy: true,
		onStart() {
			this.add(`c|+Snaquaza|Snaq is baq... with a vengeance!`);
		},
		onSwitchOut(pokemon) {
			this.add(`c|+Snaquaza|Lynch Hoeen while I'm away...`);
			if (pokemon.m.claimHP) {
				pokemon.hp = pokemon.m.claimHP;
				pokemon.m.claimHP = null;
			}
		},
		onFaint() {
			this.add(`c|+Snaquaza|How did you know I was scum?`);
		},
		onDamage(damage, pokemon) {
			// Hack for Snaquaza's Z move
			if (!pokemon.m.claimHP) return;
			// Prevent Snaquaza from fainting while using a fake claim to prevent visual bug
			if (pokemon.hp - damage <= 0) return (pokemon.hp - 1);
		},
		onAfterDamage(damage, pokemon) {
			// Hack for Snaquaza's Z move
			if (!pokemon.m.claimHP || pokemon.hp > 1) return;
			// Now we handle the fake claim "fainting"
			pokemon.hp = pokemon.m.claimHP;
			pokemon.formeChange(pokemon.baseTemplate.id);
			pokemon.moveSlots = pokemon.moveSlots.slice(0, 4);
			this.add('message', `${pokemon.name}'s fake claim was uncovered!`);
			pokemon.m.claimHP = null;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
	},
	sparksblade: {
		noCopy: true,
		onStart() {
			this.add(`c|%sparksblade|this team looks marsh weak`);
		},
		onSwitchOut() {
			this.add(`c|%sparksblade|we lose`);
		},
		onFaint() {
			this.add(`c|%sparksblade|i don't even play this game`);
		},
	},
	sundar: {
		noCopy: true,
		onStart() {
			this.add(`c|+Sundar|Now, we are really going to have a bad time. >:)`);
		},
		onSwitchOut() {
			this.add(`c|+Sundar|I'll spare you for now.`);
		},
		onFaint() {
			this.add(`c|+Sundar|..that's it, huh? Don't say I didn't warn you.`);
		},
	},
	teclis: {
		noCopy: true,
		onStart() {
			this.add(`c|@Teclis|The Emperor protects.`);
		},
		onSwitchOut() {
			this.add(`c|@Teclis|Only in death does duty end.`);
		},
		onFaint() {
			this.add(`c|@Teclis|Success is commemorated; Failure merely remembered.`);
		},
	},
	tennisace: {
		noCopy: true,
		onStart() {
			this.add(`c|@tennisace|VIVA LOS TIGRES`);
		},
		onSwitchOut() {
			this.add(`c|@tennisace|wtf is this shit even`);
		},
		onFaint() {
			this.add(`c|@tennisace|maybe next season n_n`);
		},
	},
	teremiare: {
		noCopy: true,
		onStart(source) {
			this.add(`c|+Teremiare|<('o'<)`);
			if (source.illusion) return;
			let target = source.side.foe.active[0];

			let removeAll = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			let silentRemove = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist'];
			for (const sideCondition of removeAll) {
				if (target.side.removeSideCondition(sideCondition)) {
					if (!(silentRemove.includes(sideCondition))) this.add('-sideend', target.side, this.dex.getEffect(sideCondition).name, '[from] move: No Fun Zone', '[of] ' + source);
				}
				if (source.side.removeSideCondition(sideCondition)) {
					if (!(silentRemove.includes(sideCondition))) this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: No Fun Zone', '[of] ' + source);
				}
			}
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
			for (const clear in this.field.pseudoWeather) {
				if (clear.endsWith('mod') || clear.endsWith('clause')) continue;
				this.field.removePseudoWeather(clear);
			}
			this.field.clearWeather();
			this.field.clearTerrain();
		},
		onFaint() {
			this.add(`c|+Teremiare|(>'o')>`);
		},
	},
	theimmortal: {
		noCopy: true,
		onStart() {
			this.add(`c|~The Immortal|h-hi`);
		},
		onSwitchOut() {
			this.add(`c|~The Immortal|ok`);
		},
		onFaint() {
			this.add(`c|~The Immortal|zzz`);
		},
	},
	theleprechaun: {
		noCopy: true,
		onStart() {
			this.add(`c|+The Leprechaun|Let's get this bread`);
		},
		onSwitchOut() {
			this.add(`c|+The Leprechaun|I'm out this mutherfucker`);
		},
		onFaint() {
			this.add(`c|+The Leprechaun|This ain't it chief`);
		},
	},
	tony: {
		noCopy: true,
		onStart() {
			this.add(`c|@Tony|Greed!`);
		},
		onSwitchOut() {
			this.add(`c|@Tony|Greed!`);
		},
		onFaint() {
			this.add(`c|@Tony|Greed..`);
		},
		// Innate levitate implemented in data/mods/ssb/scripts.js#pokemon#isGrounded
	},
	torkool: {
		noCopy: true,
		onStart() {
			this.add(`c|+torkool|:peepodetective:`);
		},
		onSwitchOut() {
			this.add(`c|+torkool|i cba`);
		},
		onFaint() {
			this.add(`c|+torkool|I don't deserve this...`);
		},
	},
	trickster: {
		noCopy: true,
		onStart() {
			this.add(`c|@Trickster|(◕‿◕✿)`);
		},
		onSwitchOut() {
			this.add(`c|@Trickster|(◠﹏◠✿)`);
		},
		onFaint() {
			this.add(`c|@Trickster|(✖﹏✖✿)`);
		},
	},
	vivalospride: {
		noCopy: true,
		onStart() {
			this.add(`c|%vivalospride|bet`);
		},
		onSwitchOut() {
			this.add(`c|%vivalospride|tuh`);
		},
		onFaint() {
			this.add(`c|%vivalospride|THERE IT IS!!`);
		},
	},
	volco: {
		noCopy: true,
		onStart() {
			this.add(`c|+Volco|Get Ready, I'm going to take you down!`);
		},
		onSwitchOut() {
			this.add(`c|+Volco|I've decided to spare you, lucky you.`);
		},
		onFaint() {
			this.add(`c|+Volco|Well, seems I was taken down instead.`);
		},
	},
	xayah: {
		noCopy: true,
		onStart() {
			this.add(`c|+Xayah|Let's dance!`);
		},
		onSwitchOut() {
			this.add(`c|+Xayah|Fine, I'll go.`);
		},
		onFaint() {
			this.add(`c|+Xayah|All out of second dances...`);
		},
	},
	xfix: {
		noCopy: true,
		onStart() {
			this.add(`c|&xfix|destroy the world!`);
		},
		onSwitchOut() {
			this.add(`c|&xfix|brb i need to rethink my plan`);
		},
		onFaint() {
			this.add(`c|&xfix|but the world refused`);
		},
	},
	xjoelituh: {
		noCopy: true,
		onStart(source) {
			this.add(`c|@xJoelituh|h-hi, im joel, not joe, tyvm`);
			// Terrifying Demeanor Innate
			if (source.illusion) return;
			let target = source.side.foe.active[0];
			if (target.getStat('spe', true, true) > source.getStat('spe', true, true)) this.boost({spe: -1}, target, source);
		},
		onSwitchOut() {
			this.add(`c|@xJoelituh|if that's what you want, s-sure`);
		},
		onFaint() {
			// Random Gibberish Generator
			let gibberish = '';
			for (let j = 0; j < 10; j++) gibberish += String.fromCharCode(48 + this.random(79));
			this.add(`c|@xJoelituh|${gibberish}`);
		},
	},
	xprienzo: {
		noCopy: true,
		onStart() {
			this.add(`c|+XpRienzo ☑◡☑|Bleh`);
		},
		onSwitchOut() {
			this.add(`c|+XpRienzo ☑◡☑|>.>`);
		},
		onFaint() {
			this.add(`c|+XpRienzo ☑◡☑|Wait what?`);
		},
	},
	yuki: {
		noCopy: true,
		onStart() {
			this.add(`c|%Yuki|My ice may be a little __cold__, but your plan has been put completely on __hold__!`);
		},
		onSwitchOut() {
			this.add(`c|%Yuki|I-It's too hot in here!`);
		},
		onFaint() {
			this.add(`c|%Yuki|I'm melting...`);
		},
	},
	zalm: {
		noCopy: true,
		onStart() {
			this.add(`c|+Zalm|<(:O)000>`);
		},
		onSwitchOut() {
			this.add(`c|+Zalm|Woah`);
		},
		onFaint() {
			this.add(`c|+Zalm|Tfw still no mega weedle`);
		},
	},
	zarel: {
		noCopy: true,
		onStart() {
			this.add(`c|~Zarel|Your mom`);
		},
		onFaint() {
			this.add(`c|~Zarel|Your mom`);
			// message is shown after the "Zarel Fainted!" message
			this.add('message', 'Zarel used your mom!');
		},
	},
	zyguser: {
		noCopy: true,
		onStart() {
			this.add(`c|+Zyg|/me sighs`);
		},
		onSwitchOut() {
			this.add(`c|+Zyg|/me sighs`);
		},
		onFaint() {
			this.add(`c|+Zyg|Brexit means Brexit`);
		},
	},
	// boostreplacement condition for nui's zmove
	boostreplacement: {
		// this is a side condition
		name: 'boostreplacement',
		id: 'boostreplacement',
		onStart(side, source) {
			this.effectData.position = source.position;
		},
		onSwitchInPriority: 1,
		onSwitchIn(target) {
			if (!target.fainted && target.position === this.effectData.position) {
				this.boost({def: 1, spd: 1});
				target.side.removeSideCondition('boostreplacement');
			}
		},
	},
	// Prevents glitch out from running more than once per turn per pokemon & boosts base power
	glitchout: {
		duration: 1,
		onTryHit(target, source, move) {
			if (move.basePower) {
				move.basePower += 20;
				this.debug('glitch out base power boost');
			}
		},
	},
	// Modified type setup for arceus
	arceus: {
		inherit: true,
		onType(types, pokemon) {
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
	// weight doubling volatile for trickster
	weightdoubler: {
		noCopy: true,
		onStart(pokemon) {
			this.add('-message', `${pokemon.illusion ? pokemon.illusion.name : pokemon.name}'s weight has doubled.`);
			pokemon.weighthg *= 2;
		},
	},
	// Gooey volatile for Decem's move
	gooey: {
		onStart(pokemon, source) {
			this.add('-start', pokemon, 'Gooey', '[of] ' + source);
			this.add('-message', `${pokemon.illusion ? pokemon.illusion.name : pokemon.name} was covered in corrosive goo!`);
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 6);
			this.add('-message', `${pokemon.illusion ? pokemon.illusion.name : pokemon.name} was damaged by the corrosive goo!`);
		},
	},
	// Custom Acid Rain weather for Pirate Princess
	acidrain: {
		name: 'Acid Rain',
		id: 'acidrain',
		num: 0,
		effectType: 'Weather',
		duration: 5,
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Poison') && this.field.isWeather('acidrain')) {
				return this.modify(spd, 1.5);
			}
		},
		onStart(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (this.gen <= 5) this.effectData.duration = 0;
				this.add('-weather', 'AcidRain', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'AcidRain');
			}
			this.add('-message', 'Acid Rain began to fall.');
		},
		onResidualOrder: 1,
		onResidual() {
			this.add('-weather', 'AcidRain', '[upkeep]');
			if (this.field.isWeather('acidrain')) this.eachEvent('Weather');
		},
		onWeather(target) {
			if (target.hasType('Poison')) return;
			this.damage(target.baseMaxhp / 16);
		},
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Steel'] = true;
			}
		},
		onEnd() {
			this.add('-weather', 'none');
			this.add('-message', 'The Acid Rain subsided.');
		},
	},
	// Custom effect for Rage's multihit
	enrageeeeed: {
		onStart(pokemon, source) {
			this.add('-message', `${pokemon.illusion ? pokemon.illusion.name : pokemon.name}'s next attack will hit multiple times!`);
		},
		onPrepareHit(source, target, move) {
			// beat up relies on its multihit being the number of valid allies
			if (move.category !== 'Status' && move.id !== 'beatup') {
				move.multihit = [2, 5];
				move.basePower = 25;
				this.effectData.usedup = true;
			}
		},
		onAfterMove(pokemon, source) {
			if (this.effectData.usedup) pokemon.removeVolatile('enrageeeeed');
		},
	},
	// Custom effect for Yuki
	cutietrap: {
		duration: 5,
		noCopy: true,
		onStart(pokemon, source) {
			if (!this.runEvent('Attract', pokemon, source)) {
				this.debug('Attract event failed');
				return false;
			}
			this.add('-start', pokemon, 'Attract', '[from] move: Cutie Trap', '[of] ' + source);
			this.add('-message', `${pokemon.illusion ? pokemon.illusion.name : pokemon.name} was trapped by love!`);
		},
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon) {
			this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectData.source);
			if (this.randomChance(1, 2)) {
				this.add('cant', pokemon, 'Attract');
				return false;
			}
		},
		onTrapPokemon(pokemon) {
			pokemon.tryTrap();
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Attract', '[silent]');
			this.add('-message', `${pokemon.illusion ? pokemon.illusion.name : pokemon.name} is no longer trapped by love.`);
		},
	},
	// Modified hail for Yuki
	hail: {
		inherit: true,
		onStart(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				if (this.gen <= 5 || effect.id === 'snowstorm') this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
	},
	// Special volatile that is applied to pokemon using a custom move with the effects of baton pass so that boosts/volatiles are shown on client.
	batonpasshelper: {
		duration: 1,
		onSwitchInPriority: 1000,
		onSwitchIn(target) {
			for (let boost in target.boosts) {
				// @ts-ignore Element implictly has type any due to lack of index signature
				if (target.boosts[boost]) this.add('-boost', target, boost, target.boosts[boost], '[silent]');
			}
			for (let v in target.volatiles) {
				if (v !== toID(target.name) && v !== 'batonpasshelper') this.add('-start', target, target.volatiles[v].id);
			}
		},
	},
	// Modded hazard moves to fail when Prismatic terrain is active
	auroraveil: {
		duration: 5,
		durationCallback(target, source, effect) {
			if (source && source.hasItem('lightclay')) {
				return 8;
			}
			return 5;
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== source && target.side === this.effectData.target) {
				if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
						(target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
					return;
				}
				if (!target.getMoveHitData(move).crit && !move.infiltrates) {
					this.debug('Aurora Veil weaken');
					if (target.side.active.length > 1) return this.chainModify([0xAAC, 0x1000]);
					return this.chainModify(0.5);
				}
			}
		},
		onStart(side) {
			if (this.field.isTerrain('prismaticterrain')) {
				this.add('-message', `Prismatic Terrain prevented Aurora Veil from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Aurora Veil');
		},
		onResidualOrder: 21,
		onResidualSubOrder: 1,
		onEnd(side) {
			this.add('-sideend', side, 'move: Aurora Veil');
		},
	},
	lightscreen: {
		duration: 5,
		durationCallback(target, source, effect) {
			if (source && source.hasItem('lightclay')) {
				return 8;
			}
			return 5;
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== source && target.side === this.effectData.target && this.getCategory(move) === 'Special') {
				if (!target.getMoveHitData(move).crit && !move.infiltrates) {
					this.debug('Light Screen weaken');
					if (target.side.active.length > 1) return this.chainModify([0xAAC, 0x1000]);
					return this.chainModify(0.5);
				}
			}
		},
		onStart(side) {
			if (this.field.isTerrain('prismaticterrain')) {
				this.add('-message', `Prismatic Terrain prevented Light Screen from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Light Screen');
		},
		onResidualOrder: 21,
		onResidualSubOrder: 1,
		onEnd(side) {
			this.add('-sideend', side, 'move: Light Screen');
		},
	},
	mist: {
		duration: 5,
		onBoost(boost, target, source, effect) {
			if (effect.effectType === 'Move' && effect.infiltrates && target.side !== source.side) return;
			if (source && target !== source) {
				let showMsg = false;
				for (let i in boost) {
					// @ts-ignore
					if (boost[i] < 0) {
						// @ts-ignore
						delete boost[i];
						showMsg = true;
					}
				}
				if (showMsg && !(/** @type {ActiveMove} */(effect)).secondaries) {
					this.add('-activate', target, 'move: Mist');
				}
			}
		},
		onStart(side) {
			if (this.field.isTerrain('prismaticterrain')) {
				this.add('-message', `Prismatic Terrain prevented Mist from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Mist');
		},
		onResidualOrder: 21,
		onResidualSubOrder: 3,
		onEnd(side) {
			this.add('-sideend', side, 'Mist');
		},
	},
	reflect: {
		duration: 5,
		durationCallback(target, source, effect) {
			if (source && source.hasItem('lightclay')) {
				return 8;
			}
			return 5;
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== source && target.side === this.effectData.target && this.getCategory(move) === 'Physical') {
				if (!target.getMoveHitData(move).crit && !move.infiltrates) {
					this.debug('Reflect weaken');
					if (target.side.active.length > 1) return this.chainModify([0xAAC, 0x1000]);
					return this.chainModify(0.5);
				}
			}
		},
		onStart(side) {
			if (this.field.isTerrain('prismaticterrain')) {
				this.add('-message', `Prismatic Terrain prevented Reflect from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'Reflect');
		},
		onResidualOrder: 21,
		onEnd(side) {
			this.add('-sideend', side, 'Reflect');
		},
	},
	safeguard: {
		duration: 5,
		durationCallback(target, source, effect) {
			if (source && source.hasAbility('persistent')) {
				this.add('-activate', source, 'ability: Persistent', effect);
				return 7;
			}
			return 5;
		},
		onSetStatus(status, target, source, effect) {
			if (!effect || !source) return;
			if (effect.effectType === 'Move' && effect.infiltrates && target.side !== source.side) return;
			if (target !== source) {
				this.debug('interrupting setStatus');
				if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					this.add('-activate', target, 'move: Safeguard');
				}
				return null;
			}
		},
		onTryAddVolatile(status, target, source, effect) {
			if (!effect || !source) return;
			if (effect.effectType === 'Move' && effect.infiltrates && target.side !== source.side) return;
			if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
				if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Safeguard');
				return null;
			}
		},
		onStart(side) {
			if (this.field.isTerrain('prismaticterrain')) {
				this.add('-message', `Prismatic Terrain prevented Safeguard from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Safeguard');
		},
		onResidualOrder: 21,
		onResidualSubOrder: 2,
		onEnd(side) {
			this.add('-sideend', side, 'Safeguard');
		},
	},
	spikes: {
		onStart(side) {
			if (this.field.isTerrain('prismaticterrain')) {
				this.add('-message', `Prismatic Terrain prevented Spikes from starting!`);
				return null;
			}
			this.effectData.layers = 1;
			this.add('-sidestart', side, 'move: Spikes');
		},
		onRestart(side) {
			if (this.effectData.layers >= 3) return false;
			this.add('-sidestart', side, 'Spikes');
			this.effectData.layers++;
		},
		onSwitchIn(pokemon) {
			if (!pokemon.isGrounded()) return;
			let damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
			this.damage(damageAmounts[this.effectData.layers] * pokemon.maxhp / 24);
		},
	},
	stealthrock: {
		onStart(side) {
			if (this.field.isTerrain('prismaticterrain')) {
				this.add('-message', `Prismatic Terrain prevented Stealth Rock from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Stealth Rock');
		},
		onSwitchIn(pokemon) {
			let typeMod = this.dex.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
			this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
		},
	},
	stickyweb: {
		onStart(side) {
			if (this.field.isTerrain('prismaticterrain')) {
				this.add('-message', `Prismatic Terrain prevented Sticky Web from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Sticky Web');
		},
		onSwitchIn(pokemon) {
			if (!pokemon.isGrounded()) return;
			this.add('-activate', pokemon, 'move: Sticky Web');
			this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
		},
	},
	toxicspikes: {
		onStart(side) {
			if (this.field.isTerrain('prismaticterrain')) {
				this.add('-message', `Prismatic Terrain prevented Toxic Spikes from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Toxic Spikes');
			this.effectData.layers = 1;
		},
		onRestart(side) {
			if (this.effectData.layers >= 2) return false;
			this.add('-sidestart', side, 'move: Toxic Spikes');
			this.effectData.layers++;
		},
		onSwitchIn(pokemon) {
			if (!pokemon.isGrounded()) return;
			if (pokemon.hasType('Poison')) {
				this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
				pokemon.side.removeSideCondition('toxicspikes');
			} else if (pokemon.hasType('Steel')) {
				return;
			} else if (this.effectData.layers >= 2) {
				pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
			} else {
				pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
			}
		},
	},
};

exports.BattleStatuses = BattleStatuses;
