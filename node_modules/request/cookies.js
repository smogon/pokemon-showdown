
var cookie_str_splitter=/[:](?=\s*[a-zA-Z0-9_\-]+\s*[=])/g

function stringify (cookie) {
  var str=[cookie.name+"="+cookie.value];
	if(cookie.expiration_date !== Infinity) {
		str.push("expires="+(new Date(cookie.expiration_date)).toGMTString());
	}
	if(cookie.domain) {
		str.push("domain="+cookie.domain);
	}
	if(cookie.path) {
		str.push("path="+cookie.path);
	}
	if(cookie.secure) {
		str.push("secure");
	}
	if(cookie.noscript) {
		str.push("httponly");
	}
	return str.join("; ");
}

function Jar () {
  this.cookies = []
}
Jar.prototype.setCookies = function (cookieString) {
  
}
Jar.prototype.getHeader = function (host, path) {
  
}
Jar.prototype.getCookies = function (access_info) {
	var matches=[];
	for(var cookie_name in cookies) {
		var cookie=this.getCookie(cookie_name,access_info);
		if (cookie) {
			matches.push(cookie);
		}
	}
	matches.toString=function toString(){return matches.join(":");}
	return matches;
}

Jar.prototype.getCookie = function (host, path) {
  var cookies_list = self.cookies[cookie_name];
	for(var i=0;i<cookies_list.length;i++) {
		var cookie = cookies_list[i];
		if(cookie.expiration_date <= Date.now()) {
			if(cookies_list.length===0) {
				delete cookies[cookie.name]
			}
			continue;
		}
		if(cookie.matches(access_info)) {
			return cookie;
		}
	}
}
Jar.prototype.setCookie = function (){}
Jar.prototype.parseCookie = function (str) {
  var cookies = str.split(cookie_str_splitter)
    , successful = []
    , self = this
    ;
  cookies.forEach(function (cookie) {
    self.parseCookie(cookie);
  })
}

Jar.prototype.parseCookie = function (str) {
	var parts = str.split(";")
	  , pai r= parts[0].match(/([^=]+)=((?:.|\n)*)/)
	  , key = pair[1]
	  , value = pair[2]
	  , cookie = 
	    { name: null
	    , value: value
	    , expiration_date: = Infinity
	    , path: '/'
	    , domain: null
	    , secure: false
	    , noscript: false 
	    }
	  ;  
	  
	cookie.name = key;
	cookie.value = value;

	for(var i=1;i<parts.length;i++) {
		var pair = parts[i].match(/([^=]+)=((?:.|\n)*)/)
		  , key = pair[1].trim().toLowerCase()
		  , value = pair[2]
		  ;
		switch(key) {
			case "httponly":
				cookie.noscript = true;
			break;
			case "expires":
				cookie.expiration_date = value
					? Number(Date.parse(value))
					: Infinity;
			break;
			case "path":
				cookie.path = value
					? value.trim()
					: "";
			break;
			case "domain":
				cookie.domain = value
					? value.trim()
					: "";
			break;
			case "secure":
				cookie.secure = true;
			break
		}
	}
	
	if(cookie.name in this.cookies) {
		var cookies_list = this.cookies[cookie.name];
		for(var i=0;i<this.cookies_list.length;i++) {
			var collidable_cookie = cookies_list[i];
			if(collidable_cookie.collidesWith(cookie)) {
				if(remove) {
					cookies_list.splice(i,1);
					if(cookies_list.length===0) {
						delete this.cookies[cookie.name]
					}
					return false;
				}
				else {
					return cookies_list[i]=cookie;
				}
			}
		}
		if(remove) {
			return false;
		}
		cookies_list.push(cookie);
		return cookie;
	}
	else if(remove){
		return false;
	}
	else {
		return this.cookies[cookie.name]=[cookie];
	}

}