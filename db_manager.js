/***
* Database management Modules.
* @author codelegend
* These modules though written for Heroku,
* can be used on any server. Just install postgres, and set up a database,
* and store the url below.
* SQL SERVER : PSQL.
**/
var fs = require('fs');
var needle = require('needle');

/***************************************************
 *	Heroku PSQL Database Manager
 *  
 * functions on promote/demote (global) are in users.js : 'setGroup'
 *  TABLE : users
 *		name    : string
 *		groupid : char
 *****************************************************
 * functions on room promote/demote are in commands.js : 'roompromote'
 * TABLE : roomauth
 *		name : string
 *		groupid : char
 *		room : string  
*****************************************************/
var HerokuDatabase = (function() {
	
	function HerokuDatabase(){
		if(!Config.HerokuDB) return;
		this.DB_URL = process.env.DATABASE_URL;
		
		this.Initialize();
	}
	HerokuDatabase.prototype.dbtype = 'heroku';
	
	HerokuDatabase.prototype.Initialize = function(){
		try {
			this.initUserlists();
		} catch(e) {
			console.log('User lists and roomauth not set');
		}
		
		try {
			this.loadNumBattles();
		} catch(e) {
			console.log('Last battle num not loaded. Fix bug and restart the server');
		}
	};
	
	/***************************
	* Read functions 
	***************************/
	HerokuDatabase.prototype.initUserlists = function(){
		if(!Config.HerokuDB) return;
		var pgdb = require('pg');
		var self = this;
		pgdb.connect( this.DB_URL , function(err, client, done){
			if(err){
				console.log('Not connected to pgdb (userdb)'+err);
				return;
			}
			
			var userlist = client.query('SELECT * FROM USERS'),
				roomlist = client.query('SELECT * FROM ROOMAUTH');
			
			userlist.on('row',function(user){
				Users.usergroups[ toId(user.name) ] = user.groupid+toId(user.name);
			});
			roomlist.on('row', function(user){
				if( user.room === 'lobby' || user.room === 'global' || !Rooms.get(user.room) ) return;
				var room = Rooms.get(user.room);
				if (!room.auth) room.auth = {};
				room.auth[ toId(user.name) ] = user.groupid;
			});
			userlist.on('end',function(){
				roomlist.on('end',function(){
					done();
				});
			});
		});
	};
	HerokuDatabase.prototype.loadNumBattles = function(){
		if(!Config.HerokuDB) return;
		var pgdb = require('pg');
		pgdb.connect(this.DB_URL, function(err, client, done){
			if(err){
				console.log('error while reading num rooms');
				return;
			}
			var query = client.query('SELECT * FROM LASTBATTLE');
			query.on('row',function(row){
				var num = parseInt(row.num) || 1;
				if( !global.Rooms || !Rooms.global ){
					setTimeout( function(){
						Rooms.global.lastBattle = num;
					}, 20*1000);
				}
				Rooms.global.lastBattle = num;
			});
			query.on( 'end', function(){done();} );
		});
	};
	
	/***************************
	* Write/update functions 
	***************************/
	HerokuDatabase.prototype.UpdateUserTable = function(name,group,room){
		if(!Config.HerokuDB) return;
		/********************************************
		*	this function updates the user tables,
		* namely USERS and ROOMAUTH.
		* 
		* if (room) is passed, then ROOMAUTH is updated,
		* else USERS is updated.
		*
		* if (group) is passed , then user's group is set to that group,
		* else, user is removed from the table.
		*********************************************/
		name = toId(name); if(room) room= toId(room);
		
		var pgdb = require('pg');
		var self=this;
		pgdb.connect( this.DB_URL , function(err,client,done){
			if(err){
				console.log('User table not updated'+ err);
				return;
			}
			if(room){
				var delquery = client.query( 'DELETE FROM ROOMAUTH WHERE NAME = $1 AND ROOM = $2' ,[name,room] );
				delquery.on('end', function(){
					if(group) 
						client.query( 'INSERT INTO ROOMAUTH (NAME,GROUPID,ROOM) VALUES ($1,$2,$3)' ,[name,group,room] )
							.on('end', function(){ done(); }) ;
						else done();
				});
			} else {
				var delquery = client.query( 'DELETE FROM USERS WHERE NAME = $1' ,[name] );
				delquery.on('end', function(){
					if(group)
						client.query( 'INSERT INTO USERS (NAME,GROUPID) VALUES ($1,$2)' ,[name,group] )
							.on('end', function(){ done(); }) ;
					else done();
				});
			}
		});
	
	};
	
	HerokuDatabase.prototype.logNumBattles = function( lastBattle ){
		if(!Config.HerokuDB) return;
		var pgdb = require('pg');
		pgdb.connect(this.DB_URL, function(err, client, done){
			if(err){
				console.log('error while writing num battles');
				return;
			}
			client.query('UPDATE LASTBATTLE SET NUM='+lastBattle)
			.on( 'end', function(){done();} );
		});
	};
	
	HerokuDatabase.prototype.makeQuery = function( querystring,output ){
		if(!Config.HerokuDB) return;
		if(!querystring) return '';
		var pgdb = require('pg');
		var self=this;
		pgdb.connect(this.DB_URL, function(err, client, done){
			if(err){
				console.log('error');
				return;
			}
			var query = client.query(querystring);
			var res = [];
			query.on('row',function(row){
				res.push(row);
			});
			query.on('end',function(row){
				if(output) output.sendReply( JSON.stringify(res) );
				done();
			});
		});
	};
	return HerokuDatabase;
})();

