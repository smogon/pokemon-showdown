export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	standardag: {
		inherit: true,
		ruleset: [
			'Obtainable', 'Exact HP Mod', 'Cancel Mod',
		],
	},
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: [
			'Standard AG',
			'Stadium Sleep Clause', 'Freeze Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause',
		],
	},
	stadiumpokecuprentals: {
		inherit: true,
		onChangeSet(set, format, setHas, teamHas) {
			set.level = 50;
			switch (this.dex.species.get(set.species).name) {
			case 'Bulbasaur':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Leech Seed', 'Toxic', 'Body Slam', 'Razor Leaf'];
				break;
			case 'Ivysaur':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Razor Leaf', 'Sleep Powder', 'Growth', 'Double-Edge'];
				break;
			case 'Venusaur':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Psychic', 'Seismic Toss', 'Reflect', 'Thunder Wave'];
				break;
			case 'Charmander':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Flamethrower', 'Slash', 'Dig', 'Fire Spin'];
				break;
			case 'Charmeleon':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Flamethrower', 'Counter', 'Seismic Toss', 'Strength'];
				break;
			case 'Charizard':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Fly', 'Swords Dance', 'Fire Spin', 'Fire Blast'];
				break;
			case 'Squirtle':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Surf', 'Blizzard', 'Body Slam', 'Dig'];
				break;
			case 'Wartortle':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Surf', 'Strength', 'Rest', 'Ice Beam'];
				break;
			case 'Blastoise':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Hydro Pump', 'Skull Bash', 'Withdraw', 'Seismic Toss'];
				break;
			case 'Caterpie':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['String Shot', 'Tackle'];
				break;
			case 'Metapod':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['String Shot', 'Tackle'];
				break;
			case 'Butterfree':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Psychic', 'Supersonic', 'Mega Drain', 'Stun Spore'];
				break;
			case 'Weedle':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['String Shot', 'Poison Sting'];
				break;
			case 'Kakuna':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['String Shot', 'Poison Sting'];
				break;
			case 'Beedrill':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Twineedle', 'Hyper Beam', 'Toxic', 'Focus Energy'];
				break;
			case 'Pidgey':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Fly', 'Toxic', 'Double-Edge', 'Double Team'];
				break;
			case 'Pidgeotto':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Fly', 'Quick Attack', 'Sand Attack', 'Take Down'];
				break;
			case 'Pidgeot':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Mirror Move', 'Fly', 'Quick Attack', 'Sand Attack'];
				break;
			case 'Rattata':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Super Fang', 'Blizzard', 'Quick Attack', 'Hyper Fang'];
				break;
			case 'Raticate':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Hyper Fang', 'Hyper Beam', 'Focus Energy', 'Thunder'];
				break;
			case 'Spearow':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Drill Peck', 'Mirror Move', 'Double Team', 'Double-Edge'];
				break;
			case 'Fearow':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Drill Peck', 'Mirror Move', 'Fury Attack', 'Swift'];
				break;
			case 'Ekans':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Earthquake', 'Acid', 'Screech', 'Body Slam'];
				break;
			case 'Arbok':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Glare', 'Wrap', 'Dig', 'Strength'];
				break;
			case 'Pikachu':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Thunderbolt', 'Slam', 'Thunder Wave', 'Seismic Toss'];
				break;
			case 'Raichu':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Thunder', 'Thunder Wave', 'Flash', 'Mega Kick'];
				break;
			case 'Sandshrew':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Earthquake', 'Slash', 'Seismic Toss', 'Sand Attack'];
				break;
			case 'Sandslash':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Dig', 'Swift', 'Seismic Toss', 'Sand Attack'];
				break;
			case 'Nidoran-F':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Toxic', 'Thunderbolt', 'Body Slam', 'Blizzard'];
				break;
			case 'Nidorina':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Toxic', 'Thunder', 'Double-Edge', 'Ice Beam'];
				break;
			case 'Nidoqueen':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Toxic', 'Double Kick', 'Bite', 'Earthquake'];
				break;
			case 'Nidoran-M':
				set.evs = { hp: 177, atk: 176, def: 176, spa: 176, spd: 176, spe: 176 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Blizzard', 'Body Slam', 'Thunderbolt', 'Focus Energy'];
				break;
			case 'Nidorino':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Double-Edge', 'Horn Drill', 'Focus Energy', 'Thunder'];
				break;
			case 'Nidoking':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Earthquake', 'Horn Drill', 'Rage', 'Substitute'];
				break;
			case 'Clefairy':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Thunderbolt', 'Psychic', 'Body Slam', 'Blizzard'];
				break;
			case 'Clefable':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Sing', 'Tri Attack', 'Minimize', 'Ice Beam'];
				break;
			case 'Vulpix':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Flamethrower', 'Dig', 'Confuse Ray', 'Double-Edge'];
				break;
			case 'Ninetales':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Fire Blast', 'Skull Bash', 'Confuse Ray', 'Tail Whip'];
				break;
			case 'Jigglypuff':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Sing', 'Body Slam', 'Seismic Toss', 'Psychic'];
				break;
			case 'Wigglytuff':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Sing', 'Double-Edge', 'Submission', 'Thunderbolt'];
				break;
			case 'Zubat':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Confuse Ray', 'Mega Drain', 'Toxic', 'Double-Edge'];
				break;
			case 'Golbat':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Confuse Ray', 'Mega Drain', 'Bite', 'Haze'];
				break;
			case 'Oddish':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Petal Dance', 'Toxic', 'Mega Drain', 'Double-Edge'];
				break;
			case 'Gloom':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Petal Dance', 'Take Down', 'Mega Drain', 'Stun Spore'];
				break;
			case 'Vileplume':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Petal Dance', 'Sleep Powder', 'Acid', 'Cut'];
				break;
			case 'Paras':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Spore', 'Slash', 'Dig', 'Mega Drain'];
				break;
			case 'Parasect':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Spore', 'Take Down', 'Dig', 'Solar Beam'];
				break;
			case 'Venonat':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Psychic', 'Mega Drain', 'Double-Edge', 'Stun Spore'];
				break;
			case 'Venomoth':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Psychic', 'Supersonic', 'Solar Beam', 'Swift'];
				break;
			case 'Diglett':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Earthquake', 'Slash', 'Sand Attack', 'Rock Slide'];
				break;
			case 'Dugtrio':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Dig', 'Sand Attack', 'Toxic', 'Hyper Beam'];
				break;
			case 'Meowth':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Slash', 'Thunderbolt', 'Swift', 'Double Team'];
				break;
			case 'Persian':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Slash', 'Bubble Beam', 'Mimic', 'Growl'];
				break;
			case 'Psyduck':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Surf', 'Confusion', 'Dig', 'Blizzard'];
				break;
			case 'Golduck':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Ice Beam', 'Surf', 'Toxic', 'Disable'];
				break;
			case 'Mankey':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Submission', 'Rock Slide', 'Seismic Toss', 'Screech'];
				break;
			case 'Primeape':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Fury Swipes', 'Rock Slide', 'Low Kick', 'Screech'];
				break;
			case 'Growlithe':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Flamethrower', 'Body Slam', 'Reflect', 'Dig'];
				break;
			case 'Arcanine':
				set.evs = { hp: 105, atk: 104, def: 104, spa: 104, spd: 104, spe: 104 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Fire Blast', 'Take Down', 'Dragon Rage', 'Substitute'];
				break;
			case 'Poliwag':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Body Slam', 'Blizzard', 'Surf', 'Amnesia'];
				break;
			case 'Poliwhirl':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Hypnosis', 'Surf', 'Ice Beam', 'Earthquake'];
				break;
			case 'Poliwrath':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Hypnosis', 'Submission', 'Counter', 'Hydro Pump'];
				break;
			case 'Abra':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Psychic', 'Seismic Toss', 'Reflect', 'Thunder Wave'];
				break;
			case 'Kadabra':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Psychic', 'Counter', 'Recover', 'Dig'];
				break;
			case 'Alakazam':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Psybeam', 'Metronome', 'Disable', 'Tri Attack'];
				break;
			case 'Machop':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Submission', 'Rock Slide', 'Earthquake', 'Focus Energy'];
				break;
			case 'Machoke':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Submission', 'Strength', 'Rock Slide', 'Focus Energy'];
				break;
			case 'Machamp':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Low Kick', 'Strength', 'Counter', 'Focus Energy'];
				break;
			case 'Bellsprout':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Razor Leaf', 'Growth', 'Mega Drain', 'Stun Spore'];
				break;
			case 'Weepinbell':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Razor Leaf', 'Acid', 'Wrap', 'Toxic'];
				break;
			case 'Victreebel':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Solar Beam', 'Acid', 'Reflect', 'Slam'];
				break;
			case 'Tentacool':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Surf', 'Supersonic', 'Mega Drain', 'Blizzard'];
				break;
			case 'Tentacruel':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Acid', 'Supersonic', 'Hydro Pump', 'Cut'];
				break;
			case 'Geodude':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Earthquake', 'Seismic Toss', 'Rock Slide', 'Explosion'];
				break;
			case 'Graveler':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Earthquake', 'Seismic Toss', 'Strength', 'Self-Destruct'];
				break;
			case 'Golem':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Dig', 'Seismic Toss', 'Fire Blast', 'Metronome'];
				break;
			case 'Ponyta':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Fire Blast', 'Agility', 'Horn Drill', 'Body Slam'];
				break;
			case 'Rapidash':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Fire Blast', 'Stomp', 'Toxic', 'Fire Spin'];
				break;
			case 'Slowpoke':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Surf', 'Psychic', 'Thunder Wave', 'Amnesia'];
				break;
			case 'Slowbro':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Surf', 'Psychic', 'Disable', 'Withdraw'];
				break;
			case 'Magnemite':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Thunderbolt', 'Thunder Wave', 'Supersonic', 'Double-Edge'];
				break;
			case 'Magneton':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Thunderbolt', 'Screech', 'Supersonic', 'Swift'];
				break;
			case 'Farfetch\u2019d':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Slash', 'Sand Attack', 'Toxic', 'Fly'];
				break;
			case 'Doduo':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Drill Peck', 'Tri Attack', 'Double Team', 'Reflect'];
				break;
			case 'Dodrio':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Fly', 'Tri Attack', 'Agility', 'Reflect'];
				break;
			case 'Seel':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Ice Beam', 'Body Slam', 'Horn Drill', 'Surf'];
				break;
			case 'Dewgong':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Aurora Beam', 'Heabutt', 'Rest', 'Surf'];
				break;
			case 'Grimer':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Sludge', 'Body Slam', 'Explosion', 'Screech'];
				break;
			case 'Muk':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Sludge', 'Thunderbolt', 'Hyper Beam', 'Self-Destruct'];
				break;
			case 'Shellder':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Surf', 'Explosion', 'Blizzard', 'Tri Attack'];
				break;
			case 'Cloyster':
				set.evs = { hp: 105, atk: 104, def: 104, spa: 104, spd: 104, spe: 104 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Clamp', 'Spike Cannon', 'Ice Beam', 'Supersonic'];
				break;
			case 'Gastly':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Hypnosis', 'Dream Eater', 'Psychic', 'Confuse Ray'];
				break;
			case 'Haunter':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Mega Drain', 'Psychic', 'Explosion', 'Confuse Ray'];
				break;
			case 'Gengar':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Thunderbolt', 'Night Shade', 'Hypnosis', 'Confuse Ray'];
				break;
			case 'Onix':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Earthquake', 'Rock Slide', 'Strength', 'Explosion'];
				break;
			case 'Drowzee':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Hypnois', 'Dream Eater', 'Psychic', 'Tri Attack'];
				break;
			case 'Hypno':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Hypnosis', 'Headbutt', 'Dream Eater', 'Meditate'];
				break;
			case 'Krabby':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Crabhammer', 'Guillotine', 'Double-Edge', 'Blizzard'];
				break;
			case 'Kingler':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Crabhammer', 'Guillotine', 'Stomp', 'Substitute'];
				break;
			case 'Voltorb':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Thunderbolt', 'Thunder Wave', 'Swift', 'Explosion'];
				break;
			case 'Electrode':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Thunder', 'Thunder Wave', 'Swift', 'Self-Destruct'];
				break;
			case 'Exeggcute':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Psychic', 'Explosion', 'Leech Seed', 'Toxic'];
				break;
			case 'Exeggutor':
				set.evs = { hp: 105, atk: 104, def: 104, spa: 104, spd: 104, spe: 104 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Mega Drain', 'Stun Spore', 'Leech Seed', 'Egg Bomb'];
				break;
			case 'Cubone':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Earthquake', 'Submission', 'Blizzard', 'Strength'];
				break;
			case 'Marowak':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Bonemerang', 'Thrash', 'Fire Blast', 'Focus Energy'];
				break;
			case 'Hitmonlee':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['High Jump Kick', 'Mega Kick', 'Metronome', 'Seismic Toss'];
				break;
			case 'Hitmonchan':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Submission', 'Thunder Punch', 'Ice Punch', 'Strength'];
				break;
			case 'Lickitung':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Strength', 'Blizzard', 'Thunder', 'Fire Blast'];
				break;
			case 'Koffing':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Sludge', 'Toxic', 'Thunderbolt', 'Explosion'];
				break;
			case 'Weezing':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Sludge', 'Hyper Beam', 'Fire Blast', 'Self-Destruct'];
				break;
			case 'Rhyhorn':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Earthquake', 'Body Slam', 'Rock Slide', 'Fire Blast'];
				break;
			case 'Rhydon':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Dig', 'Strength', 'Thunder', 'Surf'];
				break;
			case 'Chansey':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Thunder', 'Fire Blast', 'Minimize', 'Rest'];
				break;
			case 'Tangela':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Mega Drain', 'Growth', 'Toxic', 'Double-Edge'];
				break;
			case 'Kangaskhan':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Dizzy Punch', 'Rock Slide', 'Surf', 'Thunderbolt'];
				break;
			case 'Horsea':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Hydro Pump', 'Toxic', 'Smokescreen', 'Ice Beam'];
				break;
			case 'Seadra':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Surf', 'Toxic', 'Smokescreen', 'Swift'];
				break;
			case 'Goldeen':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Surf', 'Supersonic', 'Horn Drill', 'Blizzard'];
				break;
			case 'Seaking':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Waterfall', 'Supersonic', 'Horn Attack', 'Ice Beam'];
				break;
			case 'Staryu':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Hydro Pump', 'Recover', 'Thunderbolt', 'Psychic'];
				break;
			case 'Starmie':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Surf', 'Thunder', 'Swift', 'Harden'];
				break;
			case 'Mr. Mime':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Barrier', 'Psychic', 'Metronome', 'Seismic Toss'];
				break;
			case 'Scyther':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Slash', 'Wing Attack', 'Leer', 'Double Team'];
				break;
			case 'Jynx':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Ice Punch', 'Mega Punch', 'Psychic', 'Lovely Kiss'];
				break;
			case 'Electabuzz':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Thunder Punch', 'Mega Punch', 'Psychic', 'Thunder Wave'];
				break;
			case 'Magmar':
				set.evs = { hp: 121, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 };
				set.ivs = { hp: 6, atk: 8, def: 8, spa: 6, spd: 6, spe: 6 };
				set.moves = ['Fire Punch', 'Mega Punch', 'Psychic', 'Smokescreen'];
				break;
			case 'Pinsir':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Strength', 'Harden', 'Seismic Toss', 'Guillotine'];
				break;
			case 'Tauros':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Double-Edge', 'Fire Blast', 'Tail Whip', 'Bide'];
				break;
			case 'Magikarp':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Splash', 'Tackle'];
				break;
			case 'Gyarados':
				set.evs = { hp: 105, atk: 104, def: 104, spa: 104, spd: 104, spe: 104 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Surf', 'Dragon Rage', 'Bite', 'Fire Blast'];
				break;
			case 'Lapras':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Ice Beam', 'Solar Beam', 'Body Slam', 'Sing'];
				break;
			case 'Ditto':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Transform'];
				break;
			case 'Eevee':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Body Slam', 'Swift', 'Sand Attack', 'Toxic'];
				break;
			case 'Vaporeon':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Surf', 'Quick Attack', 'Sand Attack', 'Acid Armor'];
				break;
			case 'Jolteon':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Thunderbolt', 'Pin Missile', 'Toxic', 'Sand Attack'];
				break;
			case 'Flareon':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Fire Blast', 'Take Down', 'Smog', 'Sand Attack'];
				break;
			case 'Omanyte':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Surf', 'Ice Beam', 'Double Edge', 'Double Team'];
				break;
			case 'Omastar':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Hydro Pump', 'Submission', 'Spike Cannon', 'Withdraw'];
				break;
			case 'Kabuto':
				set.evs = { hp: 145, atk: 144, def: 144, spa: 144, spd: 144, spe: 144 };
				set.ivs = { hp: 12, atk: 12, def: 10, spa: 12, spd: 12, spe: 10 };
				set.moves = ['Hydro Pump', 'Blizzard', 'Slash', 'Double Team'];
				break;
			case 'Kabutops':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Surf', 'Swords Dance', 'Mega Kick', 'Submission'];
				break;
			case 'Aerodactyl':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Fly', 'Hyper Beam', 'Supersonic', 'Dragon Rage'];
				break;
			case 'Snorlax':
				set.evs = { hp: 113, atk: 112, def: 112, spa: 112, spd: 112, spe: 112 };
				set.ivs = { hp: 4, atk: 4, def: 4, spa: 4, spd: 4, spe: 6 };
				set.moves = ['Mega Kick', 'Rock Slide', 'Metronome', 'Rest'];
				break;
			case 'Articuno':
				set.evs = { hp: 97, atk: 96, def: 96, spa: 96, spd: 96, spe: 96 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Ice Beam', 'Sky Attack', 'Razor Wind', 'Substitute'];
				break;
			case 'Zapdos':
				set.evs = { hp: 97, atk: 96, def: 96, spa: 96, spd: 96, spe: 96 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Thunderbolt', 'Sky Attack', 'Thunder Wave', 'Flash'];
				break;
			case 'Moltres':
				set.evs = { hp: 97, atk: 96, def: 96, spa: 96, spd: 96, spe: 96 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Fire Blast', 'Fly', 'Swift', 'Substitute'];
				break;
			case 'Dratini':
				set.evs = { hp: 161, atk: 160, def: 160, spa: 160, spd: 160, spe: 160 };
				set.ivs = { hp: 14, atk: 12, def: 14, spa: 14, spd: 14, spe: 14 };
				set.moves = ['Hyper Beam', 'Body Slam', 'Thunderbolt', 'Thunder Wave'];
				break;
			case 'Dragonair':
				set.evs = { hp: 129, atk: 128, def: 128, spa: 128, spd: 128, spe: 128 };
				set.ivs = { hp: 10, atk: 8, def: 10, spa: 10, spd: 10, spe: 8 };
				set.moves = ['Hyper Beam', 'Swift', 'Ice Beam', 'Thunder Wave'];
				break;
			case 'Dragonite':
				set.evs = { hp: 97, atk: 96, def: 96, spa: 96, spd: 96, spe: 96 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Slam', 'Dragon Rage', 'Thunder', 'Agility'];
			}
		},
	},
};
