export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	itsme: {
        onSwitchIn(pokemon) {
			if (pokemon.abilityState.itsmeTriggered) return;
			pokemon.abilityState.itsmeTriggered = true;

			for (const foe of pokemon.adjacentFoes()) {
				if (!foe.hp || foe.fainted) continue;
				if (foe.volatiles['cursecounter']) continue;
				foe.addVolatile('cursecounter');
			}
		},
		flags: {},
		name: "It's Me",
		num: -1,
        rating: 4,
        shortDesc: "On first switch-in, curses adjacent foes at end of turn.",
        desc: "Each adjacent foe receives a curse count of 1 if it doesn't already have a curse count. At the end of each turn including the turn used, the curse count of the foe lowers by 1. If the number reaches 0, the foe becomes cursed and loses 1/4 of its maximum HP at the end of each turn. The curse count and the curse are removed from the foe if it switches out.",
	},
    hello: {
        onSwitchIn(pokemon) {
            for (const foe of pokemon.adjacentFoes()) {
                
                let move: Move | ActiveMove | null = foe.lastMove;
                if (!move || move.isZ) return false;
                if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

                const ppDeducted = foe.deductPP(move.id, 4);
                if (!ppDeducted) return false;
                this.add("-activate", foe, 'ability: Hello', move.name, ppDeducted);
            }
        },
        flags: {},
        name: "Hello",
        num: -2, 
        rating: 4,
        shortDesc: "On switch-in, reduces the PP of each foe's last move by 4.",
        desc: "When this Pokemon switches in, it reduces the PP of the each opposing Pokemon's last move by 4. If the foe has no last move or if the last move is a Z-Move, this ability does nothing.",   
    }
};
