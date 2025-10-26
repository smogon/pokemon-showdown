/*
* Pokemon Showdown
* TCG Collection Definitions
*/
import { ImpulseDB } from '../../impulse-db';
import { TcgCard, TcgDailyCooldown, TcgUser,
        TcgUserProfile, TcgUserPack } from './interface';

export const tcgCardsCollection = ImpulseDB<TcgCard>('tcg_cards');
export const userCollectionsCollection = ImpulseDB<TcgUser>('tcg_collections');
export const userProfilesCollection = ImpulseDB<TcgUserProfile>('tcg_profiles');
export const userPacksCollection = ImpulseDB<TcgUserPack>('tcg_user_packs');
export const cooldownsCollection = ImpulseDB<TcgDailyCooldown>('tcg_cooldowns');
