/**
 * Fakemon moves.
 *
 * `generated/moves-generic.ts` holds the 717 moves compiled from the move
 * expansion PDF and the custom move spreadsheet. `moves-signature.ts` holds the
 * hand-implemented signature moves from the dex PDF (the yellow entries).
 */
import { GenericMoves } from './generated/moves-generic';
import { SignatureMoves } from './moves-signature';

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	...GenericMoves,
	...SignatureMoves,
};
