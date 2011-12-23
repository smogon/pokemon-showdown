/* File:    md6.h 
** Author:  Ronald L. Rivest
** Address: Room 32G-692 Stata Center 
**          32 Vassar Street 
**          Cambridge, MA 02139
** Email:   rivest@mit.edu
** Date:    1/15/2009        (see changelog below)
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
** This file is part of the definition of the MD6 hash function.
** The files defining the MD6 hash function are:
**    md6.h
**    md6_compress.c
**    md6_mode.
** (Note that md6.h includes inttypes.h, which includes stdint.h; 
** versions of these header files compatible with MS Visual Studio
** are available, as noted below.)
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
** These files define the ``standard'' version of MD6.  However,
** they are written in such a way that one may relatively easily
** define and experiment with ``variant'' versions.
**
** Changelog:
**   1/15/2009: length of md6_state.hashval doubled (to 128 bytes)
**              to avoid buffer overflow issue found by Fortify.
**              (Change does not affect hash values computed, though.)
*/

/* Prevent multiple includes
** Matching endif is at end of md6.h
*/
#ifndef MD6_H_INCLUDED
#define MD6_H_INCLUDED


/* inttypes.h (which includes stdint.h)
** inttypes.h and stdint.h  are part of the normal environment 
** for gcc, but not for MS Visual Studio.  Fortunately,
** compatible implementations are available from Google at:
**   http://msinttypes.googlecode.com/svn/trunk/stdint.h
**   http://msinttypes.googlecode.com/svn/trunk/inttypes.h
** If these two files are in the same directory as md6.h, then
** MD6 will compile OK with MS Visual Studio.
*/
#if defined  _MSC_VER
#include "inttypes.h"
#else
#include <inttypes.h>
#endif

/* MD6 wordsize.
**
** Define md6 wordsize md6_w, in bits.
** Note that this is the "word size" relevant to the
** definition of md6 (it defines how many bits in an
** "md6_word");  it does *not* refer to the word size
** on the platform for which this is being compiled.
*/

#define   md6_w    64

/* Define "md6_word" appropriately for given value of md6_w.
** Also define PR_MD6_WORD to be the appropriate hex format string,
** using the format strings from inttypes.h .
** The term `word' in comments means an `md6_word'.
*/

#if (md6_w==64)                    /* standard md6 */
typedef uint64_t md6_word;
#define PR_MD6_WORD "%.16" PRIx64

#elif (md6_w==32)                  /* nonstandard variant */
typedef uint32_t md6_word;
#define PR_MD6_WORD "%.8" PRIx32

#elif (md6_w==16)                  /* nonstandard variant */
typedef uint16_t md6_word;
#define PR_MD6_WORD "%.4" PRIx16

#elif (md6_w==8)                   /* nonstandard variant */
typedef uint8_t md6_word;
#define PR_MD6_WORD "%.2" PRIx8

#endif

/* MD6 compression function.
**
** MD6 compression function is defined in file md6_compress.c 
*/

/* MD6 compression function constants                                  */

#define md6_n      89    /* size of compression input block, in words  */
#define md6_c      16    /* size of compression output, in words       */
                         /* a c-word block is also called a "chunk"    */
#define md6_max_r 255    /* max allowable value for number r of rounds */

/* Compression function routines                                
** These are ``internal'' routines that need not be called for  
** ordinary md6 usage.
*/

extern int md6_default_r( int d,      /* returns default r for given d */ 
			  int keylen  /* and keylen                    */
			  );    

void md6_main_compression_loop( md6_word *A,          /* working array */
				int r              /* number of rounds */
				);

int md6_compress( md6_word *C,                               /* output */  
		  md6_word *N,                                /* input */
		  int r,                              /* number rounds */
		  md6_word *A /* (optional) working array, may be NULL */
                );


