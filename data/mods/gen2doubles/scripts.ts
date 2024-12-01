export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen2',
	gen: 2,
	pokemon: {
		inherit: true,
		getStat(statName, unboosted, unmodified, fastReturn) {
			// @ts-ignore - type checking prevents 'hp' from being passed, but we're paranoid
			if (statName === 'hp') throw new Error("Please read `maxhp` directly");

			// base stat
			let stat = this.storedStats[statName];

			// Stat boosts.
			if (!unboosted) {
				let boost = this.boosts[statName];
				if (boost > 6) boost = 6;
				if (boost < -6) boost = -6;
				if (boost >= 0) {
					const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
					stat = Math.floor(stat * boostTable[boost]);
				} else {
					const numerators = [100, 66, 50, 40, 33, 28, 25];
					stat = Math.floor(stat * numerators[-boost] / 100);
				}
			}

			if (this.status === 'par' && statName === 'spe') {
				stat = Math.floor(stat / 4);
			}

			if (!unmodified) {
				// Burn attack drop is checked when you get the attack stat upon switch in and used until switch out.
				if (this.status === 'brn' && statName === 'atk') {
					stat = Math.floor(stat / 2);
				}
			}

			// Gen 2 caps stats at 999 and min is 1.
			stat = this.battle.clampIntRange(stat, 1, 999);
			if (fastReturn) return stat;

			// Screens
			if (!unboosted) {
				if (
					(statName === 'def' && this.side.sideConditions['reflect']) ||
					(statName === 'spd' && this.side.sideConditions['lightscreen'])
				) {
					if (this.side.active.length === 1) {
						stat *= 2;
					} else {
						stat *= 1.5;
					}
				}
			}

			// Handle boosting items
			if (
				(['Cubone', 'Marowak'].includes(this.baseSpecies.name) && this.item === 'thickclub' && statName === 'atk') ||
				(this.baseSpecies.name === 'Pikachu' && this.item === 'lightball' && statName === 'spa')
			) {
				stat *= 2;
			} else if (this.baseSpecies.name === 'Ditto' && this.item === 'metalpowder' && ['def', 'spd'].includes(statName)) {
				stat = Math.floor(stat * 1.5);
			}

			return stat;
		},
	},
	actions: {
		inherit: true,
		getDamage(source, target, move, suppressMessages) {
			// First of all, we get the move.
			if (typeof move === 'string') {
				move = this.dex.getActiveMove(move);
			} else if (typeof move === 'number') {
				move = {
					basePower: move,
					type: '???',
					category: 'Physical',
					willCrit: false,
					flags: {},
				} as unknown as ActiveMove;
			}

			// Let's test for immunities.
			if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
				if (!target.runImmunity(move.type, true)) {
					return false;
				}
			}

			// Is it an OHKO move?
			if (move.ohko) {
				return target.maxhp;
			}

			// We edit the damage through move's damage callback
			if (move.damageCallback) {
				return move.damageCallback.call(this.battle, source, target);
			}

			// We take damage from damage=level moves
			if (move.damage === 'level') {
				return source.level;
			}

			// If there's a fix move damage, we run it
			if (move.damage) {
				return move.damage;
			}

			// We check the category and typing to calculate later on the damage
			move.category = this.battle.getCategory(move);
			// '???' is typeless damage: used for Struggle and Confusion etc
			if (!move.type) move.type = '???';
			const type = move.type;

			// We get the base power and apply basePowerCallback if necessary
			let basePower: number | false | null | undefined = move.basePower;
			if (move.basePowerCallback) {
				basePower = move.basePowerCallback.call(this.battle, source, target, move);
			}

			// We check for Base Power
			if (!basePower) {
				if (basePower === 0) return; // Returning undefined means not dealing damage
				return basePower;
			}
			basePower = this.battle.clampIntRange(basePower, 1);

			// Checking for the move's Critical Hit ratio
			let critRatio = this.battle.runEvent('ModifyCritRatio', source, target, move, move.critRatio || 0);
			critRatio = this.battle.clampIntRange(critRatio, 0, 5);
			const critMult = [0, 17, 32, 64, 85, 128];
			let isCrit = move.willCrit || false;
			if (typeof move.willCrit === 'undefined') {
				if (critRatio) {
					isCrit = this.battle.random(256) < critMult[critRatio];
				}
			}

			if (isCrit && this.battle.runEvent('CriticalHit', target, null, move)) {
				target.getMoveHitData(move).crit = true;
			}

			// Happens after crit calculation
			if (basePower) {
				// confusion damage
				if (move.isConfusionSelfHit) {
					move.type = move.baseMoveType!;
					basePower = this.battle.runEvent('BasePower', source, target, move, basePower, true);
					move.type = '???';
				} else {
					basePower = this.battle.runEvent('BasePower', source, target, move, basePower, true);
				}
				if (basePower && move.basePowerModifier) {
					basePower *= move.basePowerModifier;
				}
			}
			if (!basePower) return 0;
			basePower = this.battle.clampIntRange(basePower, 1);

			// We now check for attacker and defender
			let level = source.level;

			// Using Beat Up
			if (move.allies) {
				this.battle.add('-activate', source, 'move: Beat Up', '[of] ' + move.allies[0].name);
				level = move.allies[0].level;
			}

			const attacker = move.overrideOffensivePokemon === 'target' ? target : source;
			const defender = move.overrideDefensivePokemon === 'source' ? source : target;

			const isPhysical = move.category === 'Physical';
			const atkType: StatIDExceptHP = move.overrideOffensiveStat || (isPhysical ? 'atk' : 'spa');
			const defType: StatIDExceptHP = move.overrideDefensiveStat || (isPhysical ? 'def' : 'spd');

			let unboosted = false;
			let noburndrop = false;

			if (isCrit) {
				if (!suppressMessages) this.battle.add('-crit', target);
				// Stat level modifications are ignored if they are neutral to or favour the defender.
				// Reflect and Light Screen defensive boosts are only ignored if stat level modifications were also ignored as a result of that.
				if (attacker.boosts[atkType] <= defender.boosts[defType]) {
					unboosted = true;
					noburndrop = true;
				}
			}

			let attack = attacker.getStat(atkType, unboosted, noburndrop);
			let defense = defender.getStat(defType, unboosted);

			// Using Beat Up
			if (move.allies) {
				attack = move.allies[0].species.baseStats.atk;
				move.allies.shift();
				defense = defender.species.baseStats.def;
			}

			// Moves that ignore offense and defense respectively.
			if (move.ignoreOffensive) {
				this.battle.debug('Negating (sp)atk boost/penalty.');
				// The attack drop from the burn is only applied when attacker's attack level is higher than defender's defense level.
				attack = attacker.getStat(atkType, true, true);
			}

			if (move.ignoreDefensive) {
				this.battle.debug('Negating (sp)def boost/penalty.');
				defense = target.getStat(defType, true, true);
			}

			if (move.id === 'present') {
				const typeIndexes: {[k: string]: number} = {
					Normal: 0, Fighting: 1, Flying: 2, Poison: 3, Ground: 4, Rock: 5, Bug: 7, Ghost: 8, Steel: 9,
					Fire: 20, Water: 21, Grass: 22, Electric: 23, Psychic: 24, Ice: 25, Dragon: 26, Dark: 27,
				};
				attack = 10;

				const attackerLastType = attacker.getTypes().slice(-1)[0];
				const defenderLastType = defender.getTypes().slice(-1)[0];

				defense = typeIndexes[attackerLastType] || 1;
				level = typeIndexes[defenderLastType] || 1;
				this.battle.hint("Gen 2 Present has a glitched damage calculation using the secondary types of the Pokemon for the Attacker's Level and Defender's Defense.", true);
			}

			// When either attack or defense are higher than 256, they are both divided by 4 and modded by 256.
			// This is what causes the rollover bugs.
			if (attack >= 256 || defense >= 256) {
				if (attack >= 1024 || defense >= 1024) {
					this.battle.hint("In Gen 2, a stat will roll over to a small number if it is larger than 1024.");
				}
				attack = this.battle.clampIntRange(Math.floor(attack / 4) % 256, 1);
				defense = this.battle.clampIntRange(Math.floor(defense / 4) % 256, 1);
			}

			// Self destruct moves halve defense at this point.
			if (move.selfdestruct && defType === 'def') {
				defense = this.battle.clampIntRange(Math.floor(defense / 2), 1);
			}

			// Let's go with the calculation now that we have what we need.
			// We do it step by step just like the game does.
			let damage = level * 2;
			damage = Math.floor(damage / 5);
			damage += 2;
			damage *= basePower;
			damage *= attack;
			damage = Math.floor(damage / defense);
			damage = Math.floor(damage / 50);
			if (isCrit) damage *= 2;
			damage = Math.floor(this.battle.runEvent('ModifyDamage', attacker, defender, move, damage));
			damage = this.battle.clampIntRange(damage, 1, 997);
			damage += 2;

			// Weather modifiers
			if (
				(type === 'Water' && this.battle.field.isWeather('raindance')) ||
				(type === 'Fire' && this.battle.field.isWeather('sunnyday'))
			) {
				damage = Math.floor(damage * 1.5);
			} else if (
				((type === 'Fire' || move.id === 'solarbeam') && this.battle.field.isWeather('raindance')) ||
				(type === 'Water' && this.battle.field.isWeather('sunnyday'))
			) {
				damage = Math.floor(damage / 2);
			}

			// STAB damage bonus, the "???" type never gets STAB
			if (type !== '???' && source.hasType(type)) {
				damage += Math.floor(damage / 2);
			}

			// Type effectiveness
			const totalTypeMod = target.runEffectiveness(move);
			// Super effective attack
			if (totalTypeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target);
				damage *= 2;
				if (totalTypeMod >= 2) {
					damage *= 2;
				}
			}
			// Resisted attack
			if (totalTypeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target);
				damage = Math.floor(damage / 2);
				if (totalTypeMod <= -2) {
					damage = Math.floor(damage / 2);
				}
			}

			// Attempting to add correct spread damage nerf
			const {targets} = source.getMoveTargets(move, target);
			if (targets.length > 1) move.spreadHit = true;
			if (move.spreadHit && move.target === 'allAdjacentFoes') {
				const spreadModifier = move.spreadModifier || 0.5;
				this.battle.debug('Spread modifier: ' + spreadModifier);
				damage = this.battle.modify(damage, spreadModifier);
			}

			// Apply random factor if damage is greater than 1, except for Flail and Reversal
			if (!move.noDamageVariance && damage > 1) {
				damage *= this.battle.random(217, 256);
				damage = Math.floor(damage / 255);
			}

			// If damage is less than 1, we return 1
			if (basePower && !Math.floor(damage)) {
				return 1;
			}

			// We are done, this is the final damage
			return damage;
		},
	},
};
