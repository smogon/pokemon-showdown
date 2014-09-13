var sys = require('sys');
var url = require('url');
var http = require('http');

if (process.argv[2]) {
	var args = process.argv.slice(2);
	var serverUrl = args.join(' ');
	if (serverUrl.indexOf('://') !== -1) {
		serverUrl = url.parse(serverUrl).host;
	}
	if (serverUrl.slice(-1) === '/') {
		serverUrl = serverUrl.slice(0, -1);
	}

	console.log('Getting data for ' + serverUrl + '...');
	console.log('This may take some time, depending on Showdown\'s speed.');

	var received = false;
	var requestOptions = {
		hostname: 'play.pokemonshowdown.com',
		port: 80,
		path: '/crossdomain.php?host=' + serverUrl + '&path=',
		method: 'GET'
	};
	var req = http.request(requestOptions, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			if (received) {
				return;
			}
			received = true;
			
			var search = 'var config = ';
			var index = chunk.indexOf(search);
			if (index !== -1) {
				var data = chunk.substr(index);
				data = data.substr(search.length, data.indexOf(';') - search.length);
				data = JSON.parse(data);
				console.log('---------------');
				console.log('server: ' + data.host);
				console.log('port: ' + data.port);
				console.log('serverid: ' + data.id);
			} else {
				console.log('ERROR: failed to get data!');
			}
		});
	});
	
	req.on('error', function (err) {
		console.log('ERROR: ' + sys.inspect(err));
	});
	
	req.end();
} else {
	console.log('ERROR: no URL specified!');
}
