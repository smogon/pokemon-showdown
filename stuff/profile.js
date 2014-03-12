/*
* Profile created by CreaturePhil
* Uses a whole lot of i/o with csv files
*/


var profile = exports.profile = {
		readMoney: function(targetUser){
			var money = 0;
			var match = false;

	    	var data = fs.readFileSync('config/money.csv','utf8');

	        var row = (''+data).split("\n");
	        for (var i = row.length; i > -1; i--) {
	                if (!row[i]) continue;
	                var parts = row[i].split(",");
	                var userid = toUserid(parts[0]);
	                if (targetUser.userid == userid) {
	                	var x = Number(parts[1]);
	                    var money = x;
	                    match = true;
	                    if (match === true) {
	                            break;
	                    }
	                }
	        }
	        targetUser.money = money; 
	        var pokeDollar = '<i>Money:</i> ' + '<img src="http://cdn.bulbagarden.net/upload/8/8c/Pok%C3%A9monDollar.png" title="PokeDollar">' + targetUser.money;
	        return pokeDollar;
		},
		readStatus: function(targetUser){
			var status = '';
			var match = false;

	    	var data = fs.readFileSync('config/profile/status.csv','utf8');

	        var row = (''+data).split("\n");
	        for (var i = row.length; i > -1; i--) {
	                if (!row[i]) continue;
	                var parts = row[i].split(",");
	                var userid = toUserid(parts[0]);
	                if (targetUser.userid == userid) {
	                	status = String(parts[1]);
	                    match = true;
	                    if (match === true) {
	                            break;
	                    }
	                }
	        }
	        targetUser.status = status;
	        return targetUser.status;
		},
		writeStatus: function(uid, info) {
			var data = fs.readFileSync('config/profile/status.csv','utf8')
			var match = false;
			var status = '';
			var row = (''+data).split("\n");
			var line = '';
			for (var i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				var parts = row[i].split(",");
				var userid = toUserid(parts[0]);
				if (uid.userid == userid) {
					var status = parts[1];
					match = true;
					if (match === true) {
						line = line + row[i];
						break;
					}
				}
			}
			uid.status = String(info);
			if (match === true) {
				var re = new RegExp(line,"g");
				fs.readFile('config/profile/status.csv', 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var result = data.replace(re, uid.userid+','+uid.status);
				fs.writeFile('config/profile/status.csv', result, 'utf8', function (err) {
					if (err) return console.log(err);
				});
				});
			} else {
				var log = fs.createWriteStream('config/profile/status.csv', {'flags': 'a'});
				log.write("\n"+uid.userid+','+uid.status);
			}
		},
		readGender: function(targetUser){
			var gender = '';
			var match = false;

	    	var data = fs.readFileSync('config/profile/gender.csv','utf8');

	        var row = (''+data).split("\n");
	        for (var i = row.length; i > -1; i--) {
	                if (!row[i]) continue;
	                var parts = row[i].split(",");
	                var userid = toUserid(parts[0]);
	                if (targetUser.userid == userid) {
	                	gender = String(parts[1]);
	                    match = true;
	                    if (match === true) {
	                            break;
	                    }
	                }
	        }
	        targetUser.gender = gender;
	        return targetUser.gender;
		},
		writeGender: function(uid, info) {
			var data = fs.readFileSync('config/profile/gender.csv','utf8')
			var match = false;
			var gender = '';
			var row = (''+data).split("\n");
			var line = '';
			for (var i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				var parts = row[i].split(",");
				var userid = toUserid(parts[0]);
				if (uid.userid == userid) {
					var gender = parts[1];
					match = true;
					if (match === true) {
						line = line + row[i];
						break;
					}
				}
			}
			uid.gender = String(info);
			if (match === true) {
				var re = new RegExp(line,"g");
				fs.readFile('config/profile/gender.csv', 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var result = data.replace(re, uid.userid+','+uid.gender);
				fs.writeFile('config/profile/gender.csv', result, 'utf8', function (err) {
					if (err) return console.log(err);
				});
				});
			} else {
				var log = fs.createWriteStream('config/profile/gender.csv', {'flags': 'a'});
				log.write("\n"+uid.userid+','+uid.gender);
			}
		},
		readLocation: function(targetUser){
			var location = '';
			var match = false;

	    	var data = fs.readFileSync('config/profile/location.csv','utf8');

	        var row = (''+data).split("\n");
	        for (var i = row.length; i > -1; i--) {
	                if (!row[i]) continue;
	                var parts = row[i].split(",");
	                var userid = toUserid(parts[0]);
	                if (targetUser.userid == userid) {
	                	location = String(parts[1]);
	                    match = true;
	                    if (match === true) {
	                            break;
	                    }
	                }
	        }
	        targetUser.location = location;
	        return targetUser.location;
		},
		writeLocation: function(uid, info) {
			var data = fs.readFileSync('config/profile/location.csv','utf8')
			var match = false;
			var location = '';
			var row = (''+data).split("\n");
			var line = '';
			for (var i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				var parts = row[i].split(",");
				var userid = toUserid(parts[0]);
				if (uid.userid == userid) {
					var location = parts[1];
					match = true;
					if (match === true) {
						line = line + row[i];
						break;
					}
				}
			}
			uid.location = String(info);
			if (match === true) {
				var re = new RegExp(line,"g");
				fs.readFile('config/profile/location.csv', 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var result = data.replace(re, uid.userid+','+uid.location);
				fs.writeFile('config/profile/location.csv', result, 'utf8', function (err) {
					if (err) return console.log(err);
				});
				});
			} else {
				var log = fs.createWriteStream('config/profile/location.csv', {'flags': 'a'});
				log.write("\n"+uid.userid+','+uid.location);
			}
		},
		//still need to add badges and remove badges commands
		readBadges: function(targetUser){
			/*
			modified this to your liking. you can use numbers or letters to correspond to a badge or whatever you like.

			Badges:
			-----------
			1 - '<img src="http://i.imgur.com/5Dy544w.png" title="is a Super Moderator">' 
			2 - '<img src="http://i.imgur.com/oyv3aga.png" title="is a Developer">' 
			3 - '<img src="http://i.imgur.com/lfPYzFG.png" title="is a Server Host">' 
			4 - '<img src="http://i.imgur.com/oeKdHgW.png" title="is a Recruiter">'
			5 - '<img src="http://i.imgur.com/yPAXWE9.png" title="is a Tournament Director">'
			6 - '<img src="http://i.imgur.com/EghmFiY.png" title="is a Frequenter">'
			*/
			var badges = '';
			var key = '';
			var match = false;

	    	var data = fs.readFileSync('config/profile/badges.csv','utf8');

	        var row = (''+data).split("\n");
	        for (var i = row.length; i > -1; i--) {
	                if (!row[i]) continue;
	                var parts = row[i].split(",");
	                var userid = toUserid(parts[0]);
	                if (targetUser.userid == userid) {
	                	key = String(parts[1]);
	                	if (key.indexOf('1') >= 0) {
	                		badges += '<img src="http://i.imgur.com/5Dy544w.png" title="is a Staff Member">';
	                	}
	                	if (key.indexOf('2') >= 0) {
	                		badges += '<img src="http://i.imgur.com/oyv3aga.png" title="is a League Member">';
	                	}
	                	if (key.indexOf('3') >= 0) {
	                		badges += '<img src="http://i.imgur.com/lfPYzFG.png" title="is a Forum Contributor">'; 
	                	}
	                	if (key.indexOf('4') >= 0) {
	                		badges += '<img src="http://i.imgur.com/oeKdHgW.png" title="is a Recruiter">';
	                	}
	                	if (key.indexOf('5') >= 0) {
	                		badges += '<img src="http://i.imgur.com/yPAXWE9.png" title="is a League Owner">';
	                	}
	                	if (key.indexOf('6') >= 0) {
	                		badges += '<img src="http://i.imgur.com/EghmFiY.png" title="is a Frequenter">';
	                	}
	                	if (key.indexOf('7') >= 0) {
	                		badges += '<img src="http://www.smogon.com/media/forums/images/badges/cap.png.v.gc2i1VScALP9s1O_NiGEMA" title="is a Developer">';
	                	}
	                	if (key.indexOf('8') >= 0) {
	                		badges += '<img src="http://www.smogon.com/media/forums/images/badges/forummod.png.v.nRgelI1-z5_ec5gr9zV0-w" title="is the User of the Month">';
	                	}
	                	match = true;
						if (match === true) {
							break;
						}
	                }
	        }
	        targetUser.badges = badges;
	        return targetUser.badges;
		},
	}

