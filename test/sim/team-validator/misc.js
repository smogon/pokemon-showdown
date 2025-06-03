'use strict';

const assert = require('../../assert');

describe('Team Validator', () => {
	it("should allow Shedinja to take exactly one level-up move from Ninjask in gen 3-4", () => {
		let team = [
			{ species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen4ou');

		team = [
			{ species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'batonpass'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen3ou');

		team = [
			{ species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance', 'batonpass'], evs: { hp: 1 } },
			{ species: 'charmander', ability: 'blaze', moves: ['flareblitz', 'dragondance'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen4ou');
	});

	it('should correctly enforce levels on Pokémon with unusual encounters in RBY', () => {
		const team = [
			{ species: 'dragonair', level: 15, moves: ['dragonrage'], evs: { hp: 1 } },
			{ species: 'electrode', level: 15, moves: ['thunderbolt'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen1ou');
	});

	it('should correctly enforce per-game evolution restrictions', () => {
		let team = [
			{ species: 'raichualola', ability: 'surgesurfer', moves: ['doublekick'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');

		team = [
			{ species: 'raichualola', ability: 'surgesurfer', moves: ['sing', 'fakeout'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8anythinggoes@@@minsourcegen=8');

		team = [
			{ species: 'exeggutoralola', ability: 'frisk', moves: ['psybeam'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');

		// This works in Gen 9+ because of Mirror Herb
		team = [
			{ species: 'raichualola', ability: 'surgesurfer', moves: ['fakeout'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen9anythinggoes');
	});

	it('should prevent Pokemon that don\'t evolve via level-up and evolve from a Pokemon that does evolve via level-up from being underleveled.', () => {
		const team = [
			{ species: 'nidoking', level: 1, ability: 'sheerforce', moves: ['earthpower'], evs: { hp: 1 } },
			{ species: 'mamoswine', level: 1, ability: 'oblivious', moves: ['earthquake'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
	});

	it('should require Pokémon transferred from Gens 1 and 2 to be above Level 2', () => {
		const team = [
			{ species: 'pidgey', level: 1, ability: 'bigpecks', moves: ['curse'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ou');

		team[0].level = 2;
		assert.false.legalTeam(team, 'gen7ou');

		team[0].level = 3;
		assert.legalTeam(team, 'gen7ou');
	});

	it('should enforce Gen 1 minimum levels', () => {
		let team = [
			{ species: 'onix', level: 12, moves: ['headbutt'] },
		];
		assert.false.legalTeam(team, 'gen1ou');

		assert.legalTeam(team, 'gen2ou');

		team = [
			{ species: 'slowbro', level: 15, moves: ['earthquake'] },
			{ species: 'voltorb', level: 14, moves: ['thunderbolt'] },
			{ species: 'scyther', level: 15, moves: ['quickattack'] },
			{ species: 'pinsir', level: 15, moves: ['visegrip'] },
		];

		assert.legalTeam(team, 'gen1ou');
	});

	it('should correctly enforce Shell Smash as a sketched move for Necturna prior to Gen 9', () => {
		const team = [
			{ species: 'necturna', ability: 'forewarn', moves: ['shellsmash', 'vcreate'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8cap');
	});

	it("should prevent Pokemon from having a Gen 3 tutor move and a Gen 4 ability together without evolving", () => {
		let team = [
			{ species: 'hitmonchan', ability: 'ironfist', moves: ['dynamicpunch'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen4ou');

		// Clefairy can learn Softboiled and evolve into Magic Guard Clefable
		team = [
			{ species: 'clefable', ability: 'magicguard', moves: ['softboiled'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen4ou');
	});

	// Based on research by Anubis: https://www.smogon.com/forums/posts/9713378
	describe(`Hackmons formes`, () => {
		it(`should reject battle-only formes in Gen 9, even in Hackmons`, () => {
			const team = [
				{ species: 'palafinhero', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'zamazentacrowned', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should also reject battle-only dexited formes in Gen 9 Hackmons`, () => {
			const team = [
				{ species: 'zygardecomplete', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'darmanitangalarzen', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'eternatuseternamax', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should not allow Xerneas with a hacked Ability in Gen 9 Hackmons`, () => {
			const team = [
				{ species: 'xerneasneutral', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should allow various other hacked formes in Gen 9 Hackmons`, () => {
			const team = [
				{ species: 'giratinaorigin', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'calyrexshadow', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'greninjaash', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'gengarmega', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'groudonprimal', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'necrozmaultra', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.legalTeam(team, 'gen9purehackmons');
		});

		it(`should not allow old gen-exclusive formes in Gen 9 Hackmons`, () => {
			let team = [
				{ species: 'pikachucosplay', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');

			team = [
				{ species: 'pichuspikyeared', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');

			team = [
				{ species: 'pokestarsmeargle', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should not allow CAP Pokemon in Gen 9 Hackmons`, () => {
			const team = [
				{ species: 'hemogoblin', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should allow battle-only formes in Hackmons before Gen 9`, () => {
			const team = [
				{ species: 'zamazentacrowned', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'zygardecomplete', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.legalTeam(team, 'gen8customgame@@@-Nonexistent');
		});
	});

	it('should allow various (underleveled) from Pokemon GO', () => {
		const team = [
			{ species: 'mewtwo', level: 20, ability: 'pressure', moves: ['agility'], evs: { hp: 1 }, ivs: { hp: 1, atk: 1, def: 1, spa: 1, spd: 1 } },
			{ species: 'donphan', level: 1, ability: 'sturdy', moves: ['endeavor'] },
			{ species: 'mew', shiny: true, level: 15, ability: 'synchronize', moves: ['pound'], evs: { hp: 1 } },
			{ species: 'uxie', level: 1, ability: 'levitate', moves: ['acrobatics'] },
			{ species: 'zacian', ability: 'intrepidsword', moves: ['agility'], evs: { hp: 1 } },
			{ species: 'volcarona', level: 2, ability: 'flamebody', moves: ['acrobatics'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen9ubers');
	});

	it('should disallow Pokemon from Pokemon GO knowing incompatible moves', () => {
		const team = [
			{ species: 'mew', shiny: true, level: 15, ability: 'synchronize', moves: ['aircutter'], evs: { hp: 1 }, ivs: { hp: 21, atk: 31, def: 21, spa: 21, spd: 31, spe: 0 } },
		];
		assert.false.legalTeam(team, 'gen8ou');
	});

	it('should check for legal combinations of prevo/evo-exclusive moves', () => {
		let team = [
			{ species: 'slowking', ability: 'oblivious', moves: ['counter', 'slackoff'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ou');

		team = [
			{ species: 'incineroar', ability: 'blaze', moves: ['knockoff', 'partingshot'], evs: { hp: 1 } },
			{ species: 'shelloseast', ability: 'stickyhold', moves: ['infestation', 'stringshot'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen8ou');
	});

	describe('Limit Stat Pass', () => {
		it('should reject invalid inputs', () => {
			const team = [{ species: 'rattata', ability: 'noability', item: '', moves: ['tackle'], evs: { hp: 1 } }];

			// should hint !limitstatpass
			let format = 'gen9customgame@@@limitstatpass=';
			assert.false.legalTeam(team, format);
			format = 'gen9customgame@@@limitstatpass=    ';
			assert.false.legalTeam(team, format);

			format = 'gen9customgame@@@limitstatpass=abcdefg123';
			assert.false.legalTeam(team, format);
			format = 'gen9customgame@@@limitstatpass=sources1/asdf';
			assert.false.legalTeam(team, format);
		});

		it('should enforce the limits correctly', () => {
			// Any number of stat passers, max of 1 source of stat boosts each.
			let format = 'gen9customgame@@@limitstatpass=sources1';

			let team = [{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance'], evs: { hp: 1 } }];
			assert.legalTeam(team, format);

			team = [
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance'], evs: { hp: 1 } },
			];
			assert.legalTeam(team, format);

			team = [{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility'], evs: { hp: 1 } }];
			assert.false.legalTeam(team, format);

			team = [
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, format);

			// Max of 1 stat passers, any number of stat boosts each.
			format = 'gen9customgame@@@limitstatpass=passers1';

			team = [{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance'], evs: { hp: 1 } }];
			assert.legalTeam(team, format);

			team = [{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility'], evs: { hp: 1 } }];
			assert.legalTeam(team, format);

			team = [
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, format);

			team = [
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, format);

			// Max of 2 stat passers, max of 3 sources of stat boosts each.
			format = 'gen9customgame@@@limitstatpass=passers2/sources3';

			team = [
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility', 'nastyplot'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility', 'nastyplot'], evs: { hp: 1 } },
			];
			assert.legalTeam(team, format);

			team = [
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility', 'nastyplot'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility', 'nastyplot'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass'], evs: { hp: 1 } },
			];
			assert.legalTeam(team, format);

			team = [
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility', 'nastyplot'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, format);

			team = [
				{ species: 'rattata', ability: 'noability', item: 'weaknesspolicy', moves: ['batonpass', 'swordsdance', 'agility', 'nastyplot'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass', 'swordsdance', 'agility', 'nastyplot'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, format);
		});

		it('should detect potential stat boosts from dynamax', () => {
			let format = 'gen8customgame@@@batonpassstatclause';

			let team = [{ species: 'hawlucha', ability: 'moldbreaker', item: '', moves: ['batonpass', 'roost'], evs: { hp: 1 } }];
			assert.legalTeam(team, format);

			team = [{ species: 'hawlucha', ability: 'moldbreaker', item: '', moves: ['batonpass', 'roost', 'acrobatics'], evs: { hp: 1 } }];
			assert.false.legalTeam(team, format);

			format = 'gen8customgame@@@batonpassstatclause,dynamaxclause';
			assert.legalTeam(team, format);

			format = 'gen9customgame@@@batonpassstatclause';
			assert.legalTeam(team, format);
		});

		it('should take into account things that changed across generations', () => {
			const team = [{ species: 'excadrill', ability: 'noability', item: '', moves: ['batonpass', 'rapidspin'], evs: { hp: 1 } }];

			let format = 'gen7customgame@@@batonpassstatclause';
			assert.legalTeam(team, format);

			format = 'gen8customgame@@@batonpassstatclause';
			assert.false.legalTeam(team, format);
		});

		it('should detect if Ogerpon can stat pass, and allow making an exception for it', () => {
			const team = [{ species: 'ogerponhearthflame', ability: 'moldbreaker', item: 'hearthflamemask', moves: ['batonpass'], evs: { hp: 1 } }];

			let format = 'gen5customgame@@@batonpassstatclause';
			assert.legalTeam(team, format);

			format = 'gen9customgame@@@batonpassstatclause';
			assert.false.legalTeam(team, format);

			format = 'gen9customgame@@@batonpassstatclause,terastalclause';
			assert.legalTeam(team, format);

			format = 'gen9customgame@@@batonpassstatclause,+batonpass+embodyaspecthearthflame';
			assert.legalTeam(team, format);
		});

		it('should refuse to work in non-singles formats', () => {
			const team = [
				{ species: 'rattata', ability: 'noability', item: '', moves: ['tackle'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['tackle'], evs: { hp: 1 } },
				{ species: 'rattata', ability: 'noability', item: '', moves: ['tackle'], evs: { hp: 1 } },
			];

			let format = 'gen6customgame@@@batonpassstatclause';
			assert.legalTeam(team, format);

			format = 'gen6doublescustomgame@@@batonpassstatclause';
			assert.false.legalTeam(team, format);

			format = 'gen6triplescustomgame@@@batonpassstatclause';
			assert.false.legalTeam(team, format);
		});

		const gen3 = Dex.mod('gen3');
		const gen4 = Dex.mod('gen4');
		const gen5 = Dex.mod('gen5');

		it('should not change validation for [Gen 5] OU', () => {
			// Baton Pass Stat Clause
			const oldClause = [
				'absorbbulb', 'acidarmor', 'acupressure', 'agility', 'amnesia', 'ancientpower', 'angerpoint', 'apicotberry', 'autotomize',
				'barrier', 'bellydrum', 'bulkup', 'calmmind', 'cellbattery', 'charge', 'chargebeam', 'coil', 'cosmicpower', 'cottonguard', 'curse',
				'defensecurl', 'defendorder', 'defiant', 'download', 'dragondance', 'fierydance', 'flamecharge', 'focusenergy', 'ganlonberry', 'growth',
				'harden', 'honeclaws', 'howl', 'irondefense', 'justified', 'lansatberry', 'liechiberry', 'lightningrod', 'meditate', 'metalclaw',
				'meteormash', 'motordrive', 'moxie', 'nastyplot', 'ominouswind', 'petayaberry', 'quiverdance', 'rage', 'rattled',
				'rockpolish', 'salacberry', 'sapsipper', 'sharpen', 'shellsmash', 'shiftgear', 'silverwind', 'skullbash', 'speedboost',
				'starfberry', 'steadfast', 'steelwing', 'stockpile', 'stormdrain', 'swordsdance', 'tailglow', 'weakarmor', 'withdraw',
				'workup',
			];
			const bannedElsewhere = [
				'assist', 'darkvoid', 'doubleteam', 'fissure', 'grasswhistle', 'guillotine', 'horndrill', 'hypnosis', 'lovelykiss',
				'minimize', 'sheercold', 'sing', 'sleeppowder', 'spore', 'swagger', 'yawn', 'brightpowder', 'laxincense', 'buggem',
				'darkgem', 'dragongem', 'electricgem', 'fairygem', 'fightinggem', 'firegem', 'flyinggem', 'ghostgem', 'grassgem',
				'groundgem', 'icegem', 'normalgem', 'poisongem', 'psychicgem', 'rockgem', 'steelgem', 'watergem', 'souldew', 'razorfang',
				'kingsrock', 'arenatrap', 'moody', 'sandrush', 'sandveil', 'shadowtag', 'snowcloak',
			];
			const format = 'gen5ou@@@!obtainable';
			const team = [{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass'], evs: { hp: 1 } }];

			for (const { id } of gen5.moves.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].moves.push(id);
				runAssert(oldClause, id, team, format);
				team[0].moves.pop();
			}
			for (const { id } of gen5.items.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].item = id;
				runAssert(oldClause, id, team, format);
				team[0].item = '';
			}
			for (const { id } of gen5.abilities.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].ability = id;
				runAssert(oldClause, id, team, format);
				team[0].ability = 'noability';
			}
		});

		it('should not change validation for [Gen 4] OU', () => {
			// Baton Pass Stat Trap Clause
			const oldClause = [
				'acidarmor', 'acupressure', 'agility', 'amnesia', 'ancientpower', 'assist', 'barrier', 'bellydrum', 'block', 'bulkup',
				'calmmind', 'charge', 'chargebeam', 'cosmicpower', 'curse', 'defendorder', 'defensecurl', 'dragondance', 'growth',
				'guardswap', 'harden', 'heartswap', 'howl', 'irondefense', 'ingrain', 'meanlook', 'meteormash', 'meditate', 'metalclaw',
				'nastyplot', 'ominouswind', 'powertrick', 'psychup', 'rage', 'rockpolish', 'sharpen', 'silverwind', 'skullbash',
				'spiderweb', 'steelwing', 'stockpile', 'swordsdance', 'tailglow', 'withdraw', 'speedboost', 'apicotberry', 'ganlonberry',
				'liechiberry', 'petayaberry', 'salacberry', 'starfberry', 'keeberry', 'marangaberry', 'weaknesspolicy', 'blunderpolicy',
				'luminiscentmoss', 'snowball', 'throatspray', 'mirrorherb', 'adrenalineorb',
			];
			const bannedElsewhere = [
				'doubleteam', 'fissure', 'guillotine', 'horndrill', 'minimize', 'sheercold', 'swagger', 'brightpowder', 'laxincense',
				'quickclaw', 'souldew', 'arenatrap', 'sandveil', 'snowcloak',
			];
			const format = 'gen4ou@@@!obtainable';
			const team = [{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass'], evs: { hp: 1 } }];

			for (const { id } of gen4.moves.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].moves.push(id);
				runAssert(oldClause, id, team, format);
				team[0].moves.pop();
			}
			for (const { id } of gen4.items.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].item = id;
				runAssert(oldClause, id, team, format);
				team[0].item = '';
			}
			for (const { id } of gen4.abilities.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].ability = id;
				runAssert(oldClause, id, team, format);
				team[0].ability = 'noability';
			}
		});

		it('should not change validation for [Gen 3] OU', () => {
			// One Boost Passer Clause
			const oldClause = [
				'acidarmor', 'agility', 'amnesia', 'apicotberry', 'barrier', 'bellydrum', 'bulkup', 'calmmind', 'cosmicpower', 'curse',
				'defensecurl', 'dragondance', 'ganlonberry', 'growth', 'harden', 'howl', 'irondefense', 'liechiberry', 'meditate',
				'petayaberry', 'salacberry', 'sharpen', 'speedboost', 'starfberry', 'swordsdance', 'tailglow', 'withdraw',
			];
			const bannedElsewhere = [
				'assist', 'doubleteam', 'fissure', 'guillotine', 'horndrill', 'minimize', 'sheercold', 'swagger', 'block', 'meanlook',
				'spiderweb', 'brightpowder', 'laxincense', 'sandveil', 'soundproof',
			];
			const format = 'gen3ou@@@!obtainable';
			const team = [
				{ species: 'rattata', ability: 'noability', item: '', moves: ['Baton Pass'], evs: { hp: 1 } },
				{ species: 'pidgey', ability: 'noability', item: '', moves: ['Baton Pass', 'swordsdance'], evs: { hp: 1 } },
			];
			// 'Baton Pass' is case sensitive, only for this clause

			for (const { id } of gen3.moves.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].moves.push(id);
				runAssert(oldClause, id, team, format);
				team[0].moves.pop();
			}
			for (const { id } of gen3.items.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].item = id;
				runAssert(oldClause, id, team, format);
				team[0].item = '';
			}
			for (const { id } of gen3.abilities.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].ability = id;
				runAssert(oldClause, id, team, format);
				team[0].ability = 'noability';
			}
		});

		it('should not change validation for [Gen 3] PU', () => {
			// Baton Pass Stat Clause
			const oldClause = [
				'absorbbulb', 'acidarmor', 'acupressure', 'agility', 'amnesia', 'ancientpower', 'angerpoint', 'apicotberry', 'autotomize',
				'barrier', 'bellydrum', 'bulkup', 'calmmind', 'cellbattery', 'charge', 'chargebeam', 'coil', 'cosmicpower', 'cottonguard', 'curse',
				'defensecurl', 'defendorder', 'defiant', 'download', 'dragondance', 'fierydance', 'flamecharge', 'focusenergy', 'ganlonberry', 'growth',
				'harden', 'honeclaws', 'howl', 'irondefense', 'justified', 'lansatberry', 'liechiberry', 'lightningrod', 'meditate', 'metalclaw',
				'meteormash', 'motordrive', 'moxie', 'nastyplot', 'ominouswind', 'petayaberry', 'quiverdance', 'rage', 'rattled',
				'rockpolish', 'salacberry', 'sapsipper', 'sharpen', 'shellsmash', 'shiftgear', 'silverwind', 'skullbash', 'speedboost',
				'starfberry', 'steadfast', 'steelwing', 'stockpile', 'stormdrain', 'swordsdance', 'tailglow', 'weakarmor', 'withdraw',
				'workup',
			];
			const bannedElsewhere = [
				'doubleteam', 'fissure', 'guillotine', 'horndrill', 'minimize', 'sheercold', 'brightpowder', 'laxincense',
			];
			const format = 'gen3pu@@@!obtainable';
			const team = [{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass'], evs: { hp: 1 } }];

			for (const { id } of gen3.moves.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].moves.push(id);
				runAssert(oldClause, id, team, format);
				team[0].moves.pop();
			}
			for (const { id } of gen3.items.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].item = id;
				runAssert(oldClause, id, team, format);
				team[0].item = '';
			}
			for (const { id } of gen3.abilities.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].ability = id;
				runAssert(oldClause, id, team, format);
				team[0].ability = 'noability';
			}
		});

		it('should not change validation for [Gen 3] ZU', () => {
			// Baton Pass Stat Trap Clause
			const oldClause = [
				'acidarmor', 'acupressure', 'agility', 'amnesia', 'ancientpower', 'assist', 'barrier', 'bellydrum', 'block', 'bulkup',
				'calmmind', 'charge', 'chargebeam', 'cosmicpower', 'curse', 'defendorder', 'defensecurl', 'dragondance', 'growth',
				'guardswap', 'harden', 'heartswap', 'howl', 'irondefense', 'ingrain', 'meanlook', 'meteormash', 'meditate', 'metalclaw',
				'nastyplot', 'ominouswind', 'powertrick', 'psychup', 'rage', 'rockpolish', 'sharpen', 'silverwind', 'skullbash',
				'spiderweb', 'steelwing', 'stockpile', 'swordsdance', 'tailglow', 'withdraw', 'speedboost', 'apicotberry', 'ganlonberry',
				'liechiberry', 'petayaberry', 'salacberry', 'starfberry', 'keeberry', 'marangaberry', 'weaknesspolicy', 'blunderpolicy',
				'luminiscentmoss', 'snowball', 'throatspray', 'mirrorherb', 'adrenalineorb',
			];
			const bannedElsewhere = [
				'doubleteam', 'fissure', 'guillotine', 'horndrill', 'minimize', 'sheercold', 'swagger', 'darkvoid', 'grasswhistle',
				'hypnosis', 'lovelykiss', 'sing', 'sleeppowder', 'spore', 'yawn', 'substitute', 'brightpowder', 'laxincense',
			];
			const format = 'gen3zu@@@!obtainable';
			const team = [{ species: 'rattata', ability: 'noability', item: '', moves: ['batonpass'], evs: { hp: 1 } }];

			for (const { id } of gen3.moves.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].moves.push(id);
				runAssert(oldClause, id, team, format);
				team[0].moves.pop();
			}
			for (const { id } of gen3.items.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].item = id;
				runAssert(oldClause, id, team, format);
				team[0].item = '';
			}
			for (const { id } of gen3.abilities.all().filter(x => !x.isNonstandard)) {
				if (bannedElsewhere.includes(id)) continue;
				team[0].ability = id;
				runAssert(oldClause, id, team, format);
				team[0].ability = 'noability';
			}
		});

		function runAssert(clause, effect, team, format) {
			// console.log(`Testing ${effect} in ${format} ...`);
			if (clause.includes(effect)) assert.false.legalTeam(team, format);
			else assert.legalTeam(team, format);
		};
	});
});
