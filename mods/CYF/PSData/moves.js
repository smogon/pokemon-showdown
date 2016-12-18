"use strict";

 exports.BattleScripts = {
	// Vulpix 
	"airburn": { 
 		accuracy: 100, 
 		basePower: 0, 
 		category: "Status", 
 		desc: "Lowers the target's Attack and Special Attack by 1 stage.", 
 		id: "airburn", 
 		name: "Air Burn", 
 		pp: 30, 
 		priority: 0, 
 		flags: {protect: 1, reflectable: 1, mirror: 1}, 
 		onPrepareHit: function (target, source) { 
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Leaf Storm", source); 
 			this.add('-anim', source, "Heat Crash", source); 
 		}, 
 		boosts: { 
 			atk: -1, 
 			spa: -1, 
 		}, 
 		secondary: false, 
 		target: "normal", 
 		type: "Fire", 
 	}, 
	// Minccino 
	"aquahit": {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a 100% chance to confuse the target and lower its Defense by 1 stage. The user recovers 3/4 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. The target thaws out if it is frozen.",
		id: "aquahit",
		name: "Aqua Hit",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1, defrost: 1},
		thawsTarget: true,
		onHit: function (target, source) { 
 			this.add('-anim', source, "Feint Attack", source); 
 			this.add('-anim', source, "Absorb", source); 
 		},
		drain: [3, 4],
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Water",
	},
	// Raticate 
	"clonepower": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense, Special Attack, and accuracy by 2 stage. Fail if the move is Clear Smog.",
		id: "clonepower",
		isViable: true,
		name: "Clone Power",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
 		onPrepareHit: function (target, source, move) { 
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Refresh", target); 
 			this.add('-anim', source, "Seed Flare", source); 
 		}, 
		onTry: function (pokemon, target) { 
 			if (move.id === 'clearsmog') { 
 				this.add('-fail', pokemon); 
 				this.add('-hint', "Clear Smog will be the first turn."); 
 				return null; 
 			} 
 		},
		boosts: {
			def: 2,
			spa: 2,
			accuracy: 2,
		},
		secondary: false,
		target: "self",
		type: "Dragon",
	},
	// Snivy 
	"cuttingextreme": { 
 		accuracy: 100, 
 		basePower: 30, 
 		category: "Physical", 
 		desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.", 
 		id: "cuttingextreme", 
 		name: "Cutting Extreme", 
 		pp: 30, 
 		priority: 0, 
 		flags: {contact: 1, protect: 1, mirror: 1}, 
		onHit: function (target, source) { 
 			this.add('-anim', source, "Torment", source); 
 			this.add('-anim', source, "Knock Off", source); 
 		}, 
 		multihit: 2, 
 		secondary: false, 
 		target: "normal", 
 		type: "Steel", 
 	}, 
	// Serperior 
	"drawsmash": {
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		desc: "No additional effect.",
		id: "drawsmash",
		name: "Draw Smash",
		pp: 30,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
 		onPrepareHit: function (target, source) { 
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Mind Reader", target); 
 		}, 
 		onHit: function (pokemon) { 
 			this.add('-anim', source, "Take Down", target); 
 		}, 
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	// Pachirisu 
	"drumbeat": { 
 		accuracy: 90, 
 		basePower: 0, 
 		damageCallback: function (pokemon, target) { 
 			return this.clampIntRange(Math.floor(target.hp / 2), 1); 
 		}, 
 		category: "Physical", 
 		desc: "Has a 100% chance to raise the user's Speed by 2 stage. Deals damage to the target equal to half of its current HP, rounded down, but not less than 1 HP.", 
 		id: "drumbeat", 
 		isViable: true, 
 		name: "Drum Beat", 
 		pp: 10, 
 		priority: 0, 
 		flags: {contact: 1, protect: 1, mirror: 1}, 
		onHit: function (source) { 
 			this.add('-anim', source, "Uproar", target); 
 			this.add('-anim', source, "Fling", target); 
 		},
		secondary: { 
 			chance: 100, 
 			self: { 
 				boosts: { 
 					spe: 2, 
 				}, 
 			}, 
 		},  
 		target: "normal", 
 		type: "Ground", 
 	}, 

	// Budew 
	"fireup": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage. The user cures its burn, poison, or paralysis. The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		id: "fireup",
		name: "Fire Up",
		pp: 40,
		priority: 4,
		flags: {snatch: 1},
 		onPrepareHit: function (target, source, move) { 
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Stockpile", target); 
 			this.add('-anim', source, "Eruption", source); 
 		}, 
		onHit: function (pokemon) {
			if (pokemon.status in {'': 1, 'slp': 1, 'frz': 1}) return false;
			pokemon.cureStatus();
		},
			pokemon.addVolatile('stall');
		},
		boosts: {
			atk: 1,
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	// Dusclops 
	"flameshower": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages. Fail if the move is Bug Buzz, or is Shadow Claw.",
		id: "flameshower",
		isViable: true,
		name: "Flame Shower",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
 		onPrepareHit: function (target, source) { 
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Magma Storm", target); 
 		}, 
		onTry: function (pokemon, target) { 
 			if (move.id === 'bugbuzz' || 'shadowclaw') { 
 				this.add('-fail', pokemon); 
 				this.add('-hint', "Do not use this move if is Bug Buzz or Shadow Claw."); 
 				return null; 
 			} 
 		}, 
		boosts: {
			spe: 2,
		},
		secondary: false,
		target: "self",
		type: "Fire",
	},
	// Yanmega 
	"fouleddrive": {
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let power = (Math.floor(25 * target.getStat('spe') / pokemon.getStat('spe')) || 1);
			if (power > 150) power = 150;
			this.debug('' + power + ' bp');
			return power;
		},
		category: "Physical",
		desc: "Power is equal to (25 * target's current Speed / user's current Speed), rounded down, + 1, but not more than 150.",
		id: "fouleddrive",
		isViable: true,
		name: "Fouled Drive",
		pp: 5,
		priority: 1,
		flags: {bullet: 1, contact: 1, protect: 1, mirror: 1},
 		onHit: function (target, source) { 
 			this.add('-anim', source, "Brave Bird", target); 
 			this.add('-anim', source, "Feint", target); 
 		},
		secondary: false,
		target: "normal",
		type: "Steel",
	},
	// Crawdaunt 
	"furrysmack": {
		accuracy: 70,
		basePower: 0,
		basePowerCallback: function (pokemon) {
			let move = pokemon.getMoveData(pokemon.lastMove);
			switch (move.pp) {
			case 0:
				return 200;
			case 1:
				return 80;
			case 2:
				return 60;
			case 3:
				return 50;
			default:
				return 40;
			}
		},
		category: "Physical",
		desc: "Has a 20% chance to flinch the target and lower its Defense and Special Attack by 2 stage and a 30% chance to paralyze it. The power of this move is based on the amount of PP remaining after normal PP reduction and the Ability Pressure resolve. 200 power for 0 PP, 80 power for 1 PP, 60 power for 2 PP, 50 power for 3 PP, and 40 power for 4 or more PP. Power doubles if the last move used by any Pokemon this turn was X-Scissor.",
		id: "furrysmack",
		name: "Furry Smack",
		pp: 10,
		noPPBoosts: true,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
 		onPrepareHit: function (target, source) { 
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Snore", source); 
 			this.add('-anim', source, "Feint Attack", source); 
 		}, 
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon) {
			let actives = pokemon.side.active;
			for (let i = 0; i < actives.length; i++) {
				if (actives[i] && actives[i].moveThisTurn === 'x-scissor') {
					this.debug('double power');
					return this.chainModify(2);
				}
			}
		},
		secondaries: [
			{
				chance: 20,
				volatileStatus: 'flinch',
				boosts: {
					def: -2,
					spa: -2,
			}, {
				chance: 30,
				status: 'par',
			},
		],
		target: "normal",
		type: "Steel",
	},
	// Crustle 
	"hackeddown": {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Lowers the user's Defense and Special Defense by 1 stage.",
		id: "hackeddown",
		isViable: true,
		name: "Hacked Down",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit: function (target, source) { 
 			this.add('-anim', source, "Sucker Punch", source); 
 		},
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
	},
	// Espeon 
	"hawlland": { 
 		accuracy: ture, 
 		basePower: 0, 
 		category: "Status", 
  		desc: "Lowers the target's Defense, Special Defense, and accuracy by 2 stage. If this move is successful and whether or not the target's Defense, Special Defense, and accuracy was affected, the effects of Reflect, Light Screen, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the target's side, and the effects of Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the user's side. Ignores a target's substitute, although a substitute will still block the lowering of Defense, Special Defense, and accuracy.", 
 		id: "hawlland", 
 		name: "Hawl Land", 
 		pp: 15, 
 		priority: 0, 
		isViable: true,
 		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1}, 
		onHit: function (target, source, move) { 
 			this.add('-anim', source, "Hyper Voice", target); 
 			this.add('-anim', source, "Precipice Blades", target); 
 			if (!target.volatiles['substitute'] || move.infiltrates) this.boost({def:-2, spd:-2, accuracy:-2}); 
 			let removeTarget = {reflect:1, lightscreen:1, safeguard:1, mist:1, spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1}; 
 			let removeAll = {spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1}; 
 			for (let targetCondition in removeTarget) { 
 				if (target.side.removeSideCondition(targetCondition)) { 
 					if (!removeAll[targetCondition]) continue; 
 					this.add('-sideend', target.side, this.getEffect(targetCondition).name, '[from] move: Hawl Land', '[of] ' + target); 
 				} 
 			} 
 			for (let sideCondition in removeAll) { 
 				if (source.side.removeSideCondition(sideCondition)) { 
 					this.add('-sideend', source.side, this.getEffect(sideCondition).name, '[from] move: Hawl Land', '[of] ' + source); 
 				} 
 			} 
 		}, 
 		boosts: { 
 			def: -2, 
 			spd: -2, 
 			accuracy: -2, 
 		}, 
 		secondary: false, 
 		target: "allAdjacentFoes", 
 		type: "Psychic", 
 	}, 
	// Dugtrio 
	"hayingtime": {  
 		accuracy: ture, 
 		basePower: 80, 
 		category: "Physical", 
 		desc: "This move does not check accuracy. Fails if the target did not select a physical attack, special attack, or Me First for use this turn, or if the target moves before the user.", 
 		id: "hayingtime", 
 		isViable: true, 
 		name: "Haying Time", 
 		pp: 20, 
 		priority: 2, 
 		flags: {contact: 1, protect: 1, mirror: 1}, 
		onHit: function (target, source) { 
 			this.add('-anim', source, "Mimic", target); 
 			this.add('-anim', source, "Aqua Tail", target); 
 		}, 
 		onTry: function (source, target) { 
 			let decision = this.willMove(target); 
 			if (!decision || decision.choice !== 'move' || (decision.move.category === 'Status' && decision.move.id !== 'mefirst') || target.volatiles.mustrecharge) { 
 				this.attrLastMove('[still]'); 
 				this.add('-fail', source); 
 				return null; 
 			} 
 		}, 
 		secondary: false, 
 		target: "normal", 
 		type: "Dark", 
 	}, 
	// Huntail 
	"hourvictory": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the target's Special Attack, and Special Defense by 2 stage. Fails if there is no ally adjacent to the user.",
		id: "hourvictory",
		name: "Hour Victory",
		pp: 20,
		priority: 0,
		flags: {authentic: 1},
		onHit: function (pokemon) {
 			this.add('-anim', source, "Clear Smog", target); 
		},
		boosts: {
			spa: 2,
			spd: 2,
		},
		secondary: false,
		target: "adjacentAlly",
		type: "Water",
	},
	// Pelipper 
 	"mudblock": { 
 		accuracy: 100, 
 		basePower: 0, 
 		damageCallback: function (pokemon) { 
 			if (!pokemon.volatiles['mudblock']) return 0; 
 			return pokemon.volatiles['mudblock'].damage || 1; 
 		}, 
 		category: "Special", 
 		desc: "Deals damage to the last foe to hit the user with a special attack and attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals damage with a Base Power of 1 instead. If that foe's position is no longer in use, the damage is done to a random foe in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by a foe's special attack or attack this turn.", 
 		id: "mudblock", 
 		name: "Mud Block", 
 		pp: 20, 
 		priority: -5, 
 		flags: {protect: 1}, 
 		beforeTurnCallback: function (pokemon) { 
 			pokemon.addVolatile('mudblock'); 
 		}, 
 		onTryHit: function (target, source, move) { 
 			if (!source.volatiles['mudblock']) return false; 
 			if (source.volatiles['mudblock'].position === null) return false; 
 		}, 
 		effect: { 
 			duration: 1, 
 			noCopy: true, 
 			onStart: function (target, source, source2, move) { 
 				this.effectData.position = null; 
 				this.effectData.damage = 0; 
 			}, 
 			onRedirectTargetPriority: -1, 
 			onRedirectTarget: function (target, source, source2) { 
 				if (source !== this.effectData.target) return; 
 				return source.side.foe.active[this.effectData.position]; 
 			}, 
 			onDamagePriority: -101, 
 			onDamage: function (damage, target, source, effect) { 
 			this.add('-anim', source, "Protect", target); 
 				if (effect && effect.effectType === 'Move' && source.side !== target.side && this.getCategory(effect.id) === 'Physical' || 'Special') { 
 					this.effectData.position = source.position; 
 					this.effectData.damage = 2 * damage; 
 				} 
 			}, 
 		}, 
 		secondary: false, 
 		target: "scripted", 
 		type: "Dark", 
 	}, 
	// Whirlipede 
	"petingrush": {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 70% chance to flinch the target. Leaves the target with at least 1 HP. Power doubles if one of the user's party members fainted last turn. Ignores the target's stat stage changes, including evasiveness.",
		id: "petingrush",
		isViable: true,
		name: "Peting Rush",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
 		onPrepareHit: function (pokemon) { 
 			this.add('-anim', source, "Howl", target); 
 		}, 
 		onHit: function (pokemon) { 
 			this.add('-anim', source, "Waterfall", target); 
 		}, 
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon) {
			if (pokemon.side.faintedLastTurn) {
				this.debug('Boosted for a faint last turn');
				return this.chainModify(2);
			}
		},
		noFaint: true,
		ignoreEvasion: true,
		ignoreDefensive: true,
		secondary: {
			chance: 70,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Psychic",
	},
	// Vaporeon 
	"powerdown": {  
 		accuracy: 100, 
 		basePower: 50, 
 		basePowerCallback: function (pokemon, target, move) { 
 			if (this.weather) return move.basePower * 2; 
 			return move.basePower; 
 		}, 
 		category: "Special", 
 		desc: "Power doubles during weather effects and this move's type changes to match; Ice type during Hail, Water type during Rain Dance, Rock type during Sandstorm, and Fire type during Sunny Day.", 
 		id: "powerdown", 
 		name: "Power Down", 
 		pp: 10, 
 		priority: 0, 
 		flags: {bullet: 1, protect: 1, mirror: 1}, 
 		onModifyMove: function (move) { 
 			switch (this.effectiveWeather()) { 
 			case 'sunnyday': 
 			case 'desolateland': 
 				move.type = 'Fire'; 
 				break; 
 			case 'raindance': 
 			case 'primordialsea': 
 				move.type = 'Water'; 
 				break; 
 			case 'sandstorm': 
 				move.type = 'Rock'; 
 				break; 
 			case 'hail': 
 				move.type = 'Ice'; 
 				break; 
 			} 
 		}, 
 		onHit: function (target, source) { 
			if (this.isWeather(['sunnyday', 'desolateland'])) {
 			this.add('-anim', source, "Solar Beam", target); 
 			this.add('-anim', source, "Solar Beam", target); 
			if (this.isWeather(['raindance', 'primordialsea'])) {
 				this.add('-anim', source, "Echoed Voice", target); 
 				this.add('-anim', source, "Water Spout", target); 
			if (this.isWeather(['sandstorm'])) {
 				this.add('-anim', source, "Vacuum Wave", target); 
			if (this.isWeather(['hail'])) {
 				this.add('-anim', source, "Freeze-Dry", target); 
 			} 
 		}, 
 		secondary: false, 
 		target: "normal", 
 		type: "Normal",  
 	}, 
	// Lileep 
	"powercharge": {
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon) {
			if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) return false;
			return pokemon.volatiles['stockpile'].layers * 100;
		},
		category: "Special",
		desc: "Has a 100% chance to paralyze the target and a 10% chance to flinch it. Power is equal to 100 times the user's Stockpile count. Fails if the user's Stockpile count is 0. Whether or not this move is successful, the user's Defense and Special Defense decrease by as many stages as Stockpile had increased them, and the user's Stockpile count resets to 0.",
		id: "powercharge",
		name: "Power Charge",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onHit: function (target, source) { 
 			this.add('-anim', source, "Charge", source); 
 			this.add('-anim', source, "Shock Wave", source); 
 		},
		onTry: function (pokemon) {
			if (!pokemon.volatiles['stockpile']) {
				return false;
			}
		},
		onAfterMove: function (pokemon) {
			pokemon.removeVolatile('stockpile');
		},
		secondaries: [
			{
				chance: 100,
				status: 'par',
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
		target: "normal",
		type: "Electric",
	},
	// Dragonair 
	"pumpout": {
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Attack by 1 stage. If the weather is Sandstorm, this move does not check accuracy. If the weather is Hail, this move's accuracy is 50%.",
		id: "pumpout",
		name: "Pump Out",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move) {
			if (this.isWeather('sandstorm')) {
				move.accuracy = true;
			} else if (this.isWeather('hail')) {
				move.accuracy = 50;
			}
		},
 		onHit: function (target, source) { 
 			this.add('-anim', source, "Extrasensory", target); 
 			this.add('-anim', source, "Sheer Cold", target); 
 		},
		secondary: {
			chance: 10,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Ice",

	},
	// Gorebyss 
	"raretik": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps all its stat stage changes with the target.",
		id: "raretik",
		name: "Rare Tik",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
 		onPrepareHit: function (target, source) { 
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Memento", target); 
 		}, 
		onHit: function (target, source) {
 			this.add('-anim', source, "Fairy Lock", target); 
 			this.add('-anim', source, "Memento", target); 
		},
			let targetBoosts = {};
			let sourceBoosts = {};

			for (let i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);

			this.add('-swapboost', source, target, '[from] move: Heart Swap');
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
	},
	// Karrablast 
 	"scream": { 
 		accuracy: true, 
 		basePower: 100, 
 		basePowerCallback: function (pokemon, target) { 
			if (target.beingCalledBack) { 
 				this.debug('Pursuit damage boost'); 
 				return move.basePower * 2; 
 			} 
 			return move.basePower; 
 		}, 
 		category: "Physical", 
		desc: "Hits five times, with each hit having a 5% chance to either cause the target to fall asleep, or flinch the target and a higher chance for a critical hit. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. Else if is the move was OHKO, deals damage to the target equal to the target's maximum HP. Ignores the target's stat stage changes, including evasiveness. Resets all of the target's stat stages to 0. If an adjacent foe switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original target. Power doubles if the user hits a foe switching out, and the user's turn is over; if a foe faints from this, the replacement Pokemon does not become active until the end of the turn. If this attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one, and the effects of Leech Seed and partial-trapping moves end for the user, and all hazards are removed from the user's side of the field. The target's item is not stolen if it is a Mail, or if the target is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, or a Pokemon that can Mega Evolve holding the Mega Stone for its species. Items lost to this move cannot be regained with Recycle or the Ability Harvest. If this attack does not miss, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated. If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally, and the target gains the effects of Nightmare. This move can hit a target using Bounce, Dig, Dive, Fly, Shadow Force, or Sky Drop. If this move hits a target under the effect of Bounce, Dig, Dive, Fly, Magnet Rise, or Telekinesis, the effect ends. During the effect, Magnet Rise fails for the target and Telekinesis fails against the target. Pokemon with the Ability Inner Focus, Insomnia, Sticky Hold, Sweet Veil, or Vital Spirit become Slow Start, and is also unaffected by weather. This move's type effectiveness against Dark, Dragon, Electric, Fairy, Fighting, Fire, Flying, Ghost, Grass, Ground, Ice, Normal, Poison, Psychic, Rock, Steel, and Water is changed to be super effective no matter what this move's type is, and its effects ignore the Abilities of other Pokemon. Prevents the target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field. Fails if the target is an Arceus, if the target has not made a move, if the move has 0 PP, or if it no longer knows the move. This move does not check accuracy.",
 		id: "scream", 
 		isNonstandard: true, 
 		ignoreImmunity: true, 
		ignoreDefensive: true, 
 		ignoreEvasion: true, 
		onFlinch: false,
 		isViable: true, 
 		name: "Scream", 
 		pp: 64, 
 		priority: 3, 
		noSketch: true,
		ignoreAbility: true,
 		flags: {contact: 1, mirror: 1, nonsky: 1, heal: 1, authentic: 1}, 
		critRatio: 2,

		onEffectiveness: function (typeMod, type) { 
 			if (type === 'Dark','Dragon','Electric','Fairy','Fighting','Fire','Flying','Ghost','Grass','Ground','Ice','Normal','Poison','Psychic','Rock','Steel','Water') return 1; 
 		}, 

 		boosts: {atk:-1, def:-1,spa:-1, spd:-1,accuracy:-1}, 
 		beforeTurnCallback: function (pokemon, target) { 
 			target.side.addSideCondition('scream', pokemon); 
 			if (!target.side.sideConditions['scream'].sources) { 
 				target.side.sideConditions['scream'].sources = []; 
 			} 
 			target.side.sideConditions['scream'].sources.push(pokemon); 
 		}, 
  		// TODO: Is this move can disable all the target's move?
 		onModifyMove: function (move, source, target) { 
 			if (target && target.beingCalledBack) move.accuracy = true; 
			move.name = 'Scream (FNTK)';
 		}, 
 		onPrepareHit: function (target, source) { 
 			this.attrLastMove('[still]'); 
			this.add('-anim', source, "Quick Attack", target);
 			this.add('-anim', source, "Hyper Voice", target); 
 			this.add('-anim', source, "Crunch", target); 
 		}, 
		onBeforeMove: function (attacker, defender, move) { 
			let oldAbility = pokemon.setAbility('slowstart');
			if (oldAbility && target.hasAbility('stickyhold') || ('innerfocus') || ('insomnia') || ('vitalspirit') || ('sweetveil')) { 
				this.add('-endability', pokemon, oldAbility, '[from] move: Scream'); 
 				this.add('-ability', pokemon, 'Slow Start', '[from] move: Scream'); 
 			}, 
 		}, 
		onAfterHit: function (target, source) {
 			this.add('message', target.name + " got bitten by " + pokemon.name + "'s bite attack!");
		},
 		effect: { 
 			duration: 1, 
 			onBeforeSwitchOut: function (pokemon) { 
 				this.debug('Pursuit start'); 
 				let sources = this.effectData.sources; 
				let alreadyAdded = false;
				for (let i = 0; i < sources.length; i++) {
					if (sources[i].moveThisTurn || sources[i].fainted) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
					}
 				for (let i = 0; i < sources.length; i++) { 
 					if (sources[i].moveThisTurn || sources[i].fainted) continue; 
 					this.cancelMove(sources[i]); 
					if (sources[i].canMegaEvo) { 
 						for (let j = 0; j < this.queue.length; j++) { 
 							if (this.queue[j].pokemon === sources[i] && this.queue[j].choice === 'megaEvo') { 
 								this.runMegaEvo(sources[i]); 
 								break; 
 							} 
 						} 
 					}, 
 					this.runMove('scream', sources[i], pokemon); 
 				} 
 			},  
			onStart: function (target) { 
 				this.add('message',pokemon.name + ' had started!'); 
				let applies = false; 
 				if (pokemon.hasType('Flying') || pokemon.hasAbility('levitate')) applies = true; 
 				if (pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] || this.getPseudoWeather('gravity')) applies = false; 
 				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) { 
 					applies = true; 
 					this.cancelMove(pokemon); 
 					pokemon.removeVolatile('twoturnmove'); 
 				} 
 				if (pokemon.volatiles['magnetrise']) { 
 					applies = true; 
 					delete pokemon.volatiles['magnetrise']; 
 				} 
 				if (pokemon.volatiles['telekinesis']) { 
 					applies = true; 
 					delete pokemon.volatiles['telekinesis']; 
 				} 
 				if (!applies) return false; 
 				this.add('-start', pokemon, 'Scream'); 
 			}, 
 			onFoeDisableMove: function (pokemon) { 
				let moves = pokemon.moveset; 
 				for (let i = 0; i < moves.length; i++) { 
 					if (foeMoves[f].id === 'struggle' && this.getMove(moves[i].move).category === 'Physical' || 'Status' || 'Special') { 
					pokemon.disableMove(foeMoves[f].id, 'hidden');
				}
				pokemon.maybeDisabled = true; 
 			}, 
 			onBeforeMovePriority 
 			onFoeBeforeMovePriority: 5, 
 			onFoeBeforeMove: function (attacker, defender, move) { 
 				if (move.id !== 'struggle' && this.effectData.source.hasMove(move.id) && move.category === 'Physical' || 'Status' || 'Special') { 
 					this.add('cant', attacker, 'move: Scream', move); 
 					return false; 
 				} 
 			}, 
 		}, 
		// If it is, then Mega Evolve before moving.
		onHit: function (target, source, move) {
			if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
			}
			if (source.item || source.volatiles['gem']) { 
 				return; 
 			} 
 			let yourItem = target.takeItem(source); 
 			if (!yourItem) { 
 				return; 
 			} 
 			if (!source.setItem(yourItem)) { 
 				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything 
 				return; 
 			} 
 			this.add('-item', source, yourItem, '[from] move: Thief', '[of] ' + target); 
			if (pokemon.runImmunity('Bug')) { 
 				pokemon.side.removeSideCondition('reflect'); 
 				pokemon.side.removeSideCondition('lightscreen'); 
				target.addVolatile("nightmare");
				pokemon.addVolatile('stall');
				target.clearBoosts();
				this.add('-clearboost', target);
 			}, 
 		}, 
		drain: [1, 2],
				} else if (move.ohko) { 
					if (move && move.flags['contact']) { 
 						if (this.random(10) < 3) { 
 					let targets = target.side.pokemon.filter(pokemon => !(pokemon.fainted || pokemon === target)); 
 					targets.sort(() => (Math.round(Math.random()) - 0.5)); 
 					let lowestpct = 1, pokemon = target, candidate; 
 					for (let i = 0; i < targets.length; i++) { 
 						candidate = targets[i]; 
 						if (candidate.hp / candidate.maxhp <= lowestpct && candidate.hp / candidate.maxhp >= 0.11) { 
 							lowestpct = candidate.hp / candidate.maxhp; 
 							pokemon = candidate; 
 						} 
 					} 
 				} 
 			} 
			onDisableMove: function (pokemon) { 
 				if (pokemon.lastMove !== 'struggle') pokemon.disableMove(pokemon.lastMove); 
 			}, 
 		}, 
		onImmunity: function (type, pokemon) { 
 			if (pokemon.status === 'par' || pokemon.status === 'psn' || pokemon.status === 'tox' || pokemon.status === 'brn') 
			source.cureStatus();
 			if (type === 'sandstorm' || type === 'hail') return false; 
 		}, 
		onTry: function (pokemon, target) { 
 			if (source.name === 'Karrablast') { 
 				this.add('message',It can't scream!'); 
				this.add('-immune', target, '[msg]');
 				return null; 
 			} 
 		}, 
 		secondary: { 
			chance: 5, 
 			onHit: function (target, pokemon) { 
				let result = this.random(2); 
 				if (result === 0) { 
					target.addVolatile('flinch');
 				} else { 
 					target.trySetStatus('slp', source); 
 				} 
 		}, 
 		self: {volatileStatus: 'Scream'}, 
		multihit: 5,  
 		target: "allAdjacentFoes", 
 		type: "Bug", 
 	}, 
	// Trapinch 
 	"shellspot": { 
 		accuracy: 100, 
 		basePower: 30, 
 		basePowerCallback: function (pokemon, target, move) { 
 			let bp = move.basePower; 
 			if (pokemon.volatiles.shellspot && pokemon.volatiles.shellspot.hitCount) { 
 				bp *= Math.pow(2, pokemon.volatiles.rollout.hitCount); 
 			} 
 			this.debug("Shell Spot bp: " + bp); 
 			return bp; 
 		}, 
 		category: "Physical", 
 		desc: "Has a 50% chance to paralyze the target and a 40% chance to flinch it. This move's type effectiveness against Electric, and Water is changed to be super effective no matter what this move's type is. If this move is successful, the user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. If this move is called by Sleep Talk, the move is used for one turn. If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Ability Suction Cups, or this move hit a substitute. Fails if the user is not asleep.", 
 		id: "shellspot", 
 		name: "Shell Spot", 
 		pp: 20, 
 		priority: 2, 
		forceSwitch: true,
		sleepUsable: false,
 		flags: {contact: 1, protect: 1, mirror: 1, sound: 1}, 
		onTryHit: function (pokemon) { 
 			if (pokemon.status !== 'slp') return false; 
 		}, 
 		onEffectiveness: function (typeMod, type) { 
 			if (type === 'Electric','Water') return 1; 
 		}, 
		onHit: function (target, source) { 
 			this.add('-anim', source, "Hone Claws", target); 
 			this.add('-anim', source, "Guillotine", target); 
 		}, 
 		effect: { 
 			duration: 2, 
 			onLockMove: 'shellspot', 
 			onStart: function () { 
 				this.effectData.hitCount = 1; 
 			}, 
 			onRestart: function () { 
 				this.effectData.hitCount++; 
 				if (this.effectData.hitCount < 5) { 
 					this.effectData.duration = 2; 
 				} 
 			}, 
 			onResidual: function (target) { 
 				if (target.lastMove === 'struggle') { 
 					// don't lock 
 					delete target.volatiles['shellspot']; 
 				} 
 			}, 
 		}, 
		secondaries: [ 
 			{ 
 				chance: 50, 
 				status: 'par', 
 			}, { 
 				chance: 40, 
 				volatileStatus: 'flinch', 
 			}, 
 		], 
 		target: "normal", 
 		type: "Ghost", 
 	}, 
	// Krookodile 
	"showercrush": {
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		id: "showercrush",
		isViable: true,
		name: "Shower Crush",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
 		onPrepareHit: function (target, source) { 
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Rock Blast", target); 
 			this.add('-anim', source, "Fissure", target); 
 		}, 
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "allAdjacentFoes",
		type: "Ground",
	},
	// Seismitoad 
	"spotterwatch": { 
 		accuracy: 100, 
 		basePower: 0, 
 		category: "Status", 
 		desc: "Lowers the target's Attack and Special Attack by 2 stage.", 
 		id: "spotterwatch", 
 		name: "Spotter Watch", 
 		pp: 30, 
 		priority: 0, 
 		flags: {protect: 1, reflectable: 1, mirror: 1}, 
		onHit: function (target, source) { 
 			this.add('-anim', source, "Bug Buzz", source); 
 			this.add('-anim', source, "Confuse Ray", source); 
 		}, 
 		boosts: { 
 			atk: -2, 
 			spa: -2, 
 		}, 
 		secondary: false, 
 		target: "normal", 
 		type: "Water", 
 	}, 
	// Chatot 
	"tellout": {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The target is unaffected by this move unless it is asleep. Lowers the target's Special Attack by 2 stages.",
		id: "tellout",
		name: "Tell Out",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
 		onPrepareHit: function (target, source) { 
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Disarming Voice", target); 
 		},
		onTryHit: function (target) {
			if (target.status !== 'slp') {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		boosts: {
			spa: -2,
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
	},
	// Dragonite 
	"wackcute": { 
 		accuracy: 100, 
 		basePower: 75, 
 		category: "Physical", 
 		desc: "Has a 30% chance to confuse the target.", 
 		id: "wackcute", 
 		name: "Wack Cute", 
 		pp: 20, 
 		priority: 0, 
 		flags: {contact: 1, protect: 1, mirror: 1}, 
 		onPrepareHit: function (target, source) { 
 			this.attrLastMove('[still]'); 
 			this.add('-anim', source, "Amnesia", target); 
 			this.add('-anim', source, "Feint Attack", target); 
 		}, 
 		secondary: { 
 			chance: 30, 
 			volatileStatus: 'confusion', 
 		}, 
 		target: "normal", 
 		type: "Rock", 
 	}, 
	// Sneasel 
	"waveshot": { 
 		accuracy: true, 
 		basePower: 0, 
 		category: "Status", 
 		desc: "On the following turn, the target cannot avoid the user's moves, even if the target is in the middle of a two-turn move. Fails if the user used this move successfully last turn and that target is still active.", 
 		id: "waveshot", 
 		name: "Wave Shot", 
 		pp: 5, 
 		priority: 3, 
 		flags: {protect: 1, mirror: 1}, 
 		onTryHit: function (target, source) { 
 			this.add('-anim', source, "Thunder Wave", target); 
 			if (source.volatiles['lockon']) return false; 
 		}, 
 		onHit: function (target, source) { 
 			this.add('-anim', source, "Sweet Scent", target); 
 			source.addVolatile('lockon', target); 
 			this.add('-activate', source, 'move: Mind Reader', '[of] ' + target); 
 		}, 
 		secondary: false, 
 		target: "normal", 
 		type: "Fire", 
 	}, 
	// Accelgor 
	"wringon": { 
 		accuracy: true, 
 		basePower: 0, 
 		category: "Status", 
 		desc: "Raises the user's Attack and Special Attack by 2 stage.", 
 		id: "wringon", 
 		name: "Wring On", 
 		pp: 30, 
 		priority: 0, 
 		flags: {snatch: 1}, 
		onHit: function (target, source) { 
 			this.add('-anim', source, "Bulk Up", source); 
 			this.add('-anim', source, "Slack Off", source); 
 			this.add('-anim', source, "Trick", source); 
 		}, 
 		boosts: { 
 			atk: 2, 
 			spa: 2, 
 		}, 
 		secondary: false, 
 		target: "self", 
 		type: "Bug", 
 	}, 
];