typedef uint64_t md6_control_word;                      /* (r,L,z,p,d) */
md6_control_word md6_make_control_word( int r,        /* number rounds */
					int L,      /* parallel passes */
					int z,      /* final node flag */
					int p,         /* padding bits */
					int keylen,    /* bytes in key */
					int d           /* digest size */
					);

typedef uint64_t md6_nodeID;                                /* (ell,i) */
md6_nodeID md6_make_nodeID( int ell,                   /* level number */
			    int i    /* index (0,1,2,...) within level */
			    );

void md6_pack( md6_word* N,                                  /* output */
	       const md6_word* Q,           /* fractional part sqrt(6) */
	       md6_word* K,                                     /* key */
	       int ell, int i,                                /* for U */
	       int r, int L, int z, int p, int keylen, int d, /* for V */
	       md6_word* B                               /* data input */
	       );

int md6_standard_compress( 
        md6_word *C,                                     /* output */
	const md6_word *Q,              /* fractional part sqrt(6) */
	md6_word *K,                                        /* key */
	int ell, int i,                                   /* for U */
	int r, int L, int z, int p, int keylen, int d,    /* for V */
	md6_word* B                                  /* data input */
			   );

/* MD6 mode of operation.
**
** MD6 mode of operation is defined in file md6_mode.c 
*/

/* MD6 constants related to standard mode of operation                 */

/* These five values give lengths of the components of compression     */
/* input block; they should sum to md6_n.                              */
#define md6_q 15         /* # Q words in compression block (>=0)       */
#define md6_k  8         /* # key words per compression block (>=0)    */
#define md6_u (64/md6_w) /* # words for unique node ID (0 or 64/w)     */
#define md6_v (64/md6_w) /* # words for control word (0 or 64/w)       */
#define md6_b 64         /* # data words per compression block (>0)    */

#define md6_default_L 64    /* large so that MD6 is fully hierarchical */

#define md6_max_stack_height 29
    /* max_stack_height determines the maximum number of bits that
    ** can be processed by this implementation (with default L) to be:
    **    (b*w) * ((b/c) ** (max_stack_height-3)
    **    = 2 ** 64  for b = 64, w = 64, c = 16, and  max_stack_height = 29
    ** (We lose three off the height since level 0 is unused,
    ** level 1 contains the input data, and C has 0-origin indexing.)
    ** The smallest workable value for md6_max_stack_height is 3.
    ** (To avoid stack overflow for non-default L values, 
    ** we should have max_stack_height >= L + 2.)
    ** (One level of storage could be saved by letting st->N[] use
    ** 1-origin indexing, since st->N[0] is now unused.)
    */

/* MD6 state.
** 
** md6_state is the main data structure for the MD6 hash function.
*/

