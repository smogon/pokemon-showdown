'use strict';

exports.BattleMovedex = {
	allyswitch: {
		inherit: true,
		priority: 1,
	},
	darkvoid: {
		inherit: true,
		accuracy: 50,
	},
	detect: {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield or Wide Guard. Fails if the user moves last this turn.",
	},
	diamondstorm: {
		inherit: true,
		desc: "Has a 50% chance to raise the user's Defense by 2 stages.",
		shortDesc: "50% chance to raise user's Def by 2 for each hit.",
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
	},
	endure: {
		inherit: true,
		desc: "The user will survive attacks made by other Pokemon during this turn with at least 1 HP. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield or Wide Guard. Fails if the user moves last this turn.",
	},
	feint: {
		inherit: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
		shortDesc: "Nullifies Detect, Protect, and Quick/Wide Guard.",
	},
	fellstinger: {
		inherit: true,
		basePower: 30,
	},
	flyingpress: {
		inherit: true,
		basePower: 80,
		isViable: false,
	},
	hyperspacefury: {
		inherit: true,
		desc: "Lowers the user's Defense by 1 stage. This move cannot be used successfully unless the user's current form, while considering Transform, is Hoopa Unbound. If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
	},
	hyperspacehole: {
		inherit: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
	}
	leechlife: {
		inherit: true,
		basePower: 20,
		isViable: false,
		pp: 15,
	},
	mysticalfire: {
		inherit: true,
		basePower: 65,
	},
	naturepower: {
		inherit: true,
		desc: "This move calls another move for use based on the battle terrain. Tri Attack on the regular Wi-Fi terrain, Thunderbolt during Electric Terrain, Moonblast during Misty Terrain, and Energy Ball during Grassy Terrain.",
	},
	paraboliccharge: {
		inherit: true,
		basePower: 65,
	},
	phantomforce: {
		inherit: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
	},
	protect: {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield or Wide Guard. Fails if the user moves last this turn.",
	},
	quickguard: {
		inherit: true,
		desc: "The user and its party members are protected from attacks with original or altered priority greater than 0 made by other Pokemon, including allies, during this turn. This move modifies the same 1/X chance of being successful used by other protection moves, where X starts at 1 and triples each time this move is successfully used, but does not use the chance to check for failure. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield or Wide Guard. Fails if the user moves last this turn or if this move is already in effect for the user's side."
	},
	secretpower: {
		inherit: true,
		desc: "Has a 30% chance to cause a secondary effect on the target based on the battle terrain. Causes paralysis on the regular Wi-Fi terrain, causes paralysis during Electric Terrain, lowers Special Attack by 1 stage during Misty Terrain, and causes sleep during Grassy Terrain. The secondary effect chance is not affected by the Ability Serene Grace.",
	},
	shadowforce: {
		inherit: true,
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
	},
	spikyshield: {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user lose 1/8 of their maximum HP, rounded down. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield or Wide Guard. Fails if the user moves last this turn.",
	},
	suckerpunch: {
		inherit: true,
		basePower: 80,
	},
	swagger: {
		inherit: true,
		basePower: 90,
	},
	tackle: {
		inherit: true,
		basePower: 50,
	},
	thunderwave: {
		inherit: true,
		accuracy: 100,
	},
	watershuriken: {
		inherit: true,
		category: "Physical",
	},
	wideguard: {
		inherit: true,
desc: "The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn that target all adjacent foes or all adjacent Pokemon. This move modifies the same 1/X chance of being successful used by other protection moves, where X starts at 1 and triples each time this move is successfully used, but does not use the chance to check for failure. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield or Wide Guard. Fails if the user moves last this turn or if this move is already in effect for the user's side.",
	},
};
