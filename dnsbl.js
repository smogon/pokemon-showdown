var dns = require('dns');

var blocklist = 'zen.spamhaus.org';

var dnsblCache = {};

exports.query = function queryDnsbl(ip, callback) {
	if (ip in dnsblCache) {
		callback(dnsblCache[ip]);
		return;
	}
	var reversedIp = ip.split('.').reverse().join('.');
	dns.resolve4(reversedIp+'.'+blocklist, function(err, addresses) {
		var isBlocked = dnsblCache[ip] = !err;
		callback(isBlocked);
	});
}
