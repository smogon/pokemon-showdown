/* File:    md6sum.c
** Author:  Ronald L. Rivest
** Address: Room 32G-692 Stata Center 
**          32 Vassar Street 
**          Cambridge, MA 02139
** Email:   rivest@mit.edu
** Date:    10/24/2008
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
** This is an application illustrating the use of the MD6 hash function.
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
**   4/15/09: In routine optr, test 
**              if ( r<0 || r>255 ) 
**            replaced with
**              if ( ropt<0 || ropt>255 )
**            This is a very minor correction, which would only have
**            relevance if an illegal "-r" option were input.
**            Thanks for R.L. Vaughn for discovering this error.
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <time.h>
#include <assert.h>

#include "md6.h"

/* Cycle count routines */

#if defined _MSC_VER

/* Microsoft */
#include <intrin.h>
#pragma intrinsic(__rdtsc)
uint64_t ticks()
{
  return __rdtsc();
}

#else 

/* GCC */
#include <stdint.h>
inline uint64_t ticks() {
  /* read timestamp counter */
  uint32_t lo, hi;
  asm volatile (
		"xorl %%eax,%%eax \n        cpuid"
		::: "%rax", "%rbx", "%rcx", "%rdx");
  asm volatile ("rdtsc" : "=a" (lo), "=d" (hi));
  return (uint64_t)hi << 32 | lo;
} 

#endif

 /* Constants for MD6 */

#define w  md6_w
#define c  md6_c
#define n  md6_n
#define b  md6_b
#define u  md6_u
#define v  md6_v
#define k  md6_k
#define q  md6_q

/* Useful macros: min and max */
#ifndef min
#define min(a,b) ((a)<(b)? (a) : (b))
#endif
#ifndef max
#define max(a,b) ((a)>(b)? (a) : (b))
#endif

/* MD6 parameters */
int d;                    /* digest length */
int L;                    /* mode parameter */
int r;                    /* number of rounds */
int use_default_r;        /* 1 if r should be set to the default, 0 if r is explicitly provided */
unsigned char K[100];     /* key */
int keylen;               /* key length in bytes (at most 64) */
md6_state st;             /* md6 computation state */

char msg[5000];           /* message to be hashed (if given with -M) */
int msglenbytes;          /* message length in bytes */

char help_string[] = 
"md6sum [OPTIONS] file1 file2 ...\n"
"Options:\n"
"\t(option letters are case-sensitive and processed in order):\n"
"\t-bnnnn\tHash a dummy file of length nnnn bits.\n"
"\t-Bnnnn\tHash a dummy file of length nnnn bytes.\n"
"\t-c xxxx\tCheck hash from file xxxx to see if they are still valid.\n"
"\t\tHere xxxx is saved output from previous run of md6sum.\n"
"\t\tNames of files whose hash value have changed are printed.\n"
"\t-dnnn\tSet digest length d to nnn bits, 1<=nnn<=512; default is 256.\n"
"\t\tAlso adjusts number r of rounds.\n"
"\t-h\tPrint this help information.\n"
"\t-i\tPrint input/output data for each compression function call.\n"
"\t-I\tLike -i, but also prints out all intermediate values computed.\n"
"\t-Kxxxxx\tSet MD6 key to xxxxx (length 0 to 64 bytes).\n"
"\t\tAlso adjusts number r of rounds.\n"
"\t-Lnn\tSet MD6 mode parameter L to nn (0<=L<=64; default 64).\n"
"\t-Mxxxxx\tCompute hash of message xxxxx.\n"
"\t-rnnn\tSet MD6 number r of rounds to nn (0<=r<=255; default is 40+(d/4).\n"
"\t-snnn\tMeasure time to perform nnn MD6 initializations (nnn optional).\n"
"\t-t\tTurn on printing of elapsed times and bytes/second.\n"
"For each file given, md6sum prints a line of the form: \n"
"\thashvalue filename\n"
"If file is `-', or if no files are given, standard input is used.\n"
"Integers nnnn may use scientific notation, e.g. -B1e9 .\n"
;

