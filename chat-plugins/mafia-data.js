'use strict';

// TODO more roles, ect

exports.alignments = Object.assign(Object.create(null), {
	town: {
		name: 'Town',
		plural: 'Town',
		id: 'town',
		color: '#060',
		memo: ['You are aligned with the <span style="color:#060;font-weight:bold">Town</span>. You win when all threats to the Town are eliminated and at least one Town-aligned player is still alive, or nothing can prevent the same.'],
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-villager.png"/>',
	},
	mafia: {
		name: 'Mafia',
		plural: 'Mafia',
		id: 'mafia',
		color: '#F00',
		memo: [
			'Factional Communication: If there are other Mafia-aligned players, you may PM them during the game.',
			'Factional Kill: The Mafia may kill one player per night.',
			'You are aligned with the <span style="color:#F00;font-weight:bold">Mafia</span>. You win when all players without a Mafia wincon are eliminated and at least one Mafia-aligned player is still alive (or nothing can prevent the same).',
		],
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-mafia.png"/>',
	},
	werewolf: {
		name: 'Werewolf',
		plural: 'Werewolves',
		id: 'werewolf',
		color: '#FFA500',
		memo: [
			'Factional Communication: If there are other Werewolf-aligned players, you may PM them during the game.',
			'Factional Kill: The Werewolves may kill one player per Night.',
			'You are aligned with the <span style="color:#FFA500;font-weight:bold">Werewolves</span>. You win when all players without a Werewolf wincon are eliminated and at least one Werewolf-aligned player is still alive (or nothing can prevent the same).',
		],
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-werewolf.png"/>',
	},
	alien: {
		name: 'Alien',
		plural: 'Aliens',
		id: 'alien',
		color: '#F0F',
		memo: [
			'Factional Communication: If there are other Alien-aligned players, you may PM them during the game.',
			'Factional Kill: The Aliens may kill one player <span style="text-decoration:underline">once during the game</span>.',
			'You are aligned with the <span style="color:#F0F;font-weight:bold">Aliens</span>. You win when all players without a Alien wincon are eliminated and at least one Alien-aligned player is still alive (or nothing can prevent the same).',
		],
		// TODO image for alien faction
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-villager.png"/>',
	},
	cult: {
		name: 'Cult',
		plural: 'Cultists',
		id: 'cult',
		color: '#000',
		memo: [
			// TODO cult is a bit tricky and rare... confirm details of abilities before adding more memo (if any).
			'You are aligned with the <span style="color:#000;font-weight:bold">Cult</span>. You win when all players without a Cult wincon are eliminated and at least one Cult-aligned player is still alive (or nothing can prevent the same).',
		],
		// TODO image for cult faction
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-villager.png"/>',
	},
	solo: {
		// Special alignment for all roles that are on their own.
		name: 'Solo',
		plural: 'Solos',
		id: 'solo',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-goon.png"/>',
	},
});

exports.roles = Object.assign(Object.create(null), {
	vt: 'villager',
	villy: 'villager',
	'vanilla_townie': 'villager',
	townie: 'villager',
	villager: {
		name: 'Villager',
		id: 'villager',
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-villager.png"/>',
	},
	goon: {
		name: 'Goon',
		id: 'goon',
	},
	cop: {
		name: 'Cop',
		id: 'cop',
		memo: ['Cop: Each night you can PM the host the name of another player. You will be told if they are MAFIA or NOT MAFIA, or receive NO RESULT if your investigation failed.'],
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-cop.png"/>',
	},
	doc: 'doctor',
	doctor: {
		name: 'Doctor',
		id: 'doctor',
		memo: ['Doctor: During the Night, you may PM the host the name of another player. This player will be protected from all nightkills for that Night.'],
		image: '<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-doctor.png"/>',
	},
});

exports.modifiers = Object.assign(Object.create(null), {
	bp: 'bulletproof',
	bulletproof: {
		name: 'Bulletproof',
		id: 'bulletproof',
		memo: ['Bulletproof: You cannot be nightkilled.'],
	},
	xshot: {
		// Role generator will change X to the number of shots the player gets
		name: 'X-Shot',
		id: 'xshot',
		memo: ['X-Shot: You may only use this ability X times during the game.'],
	},
});
