@echo off
cd /d "%~dp0"
set OPEN_BROWSER=1
set "REVIEW_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%REVIEW_NODE%" (
  "%REVIEW_NODE%" "%~dp0serve-review.mjs"
) else (
  node "%~dp0serve-review.mjs"
)
pause
