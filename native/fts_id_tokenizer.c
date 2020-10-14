/*
 * @author Christopher Monsanto <chris@monsan.to>
 * @license MIT
 */

#include <sqlite3ext.h>
SQLITE_EXTENSION_INIT1

#include <stddef.h>
#include <ctype.h>
#include <assert.h>
#include "fts5.h"

static int dummy = 0;

static int id_tokenizer_xCreate(
	void *pCtx,
	const char **azArg,
	int nArg,
	Fts5Tokenizer **ppOut
){
	// Even though it is useless, we must do this or sqlite3 will just silently
	// ignore the tokenizer.
	*ppOut = (Fts5Tokenizer*)&dummy;
	return SQLITE_OK;
}

static void id_tokenizer_xDelete(Fts5Tokenizer *p) {
	assert (p == (Fts5Tokenizer*) &dummy);
}

static int id_tokenizer_xTokenize(
	Fts5Tokenizer *pUnused,
	void *pCtx,
	int flags,
	const char *pText, int nText,
	int (*xToken)(void*, int, const char*, int, int, int)
) {
	// pText is utf8 but we treat it like ascii. Anything multibyte won't pass
	// isalnum and will be filtered out.
	for (int i = 0; i < nText; i++) {
		char c = pText[i];
		if (!isalnum(c))
			continue;
		char lc = tolower(c);
		int rc = xToken(pCtx, 0, &lc, 1, i, i+1);
		if (rc) {
			return rc;
		}
	}
	return SQLITE_OK;
}


//
// Setup code
//

static fts5_api *fts5_api_from_db(sqlite3 *db) {
	fts5_api *pRet = 0;
	sqlite3_stmt *pStmt = 0;

	if (SQLITE_OK == sqlite3_prepare(db, "SELECT fts5(?1)", -1, &pStmt, 0)) {
		sqlite3_bind_pointer(pStmt, 1, (void*)&pRet, "fts5_api_ptr", NULL);
		sqlite3_step(pStmt);
	}
	sqlite3_finalize(pStmt);
	return pRet;
}

static int id_tokenizer_install(sqlite3 *db) {
	fts5_api *pApi;
	fts5_tokenizer tok;
	tok.xCreate = id_tokenizer_xCreate;
	tok.xDelete = id_tokenizer_xDelete;
	tok.xTokenize = id_tokenizer_xTokenize;

	pApi = fts5_api_from_db(db);
	if (pApi == 0) {
		return 0;
	}

	return pApi->xCreateTokenizer(pApi, "id_tokenizer", 0, &tok, 0);
}

#ifdef _WIN32
__declspec(dllexport)
#endif
// Name is derived from the filename, fts_id_tokenizer.c
int sqlite3_ftsidtokenizer_init(
	sqlite3 *db,
	char **pzErrMsg,
	const sqlite3_api_routines *pApi
) {
	SQLITE_EXTENSION_INIT2(pApi);
	return id_tokenizer_install(db);
}
