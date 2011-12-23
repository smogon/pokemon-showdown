# Hashlib
*Is a FAST nodejs(http://github.com/ry/node/) library for making hashes written in C/C++*

*Supports: md4, md5, md6, sha, sha1, sha256, sha512, hmac_sha1, hmac_md5*, also can make md5 hash of files

*Thangs to Vanilla Hsu for speed improvements and md4, sha support*

## Install:
### way 1
1) go to the directory with hashlib library

2) execute `node-waf configure build`

3) get module from `./build/default/hashlib.node`

You should use `var hashlib = require("./build/default/hashlib");` (way to module)

### way 2 (works if node are installed in default path)
1) go to the directory with hashlib library

2) execute `make`

3) execute `sudo make install`

You should use `var hashlib = require("hashlib");` (from any path)

## Functions:
	md4(str); // Returns md4 hash from sting
	md5(str); // Returns md5 hash from sting
	sha(str); // Returns sha hash from sting
	sha1(str); // Returns sha1 hash from sting
	sha256(str); // Returns sha256 hash from sting
	sha512(str); // Returns sha512 hash from sting
	md6(str[, length]); // Returns md6 hash from sting, second parametr is optional
	md5_file(path[, callback]); // Returns md5 hash from file callback is optional and works async
	hmac_sha1(str, key) // Returns hmac sha1 hash with an key
	hmac_md5(str, key) // Returns hmac md5 hash with an key
	
## Usage:
	var hashlib = require('hashlib');
	hashlib.md5('text');
	
## Speed testing
To run speed test on your computer run test.js, here is my:
	C++ md5 result is: 220
	JS md5 result is: 5660
	C++ module faster than JS in 25.727272727272727 times
	-----------
	C++ md4 result is: 212
	C++ md6 result is: 3889
	C++ sha0 result is: 228
	C++ sha1 result is: 495
	C++ sha256 result is: 712
	C++ sha512 result is: 612
	
	// Smaller is better

Other modules, engines md5 comparsion:
	hashlib: 220
	node-crypto: 1055
	python-hashlib: 265
	php: 179
	
	// Smaller is better

<img src="http://nodejs.ru/img/small.png">