typedef struct {

  int d;           /* desired hash bit length. 1 <= d <= 512.      */
  int hashbitlen;  /* hashbitlen is the same as d; for NIST API    */

  unsigned char hashval[ md6_c*(md6_w/8) ];
      /* e.g. unsigned char hashval[128]                           */
      /* contains hashval after call to md6_final                  */
      /* hashval appears in first floor(d/8) bytes, with           */
      /* remaining (d mod 8) bits (if any) appearing in            */
      /* high-order bit positions of hashval[1+floor(d/8)].        */

  unsigned char hexhashval[(md6_c*(md6_w/8))+1];
      /* e.g. unsigned char hexhashval[129];                       */
      /* zero-terminated string representing hex value of hashval  */

  int initialized;         /* zero, then one after md6_init called */
  uint64_t bits_processed;                /* bits processed so far */
  uint64_t compression_calls;    /* compression function calls made*/
  int finalized;          /* zero, then one after md6_final called */

  md6_word K[ md6_k ];  
      /* k-word (8 word) key (aka "salt") for this instance of md6 */
  int keylen;
      /* number of bytes in key K. 0<=keylen<=k*(w/8)              */

  int L;
      /* md6 mode specification parameter. 0 <= L <= 255           */
      /* L == 0 means purely sequential (Merkle-Damgaard)          */
      /* L >= 29 means purely tree-based                           */
      /* Default is md6_default_L = 64 (hierarchical)              */

  int r;
      /* Number of rounds. 0 <= r <= 255                           */

  int top;
      /* index of block corresponding to top of stack              */

  md6_word B[ md6_max_stack_height ][ md6_b ];
      /* md6_word B[29][64]                                        */
      /* stack of 29 64-word partial blocks waiting to be          */
      /* completed and compressed.                                 */
      /* B[1] is for compressing text data (input);                */
      /* B[ell] corresponds to node at level ell in the tree.      */

  unsigned int bits[ md6_max_stack_height ];    
      /* bits[ell] =                                               */
      /*    number of bits already placed in B[ell]                */
      /*    for 1 <= ell < max_stack_height                        */
      /* 0 <= bits[ell] <= b*w                                     */

  uint64_t i_for_level[ md6_max_stack_height ];
      /* i_for_level[ell] =                                        */
      /*    index of the node B[ ell ] on this level (0,1,...)     */
      /* when it is output   */

} md6_state;
/* MD6 main interface routines
**
** These routines are defined in md6_mode.c
*/

/* The next routines are used according to the pattern:
**    md6_init        (or md6_full_init if you use additional parameters) 
**    md6_update         (once for each portion of the data to be hashed)
**    md6_final                           (to finish up hash computation)
** Note: md6_final can return the hash value to a desired location, but
** hash value also remains available inside the md6_state, in both binary
** and hex formats (st->hashval and st->hexhashval).
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
		       uint64_t databitlen       /* its length in bits */
		       );

extern int md6_final( md6_state *st,            /* initialized/updated */
		      unsigned char *hashval       /* output; NULL OK  */
		      );

/* MD6 main interface routines
**
** These routines are defined in md6_mode.c
**
** These routines compute a hash for a message given all at once.    
** The resulting hash value is returned to a specified location.
** Only one call is needed.  Use md6_hash for the standard md6 hash,
** and md6_full_hash if you want to specify additional parameters.
*/

extern int md6_hash( int d,                         /* hash bit length */
		     unsigned char *data,     /* complete data to hash */
		     uint64_t databitlen,        /* its length in bits */
		     unsigned char *hashval                 /* output */
		     );

extern int md6_full_hash( int d,                    /* hash bit length */
			  unsigned char *data,/* complete data to hash */
			  uint64_t databitlen,   /* its length in bits */
			  unsigned char *key,       /* OK to give NULL */
			  int keylen,       /* (in bytes) OK to give 0 */
			  int L,     /* mode; OK to give md6_default_L */
			  int r,                   /* number of rounds */
			  unsigned char *hashval             /* output */
			  );


/* MD6 return codes.
**
** The interface routines defined in md6_mode.c always return a
** "return code": an integer giving the status of the call.
** The codes
** SUCCESS, FAIL, and BADHASHLEN same as for NIST API
*/

/* SUCCESS:  */
#define MD6_SUCCESS 0

/* ERROR CODES: */
#define MD6_FAIL 1           /* some other problem                     */
#define MD6_BADHASHLEN 2     /* hashbitlen<1 or >512 bits              */
#define MD6_NULLSTATE 3      /* null state passed to MD6               */
#define MD6_BADKEYLEN 4      /* key length is <0 or >512 bits          */
#define MD6_STATENOTINIT 5   /* state was never initialized            */
#define MD6_STACKUNDERFLOW 6 /* MD6 stack underflows (shouldn't happen)*/
#define MD6_STACKOVERFLOW 7  /* MD6 stack overflow (message too long)  */
#define MD6_NULLDATA 8       /* null data pointer                      */
#define MD6_NULL_N 9         /* compress: N is null                    */
#define MD6_NULL_B 10        /* standard compress: null B pointer      */
#define MD6_BAD_ELL 11       /* standard compress: ell not in {0,255}  */
#define MD6_BAD_p 12         /* standard compress: p<0 or p>b*w        */
#define MD6_NULL_K 13        /* standard compress: K is null           */
#define MD6_NULL_Q 14        /* standard compress: Q is null           */
#define MD6_NULL_C 15        /* standard compress: C is null           */
#define MD6_BAD_L 16         /* standard compress: L <0 or > 255       */ 
                             /* md6_init: L<0 or L>255                 */
