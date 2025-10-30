/**
 * ELO Rating System Utilities
 * Shared ELO calculation logic for clan warfare and battle tracking
 */

const K_FACTOR = 32; // Standard ELO K-factor

/**
 * Calculates the expected score for player A against player B.
 * @param eloA Clan A's ELO
 * @param eloB Clan B's ELO
 * @returns The probability of player A winning (0 to 1)
 */
export function getExpectedScore(eloA: number, eloB: number): number {
	return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/**
 * Calculates the new ELO ratings for a winner and a loser.
 * @param winnerElo Winner's current ELO
 * @param loserElo Loser's current ELO
 * @returns [newWinnerElo, newLoserElo, eloChange]
 */
export function calculateElo(winnerElo: number, loserElo: number): [number, number, number] {
	const expectedWinner = getExpectedScore(winnerElo, loserElo);

	// Calculate ELO change
	// We use Math.max(1, ...) to ensure a minimum of 1 ELO is always gained/lost
	const eloChange = Math.max(1, Math.round(K_FACTOR * (1 - expectedWinner)));

	const newWinnerElo = winnerElo + eloChange;
	const newLoserElo = loserElo - eloChange;

	return [newWinnerElo, newLoserElo, eloChange];
}
