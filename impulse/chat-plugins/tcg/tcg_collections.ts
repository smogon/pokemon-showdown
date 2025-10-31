/*
* Pokemon Showdown
* TCG Collections
*/
import { ImpulseDB } from '../../impulse-db';
import { type TcgCard, type TcgDailyCooldown, type TcgUser,
	type TcgUserProfile, type TcgUserPack } from './interface';

export const tcgCardsCollection = ImpulseDB<TcgCard>('tcg_cards');
export const userCollectionsCollection = ImpulseDB<TcgUser>('tcg_collections');
export const userProfilesCollection = ImpulseDB<TcgUserProfile>('tcg_profiles');
export const userPacksCollection = ImpulseDB<TcgUserPack>('tcg_user_packs');
export const cooldownsCollection = ImpulseDB<TcgDailyCooldown>('tcg_cooldowns');
