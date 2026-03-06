/**
 * Tests for the PokéRogue chat plugin — sprite URL generation and item icon logic.
 * Focus areas: getSprite() Gen 9+ fix, getPokeballInfo() tier logic, getItemSprite() overrides.
 */

'use strict';

const assert = require('../../assert').strict;

describe('PokéRogue plugin — sprite & item URL generation', () => {
	let testables = null;

	before(() => {
		const plugin = require('../../../dist/impulse/chat-plugins/pokerogue/pokerogue');
		testables = plugin.testables;
	});

	// ── Pokemon sprite URL tests ─────────────────────────────────────────────

	describe('getSprite()', () => {
		it('should use sprites/home/ for Gen 9 Paradox Pokemon (e.g. Gouging Fire)', () => {
			const html = testables.getSprite('gougingfire', 60);
			assert(html.includes('sprites/home/gougingfire.png'), `Expected home sprite, got: ${html}`);
			assert(!html.includes('sprites/dex/'), `Should not use dex sprite for Gen 9`);
		});

		it('should use sprites/home/ for other Gen 9 Pokemon (e.g. Sprigatito)', () => {
			const html = testables.getSprite('sprigatito', 80);
			assert(html.includes('sprites/home/sprigatito.png'), `Expected home sprite, got: ${html}`);
		});

		it('should use sprites/dex/ for Gen 6–8 Pokemon (e.g. Froakie)', () => {
			const html = testables.getSprite('froakie', 80);
			assert(html.includes('sprites/dex/froakie.png'), `Expected dex sprite, got: ${html}`);
		});

		it('should use sprites/dex/ for Gen 7 Pokemon (e.g. Rowlet)', () => {
			const html = testables.getSprite('rowlet', 80);
			assert(html.includes('sprites/dex/rowlet.png'), `Expected dex sprite, got: ${html}`);
		});

		it('should use sprites/gen5/ for Gen 1–5 Pokemon (e.g. Pikachu)', () => {
			const html = testables.getSprite('pikachu', 80);
			assert(html.includes('sprites/gen5/pikachu.png'), `Expected gen5 sprite, got: ${html}`);
		});

		it('should use sprites/gen5/ for Gen 5 Pokemon (e.g. Timburr)', () => {
			const html = testables.getSprite('timburr', 60);
			assert(html.includes('sprites/gen5/timburr.png'), `Expected gen5 sprite, got: ${html}`);
		});

		it('should include the size attribute', () => {
			const html = testables.getSprite('pikachu', 40);
			assert(html.includes('width="40"') && html.includes('height="40"'));
		});

		it('should include the alt text with the Pokemon name', () => {
			const html = testables.getSprite('fletchling', 60);
			assert(html.includes('Fletchling sprite'), `Expected alt text with name, got: ${html}`);
		});
	});

	// ── Pokeball tier tests ──────────────────────────────────────────────────

	describe('getPokeballInfo()', () => {
		it('should assign Master Ball to Legendary Pokemon (e.g. Mewtwo)', () => {
			const info = testables.getPokeballInfo('mewtwo');
			assert(info.alt === 'Master Ball', `Expected Master Ball, got: ${info.alt}`);
			assert(info.src.includes('master.png'));
		});

		it('should assign Master Ball to Paradox Pokemon (e.g. Gouging Fire)', () => {
			const info = testables.getPokeballInfo('gougingfire');
			assert(info.alt === 'Master Ball', `Expected Master Ball for Paradox, got: ${info.alt}`);
		});

		it('should assign Ultra Ball to pseudo-legendary Pokemon (BST ≥ 580, e.g. Dragonite)', () => {
			const info = testables.getPokeballInfo('dragonite');
			assert(info.alt === 'Ultra Ball', `Expected Ultra Ball for Dragonite, got: ${info.alt}`);
			assert(info.src.includes('ultra.png'));
		});

		it('should assign Great Ball to mid-tier Pokemon (BST ≥ 480, e.g. Scizor)', () => {
			const info = testables.getPokeballInfo('scizor');
			assert(info.alt === 'Great Ball', `Expected Great Ball for Scizor, got: ${info.alt}`);
			assert(info.src.includes('great.png'));
		});

		it('should assign normal Poke Ball to common Pokemon (e.g. Fletchling)', () => {
			const info = testables.getPokeballInfo('fletchling');
			assert(info.alt === 'Poké Ball', `Expected Poké Ball for Fletchling, got: ${info.alt}`);
			assert(info.src.includes('poke.png'));
		});
	});

	// ── Item sprite URL tests ────────────────────────────────────────────────

	describe('getItemSprite()', () => {
		it('should use PS domain for rarecandy (not pokesprite)', () => {
			const html = testables.getItemSprite('rarecandy');
			assert(html.includes('play.pokemonshowdown.com'), `Expected PS domain, got: ${html}`);
			assert(html.includes('rarecandy.png'), `Expected rarecandy.png, got: ${html}`);
			assert(!html.includes('raw.githubusercontent.com'), `Should not use pokesprite for rarecandy`);
		});

		it('should use PS domain for revive', () => {
			const html = testables.getItemSprite('revive');
			assert(html.includes('play.pokemonshowdown.com'), `Expected PS domain, got: ${html}`);
			assert(html.includes('revive.png'), `Expected revive.png, got: ${html}`);
			assert(!html.includes('raw.githubusercontent.com'), `Should not use pokesprite for revive`);
		});

		it('should map luckycharm to luckyegg icon on PS domain', () => {
			const html = testables.getItemSprite('luckycharm');
			assert(html.includes('play.pokemonshowdown.com'), `Expected PS domain, got: ${html}`);
			assert(html.includes('luckyegg.png'), `Expected luckyegg.png, got: ${html}`);
		});

		it('should use pokesprite for mastercapsule (pokeball, no PS icon)', () => {
			const html = testables.getItemSprite('mastercapsule');
			assert(html.includes('master.png'), `Expected master ball png, got: ${html}`);
		});

		it('should use PS itemicons for standard held items (e.g. focussash)', () => {
			const html = testables.getItemSprite('focussash');
			assert(html.includes('play.pokemonshowdown.com/sprites/itemicons/focussash.png'), `Expected PS itemicon, got: ${html}`);
		});

		it('should use PS itemicons for leftovers', () => {
			const html = testables.getItemSprite('leftovers');
			assert(html.includes('play.pokemonshowdown.com/sprites/itemicons/leftovers.png'), `Expected PS itemicon, got: ${html}`);
		});

		it('should set width and height to 24', () => {
			const html = testables.getItemSprite('focussash');
			assert(html.includes('width="24"') && html.includes('height="24"'));
		});
	});

	// ── getSpriteWithBall() integration test ────────────────────────────────

	describe('getSpriteWithBall()', () => {
		it('should wrap the sprite in .pr-sprite-wrap', () => {
			const html = testables.getSpriteWithBall('pikachu', 60);
			assert(html.includes('class="pr-sprite-wrap"'), `Expected pr-sprite-wrap class, got: ${html}`);
		});

		it('should include the pokeball overlay img with .pr-pokeball-overlay class', () => {
			const html = testables.getSpriteWithBall('pikachu', 60);
			assert(html.includes('class="pr-pokeball-overlay"'), `Expected pokeball overlay, got: ${html}`);
		});

		it('should include the Pokemon sprite inside the wrapper', () => {
			const html = testables.getSpriteWithBall('froakie', 60);
			assert(html.includes('froakie.png'), `Expected froakie sprite in wrapper, got: ${html}`);
		});

		it('should use HOME sprite for Gen 9 Pokemon inside wrapper (Gouging Fire)', () => {
			const html = testables.getSpriteWithBall('gougingfire', 60);
			assert(html.includes('sprites/home/gougingfire.png'), `Expected home sprite in wrapper, got: ${html}`);
		});

		it('should apply Master Ball overlay for Legendary Pokemon', () => {
			const html = testables.getSpriteWithBall('mewtwo', 60);
			assert(html.includes('master.png'), `Expected master ball overlay, got: ${html}`);
		});
	});
});
