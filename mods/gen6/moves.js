'use strict';

exports.BattleMovedex = {
	allyswitch: {
		inherit: true,
		desc: "The user swaps positions with its ally on the opposite side of the field. Fails if there is no Pokemon at that position, if the user is the only Pokemon on its side, or if the user is in the middle.",
		shortDesc: "Switches position with the ally on the far side.",
		priority: 1,
	},
	bestow: {
		inherit: true,
		desc: "The target receives the user's held item. Fails if the user has no item or is holding a Mail, if the target is already holding an item, if the user is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, a Pokemon that can Mega Evolve holding the Mega Stone for its species, or if the target is one of those Pokemon and the user is holding the respective item.",
	},
	brickbreak: {
		inherit: true,
		desc: "If this attack does not miss, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated.",
	},
	covet: {
		inherit: true,
		desc: "If this attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one. The target's item is not stolen if it is a Mail, or if the target is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, or a Pokemon that can Mega Evolve holding the Mega Stone for its species. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
	},
	darkvoid: {
		inherit: true,
		desc: "Causes the target to fall asleep.",
		shortDesc: "Puts the foe(s) to sleep.",
		accuracy: 80,
		onTryMove: function () {},
	},
	defog: {
		inherit: true,
		desc: "Lowers the target's evasiveness by 1 stage. If this move is successful and whether or not the target's evasiveness was affected, the effects of Reflect, Light Screen, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the target's side, and the effects of Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the user's side. Ignores a target's substitute, although a substitute will still block the lowering of evasiveness.",
	},
	destinybond: {
		inherit: true,
		desc: "Until the user's next turn, if an opposing Pokemon's attack knocks the user out, that Pokemon faints as well, unless the attack was Doom Desire or Future Sight.",
		onPrepareHit: function (pokemon) {
			pokemon.removeVolatile('destinybond');
		},
	},
	detect: {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
	},
	diamondstorm: {
		inherit: true,
		desc: "Has a 50% chance to raise the user's Defense by 1 stage.",
		shortDesc: "50% chance to raise user's Def by 1 for each hit.",
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
	},
	encore: {
		inherit: true,
		desc: "For 3 turns, the target is forced to repeat its last move used. If the affected move runs out of PP, the effect ends. Fails if the target is already under this effect, if it has not made a move, if the move has 0 PP, or if the move is Encore, Mimic, Mirror Move, Sketch, Struggle, or Transform.",
		effect: {
			duration: 3,
			onStart: function (target) {
				let noEncore = {encore:1, mimic:1, mirrormove:1, sketch:1, struggle:1, transform:1};
				let moveIndex = target.moves.indexOf(target.lastMove);
				if (!target.lastMove || this.getMove(target.lastMove).isZ || noEncore[target.lastMove] || (target.moveset[moveIndex] && target.moveset[moveIndex].pp <= 0)) {
					// it failed
					delete target.volatiles['encore'];
					return false;
				}
				this.effectData.move = target.lastMove;
				this.add('-start', target, 'Encore');
				if (!this.willMove(target)) {
					this.effectData.duration++;
				}
			},
			onOverrideDecision: function (pokemon, target, move) {
				if (move.id !== this.effectData.move) return this.effectData.move;
			},
			onResidualOrder: 13,
			onResidual: function (target) {
				if (target.moves.indexOf(target.lastMove) >= 0 && target.moveset[target.moves.indexOf(target.lastMove)].pp <= 0) { // early termination if you run out of PP
					delete target.volatiles.encore;
					this.add('-end', target, 'Encore');
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove: function (pokemon) {
				if (!this.effectData.move || !pokemon.hasMove(this.effectData.move)) {
					return;
				}
				for (let i = 0; i < pokemon.moveset.length; i++) {
					if (pokemon.moveset[i].id !== this.effectData.move) {
						pokemon.disableMove(pokemon.moveset[i].id);
					}
				}
			},
		},
	},
	endure: {
		inherit: true,
		desc: "The user will survive attacks made by other Pokemon during this turn with at least 1 HP. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
	},
	feint: {
		inherit: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
	},
	fellstinger: {
		inherit: true,
		desc: "Raises the user's Attack by 2 stages if this move knocks out the target.",
		shortDesc: "Raises user's Attack by 2 if this KOes the target.",
		basePower: 30,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({atk:2}, pokemon, pokemon, move);
		},
	},
	flyingpress: {
		inherit: true,
		basePower: 80,
	},
	heavyslam: {
		inherit: true,
		desc: "The power of this move depends on (user's weight / target's weight), rounded down. Power is equal to 120 if the result is 5 or more, 100 if 4, 80 if 3, 60 if 2, and 40 if 1 or less.",
	},
	hyperspacefury: {
		inherit: true,
		desc: "Lowers the user's Defense by 1 stage. This move cannot be used successfully unless the user's current form, while considering Transform, is Hoopa Unbound. If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
	},
	hyperspacehole: {
		inherit: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
	},
	kingsshield: {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Attack lowered by 2 stages. Non-damaging moves go through this protection. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
	},
	knockoff: {
		inherit: true,
		desc: "If the target is holding an item that can be removed from it, ignoring the Ability Sticky Hold, this move's power is multiplied by 1.5. If the user has not fainted, the target loses its held item. This move cannot cause Pokemon with the Ability Sticky Hold to lose their held item, cause Pokemon that can Mega Evolve to lose the Mega Stone for their species, or cause a Kyogre, a Groudon, a Giratina, an Arceus, or a Genesect to lose their Blue Orb, Red Orb, Griseous Orb, Plate, or Drive, respectively. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
	},
	leechlife: {
		inherit: true,
		basePower: 20,
		isViable: false,
		pp: 15,
	},
	lightscreen: {
		inherit: true,
		desc: "For 5 turns, the user and its party members take 0.5x damage from special attacks, or 0.66x damage if in a Double or Triple Battle. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break or Defog. Lasts for 8 turns if the user is holding Light Clay.",
	},
	minimize: {
		inherit: true,
		desc: "Raises the user's evasiveness by 2 stages. Whether or not the user's evasiveness was changed, Body Slam, Dragon Rush, Flying Press, Heat Crash, Phantom Force, Shadow Force, Steamroller, and Stomp will not check accuracy and have their damage doubled if used against the user while it is active.",
		effect: {
			noCopy: true,
			onSourceModifyDamage: function (damage, source, target, move) {
				if (['stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'phantomforce', 'heatcrash', 'shadowforce'].includes(move.id)) {
					return this.chainModify(2);
				}
			},
			onAccuracy: function (accuracy, target, source, move) {
				if (['stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'phantomforce', 'heatcrash', 'shadowforce'].includes(move.id)) {
					return true;
				}
				return accuracy;
			},
		},
	},
	mistyterrain: {
		inherit: true,
		desc: "For 5 turns, the terrain becomes Misty Terrain. During the effect, the power of Dragon-type attacks used against grounded Pokemon is multiplied by 0.5 and grounded Pokemon cannot be inflicted with a major status condition. Camouflage transforms the user into a Fairy type, Nature Power becomes Moonblast, and Secret Power has a 30% chance to lower Special Attack by 1 stage. Fails if the current terrain is Misty Terrain.",
		effect: {
			duration: 5,
			durationCallback: function (source, effect) {
				if (source && source.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus: function (status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					this.add('-activate', target, 'move: Misty Terrain');
				}
				return false;
			},
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onStart: function (battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Misty Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function (side) {
				this.add('-fieldend', 'Misty Terrain');
			},
		},
	},
	mysticalfire: {
		inherit: true,
		basePower: 65,
	},
	paraboliccharge: {
		inherit: true,
		basePower: 50,
	},
	phantomforce: {
		inherit: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
	},
	powder: {
		inherit: true,
		desc: "If the target uses a Fire-type move this turn, it is prevented from executing and the target loses 1/4 of its maximum HP, rounded half up. This effect happens before the Fire-type move would be prevented by Primordial Sea.",
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Powder');
			},
			onTryMovePriority: 1,
			onTryMove: function (pokemon, target, move) {
				if (move.type === 'Fire') {
					this.add('-activate', pokemon, 'move: Powder');
					this.damage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1));
					return false;
				}
			},
		},
	},
	protect: {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
	},
	quickguard: {
		inherit: true,
		desc: "The user and its party members are protected from attacks with original or altered priority greater than 0 made by other Pokemon, including allies, during this turn. This move modifies the same 1/X chance of being successful used by other protection moves, where X starts at 1 and triples each time this move is successfully used, but does not use the chance to check for failure. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn or if this move is already in effect for the user's side.",
	},
	reflect: {
		inherit: true,
		desc: "For 5 turns, the user and its party members take 0.5x damage from physical attacks, or 0.66x damage if in a Double or Triple Battle. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break or Defog. Brick Break removes the effect before damage is calculated. Lasts for 8 turns if the user is holding Light Clay.",
	},
	reflecttype: {
		inherit: true,
		desc: "Causes the user's types to become the same as the current types of the target. Fails if the user is an Arceus.",
	},
	rockblast: {
		inherit: true,
		flags: {protect: 1, mirror: 1},
	},
	shadowforce: {
		inherit: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
	},
	sheercold: {
		inherit: true,
		desc: "Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Ability Sturdy are immune.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		ohko: true,
	},
	spikyshield: {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user lose 1/8 of their maximum HP, rounded down. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
	},
	suckerpunch: {
		inherit: true,
		basePower: 80,
	},
	swagger: {
		inherit: true,
		accuracy: 90,
	},
	switcheroo: {
		inherit: true,
		desc: "The user swaps its held item with the target's held item. Fails if either the user or the target is holding a Mail, if neither is holding an item, if the user is trying to give or take a Mega Stone to or from the species that can Mega Evolve with it, or if the user is trying to give or take a Blue Orb, a Red Orb, a Griseous Orb, a Plate, or a Drive to or from a Kyogre, a Groudon, a Giratina, an Arceus, or a Genesect, respectively. Pokemon with the Ability Sticky Hold are immune.",
	},
	tackle: {
		inherit: true,
		basePower: 50,
	},
	thief: {
		inherit: true,
		desc: "If this attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one. The target's item is not stolen if it is a Mail, or if the target is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, or a Pokemon that can Mega Evolve holding the Mega Stone for its species. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
	},
	thousandarrows: {
		inherit: true,
		isUnreleased: true,
	},
	thousandwaves: {
		inherit: true,
		isUnreleased: true,
	},
	thunderwave: {
		inherit: true,
		accuracy: 100,
	},
	trick: {
		inherit: true,
		desc: "The user swaps its held item with the target's held item. Fails if either the user or the target is holding a Mail, if neither is holding an item, if the user is trying to give or take a Mega Stone to or from the species that can Mega Evolve with it, or if the user is trying to give or take a Blue Orb, a Red Orb, a Griseous Orb, a Plate, or a Drive to or from a Kyogre, a Groudon, a Giratina, an Arceus, or a Genesect, respectively. Pokemon with the Ability Sticky Hold are immune.",
	},
	watershuriken: {
		inherit: true,
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		category: "Physical",
	},
	wideguard: {
		inherit: true,
		desc: "The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn that target all adjacent foes or all adjacent Pokemon. This move modifies the same 1/X chance of being successful used by other protection moves, where X starts at 1 and triples each time this move is successfully used, but does not use the chance to check for failure. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn or if this move is already in effect for the user's side.",
		shortDesc: "Protects allies from multi-target hits this turn.",
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Wide Guard');
			},
			onTryHitPriority: 4,
			onTryHit: function (target, source, effect) {
				// Wide Guard blocks damaging spread moves
				if (effect && (effect.category === 'Status' || (effect.target !== 'allAdjacent' && effect.target !== 'allAdjacentFoes'))) {
					return;
				}
				this.add('-activate', target, 'move: Wide Guard');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
	},
};
