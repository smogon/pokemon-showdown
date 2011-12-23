/* File:    md6_mode.c
** Author:  Ronald L. Rivest
** Address: Room 32G-692 Stata Center 
**          32 Vassar Street 
**          Cambridge, MA 02139
** Email:   rivest@mit.edu
** Date:    9/25/2008
**          revised 4/15/09 (see changelog below)
**
** (The following license is known as "The MIT License")
** 
** Copyright (c) 2008 Ronald L. Rivest
** 
** Permission is hereby granted, free of charge, to any person obtaining a copy
** of this software and associated documentation files (the "Software"), to deal
** in the Software without restriction, including without limitation the rights
** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
** copies of the Software, and to permit persons to whom the Software is
** furnished to do so, subject to the following conditions:
** 
** The above copyright notice and this permission notice shall be included in
** all copies or substantial portions of the Software.
** 
** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
** IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
** FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
** AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
** LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
** OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
** THE SOFTWARE.
**
** (end of license)
**
** This is part of the definition of the MD6 hash function.
** The files defining the md6 hash function are:
**    md6.h
**    md6_compress.c
**    md6_mode.c
**
** The files defining the interface between MD6 and the NIST SHA-3
** API are:
**    md6_nist.h
**    md6_nist.c
** The NIST SHA-3 API is defined in:
**    http://www.csrc.nist.gov/groups/ST/hash/documents/SHA3-C-API.pdf
**
** See  http://groups.csail.mit.edu/cis/md6  for more information.
**
** Changelog:
**    4/15/09: In routine "md6_final", transposed two lines so that
**             they are now in the correct order, which is:
**
**      trim_hashval( st );
**      if (hashval != NULL) memcpy( hashval, st->hashval, (st->d+7)/8 );
**
**             This fixes problem that caller could get incorrect output
**             if it took output from parameter hashval rather than from
**             state variable st->hashval.  If caller used the nist api 
**             (md6_nist.c), or used the md6 api with a non-NULL second 
**             argument to md6_final, or used md6_hash or md6_full_hash, 
**             caller would have obtained an incorrect value (basically,
**             the first d bits of the final root chaining value rather
**             than the last d bits).  If the caller used md6sum, or used
**             md6_final with a NULL second argument, the correct value
**             is obtained.  See changelog file for more discussion.
**
**             Thanks to Piotr Krysiuk for finding and reporting 
**             this error!
*/
/* MD6 standard mode of operation
**
** Defines the following interfaces (documentation copied from md6.h)
*/
#if 0

/* The next routines are used according to the pattern:
**    md6_init        (or md6_full_init if you use additional parameters) 
**    md6_update         (once for each portion of the data to be hashed)
**    md6_final                           (to finish up hash computation)
** Note: md6_final can return the hash value to a desired location, but
** hash value also remains available inside the md6_state, in both binary
** and hex formats (state->hashval and state->hexhashval).
*/

extern int md6_init( md6_state *st,             /* state to initialize */
		     int d                          /* hash bit length */
		     );

extern int md6_full_init( md6_state *st,        /* state to initialize */
			  int d,                    /* hash bit length */
			  unsigned char *key,       /* OK to give NULL */
			  int keylen,       /* (in bytes) OK to give 0 */
			  int L,     /* mode; OK to give md6_default_L */
			  int r                    /* number of rounds */
			  );

extern int md6_update( md6_state *st,             /* initialized state */
		       unsigned char *data,            /* data portion */
		       uint64_t datalen          /* its length in bits */
		       );

extern int md6_final( md6_state *st,            /* initialized/updated */
		      unsigned char *hashval,      /* output; NULL OK  */
		      );

/* The next routines compute a hash for a message given all at once.    
** The resulting hash value is returned to a specified location.
** Only one call is needed.  Use md6_hash for the standard md6 hash,
** and md6_full_hash if you want to specify additional parameters.
*/

extern int md6_hash( int d,                         /* hash bit length */
		     unsigned char *data,     /* complete data to hash */
		     uint64_t datalen            /* its length in bits */
		     unsigned char *hashval,                 /* output */
		     );

