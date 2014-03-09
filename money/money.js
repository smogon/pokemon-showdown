 /**
 *                                                     About
 * Main Helpers: Davandi[bandi](outline (1.0-1.1)), Slayer95(HUGE HELP: Roulette,Money-Saving(1.0)), and EliteFive(tons of New items, bug fixes(1.0))
 * Contributors: Piiiikachuuu(help setting 1.0 up(1.0)), Cosy(Retired helper, tons of functions/commands(1.0))
 * Shoutouts: Orivexes(Original money mod and letting me use his ideas)
 */
 
 /*********************************************************
 * Money Functions                                        *
 *********************************************************/
exports.money = function(m) {
  if (typeof m != "undefined") var money = m; else var money = new Object();
   var usermoney = {};
   var usertkts = {};
   var userwealth = usermoney;

var Moneystuff = {
    importtkts: function(uid) {
                                var data = fs.readFileSync('./config/usertkts.csv','utf8');
                                var match = false;
                                var tkts = 0;
                                var row = (''+data).split("\n");
                                var line = '';
                                for (var i = row.length; i > -1; i--) {
                                        if (!row[i]) continue;
                                        var parts = row[i].split(",");
                                        var userid = toUserid(parts[0]);
                                        if (uid.userid == userid) {
                                                var x = Number(parts[1]);
                                                var tkts = x;
                                                match = true;
												uid.bp.tkts = tkts;                                                if (match === true) {
                                                        line = line + row[i];
                                                        break;
                                                }
                                        }
                                }
                                return true;
                                },
    importmoney: function(uid) {
                                var data = fs.readFileSync('./config/userwealth.csv','utf8');
                                var match = false;
                                var money = 0;
                                var row = (''+data).split("\n");
                                var line = '';
                                for (var i = row.length; i > -1; i--) {
                                        if (!row[i]) continue;
                                        var parts = row[i].split(",");
                                        var userid = toUserid(parts[0]);
                                        if (uid.userid == userid) {
                                                var x = Number(parts[1]);
                                                var money = x;
                                                match = true;
												uid.bp.dollars = money;
                                                if (match === true) {
                                                        line = line + row[i];
                                                        break;
                                                }
                                        }
                                }
                                return true;
},
	exportmoney: function(uid){
	var data = fs.readFileSync('./config/userwealth.csv','utf8')
	var row = (''+data).split("\n"); 
	var match = false;
    var line = '';
                                for (var i = row.length; i > -1; i--) {
                                        if (!row[i]) continue;
                                        var parts = row[i].split(",");
                                        var userid = toUserid(parts[0]);
                                        if (uid.userid == userid) {
                                                var x = Number(parts[1]);
                                                var money = x;
                                                match = true;
                                                if (match === true) {
                                                        line = line + row[i];
                                                        break;
                                                }
                                        }
								}
								if (match === true) {
                                        var re = new RegExp(line,"g");
                                        fs.readFile('./config/userwealth.csv', 'utf8', function (err,data) {
                                        if (err) {
                                                return console.log(err);
                                        }
                                        var result = data.replace(re, uid.userid+','+uid.bp.dollars);
                                        fs.writeFile('./config/userwealth.csv', result, 'utf8', function (err) {
                                                if (err) return console.log(err);
                                        });
                                        });
										}
										else {
     var log = fs.createWriteStream('./config/userwealth.csv', {'flags': 'a'});
     log.write("\n"+uid.userid+','+uid.bp.dollars);
     money.importmoney(uid)	
	 }
    },
	exporttkts: function(uid){
    var data = fs.readFileSync('./config/usertkts.csv','utf8')
	var row = (''+data).split("\n"); 
	var match = false;
    var line = '';
                                for (var i = row.length; i > -1; i--) {
                                        if (!row[i]) continue;
                                        var parts = row[i].split(",");
                                        var userid = toUserid(parts[0]);
                                        if (uid.userid == userid) {
                                                var x = Number(parts[1]);
                                                var money = x;
                                                match = true;
                                                if (match === true) {
                                                        line = line + row[i];
                                                        break;
                                                }
                                        }
								}
								if (match === true) {
                                        var re = new RegExp(line,"g");
                                        fs.readFile('./config/usertkts.csv', 'utf8', function (err,data) {
                                        if (err) {
                                                return console.log(err);
                                        }
                                        var result = data.replace(re, uid.userid+','+uid.bp.tkts);
                                        fs.writeFile('./config/usertkts.csv', result, 'utf8', function (err) {
                                                if (err) return console.log(err);
                                        });
                                        });
										}
										else {
     var log = fs.createWriteStream('./config/usertkts.csv', {'flags': 'a'});
     log.write("\n"+uid.userid+','+uid.bp.tkts);
     money.importtkts(uid)	
	 }
    },
	started: false,//money.settings.isOn,
	//item functions .3.
	shop: require('./shop.js').shop,
	settings: require('./settings.js'),
	checkItem: function(target){
	if(money.shop[target] !== undefined) return true
	else return false;
	},
	alltkts: usertkts,
	allmoney: usermoney,
		reset: function(){
		for(var i in Users.users){
		Users.users[i].money = 0;
		Users.users[i].tkts = 0;
		money.save(Users.users[i]);
		Users.users[i].popup('Money was erased by ' + user.name)
		}
		},
		read: function(user){
		money.importmoney(user);
        money.importtkts(user);
		},
        cmds: require('./cmds.js').cmds, 		
		save: function(user){
		money.exportmoney(user);
		money.exporttkts(user);
		}
	};
	Object.merge(CommandParser.commands, Moneystuff.cmds);
	    Object.merge(money, Moneystuff);
	    return money;
        };
		Users.User.prototype.bp = {
		dollars: 50,
		tkts: 5,
		points: 1,
		coins: 0,
		roulawards:[];
		}