/* return integer starting at s (input presumed to end with '\n')
** (It may be expressed in exponential format e.g. 1e9.)
*/

uint64_t get_int(char *s)
{ long double g;
  sscanf(s,"%Lg",&g);
  return (uint64_t)g;
}

/* routines to escape/unescape filenames, in case they
** contain backslash or \n 's.
*/

void encode(char *s, char *t)
/* input t, output s -- recode t so it all newlines and 
** backslashes are escaped as \n and \\ respectively.
** Also, a leading '-' is escaped to \-.
*/
{ if (*t && *t=='-')
    { *s++ = '\\'; *s++ = '-'; t++; }
  while (*t)
    { if (*t=='\\')      { *s++ = '\\'; *s++ = '\\'; }     
      else if (*t=='\n') { *s++ = '\\'; *s++ = 'n';  }
      else               *s++ = *t;
      t++;
    }
  *s = 0;
  return;
}

void decode(char *s, char *t)
/* inverse of encode -- s is unescaped version of t. */
{ while (*t)
    { if (*t == '\\')
	{ if (*(t+1)=='\\')     { *s++ = '\\'; t+=1; }
	  else if (*(t+1)=='n') { *s++ = '\n'; t+=1; } 
	  else if (*(t+1)=='-') { *s++ = '-'; t+=1; }
	  else if (*(t+1)==0)   { *s++ = '\\'; }
	  else                  { *s++ = *t; }
	}
      else *s++ = *t;
      t++;
    }
  *s = 0;
  return;
}

/* timing variables and routines */

double start_time;
double end_time;
uint64_t start_ticks;
uint64_t end_ticks;

void start_timer()
{
  start_time = ((double)clock())/CLOCKS_PER_SEC;
  start_ticks = ticks();
}

void end_timer()
{
  end_time = ((double)clock())/CLOCKS_PER_SEC;
  end_ticks = ticks();
}

int print_times = 0;

void print_time()
{ double elapsed_time = end_time - start_time;
  uint64_t elapsed_ticks = end_ticks - start_ticks;
  uint64_t bytes = st.bits_processed/8;
  int bits = st.bits_processed % 8;
  if (!print_times) return;
  printf("-- Length = ");
  if (st.bits_processed==0) printf("0");
  if (bytes>0) printf("%g byte",(double)bytes);
  if (bytes>1) printf("s");
  if (bytes>0 && bits>0) printf(" + ");
  if (bits>0) printf("%d bit",bits);
  if (bits>1) printf("s");
  printf("\n");
  printf("-- Compression calls made = %g\n",(double)st.compression_calls);
  if (elapsed_time == 0.0)
    printf("-- Elapsed time too short to measure...\n");
  else
    { printf("-- Elapsed time = %.3f seconds.\n", elapsed_time);
      printf("-- Megabytes per second = %g.\n",
	     (bytes/elapsed_time)/1000000.0);
      printf("-- Microseconds per compression function = %g.\n",
	     (elapsed_time*1.0e6 / st.compression_calls ));
    }
  printf("-- Total clock ticks = %lld\n",
	 (long long int)elapsed_ticks);
  if (bytes>0)
    printf("-- Clock ticks / byte = %lld\n",
	   (long long int)(elapsed_ticks/bytes));
  printf("-- Clock ticks / compression function call = %lld\n",
	 (long long int)(elapsed_ticks/st.compression_calls));
}

 /* testing and debugging */

/* Global variables used by compression_hook_1 */
FILE *outFile = NULL;
int  print_input_output = 0;
int  print_intermediate = 0;

