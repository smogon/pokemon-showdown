export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
    draconic: {
        onModifyDamage(dmg, src, target, move) {
            if (move.type === 'Dragon') {
                return this.chainModify([6144, 4096]);
            }
        },
        name: 'Draconic',
        shortDesc: 'User now has the dragon STAB (doubles if user already is dragon type)',
        flags: {},
    },
};
