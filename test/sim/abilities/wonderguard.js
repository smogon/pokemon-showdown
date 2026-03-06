'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Wonder Guard', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should make the user immune to damaging attacks that are not super effective', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Aerodactyl", ability: 'wonderguard', moves: ['sleeptalk'] }] });
		battle.setPlayer('p2', { team: [{ species: "Smeargle", ability: 'owntempo', moves: ['knockoff', 'flamethrower', 'thousandarrows', 'moonblast'] }] });
		for (let i = 1; i <= 4; i++) {
			battle.makeChoices('move sleeptalk', 'move ' + i);
			assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		}
		// Thousand Arrows shouldn't add the Smack Down volatile if blocked by Wonder Guard
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move sleeptalk', 'move thousandarrows'));
	});

	it('should not make the user immune to status moves', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Abra", ability: 'wonderguard', moves: ['teleport'] }] });
		battle.setPlayer('p2', { team: [{ species: "Smeargle", ability: 'noguard', moves: ['poisongas', 'screech', 'healpulse', 'gastroacid'] }] });
		const wwTarget = battle.p1.active[0];
		battle.makeChoices('move teleport', 'move poisongas');
		assert.equal(wwTarget.status, 'psn');
		battle.makeChoices('move teleport', 'move screech');
		assert.statStage(wwTarget, 'def', -2);
		assert.hurtsBy(wwTarget, -Math.floor(wwTarget.maxhp / 8), () => battle.makeChoices('move teleport', 'move healpulse'));
		battle.makeChoices('move teleport', 'move gastroacid');
		assert(wwTarget.volatiles['gastroacid']);
		assert.false(wwTarget.hasAbility('wonderguard'));
	});

	it('should be suppressed by Mold Breaker', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Zekrom", ability: 'wonderguard', moves: ['sleeptalk'] }] });
		battle.setPlayer('p2', { team: [{ species: "Reshiram", ability: 'turboblaze', moves: ['fusionflare'] }] });
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move sleeptalk', 'move fusionflare'));
	});

	it('should activate if the target is immune to the attack', () => {
		battle = common.createBattle([[
			{ species: 'Alakazam', moves: ['psychic'] },
		], [
			{ species: 'Muk-Alola', ability: 'wonderguard', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.includes('|-immune|p2a: Muk|[from] ability: Wonder Guard')));
	});

	it('should not make the user immune to Struggle', () => {
		battle = common.createBattle([[
			{ species: 'Pawmot', moves: ['sleeptalk'] },
		], [
			{ species: 'Shedinja', ability: 'wonderguard', moves: ['sleeptalk', 'disable'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move disable');
		assert.hurts(battle.p2.active[0], () => battle.makeChoices());
	});

	it('should make the user immune to typeless moves', () => {
		battle = common.createBattle([[
			{ species: 'Arcanine', moves: ['burnup', 'revelationdance'] },
		], [
			{ species: 'Clefable', moves: ['sleeptalk'] },
			{ species: 'Shedinja', ability: 'wonderguard', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move burnup', 'move sleeptalk');
		battle.makeChoices('move revelationdance', 'switch 2');
		assert.fullHP(battle.p2.active[0]);
	});

	describe('[Gen 4]', () => {
		it('should not make the user immune to typeless moves', () => {
			battle = common.gen(4).createBattle([[
				{ species: 'Jirachi', moves: ['doomdesire', 'beatup', 'sleeptalk'] },
			], [
				{ species: 'Clefable', ability: 'wonderguard', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move doomdesire', 'move sleeptalk');
			assert.hurts(battle.p2.active[0], () => battle.makeChoices('move beatup', 'move sleeptalk'));
			assert.hurts(battle.p2.active[0], () => battle.makeChoices('move sleeptalk', 'move sleeptalk'));
		});
	});
});