#define MD6_BAD_r 17         /* compress: r<0 or r>255                 */
                             /* md6_init: r<0 or r>255                 */
#define MD6_OUT_OF_MEMORY 18 /* compress: storage allocation failed    */


/* The following code confirms that the defined MD6 constants satisfy 
** some expected properties.  These tests should never fail; consider 
** these tests to be documentation. Failure of these tests would cause 
** compilation to fail.
*/

#if ( (md6_w!=8) && (md6_w!=16) && (md6_w!=32) && (md6_w!=64) )
  #error "md6.h Fatal error: md6_w must be one of 8,16,32, or 64."
#elif ( md6_n<=0 )
  #error "md6.h Fatal error: md6_n must be positive."
#elif ( md6_b<=0 )
  #error "md6.h Fatal error: md6_b must be positive."
#elif ( md6_c<=0 )
  #error "md6.h Fatal error: md6_c must be positive."
#elif ( md6_v<0 )
  #error "md6.h Fatal error: md6_v must be nonnegative."
#elif ( md6_u<0 )
  #error "md6.h Fatal error: md6_u must be nonnegative."
#elif ( md6_k<0 )
  #error "md6.h Fatal error: md6_k must be nonnegative."
#elif ( md6_q<0 )
  #error "md6.h Fatal error: md6_q must be nonnegative."
#elif ( md6_b>=md6_n )
  #error "md6.h Fatal error: md6_b must be smaller than md6_n."
#elif ( md6_c>=md6_b )
  #error "md6.h Fatal error: md6_c must be smaller than md6_b."
#elif ( (md6_b%md6_c)!=0 )
  #error "md6.h Fatal error: md6_b must be a multiple of md6_c."
#elif ( md6_n != md6_b + md6_v + md6_u + md6_k + md6_q )
  #error "md6.h Fatal error: md6_n must = md6_b + md6_v + md6_u + md6_k + md6_q."
#elif ( md6_max_stack_height < 3 )
  #error "md6.h Fatal error: md6_max_stack_height must be at least 3."
#elif ( md6_r * md6_c + md6_n >= 5000 )
  /* since md6_standard_compress allocates fixed-size array A[5000] */
  #error "md6.h Fatal error: r*c+n must be < 5000."
#if 0
  /* "sizeof" doesn't work in preprocessor, these checks don't work */
  #elif ( (md6_v != 0) && (md6_v != (sizeof(md6_control_word)/(md6_w/8))) )
    #error "md6.h Fatal error: md6_v must be 0 or match md6_control_word size."
  #elif ( (md6_u != 0) && (md6_u != (sizeof(md6_nodeID)/(md6_w/8))) )
    #error "md6.h Fatal error: md6_u must be 0 or match md6_nodeID size."
#endif
#endif


/* Debugging and testing.
*/

/* compression hook, if defined, points to a function that is 
** called after each compression operation.                             
**
** compression hook must be set *after* md6_init or md6_full_init 
** is called.
*/

void (* compression_hook)(md6_word *C,
			  const md6_word *Q,
			  md6_word *K,
			  int ell,
			  int i,
			  int r,
			  int L,
			  int z,
			  int p,
			  int keylen,
			  int d,
			  md6_word *N
			  );

/* end of #ifndef MD6_H_INCLUDED for multiple inclusion protection
*/
#endif

/* end of md6.h */
