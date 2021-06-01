export const Scripts: ModdedBattleScriptsData = {
	init() {
		// Automatically construct fusion learnsets! (Thank u scoopapa)
		// Check the dex for fusions
		for (const fusionEntry of this.species.all() as (Species & {fusion?: [string, string]})[]) {
			if (fusionEntry.fusion?.length) { // If the pokedex entry has a fusion field, it's a fusion
				const learnsetFusionList = []; // List of pokemon whose learnsets need to be fused
				for (const name of fusionEntry.fusion) {
					learnsetFusionList.push(name);
					let prevo = this.species.get(name).prevo;
					while (prevo) { // Make sure prevos of both fused pokemon are added to the list
						learnsetFusionList.push(prevo);
						prevo = this.species.get(prevo).prevo;
					}
				}
				// Create a blank learnset entry so we don't need a learnsets file
				if (!this.data.Learnsets[fusionEntry.id]) this.data.Learnsets[fusionEntry.id] = {learnset: {}};
				for (const name of learnsetFusionList) {
					const learnset = this.data.Learnsets[this.toID(name)].learnset; // Get the learnset of each pokemon in the list
					for (const moveid in learnset) {
						if (this.moves.get(moveid).isNonstandard === 'Past') continue; // Exclude dexited moves (I hope!)
						// All moves are compatible with the fusion's only ability, so just set it to 8L1
						this.modData('Learnsets', fusionEntry.id).learnset[moveid] = ['8L1'];
					}
				}
			}
		}
		// Now, case-by-case learnset revisions:
		// Behemoth Bash and Behemoth Blade are added automatically to the Crowned dogs somewhere,
		// So we will simulate that here, instead of actually editing that.
		this.modData('Learnsets', 'yaciancrowned').learnset.behemothblade = ['8L1'];
		this.modData('Learnsets', 'igglyzentacrowned').learnset.behemothbash = ['8L1'];
		delete this.modData('Learnsets', 'yaciancrowned').learnset.ironhead;
		delete this.modData('Learnsets', 'igglyzentacrowned').learnset.ironhead;
	},
	actions: {
		canMegaEvo(pokemon) {
			const altForme = pokemon.baseSpecies.otherFormes && this.dex.species.get(pokemon.baseSpecies.otherFormes[0]);
			const item = pokemon.getItem();
			if (
				altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(this.battle.toID(altForme.requiredMove)) && !item.zMove
			) {
				return altForme.name;
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Bug") {
				return "Silvino-Bug-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Dark") {
				return "Silvino-Dark-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Dragon") {
				return "Silvino-Dragon-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Electric") {
				return "Silvino-Electric-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Fairy") {
				return "Silvino-Fairy-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Fighting") {
				return "Silvino-Fighting-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Fire") {
				return "Silvino-Fire-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Flying") {
				return "Silvino-Flying-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Ghost") {
				return "Silvino-Ghost-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Grass") {
				return "Silvino-Grass-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Ground") {
				return "Silvino-Ground-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Ice") {
				return "Silvino-Ice-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Poison") {
				return "Silvino-Poison-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Psychic") {
				return "Silvino-Psychic-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Rock") {
				return "Silvino-Rock-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Steel") {
				return "Silvino-Steel-Mega";
			}
			if (item.name === "Audinite" && pokemon.baseSpecies.name === "Silvino-Water") {
				return "Silvino-Water-Mega";
			}
			return item.megaStone;
		},
		// Included for Therapeutic:
		// Burn status' Atk reduction and Guts users' immunity to it is hard-coded in battle.ts,
		// So we have to bypass it manually here.
		modifyDamage(
			baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages = false
		) {
			const tr = this.battle.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;
			baseDamage += 2;
			// multi-target modifier (doubles only)
			if (move.spreadHit) {
				const spreadModifier = move.spreadModifier || (this.battle.gameType === 'freeforall' ? 0.5 : 0.75);
				this.battle.debug('Spread modifier: ' + spreadModifier);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			}
			// weather modifier
			baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);
			// crit - not a modifier
			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
			}
			// random factor - also not a modifier
			baseDamage = this.battle.randomizer(baseDamage);
			// STAB
			if (move.forceSTAB || (type !== '???' && pokemon.hasType(type))) {
				// The "???" type never gets STAB
				// Not even if you Roost in Gen 4 and somehow manage to use
				// Struggle in the same turn.
				// (On second thought, it might be easier to get a MissingNo.)
				baseDamage = this.battle.modify(baseDamage, move.stab || 1.5);
			}
			// types
			let typeMod = target.runEffectiveness(move);
			typeMod = this.battle.clampIntRange(typeMod, -6, 6);
			target.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target);
				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target);
				for (let i = 0; i > typeMod; i--) {
					baseDamage = tr(baseDamage / 2);
				}
			}
			if (isCrit && !suppressMessages) this.battle.add('-crit', target);
			if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility(['guts', 'therapeutic'])) {
				if (this.battle.gen < 6 || move.id !== 'facade') {
					baseDamage = this.battle.modify(baseDamage, 0.5);
				}
			}
			// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
			if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;
			// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);
			if (move.isZOrMaxPowered && target.getMoveHitData(move).zBrokeProtect) {
				baseDamage = this.battle.modify(baseDamage, 0.25);
				this.battle.add('-zbroken', target);
			}
			// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
			if (this.battle.gen !== 5 && !baseDamage) return 1;
			// ...but 16-bit truncation happens even later, and can truncate to 0
			return tr(baseDamage, 16);
		},
	},
	pokemon: {
		// Included for Magnetic Waves:
		// Levitate is checked for when running groundedness (ground immunity, iron ball, etc)
		// So we manually add a check for Magnetic Waves here as well,
		// Including a diffrent activation message
		// so that the game doesn't report it as having Levitate when it procs.
		runImmunity(type: string, message?: string | boolean) {
			if (!type || type === '???') return true;
			if (!this.battle.dex.types.isName(type)) {
				throw new Error("Use runStatusImmunity for " + type);
			}
			if (this.fainted) return false;
			const negateImmunity = !this.battle.runEvent('NegateImmunity', this, type);
			const notImmune = type === 'Ground' ?
				this.isGrounded(negateImmunity) :
				negateImmunity || this.battle.dex.getImmunity(type, this);
			if (notImmune) return true;
			if (!message) return false;
			if (notImmune === null) {
				if (this.hasAbility('magneticwaves')) {
					this.battle.add('-immune', this, '[from] ability: Magnetic Waves');
				} else {
					this.battle.add('-immune', this, '[from] ability: Levitate');
				}
			} else {
				this.battle.add('-immune', this);
			}
			return false;
		},
		cureStatus(silent = false) {
			if (!this.hp || !this.status) return false;
			this.battle.add('-curestatus', this, this.status, silent ? '[silent]' : '[msg]');
			if (this.status === 'slp' && !this.hasAbility('comatose') && this.removeVolatile('nightmare')) {
				this.battle.add('-end', this, 'Nightmare', '[silent]');
			}
			this.setStatus('');
			delete this.m.orbItemStatus;
			return true;
		},
	},
};
