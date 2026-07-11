'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const Dex = require('./../../../dist/sim').Dex;
const { TeamValidator } = require('./../../../dist/sim/team-validator');

describe('[Gen 3] Megas CAP', () => {
	it('keeps its custom data isolated from [Gen 3] Megas', () => {
		const capDex = Dex.mod('gen3megascap');
		const megaDex = Dex.mod('gen3mega');

		assert.equal(capDex.species.get('magcargomega').name, 'Magcargo-Mega');
		assert.equal(capDex.species.get('magcargomega').tier, 'OU');
		assert.equal(capDex.items.get('magcargoite').megaStone.Magcargo, 'Magcargo-Mega');
		assert.equal(capDex.species.get('zangoose').tier, 'OU');
		assert(!megaDex.species.get('magcargomega').exists, 'Mega Magcargo must not be added to [Gen 3] Megas');
		assert(!megaDex.items.get('magcargoite').exists, 'Magcargoite must not be added to [Gen 3] Megas');
		assert.equal(megaDex.species.get('zangoose').tier, 'UU');
	});

	it('allows Magcargo to Mega Evolve in the CAP format', () => {
		const errors = TeamValidator.get('gen3megascap').validateTeam([
			{
				species: 'Magcargo', item: 'Magcargoite', ability: 'Magma Armor',
				moves: ['flamethrower', 'earthquake', 'rockslide', 'protect'], evs: { hp: 1 },
			},
		]);
		assert(!errors, `expected Mega Magcargo to be legal, got: ${JSON.stringify(errors)}`);
	});

	it('Mega Evolves Magcargo into its CAP forme', () => {
		const battle = common.createBattle({ formatid: 'gen3megascap' }, [
			[{ species: 'Magcargo', item: 'Magcargoite', ability: 'Magma Armor', moves: ['flamethrower'] }],
			[{ species: 'Snorlax', ability: 'Thick Fat', moves: ['tackle'] }],
		]);
		battle.makeChoices('move flamethrower mega', 'move tackle');
		assert.equal(battle.p1.active[0].species.name, 'Magcargo-Mega');
		assert.equal(battle.p1.active[0].ability, 'drought');
		assert.equal(battle.field.weather, 'sunnyday');
	});
});
