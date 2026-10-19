export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	terablast: {
		inherit: true,
		onModifyType(move, pokemon, target) {
			if (pokemon.terastallized) {
				move.type = pokemon.teraType;
			} else {
				switch (pokemon.item) {
				case 'dousedrive':
					move.type = 'Water';
					break;
				case 'burndrive':
					move.type = 'Fire';
					break;
				case 'shockdrive':
					move.type = 'Electric';
					break;
				case 'chilldrive':
					move.type = 'Ice';
					break;
				}
			}
		},
	},
};
