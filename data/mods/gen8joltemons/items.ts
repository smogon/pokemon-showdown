export const Items: {[itemid: string]: ModdedItemData} = {
	boomerang: {
		name: "Boomerang",
		fling: {
			basePower: 120,
		},
		num: -1001,
		gen: 8,
		desc: "Comes back to the user when flung.",
	},
	momentumarmor: {
		name: "Momentum Armor",
		fling: {
			basePower: 80,
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			const def = pokemon.getStat('def', false, true);
			const newAtk = atk + (def / 4);
			return newAtk;
		},
		num: -1002,
		gen: 8,
		desc: "Boosts the user's Attack by 25% of its Defense.",
	},
	shellbell: {
		name: "Shell Bell",
		spritenum: 438,
		fling: {
			basePower: 40,
		},
		onAfterMoveSecondarySelfPriority: -1,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.category !== 'Status') {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		num: 253,
		gen: 3,
		desc: "The holder heals 12.5% of their max HP upon successfully damaging a Pokemon with an attack.",
	},
	honey: {
		name: "Honey",
		fling: {
			basePower: 30,
		},
		num: -1003,
		gen: 4,
		shortDesc: "Pokemon with the ability Honey Gather or Sweet Veil heal 12.5% when holding this item.",
	},
	eviolith: {
		name: "Eviolith",
		spritenum: 130,
		fling: {
			basePower: 40,
		},
		onModifyAtkPriority: 2,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 2,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		num: -1004,
		gen: 8,
		desc: "If holder's species can evolve, its Atk and Sp. Atk are 1.5x.",
	},
	reliccharm: {
		name: "Relic Charm",
		spritenum: 390,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Meloetta') {
				pokemon.formeChange('Meloetta-Pirouette');
			}
		},
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Meloetta') return false;
			return true;
		},
		itemUser: ["Meloetta"],
		num: -1005,
		gen: 8,
		desc: "If held by Meloetta: Pirouette Forme on entry, 1.2x power Fighting-type attacks.",
	},
	chillpill: {
		name: "Chill Pill",
		spritenum: 390,
		onStart(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Darmanitan') {
				if (!pokemon.species.name.includes('Galar')) {
					if (pokemon.species.id !== 'darmanitanzen') pokemon.formeChange('Darmanitan-Zen');
					pokemon.setAbility('psychicsurge', pokemon, true);
				} else {
					if (pokemon.species.id !== 'darmanitangalarzen') pokemon.formeChange('Darmanitan-Galar-Zen');
					pokemon.setAbility('snowwarning', pokemon, true);
				}
			}
		},
		onBasePower(basePower, user, target, move) {
			if (move && (
				(user.species.id === 'darmanitanzen' && move.type === 'Psychic') ||
					(user.species.id === 'darmanitangalarzen') && (move.type === 'Fire')
			)) {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Darmanitan') return false;
			return true;
		},
		itemUser: ["Darmanitan"],
		num: -1006,
		gen: 8,
		desc: "If held by Darmanitan: Zen Mode and Psychic Terrain on entry, 1.2x power Psychic-type attacks.",
	},
	chillpillg: {
		name: "Chill Pill G",
		spritenum: 390,
		onStart(pokemon) {
			this.add('-item', pokemon, 'Chill Pill');
			if (pokemon.baseSpecies.baseSpecies === 'Darmanitan' && pokemon.species.name.includes('Galar')) {
				this.add('-formechange', pokemon, 'Darmanitan-Galar-Zen', '[msg]');
				pokemon.formeChange("Darmanitan-Galar-Zen");
				const oldAbility = pokemon.setAbility('snowwarning', pokemon, true);
				if (oldAbility) {
					this.add('-activate', pokemon, 'ability: Snow Warning', oldAbility, '[of] ' + pokemon);
				}
			}
		},
		onBasePower(basePower, user, target, move) {
			if (move && user.species.id === 'darmanitangalarzen' && move.type === 'Fire') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Darmanitan') return false;
			return true;
		},
		itemUser: ["Darmanitan-Galar"],
		num: -1006,
		gen: 8,
		desc: "If held by Darmanitan: Zen Mode and Hail on entry, 1.2x power Fire-type attacks.",
	},
	graduationscale: {
		name: "Graduation Scale",
		onStart(pokemon) {
			pokemon.setAbility('intimidate', pokemon, true);
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Wishiwashi') return false;
			return true;
		},
		fling: {
			basePower: 20,
		},
		onBasePowerPriority: 6,
		onBasePower(basePower, user, target, move) {
			if (move && user.baseSpecies.num === 746 && move.type === 'Water') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		gen: 7,
		desc: "If holder is a Wishiwashi, it becomes School Form. Its ability becomes Intimidate. Water moves are boosted by 1.2x",
	},
	blunderpolicy: {
		name: "Blunder Policy",
		spritenum: 716,
		fling: {
			basePower: 80,
		},
		onUpdate(pokemon) {
			if (pokemon.moveThisTurnResult === false) {
				this.boost({spe: 2});
				pokemon.useItem();
			}
		},
		// Item activation located in scripts.js
		num: 1121,
		gen: 8,
		desc: "+2 Speed if the holder's move fails. Single use.",
	},
	lightball: {
		name: "Light Ball",
		spritenum: 251,
		fling: {
			basePower: 30,
			status: 'par',
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (['Pikachu', 'Raichu', 'Togedemaru', 'Morpeko'].includes((pokemon.baseSpecies.baseSpecies))) {
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			if (['Emolga', 'Dedenne', 'Togedemaru', 'Pachirisu'].includes(pokemon.baseSpecies.baseSpecies)) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (['Pikachu', 'Raichu', 'Raichu-Alola', 'Plusle', 'Dedenne'].includes(pokemon.baseSpecies.baseSpecies)) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 1,
		onModifySpD(spd, pokemon) {
			if (['Plusle', 'Minun', 'Pachirisu', 'Morpeko'].includes(pokemon.baseSpecies.baseSpecies)) {
				return this.chainModify(1.5);
			}
		},
		onModifySpePriority: 1,
		onModifySpe(spe, pokemon) {
			if (['Pikachu', 'Minun', 'Emolga'].includes(pokemon.baseSpecies.baseSpecies)) {
				return this.chainModify(1.5);
			}
		},
		itemUser: ["Pikachu", "Raichu", "Plusle", "Minun", "Emolga", "Morpeko", "Dedenne", "Togedemaru"],
		num: 236,
		gen: 2,
		desc: "If held by Pikachu, Raichu, or a Pikaclone, 2 of its stats are boosted 1.5x.",
	},
	/*
	soulblade: {
		name: "Soul Blade",
		spritenum: 297,
		fling: {
			basePower: 100,
		},
		onModifyDamage(damage, source, target, move) {
				return this.chainModify([0x1199, 0x1000]);
		},
		gen: 8,
		desc: "(Non-functional placeholder) The holder's moves deal 1.1x damage + .2x for every KO it has.",
	},
	*/
	mentalherb: {
		name: "Mental Herb",
		spritenum: 285,
		fling: {
			basePower: 10,
			effect(pokemon) {
				const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock', 'trashtalk'];
				for (const firstCondition of conditions) {
					if (pokemon.volatiles[firstCondition]) {
						for (const secondCondition of conditions) {
							pokemon.removeVolatile(secondCondition);
							if (firstCondition === 'attract' && secondCondition === 'attract') {
								this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
							}
						}
						return;
					}
				}
			},
		},
		onUpdate(pokemon) {
			const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock', 'trashtalk'];
			for (const firstCondition of conditions) {
				if (pokemon.volatiles[firstCondition]) {
					if (!pokemon.useItem()) return;
					for (const secondCondition of conditions) {
						pokemon.removeVolatile(secondCondition);
						if (firstCondition === 'attract' && secondCondition === 'attract') {
							this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
						}
					}
					return;
				}
			}
		},
		num: 219,
		gen: 3,
	},
	morningblossom: {
		name: "Morning Blossom",
		spritenum: 297,
		fling: {
			basePower: 10,
		},
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Cherrim') {
				this.field.setWeather('desolateland');
			}
		},
		onSwitchOut(pokemon) {
			this.field.clearWeather();
		},
		onFaint(pokemon) {
			this.field.clearWeather();
		},
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Grass') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Cherrim') return false;
			return true;
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['embargo']) {
				this.add('-activate', pokemon, 'item: Morning Blossom');
				pokemon.removeVolatile('embargo');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'embargo') {
				this.add('-immune', pokemon, '[from] item: Morning Blossom');
				return null;
			}
		},
		itemUser: ["Cherrim"],
		gen: 8,
		desc: "If held by Cherrim: Desolate Land on entry, 1.2x power Grass-type attacks.",
	},
	absorbbulb: {
		name: "Absorb Bulb",
		spritenum: 2,
		fling: {
			basePower: 30,
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water') {
				target.useItem();
			}
		},
		boosts: {
			def: 1,
			spa: 1,
			spd: 1,
		},
		num: 545,
		gen: 5,
		desc: "Raises holder's Def, SpA, & SpD by 1 stage if hit by a Water-type attack. Single use.",
	},
	cellbattery: {
		name: "Cell Battery",
		spritenum: 60,
		fling: {
			basePower: 30,
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Electric') {
				target.useItem();
			}
		},
		boosts: {
			atk: 1,
			spe: 1,
			accuracy: 1,
		},
		num: 546,
		gen: 5,
		desc: "Raises holder's Atk, Spe, & Acc by 1 stage if hit by an Electric-type attack. Single use.",
	},
	luminousmoss: {
		name: "Luminous Moss",
		spritenum: 595,
		fling: {
			basePower: 30,
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Grass') {
				target.useItem();
			}
		},
		boosts: {
			spa: 2,
			spd: 2,
		},
		num: 648,
		gen: 6,
		desc: "Raises holder's SpA & SpD by 2 stages if hit by a Grass-type attack. Single use.",
	},
	snowball: {
		name: "Snowball",
		spritenum: 606,
		fling: {
			basePower: 30,
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Ice') {
				target.useItem();
			}
		},
		boosts: {
			atk: 2,
			def: 2,
		},
		num: 649,
		gen: 6,
		desc: "Raises holder's Atk & Def by 2 stages if hit by an Ice-type attack. Single use.",
	},
	coalengine: {
		name: "Coal Engine",
		spritenum: 297,
		fling: {
			basePower: 60,
		},
		onStart(pokemon) {
			if (pokemon.side.getSideCondition('stealthrock') && !pokemon.ignoringItem()) {
				pokemon.useItem();
				this.boost({spe: 1}, pokemon);
			}
		},
		gen: 8,
		desc: "If Stealth Rock is on the field, damage is ignored, and the user's Speed is raised by 1. Single use.",
	},
	tartapple: {
		name: "Tart Apple",
		spritenum: 712,
		fling: {
			basePower: 20,
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Flapple') {
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Flapple') {
				this.boost({accuracy: 2});
			}
		},
		itemUser: ["Flapple"],
		num: 1117,
		gen: 8,
		desc: "If the holder is Flapple: 1.5x Speed and +2 Accuracy.",
	},
	sweetapple: {
		name: "Sweet Apple",
		spritenum: 711,
		fling: {
			basePower: 20,
		},
		onResidualOrder: 5,
		onResidualSubOrder: 5,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.name === 'Appletun') {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				this.debug('Sweet Apple weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				this.debug('Sweet Apple weaken');
				return this.chainModify(0.5);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect && (effect.id === 'tox' || effect.id === 'psn')) {
				return damage / 2;
			}
		},
		num: 1116,
		gen: 8,
		desc: "If the holder is Appletun: Heals 12.5% HP every turn and takes 50% damage from Poison moves and poison status.",
	},
	protector: {
		name: "Protector",
		spritenum: 367,
		fling: {
			basePower: 100,
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0 && !target.hasAbility('solidrock') && !target.hasAbility('filter')) {
				this.debug('Protector neutralize');
				return this.chainModify(0.75);
			}
		},
		num: 321,
		gen: 4,
		desc: "Super effective attacks deal 3/4 damage to the holder.",
	},
	powerherb: {
		onChargeMove(pokemon, target, move) {
			if (pokemon.useItem()) {
				this.debug('power herb - remove charge turn for ' + move.id);
				this.attrLastMove('[still]');
				this.addMove('-anim', pokemon, move.name, target);
				return false; // skip charge turn
			}
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['mustrecharge']) {
				pokemon.removeVolatile('mustrecharge');
				pokemon.useItem();
			}
		},
		name: "Power Herb",
		spritenum: 358,
		fling: {
			basePower: 10,
		},
		num: 271,
		gen: 4,
		desc: "Holder's two-turn moves and recharge complete in one turn (except Sky Drop). Single use.",
	},
	pillow: {
		name: "Pillow",
		spritenum: 242,
		fling: {
			basePower: 10,
			// status: 'slp', Fixed
		},
		onResidualOrder: 5,
		onResidualSubOrder: 5,
		onResidual(pokemon) {
			if (pokemon.status === 'slp' || pokemon.hasAbility('comatose')) {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		/*
		onStart(pokemon) {
			if (pokemon.status === 'slp' || pokemon.hasAbility('comatose')) {
				pokemon.addVolatile('pillow');
			}
		},
		condition: {
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasItem('pillow') || (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose'))) {
					pokemon.removeVolatile('pillow');
					return;
				}
				if (pokemon.status === 'slp' || pokemon.hasAbility('comatose')) {
					this.useMove("Sleep Talk", pokemon);
				}
			},
		},
		*/
		gen: 8,
		desc: "(Bugged) Holder heals 12.5% HP while asleep. If asleep, calls a random attack.",
	},
	reapercloth: {
		name: "Reaper Cloth",
		spritenum: 385,
		fling: {
			basePower: 100,
		},
		onResidualOrder: 5,
		onResidualSubOrder: 5,
		onResidual(pokemon) {
			if (pokemon.hasType('Ghost')) {
				this.heal(pokemon.baseMaxhp / 16);
			}
		},
		onDisableMove(pokemon) {
			if (!pokemon.hasType('Ghost') && pokemon.lastMove && pokemon.lastMove.id !== 'struggle') {
				pokemon.disableMove(pokemon.lastMove.id);
			}
		},
		onTakeItem(item, source) {
			if (source.hasType('Ghost')) return false;
			return true;
		},
		num: 325,
		gen: 4,
		desc: "Each turn, if holder is a Ghost type, restores 1/16 max HP; is Tormented if not.",
	},
	chilipepper: {
		name: "Chili Pepper",
		spritenum: 13,
		fling: {
			basePower: 10,
			status: 'brn',
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] item: Chili Pepper');
			}
			return false;
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'item: Chili Pepper');
				pokemon.cureStatus();
				pokemon.useItem();
			}
		},
		desc: "The holder is immune to burns. Thaws the user and is consumed if the holder is frozen.",
	},
	widelens: {
		name: "Wide Lens",
		spritenum: 537,
		fling: {
			basePower: 10,
		},
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy === 'number') {
				return accuracy * 1.2;
			}
		},
		num: 265,
		gen: 4,
		desc: "The accuracy of attacks by the holder is 1.2x.",
	},
	zoomlens: {
		name: "Zoom Lens",
		spritenum: 574,
		fling: {
			basePower: 10,
		},
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy, target) {
			if (typeof accuracy === 'number' && (!this.queue.willMove(target) || target.newlySwitched)) {
				this.debug('Zoom Lens boosting accuracy');
				return accuracy * 1.5;
			}
		},
		num: 276,
		gen: 4,
		desc: "The accuracy of attacks by the holder is 1.5x if it moves lasts or the foe switches.",
	},
	whippeddream: {
		name: "Whipped Dream",
		spritenum: 692,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fairy') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		num: 646,
		gen: 6,
		desc: "Holder's Fairy-type attacks have 1.2x power.",
	},
	ironball: {
		name: "Iron Ball",
		spritenum: 224,
		fling: {
			basePower: 130,
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (target.volatiles['ingrain'] || target.volatiles['smackdown'] || this.field.getPseudoWeather('gravity')) return;
			if (move.type === 'Ground' && target.hasType('Flying')) return 0;
		},
		// airborneness negation implemented in sim/pokemon.js:Pokemon#isGrounded
		num: 278,
		gen: 4,
		desc: "Holder's use of Gravity lasts 8 turns instead of 5. Grounds holder.",
	},
	cursedbelt: {
		name: "Cursed Belt",
		spritenum: 13,
		fling: {
			basePower: 10,
		},
		onAfterMoveSecondarySelf(target, source, move) {
			if (move.category === 'Status') {
				target.addVolatile('disable');
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (source.volatiles['disable']) {
				return this.chainModify(1.2);
			}
		},
		desc: "When the holder uses a status move, it is disabled. Moves deal 1.2x damage while a move is disabled.",
	},
	utilityumbrella: {
		name: "Utility Umbrella",
		spritenum: 718,
		fling: {
			basePower: 60,
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail') return false;
		},
		onWeather(target, source, effect) {
			if (this.field.isWeather(['sunnyday', 'desolateland', 'hail', 'raindance', 'primordialsea', 'sandstorm'])) {
				this.heal(target.baseMaxhp / 12);
			}
		},
		// Other effects implemented in statuses.js, moves.js, and abilities.js
		num: 1123,
		gen: 8,
		desc: "The holder ignores rain- and sun-based effects & weather damage. Heals 1/12 of its max HP in weather.",
	},
	nightlightball: {
		name: "Nightlight Ball",
		spritenum: 251,
		fling: {
			basePower: 90,
			status: 'brn',
		},
		onStart(pokemon) {
			this.add('-item', pokemon, 'Nightlight Ball');
			this.add('-message', `Mimikyu's Nightlight Ball has a sinister sheen!`);
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Mimikyu') {
				return this.chainModify(1.3);
			}
		},
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Mimikyu') {
				return this.chainModify(1.3);
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric' && target.baseSpecies.baseSpecies === 'Mimikyu') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] item: Nightlight Ball');
				}
				return null;
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Mimikyu') return false;
			return true;
		},
		itemUser: ["Mimikyu"],
		desc: "If held by Mimikyu: 1.3x Atk and Def, Heals 1/4 of its max HP when hit by Electric moves.",
	},
	seawaterbead: {
		name: "Seawater Bead",
		spritenum: 251,
		fling: {
			basePower: 30,
		},
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Phione') {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Phione') {
				return this.chainModify(1.5);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Phione') return false;
			return true;
		},
		itemUser: ["Phione"],
		desc: "If held by Phione: 1.5x Defense & Special Defense.",
	},
	sacredropes: {
		name: "Sacred Ropes",
		spritenum: 251,
		fling: {
			basePower: 130,
		},
		onStart(pokemon) {
			this.add('-item', pokemon, 'Sacred Ropes');
			this.add('-message', `Regigigas is adorned with continent-towing ropes!`);
		},
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.baseSpecies === 'Regigigas') {
				const oldAbility = pokemon.setAbility('thickfat', pokemon, true);
				if (oldAbility) {
					this.add('-activate', pokemon, 'ability: Thick Fat', oldAbility, '[of] ' + pokemon);
				}
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if ((move.type === 'Fighting' || move.type === 'Rock') &&
				defender.baseSpecies.baseSpecies === 'Regigigas') {
				this.debug('Sacred Ropes weaken');
				return this.chainModify(0.75);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if ((move.type === 'Fighting' || move.type === 'Rock') &&
				defender.baseSpecies.baseSpecies === 'Regigigas') {
				this.debug('Sacred Ropes weaken');
				return this.chainModify(0.75);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Regigigas') return false;
			return true;
		},
		itemUser: ["Regigigas"],
		desc: "If held by Regigigas: Ability becomes Thick Fat, takes 0.75x damage from Fighting and Rock moves.",
	},
	// soul blades
	soulblade: {
		name: "Soul Blade",
		spritenum: 297,
		fling: {
			basePower: 100,
		},
		onModifyDamage(damage, source, target, move) {
			const soulBladePower = [[0x1199, 0x1000], [0x14CC, 0x1000], 1.5, 1.7, 1.9, 2.1];
			const soulBladeLevel = source.m.soulBladeLevel || 1;
			return this.chainModify(soulBladePower[soulBladeLevel - 1]);
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				if (!source.m.soulBladeLevel) source.m.soulBladeLevel = 1;
				if (source.m.soulBladeLevel < 6) this.add('-activate', source, 'item: Soul Blade');
				source.m.soulBladeLevel += 1;
				if (source.m.soulBladeLevel > 6) source.m.soulBladeLevel = 6;
			}
		},
		gen: 8,
		desc: "The holder's moves deal 1.1x damage + .2x for every KO it has.",
	},
};
