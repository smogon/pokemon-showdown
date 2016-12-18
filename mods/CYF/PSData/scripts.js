"use strict";

 exports.BattleScripts = {
	randomCustomPSTestTeam: function (side) { 
 		let team = []; 
 		let variant = (this.random(2) === 1); 
 		let sets = { 


			'Accelgor': { 
 				species: 'Accelgor', ability: 'Sticky Hold', item: 'Focus Sash', gender: 'M',
 				moves: ['substitute', 'gigadrain', 'knockoff'], 
 				signatureMove: 'Wring On', 
 				evs: {hp:252, spa:4, spe:252}, nature: 'Timid', 
 			}, 

			'Budew': { 
 				species: 'Budew', ability: 'Poison Point', item: 'Eviolite', gender: 'M',
 				moves: ['venoshock', 'mindreader', 'energyball'], 
 				signatureMove: 'Fire Up', 
 				evs: {hp:36, def:236, spa:36, spd:196}, nature: 'Bold', 
 			}, 

			'Chatot': { 
 				species: 'Chatot', ability: 'Big Pecks', item: 'Choice Scarf', gender: 'M',
 				moves: ['nastyplot', 'chatter', 'sing'], 
 				signatureMove: 'Tell Out', 
 				evs: {spa:252, spd:4, spe:252}, nature: 'Timid', 
 			}, 

			'Crawdaunt': { 
 				species: 'Crawdaunt', ability: 'Shell Armor', item: 'Choice Band', gender: 'M',
 				moves: ['swordsdance', 'surf', 'brickbreak'], 
 				signatureMove: 'Furry Smack', 
 				evs: {atk:252, spd:4, spe:252}, nature: 'Jolly', 
 			}, 

			'Crustle': { 
 				species: 'Crustle', ability: 'Shell Armor', item: 'White Herb', gender: 'M',
 				moves: ['swordsdance', 'xscissor', 'rockslide'], 
 				signatureMove: 'Hacked Down', 
 				evs: {atk:252, spd:4, spe:252}, nature: 'Adamant', 
 			}, 

			'Dragonair': { 
 				species: 'Dragonair', ability: 'Shed Skin', item: 'Eviolite', gender: 'M',
 				moves: ['thunderwave', 'lightscreen', 'dragonrush'], 
 				signatureMove: 'Pump Out', 
 				evs: {hp:252, atk:44, spd:188, spe:24}, nature: 'Careful', 
 			}, 

			'Dragonite': { 
 				species: 'Dragonite', ability: 'Inner Focus', item: 'Lum Berry', gender: 'F',
 				moves: ['skydrop', 'blizzard', 'dragonbreath'], 
 				signatureMove: 'Wack Cute', 
 				evs: {atk:252, def:4, spe:252}, nature: 'Adamant', 
 			}, 

			'Dugtrio': { 
 				species: 'Dugtrio', ability: 'Sand Veil', item: 'Life Orb', gender: 'M',
 				moves: ['dig', 'honeclaws', 'sandstorm'], 
 				signatureMove: 'Haying Time', 
 				evs: {atk:252, def:4, spe:252}, nature: 'Jolly', 
 			}, 

			'Dusclops': { 
 				species: 'Dusclops', ability: 'Frisk', item: 'Eviolite', gender: 'F',
 				moves: ['hex', 'calmmind', 'sleeptalk'], 
 				signatureMove: 'Flame Shower', 
 				evs: {hp:252, def:124, spa:132}, nature: 'Bold', 
 			}, 

			'Espeon': { 
 				species: 'Espeon', ability: 'Synchronize', item: 'Leftovers', gender: 'M',
 				moves: ['morningsun', 'dazzlinggleam', 'healbell'], 
 				signatureMove: 'Hawl Land', 
 				evs: {hp:4, spa:252, spe:252}, nature: 'Timid', 
 			}, 

			'Furret': { 
 				species: 'Furret', ability: 'Keen Eye', item: 'Choice Scarf', gender: 'M',
 				moves: ['honeclaws', 'flamethrower', 'batonpass'], 
 				signatureMove: 'Power Shock', 
 				evs: {atk:252, spd:4, spe:252}, nature: 'Jolly', 
 			}, 

			'Gorebyss': { 
 				species: 'Gorebyss', ability: 'Swift Swim', item: 'Life Orb', gender: 'M',
 				moves: ['batonpass', 'dive', 'aquaring'], 
 				signatureMove: 'Rare Tik', 
 				evs: {def:4, spa:252, spe:252}, nature: 'Modest', 
 			}, 

			'Huntail': { 
 				species: 'Huntail', ability: 'Water Veil', item: ' Wacan Berry', gender: 'F',
 				moves: ['coil', 'batonpass', 'scald'], 
 				signatureMove: 'Hour Victory', 
 				evs: {atk:252, spa:4, spe:252}, nature: 'Naughty', 
 			}, 

			'Karrablast': { 
 				species: 'Karrablast', ability: 'Shed Skin', item: 'Choice Scarf', gender: 'M',
 				moves: ['gigadrain', 'aerialace', 'bugbite'], 
 				signatureMove: 'Scream', 
 				evs: {hp:248, atk:76, spe:192}, nature: 'Jolly', 
 			}, 

			'Krookodile': { 
 				species: 'Krookodile', ability: 'Anger Point', item: 'Choice Band', gender: 'M',
 				moves: ['protect', 'assurance', 'counter'], 
 				signatureMove: 'Shower Crush', 
 				evs: {atk:252, def:4, spe:252}, nature: 'Jolly', 
 			}, 

			'Lileep': { 
 				species: 'Lileep', ability: 'Suction Cups', item: 'Eviolite', gender: 'M',
 				moves: ['smackdown', 'seedbomb', 'stockpile'], 
 				signatureMove: 'Power Charge', 
 				evs: {hp:228, def:140, spd:140}, nature: 'Calm', 
 			}, 

			'Minccino': { 
 				species: 'Minccino', ability: 'Cute Charm', item: 'Choice Scarf', gender: 'M',
 				moves: ['uturn', 'tailslap', 'wakeupslap'], 
 				signatureMove: 'Aqua Hit', 
 				evs: {atk:196, def:36, spd:36, spe:236}, nature: 'Jolly', 
 			}, 

			'Pachirisu': { 
 				species: 'Pachirisu', ability: 'Volt Absorb', item: 'Leftovers', gender: 'F',
 				moves: ['doubleteam', 'discharge', 'rollout'], 
 				signatureMove: 'Drum Beat', 
 				evs: {hp:252, def:252, spd:4}, nature: 'Impish', 
 			}, 

			'Pelipper': { 
 				species: 'Pelipper', ability: 'Rain Dish', item: 'Leftovers', gender: 'M',
 				moves: ['skyattack', 'shockwave', 'hydropump'], 
 				signatureMove: 'Mud Block', 
 				evs: {hp:248, def:252, spd:8}, nature: 'Bold', 
 			}, 

			'Raticate': { 
 				species: 'Raticate', ability: 'Guts', item: 'Toxic Orb', gender: 'M',
 				moves: ['facade', 'swordsdance', 'thunder'], 
 				signatureMove: 'Clone Power', 
 				evs: {atk:252, def:4, spe:252}, nature: 'Jolly', 
 			}, 

			'Seismitoad': { 
 				species: 'Seismitoad', ability: 'Water Absorb', item: 'Leftovers', gender: 'M',
 				moves: ['earthpower', 'aquaring', 'surf'], 
 				signatureMove: 'Spotter Watch', 
 				evs: {hp:252, def:252, spd:4}, nature: 'Bold', 
 			}, 

			'Sneasel': { 
 				species: 'Sneasel', ability: 'Pickpocket', item: 'Life Orb', gender: 'M',
 				moves: ['icebeam', 'foulplay', 'reflect'], 
 				signatureMove: 'Wave Shot', 
 				evs: {atk:252, def:4, spe:252}, nature: 'Jolly', 
 			}, 

			'Snivy': { 
 				species: 'Snivy', ability: 'Contrary', item: 'Berry Juice', gender: 'F',
 				moves: ['twister', 'leafstorm', 'coil'], 
 				signatureMove: 'Cutting Extreme', 
 				evs: {spa:240, spe:252}, nature: 'Timid', 
 			}, 

			'Swalot': { 
 				species: 'Swalot', ability: 'Liquid Ooze', item: 'Black Sludge', gender: 'M',
 				moves: ['stockpile', 'spitup', 'sludgewave'], 
 				signatureMove: 'Poison Slam', 
 				evs: {atk:248, spa:200, spd:60}, nature: 'Quiet', 
 			}, 

			'Trapinch': { 
 				species: 'Trapinch', ability: 'Hyper Cutter', item: 'Berry Juice', gender: 'M',
 				moves: ['bodyslam', 'dig', 'crunch'], 
 				signatureMove: 'Shell Spot', 
 				evs: {hp:156, atk:36, def:236, spd:76}, nature: 'Adamant', 
 			}, 

			'Vaporeon': { 
 				species: 'Vaporeon', ability: 'Water Absorb', item: 'Leftovers', gender: 'M',
 				moves: ['batonpass', 'aquaring', 'scald'], 
 				signatureMove: 'Power Down', 
 				evs: {hp:204, def:248, spd:56}, nature: 'Bold', 
 			}, 

			'Vulpix': { 
 				species: 'Vulpix', ability: 'Flash Fire', item: 'Choice Scarf', gender: 'F',
 				moves: ['fireblast', 'energyball', 'confuseray'], 
 				signatureMove: 'Air Burn', 
 				evs: {hp:52, spa:196, spe:240}, nature: 'Modest', 
 			}, 

			'Whirlipede': { 
 				species: 'Whirlipede', ability: 'Speed Boost', item: 'Focus Sash', gender: 'M',
 				moves: ['steamroller', 'substitute', 'sleeptalk'], 
 				signatureMove: 'Peting Rush', 
 				evs: {hp:244, def:12, spe:252}, nature: 'Jolly', 
 			}, 

			'Yanmega': { 
 				species: 'Yanmega', ability: 'Speed Boost', item: 'Life Orb', gender: 'F',
 				moves: ['substitute', 'wingattack', 'secretpower'], 
 				signatureMove: 'Fouled Drive', 
 				evs: {spa:252, spd:4, spe:252}, nature: 'Modest', 
 			}, 
		};  
	}; 
];