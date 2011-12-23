/* File:    md6_compress.c
** Author:  Ronald L. Rivest
**          (with optimizations by Jayant Krishnamurthy)
** Address: Room 32G-692 Stata Center 
**          32 Vassar Street 
**          Cambridge, MA 02139
** Email:   rivest@mit.edu
** Date:    9/25/2008
**
** (The following license is known as "The MIT License")
** 
** Copyright (c) 2008 Ronald L. Rivest and Jayant Krishnamurthy
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
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "md6.h"

/* Useful macros: min and max */
#ifndef min
#define min(a,b) ((a)<(b)? (a) : (b))
#endif
#ifndef max
#define max(a,b) ((a)>(b)? (a) : (b))
#endif

/* Variables defining lengths of various values */
#define   w   md6_w  /* # bits in a word (64) */
#define   n   md6_n  /* # words in compression input (89) */
#define   c   md6_c  /* # words in compression output (16) */
#define   b   md6_b  /* # message words per compression input block (64) */
#define   v   md6_v  /* # words in control word (1) */
#define   u   md6_u  /* # words in unique nodeID (1) */
#define   k   md6_k  /* # key words per compression input block (8) */
#define   q   md6_q  /* # Q words per compression input block (15) */


/* "Tap positions" for feedback shift-register */

#if (n==89)
#define  t0   17     /* index for linear feedback */
#define  t1   18     /* index for first input to first and */
#define  t2   21     /* index for second input to first and */
#define  t3   31     /* index for first input to second and */
#define  t4   67     /* index for second input to second and */
#define  t5   89     /* last tap */
#endif

/* Loop-unrolling setup.
**
** Define macros for loop-unrolling within compression function 
** These expand to:     loop_body(right-shift,left-shift,step)      
** These are given for word sizes 64, 32, 16, and 8, although   
** only w=64 is needed for the standard MD6 definition.         
**                                                              
** Also given for each word size are the constants S0 and Smask 
** needed in the recurrence for round constants.                
*/

#if (w==64)                        /* for standard word size */
#define RL00 loop_body(10,11, 0)
#define RL01 loop_body( 5,24, 1)
#define RL02 loop_body(13, 9, 2)
#define RL03 loop_body(10,16, 3)
#define RL04 loop_body(11,15, 4)
#define RL05 loop_body(12, 9, 5)
#define RL06 loop_body( 2,27, 6)
#define RL07 loop_body( 7,15, 7)
#define RL08 loop_body(14, 6, 8)
#define RL09 loop_body(15, 2, 9)
#define RL10 loop_body( 7,29,10)
#define RL11 loop_body(13, 8,11)
#define RL12 loop_body(11,15,12)
#define RL13 loop_body( 7, 5,13)
#define RL14 loop_body( 6,31,14)
#define RL15 loop_body(12, 9,15)

const md6_word S0 = (md6_word)0x0123456789abcdefULL;
const md6_word Smask = (md6_word)0x7311c2812425cfa0ULL;

#elif (w==32)                      /* for variant word size */
#define RL00 loop_body( 5, 4, 0)
#define RL01 loop_body( 3, 7, 1)
#define RL02 loop_body( 6, 7, 2)
#define RL03 loop_body( 5, 9, 3)
#define RL04 loop_body( 4,13, 4)
#define RL05 loop_body( 6, 8, 5)
#define RL06 loop_body( 7, 4, 6)
#define RL07 loop_body( 3,14, 7)
#define RL08 loop_body( 5, 7, 8)
#define RL09 loop_body( 6, 4, 9)
#define RL10 loop_body( 5, 8,10)
#define RL11 loop_body( 5,11,11)
#define RL12 loop_body( 4, 5,12)
#define RL13 loop_body( 6, 8,13)
#define RL14 loop_body( 7, 2,14)
#define RL15 loop_body( 5,11,15)

const md6_word S0 = (md6_word)0x01234567UL;
const md6_word Smask = (md6_word)0x7311c281UL;

/* Loop-unrolling setup (continued).
**
*/

#elif (w==16)                      /* for variant word size */

#define RL00 loop_body( 5, 6, 0)
#define RL01 loop_body( 4, 7, 1)
#define RL02 loop_body( 3, 2, 2)
#define RL03 loop_body( 5, 4, 3)
#define RL04 loop_body( 7, 2, 4)
#define RL05 loop_body( 5, 6, 5)
#define RL06 loop_body( 5, 3, 6)
#define RL07 loop_body( 2, 7, 7)
#define RL08 loop_body( 4, 5, 8)
#define RL09 loop_body( 3, 7, 9)
#define RL10 loop_body( 4, 6,10)
#define RL11 loop_body( 3, 5,11)
#define RL12 loop_body( 4, 5,12)
#define RL13 loop_body( 7, 6,13)
#define RL14 loop_body( 7, 4,14)
#define RL15 loop_body( 2, 3,15)

const md6_word S0 = (md6_word)0x01234;
const md6_word Smask = (md6_word)0x7311;

