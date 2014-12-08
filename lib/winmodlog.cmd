@echo off
setlocal enableextensions

rem This script needs at least 3 params
IF "%~2"=="" GOTO end
IF "%~3"=="" GOTO end

SET lines=%2
IF "%1"=="tail" GOTO tail
IF "%1"=="ws" GOTO wordsearch

GOTO end

rem ** START OF TAIL SECTION **
:tail
SET file="%~3"
FOR /F "usebackq tokens=3,3 delims= " %%l IN (`find /c /v "" %file%`) DO (call SET linecount=%%l)
SET skiplines=0
IF %linecount% GTR %lines% SET /A skiplines=%linecount%-%lines%
more +%skiplines% %file%
GOTO end
rem ** END OF TAIL SECTION **


rem ** START OF WORDSEARCH SECTION **
:wordsearch
rem In wordsearch mode at least 4 params are needed
IF "%~4"=="" GOTO end

SET search=%3
SET files="%~4"
:wordsearchFilenameLoop
IF "%~4"=="" GOTO diplaylines
SET files=%files% "%~4"
SHIFT /4
GOTO wordsearchFilenameLoop

:diplaylines
for /f "delims=" %%i in ('type %files% 2^>nul ^| find /c /i %search%') do set linecount=%%i
SET skiplines=0
IF %linecount% GTR %lines% SET /A skiplines=%linecount%-%lines%
type %files% 2>nul | find /i %search% | more +%skiplines%
rem ** END OF WORDSEARCH SECTION **

:end
