export const Abilities: {[k: string]: ModdedAbilityData} = {
	gulpmissile: {
		inherit: true,
		desc: "If this Pokemon is a Cramorant, it changes forme when it hits a target with a Water-type move or uses the first turn of Dive successfully. It becomes Gulping Form with an Arrokuda in its mouth if it has more than 1/2 of its maximum HP remaining, or Gorging Form with a Pikachu in its mouth if it has 1/2 or less of its maximum HP remaining. If Cramorant gets hit in Gulping or Gorging Form, it spits the Arrokuda or Pikachu at its attacker, even if it has no HP remaining. The projectile deals damage equal to 1/4 of the target's maximum HP, rounded down; this damage is blocked by the Magic Guard Ability but not by a substitute. An Arrokuda also lowers the target's Defense by 1 stage, and a Pikachu paralyzes the target. Cramorant will return to normal if it spits out a projectile, switches out, or Dynamaxes.",
		shortDesc: "When hit after Water move, attacker takes 1/4 max HP and -1 Defense or paralysis.",
		onDamagingHit(damage, target, source, move) {
			if (target.transformed || target.isSemiInvulnerable()) return;
			if (['cramorantgulping', 'cramorantgorging'].includes(target.species.id)) {
				this.damage(source.baseMaxhp / 4, source, target);
				if (target.species.id === 'cramorantgulping') {
					this.boost({def: -1}, source, target, null, true);
				} else {
					source.trySetStatus('par', target, move);
				}
				target.formeChange('cramorant', move);
			}
		},
		// The Dive part of this mechanic is implemented in Dive's `onTryMove` in moves.js
		onAnyDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' && effect.type === 'Water' && source.hasAbility('gulpmissile') &&
				source.species.name === 'Cramorant' && !source.transformed
			) {
				const forme = source.hp <= source.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				source.formeChange(forme, effect);
			}
		},
		onAnyAfterSubDamage(damage, target, source, effect) {
			if (
				effect && effect.type === 'Water' && source.hasAbility('gulpmissile') &&
				source.species.name === 'Cramorant' && !source.transformed
			) {
				const forme = source.hp <= source.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				source.formeChange(forme, effect);
			}
		},
	},
	pastelveil: {
		inherit: true,
		shortDesc: "This Pokemon is immune to Poison moves and the poison status. Cures poison on switch-in.",
		onTryHit(target, source, move) {
			if (move.target !== 'self' && move.type === "Poison") {
				this.add('-immune', target, '[from] ability: Pastel Veil');
				return null;
			}
		},
	},
	steamengine: {
		inherit: true,
		shortDesc: "This Pokemon's Speed is raised by 6 stages after it is damaged by Fire/Water moves.",
		onDamagingHit(damage, target, source, move) {
			if (['Fire'].includes(move.type)) {
				this.boost({spe: 6});
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[from] ability: Steam Engine');
				}
				return null;
			}
		},
	},
	trickster: {
		shortDesc: "Switches out after attacking or being attacked. Moves have 1.3x power.",
		name: "Trickster",
		onBasePower(basePower, attacker, defender, move) {
			if (move.category !== "Status") {
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		onModifyMove(move, pokemon, target) {
			if (move.category !== 'Status' && !target.switchFlag) {
				move.selfSwitch = true;
			}
		},
		onAfterMoveSecondaryPriority: 2,
		onAfterMoveSecondary(target, source, move) {
			if (move && move.category !== 'Status') {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag) return;
				for (const pokemon of this.getAllActive()) {
					if (pokemon.switchFlag === true) return;
				}
				target.switchFlag = true;
				source.switchFlag = false;
			}
		},
	},
};
