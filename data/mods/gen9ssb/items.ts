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
	// Loethalion
	gardevoirite: {
		inherit: true,
		itemUser: ["Ralts"],
		megaEvolves: "Ralts",
		desc: "If held by a Ralts, this item allows it to Mega Evolve in battle.",
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

	// Modified for other effects

	eviolite: {
		inherit: true,
		onModifyDef(def, pokemon) {
			// Added Pichu-Spiky-eared for Hydrostatics to use Eviolite
			if (pokemon.baseSpecies.nfe || pokemon.species.id === 'pichuspikyeared') {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			// Added Pichu-Spiky-eared for Hydrostatics to use Eviolite
			if (pokemon.baseSpecies.nfe || pokemon.species.id === 'pichuspikyeared') {
				return this.chainModify(1.5);
			}
		},
	},

	safetygoggles: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'deserteddunes' || type === 'hail' || type === 'powder') return false;
		},
	},
	utilityumbrella: {
		inherit: true,
		onStart(pokemon) {
			if (!pokemon.ignoringItem()) return;
			if (['sunnyday', 'raindance', 'desolateland', 'primordialsea', 'stormsurge'].includes(this.field.effectiveWeather())) {
				this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
			}
		},
		onUpdate(pokemon) {
			if (!this.effectState.inactive) return;
			this.effectState.inactive = false;
			if (['sunnyday', 'raindance', 'desolateland', 'primordialsea', 'stormsurge'].includes(this.field.effectiveWeather())) {
				this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
			}
		},
		onEnd(pokemon) {
			if (['sunnyday', 'raindance', 'desolateland', 'primordialsea', 'stormsurge'].includes(this.field.effectiveWeather())) {
				this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
			}
			this.effectState.inactive = true;
		},
	},
};