extern int md6_full_hash( int d,                    /* hash bit length */
			  unsigned char *data,/* complete data to hash */
			  uint64_t datalen,      /* its length in bits */
			  unsigned char *key,       /* OK to give NULL */
			  int keylen,       /* (in bytes) OK to give 0 */
			  int L,     /* mode; OK to give md6_default_L */
			  int r,                   /* number of rounds */
			  unsigned char *hashval,            /* output */
			  );
#endif

#include <assert.h>
#include <stdio.h> 
#include <string.h>

#include "md6.h"

/* MD6 constants independent of mode of operation (from md6.h) */
#define w md6_w     /* # bits in a word                   (64) */
#define n md6_n     /* # words in compression input       (89) */
#define c md6_c     /* # words in compression output      (16) */

/* MD6 constants needed for mode of operation                  */
#define q md6_q     /* # words in Q                       (15) */
#define k md6_k     /* # words in key (aka salt)          (8)  */
#define u md6_u     /* # words in unique node ID          (1)  */
#define v md6_v     /* # words in control word            (1)  */
#define b md6_b     /* # data words per compression block (64) */

/* Useful macros: min and max */
#ifndef min
#define min(a,b) ((a)<(b)? (a) : (b))
#endif
#ifndef max
#define max(a,b) ((a)>(b)? (a) : (b))
#endif

/* Default number of rounds                                    */
/* (as a function of digest size d and keylen                  */
int md6_default_r( int d ,
                   int keylen )
{ int r;
  /* Default number of rounds is forty plus floor(d/4) */
  r = 40 + (d/4);
  /* unless keylen > 0, in which case it must be >= 80 as well */
  if (keylen>0)
    r = max(80,r);
  return r;
}


/* MD6 Constant Vector Q
** Q = initial 960 bits of fractional part of sqrt(6)
**
** Given here for w = 64, 32, 16, and 8, although only
** w = 64 is needed for the standard version of MD6.
*/

#if (w==64)                      /* for standard version */
/* 15 64-bit words */
static const md6_word Q[15] =
  {
    0x7311c2812425cfa0ULL,
    0x6432286434aac8e7ULL, 
    0xb60450e9ef68b7c1ULL, 
    0xe8fb23908d9f06f1ULL, 
    0xdd2e76cba691e5bfULL, 
    0x0cd0d63b2c30bc41ULL, 
    0x1f8ccf6823058f8aULL, 
    0x54e5ed5b88e3775dULL, 
    0x4ad12aae0a6d6031ULL, 
    0x3e7f16bb88222e0dULL, 
    0x8af8671d3fb50c2cULL, 
    0x995ad1178bd25c31ULL, 
    0xc878c1dd04c4b633ULL, 
    0x3b72066c7a1552acULL, 
    0x0d6f3522631effcbULL, 
  };
#endif

#if (w==32)                      /* for variant version */
/* 30 32-bit words */
static const md6_word Q[30] =
  {
    0x7311c281UL, 0x2425cfa0UL,
    0x64322864UL, 0x34aac8e7UL, 
    0xb60450e9UL, 0xef68b7c1UL, 
    0xe8fb2390UL, 0x8d9f06f1UL, 
    0xdd2e76cbUL, 0xa691e5bfUL, 
    0x0cd0d63bUL, 0x2c30bc41UL, 
    0x1f8ccf68UL, 0x23058f8aUL, 
    0x54e5ed5bUL, 0x88e3775dUL, 
    0x4ad12aaeUL, 0x0a6d6031UL, 
    0x3e7f16bbUL, 0x88222e0dUL, 
    0x8af8671dUL, 0x3fb50c2cUL, 
    0x995ad117UL, 0x8bd25c31UL, 
    0xc878c1ddUL, 0x04c4b633UL, 
    0x3b72066cUL, 0x7a1552acUL, 
    0x0d6f3522UL, 0x631effcbUL, 
  };
#endif

/* MD6 Constant Vector Q (continued).
*/