// to load rooms, if chatrooms.json is downloaded after server start.
Rooms.GlobalRoom.prototype.readChatRooms = function(){
	var addrooms = [];
	try{
		addrooms = JSON.parse(fs.readFileSync('config/chatrooms.json'));
		if (!Array.isArray(addrooms)) addrooms = [];
	} catch(e){
		addrooms = [];
	}
	for (var i = 0; i < addrooms.length; i++) {
		if (!addrooms[i] || !addrooms[i].title) {
			console.log('ERROR: Room number ' + i + ' has no data.');
			continue;
		}
		var id = toId(addrooms[i].title);
		if( (id == 'lobby'|| id == 'staff') && Rooms.rooms[id] ){
			console.log("setting "+id+" data");
			Rooms.rooms[id].introMessage = Rooms.rooms[id].chatRoomData.introMessage= addrooms[i].introMessage || '';
			Rooms.rooms[id].desc = Rooms.rooms[id].chatRoomData.desc = addrooms[i].desc || '';
		}
		if( Rooms.rooms[id] )continue;
		this.chatRoomData.push(addrooms[i]);
		console.log("NEW CHATROOM: " + id);
		var room = Rooms.rooms[id] = new Rooms.ChatRoom(id, addrooms[i].title, addrooms[i]);
		this.chatRooms.push(room);
		if (room.autojoin) this.autojoin.push(id);
		if (room.staffAutojoin) this.staffAutojoin.push(id);
	}
	if( Config.HerokuDB ){
		DatabaseManager.Heroku.initUserlists();
	}
};

// This module can be used anywhere(not only on Heroku )

