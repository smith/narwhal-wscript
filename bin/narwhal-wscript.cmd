@echo off
setlocal

:: NARWHAL_ENGINE_HOME is the parent the bin directory
set NARWHAL_ENGINE_HOME=%~dp0..

set BOOTSTRAP=%NARWHAL_ENGINE_HOME%\bootstrap.js

if "%NARWHAL_HOME%" == "" (
	set NARWHAL_HOME=%NARWHAL_ENGINE_HOME%\..\..
)

:: no repl yet
if "%1" == "" (
    echo Please specify a script to run
) else (
    cscript /nologo "%BOOTSTRAP%" %0 %*
)