#elif (w==8)                     /* for variant word size */

#define RL00 loop_body( 3, 2, 0)
#define RL01 loop_body( 3, 4, 1)
#define RL02 loop_body( 3, 2, 2)
#define RL03 loop_body( 4, 3, 3)
#define RL04 loop_body( 3, 2, 4)
#define RL05 loop_body( 3, 2, 5)
#define RL06 loop_body( 3, 2, 6)
#define RL07 loop_body( 3, 4, 7)
#define RL08 loop_body( 2, 3, 8)
#define RL09 loop_body( 2, 3, 9)
#define RL10 loop_body( 3, 2,10)
#define RL11 loop_body( 2, 3,11)
#define RL12 loop_body( 2, 3,12)
#define RL13 loop_body( 3, 4,13)
#define RL14 loop_body( 2, 3,14)
#define RL15 loop_body( 3, 4,15)

const md6_word S0 = (md6_word)0x01;
const md6_word Smask = (md6_word)0x73;

#endif

/* Main compression loop.
**
*/

void md6_main_compression_loop( md6_word* A , int r )
/*
** Perform the md6 "main compression loop" on the array A.
** This is where most of the computation occurs; it is the "heart"
** of the md6 compression algorithm.
** Input:
**     A                  input array of length t+n already set up
**                        with input in the first n words.
**     r                  number of rounds to run (178); each is c steps
** Modifies:
**     A                  A[n..r*c+n-1] filled in.
*/
{ md6_word x, S;
  int i,j;

  /*
  ** main computation loop for md6 compression
  */
  S = S0;
  for (j = 0, i = n; j<r*c; j+=c)
    {

/* ***************************************************************** */
#define loop_body(rs,ls,step)                                       \
      x = S;                                /* feedback constant     */ \
      x ^= A[i+step-t5];                    /* end-around feedback   */ \
      x ^= A[i+step-t0];                    /* linear feedback       */ \
      x ^= ( A[i+step-t1] & A[i+step-t2] ); /* first quadratic term  */ \
      x ^= ( A[i+step-t3] & A[i+step-t4] ); /* second quadratic term */ \
      x ^= (x >> rs);                       /* right-shift           */ \
      A[i+step] = x ^ (x << ls);            /* left-shift            */   
/* ***************************************************************** */

      /*
      ** Unroll loop c=16 times. (One "round" of computation.)
      ** Shift amounts are embedded in macros RLnn.
      */
      RL00 RL01 RL02 RL03 RL04 RL05 RL06 RL07
      RL08 RL09 RL10 RL11 RL12 RL13 RL14 RL15

      /* Advance round constant S to the next round constant. */
      S = (S << 1) ^ (S >> (w-1)) ^ (S & Smask);
      i += 16;
    }
}

/* ``Bare'' compression routine.
**
** Compresses n-word input to c-word output.
*/

int md6_compress( md6_word *C,
		  md6_word *N,
		  int r,
		  md6_word *A
		 )
/* Assumes n-word input array N has been fully set up.
** Input:
**   N               input array of n w-bit words (n=89)
**   A               working array of a = rc+n w-bit words
**                   A is OPTIONAL, may be given as NULL 
**                   (then md6_compress allocates and uses its own A).
**   r               number of rounds            
** Modifies:
**   C               output array of c w-bit words (c=16)
** Returns one of the following:
**   MD6_SUCCESS (0)    
**   MD6_NULL_N         
**   MD6_NULL_C         
**   MD6_BAD_r          
**   MD6_OUT_OF_MEMORY  
*/
{ md6_word* A_as_given = A;

  /* check that input is sensible */
  if ( N == NULL) return MD6_NULL_N;
  if ( C == NULL) return MD6_NULL_C;
  if ( r<0 || r > md6_max_r) return MD6_BAD_r;

  if ( A == NULL) A = (md6_word*)calloc(r*c+n,sizeof(md6_word));
  if ( A == NULL) return MD6_OUT_OF_MEMORY;

  memcpy( A, N, n*sizeof(md6_word) );    /* copy N to front of A */

  md6_main_compression_loop( A, r );          /* do all the work */

  memcpy( C, A+(r-1)*c+n, c*sizeof(md6_word) ); /* output into C */

  if ( A_as_given == NULL )           /* zero and free A if nec. */
    { memset(A,0,(r*c+n)*sizeof(md6_word)); /* contains key info */
      free(A);           
    }

  return MD6_SUCCESS;
}

/* Control words.
*/

md6_control_word md6_make_control_word(	int r, 
					int L, 
					int z, 
					int p, 
					int keylen, 
					int d 
					)
