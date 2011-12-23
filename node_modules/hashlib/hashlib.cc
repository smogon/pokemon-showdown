/**
 * FAST nodejs(http://github.com/ry/node/) library for making hashes
 *
 * @package hashlib
 * @link http://github.com/brainfucker/hashlib
 * @autor Oleg Illarionov <oleg@emby.ru>
 * @version 1.0
 */

#include <iostream>
#include <stdio.h>

#include <v8.h>
#include <ev.h>
#include <eio.h>
#include <fcntl.h>

extern "C" {
#include "sha.h"
#include "md4.h"
#include "md5.h"
}

#include "lib/sha/shamodule.c"
#include "lib/sha/sha256module.c"
#include "lib/sha/sha512module.c"

#include "lib/md6/md6.h"
#include "lib/md6/md6_compress.c"
#include "lib/md6/md6_mode.c"

class file_data {
  public:
	int fd;
	int byte;
	MD5_CTX mdContext;
	void* environment;
};


using namespace v8;

// make digest from php
static void
make_digest_ex(unsigned char *md5str, unsigned char *digest, int len)
{
  static const char hexits[17] = "0123456789abcdef";
  int i;

  for (i = 0; i < len; i++) {
    md5str[i * 2] = hexits[digest[i] >> 4];
    md5str[(i * 2) + 1] = hexits[digest[i] &  0x0F];
  }
  md5str[len * 2] = '\0';
}

Handle<Value>
sha(const Arguments& args)
{
  HandleScope scope;	
  String::Utf8Value data(args[0]->ToString());
  SHA_CTX ctx;
  unsigned char digest[20];
  unsigned char hexdigest[40];

  SHA_Init(&ctx);
  SHA_Update(&ctx, (unsigned char*)*data, data.length());
  SHA_Final(digest, &ctx);

  make_digest_ex(hexdigest, digest, 20);

  return scope.Close(String::New((char*)hexdigest,40));
}

Handle<Value>
sha1(const Arguments& args)
{
  HandleScope scope;	
  using namespace sha1module;
  String::Utf8Value data(args[0]->ToString());
  unsigned char digest[40];
  unsigned char hexdigest[40];
  SHAobject *sha;
  sha=new SHAobject;
  sha_init(sha);
  sha_update(sha, (unsigned char*) *data, data.length());
  sha_final(digest, sha);

  make_digest_ex(hexdigest, digest, 20);

  return scope.Close(String::New((char*)hexdigest,40));
}

Handle<Value>
hmac_sha1(const Arguments& args)
{
	HandleScope scope;
 
	using namespace sha1module;
	String::Utf8Value data(args[0]->ToString());
	String::Utf8Value key_input(args[1]->ToString());
 
	unsigned char digest[40];
	unsigned char hexdigest[40];
	unsigned int i;
 
	const void *key = (unsigned char*) *key_input;
	size_t keylen   =  key_input.length();
 
	char ipad[64], opad[64];
 
	if(keylen > 64)
	{
		char optkeybuf[20];
		SHAobject *keyhash;
		keyhash = new SHAobject;
		sha_init(keyhash);
		sha_update(keyhash, (unsigned char*) key, keylen);
		sha_final((unsigned char*) optkeybuf, keyhash);
		keylen = 20;
		key = optkeybuf;
	}
 
	memcpy(ipad, key, keylen);
	memcpy(opad, key, keylen);
	memset(ipad+keylen, 0, 64 - keylen);
	memset(opad+keylen, 0, 64 - keylen);
 
	for (i = 0; i < 64; i++) 
	{
		ipad[i] ^= 0x36;
		opad[i] ^= 0x5c;
	}
 
	SHAobject *context;
	context = new SHAobject;
	sha_init(context);
	sha_update(context, (unsigned char*) ipad, 64);
	sha_update(context, (unsigned char*)*data, data.length());
	sha_final(digest, context);
 
	sha_init(context);
	sha_update(context, (unsigned char*) opad, 64);
	sha_update(context, digest, 20);
	sha_final(digest, context);
 
	make_digest_ex(hexdigest, digest, 20);
	return scope.Close(String::New((char*)hexdigest,40));
}

