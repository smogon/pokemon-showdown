var hashlib = require("./build/default/hashlib");
var sys = require("sys");
var md5 = require("./test/md5");

process.chdir(__dirname);

if (hashlib.md5('test')=='098f6bcd4621d373cade4e832627b4f6')
	sys.puts('test 1 PASSED');
else
	sys.puts('test 1 FAILS');
if (hashlib.sha1('test')=='a94a8fe5ccb19ba61c4c0873d391e987982fbbd3')
	sys.puts('test 2 PASSED');
else
	sys.puts('test 2 FAILS');
if (hashlib.sha256('test')=='9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
	sys.puts('test 3 PASSED');
else
	sys.puts('test 3 FAILS');
if (hashlib.sha512('test')=='ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff')
	sys.puts('test 4 PASSED');
else
	sys.puts('test 4 FAILS');
if (hashlib.md6('test')=='e2e671a86f079441639ff18928092c6e')
	sys.puts('test 5 PASSED');
else
	sys.puts('test 5 FAILS');
if (hashlib.md6('test',40)=='27ea128154b4934ae2bd7f9dac53cf81da0002cc')
	sys.puts('test 6 PASSED');
else
	sys.puts('test 6 FAILS');
if (hashlib.md4('test')=='db346d691d7acc4dc2625db19f9e3f52')
	sys.puts('test 7 PASSED');
else
	sys.puts('test 7 FAILS');
if (hashlib.sha('test')=='f8d3b312442a67706057aeb45b983221afb4f035')
	sys.puts('test 8 PASSED');
else
	sys.puts('test 8 FAILS');
if (hashlib.md5_file('./test.file')=='bc8aeda5b02f054117bd9979908787dc')
	sys.puts('test 9 PASSED');
else
	sys.puts('test 9 FAILS');

hashlib.md5_file('./test.file',function(value) {
  if (value=='bc8aeda5b02f054117bd9979908787dc')
    sys.puts('test 10 PASSED');
  else
    sys.puts('test 10 FAILS');
// No "}" becouse it in the end
if (hashlib.hmac_sha1('what do ya want for nothing?', 'Jefe')=='effcdf6ae5eb2fa2d27416d5f184df9c259a7c79')
	sys.puts('test 11 PASSED');
else
	sys.puts('test 11 FAILS'); 
if (hashlib.hmac_md5('what do ya want for nothing?', 'Jefe')=='750c783e6ab0b503eaa86e310a5db738')
	sys.puts('test 12 PASSED');
else
	sys.puts('test 12 FAILS'); 

// End of tests

// C++ md5
var m1=new Date().getTime();
for(i=0;i<100000;i++) {
	h=hashlib.md5('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'+String(i));
}
var m2=new Date().getTime();
var c=m2-m1;
sys.puts('C++ md5 result is: '+(c));

// JS md5
var m1=new Date().getTime();
for(i=0;i<100000;i++) {
	h=md5.md5('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'+String(i));
}
var m2=new Date().getTime();
var js=m2-m1;
sys.puts('JS md5 result is: '+(js));
if (c<js) sys.puts('C++ module faster than JS in '+(js/c)+' times');
else if (c>js) sys.puts('JS module faster than C++ in '+(c/j)+' times');
sys.puts('-----------');

// C++ md4
var m1=new Date().getTime();
for(i=0;i<100000;i++) {
	h=hashlib.md4('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'+String(i));
}
var m2=new Date().getTime();
var c=m2-m1;
sys.puts('C++ md4 result is: '+(c));

// C++ md6
var m1=new Date().getTime();
for(i=0;i<100000;i++) {
	h=hashlib.md6('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'+String(i));
}
var m2=new Date().getTime();
var c=m2-m1;
sys.puts('C++ md6 result is: '+(c));

// C++ sha0
var m1=new Date().getTime();
for(i=0;i<100000;i++) {
	h=hashlib.sha('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'+String(i));
}
var m2=new Date().getTime();
var c=m2-m1;
sys.puts('C++ sha0 result is: '+(c));

// C++ sha1
var m1=new Date().getTime();
for(i=0;i<100000;i++) {
	h=hashlib.sha1('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'+String(i));
}
var m2=new Date().getTime();
var c=m2-m1;
sys.puts('C++ sha1 result is: '+(c));

// C++ sha256
var m1=new Date().getTime();
for(i=0;i<100000;i++) {
	h=hashlib.sha256('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'+String(i));
}
var m2=new Date().getTime();
var c=m2-m1;
sys.puts('C++ sha256 result is: '+(c));

// C++ sha512
var m1=new Date().getTime();
for(i=0;i<100000;i++) {
	h=hashlib.sha512('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'+String(i));
}
var m2=new Date().getTime();
var c=m2-m1;
sys.puts('C++ sha512 result is: '+(c));

});
