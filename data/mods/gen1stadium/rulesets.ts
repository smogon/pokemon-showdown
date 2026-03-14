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
			set.ivs = { hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30 };
			switch (this.dex.species.get(set.species).name) {
			case 'Abra':
				set.evs = { hp: 97, atk: 88, def: 96, spa: 96, spd: 96, spe: 96 };
				set.moves = ['Psychic', 'Seismic Toss', 'Reflect', 'Thunder Wave'];
				break;
			case 'Aerodactyl':
				set.evs = { hp: 7, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Fly', 'Hyper Beam', 'Supersonic', 'Dragon Rage'];
				break;
			case 'Alakazam':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Psybeam', 'Metronome', 'Disable', 'Tri Attack'];
				break;
			case 'Arbok':
				set.evs = { hp: 25, atk: 32, def: 32, spa: 24, spd: 24, spe: 24 };
				set.moves = ['Glare', 'Wrap', 'Dig', 'Strength'];
				break;
			case 'Articuno':
				set.evs = { hp: 97, atk: 96, def: 96, spa: 96, spd: 96, spe: 96 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Ice Beam', 'Sky Attack', 'Razor Wind', 'Substitute'];
				break;
			case 'Chansey':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Thunder', 'Fire Blast', 'Minimize', 'Rest'];
				break;
			case 'Charizard':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Fly', 'Swords Dance', 'Fire Spin', 'Fire Blast'];
				break;
			case 'Clefable':
				set.evs = { hp: 25, atk: 32, def: 32, spa: 24, spd: 24, spe: 24 };
				set.moves = ['Sing', 'Tri Attack', 'Minimize', 'Ice Beam'];
				break;
			case 'Cloyster':
				set.evs = { hp: 105, atk: 104, def: 104, spa: 104, spd: 104, spe: 104 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Clamp', 'Spike Cannon', 'Ice Beam', 'Supersonic'];
				break;
			case 'Dewgong':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Aurora Beam', 'Headbutt', 'Rest', 'Surf'];
				break;
			case 'Dodrio':
				set.evs = { hp: 25, atk: 32, def: 32, spa: 24, spd: 24, spe: 24 };
				set.moves = ['Fly', 'Tri Attack', 'Agility', 'Reflect'];
				break;
			case 'Dragonair':
				set.evs = { hp: 49, atk: 44, def: 48, spa: 48, spd: 48, spe: 40 };
				set.moves = ['Hyper Beam', 'Swift', 'Ice Beam', 'Thunder Wave'];
				break;
			case 'Electabuzz':
				set.evs = { hp: 25, atk: 32, def: 32, spa: 28, spd: 28, spe: 28 };
				set.moves = ['Thunder Punch', 'Mega Punch', 'Psychic', 'Thunder Wave'];
				break;
			case 'Exeggutor':
				set.evs = { hp: 105, atk: 104, def: 104, spa: 104, spd: 104, spe: 104 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Mega Drain', 'Stun Spore', 'Leech Seed', 'Egg Bomb'];
				break;
			case 'Gengar':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Thunderbolt', 'Night Shade', 'Hypnosis', 'Confuse Ray'];
				break;
			case 'Geodude':
				set.evs = { hp: 73, atk: 72, def: 64, spa: 72, spd: 72, spe: 64 };
				set.moves = ['Earthquake', 'Seismic Toss', 'Rock Slide', 'Explosion'];
				break;
			case 'Graveler':
				set.evs = { hp: 49, atk: 44, def: 48, spa: 48, spd: 48, spe: 44 };
				set.moves = ['Earthquake', 'Seismic Toss', 'Strength', 'Self-Destruct'];
				break;
			case 'Gyarados':
				set.evs = { hp: 105, atk: 104, def: 104, spa: 104, spd: 104, spe: 104 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Surf', 'Dragon Rage', 'Bite', 'Fire Blast'];
				break;
			case 'Haunter':
				set.evs = { hp: 49, atk: 44, def: 48, spa: 48, spd: 48, spe: 40 };
				set.moves = ['Mega Drain', 'Psychic', 'Explosion', 'Confuse Ray'];
				break;
			case 'Ivysaur':
				set.evs = { hp: 49, atk: 40, def: 48, spa: 48, spd: 48, spe: 40 };
				set.moves = ['Sleep Powder', 'Razor Leaf', 'Growth', 'Double-Edge'];
				break;
			case 'Jolteon':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Thunderbolt', 'Pin Missile', 'Toxic', 'Sand Attack'];
				break;
			case 'Jynx':
				set.evs = { hp: 49, atk: 44, def: 48, spa: 48, spd: 48, spe: 40 };
				set.moves = ['Ice Punch', 'Mega Punch', 'Psychic', 'Lovely Kiss'];
				break;
			case 'Kabutops':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Surf', 'Swords Dance', 'Mega Kick', 'Submission'];
				break;
			case 'Kadabra':
				set.evs = { hp: 49, atk: 40, def: 48, spa: 48, spd: 48, spe: 40 };
				set.moves = ['Psychic', 'Counter', 'Recover', 'Dig'];
				break;
			case 'Lapras':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Ice Beam', 'Solar Beam', 'Body Slam', 'Sing'];
				break;
			case 'Meowth':
				set.evs = { hp: 97, atk: 88, def: 96, spa: 96, spd: 96, spe: 96 };
				set.moves = ['Slash', 'Thunderbolt', 'Swift', 'Double Team'];
				break;
			case 'Moltres':
				set.evs = { hp: 97, atk: 96, def: 96, spa: 96, spd: 96, spe: 96 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Fire Blast', 'Fly', 'Swift', 'Substitute'];
				break;
			case 'Ninetales':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Fire Blast', 'Skull Bash', 'Confuse Ray', 'Tail Whip'];
				break;
			case 'Omanyte':
				set.evs = { hp: 73, atk: 72, def: 64, spa: 72, spd: 72, spe: 64 };
				set.moves = ['Surf', 'Ice Beam', 'Double-Edge', 'Double Team'];
				break;
			case 'Omastar':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Hydro Pump', 'Submission', 'Spike Cannon', 'Withdraw'];
				break;
			case 'Paras':
				set.evs = { hp: 97, atk: 88, def: 96, spa: 96, spd: 96, spe: 96 };
				set.moves = ['Spore', 'Slash', 'Dig', 'Mega Drain'];
				break;
			case 'Persian':
				set.evs = { hp: 25, atk: 32, def: 32, spa: 24, spd: 24, spe: 24 };
				set.moves = ['Slash', 'Bubble Beam', 'Mimic', 'Growl'];
				break;
			case 'Poliwhirl':
				set.evs = { hp: 49, atk: 40, def: 48, spa: 48, spd: 48, spe: 40 };
				set.moves = ['Hypnosis', 'Surf', 'Ice Beam', 'Earthquake'];
				break;
			case 'Poliwrath':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Hypnosis', 'Submission', 'Counter', 'Hydro Pump'];
				break;
			case 'Rapidash':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Fire Blast', 'Stomp', 'Toxic', 'Fire Spin'];
				break;
			case 'Rhyhorn':
				set.evs = { hp: 49, atk: 44, def: 48, spa: 48, spd: 48, spe: 40 };
				set.moves = ['Earthquake', 'Body Slam', 'Rock Slide', 'Fire Blast'];
				break;
			case 'Snorlax':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Mega Kick', 'Rock Slide', 'Metronome', 'Rest'];
				break;
			case 'Starmie':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Surf', 'Thunder', 'Swift', 'Harden'];
				break;
			case 'Tangela':
				set.evs = { hp: 25, atk: 32, def: 32, spa: 24, spd: 24, spe: 24 };
				set.moves = ['Mega Drain', 'Growth', 'Toxic', 'Double-Edge'];
				break;
			case 'Tauros':
				set.evs = { hp: 9, atk: 8, def: 8, spa: 8, spd: 8, spe: 16 };
				set.moves = ['Double-Edge', 'Fire Blast', 'Tail Whip', 'Bide'];
				break;
			case 'Wartortle':
				set.evs = { hp: 49, atk: 40, def: 48, spa: 48, spd: 48, spe: 40 };
				set.moves = ['Surf', 'Strength', 'Rest', 'Ice Beam'];
				break;
			case 'Zapdos':
				set.evs = { hp: 97, atk: 96, def: 96, spa: 96, spd: 96, spe: 96 };
				set.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
				set.moves = ['Thunderbolt', 'Sky Attack', 'Thunder Wave', 'Flash'];
			}
		},
	},
};
