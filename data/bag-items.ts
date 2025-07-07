import { Items } from './items';
import { type Pokemon } from '../sim/pokemon';

/**
 * @pokebedrock - Add bag items
 *
 * A map of bag items and their functions.
 */
export const bagItems = new Map<
	string,
	(battle: Battle, pokemon: Pokemon, moveName?: string) => void
>([
			['revive', (battle, pokemon) => pokemon.revive(pokemon.maxhp / 2)],
			['max_revive', (battle, pokemon) => pokemon.revive()],
			[
				'full_restore',
				(battle, pokemon) => {
					pokemon.heal(pokemon.maxhp);
					pokemon.cureStatus();
				},
			],
			['hyper_potion', (battle, pokemon) => pokemon.heal(120)],
			['max_potion', (battle, pokemon) => pokemon.heal(pokemon.maxhp)],
			['potion', (battle, pokemon) => pokemon.heal(20)],
			['super_potion', (battle, pokemon) => pokemon.heal(60)],
			['moomoo_milk', (battle, pokemon) => pokemon.heal(100)],
			['lemonade', (battle, pokemon) => pokemon.heal(70)],
			['ragecandybar', (battle, pokemon) => pokemon.heal(20)],
			['freshwater', (battle, pokemon) => pokemon.heal(30)],
			[
				'aguav_berry',
				(battle, pokemon) => Items.aguavberry.onEat.call(battle, pokemon),
			],
			[
				'aspear_berry',
				(battle, pokemon) => Items.aspearberry.onEat.call(battle, pokemon),
			],
			[
				'cheri_berry',
				(battle, pokemon) => Items.cheriberry.onEat.call(battle, pokemon),
			],
			[
				'chesto_berry',
				(battle, pokemon) => Items.chestoberry.onEat.call(battle, pokemon),
			],
			[
				'figy_berry',
				(battle, pokemon) => Items.figyberry.onEat.call(battle, pokemon),
			],
			[
				'iapapa_berry',
				(battle, pokemon) => Items.iapapaberry.onEat.call(battle, pokemon),
			],
			[
				'leppa_berry',
				(battle, pokemon, moveName) => {
					const moveSlot = pokemon.moveSlots.find(move => move.id === moveName);
					if (!moveSlot) return;
					moveSlot.pp += 10;
					if (moveSlot.pp > moveSlot.maxpp) moveSlot.pp = moveSlot.maxpp;
					battle.add(
						'-activate',
						pokemon,
						'item: Leppa Berry',
						moveSlot.move,
						'[consumed]'
					);
				},
			],
			[
				'lum_berry',
				(battle, pokemon) => Items.lumberry.onEat.call(battle, pokemon),
			],
			[
				'mago_berry',
				(battle, pokemon) => Items.magoberry.onEat.call(battle, pokemon),
			],
			['nanab_berry', (battle, pokemon) => { }], // Makes wild Pokémon move less.
			[
				'oran_berry',
				(battle, pokemon) => Items.oranberry.onEat.call(battle, pokemon),
			],
			[
				'pecha_berry',
				(battle, pokemon) => Items.pechaberry.onEat.call(battle, pokemon),
			],
			[
				'persim_berry',
				(battle, pokemon) => Items.persimberry.onEat.call(battle, pokemon),
			],
			[
				'rawst_berry',
				(battle, pokemon) => Items.rawstberry.onEat.call(battle, pokemon),
			],
			['razz_berry', pokemon => { }], // Makes wild Pokémon easier to capture.
			[
				'sitrus_berry',
				(battle, pokemon) => Items.sitrusberry.onEat.call(battle, pokemon),
			],
			[
				'wiki_berry',
				(battle, pokemon) => Items.wikiberry.onEat.call(battle, pokemon),
			],
		]);
