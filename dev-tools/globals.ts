interface AnyObject {[k: string]: any}

let Config = require('../config/config');

let Monitor = require('../monitor');

let Dex = require('../sim/dex');
let toId = Dex.toId;
// let Sim = require('../sim');

let LoginServer = require('../loginserver');
let Ladders = (Config.remoteladder ? '../ladders-remote' : '../ladders');
let Users = require('../users');
type Connection = any;
type User = any;

let Punishments = require('../punishments');
let Chat = require('../chat');
let Rooms = require('../rooms');
type Room = any;
type GlobalRoom = any;
type BattleRoom = any;
type ChatRoom = any;

let Verifier = require('../verifier');
let Dnsbl = require('../dnsbl');
let Sockets = require('../sockets');
let TeamValidator = require('../team-validator');
