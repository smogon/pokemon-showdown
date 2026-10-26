export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	"10000000voltthunderbolt": {
		inherit: true,
		isNonstandard: null,
	},
	aciddownpour: {
		inherit: true,
		isNonstandard: null,
	},
	alloutpummeling: {
		inherit: true,
		isNonstandard: null,
	},
	assist: {
		inherit: true,
		isNonstandard: null,
	},
	baddybad: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
	},
	barrage: {
		inherit: true,
		isNonstandard: null,
	},
	barrier: {
		inherit: true,
		isNonstandard: null,
	},
	beakblast: {
		inherit: true,
		isNonstandard: null,
	},
	bestow: {
		inherit: true,
		isNonstandard: null,
	},
	bide: {
		inherit: true,
		isNonstandard: null,
	},
	blackholeeclipse: {
		inherit: true,
		isNonstandard: null,
	},
	bloomdoom: {
		inherit: true,
		isNonstandard: null,
	},
	boneclub: {
		inherit: true,
		isNonstandard: null,
	},
	bouncybubble: {
		inherit: true,
		basePower: 90,
		pp: 15,
	},
	breakneckblitz: {
		inherit: true,
		isNonstandard: null,
	},
	bubble: {
		inherit: true,
		isNonstandard: null,
	},
	buzzybuzz: {
		inherit: true,
		basePower: 90,
		pp: 15,
	},
	camouflage: {
		inherit: true,
		isNonstandard: null,
	},
	captivate: {
		inherit: true,
		isNonstandard: null,
	},
	catastropika: {
		inherit: true,
		isNonstandard: null,
	},
	chatter: {
		inherit: true,
		isNonstandard: null,
	},
	chipaway: {
		inherit: true,
		isNonstandard: null,
	},
	clamp: {
		inherit: true,
		isNonstandard: null,
	},
	clangoroussoulblaze: {
		inherit: true,
		isNonstandard: null,
	},
	cometpunch: {
		inherit: true,
		isNonstandard: null,
	},
	constrict: {
		inherit: true,
		isNonstandard: null,
	},
	continentalcrush: {
		inherit: true,
		isNonstandard: null,
	},
	corkscrewcrash: {
		inherit: true,
		isNonstandard: null,
	},
	curse: {
		inherit: true,
		target: "normal",
	},
	darkvoid: {
		inherit: true,
		isNonstandard: null,
	},
	defog: {
		inherit: true,
		onHit(defender, attacker, move) {
			let success = false;
			if (!defender.volatiles['substitute'] || move.infiltrates) success = !!this.boost({ evasion: -1 });
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
			for (const targetCondition of removeTarget) {
				if (defender.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', defender.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', `[of] ${attacker}`);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (attacker.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', attacker.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', `[of] ${attacker}`);
					success = true;
				}
			}
			return success;
		},
	},
	devastatingdrake: {
		inherit: true,
		isNonstandard: null,
	},
	dive: {
		inherit: true,
		flags: {
			contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
		},
	},
	dizzypunch: {
		inherit: true,
		isNonstandard: null,
	},
	doubleironbash: {
		inherit: true,
		isNonstandard: "LGPE",
	},
	doubleslap: {
		inherit: true,
		isNonstandard: null,
	},
	dragonhammer: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
	},
	dragonrage: {
		inherit: true,
		isNonstandard: null,
	},
	eggbomb: {
		inherit: true,
		isNonstandard: null,
	},
	electricterrain: {
		inherit: true,
		condition: {
			inherit: true,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('electric terrain boost');
					return this.chainModify(1.5);
				}
			},
		},
	},
	embargo: {
		inherit: true,
		isNonstandard: null,
	},
	extremeevoboost: {
		inherit: true,
		isNonstandard: null,
	},
	feintattack: {
		inherit: true,
		isNonstandard: null,
	},
	flameburst: {
		inherit: true,
		isNonstandard: null,
	},
	flash: {
		inherit: true,
		isNonstandard: null,
	},
	floralhealing: {
		inherit: true,
		onHit(defender, attacker) {
			let success = false;
			if (this.field.isTerrain('grassyterrain')) {
				success = !!this.heal(this.modify(defender.baseMaxhp, 0.667));
			} else {
				success = !!this.heal(Math.ceil(defender.baseMaxhp * 0.5));
			}
			if (success && !defender.isAlly(attacker)) {
				defender.staleness = 'external';
			}
			if (!success) {
				this.add('-fail', defender, 'heal');
				return null;
			}
			return success;
		},
	},
	fly: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
	},
	foresight: {
		inherit: true,
		isNonstandard: null,
	},
	freezyfrost: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		pp: 15,
	},
	frustration: {
		inherit: true,
		isNonstandard: null,
	},
	genesissupernova: {
		inherit: true,
		isNonstandard: null,
	},
	gigavolthavoc: {
		inherit: true,
		isNonstandard: null,
	},
	glitzyglow: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
	},
	grassknot: {
		inherit: true,
		onTryHit: undefined, // no inherit
	},
	grasswhistle: {
		inherit: true,
		isNonstandard: null,
	},
	grassyterrain: {
		inherit: true,
		condition: {
			inherit: true,
			onBasePower(basePower, attacker, defender, move) {
				const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
				if (weakenedMoves.includes(move.id) && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if (move.type === 'Grass' && attacker.isGrounded()) {
					this.debug('grassy terrain boost');
					return this.chainModify(1.5);
				}
			},
		},
	},
	guardianofalola: {
		inherit: true,
		isNonstandard: null,
	},
	healbell: {
		inherit: true,
		onHit(defender, attacker) {
			this.add('-activate', attacker, 'move: Heal Bell');
			let success = false;
			const allies = [...defender.side.pokemon, ...defender.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally.hasAbility('soundproof') && !this.suppressingAbility(ally)) {
					this.add('-immune', ally, '[from] ability: Soundproof');
					continue;
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
	},
	healblock: {
		inherit: true,
		isNonstandard: null,
	},
	healingwish: {
		inherit: true,
		condition: {
			duration: 2,
			onSwitchIn(defender) {
				if (!defender.fainted) {
					defender.heal(defender.maxhp);
					defender.clearStatus();
					this.add('-heal', defender, defender.getHealth, '[from] move: Healing Wish');
					defender.side.removeSlotCondition(defender, 'healingwish');
				}
			},
		},
	},
	healorder: {
		inherit: true,
		isNonstandard: null,
	},
	healpulse: {
		inherit: true,
		onHit(defender, attacker) {
			let success = false;
			if (attacker.hasAbility('megalauncher')) {
				success = !!this.heal(this.modify(defender.baseMaxhp, 0.75));
			} else {
				success = !!this.heal(Math.ceil(defender.baseMaxhp * 0.5));
			}
			if (success && !defender.isAlly(attacker)) {
				defender.staleness = 'external';
			}
			if (!success) {
				this.add('-fail', defender, 'heal');
				return null;
			}
			return success;
		},
	},
	heartstamp: {
		inherit: true,
		isNonstandard: null,
	},
	heartswap: {
		inherit: true,
		isNonstandard: null,
	},
	heatcrash: {
		inherit: true,
		onTryHit: undefined, // no inherit
	},
	heavyslam: {
		inherit: true,
		onTryHit: undefined, // no inherit
	},
	hiddenpower: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerbug: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerdark: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerdragon: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerelectric: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerfighting: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerfire: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerflying: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerghost: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowergrass: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerground: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerice: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerpoison: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerpsychic: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerrock: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowersteel: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpowerwater: {
		inherit: true,
		isNonstandard: null,
	},
	howl: {
		inherit: true,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			atk: 1,
		},
		target: "self",
	},
	hydrovortex: {
		inherit: true,
		isNonstandard: null,
	},
	hyperfang: {
		inherit: true,
		isNonstandard: null,
	},
	hyperspacefury: {
		inherit: true,
		isNonstandard: null,
	},
	hyperspacehole: {
		inherit: true,
		isNonstandard: null,
	},
	iceball: {
		inherit: true,
		isNonstandard: null,
	},
	icehammer: {
		inherit: true,
		isNonstandard: null,
	},
	infernooverdrive: {
		inherit: true,
		isNonstandard: null,
	},
	iondeluge: {
		inherit: true,
		isNonstandard: null,
	},
	judgment: {
		inherit: true,
		isNonstandard: null,
	},
	jumpkick: {
		inherit: true,
		isNonstandard: null,
	},
	karatechop: {
		inherit: true,
		isNonstandard: null,
	},
	kingsshield: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender, false)) return;
				this.add('-activate', defender, 'move: Protect');
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, attacker, defender)) {
					this.boost({ atk: -2 }, attacker, defender, this.dex.getActiveMove("King's Shield"));
				}
				return this.NOT_FAIL;
			},
			onHit(defender, attacker, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, attacker, defender)) {
					this.boost({ atk: -2 }, attacker, defender, this.dex.getActiveMove("King's Shield"));
				}
			},
		},
	},
	letssnuggleforever: {
		inherit: true,
		isNonstandard: null,
	},
	lightofruin: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	lightthatburnsthesky: {
		inherit: true,
		isNonstandard: null,
	},
	lowkick: {
		inherit: true,
		onTryHit: undefined, // no inherit
	},
	luckychant: {
		inherit: true,
		isNonstandard: null,
	},
	lunardance: {
		inherit: true,
		condition: {
			duration: 2,
			onSwitchIn(defender) {
				if (!defender.fainted) {
					defender.heal(defender.maxhp);
					defender.clearStatus();
					for (const moveSlot of defender.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
					this.add('-heal', defender, defender.getHealth, '[from] move: Lunar Dance');
					defender.side.removeSlotCondition(defender, 'lunardance');
				}
			},
		},
	},
	magnetbomb: {
		inherit: true,
		isNonstandard: null,
	},
	magnitude: {
		inherit: true,
		isNonstandard: null,
	},
	maliciousmoonsault: {
		inherit: true,
		isNonstandard: null,
	},
	meditate: {
		inherit: true,
		isNonstandard: null,
	},
	mefirst: {
		inherit: true,
		isNonstandard: null,
	},
	menacingmoonrazemaelstrom: {
		inherit: true,
		isNonstandard: null,
	},
	miracleeye: {
		inherit: true,
		isNonstandard: null,
	},
	mirrormove: {
		inherit: true,
		isNonstandard: null,
	},
	mirrorshot: {
		inherit: true,
		isNonstandard: null,
	},
	moongeistbeam: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return null;
			}
			return success;
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return null;
			}
			return success;
		},
	},
	mudbomb: {
		inherit: true,
		isNonstandard: null,
	},
	mudsport: {
		inherit: true,
		isNonstandard: null,
	},
	multiattack: {
		inherit: true,
		basePower: 90,
	},
	naturalgift: {
		inherit: true,
		isNonstandard: null,
	},
	naturesmadness: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	needlearm: {
		inherit: true,
		isNonstandard: null,
	},
	neverendingnightmare: {
		inherit: true,
		isNonstandard: null,
	},
	nightmare: {
		inherit: true,
		isNonstandard: null,
	},
	oceanicoperetta: {
		inherit: true,
		isNonstandard: null,
	},
	odorsleuth: {
		inherit: true,
		isNonstandard: null,
	},
	ominouswind: {
		inherit: true,
		isNonstandard: null,
	},
	pollenpuff: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		onHit(defender, attacker) {
			if (attacker.isAlly(defender)) {
				if (!this.heal(Math.floor(defender.baseMaxhp * 0.5))) {
					this.add('-immune', defender);
					return null;
				}
			}
		},
	},
	powder: {
		inherit: true,
		isNonstandard: null,
	},
	precipiceblades: {
		inherit: true,
		isNonstandard: null,
	},
	psychicterrain: {
		inherit: true,
		condition: {
			inherit: true,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify(1.5);
				}
			},
		},
	},
	psychoboost: {
		inherit: true,
		isNonstandard: null,
	},
	psywave: {
		inherit: true,
		isNonstandard: null,
	},
	pulverizingpancake: {
		inherit: true,
		isNonstandard: null,
	},
	punishment: {
		inherit: true,
		isNonstandard: null,
	},
	purify: {
		inherit: true,
		onHit(defender, attacker) {
			if (!defender.cureStatus()) return false;
			this.heal(Math.ceil(attacker.maxhp * 0.5), attacker);
		},
	},
	pursuit: {
		inherit: true,
		isNonstandard: null,
	},
	quash: {
		inherit: true,
		onHit(defender) {
			if (this.activePerHalf === 1) return false; // fails in singles
			const action = this.queue.willMove(defender);
			if (!action) return false;

			action.priority = -7.1;
			this.queue.cancelMove(defender);
			for (let i = this.queue.list.length - 1; i >= 0; i--) {
				if (this.queue.list[i].choice === 'residual') {
					this.queue.list.splice(i, 0, action);
					break;
				}
			}
			this.add('-activate', defender, 'move: Quash');
		},
	},
	rage: {
		inherit: true,
		isNonstandard: null,
	},
	rapidspin: {
		inherit: true,
		basePower: 20,
		secondary: undefined, // no inherit
	},
	razorwind: {
		inherit: true,
		isNonstandard: null,
	},
	refresh: {
		inherit: true,
		isNonstandard: null,
	},
	relicsong: {
		inherit: true,
		isNonstandard: null,
	},
	return: {
		inherit: true,
		isNonstandard: null,
	},
	revelationdance: {
		inherit: true,
		isNonstandard: null,
	},
	rockclimb: {
		inherit: true,
		isNonstandard: null,
	},
	rollingkick: {
		inherit: true,
		isNonstandard: null,
	},
	rototiller: {
		inherit: true,
		isNonstandard: null,
	},
	sappyseed: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		pp: 15,
	},
	savagespinout: {
		inherit: true,
		isNonstandard: null,
	},
	searingsunrazesmash: {
		inherit: true,
		isNonstandard: null,
	},
	secretpower: {
		inherit: true,
		isNonstandard: null,
	},
	seedflare: {
		inherit: true,
		isNonstandard: null,
	},
	sharpen: {
		inherit: true,
		isNonstandard: null,
	},
	shatteredpsyche: {
		inherit: true,
		isNonstandard: null,
	},
	shoreup: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			if (this.field.isWeather('sandstorm')) {
				factor = 0.667;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return null;
			}
			return success;
		},
	},
	signalbeam: {
		inherit: true,
		isNonstandard: null,
	},
	silverwind: {
		inherit: true,
		isNonstandard: null,
	},
	sinisterarrowraid: {
		inherit: true,
		isNonstandard: null,
	},
	sizzlyslide: {
		inherit: true,
		basePower: 90,
		pp: 15,
	},
	sketch: {
		inherit: true,
		isNonstandard: null,
	},
	skydrop: {
		inherit: true,
		isNonstandard: null,
	},
	skyuppercut: {
		inherit: true,
		isNonstandard: null,
	},
	smellingsalts: {
		inherit: true,
		isNonstandard: null,
	},
	snatch: {
		inherit: true,
		isNonstandard: null,
	},
	sonicboom: {
		inherit: true,
		isNonstandard: null,
	},
	soulstealing7starstrike: {
		inherit: true,
		isNonstandard: null,
	},
	sparklyswirl: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		pp: 15,
	},
	spiderweb: {
		inherit: true,
		isNonstandard: null,
	},
	spikecannon: {
		inherit: true,
		isNonstandard: null,
	},
	splinteredstormshards: {
		inherit: true,
		isNonstandard: null,
	},
	spotlight: {
		inherit: true,
		isNonstandard: null,
	},
	steamroller: {
		inherit: true,
		isNonstandard: null,
	},
	stokedsparksurfer: {
		inherit: true,
		isNonstandard: null,
	},
	subzeroslammer: {
		inherit: true,
		isNonstandard: null,
	},
	sunsteelstrike: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
	},
	supersonicskystrike: {
		inherit: true,
		isNonstandard: null,
	},
	swallow: {
		inherit: true,
		onHit(pokemon) {
			const layers = pokemon.volatiles['stockpile']?.layers || 1;
			const healAmount = [0.25, 0.5, 1];
			const success = !!this.heal(this.modify(pokemon.maxhp, healAmount[layers - 1]));
			if (!success) this.add('-fail', pokemon, 'heal');
			pokemon.removeVolatile('stockpile');
			return success || null;
		},
	},
	switcheroo: {
		inherit: true,
		onHit(defender, attacker, move) {
			const yourItem = defender.takeItem(attacker);
			const myItem = attacker.takeItem();
			if (defender.item || attacker.item || (!yourItem && !myItem)) {
				if (yourItem) defender.item = yourItem.id;
				if (myItem) attacker.item = myItem.id;
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, attacker.itemState, defender, attacker, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, defender.itemState, attacker, defender, move, yourItem))
			) {
				if (yourItem) defender.item = yourItem.id;
				if (myItem) attacker.item = myItem.id;
				return false;
			}
			this.add('-activate', attacker, 'move: Trick', `[of] ${defender}`);
			if (myItem) {
				defender.setItem(myItem);
				this.add('-item', defender, myItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', defender, yourItem, '[silent]', '[from] move: Switcheroo');
			}
			if (yourItem) {
				attacker.setItem(yourItem);
				this.add('-item', attacker, yourItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', attacker, myItem, '[silent]', '[from] move: Switcheroo');
			}
		},
	},
	synchronoise: {
		inherit: true,
		isNonstandard: null,
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return null;
			}
			return success;
		},
	},
	tailglow: {
		inherit: true,
		isNonstandard: null,
	},
	tectonicrage: {
		inherit: true,
		isNonstandard: null,
	},
	telekinesis: {
		inherit: true,
		isNonstandard: null,
	},
	teleport: {
		inherit: true,
		priority: 0,
		selfSwitch: false,
		onTry: false,
	},
	toxic: {
		inherit: true,
		onPrepareHit(defender, attacker, move) {
			if (attacker.hasType('Poison')) attacker.addVolatile('toxic');
		},
		condition: {
			noCopy: true,
			duration: 1,
			onSourceInvulnerabilityPriority: 1,
			onSourceInvulnerability(defender, attacker, move) {
				if (move && attacker === this.effectState.defender) return 0;
			},
			onSourceAccuracy(accuracy, defender, attacker, move) {
				if (move && attacker === this.effectState.defender) return true;
			},
		},
	},
	toxicthread: {
		inherit: true,
		isNonstandard: null,
	},
	trumpcard: {
		inherit: true,
		isNonstandard: null,
	},
	twineedle: {
		inherit: true,
		isNonstandard: null,
	},
	twinkletackle: {
		inherit: true,
		isNonstandard: null,
	},
	wakeupslap: {
		inherit: true,
		isNonstandard: null,
	},
	watersport: {
		inherit: true,
		isNonstandard: null,
	},
	wringout: {
		inherit: true,
		isNonstandard: null,
	},
	zippyzap: {
		inherit: true,
		basePower: 50,
		pp: 15,
		willCrit: true,
		secondary: undefined, // no inherit
	},
};