#if (w==16)                      /* for variant version */
/* 60 16-bit words */
static const md6_word Q[60] =
  {
    0x7311, 0xc281, 0x2425, 0xcfa0,
    0x6432, 0x2864, 0x34aa, 0xc8e7, 
    0xb604, 0x50e9, 0xef68, 0xb7c1, 
    0xe8fb, 0x2390, 0x8d9f, 0x06f1, 
    0xdd2e, 0x76cb, 0xa691, 0xe5bf, 
    0x0cd0, 0xd63b, 0x2c30, 0xbc41, 
    0x1f8c, 0xcf68, 0x2305, 0x8f8a, 
    0x54e5, 0xed5b, 0x88e3, 0x775d, 
    0x4ad1, 0x2aae, 0x0a6d, 0x6031, 
    0x3e7f, 0x16bb, 0x8822, 0x2e0d, 
    0x8af8, 0x671d, 0x3fb5, 0x0c2c, 
    0x995a, 0xd117, 0x8bd2, 0x5c31, 
    0xc878, 0xc1dd, 0x04c4, 0xb633, 
    0x3b72, 0x066c, 0x7a15, 0x52ac, 
    0x0d6f, 0x3522, 0x631e, 0xffcb, 
  };
#endif

#if (w==8)                      /* for variant version */
/* 120 8-bit words */
static const md6_word Q[120] =
  {
    0x73, 0x11, 0xc2, 0x81, 0x24, 0x25, 0xcf, 0xa0,
    0x64, 0x32, 0x28, 0x64, 0x34, 0xaa, 0xc8, 0xe7, 
    0xb6, 0x04, 0x50, 0xe9, 0xef, 0x68, 0xb7, 0xc1, 
    0xe8, 0xfb, 0x23, 0x90, 0x8d, 0x9f, 0x06, 0xf1, 
    0xdd, 0x2e, 0x76, 0xcb, 0xa6, 0x91, 0xe5, 0xbf, 
    0x0c, 0xd0, 0xd6, 0x3b, 0x2c, 0x30, 0xbc, 0x41, 
    0x1f, 0x8c, 0xcf, 0x68, 0x23, 0x05, 0x8f, 0x8a, 
    0x54, 0xe5, 0xed, 0x5b, 0x88, 0xe3, 0x77, 0x5d, 
    0x4a, 0xd1, 0x2a, 0xae, 0x0a, 0x6d, 0x60, 0x31, 
    0x3e, 0x7f, 0x16, 0xbb, 0x88, 0x22, 0x2e, 0x0d, 
    0x8a, 0xf8, 0x67, 0x1d, 0x3f, 0xb5, 0x0c, 0x2c, 
    0x99, 0x5a, 0xd1, 0x17, 0x8b, 0xd2, 0x5c, 0x31, 
    0xc8, 0x78, 0xc1, 0xdd, 0x04, 0xc4, 0xb6, 0x33, 
    0x3b, 0x72, 0x06, 0x6c, 0x7a, 0x15, 0x52, 0xac, 
    0x0d, 0x6f, 0x35, 0x22, 0x63, 0x1e, 0xff, 0xcb, 
  };
#endif

/* Endianness.
*/

/* routines for dealing with byte ordering */

int md6_byte_order = 0;    
/* md6_byte_order describes the endianness of the 
** underlying machine:
** 0 = unknown
** 1 = little-endian
** 2 = big-endian
*/

/* Macros to detect machine byte order; these
** presume that md6_byte_order has been setup by
** md6_detect_byte_order()
*/
#define MD6_LITTLE_ENDIAN (md6_byte_order == 1)
#define MD6_BIG_ENDIAN    (md6_byte_order == 2)
 
void md6_detect_byte_order( void )
/* determine if underlying machine is little-endian or big-endian
** set global variable md6_byte_order to reflect result
** Written to work for any w.
*/
{ md6_word x = 1 | (((md6_word)2)<<(w-8));
  unsigned char *cp = (unsigned char *)&x;
  if ( *cp == 1 )        md6_byte_order = 1;      /* little-endian */
  else if ( *cp == 2 )   md6_byte_order = 2;      /* big-endian    */
  else                   md6_byte_order = 0;      /* unknown       */
}