Handle<Value>
hmac_md5(const Arguments& args)
{
	HandleScope scope;
 
	String::Utf8Value data(args[0]->ToString());
	String::Utf8Value key_input(args[1]->ToString());
 
	unsigned char digest[16];
	unsigned char hexdigest[32];
	unsigned int i;
 
	const void *key = (unsigned char*) *key_input;
	size_t keylen   =  key_input.length();
 
	char ipad[64], opad[64];
 
	if(keylen > 64)
	{
		char optkeybuf[20];
		MD5_CTX keyhash;

		MD5Init(&keyhash);
		MD5Update(&keyhash, (unsigned char*) key, keylen);
		MD5Final((unsigned char*) optkeybuf, &keyhash);

		keylen = 20;
		key = optkeybuf;
	}
 
	memcpy(ipad, key, keylen);
	memcpy(opad, key, keylen);
	memset(ipad+keylen, 0, 64 - keylen);
	memset(opad+keylen, 0, 64 - keylen);
 
	for (i = 0; i < 64; i++) 
	{
		ipad[i] ^= 0x36;
		opad[i] ^= 0x5c;
	}

	MD5_CTX context;

	MD5Init(&context);
	MD5Update(&context, (unsigned char*) ipad, 64);
	MD5Update(&context, (unsigned char*) *data, data.length());
	MD5Final(digest, &context);

	MD5Init(&context);
	MD5Update(&context, (unsigned char*) opad, 64);
	MD5Update(&context, digest, 16);
	MD5Final(digest, &context);
 
	make_digest_ex(hexdigest, digest, 16);
	return scope.Close(String::New((char*)hexdigest,32));
}



Handle<Value>
sha256(const Arguments& args)
{
  HandleScope scope;	
  using namespace sha256module;
  String::Utf8Value data(args[0]->ToString());
  unsigned char digest[64];
  unsigned char hexdigest[64];
  SHAobject *sha;
  sha=new SHAobject;
  sha_init(sha);
  sha_update(sha, (unsigned char*) *data, data.length());
  sha_final(digest, sha);

  make_digest_ex(hexdigest, digest, 32);

  return scope.Close(String::New((char*)hexdigest,64));
}

Handle<Value>
sha512(const Arguments& args)
{
  HandleScope scope;	
  using namespace sha512module;
  String::Utf8Value data(args[0]->ToString());
  unsigned char digest[128];
  unsigned char hexdigest[128];
  SHAobject *sha;
  sha=new SHAobject;
  sha512_init(sha);
  sha512_update(sha, (unsigned char*) *data, data.length());
  sha512_final(digest, sha);
  
  make_digest_ex(hexdigest, digest, 64);

  return scope.Close(String::New((char*)hexdigest,128));
}

Handle<Value>
md4(const Arguments& args)
{
  HandleScope scope;
  
  String::Utf8Value data(args[0]->ToString());
  MD4_CTX mdContext;
  unsigned char digest[16];
  unsigned char hexdigest[32];

  /* make an hash */
  MD4Init(&mdContext);
  MD4Update(&mdContext, (unsigned char*)*data, data.length());
  MD4Final(digest, &mdContext);
  
  make_digest_ex(hexdigest, digest, 16);
  
  return scope.Close(String::New((char*)hexdigest,32));
}

Handle<Value>
md5(const Arguments& args)
{
  HandleScope scope;
  
  String::Utf8Value data(args[0]->ToString());
  MD5_CTX mdContext;
  unsigned char digest[16];
  unsigned char hexdigest[32];

  /* make an hash */
  MD5Init(&mdContext);
  MD5Update(&mdContext, (unsigned char*)*data, data.length());
  MD5Final(digest, &mdContext);
  
  make_digest_ex(hexdigest, digest, 16);
  
  return scope.Close(String::New((char*)hexdigest,32));
}

Handle<Value>
md6(const Arguments& args)
{
  HandleScope scope;	
  
  String::Utf8Value data(args[0]->ToString());
  
  int len(32);
  if (!args[1]->IsUndefined()) {
    len=args[1]->ToInteger()->Value();
  }
  unsigned char digest[len];
  unsigned char hexdigest[len];
  md6_hash(len*8, (unsigned char*) *data, data.length(), digest);

  int half_len=len/2;
  if (len%2!=0) half_len++;
  
  make_digest_ex(hexdigest, digest, half_len);

  return scope.Close(String::New((char*)hexdigest,len));
}

