export const Items: {[k: string]: ModdedItemData} = {
	// Aeonic
	fossilizedfish: {
		inherit: true,
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		desc: "At the end of every turn, holder restores 1/16 of its max HP.",
	},
	// Archas
	lilligantiumz: {
		name: "Lilligantium Z",
		onTakeItem: false,
		zMove: "Aura Rain",
		zMoveFrom: "Quiver Dance",
		itemUser: ["Lilligant"],
		desc: "If held by a Lilligant with Quiver Dance, it can use Aura Rain.",
	},
	// Irpachuza
	irpatuziniumz: {
		name: "Irpatuzinium Z",
		onTakeItem: false,
		zMove: "Bibbidi-Bobbidi-Rands",
		zMoveFrom: "Fleur Cannon",
		itemUser: ["Mr. Mime"],
		desc: "If held by a Mr. Mime with Fleur Cannon, it can use Bibbidi-Bobbidi-Rands.",
	},
	// Peary
	pearyumz: {
		name: "Pearyum Z",
		onTakeItem: false,
		zMove: "1000 Gears",
		zMoveFrom: "Gear Grind",
		itemUser: ["Klinklang"],
		desc: "If held by a Klinklang with Gear Grind, it can use 1000 Gears.",
	},
};