md6_word md6_byte_reverse( md6_word x )
/* return byte-reversal of md6_word x.
** Written to work for any w, w=8,16,32,64.
*/
{ 
#define mask8  ((md6_word)0x00ff00ff00ff00ffULL)
#define mask16 ((md6_word)0x0000ffff0000ffffULL)
#if (w==64)
  x = (x << 32) | (x >> 32);
#endif
#if (w >= 32)
  x = ((x & mask16) << 16) | ((x & ~mask16) >> 16);
#endif
#if (w >= 16)
  x = ((x & mask8) << 8) | ((x & ~mask8) >> 8);
#endif
  return x;
}

void md6_reverse_little_endian( md6_word *x, int count )
/* Byte-reverse words x[0...count-1] if machine is little_endian */
{
  int i;
  if (MD6_LITTLE_ENDIAN)
    for (i=0;i<count;i++)
      x[i] = md6_byte_reverse(x[i]);
}

/* Appending one bit string onto another.
*/

void append_bits( unsigned char *dest, unsigned int destlen,
		  unsigned char *src,  unsigned int srclen )
/* Append bit string src to the end of bit string dest
** Input:
**     dest         a bit string of destlen bits, starting in dest[0]
**                  if destlen is not a multiple of 8, the high-order
**                  bits are used first
**     src          a bit string of srclen bits, starting in src[0]
**                  if srclen is not a multiple of 8, the high-order
**                  bits are used first
** Modifies:
**     dest         when append_bits returns, dest will be modified to
**                  be a bit-string of length (destlen+srclen).
**                  zeros will fill any unused bit positions in the 
**                  last byte.
*/
{ int i, di, accumlen;
  uint16_t accum;
  int srcbytes;

  if (srclen == 0) return;

  /* Initialize accum, accumlen, and di */
  accum = 0;    /* accumulates bits waiting to be moved, right-justified */
  accumlen = 0; /* number of bits in accumulator */
  if (destlen%8 != 0)
    { accumlen = destlen%8;
      accum = dest[destlen/8];        /* grab partial byte from dest     */
      accum = accum >> (8-accumlen);  /* right-justify it in accumulator */
    }
  di = destlen/8;        /* index of where next byte will go within dest */
  
  /* Now process each byte of src */
  srcbytes = (srclen+7)/8;   /* number of bytes (full or partial) in src */
  for (i=0;i<srcbytes;i++)
    { /* shift good bits from src[i] into accum */
      if (i != srcbytes-1) /* not last byte */
	{ accum = (accum << 8) ^ src[i];  
	  accumlen += 8;
	}
      else /* last byte */
	{ int newbits = ((srclen%8 == 0) ? 8 : (srclen%8));
	  accum = (accum << newbits) | (src[i] >> (8-newbits));
	  accumlen += newbits;
	}
      /* do as many high-order bits of accum as you can (or need to) */
      while ( ( (i != srcbytes-1) & (accumlen >= 8) ) ||
	      ( (i == srcbytes-1) & (accumlen > 0) ) )
	{ int numbits = min(8,accumlen);
	  unsigned char bits;
	  bits = accum >> (accumlen - numbits);    /* right justified */
	  bits = bits << (8-numbits);              /* left justified  */
	  bits &= (0xff00 >> numbits);             /* mask            */
	  dest[di++] = bits;                       /* save            */
	  accumlen -= numbits; 
	}
    }
}

/* State initialization. (md6_full_init, with all parameters specified)
** 
*/

int md6_full_init( md6_state *st,       /* uninitialized state to use */
		   int d,                          /* hash bit length */
		   unsigned char *key,        /* key; OK to give NULL */
		   int keylen,     /* keylength (bytes); OK to give 0 */
		   int L,           /* mode; OK to give md6_default_L */
		   int r                          /* number of rounds */
		   )
