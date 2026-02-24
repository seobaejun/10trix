@echo off
chcp 65001 >nul
echo ========================================
echo   개발 서버 시작 (포트 8000)
echo ========================================
echo.
cd /d "%~dp0"

where py >nul 2>&1
if %errorlevel% equ 0 (
    echo [Python Launcher] py -m http.server 8000 --bind 127.0.0.1
    echo.
    py -m http.server 8000 --bind 127.0.0.1
    goto :done
)

where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [Python] python -m http.server 8000 --bind 127.0.0.1
    echo.
    python -m http.server 8000 --bind 127.0.0.1
    goto :done
)

echo [오류] Python을 찾을 수 없습니다.
echo.
echo 해결 방법:
echo 1. Python 설치: https://www.python.org/downloads/
echo 2. 설치 시 "Add Python to PATH" 체크 후 재설치
echo 3. 또는 start-server-node.bat 사용 (Node.js 필요)
echo.
:done
pause