void compression_hook_1(md6_word *C,
			const md6_word *Q,
			md6_word *K,
			int ell,
			int ii,
			int r,
			int L,
			int z,
			int p,
			int keylen,
			int d,
			md6_word *B
)
{ int i;
  md6_word A[5000];
  time_t now;

  md6_pack(A,Q,K,ell,ii,r,L,z,p,keylen,d,B);

  md6_main_compression_loop( A, r);

  if (ell==1 && ii==0)
    { time(&now);
      fprintf(outFile,"-- d = %6d (digest length in bits)\n",d);
      fprintf(outFile,"-- L = %6d (number of parallel passes)\n",L);
      fprintf(outFile,"-- r = %6d (number of rounds)\n",r);
      /* print key out as chars, since for md6sum it is essentially
      ** impossible to enter non-char keys...
      */
      fprintf(outFile,"-- K = '");
      for (i=0;i<keylen;i++) 
	fprintf(outFile,"%c",(int)(K[i/(w/8)]>>8*(7-(i%(w/8))))&0xff);
      fprintf(outFile,"' (key)\n");
      fprintf(outFile,"-- k = %6d (key length in bytes)\n",keylen);
      fprintf(outFile,"\n");
    }

  fprintf(outFile,"MD6 compression function computation ");
  fprintf(outFile,"(level %d, index %d):\n",ell,ii);
  fprintf(outFile,"Input (%d words):\n",n);

  for (i=0;i<r*c+n;i++)
    {
      if ((i<q))
	{ fprintf(outFile,"A[%4d] = " PR_MD6_WORD,i,A[i]);
	  fprintf(outFile," Q[%d]\n",i);
	}
      else if ((i>=q)&&(i<q+k))
	{ fprintf(outFile,"A[%4d] = " PR_MD6_WORD,i,A[i]);
	  fprintf(outFile," key K[%d]\n",i-q);
	}
      else if ((u>0)&&(i==q+k+u-1))
	{ fprintf(outFile,"A[%4d] = " PR_MD6_WORD,i,A[i]);
	  fprintf(outFile," nodeID U = (ell,i) = (%d,%d)\n",ell,ii);
	}
      else if ((v>0)&&(i==q+k+u+v-1))
	{ fprintf(outFile,"A[%4d] = " PR_MD6_WORD,i,A[i]);
	  fprintf(outFile," control word V = "
		          "(r,L,z,p,keylen,d) = "
		  "(%d,%d,%d,%d,%d,%d)\n",r,L,z,p,keylen,d);
	}
      else if ((i>=q+k+u+v)&&(i<n))
	{ fprintf(outFile,"A[%4d] = " PR_MD6_WORD,i,A[i]);
	  fprintf(outFile," data B[%2d] ",i-q-k-u-v);
	  if (ell < L+1) /* PAR node */
	    { if (ell == 1)
		{ if ( (i+(p/w))<n )
		    fprintf(outFile,"input message word %4d",
			    ii*b+(i-(q+k+u+v)));
		  else
		    fprintf(outFile,"padding");
		}
	      else
		if ( (i+(p/w))< n )
		  fprintf(outFile,
			  "chaining from (%d,%d)",
			  ell-1,
			  4*ii+(i-(q+k+u+v))/c);
		else 
		  fprintf(outFile,"padding");
	    }
	  else /* SEQ node: ell == L+1 */
	    { if (i-(q+k+u+v)<c) /* initial portion: IV or chaining */
		{ if (ii == 0)
		    fprintf(outFile,"IV");
		  else
		    fprintf(outFile,"chaining from (%d,%d)",ell,ii-1);
		}
	      else /* data, chaining from below, or padding */
		{ if (i+(p/w)>=n)
		    fprintf(outFile,"padding");
		  else if (ell == 1)
		    fprintf(outFile,"input message word %4d",
			    ii*(b-c)+(i-(q+k+u+v+c)));
		  else 
		    fprintf(outFile,
			    "chaining from (%d,%d)",
			    ell-1,
			    3*ii+(i-(q+k+u+v+c))/c);
		}
	    }
	  fprintf(outFile,"\n");
	}
      else if ((i>=r*c+n-c))
	{ if ((i==r*c+n-c))
	    fprintf(outFile,"Output (%d words of chaining values):\n",c);
	  fprintf(outFile,"A[%4d] = " PR_MD6_WORD,i,A[i]);
	  fprintf(outFile," output chaining value C[%d]\n",i-(r*c+n-c));
	}
      else 
	{ if (i==n)
	    { if (print_intermediate)
		fprintf(outFile,"Intermediate values:\n");
	      else
		fprintf(outFile,
			"Intermediate values A[%d..%d] omitted... "
			"\n",n,r*c+n-c-1);
	    }
	  if (print_intermediate)
	    fprintf(outFile,"A[%4d] = " PR_MD6_WORD "\n",i,A[i]);
	}
    }
  fprintf(outFile,"\n");
}