/* Initialize md6_state
** Input:
**     st         md6_state to be initialized
**     d          desired hash bit length 1 <= d <= w*(c/2)    (<=512 bits)
**     key        key (aka salt) for this hash computation     (byte array)
**                defaults to all-zero key if key==NULL or keylen==0
**     keylen     length of key in bytes; 0 <= keylen <= (k*8) (<=64 bytes)
**     L          md6 mode parameter; 0 <= L <= 255
**                md6.h defines md6_default_L for when you want default
**     r          number of rounds; 0 <= r <= 255
** Output:
**     updates components of state
**     returns one of the following:
**       MD6_SUCCESS
**       MD6_NULLSTATE
**       MD6_BADKEYLEN
**       MD6_BADHASHLEN
*/
{ /* check that md6_full_init input parameters make some sense */
  if (st == NULL) return MD6_NULLSTATE;
  if ( (key != NULL) && ((keylen < 0) || (keylen > k*(w/8))) )
    return MD6_BADKEYLEN;
  if ( d < 1 || d > 512 || d > w*c/2 ) return MD6_BADHASHLEN;

  md6_detect_byte_order();
  memset(st,0,sizeof(md6_state));  /* clear state to zero */
  st->d = d;                       /* save hashbitlen */
  if (key != NULL && keylen > 0)   /* if no key given, use memset zeros*/
    { memcpy(st->K,key,keylen);    /* else save key (with zeros added) */
      st->keylen = keylen;
      /* handle endian-ness */       /* first byte went into high end */
      md6_reverse_little_endian(st->K,k);
    }
  else
    st->keylen = 0;
  if ( (L<0) | (L>255) ) return MD6_BAD_L;
  st->L = L;
  if ( (r<0) | (r>255) ) return MD6_BAD_r;
  st->r = r;
  st->initialized = 1;  
  st->top = 1;
  /* if SEQ mode for level 1; use IV=0  */
  /* zero bits already there by memset; */
  /* we just need to set st->bits[1]    */
  if (L==0) st->bits[1] = c*w;     
  compression_hook = NULL;     /* just to be sure default is "not set" */
  return MD6_SUCCESS;
}

/* State initialization. (md6_init, which defaults most parameters.)
**
*/

int md6_init( md6_state *st,
	      int d 
	      )
/* Same as md6_full_init, but with default key, L, and r */
{ return md6_full_init(st,
		       d,
		       NULL,
		       0,
		       md6_default_L,
		       md6_default_r(d,0)
		       );
}

/* Data structure notes.
*/

/*
Here are some notes on the data structures used (inside state).

* The variable B[] is a stack of length-b (b-64) word records,
  each corresponding to a node in the tree.  B[ell] corresponds
  to a node at level ell.  Specifically, it represents the record which,
  when compressed, will yield the value at that level. (It only
  contains the data payload, not the auxiliary information.)
  Note that B[i] is used to store the *inputs* to the computation at
  level i, not the output for the node at that level.  
  Thus, for example, the message input is stored in B[1], not B[0].

* Level 0 is not used.  The message bytes are placed into B[1].

* top is the largest ell for which B[ell] has received data,
  or is equal to 1 in case no data has been received yet at all.

* top is never greater than L+1.  If B[L+1] is
  compressed, the result is put back into B[L+1]  (this is SEQ).

* bits[ell] says how many bits have been placed into
  B[ell].  An invariant maintained is that of the bits in B[ell], 
  only the first bits[ell] may be nonzero; the following bits must be zero.

* The B nodes may have somewhat different formats, depending on the level:
  -- Level 1 node contains a variable-length bit-string, and so
     0 <= bits[1] <= b*w     is all we can say.
  -- Levels 2...top always receive data in c-word chunks (from
     children), so for them bits[ell] is between 0 and b*w,
     inclusive, but is also a multiple of cw.  We can think of these
     nodes as have (b/c) (i.e. 4) "slots" for chunks.
  -- Level L+1 is special, in that the first c words of B are dedicated
     to the "chaining variable" (or IV, for the first node on the level).

* When the hashing is over, B[top] will contain the 
  final hash value, in the first or second (if top = L+1) slot.

*/
/* Compress one block -- compress data at a node (md6_compress_block).
*/

int md6_compress_block( md6_word *C,
			md6_state *st, 
			int ell, 
			int z
			)
