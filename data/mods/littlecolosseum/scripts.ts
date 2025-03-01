export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	init() {
		this.modData("Learnsets", "swablu").learnset.willowisp = ["9L1"];
		this.modData("Learnsets", "swablu").learnset.bodypress = ["9L1"];
		this.modData("Learnsets", "swablu").learnset.encore = ["9L1"];
		this.modData("Learnsets", "slugma").learnset.surginglava = ["9L1"];
		delete this.modData('Learnsets', 'slugma').learnset.lightscreen;
		delete this.modData('Learnsets', 'slugma').learnset.reflect;
		this.modData("Learnsets", "gastly").learnset.drainingkiss = ["9L1"];
		this.modData("Learnsets", "gastly").learnset.psychicnoise = ["9L1"];
		delete this.modData('Learnsets', 'gastly').learnset.energyball;
		delete this.modData('Learnsets', 'gastly').learnset.dazzlinggleam;
		delete this.modData('Learnsets', 'gastly').learnset.nastyplot;
		this.modData("Learnsets", "sprigatito").learnset.flowertrick = ["9L1"];
		this.modData("Learnsets", "sprigatito").learnset.knockoff = ["9L1"];
		this.modData("Learnsets", "meowthgalar").learnset.slackoff = ["9L1"];
		this.modData("Learnsets", "tepig").learnset.slackoff = ["9L1"];
		this.modData("Learnsets", "tepig").learnset.earthquake = ["9L1"];
		this.modData("Learnsets", "tepig").learnset.highhorsepower = ["9L1"];
		this.modData("Learnsets", "tepig").learnset.stealthrock = ["9L1"];
		this.modData("Learnsets", "dreepy").learnset.willowisp = ["9L1"];
		this.modData("Learnsets", "dreepy").learnset.dragonclaw = ["9L1"];
		this.modData("Learnsets", "dreepy").learnset.uturn = ["9L1"];
		this.modData("Learnsets", "dreepy").learnset.hex = ["9L1"];
		this.modData("Learnsets", "dreepy").learnset.psychicfangs = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.spark = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.thunder = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.thunderbolt = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.discharge = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.voltswitch = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.poisonjab = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.acidspray = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.clearsmog = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.sludgebomb = ["9L1"];
		this.modData("Learnsets", "toxel").learnset.slackoff = ["9L1"];
		this.modData("Learnsets", "fletchling").learnset.flamethrower = ["9L1"];
		this.modData("Learnsets", "fletchling").learnset.fireblast = ["9L1"];
		delete this.modData('Learnsets', 'fletchling').learnset.bravebird;
		this.modData("Learnsets", "spoink").learnset.ancientpower = ["9L1"];
		this.modData("Learnsets", "spoink").learnset.meteorbeam = ["9L1"];
		delete this.modData('Learnsets', 'cutiefly').learnset.calmmind;
		delete this.modData('Learnsets', 'cutiefly').learnset.psychic;
		delete this.modData('Learnsets', 'cutiefly').learnset.quiverdance;
		this.modData("Learnsets", "cutiefly").learnset.tailglow = ["9L1"];
		this.modData("Learnsets", "shieldon").learnset.bodypress = ["9L1"];
		this.modData("Learnsets", "shieldon").learnset.slackoff = ["9L1"];
		this.modData("Learnsets", "wooper").learnset.icepunch = ["9L1"];
		this.modData("Learnsets", "wooper").learnset.poisonjab = ["9L1"];
		this.modData("Learnsets", "corphish").learnset.flipturn = ["9L1"];
		this.modData("Learnsets", "jangmoo").learnset.takeheart = ["9L1"];
		this.modData("Learnsets", "jangmoo").learnset.heartswap = ["9L1"];
		this.modData("Learnsets", "jangmoo").learnset.drainingkiss = ["9L1"];
		this.modData("Learnsets", "jangmoo").learnset.playrough = ["9L1"];
		this.modData("Learnsets", "jangmoo").learnset.slackoff = ["9L1"];
		delete this.modData('Learnsets', 'cetoddle').learnset.iciclespear;
		delete this.modData('Learnsets', 'cetoddle').learnset.earthquake;
		delete this.modData('Learnsets', 'cetoddle').learnset.superpower;
		delete this.modData('Learnsets', 'cetoddle').learnset.knockoff;
		this.modData("Learnsets", "cetoddle").learnset.rapidspin = ["9L1"];
		this.modData("Learnsets", "mareep").learnset.bodypress = ["9L1"];
		this.modData("Learnsets", "mareep").learnset.gigadrain = ["9L1"];
		this.modData("Learnsets", "mareep").learnset.worryseed = ["9L1"];
		this.modData("Learnsets", "mareep").learnset.slackoff = ["9L1"];
		this.modData("Learnsets", "eevee").learnset.muddywater = ["9L1"];
		this.modData("Learnsets", "eevee").learnset.voltswitch = ["9L1"];
		this.modData("Learnsets", "eevee").learnset.flamewheel = ["9L1"];
		this.modData("Learnsets", "eevee").learnset.psyshock = ["9L1"];
		this.modData("Learnsets", "eevee").learnset.bulletseed = ["9L1"];
		this.modData("Learnsets", "eevee").learnset.icywind = ["9L1"];
	},
	pokemon: {
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
			if (message) {
				if (notImmune === null) {
					this.battle.add('-immune', this, '[from] ability: ' + this.getAbility().name);
				} else {
					this.battle.add('-immune', this);
				}
			}
			return false;
		},
		isGrounded(negateImmunity = false) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
			if (
				(this.hasAbility(['levitate', 'hover'])) &&
				!this.battle.suppressingAbility(this)
			) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return item !== 'airballoon';
		},
	},
};