int read_cb (eio_req *req)
{
  file_data *fd=(file_data *)req->data;
  unsigned char *buf = (unsigned char *)EIO_BUF (req);
  int bytes=(int)EIO_RESULT(req);
  MD5Update (&fd->mdContext, buf, bytes);
  if (bytes==10240) {
  	// Read next block
  	fd->byte+=bytes;
  	eio_read(fd->fd, 0, 10240, fd->byte, EIO_PRI_DEFAULT, read_cb, static_cast<void*>(fd));
  } else {
  	// Final
  	unsigned char digest[16];
  	unsigned char hexdigest[32];
  	MD5Final(digest, &fd->mdContext);
  	make_digest_ex(hexdigest, digest, 16);
  	
  	Persistent<Object> *data = reinterpret_cast<Persistent<Object>*>(fd->environment);
  
    v8::Handle<v8::Function> callback = v8::Handle<v8::Function>::Cast((*data)->Get(String::New("callback")));
    Handle<Object> recv = Handle<Object>::Cast((*data)->Get(String::New("recv")));
    v8::Handle<v8::Value> outArgs[] = {String::New((char *)hexdigest,32)};
    callback->Call(recv, 1, outArgs);
    data->Dispose();
    eio_close(fd->fd, 0, 0, (void*)"close");
    ev_unref(EV_DEFAULT_UC);
  }

  return 0;
}

int open_cb (eio_req *req)
{
  file_data *fd=(file_data *)req->data;
    
  fd->fd = EIO_RESULT (req);
  void* data = static_cast<void*>(fd);
  eio_read (fd->fd, 0, 10240, fd->byte, EIO_PRI_DEFAULT, read_cb, (void*)data);
  
  return 0;
}

Handle<Value> get_md5_file_async(char * path, void* data)
{
  eio_open (path, O_RDONLY, 0777, 0, open_cb, data);
  return v8::Boolean::New(true);
}

Handle<Value> get_md5_file(char * path)
{
  HandleScope scope;
  Unlocker unlock;
  FILE *inFile = fopen (path, "rb");
  MD5_CTX mdContext;
  unsigned char digest[16];
  unsigned char hexdigest[32];
  int bytes;
  unsigned char data[10240];

  if (inFile == NULL) {
    std::string s="Cannot read ";
    s+=path;
    Locker lock;
    return ThrowException(Exception::Error(String::New(s.c_str())));
  }

  MD5Init (&mdContext);
  while ((bytes = fread (data, 1, 10240, inFile)) != 0)
    MD5Update (&mdContext, data, bytes);
  MD5Final (digest, &mdContext);
  make_digest_ex(hexdigest, digest, 16);
  fclose (inFile);
  Locker lock;
  return scope.Close(String::New((char*)hexdigest,32));
}

Handle<Value>
md5_file(const Arguments& args)
{
  HandleScope scope;
  struct stat stFileInfo;
  String::Utf8Value path(args[0]->ToString());
  char* cpath=*path;
  int intStat = stat(cpath,&stFileInfo); 
  if (intStat == 0) {
    if (args[1]->IsFunction()) {
	  v8::Local<v8::Object> arguments = v8::Object::New();
	  arguments->Set(String::New("path"),args[0]->ToString());
	  arguments->Set(String::New("callback"),args[1]);
	  arguments->Set(String::New("recv"),args.This());
	  Persistent<Object> *data = new Persistent<Object>();
	  *data = Persistent<Object>::New(arguments);

    file_data *fd=new file_data;
	  fd->byte = 0;
	  fd->environment = data;

	  MD5Init(&fd->mdContext);
	  ev_ref(EV_DEFAULT_UC);
    	return scope.Close(get_md5_file_async(cpath,static_cast<void*>(fd)));
    } else {
    	return scope.Close(get_md5_file(cpath));
    }
  } else {
    std::string s="Cannot read ";
    s+=cpath;
    return scope.Close(ThrowException(Exception::Error(String::New(s.c_str()))));
  }
}

extern "C" void init (Handle<Object> target)
{
  HandleScope scope;
  target->Set(String::New("md4"), FunctionTemplate::New(md4)->GetFunction());
  target->Set(String::New("md5"), FunctionTemplate::New(md5)->GetFunction());
  target->Set(String::New("md6"), FunctionTemplate::New(md6)->GetFunction());
  target->Set(String::New("sha"), FunctionTemplate::New(sha)->GetFunction());
  target->Set(String::New("sha1"), FunctionTemplate::New(sha1)->GetFunction());
  target->Set(String::New("hmac_sha1"), FunctionTemplate::New(hmac_sha1)->GetFunction());
  target->Set(String::New("hmac_md5"), FunctionTemplate::New(hmac_md5)->GetFunction());
  target->Set(String::New("sha256"), FunctionTemplate::New(sha256)->GetFunction());
  target->Set(String::New("sha512"), FunctionTemplate::New(sha512)->GetFunction());
  
  target->Set(String::New("md5_file"), FunctionTemplate::New(md5_file)->GetFunction());
}