const MAX_INFO_LENGTH = 30;
const MAX_LOC_LENGTH = 17;

var cmds = {
	profile: function(target, room, user) {
		if (!this.canBroadcast()) return;

		if (target.toLowerCase()==='moderation bot' || target.toLowerCase()==='mod bot') return this.sendReplyBox("I'm always watching.");

		var targetUser = this.targetUserOrSelf(target);
		if (!targetUser) return this.sendReply('User '+this.targetUsername+' not found.');
        
        var height = 80;
        var br = '<br/>';
        var avatar = '<img src="http://play.pokemonshowdown.com/sprites/trainers/' + targetUser.avatar + '.png' + '" align="left" height="' + height + '">';
        var customAvatar = '<img src="http://107.161.19.149:7000/avatars/' + targetUser.avatar + '" align="left" height="' + height + '">';
        var name = '<b><font size="3">' + targetUser.name + '</font></b>';
        var unregisteredName = '<b><font size="3">' + targetUser.name + '</b>(Unregistered)</font>';
        if (config.groups[targetUser.group] && config.groups[targetUser.group].name) {
			var group = '<font size="2">' + config.groups[targetUser.group].name + ' (' + targetUser.group + ')</font>';
		} else {
			var group = '<font size="2">Regular User</font>';
		}
		var info = profile.readStatus(targetUser) + ', ' + profile.readGender(targetUser) + ', <font color="gray">from</font> ' + profile.readLocation(targetUser);
		if (info === ', , <font color="gray">from</font> ') {
			info = 'Unknown';
		}

		var money = profile.readMoney(targetUser);
		var badges = '<i>Badges: </i>' + profile.readBadges(targetUser);
		if (badges === '<i>Badges: </i>') {
			badges = '<i>Badges: </i>None';
		}

		var display = avatar + name + br + group + br + info + br + money + br + badges;

		if (!targetUser.authenticated) {
			display = avatar + unregisteredName + br + group + br + info + br + money + br + badges;
			return this.sendReplyBox(display);
		} else if (typeof(targetUser.avatar) === typeof('')) { //checks for custom avatar
			display = customAvatar + name + br + group + br + info + br + money + br + badges;
			return this.sendReplyBox(display);
		} else {
			return this.sendReplyBox(display);
		}
	},

	status: function(target, room, user){
		if (!target) return this.sendReply('|raw|Correct Syntax: /status <i>description/information</i>');
		if (target.length > MAX_INFO_LENGTH) return this.sendReply('Status is too long.');
		if (target.indexOf(',') >= 1) return this.sendReply('Status cannot contain a comma.');
		profile.writeStatus(user, target);
		this.sendReply('Your status is now: ' + target);
	},

	gender: function(target, room, user){
		if (!target) return this.sendReply('|raw|Correct Syntax: /gender <i>Male</i> OR <i>Female</i>');
		if (target.toLowerCase() === 'male') {
			profile.writeGender(user, 'Male');
		} else if (target.toLowerCase() === 'female') {
			profile.writeGender(user, 'Female');
		} else {
			return this.sendReply('|raw|Correct Syntax: /gender <i>Male</i> OR <i>Female</i>');
		}
		this.sendReply('Your gender is now: ' + target);
	},

	location: function(target, room, user){
		if (!target) return this.sendReply('|raw|Correct Syntax: /location <i>location information</i>');
		if (target.length > MAX_LOC_LENGTH) return this.sendReply('Location is too long.');
		if (target.indexOf(',') >= 1) return this.sendReply('Location cannot contain a comma.');
		profile.writeLocation(user, target);
		this.sendReply('Your location is now: ' + target);
	},
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