/* interface to hash routines
*/

void hash_init()
{ int err;
  start_timer();
  if ((err=md6_full_init(&st,d,K,keylen,L,r)))
    { printf("Bad MD6 parameters; can't initialize md6. "
	     "errcode = %d\n",err);
      return;
    }
  if (print_input_output)
    compression_hook = compression_hook_1;
}

void hash_update(char* data, 
		 uint64_t databitlen)
{ int err;
  if ((err=md6_update(&st, 
		      (unsigned char *)data, 
		      databitlen)))
    { printf("MD6 update error. error code: %d\n",err);
      return;
    }
}

void hash_final()
{ int err;
  if ((err=md6_final(&st,NULL)))
    { printf("MD6 finalization error. error code: %d\n",err);
      return;
    }
  end_timer();
}

void hash_filep(FILE *inFile)
{ uint64_t bytes;
  char data[1024];
  if (inFile==NULL)
    { printf("hash_filep has NULL input file pointer.\n");
      return;
    }
  hash_init();
  while ((bytes = fread (data, 1, 1024, inFile)) != 0)
    hash_update(data,bytes*8);
  hash_final();
}

void hash_stdin()
{ hash_filep(stdin);
}

void hash_file( char *filename )
{ FILE *inFile = fopen (filename, "rb");
  if ( inFile == NULL ) 
    { printf("%s can't be opened.\n", filename);
      return;
    }
  hash_filep(inFile);
  fclose(inFile);
}

void hash_b(uint64_t bitlen)
/* Hash dummy input file of length bitlen bits.
** File (hex) repeats with period 7:
**   11 22 33 44 55 66 77 11 22 33 44 55 66 77 11 22 33 ...
*/
{ int i;
  char data[700];  /* nice if length is multiple of 7 for periodicity */
  for (i=0;i<700;i++)
    data[i] =  0x11 + (char)((i % 7)*(0x11));
  hash_init();
  while (bitlen>0)
    { uint64_t part_len = min(700*8,bitlen);
      hash_update(data,part_len);
      bitlen = bitlen - part_len;
    }
  hash_final();
}

void hash_B(uint64_t B)
/* Hash dummy input file of length B bytes.
*/
{ hash_b(B*8);
}

/* Routines to handle command-line options
*/

void optd(char *optstr)
{ /* set MD6 digest length 
  ** -dnn sets digest length to nn, 1 <= nn <= 512 
  */ 
  int dopt = get_int(optstr+2);
  if (dopt<1 || dopt>512)
    printf("Illegal digest size option %s ignored.\n",optstr);
  else
    d = dopt;
  if (use_default_r) {
    r = md6_default_r(d,keylen);
  }
}

void opth()
{ /* print md6sum help string */
  printf(help_string);
}

void optK(char *optstr)
{ /* set MD6 key */
  optstr += 2;
  keylen = 0;
  while (*optstr && keylen<64) K[keylen++] = *optstr++;
  K[keylen] = 0;
  if (use_default_r) {
    r = md6_default_r(d,keylen);
  }
}

void optL(char *optstr)
{ /* set MD6 mode parameter
  ** -Lnn where 0<=n<=64
  ** nn = 0 means fully sequential
  ** nn = 64 means fully hierarchical
  ** intermediate values give a blended approach
  */
  int Lopt = get_int(optstr+2);
  if (Lopt<0 || Lopt>64)
    printf("Illegal L options %s ignored.\n",optstr);
  else
    L = Lopt;
}

