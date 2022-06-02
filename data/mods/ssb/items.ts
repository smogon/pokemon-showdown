export const Items: {[k: string]: ModdedItemData} = {
	// Brookeee
	ramen: {
		name: "Ramen",
		spritenum: 22,
		fling: {
			basePower: 10,
		},
		onUpdate(pokemon) {
			pokemon.eatItem();
		},
		onEat(pokemon) {
			this.boost({spe: 1});
			pokemon.addVolatile('focusenergy');
		},
		gen: 8,
		desc: "Raises Speed by 1 stage and critical hit ratio by 2 stages. Single use.",
	},

	// Chocolate Pudding
	parfaitspoon: {
		name: "Parfait Spoon",
		spritenum: 520,
		fling: {
			basePower: 30,
		},
		onModifyDefPriority: 1,
		onModifyDef(def) {
			return this.chainModify(1.5);
		},
		onModifySpDPriority: 1,
		onModifySpD(spd) {
			return this.chainModify(1.5);
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, target) {
			if (target.types === 'Ice') {
				return this.chainModify(1.5);
			}
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, source);
			return null;
		},
		gen: 8,
		desc: "Reflects status moves; boosts Defense and Special Defense by 1.5x; 1.5x damage to Ice-types.",
	},

	// El Capitan
	assaulthelmet: {
		name: "Assault Helmet",
		fling: {
			basePower: 100,
		},
		onCriticalHit: false,
		gen: 8,
		desc: "Holder cannot be struck by a critical hit.",
	},

	// Finger
	chaosring: {
		name: "Chaos Ring",
		fling: {
			basePower: 150,
		},
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) {
			if (move.id === 'futuresight') {
				let t = this.random(5);
				switch (t) {
				case 1:
					this.add('-start', move, 'typechange', 'Psychic');
					move.type = "Psychic";
					break;
				case 2:
					this.add('-start', move, 'typechange', 'Dark');
					move.type = "Dark";
					break;
				case 3:
					this.add('-start', move, 'typechange', 'Ghost');
					move.type = "Ghost";
					break;
				case 4:
					this.add('-start', move, 'typechange', 'Fairy');
					move.type = "Fairy";
					break;
				case 5:
					this.add('-start', move, 'typechange', 'Dragon');
					move.type = "Dragon";
					break;
				default:
					this.add('-start', move, 'typechange', 'Normal');
					move.type = "Normal";
					break;
				}
				this.add('-message', `Roll: ${t} - Future Sight Type: ${move.type}`);
			}
		},
		gen: 8,
		desc: "When Future Sight is used by the holder, the typing is randomized on hit.",
	},

	// Horrific17
	horrifiumz: {
		name: "Horrifium Z",
		spritenum: 632,
		onTakeItem: false,
		zMove: "Final Trick",
		zMoveFrom: "Meteor Charge",
		itemUser: ["Arcanine"],
		gen: 8,
		desc: "If held by an Arcanine with Meteor Charge, it can use Final Trick.",
	},

	// Mink the Putrid
	gurglingblossom: {
		name: "Gurgling Blossom",
		spritenum: 487,
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			if (pokemon.hasType('Poison')) this.heal(pokemon.baseMaxhp / 8);
		},
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		gen: 8,
		desc: "Each turn, if holder is a Poison type, restores 1/8 max HP. If holder is hit by a contact move, the attacker loses 1/8 of its max HP.",
		shortDesc: "Heals Poison-types by 1/8 per turn; Damages foes on contact.",
	},

  // Roughskull
	cheaterglasses: {
		name: "Cheater Glasses",
    fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			let totalatk = 0;
			let totalspa = 0;
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
				totalatk += target.getStat('atk', false, true);
				totalspa += target.getStat('spa', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({spa: 1});
			} else if (totalspd) {
				this.boost({atk: 1});
			}
			if (totalatk && totalatk >= totalspa) {
				this.boost({def: 1});
			} else if (totalspd) {
				this.boost({spd: 1});
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Crown of TMS weaken');
				return this.chainModify(0.5);
			}
		},
		gen: 8,
		desc: "On switch-in, the user raises its Attack or Special Attack depending on if the opponent's Defense or Special Defense is lower, and raises either Defense or Special Defense the Pokemon's highest Attack stat (Physical or Special).  At full HP, this Pokemon reduces the damage of the first hit by half.",
		shortDesc: "Raises Atk or SpA based on lower Def, Raises Def or SpD based on higher Atk, halves damage taken if at full HP.",
  },
  
	// Satori
	thirdeye: {
		name: "Third Eye",
		spritenum: 574,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) {
			if (move.category === 'Special') {
				return this.chainModify(1.2);
			}
		},
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('thirdeye - decreasing accuracy');
			return this.chainModify(0.9);
		},
		gen: 8,
		desc: "Boosts the user's Special Attack by 1.2x and evasiveness by 1.1x.",
	},

	// SunDraco
	fanblade: {
		name: "Fanblade",
		fling: {
			basePower: 50,
			volatileStatus: 'flinch',
		},
		onModifyMovePriority: 1,
		onModifyMove(move) {
			if (!move.multihit && move.basePower <= 60 && move.basePower > 0) {
				const hits = this.random(2, 5);
				move.multihit = hits;
				move.basePower = 20;
			}
		},
		gen: 8,
		desc: "Holder's single-hit moves of 60 power or less have 20 power and hit 2-5 times instead.",
		shortDesc: "Moves <= 60 BP become 20 BP, hit 2-5 times.",
	},
};
