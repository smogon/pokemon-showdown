export const Scripts: ModdedBattleScriptsData = {
	init() {
		const moddedLearnset = (mon: string, addedMoves: string[] | null, removedMoves: string[] | null = null) => {
			if (addedMoves) {
				for (const move of addedMoves) {
					const modData = this.modData('Learnsets', this.toID(mon));
					if (!(this.toID(move) in modData.learnset)) modData.learnset[this.toID(move)] = [];
					modData.learnset[this.toID(move)].push("8M");
				}
			}
			if (removedMoves) {
				for (const move of removedMoves) {
					delete this.modData('Learnsets', this.toID(mon)).learnset[this.toID(move)];
				}
			}
		};
		moddedLearnset('porygon2', null, ['teleport']);
		moddedLearnset('jellicent', ['haze'], ['toxic', 'recover']);
		moddedLearnset('crabominable', ['hammerarm', 'icehammer'], ['payback']);
		moddedLearnset('oricorio', ['reflecttype'], ['calmmind']);
		moddedLearnset('wigglytuff', ['earthquake', 'jumpkick'], ['teleport']);
		moddedLearnset('wormadamtrash', ['spikes', 'healorder'], ['quiverdance']);
		moddedLearnset('heatmor', ['dragondance'], ['knockoff', 'suckerpunch', 'thunderpunch']);
		moddedLearnset('beheeyem', ['signalbeam'], ['psyshock']);
		moddedLearnset('golbat', ['hurricane', 'poisonjab']);
		moddedLearnset('eelektross', ['flipturn', 'surf', 'liquidation'], ['flamethrower', 'uturn']);
		moddedLearnset('togedemaru', ['healbell']);
		moddedLearnset('garchomp', ['scorchingsands'], ['crunch', 'swordsdance']);
		moddedLearnset('whimsicott', ['morningsun', 'synthesis']);
		moddedLearnset('skuntank', ['calmmind', 'powertrip', 'slackoff'], ['nastyplot']);
		moddedLearnset('lycanrocdusk', ['crosschop', 'tripleaxel']);
		moddedLearnset('frosmoth', ['roost'], ['hurricane', 'airslash', 'dazzlinggleam']);
		moddedLearnset('dragonair', ['flipturn', 'hydropump'], ['blizzard', 'flamethrower', 'fireblast', 'icebeam']);
		moddedLearnset('reshiram', ['haze'], ['blueflare', 'earthpower', 'focusblast']);
		moddedLearnset('aegislash', null, ['closecombat', 'shadowsneak', 'swordsdance']);
		moddedLearnset('camerupt', ['gigadrain', 'scorchingsands'], ['eruption']);
		moddedLearnset('empoleon', ['flipturn']);
		moddedLearnset('delibird', null, ['destinybond']);
	},
	// Modded functions
	modifyDamage(
		baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages = false
	) {
		const tr = this.trunc;
		if (!move.type) move.type = '???';
		const type = move.type;

		baseDamage += 2;

		// multi-target modifier (doubles only)
		if (move.spreadHit) {
			const spreadModifier = move.spreadModifier || (this.gameType === 'free-for-all' ? 0.5 : 0.75);
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// weather modifier
		baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

		// crit - not a modifier
		const isCrit = target.getMoveHitData(move).crit;
		if (isCrit) {
			baseDamage = tr(baseDamage * (move.critModifier || (this.gen >= 6 ? 1.5 : 2)));
		}

		// random factor - also not a modifier
		baseDamage = this.randomizer(baseDamage);

		// STAB
		if (move.forceSTAB || (type !== '???' && pokemon.hasType(type))) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a MissingNo.)
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
		let typeMod = target.runEffectiveness(move);
		typeMod = this.clampIntRange(typeMod, -6, 6);
		target.getMoveHitData(move).typeMod = typeMod;
		if (typeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);

			for (let i = 0; i < typeMod; i++) {
				baseDamage *= 2;
			}
		}
		if (typeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);

			for (let i = 0; i > typeMod; i--) {
				baseDamage = tr(baseDamage / 2);
			}
		}

		if (isCrit && !suppressMessages) this.add('-crit', target);
		// ONLY PART THAT IS CHANGED
		if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('unflagging')) {
		//
			if (this.gen < 6 || move.id !== 'facade') {
				baseDamage = this.modify(baseDamage, 0.5);
			}
		}

		// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
		if (this.gen === 5 && !baseDamage) baseDamage = 1;

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		if ((move.isZOrMaxPowered || move.isZOrMaxPowered) && target.getMoveHitData(move).zBrokeProtect) {
			baseDamage = this.modify(baseDamage, 0.25);
			this.add('-zbroken', target);
		}

		// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
		if (this.gen !== 5 && !baseDamage) return 1;

		// ...but 16-bit truncation happens even later, and can truncate to 0
		return tr(baseDamage, 16);
	},
	pokemon: {
		ignoringItem() {
			let embargoAct = false;
			for (const target of this.side.foe.active) {
				if (target.hasAbility('embargoact')) {
					embargoAct = true;
					break;
				}
			}
			return !!((this.battle.gen >= 5 && !this.isActive) ||
					(this.hasAbility('klutz') && !this.getItem().ignoreKlutz) ||
					this.volatiles['embargo'] || this.battle.field.pseudoWeather['magicroom'] || embargoAct);
		},
	},
};