void optr(char *optstr)
{ /* set MD6 number of rounds
  ** -rnn where 0<=r<=255
  */
  int ropt = get_int(optstr+2);
  /* Following line was changed 4/15/09 to replace two
  ** occurrences of variable "r" with variable "ropt".
  ** (Thanks to R.L. Vaughn for discovering this error.)
  */     
  if (ropt<0 || ropt>255)
    printf("Illegal r options %s ignored.\n",optstr);
  else {
    r = ropt;
    use_default_r = 0;
  }
    
}

void optM(char *optstr)
{ /* hash a message given as a command-line argument */
  char *p = optstr + 2;
  msglenbytes = 0;
  while (*p && msglenbytes<4990) msg[msglenbytes++] = *p++;
  msg[msglenbytes] = 0;
  hash_init();
  hash_update(msg,msglenbytes*8);
  hash_final();
}

void optb(char *optstr)
/* -bnnnn hash dummy file of length nnnn bits */
{ 
  uint64_t bitlen = get_int(optstr+2);
  hash_b(bitlen);
}

void optB(char *optstr)
/* -Bnnnn hash dummy file of length nnnn bytes */
{ uint64_t B = get_int(optstr+2);
  hash_b(B*8);
}

void check_line(char *line)
/* print filename if its hash doesn't agree with what's given in line 
*/
{ char *x;
  char hexhashval[1000];
  int hexhashlen;
  char filename[1000];
  char decfilename[1000];
  int filenamelen;
  /* collect hash value */
  x = line;
  hexhashlen = 0;
  while (*x && *x!=' ' && hexhashlen<900) 
    hexhashval[hexhashlen++] = *x++;
  hexhashval[hexhashlen] = 0;
  if (*x != ' ')
    { printf("Badly formed hash check file line: %s\n",line);
      return;
    }
  x++;
  /* collect filename and decode it */
  filenamelen = 0;
  while (*x && *x != '\n' && filenamelen<900) 
    filename[filenamelen++] = *x++;
  filename[filenamelen] = 0;
  decode(decfilename,filename);
  if (filename[0]=='-')
    { /* handle "filenames" starting with '-' specially,
      ** even though legitimate filenames may start with '-'.
      */
      if (filenamelen==1) 
	return; 	/* skip standard input */
      switch( filename[1] )
	{ 
	case 'M': optM(decfilename); break;
	case 'b': optb(decfilename); break;
	case 'B': optB(decfilename); break;
	default: hash_file(decfilename); break;
	}
    }
  else
    { /* now compute hash of file */
      hash_file(decfilename);
    }
  if (strcmp(hexhashval,(char *)st.hexhashval)!=0)
    printf("%s\n",decfilename);
}

void optc(int argc, char **argv, int i)
/* Recompute hashes, and check them for current validity.
** -c file     causes hashes from given file to be checked.
**             (This file is e.g. output from previous run of md6sum.)
**             Names of files that's don't hash the same are printed.
*/
{
  FILE *checkfilep;
  char line[1000];

  if (i == argc-1)
    { printf("md6sum error: no file given for -c option.\n");
      return;
    }
  checkfilep = fopen(argv[i+1],"r");
  if (checkfilep==NULL)
    { printf("Hash check file %s can't be opened.\n",argv[i+1]);
      return;
    }
  while (fgets( line, 990, checkfilep))
    { if (strlen(line)==0) continue;
      line[strlen(line)-1] = 0; /* kill '\n' */
      if (line[0]=='-') /* handle md6sum option */
	{ if (strlen(line)==1) 
	    { printf("Hash check file contains illegal line with single '-'; ignored.\n");
	    }
	  switch ( line[1] )
	    { 
	    case 'd': optd(line); break;
	    case 'K': optK(line); break;
	    case 'L': optL(line); break;
	    case 'r': optr(line); break;
	    case ' ': break; /* ignore lines starting with '- ' or '--' */
	    case '-': break; 
	    default: printf("Unrecognized md6sum option in check file: %s\n",argv[i]);
 	             break;
	    };
	  continue;
	}
      /* now handle typical line with hash value */
      check_line(line);
    }
  fclose(checkfilep);
}

