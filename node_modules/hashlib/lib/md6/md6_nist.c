/* File:    md6_nist.c
** Author:  Ronald L. Rivest
** Address: Room 32G-692 Stata Center 
**          32 Vassar Street 
**          Cambridge, MA 02139
** Email:   rivest@mit.edu
** Date:    9/25/2008
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
** The files defining the MD6 hash function are:
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
*/

#include <stdio.h>
#include "md6.h"
#include "md6_nist.h"

HashReturn Init( hashState *state, 
		 int hashbitlen
		 )
{ int err;
  if ((err = md6_init( (md6_state *) state, 
		       hashbitlen
		       )))
    return err;
  state->hashbitlen = hashbitlen;
  return SUCCESS;
}

HashReturn Update( hashState *state, 
		   const BitSequence *data, 
		   DataLength databitlen
		   )
{ return md6_update( (md6_state *) state, 
		     (unsigned char *)data, 
		     (uint64_t) databitlen );
}

HashReturn Final( hashState *state,
		  BitSequence *hashval
		  )
{ return md6_final( (md6_state *) state,
		    (unsigned char *) hashval
		    );
}

HashReturn Hash( int hashbitlen,
		 const BitSequence *data,
		 DataLength databitlen,
		 BitSequence *hashval
		 )
{ int err;
  md6_state state;
  if ((err = Init( &state, hashbitlen ))) 
    return err;
  if ((err = Update( &state, data, databitlen ))) 
    return err;
  return Final( &state, hashval );
}


