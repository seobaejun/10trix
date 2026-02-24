@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Node.js를 찾을 수 없습니다.
    echo Node.js 설치: https://nodejs.org/
    pause
    exit /b 1
)

node server.js
pause