/* Construct control word V for given inputs.
** Input:
**   r = number of rounds
**   L = mode parameter (maximum tree height)
**   z = 1 iff this is final compression operation
**   p = number of pad bits in a block to be compressed
**   keylen = number of bytes in key
**   d = desired hash output length
**   Does not check inputs for validity.
** Returns:
**   V = constructed control word
*/
{ md6_control_word V;
  V = ( (((md6_control_word) 0) << 60) | /* reserved, width  4 bits */
	(((md6_control_word) r) << 48) |           /* width 12 bits */
	(((md6_control_word) L) << 40) |           /* width  8 bits */
	(((md6_control_word) z) << 36) |           /* width  4 bits */
	(((md6_control_word) p) << 20) |           /* width 16 bits */
	(((md6_control_word) keylen) << 12 ) |     /* width  8 bits */
        (((md6_control_word) d)) );                /* width 12 bits */
  return V;
}

/* Node ID's.
*/

md6_nodeID md6_make_nodeID( int ell,                     /* level number */
			      int i    /* index (0,1,2,...) within level */
			    )
/* Make "unique nodeID" U based on level ell and position i 
** within level; place it at specified destination.
** Inputs:
**    dest = address of where nodeID U should be placed
**    ell = integer level number, 1 <= ell <= ...
**    i = index within level, i = 0, 1, 2,...
** Returns
**    U = constructed nodeID
*/
{ md6_nodeID U;
  U = ( (((md6_nodeID) ell) << 56) | 
	((md6_nodeID) i) );
  return U;
}

/* Assembling components of compression input.
*/

void md6_pack( md6_word*N,
	       const md6_word* Q,
	       md6_word* K,
	       int ell, int i,
	       int r, int L, int z, int p, int keylen, int d,
	       md6_word* B )
/* Pack data before compression into n-word array N.
*/
{ int j;
  int ni;
  md6_nodeID U;
  md6_control_word V;    

  ni = 0;

  for (j=0;j<q;j++) N[ni++] = Q[j];       /* Q: Q in words     0--14 */

  for (j=0;j<k;j++) N[ni++] = K[j];       /* K: key in words  15--22 */

  U = md6_make_nodeID(ell,i);             /* U: unique node ID in 23 */
  /* The following also works for variants 
  ** in which u=0.
  */
  memcpy((unsigned char *)&N[ni],
	 &U,
	 min(u*(w/8),sizeof(md6_nodeID)));
  ni += u;

  V = md6_make_control_word(
			r,L,z,p,keylen,d);/* V: control word in   24 */
  /* The following also works for variants
  ** in which v=0.
  */
  memcpy((unsigned char *)&N[ni],
	 &V,
	 min(v*(w/8),sizeof(md6_control_word)));
  ni += v;

  memcpy(N+ni,B,b*sizeof(md6_word));      /* B: data words    25--88 */
}
	       
/* Standard compress: assemble components and then compress
*/

int md6_standard_compress( md6_word* C,
			   const md6_word* Q,
			   md6_word* K,
			   int ell, int i,
			   int r, int L, int z, int p, int keylen, int d,
			   md6_word* B 
			   )
/* Perform md6 block compression using all the "standard" inputs.
** Input:
**     Q              q-word (q=15) approximation to (sqrt(6)-2)
**     K              k-word key input (k=8)
**     ell            level number
**     i              index within level
**     r              number of rounds in this compression operation
**     L              mode parameter (max tree height)
**     z              1 iff this is the very last compression
**     p              number of padding bits of input in payload B
**     keylen         number of bytes in key
**     d              desired output hash bit length
**     B              b-word (64-word) data input block (with zero padding)
** Modifies:
**     C              c-word output array (c=16)
** Returns one of the following:
**   MD6_SUCCESS (0)   MD6_BAD_p
**   MD6_NULL_B        MD6_BAD_HASHLEN
**   MD6_NULL_C        MD6_NULL_K
**   MD6_BAD_r         MD6_NULL_Q
**   MD6_BAD_ELL       MD6_OUT_OF_MEMORY
*/
{ md6_word N[md6_n];
  md6_word A[5000];       /* MS VS can't handle variable size here */

  /* check that input values are sensible */
  if ( (C == NULL) ) return MD6_NULL_C;
  if ( (B == NULL) ) return MD6_NULL_B;
  if ( (r<0) | (r>md6_max_r) ) return MD6_BAD_r;
  if ( (L<0) | (L>255) ) return MD6_BAD_L;
  if ( (ell < 0) || (ell > 255) ) return MD6_BAD_ELL;
  if ( (p < 0) || (p > b*w ) ) return MD6_BAD_p;
  if ( (d <= 0) || (d > c*w/2) ) return MD6_BADHASHLEN;
  if ( (K == NULL) ) return MD6_NULL_K;
  if ( (Q == NULL) ) return MD6_NULL_Q;

  /* pack components into N for compression */
  md6_pack(N,Q,K,ell,i,r,L,z,p,keylen,d,B);

  /* call compression hook if it is defined. */
  /* -- for testing and debugging.           */
  if (compression_hook != NULL)
    compression_hook(C,Q,K,ell,i,r,L,z,p,keylen,d,B);

  return md6_compress(C,N,r,A);
}
/* end of md6_compress.c */
