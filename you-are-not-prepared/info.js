'use strict';

exports.commands = {
	sdt: 'seasonaldata',
	sdata: 'seasonaldata',
	seasonaldata: function (target, room, user) {
		if (!this.canBroadcast()) return;

		let buffer = '|raw|';
		let targetId = toId(target);
		switch (targetId) {
		case 'cura':
		case 'recover':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Cura"><span class="col movenamecol">Cura</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Heals the active team by 20%.</span> </a></li><li></li></ul>';
			break;
		case 'curaga':
		case 'softboiled':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Curaga"><span class="col movenamecol">Curaga</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Heals the active team by 33%.</span> </a></li><li></li></ul>';
			break;
		case 'wildgrowth':
		case 'reflect':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Wild Growth"><span class="col movenamecol">Wild Growth</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Heals the team by 12.5% each turn for 5 turns.</span> </a></li><li></li></ul>';
			break;
		case 'powershield':
		case 'acupressure':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Power Shield"><span class="col movenamecol">Power Shield</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">The target will be healed by 25% of the next damage received.</span> </a></li><li></li></ul>';
			break;
		case 'rejuvenation':
		case 'holdhands':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Rejuvenation"><span class="col movenamecol">Rejuvenation</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">The target will be healed by 18% each turn for 3 turns.</span> </a></li><li></li></ul>';
			break;
		case 'fairyward':
		case 'luckychant':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Fairy Ward"><span class="col movenamecol">Fairy Ward</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Prevents status and reduce damage by 5% for all the team for 3 turns.</span> </a></li><li></li></ul>';
			break;
		case 'taunt':
		case 'followme':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Taunt"><span class="col movenamecol">Taunt</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Will redirect all attacks to user for three turns.</span> </a></li><li></li></ul>';
			break;
		case 'sacrifice':
		case 'meditate':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Sacrifice"><span class="col movenamecol">Sacrifice</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Will redirect all team damage to user for 4 turns.</span> </a></li><li></li></ul>';
			break;
		case 'cooperation':
		case 'helpinghand':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Cooperation"><span class="col movenamecol">Cooperation</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Switches positions with target.</span> </a></li><li></li></ul>';
			break;
		case 'slowdown':
		case 'spite':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Slow Down"><span class="col movenamecol">Slow Down</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Removes 8 PP. Lowers damage by 15%. Gets disabled after use.</span> </a></li><li></li></ul>';
			break;
		case 'healingtouch':
		case 'aromaticmist':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Healing Touch"><span class="col movenamecol">Healing Touch</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Heals target by 60% of its max HP.</span> </a></li><li></li></ul>';
			break;
		case 'penance':
		case 'healbell':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Penance"><span class="col movenamecol">Penance</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Heals all team by 12.5% and places a shield that will heal them for 6.15% upon being hit.</span> </a></li><li></li></ul>';
			break;
		case 'stop':
		case 'fakeout':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Stop"><span class="col movenamecol">Stop</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Target won\'t move. Has priority. User is disabled after use.</span> </a></li><li></li></ul>';
			break;
		case 'laststand':
		case 'endure':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Last Stand"><span class="col movenamecol">Last Stand</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">User will survive the next hit. Damage taken is halved for the turn. User is disabled after use.</span> </a></li><li></li></ul>';
			break;
		case 'barkskin':
		case 'withdraw':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Barkskin"><span class="col movenamecol">Barkskin</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Reduces damage taken by 25% by 2 turns.</span> </a></li><li></li></ul>';
			break;
		case 'punishment':
		case 'seismictoss':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Punishment"><span class="col movenamecol">Punishment</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Base damage is 33% of user\'s current HP.</span> </a></li><li></li></ul>';
			break;
		case 'flamestrike':
		case 'flamethrower':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Flamestrike"><span class="col movenamecol">Flamestrike</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />30%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Base damage is 40% if the target is burned.</span> </a></li><li></li></ul>';
			break;
		case 'conflagration':
		case 'fireblast':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Conflagration"><span class="col movenamecol">Conflagration</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />20%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Burns target.</span> </a></li><li></li></ul>';
			break;
		case 'moonfire':
		case 'thunderbolt':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Moonfire"><span class="col movenamecol">Moonfire</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />20%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Applies Moonfire for 4 turns, it deals 6% damage.</span> </a></li><li></li></ul>';
			break;
		case 'starfire':
		case 'thunder':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Starfire"><span class="col movenamecol">Starfire</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />30%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Base damage is 40% if the target is moonfired.</span> </a></li><li></li></ul>';
			break;
		case 'corruption':
		case 'toxic':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Corruption"><span class="col movenamecol">Corruption</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Deals 10% damage every turn for 4 turns.</span> </a></li><li></li></ul>';
			break;
		case 'soulleech':
		case 'leechseed':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Soul Leech"><span class="col movenamecol">Soul Leech</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Drains 8% HP every turn for 4 turns.</span> </a></li><li></li></ul>';
			break;
		case 'icelance':
		case 'icebeam':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Ice Lance"><span class="col movenamecol">Ice Lance</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />30%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Base damage is 40% if the target is chilled.</span> </a></li><li></li></ul>';
			break;
		case 'frostbite':
		case 'freezeshock':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Frostbite"><span class="col movenamecol">Frostbite</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />20%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Chills target. It will be slower.</span> </a></li><li></li></ul>';
			break;
		case 'hurricane':
		case 'aircutter':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Hurricane"><span class="col movenamecol">Hurricane</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />20%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Damage all adjacent foes.</span> </a></li><li></li></ul>';
			break;
		case 'storm':
		case 'muddywater':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Storm"><span class="col movenamecol">Storm</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />20%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Damage all adjacent foes.</span> </a></li><li></li></ul>';
			break;
		case 'fury':
		case 'furyswipes':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Fury"><span class="col movenamecol">Fury</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />15%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Disables user. Next use will have 100% base power.</span> </a></li><li></li></ul>';
			break;
		case 'garrote':
		case 'scratch':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Garrote"><span class="col movenamecol">Garrote</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />20%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Causes bleeding. It deals 6.15% damage for 5 turns.</span> </a></li><li></li></ul>';
			break;
		case 'poisongas':
		case 'smog':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Poison Gas"><span class="col movenamecol">Poison Gas</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Poisons the target.</span> </a></li><li></li></ul>';
			break;
		case 'mutilate':
		case 'slash':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Mutilate"><span class="col movenamecol">Mutilate</span> <span class="col typecol"></span> <span class="col labelcol"><em>Power</em><br />27%</span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Increases power by 10% or 20% if target is psn or/and bld.</span> </a></li><li></li></ul>';
			break;
		case 'sacredshield':
		case 'matblock':
			buffer += '<ul class="utilichart"><li class="result"><a data-name="Sacred Shield"><span class="col movenamecol">Sacred Shield</span> <span class="col typecol"></span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol">Shields team greatly, losses HP.</span> </a></li><li></li></ul>';
			break;
		default:
			buffer = "No Pok\u00e9mon, item, move, ability or nature named '" + target + "' was found on this seasonal.";
		}
		if (targetId === 'evasion' || targetId === 'protect') {
			return this.parse('/data protect');
		} else if (!targetId) {
			return this.sendReply("Please specify a valid Pok\u00e9mon, item, move, ability or nature in this seasonal.");
		} else {
			this.sendReply(buffer);
		}
	},
	seasonaldatahelp: [
		"/seasonaldata [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability/nature for the current seasonal.",
		"!seasonaldata [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ # & ~",
	],
};
