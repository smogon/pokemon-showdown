var dns = require('dns');

var blocklist = 'zen.spamhaus.org';

exports.query = function queryDnsbl(ip, callback) {
	var reversedIp = ip.split('.').reverse().join('.');
	dns.resolve4(reversedIp+'.'+blocklist, function(err, addresses) {
		if (err) {
			// not on blacklist
			callback(false);
		} else {
			// on blacklist
			callback(true);
		}
	});
}
