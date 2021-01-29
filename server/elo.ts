export function calculateElo(previousUserElo: number, score: number, foeElo: number): number {
	// The K factor determines how much your Elo changes when you win or
	// lose games. Larger K means more change.
	// In the "original" Elo, K is constant, but it's common for K to
	// get smaller as your rating goes up
	let K = 50;

	// dynamic K-scaling (optional)
	if (previousUserElo < 1200) {
		if (score < 0.5) {
			K = 10 + (previousUserElo - 1000) * 40 / 200;
		} else if (score > 0.5) {
			K = 90 - (previousUserElo - 1000) * 40 / 200;
		}
	} else if (previousUserElo > 1350 && previousUserElo <= 1600) {
		K = 40;
	} else {
		K = 32;
	}

	// main Elo formula
	const E = 1 / (1 + Math.pow(10, (foeElo - previousUserElo) / 400));

	const newElo = previousUserElo + K * (score - E);

	return Math.max(newElo, 1000);
}