/* compress block at level ell, and put c-word result into C.
** Input:
**     st         current md6 computation state
**     ell        0 <= ell < max_stack_height-1
**     z          z = 1 if this is very last compression; else 0
** Output:
**     C          c-word array to put result in
** Modifies:
**     st->bits[ell]  (zeroed)
**     st->i_for_level[ell] (incremented)  
**     st->B[ell] (zeroed)
**     st->compression_calls (incremented)
** Returns one of the following:
**     MD6_SUCCESS
**     MD6_NULLSTATE
**     MD6_STATENOTINIT
**     MD6_STACKUNDERFLOW
**     MD6_STACKOVERFLOW
*/
{ int p, err;

  /* check that input values are sensible */
  if ( st == NULL) return MD6_NULLSTATE;
  if ( st->initialized == 0 ) return MD6_STATENOTINIT;
  if ( ell < 0 ) return MD6_STACKUNDERFLOW;
  if ( ell >= md6_max_stack_height-1 ) return MD6_STACKOVERFLOW;

  st->compression_calls++;

  if (ell==1) /* leaf; hashing data; reverse bytes if nec. */
    { if (ell<(st->L + 1)) /* PAR (tree) node */
	md6_reverse_little_endian(&(st->B[ell][0]),b);
      else /* SEQ (sequential) node; don't reverse chaining vars */
	md6_reverse_little_endian(&(st->B[ell][c]),b-c);
    }

  p = b*w - st->bits[ell];          /* number of pad bits */

  err = 
    md6_standard_compress( 
      C,                                      /* C    */
      Q,                                      /* Q    */
      st->K,                                  /* K    */
      ell, st->i_for_level[ell],              /* -> U */
      st->r, st->L, z, p, st->keylen, st->d,  /* -> V */
      st->B[ell]                              /* B    */
			   );                         
  if (err) return err; 

  st->bits[ell] = 0; /* clear bits used count this level */
  st->i_for_level[ell]++;

  memset(&(st->B[ell][0]),0,b*sizeof(md6_word));     /* clear B[ell] */
  return MD6_SUCCESS;
}

/* Process (compress) a node and its compressible ancestors.
*/

int md6_process( md6_state *st,
		 int ell,
		 int final )
/*
** Do processing of level ell (and higher, if necessary) blocks.
** 
** Input:
**     st         md6 state that has been accumulating message bits
**                and/or intermediate results
**     ell        level number of block to process
**     final      true if this routine called from md6_final 
**                     (no more input will come)
**                false if more input will be coming
**                (This is not same notion as "final bit" (i.e. z)
**                 indicating the last compression operation.)
** Output (by side effect on state):
**     Sets st->hashval to final chaining value on final compression.
** Returns one of the following:
**     MD6_SUCCESS
**     MD6_NULLSTATE
**     MD6_STATENOTINIT
*/
{ int err, z, next_level;
  md6_word C[c];

  /* check that input values are sensible */
  if ( st == NULL) return MD6_NULLSTATE;
  if ( st->initialized == 0 ) return MD6_STATENOTINIT;

  if (!final) /* not final -- more input will be coming */
    { /* if not final and block on this level not full, nothing to do */
      if ( st->bits[ell] < b*w ) 
	return MD6_SUCCESS;
      /* else fall through to compress this full block, 
      **       since more input will be coming 
      */
    }
  else /* final -- no more input will be coming */
    { if ( ell == st->top )
	{ if (ell == (st->L + 1)) /* SEQ node */
	    { if ( st->bits[ell]==c*w && st->i_for_level[ell]>0 )
		return MD6_SUCCESS;
	      /* else (bits>cw or i==0, so fall thru to compress */
	    }
           else /* st->top == ell <= st->L so we are at top tree node */
	     { if ( ell>1 && st->bits[ell]==c*w)
		 return MD6_SUCCESS;
	       /* else (ell==1 or bits>cw, so fall thru to compress */
	     }
	}
      /* else (here ell < st->top so fall through to compress */
    }

  /* compress block at this level; result goes into C */
  /* first set z to 1 iff this is the very last compression */
  z = 0; if (final && (ell == st->top)) z = 1; 
  if ((err = md6_compress_block(C,st,ell,z))) 
      return err;
  if (z==1) /* save final chaining value in st->hashval */
    { memcpy( st->hashval, C, md6_c*(w/8) );
      return MD6_SUCCESS;
    }
  
  /* where should result go? To "next level" */
  next_level = min(ell+1,st->L+1);
  /* Start sequential mode with IV=0 at that level if necessary 
  ** (All that is needed is to set bits[next_level] to c*w, 
  ** since the bits themselves are already zeroed, either
  ** initially, or at the end of md6_compress_block.)
  */
  if (next_level == st->L + 1 
      && st->i_for_level[next_level]==0
      && st->bits[next_level]==0 )
    st->bits[next_level] = c*w;   
  /* now copy C onto next level */
  memcpy((char *)st->B[next_level] + st->bits[next_level]/8,
	 C,
	 c*(w/8));
  st->bits[next_level] += c*w;   
  if (next_level > st->top) st->top = next_level;

  return md6_process(st,next_level,final);
}
/* Update -- incorporate data string into hash computation.
*/

