exports.BattleScripts = {
/** MAKE EVERY POKEMON HAVE ILLUSION **/	
	init: function() {
		for (var i in this.data.Pokedex) {
		this.modData('Pokedex').abilities['DW'] = 'Illusion';
		this.modData('Pokedex').abilities['0'] = 'Illusion';
		this.modData('Pokedex').abilities['1'] = 'Illusion';		
		},
	}
                        for (var i in this.data.Learnsets) {
                                if (i in normal) {
                                        this.modData('Learnsets', i).learnset.extremespeed = ['5L0'];
                                        this.modData('Learnsets', i).learnset.hypervoice = ['5L0'];
                                        this.modData('Learnsets', i).learnset.whirlwind = ['5L0'];
                                        this.modData('Learnsets', i).learnset.rapidspin = ['5L0'];
                                        
                                        //also every other normal move... let's hope that "Movedex" is the right object
                                        for (var j in this.data.Movedex) {
                                        	if (this.data.Movedex[j].type == "Normal") {
                                        		this.modData('Learnsets', i).learnset[j] = ['5L0'];
                                        	}
                                        }
                                        
                                } else if (i in fire) {
                                        this.modData('Learnsets', i).learnset.flareblitz = ['5L0'];
                                        this.modData('Learnsets', i).learnset.fireblast = ['5L0'];
                                        this.modData('Learnsets', i).learnset.willowisp = ['5L0'];
                                        this.modData('Learnsets', i).learnset.flamecharge = ['5L0'];
                                } else if (i in grass) {
                                        this.modData('Learnsets', i).learnset.woodhammer = ['5L0'];
                                        this.modData('Learnsets', i).learnset.leafstorm = ['5L0'];
                                        this.modData('Learnsets', i).learnset.leechseed = ['5L0'];
                                        this.modData('Learnsets', i).learnset.bulletseed = ['5L0'];
                                } else if (i in water) {
                                        this.modData('Learnsets', i).learnset.waterfall = ['5L0'];
                                        this.modData('Learnsets', i).learnset.surf = ['5L0'];
                                        this.modData('Learnsets', i).learnset.soak = ['5L0'];
                                        this.modData('Learnsets', i).learnset.aquajet = ['5L0'];
                                } else if (i in electric) {
                                        this.modData('Learnsets', i).learnset.wildcharge = ['5L0'];
                                        this.modData('Learnsets', i).learnset.thunderbolt = ['5L0'];
                                        this.modData('Learnsets', i).learnset.thunderwave = ['5L0'];
                                        this.modData('Learnsets', i).learnset.voltswitch = ['5L0'];
                                } else if (i in ground) {
                                        this.modData('Learnsets', i).learnset.earthquake = ['5L0'];
                                        this.modData('Learnsets', i).learnset.earthpower = ['5L0'];
                                        this.modData('Learnsets', i).learnset.spikes = ['5L0'];
                                        this.modData('Learnsets', i).learnset.bonemerang = ['5L0'];
                                } else if (i in poison) {
                                        this.modData('Learnsets', i).learnset.gunkshot = ['5L0'];
                                        this.modData('Learnsets', i).learnset.sludgewave = ['5L0'];
                                        this.modData('Learnsets', i).learnset.toxicspikes = ['5L0'];
                                        this.modData('Learnsets', i).learnset.coil = ['5L0'];
                                } else if (i in bug) {
                                        this.modData('Learnsets', i).learnset.megahorn = ['5L0'];
                                        this.modData('Learnsets', i).learnset.bugbuzz = ['5L0'];
                                        this.modData('Learnsets', i).learnset.quiverdance = ['5L0'];
                                        this.modData('Learnsets', i).learnset.uturn = ['5L0'];
                                } else if (i in ice) {
                                        this.modData('Learnsets', i).learnset.iciclecrash = ['5L0'];
                                        this.modData('Learnsets', i).learnset.icebeam = ['5L0'];
                                        this.modData('Learnsets', i).learnset.haze = ['5L0'];
                                        this.modData('Learnsets', i).learnset.iceshard = ['5L0'];
                                } else if (i in fighting) {
                                        this.modData('Learnsets', i).learnset.hijumpkick = ['5L0'];
                                        this.modData('Learnsets', i).learnset.aurasphere = ['5L0'];
                                        this.modData('Learnsets', i).learnset.bulkup = ['5L0'];
                                        this.modData('Learnsets', i).learnset.drainpunch = ['5L0'];
                                } else if (i in psychic) {
                                        this.modData('Learnsets', i).learnset.zenheadbutt = ['5L0'];
                                        this.modData('Learnsets', i).learnset.psychic = ['5L0'];
                                        this.modData('Learnsets', i).learnset.trickroom = ['5L0'];
                                        this.modData('Learnsets', i).learnset.cosmicpower = ['5L0'];
                                } else if (i in flying) {
                                        this.modData('Learnsets', i).learnset.bravebird = ['5L0'];
                                        this.modData('Learnsets', i).learnset.hurricane = ['5L0'];
                                        this.modData('Learnsets', i).learnset.tailwind = ['5L0'];
                                        this.modData('Learnsets', i).learnset.airslash = ['5L0'];
                                } else if (i in rock) {
                                        this.modData('Learnsets', i).learnset.stoneedge = ['5L0'];
                                        this.modData('Learnsets', i).learnset.paleowave = ['5L0'];
                                        this.modData('Learnsets', i).learnset.stealthrock = ['5L0'];
                                        this.modData('Learnsets', i).learnset.rockblast = ['5L0'];
                                } else if (i in ghost) {
                                        this.modData('Learnsets', i).learnset.shadowstrike = ['5L0'];
                                        this.modData('Learnsets', i).learnset.shadowball = ['5L0'];
                                        this.modData('Learnsets', i).learnset.destinybond = ['5L0'];
                                        this.modData('Learnsets', i).learnset.nightshade = ['5L0'];
                                } else if (i in dark) {
                                        this.modData('Learnsets', i).learnset.crunch = ['5L0'];
                                        this.modData('Learnsets', i).learnset.darkpulse = ['5L0'];
                                        this.modData('Learnsets', i).learnset.nastyplot = ['5L0'];
                                        this.modData('Learnsets', i).learnset.fling = ['5L0'];
                                } else if (i in steel) {
                                        this.modData('Learnsets', i).learnset.ironhead = ['5L0'];
                                        this.modData('Learnsets', i).learnset.flashcannon = ['5L0'];
                                        this.modData('Learnsets', i).learnset.autotomize = ['5L0'];
                                        this.modData('Learnsets', i).learnset.geargrind = ['5L0'];
                                } else if (i in dragon) {
                                        this.modData('Learnsets', i).learnset.outrage = ['5L0'];
                                        this.modData('Learnsets', i).learnset.dracometeor = ['5L0'];
                                        this.modData('Learnsets', i).learnset.dragondance = ['5L0'];
                                        this.modData('Learnsets', i).learnset.dragontail = ['5L0'];
                                }
                        }
        }	
};
