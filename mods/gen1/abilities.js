/**
 * Gen 1 had no abilities whatsoever.
 * However, I'm adding the "None" ability to make it clear, since Showdown does show
 * by default a possible abilities list when no ability is found on the Pokemon,
 * and I want the mod to work with no Client changes and the least possible
 * non-mod changes.
 */
exports.BattleAbilities = {
	"None": {
		desc: "This Pokemon has no ability.",
		shortDesc: "This Pokemon has no ability.",
		id: "none",
		name: "None",
		rating: 1,
		num: 1
	}
};
