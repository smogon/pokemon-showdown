export const Items: {[k: string]: ModdedItemData} = {
	// Mitz
	kindlingcore: {
		name: "Kindling Core",
		gen: 9,
		desc: "If holder is hit by a contact move, the attacker is burned. The attacker also loses 1/5 of its max HP if its Grass-type or Steel-type.",
		shortDesc: "Attackers are burned on contact, lose 1/5 HP if Grass/Steel.",
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				source.trySetStatus('brn', source);
				if (source.hasType('Grass') || source.hasType('Steel')) {
					this.damage(source.baseMaxhp / 5, source, target);
				}
			}
		},
	},
	// Finger
	mattermirror: {
		name: "Matter Mirror",
		spritenum: 69,
		desc: "This Pokemon's Physical attacks become Special.",
		gen: 9,
		onModifyMove(move, pokemon) {
			if (move.category === 'Physical') {
				move.category = 'Special';
			}
		},
	},
	// Pablo
	sketchbook: {
		name: "Sketchbook",
		spritenum: 200,
		desc: "On switch-in, this Pokemon copies the stat changes of the opposing Pokemon.",
		gen: 9,
		onStart(target) {
			this.actions.useMove('Sketchbook', target);
		},
	},
	// Trey
	yoichisbow: {
		name: "Yoichi's Bow",
		spritenum: 429,
		onTakeItem: false,
		zMove: "Grand Delta",
		zMoveFrom: "Burst Delta",
		itemUser: ["Decidueye-Hisui"],
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return this.chainModify(1.3);
			}
		},
		desc: "Holder's Flying-type attacks have 1.3x power. If held by Decidueye-Hiseui with Burst Delta, it can use Grand Delta.",
		gen: 9,
	},
	// Aeri
	fleetingwinds: {
		name: "Fleeting Winds",
		onStart(source) {
			this.field.setTerrain('mistyterrain');
		},
		onFaint(pokemon) {
			this.add("-activate", pokemon, "item: Fleeting Winds");
			this.actions.useMove('Healing Wish', pokemon);
			pokemon.side.addSideCondition('tailwind', pokemon);
		},
		desc: "On switch-in, starts Misty Terrain. If this Pokemon would faint, starts Tailwind and uses Healing Wish.",
		shortDesc: "Switch-in: Misty Terrain; Faint; Tailwind + Healing Wish.",
		gen: 9,
	},
};
