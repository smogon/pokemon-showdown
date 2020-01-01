'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	inherit: 'gen7',
	init() {
		// Type: Null
		this.modData('Learnsets', 'typenull').learnset.bulletpunch = ['7M'];
		delete this.modData('Learnsets', 'typenull').learnset.pursuit;

		// Crobat
		this.modData('Learnsets', 'crobat').learnset.circlethrow = ['7M'];
		this.modData('Learnsets', 'crobat').learnset.stormthrow = ['7M'];
		delete this.modData('Learnsets', 'crobat').learnset.acrobatics;
		delete this.modData('Learnsets', 'crobat').learnset.aerialace;
		delete this.modData('Learnsets', 'crobat').learnset.aircutter;
		delete this.modData('Learnsets', 'crobat').learnset.airslash;
		delete this.modData('Learnsets', 'crobat').learnset.fly;
		delete this.modData('Learnsets', 'crobat').learnset.gust;
		delete this.modData('Learnsets', 'crobat').learnset.skyattack;
		delete this.modData('Learnsets', 'crobat').learnset.tailwind;
		delete this.modData('Learnsets', 'crobat').learnset.wingattack;
		delete this.modData('Learnsets', 'crobat').learnset.uturn;

		// Galvantula
		this.modData('Learnsets', 'galvantula').learnset.slackoff = ['7M'];
		delete this.modData('Learnsets', 'galvantula').learnset.stickyweb;

		// Dugtrio-Alola
		this.modData('Learnsets', 'dugtrioalola').learnset.spikes = ['7M'];
		this.modData('Learnsets', 'dugtrioalola').learnset.knockoff = ['7M'];
		this.modData('Learnsets', 'dugtrioalola').learnset.taunt = ['7M'];
		delete this.modData('Learnsets', 'dugtrioalola').learnset.finalgambit;
		delete this.modData('Learnsets', 'dugtrioalola').learnset.memento;

		// Ludicolo
		this.modData('Learnsets', 'ludicolo').learnset.recover = ['7M'];
		delete this.modData('Learnsets', 'ludicolo').learnset.leechseed;
		delete this.modData('Learnsets', 'ludicolo').learnset.hydropump;

		// Rotom
		this.modData('Learnsets', 'rotom').learnset.copycat = ['7M'];
		this.modData('Learnsets', 'rotom').learnset.recover = ['7M'];
		this.modData('Learnsets', 'rotom').learnset.workup = ['7M'];
		this.modData('Learnsets', 'rotom').learnset.haze = ['7M'];

		// Torterra
		this.modData('Learnsets', 'torterra').learnset.dracometeor = ['7T'];
		this.modData('Learnsets', 'torterra').learnset.headsmash = ['7M'];
		delete this.modData('Learnsets', 'torterra').learnset.swordsdance;

		// Dragalge
		this.modData('Learnsets', 'dragalge').learnset.painsplit = ['7M'];
		this.modData('Learnsets', 'dragalge').learnset.clearsmog = ['7M'];

		// Ninetales
		this.modData('Learnsets', 'ninetales').learnset.moonblast = ['7M'];
		this.modData('Learnsets', 'ninetales').learnset.playrough = ['7M'];
		this.modData('Learnsets', 'ninetales').learnset.powergem = ['7M'];
		this.modData('Learnsets', 'ninetales').learnset.moonlight = ['7M'];
		this.modData('Learnsets', 'ninetales').learnset.extremespeed = ['7M'];
		delete this.modData('Learnsets', 'ninetales').learnset.energyball;
		delete this.modData('Learnsets', 'ninetales').learnset.hypnosis;
		delete this.modData('Learnsets', 'ninetales').learnset.psyshock;

		// Farfetch'd
		this.modData('Learnsets', 'farfetchd').learnset.crosschop = ['7M'];
		this.modData('Learnsets', 'farfetchd').learnset.smartstrike = ['7M'];
		this.modData('Learnsets', 'farfetchd').learnset.sacredsword = ['7M'];

		// Purugly
		this.modData('Learnsets', 'purugly').learnset.pursuit = ['7M'];
		delete this.modData('Learnsets', 'purugly').learnset.stompingtantrum;

		// Kyurem
		this.modData('Learnsets', 'kyurem').learnset.freezedry = ['7M'];
		delete this.modData('Learnsets', 'kyurem').learnset.roost;
		delete this.modData('Learnsets', 'kyurem').learnset.earthpower;
		delete this.modData('Learnsets', 'kyurem').learnset.focusblast;

		// Rotom-Wash
		this.modData('Learnsets', 'rotomwash').learnset = Object.assign({}, this.data.Learnsets.rotom.learnset, this.data.Learnsets.rotomwash.learnset);
		this.modData('Learnsets', 'rotomwash').learnset.taunt = ['7M'];
		this.modData('Learnsets', 'rotomwash').learnset.surf = ['7M'];
		delete this.modData('Learnsets', 'rotomwash').learnset.voltswitch;
		delete this.modData('Learnsets', 'rotomwash').learnset.thunderbolt;
		delete this.modData('Learnsets', 'rotomwash').learnset.discharge;
		delete this.modData('Learnsets', 'rotomwash').learnset.thunder;

		// Umbreon
		this.modData('Learnsets', 'umbreon').learnset.haze = ['7M'];
		this.modData('Learnsets', 'umbreon').learnset.hex = ['7M'];
		this.modData('Learnsets', 'umbreon').learnset.recover = ['7M'];
		this.modData('Learnsets', 'umbreon').learnset.toxicthread = ['7M'];

		// Heracross
		this.modData('Learnsets', 'heracross').learnset.stealthrock = ['7M'];
		this.modData('Learnsets', 'heracross').learnset.uturn = ['7M'];
		this.modData('Learnsets', 'heracross').learnset.shadowsneak = ['7M'];
		this.modData('Learnsets', 'heracross').learnset.willowisp = ['7M'];
		delete this.modData('Learnsets', 'heracross').learnset.swordsdance;
		delete this.modData('Learnsets', 'heracross').learnset.closecombat;
		delete this.modData('Learnsets', 'heracross').learnset.superpower;
		delete this.modData('Learnsets', 'heracross').learnset.megahorn;

		// Magearna
		this.modData('Learnsets', 'magearna').learnset.rest = ['7M'];
		this.modData('Learnsets', 'magearna').learnset.sleeptalk = ['7M'];
		this.modData('Learnsets', 'magearna').learnset.moonblast = ['7M'];
		this.modData('Learnsets', 'magearna').learnset.healbell = ['7M'];
		this.modData('Learnsets', 'magearna').learnset.drainingkiss = ['7M'];
		delete this.modData('Learnsets', 'magearna').learnset.aurasphere;
		delete this.modData('Learnsets', 'magearna').learnset.fleurcannon;
		delete this.modData('Learnsets', 'magearna').learnset.focusblast;
		delete this.modData('Learnsets', 'magearna').learnset.icebeam;
		delete this.modData('Learnsets', 'magearna').learnset.thunderbolt;
		delete this.modData('Learnsets', 'magearna').learnset.shiftgear;
		delete this.modData('Learnsets', 'magearna').learnset.calmmind;

		// Rotom-Mow
		this.modData('Learnsets', 'rotommow').learnset = Object.assign({}, this.data.Learnsets.rotom.learnset, this.data.Learnsets.rotommow.learnset);
		this.modData('Learnsets', 'rotommow').learnset.leafblade = ['7M'];
		this.modData('Learnsets', 'rotommow').learnset.psychicfangs = ['7M'];
		this.modData('Learnsets', 'rotommow').learnset.ironhead = ['7M'];
		this.modData('Learnsets', 'rotommow').learnset.rapidspin = ['7M'];
		this.modData('Learnsets', 'rotommow').learnset.shiftgear = ['7M'];
		delete this.modData('Learnsets', 'rotommow').learnset.voltswitch;
		delete this.modData('Learnsets', 'rotommow').learnset.thunderbolt;
		delete this.modData('Learnsets', 'rotommow').learnset.discharge;
		delete this.modData('Learnsets', 'rotommow').learnset.thunder;
		delete this.modData('Learnsets', 'rotommow').learnset.willowisp;
		delete this.modData('Learnsets', 'rotommow').learnset.defog;

		// Malamar
		this.modData('Learnsets', 'malamar').learnset.flashcannon = ['7M'];

		// Wailord
		this.modData('Learnsets', 'wailord').learnset.wish = ['7M'];
		this.modData('Learnsets', 'wailord').learnset.airslash = ['7M'];
		this.modData('Learnsets', 'wailord').learnset.roost = ['7M'];
		this.modData('Learnsets', 'wailord').learnset.defog = ['7M'];
		this.modData('Learnsets', 'wailord').learnset.hurricane = ['7M'];
	},
};

exports.BattleScripts = BattleScripts;