int md6_update( md6_state *st, 
		unsigned char *data, 
		uint64_t databitlen )
/* Process input byte string data, updating state to reflect result
** Input:
**     st               already initialized state to be updated
**     data             byte string of length databitlen bits 
**                      to be processed (aka "M")
**     databitlen       number of bits in string data (aka "m")
** Modifies:
**     st               updated to reflect input of data
*/
{ unsigned int j, portion_size;
  int err;

  /* check that input values are sensible */
  if ( st == NULL ) return MD6_NULLSTATE;
  if ( st->initialized == 0 ) return MD6_STATENOTINIT;
  if ( data == NULL ) return MD6_NULLDATA;
  
  j = 0; /* j = number of bits processed so far with this update */
  while (j<databitlen)
    { /* handle input string in portions (portion_size in bits)
      ** portion_size may be zero (level 1 data block might be full, 
      ** having size b*w bits) */
      portion_size = min(databitlen-j,
			 (unsigned int)(b*w-(st->bits[1]))); 

      if ((portion_size % 8 == 0) && 
	  (st->bits[1] % 8 == 0) &&
	  (j % 8 == 0))
	{ /* use mempy to handle easy, but most common, case */
	  memcpy((char *)st->B[1] + st->bits[1]/8,
		 &(data[j/8]),                                 
		 portion_size/8);
	}
      else /* handle messy case where shifting is needed */
	{ append_bits((unsigned char *)st->B[1], /* dest */
		      st->bits[1],   /* dest current bit size */
		      &(data[j/8]),  /* src */
		      portion_size); /* src size in bits  */
	}
      j += portion_size;
      st->bits[1] += portion_size;
      st->bits_processed += portion_size;

      /* compress level-1 block if it is now full 
	 but we're not done yet */
      if (st->bits[1] == b*w && j<databitlen)
	{ if ((err=md6_process(st,
			       1,    /* ell */
			       0     /* final */
			       ))) 
	    return err; 
	}
    } /* end of loop body handling input portion */
  return MD6_SUCCESS;
}

/* Convert hash value to hexadecimal, and store it in state.
*/

int md6_compute_hex_hashval( md6_state *st )
/*
** Convert hashval in st->hashval into hexadecimal, and
** save result in st->hexhashval
** This will be a zero-terminated string of length ceil(d/4).
** Assumes that hashval has already been "trimmed" to correct 
** length.
** 
** Returns one of the following:
**    MD6_SUCCESS
**    MD6_NULLSTATE                      (if input state pointer was NULL)
*/
{ int i;
  static unsigned char hex_digits[] = "0123456789abcdef";

  /* check that input is sensible */
  if ( st == NULL ) return MD6_NULLSTATE;
  
  for (i=0;i<((st->d+7)/8);i++)
    { st->hexhashval[2*i]   
	= hex_digits[ ((st->hashval[i])>>4) & 0xf ];
      st->hexhashval[2*i+1] 
	= hex_digits[ (st->hashval[i]) & 0xf ];
    }
  
  /* insert zero string termination byte at position ceil(d/4) */
  st->hexhashval[(st->d+3)/4] = 0;
  return MD6_SUCCESS;
}

/* Extract last d bits of chaining variable as hash value.
*/

