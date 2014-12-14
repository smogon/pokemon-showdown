/**
 * Core
 * Created by CreaturePhil - https://github.com/CreaturePhil
 *
 * This is where essential core infrastructure of
 * Pokemon Showdown extensions for private servers.
 * Core contains standard streams, profile infrastructure,
 * elo rating calculations, and polls infrastructure.
 *
 * @license MIT license
 */

var fs = require("fs");
var path = require("path");

var core = exports.core = {

    stdin: function (file, name) {
        var data = fs.readFileSync('config/' + file + '.csv', 'utf8').split('\n');

        var len = data.length;
        while (len--) {
            if (!data[len]) continue;
            var parts = data[len].split(',');
            if (parts[0].toLowerCase() === name) {
                return parts[1];
            }
        }
        return 0;
    },

    stdout: function (file, name, info, callback) {
        var data = fs.readFileSync('config/' + file + '.csv', 'utf8').split('\n');
        var match = false;

        var len = data.length;
        while (len--) {
            if (!data[len]) continue;
            var parts = data[len].split(',');
            if (parts[0] === name) {
                data = data[len];
                match = true;
                break;
            }
        }

        if (match === true) {
            var re = new RegExp(data, 'g');
            fs.readFile('config/' + file + '.csv', 'utf8', function (err, data) {
                if (err) return console.log(err);

                var result = data.replace(re, name + ',' + info);
                fs.writeFile('config/' + file + '.csv', result, 'utf8', function (err) {
                    if (err) return console.log(err);
                    typeof callback === 'function' && callback();
                });
            });
        } else {
            var log = fs.createWriteStream('config/' + file + '.csv', {
                'flags': 'a'
            });
            log.write('\n' + name + ',' + info);
            typeof callback === 'function' && callback();
        }
    },

    calculateElo: function (winner, loser) {
        if (winner === 0) winner = 1000;
        if (loser === 0) loser = 1000;
        var kFactor = 32;
        var ratingDifference = loser - winner;
        var expectedScoreWinner = 1 / (1 + Math.pow(10, ratingDifference / 400));

        var e = kFactor * (1 - expectedScoreWinner);
        winner = winner + e;
        loser = loser - e;

        var arr = [winner, loser];
        return arr;
    },

    ladder: function (limit) {
        var data = fs.readFileSync('config/elo.csv', 'utf-8');
        var row = ('' + data).split("\n");

        var list = [];

        for (var i = row.length; i > -1; i--) {
            if (!row[i] || row[i].indexOf(',') < 0) continue;
            var parts = row[i].split(",");
            list.push([toId(parts[0]), Number(parts[1])]);
        }

        list.sort(function (a, b) {
            return a[1] - b[1];
        });

        if (list.length > 1) {
            var ladder = '<table border="1" cellspacing="0" cellpadding="3"><tbody><tr><th>Rank</th><th>User</th><th>Tournament Elo</th><th>Tournament Wins</th></tr>';
            var len = list.length;

            limit = len - limit;
            if (limit > len) limit = len;

            while (len--) {
                ladder = ladder + '<tr><td>' + (list.length - len) + '</td><td>' + list[len][0] + '</td><td>' + Math.floor(list[len][1]) + '</td><td>' + this.stdin('tourWins', list[len][0]) + '</td></tr>';
                if (len === limit) break;
            }
            ladder += '</tbody></table>';
            return ladder;
        }
        return 0;
    },

    poll: function () {
        var poll = {};
        var components = {

            reset: function (roomId) {
                poll[roomId] = {
                    question: undefined,
                    optionList: [],
                    options: {},
                    display: '',
                    topOption: ''
                };
            },

            splint: function (target) {
                var parts = target.split(',');
                var len = parts.length;
                while (len--) {
                    parts[len] = parts[len].trim();
                }
                return parts;
            }

        };

        for (var i in components) {
            if (components.hasOwnProperty(i)) {
                poll[i] = components[i];
            }
        }

        for (var id in Rooms.rooms) {
            if (Rooms.rooms[id].type === 'chat' && !poll[id]) {
                poll[id] = {};
                poll.reset(id);
            }
        }

        return poll;
    },

    tournaments: {
        amountEarn: 10,
        winningElo: 50,
        runnerUpElo: 25,
    },

};
