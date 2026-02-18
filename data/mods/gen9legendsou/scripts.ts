export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9legends',
	init() {
		const legalItems = [
			'assaultvest', 'bigroot', 'blackbelt', 'blackglasses', 'charcoal', 'dragonfang', 'eviolite', 'expertbelt', 'fairyfeather',
			'focusband', 'focussash', 'hardstone', 'kingsrock', 'leftovers', 'lifeorb', 'lightball', 'magnet', 'metalcoat', 'miracleseed',
			'muscleband', 'mysticwater', 'nevermeltice', 'normalgem', 'poisonbarb', 'poweranklet', 'powerband', 'powerbelt', 'powerbracer',
			'powerlens', 'powerweight', 'quickclaw', 'rockyhelmet', 'scopelens', 'sharpbeak', 'shellbell', 'silkscarf', 'silverpowder',
			'softsand', 'spelltag', 'twistedspoon', 'weaknesspolicy', 'whiteherb', 'wiseglasses', 'bottlecap', 'goldbottlecap', 'dawnstone',
			'duskstone', 'firestone', 'galaricacuff', 'galaricawreath', 'icestone', 'leafstone', 'moonstone', 'sachet', 'shinystone',
			'sunstone', 'thunderstone', 'waterstone', 'whippeddream', 'bignugget', 'redorb', 'blueorb', 'leek', 'thickclub', 'upgrade',
			'dubiousdisc', 'prismscale', 'maliciousarmor', 'auspiciousarmor', 'poweranklet', 'powerband', 'powerbelt', 'powerbracer',
			'powerlens', 'powerweight', 'bignugget', 'bottlecap', 'goldbottlecap', 'prismscale', 'sachet', 'whippeddream',
		];
		const legalBerries = [
			'aspearberry', 'babiriberry', 'chartiberry', 'cheriberry', 'chestoberry', 'chilanberry', 'chopleberry', 'cobaberry', 'colburberry',
			'grepaberry', 'habanberry', 'hondewberry', 'kasibberry', 'kebiaberry', 'kelpsyberry', 'lumberry', 'occaberry', 'oranberry', 'passhoberry',
			'payapaberry', 'pechaberry', 'persimberry', 'pomegberry', 'qualotberry', 'rawstberry', 'rindoberry', 'roseliberry', 'shucaberry',
			'sitrusberry', 'tamatoberry', 'tangaberry', 'wacanberry', 'yacheberry',
		];
		const votedLegalitems = [
			'heavydutyboots', 'choiceband', 'choicescarf', 'choicespecs', 'airballoon', 'loadeddice', 'mentalherb', 'powerherb', 'mirrorherb',
			'aguavberry', 'apicotberry', 'custapberry', 'enigmaberry', 'figyberry', 'ganlonberry', 'iapapaberry', 'jabocaberry', 'keeberry',
			'lansatberry', 'leppaberry', 'liechiberry', 'magoberry', 'marangaberry', 'micleberry', 'petayaberry', 'rowapberry', 'salacberry',
			'starfberry', 'wikiberry', 'abilityshield', 'blunderpolicy', 'blacksludge', 'lightclay', 'brightpowder', 'adrenalineorb', 'absorbbulb',
			'clearamulet', 'covertcloak', 'damprock', 'heatrock', 'icyrock', 'smoothrock', 'electricseed', 'mistyseed', 'psychicseed', 'grassyseed',
			'flameorb', 'toxicorb', 'gripclaw', 'laggingtail', 'metronome', 'protectivepads', 'punchingglove', 'razorclaw', 'razorfang', 'roomservice',
			'safetygoggles', 'shellbell', 'shedshell', 'stickybarb', 'terrainextender', 'throatspray', 'utilityumbrella', 'zoomlens', 'bindingband',
			'destinyknot', 'floatstone', 'ironball', 'machobrace', 'ringtarget', 'redcard', 'ejectpack', 'ejectbutton', 'souldew', 'cellbattery',
			'luminousmoss', 'oddincense', 'roseincense', 'seaincense', 'waveincense', 'snowball',
		];
		for (const i in this.data.Items) {
			if (this.data.Items[i].isNonstandard === 'CAP' || this.data.Items[i].isNonstandard === 'Custom') continue;
			if ([...legalItems, ...votedLegalitems, ...legalBerries].includes(i) ||
				this.data.Items[i].megaStone || this.data.Items[i].onDrive ||
				(this.data.Items[i].onPlate && !this.data.Items[i].zMove)) {
				this.modData('Items', i).isNonstandard = null;
			} else {
				this.modData('Items', i).isNonstandard = 'Past';
			}
		}
		for (const i in this.data.Moves) {
			if (this.data.Moves[i].isNonstandard !== 'Past') continue;
			this.modData('Moves', i).isNonstandard = null;
		}
	},
	actions: {
		canMegaEvo(pokemon) {
			const species = pokemon.baseSpecies;
			const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
			const item = pokemon.getItem();
			// Mega Rayquaza
			if ((this.battle.gen <= 7 || this.battle.ruleTable.has('+pokemontag:past') ||
				this.battle.ruleTable.has('+pokemontag:future')) &&
				altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(this.battle.toID(altForme.requiredMove)) && !item.zMove) {
				return altForme.name;
			}
			if (!item.megaStone) return null;
			return item.megaStone[species.name];
		},
		runMegaEvo(pokemon) {
			const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
			if (!speciesid) return false;

			pokemon.formeChange(speciesid, pokemon.getItem(), true);

			// Limit one mega evolution
			const wasMega = pokemon.canMegaEvo;
			for (const ally of pokemon.side.pokemon) {
				if (wasMega) {
					ally.canMegaEvo = false;
				} else {
					ally.canUltraBurst = null;
				}
			}

			// will finish coding this later, not important since zygarde is banned
			if (speciesid === 'Zygarde-Mega') {
				const coreEnforcer = pokemon.moveSlots.findIndex(x => x.id === 'coreenforcer');
				if (coreEnforcer >= 0) {
					const nihilLight = this.battle.dex.moves.get('nihillight');
					pokemon.moveSlots[coreEnforcer] = pokemon.baseMoveSlots[coreEnforcer] = {
						id: nihilLight.id,
						move: nihilLight.name,
						pp: pokemon.moveSlots[coreEnforcer].pp,
						maxpp: pokemon.moveSlots[coreEnforcer].maxpp,
						disabled: false,
						used: false,
					};
				}
			}

			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
	},
};
