'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Imprison', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should prevent foes from using moves that the user knows`, () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Abra', ability: 'prankster', moves: ['imprison', 'calmmind', 'batonpass'] },
			{ species: 'Kadabra', ability: 'prankster', moves: ['imprison', 'calmmind'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Abra', ability: 'synchronize', moves: ['calmmind', 'gravity'] },
			{ species: 'Kadabra', ability: 'prankster', moves: ['imprison', 'calmmind'] },
		] });

		battle.makeChoices('move imprison', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 0);
		assert.statStage(battle.p2.active[0], 'spd', 0);
		assert.cantMove(() => battle.choose('p2', 'move calmmind'), 'Abra', 'Calm Mind', true);

		// Imprison doesn't end when the foe switches
		battle.makeChoices('auto', 'switch 2');
		battle.makeChoices('auto', 'move calmmind');
		// Imprison should cause Struggle if all moves match
		assert(battle.log.some(line => line === '|-activate|p2a: Kadabra|move: Struggle'));

		// Imprison is not passed by Baton Pass
		battle.makeChoices('move batonpass', 'auto');
		assert.statStage(battle.p2.active[0], 'spa', 0);
		battle.makeChoices('switch 2', '');
		assert.statStage(battle.p2.active[0], 'spa', 0);
		battle.makeChoices('move calmmind', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 1);

		// Imprison ends after user switches
		battle.makeChoices('switch 2', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 2);
		battle.makeChoices('move calmmind', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 3);
	});

	it(`should not prevent foes from using Z-Powered Status moves`, () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', moves: ['imprison', 'sunnyday'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Charmander', ability: 'blaze', item: 'firiumz', moves: ['sunnyday'] }] });

		battle.makeChoices('move imprison', 'move sunnyday zmove');
		assert.statStage(battle.p2.active[0], 'spe', 1);
		assert(battle.field.isWeather('sunnyday'));
	});

	it(`should not prevent the user from using moves that a foe knows`, () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Abra', ability: 'prankster', moves: ['imprison', 'calmmind', 'batonpass'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Abra', ability: 'synchronize', moves: ['calmmind', 'gravity'] },
		] });
		const imprisonUser = battle.p1.active[0];

		battle.makeChoices('move imprison', 'auto');
		battle.makeChoices('move calmmind', 'auto');
		assert.statStage(imprisonUser, 'spa', 1);
		assert.statStage(imprisonUser, 'spd', 1);
	});
});

describe('Maybe locked and maybe disabled', () => {
	afterEach(() => {
		battle.destroy();
	});

	describe('Singles', () => {
		it(`should not show Imprisoned moves as disabled`, () => {
			battle = common.createBattle([
				[{ species: 'Abra', moves: ['imprison', 'tackle'] }],
				[{ species: 'Abra', moves: ['sleeptalk', 'tackle'] }],
			]);
			battle.makeChoices();
			let request = battle.p2.activeRequest.active[0];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));

			battle = common.createBattle([
				[{ species: 'Abra', moves: ['imprison', 'sleeptalk'] }],
				[{ species: 'Abra', moves: ['sleeptalk'] }],
			]);
			battle.makeChoices();
			request = battle.p2.activeRequest.active[0];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));
		});

		it(`should disable moves as the user uses them`, () => {
			battle = common.createBattle([
				[{ species: 'Abra', moves: ['imprison', 'tackle', 'growl'] }],
				[{ species: 'Abra', moves: ['sleeptalk', 'tackle', 'growl'] }],
			]);
			battle.makeChoices('move imprison', 'move sleeptalk');
			let request = battle.p2.activeRequest.active[0];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));

			assert.throws(() => battle.choose('p2', 'move tackle'));
			request = battle.p2.activeRequest.active[0];
			assert(request.maybeDisabled);
			assert.false(request.maybeLocked);
			const tackleMove = request.moves.find(move => move.id === 'tackle');
			assert(tackleMove.disabled);

			assert.throws(() => battle.choose('p2', 'move growl'));
			request = battle.p2.activeRequest.active[0];
			assert(request.maybeDisabled);
			assert.false(request.maybeLocked);
			const growlMove = request.moves.find(move => move.id === 'growl');
			assert(growlMove.disabled);

			battle.makeChoices('auto', 'move sleeptalk');
		});

		it(`should lock the user into Struggle if all moves are Imprisoned`, () => {
			battle = common.createBattle([
				[{ species: 'Abra', moves: ['imprison', 'sleeptalk', 'tackle'] }],
				[{ species: 'Abra', moves: ['sleeptalk', 'tackle'] }],
			]);
			battle.makeChoices('move imprison', 'move sleeptalk');
			const request = battle.p2.activeRequest.active[0];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));
			battle.makeChoices('auto', 'move sleeptalk');
			assert(battle.log.some(line => line === '|-activate|p2a: Abra|move: Struggle'));
		});

		it(`should not allow the user to cancel a move`, () => {
			battle = common.createBattle({ cancel: true }, [
				[{ species: 'Abra', moves: ['imprison', 'sleeptalk'] }],
				[{ species: 'Abra', moves: ['sleeptalk', 'tackle'] }],
			]);
			battle.makeChoices('move imprison', 'move sleeptalk');
			let request = battle.p2.activeRequest.active[0];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));
			assert.false(battle.p2.choice.cantUndo);

			battle.choose('p2', 'move tackle');
			assert(battle.p2.choice.cantUndo);
			assert.cantUndo(() => battle.undoChoice('p2'));
			battle.choose('p1', 'auto');

			battle = common.createBattle([
				[{ species: 'Abra', moves: ['imprison', 'sleeptalk'] }],
				[{ species: 'Abra', moves: ['sleeptalk'] }],
			]);
			battle.makeChoices('move imprison', 'move sleeptalk');
			request = battle.p2.activeRequest.active[0];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));
			assert.false(battle.p2.choice.cantUndo);

			battle.choose('p2', 'move sleeptalk');
			assert(battle.p2.choice.cantUndo);
			assert.cantUndo(() => battle.undoChoice('p2'));
			battle.choose('p1', 'auto');
		});
	});

	describe('Doubles\' left position', () => {
		it(`should show disabled moves and should allow to cancel them`, () => {
			battle = common.createBattle({ gameType: 'doubles', cancel: true }, [[
				{ species: 'Abra', moves: ['imprison', 'tackle'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			], [
				{ species: 'Abra', moves: ['sleeptalk', 'tackle', 'growl'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			let request = battle.p2.activeRequest.active[0];
			assert.false(request.maybeDisabled);
			assert.false(request.maybeLocked);
			assert.false(battle.p2.choice.cantUndo);
			const tackleMove = request.moves.find(move => move.id === 'tackle');
			assert(tackleMove.disabled);

			battle.choose('p2', 'move sleeptalk, move sleeptalk');
			battle.undoChoice('p2');
			battle.makeChoices('auto', 'move growl, move sleeptalk');

			battle = common.createBattle({ gameType: 'doubles', cancel: true }, [[
				{ species: 'Abra', moves: ['imprison', 'tackle'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			], [
				{ species: 'Abra', moves: ['tackle'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			request = battle.p2.activeRequest.active[0];
			assert.false(request.maybeDisabled);
			assert.false(request.maybeLocked);
			assert.false(battle.p2.choice.cantUndo);
			assert.equal(request.moves[0].id, 'struggle');

			battle.choose('p2', 'move struggle, move sleeptalk');
			battle.undoChoice('p2');
		});
	});

	describe('Doubles\' right position', () => {
		it(`should not show Imprisoned moves as disabled`, () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Abra', moves: ['imprison', 'tackle'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			], [
				{ species: 'Abra', moves: ['sleeptalk'] },
				{ species: 'Abra', moves: ['sleeptalk', 'tackle'] },
			]]);
			battle.makeChoices();
			let request = battle.p2.activeRequest.active[1];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));

			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Abra', moves: ['imprison', 'tackle'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			], [
				{ species: 'Abra', moves: ['sleeptalk'] },
				{ species: 'Abra', moves: ['tackle'] },
			]]);
			battle.makeChoices();
			request = battle.p2.activeRequest.active[1];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));
		});

		it(`should not allow the user to cancel if it gets locked into Struggle`, () => {
			battle = common.createBattle({ gameType: 'doubles', cancel: true }, [[
				{ species: 'Abra', moves: ['imprison', 'sleeptalk'] },
				{ species: 'Abra', moves: ['tackle'] },
			], [
				{ species: 'Abra', moves: ['sleeptalk', 'tackle'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			const request = battle.p2.activeRequest.active[1];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));
			assert.false(battle.p2.choice.cantUndo);

			battle.choose('p2', 'move tackle 1, move sleeptalk');
			assert(battle.p2.choice.cantUndo);
			assert.cantUndo(() => battle.undoChoice('p2'));
			battle.choose('p1', 'auto');
			assert(battle.log.some(line => line === '|-activate|p2b: Abra|move: Struggle'));
		});

		it(`should allow the user to cancel a non-disabled move`, () => {
			battle = common.createBattle({ gameType: 'doubles', cancel: true }, [[
				{ species: 'Abra', moves: ['imprison', 'tackle', 'growl'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			], [
				{ species: 'Abra', moves: ['sleeptalk'] },
				{ species: 'Abra', moves: ['sleeptalk', 'tackle', 'growl'] },
			]]);
			battle.makeChoices();
			let request = battle.p2.activeRequest.active[1];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));
			assert.false(battle.p2.choice.cantUndo);

			battle.choose('p2', 'move sleeptalk, move sleeptalk');
			battle.undoChoice('p2');
			request = battle.p2.activeRequest.active[1];
			assert.false(request.maybeDisabled);
			assert.false(request.maybeLocked);
			assert(request.moves.every(move => move.disabled || move.id === 'sleeptalk'));
			battle.makeChoices('auto', 'auto');
		});

		it(`Test Fight should force Struggle if all moves are Imprisoned`, () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Abra', moves: ['imprison', 'tackle'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			], [
				{ species: 'Abra', moves: ['sleeptalk'] },
				{ species: 'Abra', moves: ['tackle'] },
			]]);
			battle.makeChoices();
			const request = battle.p2.activeRequest.active[1];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));
			assert.false(battle.p2.choice.cantUndo);

			battle.choose('p2', 'move sleeptalk, testfight');
			assert(battle.p2.choice.cantUndo);
			assert.cantUndo(() => battle.undoChoice('p2'));
			battle.choose('p1', 'auto');
			assert(battle.log.some(line => line === '|-activate|p2b: Abra|move: Struggle'));
		});

		it(`Test Fight should reveal disabled moves`, () => {
			battle = common.createBattle({ gameType: 'doubles', cancel: true }, [[
				{ species: 'Abra', moves: ['imprison', 'tackle'] },
				{ species: 'Abra', moves: ['sleeptalk'] },
			], [
				{ species: 'Abra', moves: ['sleeptalk'] },
				{ species: 'Abra', moves: ['sleeptalk', 'tackle'] },
			]]);
			battle.makeChoices();
			let request = battle.p2.activeRequest.active[1];
			assert(request.maybeDisabled);
			assert(request.maybeLocked);
			assert(request.moves.every(move => !move.disabled));
			assert.false(battle.p2.choice.cantUndo);

			battle.choose('p2', 'move sleeptalk, testfight');
			assert.false(battle.p2.choice.cantUndo);
			battle.undoChoice('p2');
			request = battle.p2.activeRequest.active[1];
			assert.false(request.maybeDisabled);
			assert.false(request.maybeLocked);
			assert(request.moves.every(move => move.disabled || move.id === 'sleeptalk'));
			battle.makeChoices('auto', 'auto');
		});
	});
});
