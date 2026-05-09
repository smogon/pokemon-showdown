export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	// soothing prescence is fun and easy to code
	actions: {
		switchIn(pokemon, pos, sourceEffect, isDrag) {
			if (!pokemon || pokemon.isActive) {
				this.battle.hint("A switch failed because the Pokémon trying to switch in is already in.");
				return false;
			}

			const side = pokemon.side;
			if (pos >= side.active.length) {
				throw new Error(`Invalid switch position ${pos} / ${side.active.length}`);
			}
			const oldActive = side.active[pos];
			const unfaintedActive = oldActive?.hp ? oldActive : null;
			if (unfaintedActive) {
				oldActive.beingCalledBack = true;
				let switchCopyFlag: 'copyvolatile' | 'shedtail' | boolean = false;
				if (sourceEffect && typeof (sourceEffect as Move).selfSwitch === 'string') {
					switchCopyFlag = (sourceEffect as Move).selfSwitch!;
				}
				if (!oldActive.skipBeforeSwitchOutEventFlag && !isDrag) {
					this.battle.runEvent('BeforeSwitchOut', oldActive);
					if (this.battle.gen >= 5) {
						this.battle.eachEvent('Update');
					}
				}
				oldActive.skipBeforeSwitchOutEventFlag = false;
				if (!this.battle.runEvent('SwitchOut', oldActive)) {
					return false;
				}
				if (!oldActive.hp) {
					return 'pursuitfaint';
				}

				(side as any).lastSwitchedOut = oldActive;

				this.battle.singleEvent('End', oldActive.getAbility(), oldActive.abilityState, oldActive);

				this.battle.queue.cancelAction(oldActive);

				let newMove = null;
				if (this.battle.gen === 4 && sourceEffect) {
					newMove = oldActive.lastMove;
				}
				if (switchCopyFlag) {
					pokemon.copyVolatileFrom(oldActive, switchCopyFlag);
				}
				if (newMove) pokemon.lastMove = newMove;
				oldActive.clearVolatile();
			}
			if (oldActive) {
				oldActive.isActive = false;
				oldActive.isStarted = false;
				oldActive.usedItemThisTurn = false;
				oldActive.statsRaisedThisTurn = false;
				oldActive.statsLoweredThisTurn = false;
				oldActive.position = pokemon.position;
				if (oldActive.fainted) oldActive.status = '';
				if (this.battle.gen <= 4) {
					pokemon.lastItem = oldActive.lastItem;
					oldActive.lastItem = '';
				}
				pokemon.position = pos;
				side.pokemon[pokemon.position] = pokemon;
				side.pokemon[oldActive.position] = oldActive;
			}
			pokemon.isActive = true;
			side.active[pos] = pokemon;
			pokemon.activeTurns = 0;
			pokemon.activeMoveActions = 0;
			for (const moveSlot of pokemon.moveSlots) {
				moveSlot.used = false;
			}
			pokemon.abilityState = this.battle.initEffectState({ id: pokemon.ability, target: pokemon });
			pokemon.itemState = this.battle.initEffectState({ id: pokemon.item, target: pokemon });
			this.battle.runEvent('BeforeSwitchIn', pokemon);
			if (sourceEffect) {
				this.battle.add(isDrag ? 'drag' : 'switch', pokemon, pokemon.getFullDetails, `[from] ${sourceEffect}`);
			} else {
				this.battle.add(isDrag ? 'drag' : 'switch', pokemon, pokemon.getFullDetails);
			}
			if (isDrag && this.battle.gen === 2) pokemon.draggedIn = this.battle.turn;
			pokemon.previouslySwitchedIn++;

			if (isDrag && this.battle.gen >= 5) {
				this.runSwitch(pokemon);
			} else {
				this.battle.queue.insertChoice({ choice: 'runSwitch', pokemon });
			}

			return true;
		},
	},
	pokemon: {
		inherit: true,
		isGrounded(negateImmunity = false) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !(this.hasType('???') && 'roost' in this.volatiles)) return false;
			if (this.hasAbility(['levitate', 'asoneseadra', 'asoneklang']) && !this.battle.suppressingAbility(this)) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return item !== 'airballoon';
		},
	},
	init() {
		// Krokorok
		this.modData("Learnsets", "krokorok").learnset.ceaselessedge = ["9L1"];
		this.modData("Learnsets", "krokorok").learnset.smackdown = ["9L1"];
		// Qwilfish-Hisui
		this.modData("Learnsets", "qwilfishhisui").learnset.downtownslide = ["9L1"];
		this.modData("Learnsets", "qwilfishhisui").learnset.rapidspin = ["9L1"];
		this.modData("Learnsets", "qwilfishhisui").learnset.recover = ["9L1"];
		delete this.modData('Learnsets', 'qwilfishhisui').learnset.barbbarrage;
		// Snivy
		this.modData("Learnsets", "snivy").learnset.shimmeringsap = ["9L1"];
		this.modData("Learnsets", "snivy").learnset.aurasphere = ["9L1"];
		this.modData("Learnsets", "snivy").learnset.focusblast = ["9L1"];
		this.modData("Learnsets", "snivy").learnset.closecombat = ["9L1"];
		this.modData("Learnsets", "snivy").learnset.uturn = ["9L1"];
		// Dragonair
		this.modData("Learnsets", "dragonair").learnset.bluemoon = ["9L1"];
		this.modData("Learnsets", "dragonair").learnset.dazzlinggleam = ["9L1"];
		this.modData("Learnsets", "dragonair").learnset.calmmind = ["9L1"];
		this.modData("Learnsets", "dragonair").learnset.moonlight = ["9L1"];
		this.modData("Learnsets", "dragonair").learnset.charm = ["9L1"];
		this.modData("Learnsets", "dragonair").learnset.psyshock = ["9L1"];
		delete this.modData('Learnsets', 'dragonair').learnset.extremespeed;
		// Wimpod
		this.modData("Learnsets", "wimpod").learnset.stickyweb = ["9L1"];
		this.modData("Learnsets", "wimpod").learnset.bugbuzz = ["9L1"];
		this.modData("Learnsets", "wimpod").learnset.flamethrower = ["9L1"];
		this.modData("Learnsets", "wimpod").learnset.ember = ["9L1"];
		this.modData("Learnsets", "wimpod").learnset.willowisp = ["9L1"];
		this.modData("Learnsets", "wimpod").learnset.overheat = ["9L1"];
		this.modData("Learnsets", "wimpod").learnset.vcreate = ["9L1"];
		// Tadbulb
		this.modData("Learnsets", "tadbulb").learnset.hydropump = ["9L1"];
		this.modData("Learnsets", "tadbulb").learnset.flipturn = ["9L1"];
		this.modData("Learnsets", "tadbulb").learnset.bouncybubble = ["9L1"];
		this.modData("Learnsets", "tadbulb").learnset.electrodrift = ["9L1"];
		// Pikipek
		this.modData("Learnsets", "pikipek").learnset.playrough = ["9L1"];
		this.modData("Learnsets", "pikipek").learnset.taunt = ["9L1"];
		this.modData("Learnsets", "pikipek").learnset.dazzlinggleam = ["9L1"];
		// Chingling
		this.modData("Learnsets", "chingling").learnset.voltswitch = ["9L1"];
		this.modData("Learnsets", "chingling").learnset.willowisp = ["9L1"];
		// Charmander
		this.modData("Learnsets", "charmander").learnset.flipturn = ["9L1"];
		// Nymble
		this.modData("Learnsets", "nymble").learnset.nymblekick = ["9L1"];
		this.modData("Learnsets", "nymble").learnset.stealthrock = ["9L1"];
		// Vanillite
		this.modData("Learnsets", "vanillite").learnset.scald = ["9L1"];
		this.modData("Learnsets", "vanillite").learnset.voltswitch = ["9L1"];
		this.modData("Learnsets", "vanillite").learnset.vanilliteattackwithtoomanyeffects = ["9L1"];
		// Spheal
		this.modData("Learnsets", "spheal").learnset.hydrosteam = ["9L1"];
		this.modData("Learnsets", "spheal").learnset.flamethrower = ["9L1"];
		this.modData("Learnsets", "spheal").learnset.flipturn = ["9L1"];
		delete this.modData('Learnsets', 'spheal').learnset.surf;
		// Anorith
		this.modData("Learnsets", "anorith").learnset.uturn = ["9L1"];
		this.modData("Learnsets", "anorith").learnset.metalsound = ["9L1"];
		this.modData("Learnsets", "anorith").learnset.stoneaxe = ["9L1"];
		this.modData("Learnsets", "anorith").learnset.wish = ["9L1"];
		this.modData("Learnsets", "anorith").learnset.explosion = ["9L1"];
		this.modData("Learnsets", "anorith").learnset.copycat = ["9L1"];
		// Ditto
		this.modData("Learnsets", "ditto").learnset.explosion = ["9L1"];
		this.modData("Learnsets", "ditto").learnset.bloodmoon = ["9L1"];
		// Jigglypuff
		this.modData("Learnsets", "jigglypuff").learnset.starsmash = ["9L1"];
		this.modData("Learnsets", "jigglypuff").learnset.spikes = ["9L1"];
		delete this.modData('Learnsets', 'jigglypuff').learnset.dig;
		delete this.modData('Learnsets', 'jigglypuff').learnset.substitute;
		// Bronzor
		this.modData("Learnsets", "bronzor").learnset.mentalspin = ["9L1"];
		// Wiglett
		this.modData("Learnsets", "wiglett").learnset.gunkshot = ["9L1"];
		this.modData("Learnsets", "wiglett").learnset.gigadrain = ["9L1"];
		this.modData("Learnsets", "wiglett").learnset.knockoff = ["9L1"];
		this.modData("Learnsets", "wiglett").learnset.wigglinglash = ["9L1"];
		this.modData("Learnsets", "wiglett").learnset.sludgebomb = ["9L1"];
		this.modData("Learnsets", "wiglett").learnset.sludgewave = ["9L1"];
		this.modData("Learnsets", "wiglett").learnset.toxic = ["9L1"];
		// Gible
		this.modData("Learnsets", "gible").learnset.overheat = ["9L1"];
		this.modData("Learnsets", "gible").learnset.rapidspin = ["9L1"];
		// Vulpix
		this.modData("Learnsets", "vulpix").learnset.vcreate = ["9L1"];
		// Shuppet
		this.modData("Learnsets", "shuppet").learnset.wish = ["9L1"];
		this.modData("Learnsets", "shuppet").learnset.teleport = ["9L1"];
		// Golett
		this.modData("Learnsets", "golett").learnset.burialblast = ["9L1"];
		this.modData("Learnsets", "golett").learnset.meteorbeam = ["9L1"];
		this.modData("Learnsets", "golett").learnset.gigadrain = ["9L1"];
		// Elgyem
		this.modData("Learnsets", "elgyem").learnset.duoshock = ["9L1"];
		this.modData("Learnsets", "elgyem").learnset.swordsdance = ["9L1"];
		delete this.modData('Learnsets', 'elgyem').learnset.zenheadbutt;
		// Farfetchd
		this.modData("Learnsets", "farfetchd").learnset.ivycudgel = ["9L1"];
		// Amaura
		this.modData("Learnsets", "amaura").learnset.meteorcrash = ["9L1"];
		this.modData("Learnsets", "amaura").learnset.fireblast = ["9L1"];
		this.modData("Learnsets", "amaura").learnset.chillyreception = ["9L1"];
		// Wailmer
		this.modData("Learnsets", "wailmer").learnset.defog = ["9L1"];
		// Pikachu
		this.modData("Learnsets", "pikachu").learnset.flipturn = ["9L1"];
		this.modData("Learnsets", "pikachu").learnset.tachyoncutter = ["9L1"];
		// Morelull
		this.modData("Learnsets", "morelull").learnset.nightmare = ["9L1"];
		this.modData("Learnsets", "morelull").learnset.scorchingsands = ["9L1"];
		delete this.modData('Learnsets', 'morelull').learnset.spore;

		// Slate 2
		// Houndour
		this.modData("Learnsets", "houndour").learnset.knockoff = ["9L1"];
		this.modData("Learnsets", "houndour").learnset.slackoff = ["9L1"];
		this.modData("Learnsets", "houndour").learnset.friendlyfire = ["9L1"];
		this.modData("Learnsets", "houndour").learnset.baddybad = ["9L1"];
		// Koffing-Hoenn
		this.modData("Learnsets", "koffinghoenn").learnset.hydropump = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.liquidation = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.flipturn = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.scald = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.waterfall = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.aquaring = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.bubble = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.withdraw = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.watergun = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.soak = ["9L1"];
		this.modData("Learnsets", "koffinghoenn").learnset.surf = ["9L1"];
		delete this.modData('Learnsets', 'koffinghoenn').learnset.flamethrower;
		// Tandemaus
		this.modData("Learnsets", "tandemaus").learnset.rockblast = ["9L1"];
		this.modData("Learnsets", "tandemaus").learnset.iciclespear = ["9L1"];
		// Hakamo-o
		this.modData("Learnsets", "hakamoo").learnset.clangoroussoul = ["9L1"];
		this.modData("Learnsets", "hakamoo").learnset.flashcannon = ["9L1"];
		this.modData("Learnsets", "hakamoo").learnset.stealthrock = ["9L1"];
		// Kartana
		this.modData("Learnsets", "kartana").learnset.strengthsap = ["9L1"];
		// Ledyba
		this.modData("Learnsets", "ledyba").learnset.acrobatics = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.aerialace = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.agility = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.aircutter = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.airslash = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.attract = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.batonpass = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.bide = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.brickbreak = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.bugbite = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.bugbuzz = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.captivate = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.cometpunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.confide = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.counter = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.curse = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.dig = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.dizzypunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.doubleteam = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.doubleedge = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.drainpunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.dynamicpunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.encore = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.endure = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.facade = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.flash = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.fling = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.focuspunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.frustration = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.gigadrain = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.headbutt = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.hiddenpower = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.icepunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.infestation = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.knockoff = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.lightscreen = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.machpunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.megapunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.mimic = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.naturalgift = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.ominouswind = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.poweruppunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.protect = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.psybeam = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.reflect = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.refresh = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.rest = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.return = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.rollout = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.roost = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.round = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.safeguard = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.screech = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.secretpower = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.silverwind = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.sleeptalk = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.snore = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.solarbeam = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.stringshot = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.strugglebug = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.substitute = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.sunnyday = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.supersonic = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.swagger = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.sweetscent = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.swift = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.swordsdance = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.tackle = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.tailwind = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.thief = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.thunderpunch = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.toxic = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.uturn = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.uproar = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.ladybugdance = ["9L1"];
		this.modData("Learnsets", "ledyba").learnset.icebeam = ["9L1"];
		// Wooper-Paldea
		this.modData("Learnsets", "wooperpaldea").learnset.woopout = ["9L1"];
		// Hoothoot
		delete this.modData('Learnsets', 'hoothoot').learnset.hurricane;
		this.modData("Learnsets", "hoothoot").learnset.synchronoise = ["9L1"];
		// Raboot-Sinnoh
		this.modData("Learnsets", "rabootsinnoh").learnset.frigidlyslide = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.chillyreception = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.icebeam = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.blizzard = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.iceball = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.dragonrush = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.outrage = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.dracometeor = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.twister = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.auroraveil = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.snowscape = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.dragoncheer = ["9L1"];
		this.modData("Learnsets", "rabootsinnoh").learnset.mist = ["9L1"];
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.blazekick;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.burningjealousy;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.ember;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.fireblast;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.firefang;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.firepledge;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.firespin;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.flamecharge;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.flamethrower;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.flareblitz;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.heatwave;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.overheat;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.sunnyday;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.swordsdance;
		delete this.modData('Learnsets', 'rabootsinnoh').learnset.temperflare;
		// Honedge
		this.modData("Learnsets", "honedge").learnset.aerialace = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.afteryou = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.attract = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.autotomize = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.block = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.brickbreak = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.brutalswing = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.closecombat = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.confide = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.cut = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.destinybond = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.doubleteam = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.endure = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.facade = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.falseswipe = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.flashcannon = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.frustration = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.furycutter = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.gyroball = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.hiddenpower = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.irondefense = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.ironhead = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.laserfocus = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.magnetrise = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.metalsound = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.nightslash = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.powertrick = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.protect = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.psychocut = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.pursuit = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.raindance = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.reflect = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.rest = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.retaliate = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.return = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.reversal = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.rockslide = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.rocksmash = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.round = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.sacredsword = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.screech = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.secretpower = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.shadowclaw = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.shadowsneak = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.shockwave = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.slash = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.sleeptalk = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.snore = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.solarblade = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.spite = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.steelbeam = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.substitute = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.swagger = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.swordsdance = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.tackle = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.toxic = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.wideguard = ["9L1"];
		this.modData("Learnsets", "honedge").learnset.aegislash = ["9L1"];
		// Roselia
		this.modData("Learnsets", "roselia").learnset.absorb = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.aromatherapy = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.attract = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.bodyslam = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.bulletseed = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.captivate = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.confide = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.cottonspore = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.covet = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.cut = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.dazzlinggleam = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.doubleteam = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.doubleedge = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.endure = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.energyball = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.extrasensory = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.facade = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.flash = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.frustration = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.furycutter = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.gigadrain = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.grassknot = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.grasswhistle = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.grassyglide = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.growth = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.hiddenpower = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.ingrain = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.leafstorm = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.leechseed = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.lifedew = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.magicalleaf = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.megadrain = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.mimic = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.mindreader = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.mudslap = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.naturalgift = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.naturepower = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.nightmare = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.petalblizzard = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.petaldance = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.pinmissile = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.poisonjab = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.poisonsting = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.powerwhip = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.protect = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.psychup = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.raindance = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.razorleaf = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.rest = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.return = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.round = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.secretpower = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.seedbomb = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.shadowball = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.sleeptalk = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.sludgebomb = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.snore = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.solarbeam = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.stunspore = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.substitute = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.sunnyday = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.swagger = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.sweetkiss = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.sweetscent = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.swift = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.swordsdance = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.synthesis = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.toxic = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.toxicspikes = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.uproar = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.venoshock = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.watersport = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.weatherball = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.worryseed = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.knockoff = ["9L1"];
		this.modData("Learnsets", "roselia").learnset.mortalspin = ["9L1"];
		delete this.modData('Learnsets', 'roselia').learnset.spikes;
		delete this.modData('Learnsets', 'roselia').learnset.sleeppowder;
		// Skiploom
		this.modData("Learnsets", "skiploom").learnset.defog = ["9L1"];
		this.modData("Learnsets", "skiploom").learnset.hurricane = ["9L1"];
		this.modData("Learnsets", "skiploom").learnset.heatwave = ["9L1"];
		delete this.modData('Learnsets', 'skiploom').learnset.absorb;
		delete this.modData('Learnsets', 'skiploom').learnset.bulletseed;
		delete this.modData('Learnsets', 'skiploom').learnset.grassknot;
		delete this.modData('Learnsets', 'skiploom').learnset.leafstorm;
		delete this.modData('Learnsets', 'skiploom').learnset.magicalleaf;
		delete this.modData('Learnsets', 'skiploom').learnset.megadrain;
		delete this.modData('Learnsets', 'skiploom').learnset.seedbomb;
		delete this.modData('Learnsets', 'skiploom').learnset.solarbeam;
		delete this.modData('Learnsets', 'skiploom').learnset.trailblaze;
		delete this.modData('Learnsets', 'skiploom').learnset.toxic;
		// Spritzee
		this.modData("Learnsets", "spritzee").learnset.afteryou = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.allyswitch = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.aromatherapy = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.attract = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.calmmind = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.captivate = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.chargebeam = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.charm = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.confide = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.covet = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.dazzlinggleam = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.disable = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.disarmingvoice = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.doubleteam = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.drainingkiss = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.dreameater = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.echoedvoice = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.encore = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.endeavor = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.endure = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.energyball = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.facade = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.fairywind = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.faketears = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.flail = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.flash = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.flashcannon = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.frustration = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.gyroball = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.healbell = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.helpinghand = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.hiddenpower = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.lightscreen = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.magiccoat = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.mistyexplosion = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.mistyterrain = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.moonblast = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.nastyplot = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.odorsleuth = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.protect = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.psychup = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.psychic = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.raindance = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.reflect = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.refresh = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.rest = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.return = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.round = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.secretpower = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.skillswap = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.sleeptalk = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.snore = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.substitute = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.sunnyday = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.swagger = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.sweetkiss = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.sweetscent = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.telekinesis = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.torment = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.toxic = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.trickroom = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.wish = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.closecombat = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.uturn = ["9L1"];
		this.modData("Learnsets", "spritzee").learnset.spiritbreak = ["9L1"];
		delete this.modData('Learnsets', 'spritzee').learnset.thunderbolt;
		// Helioptile
		this.modData("Learnsets", "helioptile").learnset.agility = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.allyswitch = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.attract = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.bulldoze = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.camouflage = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.charge = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.chargebeam = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.confide = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.cut = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.darkpulse = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.dig = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.doubleteam = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.dragonrush = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.dragontail = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.electricterrain = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.electrify = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.electroball = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.electroweb = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.endure = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.facade = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.flash = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.frustration = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.glare = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.grassknot = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.hiddenpower = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.irontail = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.lightscreen = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.lowsweep = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.magnetrise = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.mudslap = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.paraboliccharge = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.pound = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.protect = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.psychup = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.quickattack = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.raindance = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.razorwind = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.rest = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.return = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.risingvoltage = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.rockslide = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.rocktomb = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.round = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.sandstorm = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.scaleshot = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.secretpower = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.shockwave = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.signalbeam = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.sleeptalk = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.snore = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.substitute = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.surf = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.swagger = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.swift = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.tailwhip = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.thunder = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.thundershock = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.thunderwave = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.thunderbolt = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.toxic = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.uturn = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.voltswitch = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.wildcharge = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.powergem = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.meteorbeam = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.stealthrock = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.rockblast = ["9L1"];
		this.modData("Learnsets", "helioptile").learnset.earthpower = ["9L1"];
	},
};
