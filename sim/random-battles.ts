/**
 * A chat plugin to store, calculate, and view winrates in random battle formats.
 * @author mia-pi-git
 */

export interface Stats {
	elo: number;
	month: string;
	formats: Record<string, FormatData>;
}

export interface MonEntry {
	timesGenerated: number;
	numWins: number;
}

export interface FormatData {
	mons: Record<string, MonEntry>;
	period?: number; // how often it resets - defaults to 1mo
}

export function getMonth() {
	return Chat.toTimestamp(new Date()).split(' ')[0].slice(0, -3);
}

// no, this cannot be baseSpecies - some formes matter, ex arceus formes
// no, there is no better way to do this.
// yes, i tried.
export function getSpeciesName(set: PokemonSet, format: Format) {
	const species = set.species;
	const item = Dex.items.get(set.item);
	const moves = set.moves;
	const megaRayquazaPossible = ['gen6', 'gen7'].includes(format.mod) && !format.ruleset.includes('Mega Rayquaza Clause');
	if (species.startsWith("Pikachu-")) {
		return 'Pikachu';
	} else if (species.startsWith("Unown-")) {
		return 'Unown';
	} else if (species === "Gastrodon-East") {
		return 'Gastrodon';
	} else if (species === "Magearna-Original") {
		return "Magearna";
	} else if (species === "Genesect-Douse") {
		return "Genesect";
	} else if (species === "Dudunsparce-Three-Segment") {
		return 'Dudunsparce';
	} else if (species === "Maushold-Four") {
		return 'Maushold';
	} else if (species === "Greninja-Bond") {
		return 'Greninja';
	} else if (species === "Keldeo-Resolute") {
		return 'Keldeo';
	} else if (species === "Zarude-Dada") {
		return 'Zarude';
	} else if (species === 'Polteageist-Antique') {
		return 'Polteageist';
	} else if (species === 'Sinistcha-Masterpiece') {
		return 'Sinistcha';
	} else if (species === "Squawkabilly-Blue") {
		return "Squawkabilly";
	} else if (species === "Squawkabilly-White") {
		return "Squawkabilly-Yellow";
	} else if (species.startsWith("Basculin-")) {
		return "Basculin";
	} else if (species.startsWith("Sawsbuck-")) {
		return "Sawsbuck";
	} else if (species.startsWith("Vivillon-")) {
		return "Vivillon";
	} else if (species.startsWith("Florges-")) {
		return "Florges";
	} else if (species.startsWith("Furfrou-")) {
		return "Furfrou";
	} else if (species.startsWith("Minior-")) {
		return "Minior";
	} else if (species.startsWith("Toxtricity-")) {
		return 'Toxtricity';
	} else if (species.startsWith("Tatsugiri-")) {
		return 'Tatsugiri';
	} else if (species.startsWith("Alcremie-")) {
		return 'Alcremie';
	} else if (species === "Zacian" && item.name === "Rusted Sword") {
		return 'Zacian-Crowned';
	} else if (species === "Zamazenta" && item.name === "Rusted Shield") {
		return "Zamazenta-Crowned";
	} else if (species === "Kyogre" && item.name === "Blue Orb") {
		return "Kyogre-Primal";
	} else if (species === "Groudon" && item.name === "Red Orb") {
		return "Groudon-Primal";
	} else if (item.megaStone) {
		return item.megaStone;
	} else if (species === "Rayquaza" && moves.includes('Dragon Ascent') && !item.zMove && megaRayquazaPossible) {
		return "Rayquaza-Mega";
	} else if (species === "Poltchageist-Artisan") { // Babymons from here on out
		return "Poltchageist";
	} else if (species === "Shellos-East") {
		return "Shellos";
	} else if (species === "Sinistea-Antique") {
		return "Sinistea";
	} else if (species.startsWith("Deerling-")) {
		return "Deerling";
	} else if (species.startsWith("Flabe\u0301be\u0301-")) {
		return "Flabe\u0301be\u0301";
	} else {
		return species;
	}
}

export function getSpeciesIdCGT(set: PokemonSet, format?: Format) {
	if (['Basculin', 'Greninja'].includes(set.name)) return Dex.toID(set.species);
	return Dex.toID(getSpeciesName(set, format || Dex.formats.get('gen9computergeneratedteams')));
}

export const getZScore = (data: MonEntry) => (
	2 * Math.sqrt(data.timesGenerated) * (data.numWins / data.timesGenerated - 0.5)
);