void optt()
/* turn on timing printout */
{
  print_times = 1;
}

/* Routine to print hashvalue filename line.
** Prints time_of_day first if it hasn't been printed already.
*/

int tod_printed = 0;

void print_tod()
{ /* print time-of-day if it hasn't been printed yet. */
  time_t now;
  if (!tod_printed)
    { time(&now);
      printf("-- %s",ctime(&now));
      tod_printed = 1;
    }
}

void opti()
/* turn on printing of input/output values for compression function calls */
{ print_tod();
  print_input_output = 1;
  outFile = stdout;
}

void optI()
/* turn on printing of input/output values AND intermediate values */
{ print_tod();
  print_input_output = 1;
  print_intermediate = 1;
  outFile = stdout;
}

void opts(char *optstr)
{ uint64_t trials = get_int(optstr+2);
  uint64_t i;
  int err;
  double elapsed_time;
  uint64_t elapsed_ticks;
  if (trials == 0) trials = 1;
  start_timer();
  for (i=0;i<trials;i++)
    { st.initialized = 0;
      if ((err = md6_full_init(&st,d,K,keylen,L,r)))
	printf("MD6 initialization error %d for option -s.\n",err);
    }
  end_timer();
  elapsed_time = end_time - start_time;
  printf("-- Setup trials = %lld\n",(long long int)trials);
  printf("-- Elapsed time = %.3f seconds\n",elapsed_time);
  elapsed_ticks = end_ticks - start_ticks;
  printf("-- Total clock ticks = %lld\n",(long long int)elapsed_ticks);
  printf("-- Clock ticks / setup = %lld\n",(long long int)(elapsed_ticks/trials));
}

void print_hash(char *filename)
{ print_tod();
  if (print_input_output == 0)
    printf("%s %s\n",st.hexhashval,filename);
  else
    printf("Final hash value = %s\n",st.hexhashval);
  print_time(); /* running time */
}



/* main
*/
int main(int argc, char **argv)
{ int i;
  char encfilename[1000];

  /* set default md6 parameter settings */
  d = 256;                
  keylen = 0;
  L = 64;
  r = md6_default_r(d,keylen);
  use_default_r = 1;

  /* Process command line options */
  if ( argc == 1 )
    { hash_stdin();
      print_hash("-");
    }
  for (i=1;i<argc;i++)
    {
      if (strlen(argv[i])==0) continue;
      if (argv[i][0]!='-')
	{ /* argument is filename */
	  hash_file(argv[i]);
	  encode(encfilename,argv[i]);
	  print_hash(encfilename);
	  print_time();
	}
      else
	{
	  if (strlen(argv[i])==1)
	    { hash_stdin();
	      print_hash("-");
	      continue;
	    }
	  switch ( argv[i][1] )
	    { 
	    case 'b': optb(argv[i]); print_hash(argv[i]); break;
	    case 'B': optB(argv[i]); print_hash(argv[i]); break;
	    case 'c': optc(argc,argv,i); i+=1; break;
	    case 'd': optd(argv[i]); printf("-d%d\n",d); break;
	    case 'h': opth(); break;
	    case 'i': opti(); break;
	    case 'I': optI(); break;
	    case 'K': optK(argv[i]); printf("-K%s\n",K); break;
	    case 'L': optL(argv[i]); printf("-L%d\n",L); break;
	    case 'M': optM(argv[i]); print_hash(argv[i]); break;
	    case 'r': optr(argv[i]); printf("-r%d\n",r); break;
	    case 's': opts(argv[i]); break; 
	    case 't': optt(); break;
	    default:  hash_file(argv[i]);
	              encode(encfilename,argv[i]);
		      print_hash(encfilename);
		      print_time();
		      break;
	    }
	}
    }
  return 0;
}