var fileStorage = (function(){
	function fileStorage(){
		// links and file data.
		// if not using on heroku, then change the db_url.
		this.DB_URL = process.env.DATABASE_URL;
		this.fileurls = {};
		this.customavatars = {};
		
		try {
			this.loadUrls();// only for PostGreSQL database.
		} catch(e){
			this.fileurls = {};
			this.customavatars = {};
		}
		
		// set the chatroom upload interval:
		this.chatRoomUploader = setInterval( function(){
			this.uploadChatRooms();
		}.bind(this) , 60*60*1000 );
		
	}
	fileStorage.prototype.dbtype = 'http';
	
	fileStorage.prototype.loadUrls = function(){
		// initialises all file urls. 
		var self = this;
		require('pg').connect(this.DB_URL, function(err, client, done){
			if(err){
				console.log('error in loading urls for filestorage');
				return;
			}
			var query = client.query('SELECT * FROM FILEURLS');
			var avatars = client.query(' SELECT * FROM AVATARS ');
			query.on('row',function(row){
				self.fileurls[ row.type ] = row.link;
			});
			avatars.on('row',function(row){
				self.customavatars[ row.userid ] = row.link;
			});
			query.on('end',function(row){
				self.loadChatRooms();
				self.loadOtherFiles('all');
				avatars.on('end', function(row){
					self.loadCustomAvatars();
					done();
				});
			});
		});
	};
	
	/**************************
	* Functions to dynamically upload/download files.
	**************************/
	// never call this function with improper input.
	fileStorage.prototype.downloadFile = function( url, savedir, output, callback){
		/**
		* downloads file from @url and saves it to location @savedir.
		* @output can be a user object, and sendReply() is called if needed.
		* @callback : called after processing ; @params - status, error/response/message.
		**/
		if( !url ) return;
		var http = require('http') , self = this;
		var req = http.get( url ,function(res){
			var data = '';
			res.on('data', function(chunk) {
				data += chunk;
			});
			res.on('end', function(){
				fs.writeFile(savedir, data , function(err){
					if(err){
						callback('error',err);
						return;
					}
					callback('success');
				});
			});
		});
		req.on('error' , function(err){
			callback('error',err);
			return;
		});
	};
	fileStorage.prototype.uploadToHastebin = function(toUpload, output, callback ){
		/**
		* uploads @toUpload to hastebin.
		* @output can be a user object, and sendReply() is called with the link of upload.
		* @callback : called after processing ; @params - link : the raw hastebin http link to the file.
		**/
		var reqOpts = {
			hostname: "hastebin.com",
			method: "POST",
			path: '/documents'
		};
		var http = require('http');
		var req = http.request(reqOpts, function(res) {
			res.on('data', function(chunk) {
				var key = JSON.parse(chunk.toString())['key'];
				var link = "http://hastebin.com/raw/" + key;
				if( output && output.sendReply ) output.sendReply( link );
				if( callback) callback(link);// callback, send the link
			});
		});
	
		req.write(toUpload);
		req.end();
		return;
	};
	fileStorage.prototype.loadPicture = function( link , savedir){
		/**
		* loads a picture from @link and saves it to @savedir
		**/
		if( !link ) return;
		var out = fs.createWriteStream( savedir );
		needle.get( link ).pipe(out);
	};
	
	/****************************************
	*Custom functions : for specific file loads.
	***************************************/
	fileStorage.prototype.loadChatRooms = function(output){
		var url = this.fileurls['chatrooms'];
		if(!url){
			if(output && output.sendReply) output.sendReply("NO URL SET TO READ CHATROOMS");
			console.log("NO URL SET TO READ CHATROOMS");
			return;
		}
		this.downloadFile( url, 'config/chatrooms.json', null, function(status,resp){
			if( status === 'success')
				Rooms.global.readChatRooms();
			else console.log('Chat rooms not loaded');
		});
		
	};
	fileStorage.prototype.uploadChatRooms = function(output){
		var toUpload = JSON.stringify(Rooms.global.chatRoomData).replace(/\{"title"\:/g, '\n{"title":').replace(/\]$/, '\n]');
		
		this.uploadToHastebin( toUpload, output ,function(link){
			DatabaseManager.Heroku.makeQuery(" UPDATE FILEURLS SET LINK = '" + link +"' WHERE TYPE='chatrooms' ");
		});
		return;
	};
	
	fileStorage.prototype.loadOtherFiles = function( list , output){
		list = string(list);
		if( !list ) return;
		
		// Load IP bans.
		if( ( list.indexOf('ipbans')>=0 || list === 'all' ) && this.fileurls['ipbans'] ){
			this.downloadFile( this.fileurls['ipbans'], 'config/ipbans.txt' , output, function( status, resp ){
				if( status === 'error' )
					console.log('ipbans not loaded');
				else if( status === 'success' ){
					console.log('ipbans loaded');
					fs.readFile('./config/ipbans.txt', function (err, data) {
						if (err) return;
						data = ('' + data).split("\n");
						var rangebans = [];
						for (var i = 0; i < data.length; i++) {
							data[i] = data[i].split('#')[0].trim();
							if (!data[i]) continue;
							if (data[i].indexOf('/') >= 0) {
								rangebans.push(data[i]);
							} else if (!Users.bannedIps[data[i]]) {
								Users.bannedIps[data[i]] = '#ipban';
							}
						}
						Users.checkRangeBanned = Cidr.checker(rangebans);
					});
				}
			});
		}
		
		// load Config and CustomCSS
		if( ( list.indexOf('config')>=0 || list === 'all' ) && this.fileurls['config']  ){
			this.downloadFile( this.fileurls['config'], 'config/config.js' , output, function( status, resp ){
				if( status === 'error' ){
					console.log('config.js not loaded');
					return;
				}
			});
		}
		if( ( list.indexOf('customcss')>=0 || list === 'all' ) && this.fileurls['customcss'] ){
			this.downloadFile( this.fileurls['customcss'], 'config/custom.css' , output, function( status, resp ){
				if( status === 'error' ){
					console.log('custom css not loaded');
					return;
				}
			});
		}
		
		// load custom commands if any.
		if( ( list.indexOf('customcommands')>=0 || list === 'all' ) && this.fileurls['customcommands'] ){
			this.downloadFile( this.fileurls['customcommands'], 'chat-plugins/customcommands.js' , output, function( status, resp ){
				if( status === 'error' )
					console.log('customcommands not loaded');
				else if( status === 'success' ){
					console.log('customcommands loaded');
					try {
						CommandParser.uncacheTree('./command-parser.js');
						global.CommandParser = require('./command-parser.js');

						var runningTournaments = Tournaments.tournaments;
						CommandParser.uncacheTree('./tournaments');
						global.Tournaments = require('./tournaments');
						Tournaments.tournaments = runningTournaments;
						return;
					} catch (e) {
						console.log('Error while hotpatching command-parser ');
						return;
					}
				}
			});
		}
	};
	
	fileStorage.prototype.loadCustomAvatars = function(output){
		if( !this.customavatars ) return;
		
		for( var id in this.customavatars ){
			var ext = toId( this.customavatars[id].split('.').pop() );
			var save = Config.customavatars[id] = id + '.' + ext;
			this.loadPicture( this.customavatars[id], './config/avatars/'+save );
		}
	};
	return fileStorage;
})();


exports.Heroku = new HerokuDatabase();
exports.files = new fileStorage();
