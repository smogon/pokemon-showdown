var fs = require('fs');

global.rhcApp = {
	running : 0,
	runapp : function(){
		if( this.running ) return false;
		require('./app.js');
		this.running = 1;
		return true;
	},
	writefilesync : function(from, to){
		try {
			var buff = fs.readFileSync( from );
			fs.writeFileSync( to , buff );
		} catch(e){
			return e;
		}
	},
	writefile : function (from, to) {
		fs.readFile( from , function( err, data ){
			if( err ) {
				console.log('Error in reading file : ' + err );
				return;
			}
			fs.writeFile( to , data , function(err){
				if( err ){
					console.log('Error in writing file : ' + err );
					return;
				}
			});
		});
	},
	setupwatch : function( from, to ){
		fs.watchFile( from , function (curr, prev) {
			if (curr.mtime <= prev.mtime) return;
			try {
				this.writefile( from, to );
			} catch (err) {
				console.log('Error in writing file(watcher) : ' + err );
				return;
			}
		}.bind(this) );
	}
};
var ddir = process.env['OPENSHIFT_DATA_DIR'];

rhcApp.writefilesync( ddir + 'usergroups.csv', 'config/usergroups.csv');
rhcApp.writefilesync( ddir + 'chatrooms.json', 'config/chatrooms.json');
rhcApp.writefilesync( ddir + 'config.js', 'config/config.js');
rhcApp.writefilesync( ddir + 'custom.css', 'config/custom.css');

rhcApp.setupwatch( 'config/usergroups.csv', ddir + 'usergroups.csv');
rhcApp.setupwatch( 'config/chatrooms.json', ddir + 'chatrooms.json');
rhcApp.setupwatch( ddir + 'custom.css', 'config/custom.css');


rhcApp.runapp();