void trim_hashval(md6_state *st)
{ /* trim hashval to desired length d bits by taking only last d bits */
  /* note that high-order bit of a byte is considered its *first* bit */
  int full_or_partial_bytes = (st->d+7)/8;
  int bits = st->d % 8;                 /* bits in partial byte */
  int i;

  /* move relevant bytes to the front */
  for ( i=0; i<full_or_partial_bytes; i++ )
    st->hashval[i] = st->hashval[c*(w/8)-full_or_partial_bytes+i];

  /* zero out following bytes */
  for ( i=full_or_partial_bytes; i<c*(w/8); i++ )
    st->hashval[i] = 0;

  /* shift result left by (8-bits) bit positions, per byte, if needed */
  if (bits>0)
    { for ( i=0; i<full_or_partial_bytes; i++ )
	{ st->hashval[i] = (st->hashval[i] << (8-bits));
	  if ( (i+1) < c*(w/8) )
	    st->hashval[i] |= (st->hashval[i+1] >> bits);
	}
    }
}

/* Final -- no more data; finish up and produce hash value.
*/

int md6_final( md6_state *st , unsigned char *hashval)
/* Do final processing to produce md6 hash value
** Input:
**     st              md6 state that has been accumulating message bits
**                     and/or intermediate results
** Output (by side effect on state):
**     hashval         If this is non-NULL, final hash value copied here.
**                     (NULL means don't copy.)  In any case, the hash
**                     value remains in st->hashval.
**     st->hashval     this is a 64-byte array; the first st->d
**                     bits of which will be the desired hash value
**                     (with high-order bits of a byte used first), and
**                     remaining bits set to zero (same as hashval)
**     st->hexhashval  this is a 129-byte array which contains the
**                     zero-terminated hexadecimal version of the hash
** Returns one of the following:
**     MD6_SUCCESS
**     MD6_NULLSTATE
**     MD6_STATENOTINIT
*/
{ int ell, err;

  /* check that input values are sensible */
  if ( st == NULL) return MD6_NULLSTATE;
  if ( st->initialized == 0 ) return MD6_STATENOTINIT;

  /* md6_final was previously called */
  if ( st->finalized == 1 ) return MD6_SUCCESS;

  /* force any processing that needs doing */
  if (st->top == 1) ell = 1;
  else for (ell=1; ell<=st->top; ell++)
	 if (st->bits[ell]>0) break;
  /* process starting at level ell, up to root */
  err = md6_process(st,ell,1);
  if (err) return err;

  /* md6_process has saved final chaining value in st->hashval */

  md6_reverse_little_endian( (md6_word*)st->hashval, c );

  /* 4/15/09: Following two lines were previously out of order, which 
  **          caused errors depending on whether caller took hash output 
  **          from  st->hashval (which was correct) or from 
  **                hashval parameter (which was incorrect, since it 
  **                                   missed getting "trimmed".)
  */
  trim_hashval( st );
  if (hashval != NULL) memcpy( hashval, st->hashval, (st->d+7)/8 );

  md6_compute_hex_hashval( st );

  st->finalized = 1;
  return MD6_SUCCESS;
}

/* Routines for hashing message given "all at once".
*/

int md6_full_hash( int d,                    /* hash bit length */
		   unsigned char *data,/* complete data to hash */
		   uint64_t databitlen,   /* its length in bits */
		   unsigned char *key,       /* OK to give NULL */
		   int keylen,       /* (in bytes) OK to give 0 */
		   int L,     /* mode; OK to give md6_default_L */
		   int r,                   /* number of rounds */
		   unsigned char *hashval             /* output */
		   )
{ md6_state st;
  int err;

  err = md6_full_init(&st,d,key,keylen,L,r);
  if (err) return err;
  err = md6_update(&st,data,databitlen);
  if (err) return err;
  md6_final(&st,hashval);
  if (err) return err;
  return MD6_SUCCESS;
}

int md6_hash( int d,                         /* hash bit length */
              unsigned char *data,     /* complete data to hash */
	      uint64_t databitlen,        /* its length in bits */
	      unsigned char *hashval                  /* output */
	     )
{ int err;

  err = md6_full_hash(d,data,databitlen,
		      NULL,0,md6_default_L,md6_default_r(d,0),hashval);
  if (err) return err;
  return MD6_SUCCESS;
}


/*
** end of md6_mode.c
*/


